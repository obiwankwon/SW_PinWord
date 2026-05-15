import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './ImageLearning.css';

// 💡 서버에 저장된 이미지를 불러오기 위한 기본 주소 (개발 환경 기준)
const BACKEND_URL = 'http://localhost:8080';

const ImageLearning = () => {
  const [words, setWords] = useState([]);
  // 💡 [핵심] 어떤 카드가 뒤집혀 있는지(true/false) 기억하는 상태입니다. { wordId: boolean } 형태
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    const fetchImageWords = async () => {
      try {
        // 백엔드에 새로 만든 '이미지가 있는 단어만 줘!' API를 호출합니다.
        const response = await api.get('/words/images');
        setWords(response.data);
      } catch (error) {
        console.error('단어 불러오기 에러:', error);
        alert('이미지 단어 목록을 불러오는데 실패했습니다.');
      }
    };
    fetchImageWords();
  }, []);

  // 💡 카드 클릭 시 뒤집힘 상태를 토글(반전)시키는 함수
  const handleCardClick = (wordId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [wordId]: !prev[wordId] // 기존 상태가 true면 false로, false면 true로 바꿉니다.
    }));
  };

  return (
    <div className="image-learning-page">
      <h2>🖼️ 핀터레스트 스타일 이미지 학습</h2>
      <p className="learning-count">이미지가 등록된 단어 총 {words.length}개 (카드를 클릭하면 정답이 보입니다!)</p>
      
      {/* 💡 Masonry(벽돌) 레이아웃을 감싸는 컨테이너 */}
      <div className="masonry-grid">
        {words.map((word) => (
          <div 
            key={word.wordId} 
            className="masonry-item"
            onClick={() => handleCardClick(word.wordId)}
          >
            {/* 뒤집힘(flipped) 상태에 따라 클래스 이름이 동적으로 추가됩니다. */}
            <div className={`flip-card-inner ${flippedCards[word.wordId] ? 'flipped' : ''}`}>
              
              {/* [카드 앞면] - 이미지 */}
              <div className="flip-card-front">
                <img 
                  src={`${BACKEND_URL}${word.imagePath}`} 
                  alt={word.englishSpelling} 
                  className="masonry-image"
                />
              </div>

              {/* [카드 뒷면] - 단어와 뜻 */}
              <div className="flip-card-back">
                <div className="back-content">
                  <h3 className="back-english">{word.englishSpelling}</h3>
                  <span className="back-pos">({word.partOfSpeech || '미상'})</span>
                  <p className="back-meaning">{word.meaning}</p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageLearning;