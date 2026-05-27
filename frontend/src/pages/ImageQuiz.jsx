import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './Quiz.css'; // 💡 기존 스타일을 그대로 사용합니다.

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const ImageQuiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // 💡 백엔드의 이미지 퀴즈 전용 API를 호출합니다.
        const response = await api.get('/quiz/image');
        setQuizData(response.data);
      } catch (error) {
        alert('이미지가 부족하거나 퀴즈를 불러오지 못했습니다.');
      }
    };
    fetchQuiz();
  }, []);

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    const currentQuestion = quizData.questions[currentIndex];
    setUserAnswers([...userAnswers, { englishSpelling: currentQuestion.englishSpelling, userAnswer: option }]);
  };

  const handleNext = async () => {
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      try {
        // 💡 백엔드의 이미지 퀴즈 전용 결과 저장 API를 호출합니다.
        const response = await api.post('/quiz/image/result', { paperId: quizData.paperId, answers: userAnswers });
        setResultMessage(response.data);
        setIsFinished(true);
      } catch (error) {
        alert('채점 중 오류가 발생했습니다.');
      }
    }
  };

  if (!quizData) return <div className="quiz-loading">이미지 퀴즈를 준비 중입니다... ⏳</div>;

  if (isFinished) {
    return (
      <div className="quiz-result">
        <h2>🎉 이미지 퀴즈 종료!</h2>
        <div className="quiz-result-score">{resultMessage}</div>
        <button className="quiz-retry-btn" onClick={() => window.location.reload()}>다시 풀기</button>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentIndex];
  const total = quizData.questions.length;
  const progressPct = ((currentIndex) / total) * 100;

  const getOptionClass = (option) => {
    if (!isAnswered) return 'quiz-option-btn';
    const opt = String(option).trim();
    // 💡 이미지 퀴즈에서는 correctAnswer에 영단어 스펠링이 들어있습니다. 로직 수정 없이 그대로 작동!
    const ans = String(currentQuestion.correctAnswer).trim();
    const sel = String(selectedOption).trim();
    
    if (opt === ans) return 'quiz-option-btn correct';
    if (opt === sel) return 'quiz-option-btn wrong';
    return 'quiz-option-btn dimmed';
  };

  return (
    <div className="quiz-page">
      <p className="quiz-progress">문제 {currentIndex + 1} / {total}</p>
      <div className="quiz-progress-bar-wrap">
        <div className="quiz-progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      {/* 💡 [핵심 변경] 단어 텍스트 대신 이미지를 출력합니다 */}
      <div className="quiz-image-container" style={{ textAlign: 'center', margin: '20px 0' }}>
        <img 
          src={`${BACKEND_URL}${currentQuestion.imagePath}`} 
          alt="퀴즈 이미지" 
          style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        />
      </div>
      <p className="quiz-question-label">이 이미지에 맞는 영단어는?</p>

      <div className="quiz-options">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(option)}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
          >
            {index + 1}. {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <button className="quiz-next-btn" onClick={handleNext}>
          {currentIndex === total - 1 ? '🎉 최종 결과 확인하기' : '다음 문제로 넘어가기 ▶'}
        </button>
      )}
    </div>
  );
};

export default ImageQuiz;