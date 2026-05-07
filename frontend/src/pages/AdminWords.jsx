import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './AdminWords.css';

const AdminWords = () => {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState({ englishSpelling: '', meaning: '', partOfSpeech: '명사' });
  const [editingId, setEditingId] = useState(null);
  const [editWord, setEditWord] = useState({ englishSpelling: '', meaning: '', partOfSpeech: '명사' });

  const fetchWords = async () => {
    try {
      const response = await api.get('/words');
      setWords(response.data);
    } catch (error) {
      alert('단어 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => { fetchWords(); }, []);

  const handleChange = (e) => setNewWord({ ...newWord, [e.target.name]: e.target.value });

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

  const startEditing = (word) => {
    setEditingId(word.wordId);
    setEditWord({ englishSpelling: word.englishSpelling, meaning: word.meaning, partOfSpeech: word.partOfSpeech || '명사' });
  };

  const handleEditChange = (e) => setEditWord({ ...editWord, [e.target.name]: e.target.value });

  const handleUpdateWord = async (wordId) => {
    try {
      await api.patch(`/admin/words/${wordId}`, editWord);
      alert('수정되었습니다!');
      setEditingId(null);
      fetchWords();
    } catch (error) {
      alert('수정 실패: 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2 className="admin-words-title">🛠️ 관리자: 단어 관리 (CRUD)</h2>

      <div className="add-word-section">
        <h3>✨ 새 단어 추가</h3>
        <form onSubmit={handleAddWord} className="add-word-form">
          <input name="englishSpelling" value={newWord.englishSpelling} onChange={handleChange} placeholder="영어 단어" required />
          <input name="meaning" value={newWord.meaning} onChange={handleChange} placeholder="한글 뜻" required />
          <select name="partOfSpeech" value={newWord.partOfSpeech} onChange={handleChange}>
            <option value="명사">명사</option>
            <option value="동사">동사</option>
            <option value="형용사">형용사</option>
            <option value="부사">부사</option>
          </select>
          <button type="submit" className="add-word-btn">추가</button>
        </form>
      </div>

      <div className="word-list">
        {words.map((word) => (
          <div key={word.wordId} className="word-item">
            {editingId === word.wordId ? (
              <div className="word-item-edit">
                <input name="englishSpelling" value={editWord.englishSpelling} onChange={handleEditChange} />
                <input name="meaning" value={editWord.meaning} onChange={handleEditChange} />
                <select name="partOfSpeech" value={editWord.partOfSpeech} onChange={handleEditChange}>
                  <option value="명사">명사</option>
                  <option value="동사">동사</option>
                  <option value="형용사">형용사</option>
                  <option value="부사">부사</option>
                </select>
                <button className="save-btn" onClick={() => handleUpdateWord(word.wordId)}>저장</button>
                <button className="cancel-btn" onClick={() => setEditingId(null)}>취소</button>
              </div>
            ) : (
              <div className="word-item-view">
                <div className="word-item-info">
                  <strong>{word.englishSpelling}</strong>
                  <span>({word.partOfSpeech || '명사'}) {word.meaning}</span>
                </div>
                <div className="word-item-actions">
                  <button className="edit-btn" onClick={() => startEditing(word)}>수정</button>
                  <button className="delete-btn" onClick={() => handleDeleteWord(word.wordId)}>삭제</button>
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
