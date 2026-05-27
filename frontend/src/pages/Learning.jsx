import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './Learning.css';

const Learning = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await api.get('/words');
        setWords(response.data);
      } catch (error) {
        alert('단어 목록을 불러오는데 실패했습니다.');
      }
    };
    fetchWords();
  }, []);

  return (
    <div className="learning-page">
      <div className="il-header">
        <div className="pinword-logo-circle">P</div>
        <span className="pinword-logo-text">PinWord</span>
      </div>
      <p className="il-subtitle">오늘의 단어를 학습하세요 📖</p>
      <p className="il-count">총 {words.length}개의 단어</p>

      <div className="word-list-grid">
        {words.map((word) => (
          <div key={word.wordId} className="word-card">
            <div className="word-card-body">
              <strong className="word-english">{word.englishSpelling}</strong>
              <span className="word-pos">{word.partOfSpeech || '명사'}</span>
              <p className="word-meaning">{word.meaning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learning;
