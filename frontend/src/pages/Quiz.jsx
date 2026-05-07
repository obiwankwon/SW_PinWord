import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './Quiz.css';

const Quiz = () => {
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
        const response = await api.get('/quiz');
        setQuizData(response.data);
      } catch (error) {
        alert('퀴즈를 불러오지 못했습니다.');
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
        const response = await api.post('/quiz/result', { paperId: quizData.paperId, answers: userAnswers });
        setResultMessage(response.data);
        setIsFinished(true);
      } catch (error) {
        alert('채점 중 오류가 발생했습니다.');
      }
    }
  };

  if (!quizData) return <div className="quiz-loading">퀴즈를 준비 중입니다... ⏳</div>;

  if (isFinished) {
    return (
      <div className="quiz-result">
        <h2>🎉 퀴즈 종료!</h2>
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

      <div className="quiz-word">{currentQuestion.englishSpelling}</div>
      <p className="quiz-question-label">이 단어의 올바른 뜻은?</p>

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

export default Quiz;
