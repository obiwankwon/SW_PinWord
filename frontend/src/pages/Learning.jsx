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
        console.error('단어 불러오기 에러:', error);
        alert('단어 목록을 불러오는데 실패했습니다.');
      }
    };
    fetchWords();
  }, []);

  return (
    <div className="learning-page">
      <h2>📖 단어 리스트 학습</h2>
      <p className="learning-count">총 {words.length}개의 단어가 있습니다.</p>
      <div className="word-grid">
        {words.map((word) => (
          <div key={word.wordId} className="word-card">
            <div className="word-english">{word.englishSpelling}</div>
            <p className="word-meaning"><strong>뜻:</strong> {word.meaning}</p>
            <span className="word-pos">{word.partOfSpeech || '미상'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learning;
