// src/pages/Learning.jsx
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Learning = () => {
  // 백엔드에서 가져온 단어들을 담아둘 바구니 (초기값은 빈 배열 [])
  const [words, setWords] = useState([]);

  // 💡 useEffect: 화면이 처음 딱! 켜질 때 한 번만 실행되는 마법의 도구
  useEffect(() => {
    const fetchWords = async () => {
      try {
        // 백엔드에 "단어 다 내놔!" 하고 요청
        const response = await api.get('/words');
        setWords(response.data); // 받아온 데이터를 바구니에 담기
      } catch (error) {
        console.error('단어 불러오기 에러:', error);
        alert('단어 목록을 불러오는데 실패했습니다.');
      }
    };

    fetchWords();
  }, []); // 끝에 []가 있어야 무한 반복 안 하고 딱 한 번만 실행돼!

  return (
    <div>
      <h2>📖 단어 리스트 학습</h2>
      <p>총 {words.length}개의 단어가 있습니다.</p>
      
      {/* 단어들을 카드 형태로 예쁘게 나열하기 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {words.map((word) => (
          <div key={word.wordId} style={{ 
            border: '1px solid #ccc', 
            borderRadius: '8px', 
            padding: '15px', 
            backgroundColor: '#f9f9f9',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{word.englishSpelling}</h3>
            <p style={{ margin: '0', fontSize: '16px', color: '#555' }}>
              <strong>뜻:</strong> {word.meaning}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
              <strong>품사:</strong> {word.partOfSpeech || '미상'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learning;