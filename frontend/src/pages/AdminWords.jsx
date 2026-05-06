// src/pages/AdminWords.jsx
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AdminWords = () => {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState({ englishSpelling: '', meaning: '', partOfSpeech: '명사' });

  // 💡 수정 모드를 위한 2가지 핵심 상태 추가!
  const [editingId, setEditingId] = useState(null); // 현재 수정 중인 단어의 ID 기억하기
  const [editWord, setEditWord] = useState({ englishSpelling: '', meaning: '', partOfSpeech: '명사' }); // 수정 폼에 입력 중인 내용 기억하기

  // 1. 단어 목록 가져오기 (Read)
  const fetchWords = async () => {
    try {
      const response = await api.get('/words');
      setWords(response.data);
    } catch (error) {
      alert('단어 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleChange = (e) => {
    setNewWord({ ...newWord, [e.target.name]: e.target.value });
  };

  // 2. 단어 추가하기 (Create)
  const handleAddWord = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/words', newWord);
      alert('단어가 성공적으로 추가되었습니다!');
      setNewWord({ englishSpelling: '', meaning: '', partOfSpeech: '명사' });
      fetchWords();
    } catch (error) {
      alert('단어 추가 실패: 이미 있는 단어이거나 권한이 없습니다.');
    }
  };

  // 3. 단어 삭제하기 (Delete)
  const handleDeleteWord = async (wordId) => {
    if (window.confirm('정말로 이 단어를 삭제하시겠습니까?')) {
      try {
        await api.delete(`/admin/words/${wordId}`);
        alert('삭제되었습니다.');
        fetchWords();
      } catch (error) {
        alert('삭제 실패: 권한이 없거나 오류가 발생했습니다.');
      }
    }
  };

  // 💡 4. 수정 모드 켜기 (버튼 클릭 시)
  const startEditing = (word) => {
    setEditingId(word.wordId); // "나 지금 이 단어 수정할 거야!" 라고 기록
    setEditWord({ 
      englishSpelling: word.englishSpelling, 
      meaning: word.meaning, 
      partOfSpeech: word.partOfSpeech || '명사' 
    }); // 기존 단어 데이터를 입력칸에 채워놓기
  };

  // 💡 5. 수정 입력칸에 글씨를 칠 때 작동
  const handleEditChange = (e) => {
    setEditWord({ ...editWord, [e.target.name]: e.target.value });
  };

  // 💡 6. 단어 수정 완료(저장) 요청 (Update)
  const handleUpdateWord = async (wordId) => {
    try {
      await api.patch(`/admin/words/${wordId}`, editWord); // PATCH 메서드로 수정된 데이터 전송
      alert('수정되었습니다!');
      setEditingId(null); // 수정 모드 끄기 (원래 화면으로 복귀)
      fetchWords(); // 목록 다시 불러오기
    } catch (error) {
      alert('수정 실패: 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2 style={{ color: '#c0392b' }}>🛠️ 관리자: 단어 관리 (CRUD)</h2>
      
      {/* 단어 추가 폼 */}
      <div style={{ background: '#ffe0e0', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>✨ 새 단어 추가</h3>
        <form onSubmit={handleAddWord} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input name="englishSpelling" value={newWord.englishSpelling} onChange={handleChange} placeholder="영어 단어" required />
          <input name="meaning" value={newWord.meaning} onChange={handleChange} placeholder="한글 뜻" required />
          <select name="partOfSpeech" value={newWord.partOfSpeech} onChange={handleChange}>
            <option value="명사">명사</option>
            <option value="동사">동사</option>
            <option value="형용사">형용사</option>
            <option value="부사">부사</option>
          </select>
          <button type="submit" style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            추가
          </button>
        </form>
      </div>

      {/* 단어 목록 리스트 */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {words.map((word) => (
          <div key={word.wordId} style={{ background: '#f9f9f9', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            
            {/* 💡 조건부 렌더링: 수정 중인 단어라면 입력 폼을 보여주고, 아니라면 그냥 텍스트를 보여줌 */}
            {editingId === word.wordId ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input name="englishSpelling" value={editWord.englishSpelling} onChange={handleEditChange} style={{ flex: 1 }} />
                <input name="meaning" value={editWord.meaning} onChange={handleEditChange} style={{ flex: 1 }} />
                <select name="partOfSpeech" value={editWord.partOfSpeech} onChange={handleEditChange}>
                  <option value="명사">명사</option>
                  <option value="동사">동사</option>
                  <option value="형용사">형용사</option>
                  <option value="부사">부사</option>
                </select>
                <div style={{ marginLeft: 'auto' }}>
                  <button onClick={() => handleUpdateWord(word.wordId)} style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>저장</button>
                  <button onClick={() => setEditingId(null)} style={{ background: '#95a5a6', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>취소</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '18px', marginRight: '10px' }}>{word.englishSpelling}</strong> 
                  <span style={{ color: '#555' }}>({word.partOfSpeech || '명사'}) {word.meaning}</span>
                </div>
                <div>
                  <button 
                    onClick={() => startEditing(word)}
                    style={{ background: '#f39c12', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => handleDeleteWord(word.wordId)}
                    style={{ background: '#7f8c8d', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWords;