// src/pages/Quiz.jsx
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  // 💡 즉각 피드백을 위한 필수 상태
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

  // 보기를 클릭했을 때 실행
  const handleOptionClick = (option) => {
    if (isAnswered) return; // 이미 답을 골랐다면 추가 클릭 막기

    setSelectedOption(option);
    setIsAnswered(true);

    // 제출용 답안지 기록
    const currentQuestion = quizData.questions[currentIndex];
    const newAnswer = {
      englishSpelling: currentQuestion.englishSpelling,
      userAnswer: option
    };
    setUserAnswers([...userAnswers, newAnswer]);
  };

  // [다음 문제] 버튼 클릭 시 실행
  const handleNext = async () => {
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswered(false); // 상태 초기화
      setSelectedOption(null);
    } else {
      // 마지막 문제 제출
      try {
        const response = await api.post('/quiz/result', {
          paperId: quizData.paperId,
          answers: userAnswers
        });
        setResultMessage(response.data);
        setIsFinished(true);
      } catch (error) {
        alert('채점 중 오류가 발생했습니다.');
      }
    }
  };

  if (!quizData) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '18px' }}>퀴즈를 준비 중입니다... ⏳</div>;
  if (isFinished) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', border: '2px solid #ddd', padding: '30px', maxWidth: '400px', margin: '50px auto', borderRadius: '12px' }}>
        <h2>🎉 퀴즈 종료!</h2>
        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#27ae60', margin: '20px 0' }}>{resultMessage}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>다시 풀기</button>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentIndex];

  // 💡 버튼의 기본 스타일 (변하지 않는 부분)
  const baseButtonStyle = {
    padding: '18px',
    fontSize: '19px',
    borderRadius: '10px',
    border: '2px solid #eee',
    backgroundColor: '#fff',
    color: '#333',
    fontWeight: 'bold',
    transition: 'all 0.2s',
    textAlign: 'left',
    width: '100%',
    cursor: isAnswered ? 'default' : 'pointer'
  };

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'center', padding: '20px' }}>
      <h3 style={{ color: '#aaa', marginBottom: '10px' }}>문제 {currentIndex + 1} / {quizData.questions.length}</h3>
      
      <div style={{ margin: '20px 0 40px 0' }}>
        <h1 style={{ fontSize: '56px', color: '#2c3e50', margin: 0 }}>{currentQuestion.englishSpelling}</h1>
        <p style={{ color: '#7f8c8d', marginTop: '10px' }}>이 단어의 올바른 뜻은?</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
        {currentQuestion.options.map((option, index) => {
          
          // 💡 [무적의 피드백 로직] 루프 안에서 직접 계산해서 스타일을 주입합니다.
          let finalStyle = { ...baseButtonStyle };

          if (isAnswered) {
            // 비교할 때 공백을 제거하고 문자열로 강제 변환 (가장 확실한 방법)
            const opt = String(option).trim();
            const ans = String(currentQuestion.correctAnswer).trim();
            const sel = String(selectedOption).trim();

            const isCorrect = (opt === ans); // 현재 버튼이 정답인가?
            const isSelected = (opt === sel); // 현재 버튼이 내가 누른 것인가?

            if (isCorrect) {
              // 1. 정답이면 무조건 초록색! (내가 오답을 골랐어도 정답을 표시)
              finalStyle.backgroundColor = '#2ecc71';
              finalStyle.color = '#fff';
              finalStyle.border = '2px solid #27ae60';
            } else if (isSelected && !isCorrect) {
              // 2. 내가 골랐는데 정답이 아니면 빨간색!
              finalStyle.backgroundColor = '#e74c3c';
              finalStyle.color = '#fff';
              finalStyle.border = '2px solid #c0392b';
            } else {
              // 3. 나머지는 흐리게
              finalStyle.opacity = 0.4;
            }
          }

          return (
            <button 
              key={index} 
              onClick={() => handleOptionClick(option)}
              style={finalStyle}
            >
              {index + 1}. {option}
            </button>
          );
        })}
      </div>

      {/* 답을 골랐을 때만 나타나는 다음 버튼 */}
      {isAnswered && (
        <button 
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {currentIndex === quizData.questions.length - 1 ? '🎉 최종 결과 확인하기' : '다음 문제로 넘어가기 ▶'}
        </button>
      )}
    </div>
  );
};

export default Quiz;