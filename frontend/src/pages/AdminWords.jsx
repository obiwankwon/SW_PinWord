import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './AdminWords.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// PinWord 로고
const PinWordLogo = () => (
  <div className="pinword-header">
    <div className="pinword-logo-icon">P</div>
    <span className="pinword-logo-text">PinWord</span>
  </div>
);

const AdminWords = () => {
  const [words, setWords] = useState([]);

  // 새 단어 추가 상태
  const [newWord, setNewWord] = useState({ englishSpelling: '', meaning: '', partOfSpeech: '명사' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generatedImagePath, setGeneratedImagePath] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 단어 수정 상태
  const [editingId, setEditingId] = useState(null);
  const [editWord, setEditWord] = useState({ englishSpelling: '', meaning: '', partOfSpeech: '명사' });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

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
  const handleEditChange = (e) => setEditWord({ ...editWord, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setGeneratedImagePath(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setEditImagePreview(null);
    }
  };

  // AI 이미지 생성
  const handleGenerateImage = async () => {
    if (!newWord.englishSpelling.trim()) {
      alert('영어 단어를 먼저 입력해주세요.');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await api.post('/admin/words/generate-image', {
        englishWord: newWord.englishSpelling.trim()
      });
      const path = response.data.imagePath;
      setGeneratedImagePath(path);
      setImageFile(null);
      setImagePreview(`${BACKEND_URL}${path}`);
    } catch (error) {
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('word', new Blob([JSON.stringify({
        ...newWord,
        imagePath: generatedImagePath
      })], { type: 'application/json' }));
      if (imageFile) formData.append('image', imageFile);

      await api.post('/admin/words', formData);
      alert('단어가 성공적으로 추가되었습니다!');
      setNewWord({ englishSpelling: '', meaning: '', partOfSpeech: '명사' });
      setImageFile(null);
      setImagePreview(null);
      setGeneratedImagePath(null);
      fetchWords();
    } catch (error) {
      alert('단어 추가 실패: 이미 있는 단어이거나 권한이 없습니다.');
    }
  };

  const handleDeleteWord = async (wordId) => {
    if (window.confirm('정말로 이 단어를 삭제하시겠습니까?')) {
      try {
        await api.delete(`/admin/words/${wordId}`);
        fetchWords();
      } catch (error) {
        alert('삭제 실패: 권한이 없거나 오류가 발생했습니다.');
      }
    }
  };

  const startEditing = (word) => {
    setEditingId(word.wordId);
    setEditWord({
      englishSpelling: word.englishSpelling,
      meaning: word.meaning,
      partOfSpeech: word.partOfSpeech || '명사'
    });
    setEditImagePreview(word.imagePath ? `${BACKEND_URL}${word.imagePath}` : null);
    setEditImageFile(null);
  };

  const handleUpdateWord = async (wordId) => {
    try {
      const formData = new FormData();
      formData.append('word', new Blob([JSON.stringify(editWord)], { type: 'application/json' }));
      if (editImageFile) formData.append('image', editImageFile);
      await api.patch(`/admin/words/${wordId}`, formData);
      alert('수정되었습니다!');
      setEditingId(null);
      fetchWords();
    } catch (error) {
      alert('수정 실패: 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      {/* 로고 */}
      <PinWordLogo />

      {/* 단어 추가 폼 */}
      <div className="add-word-section">
        <h3>새 단어 추가</h3>
        <form onSubmit={handleAddWord} className="add-word-form">
          <input
            name="englishSpelling"
            value={newWord.englishSpelling}
            onChange={handleChange}
            placeholder="영어 단어"
            required
          />
          <input
            name="meaning"
            value={newWord.meaning}
            onChange={handleChange}
            placeholder="한글 뜻"
            required
          />
          <select name="partOfSpeech" value={newWord.partOfSpeech} onChange={handleChange}>
            <option value="명사">명사</option>
            <option value="동사">동사</option>
            <option value="형용사">형용사</option>
            <option value="부사">부사</option>
          </select>

          <div className="image-upload-wrapper">
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="generate-image-btn"
            >
              {isGenerating ? '⏳ 생성 중...' : '✨ AI 이미지 생성'}
            </button>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="미리보기"
                style={{ width: '100%', borderRadius: '16px', objectFit: 'cover' }}
              />
            )}
          </div>

          <button type="submit" className="add-word-btn">추가하기</button>
        </form>
      </div>

      {/* 단어 목록 — Pinterest 2컬럼 그리드 */}
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
                <input type="file" accept="image/*" onChange={handleEditImageChange} />
                {editImagePreview && (
                  <img src={editImagePreview} alt="미리보기" style={{ width: '100%', borderRadius: '10px' }} />
                )}
                <button className="save-btn" onClick={() => handleUpdateWord(word.wordId)}>저장</button>
                <button className="cancel-btn" onClick={() => setEditingId(null)}>취소</button>
              </div>
            ) : (
              <div className="word-item-view">
                {/* 이미지 */}
                {word.imagePath ? (
                  <img
                    className="word-card-image"
                    src={`${BACKEND_URL}${word.imagePath}`}
                    alt={word.englishSpelling}
                  />
                ) : (
                  <div className="word-card-no-image">📖</div>
                )}

                {/* 단어 정보 */}
                <div className="word-item-info">
                  <strong>{word.englishSpelling}</strong>
                  <span>{word.partOfSpeech || '명사'} · {word.meaning}</span>
                </div>

                {/* 버튼 */}
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
