import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './ImageLearning.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const ImageLearning = () => {
  const [words, setWords] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    const fetchImageWords = async () => {
      try {
        const response = await api.get('/words/images');
        setWords(response.data);
      } catch (error) {
        alert('이미지 단어 목록을 불러오는데 실패했습니다.');
      }
    };
    fetchImageWords();
  }, []);

  const handleCardClick = (wordId) => {
    setFlippedCards((prev) => ({ ...prev, [wordId]: !prev[wordId] }));
  };

  return (
    <div className="image-learning-page">
      <p className="il-subtitle">카드를 클릭하면 단어와 뜻이 보입니다 ✨</p>
      <p className="il-count">단어 총 {words.length}개</p>

      <div className="masonry-grid">
        {words.map((word) => (
          <div
            key={word.wordId}
            className="masonry-item"
            onClick={() => handleCardClick(word.wordId)}
          >
            <div className={`flip-card-inner ${flippedCards[word.wordId] ? 'flipped' : ''}`}>

              {/* 앞면 — 이미지 */}
              <div className="flip-card-front">
                <img
                  src={`${BACKEND_URL}${word.imagePath}`}
                  alt={word.englishSpelling}
                  className="masonry-image"
                />
              </div>

              {/* 뒷면 — 단어 + 뜻 */}
              <div className="flip-card-back">
                <div className="back-content">
                  <span className="back-pos">{word.partOfSpeech || '명사'}</span>
                  <h3 className="back-english">{word.englishSpelling}</h3>
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
