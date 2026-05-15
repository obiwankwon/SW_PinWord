import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './AdminWords.css';

// 💡 [신규 추가] 백엔드 서버 주소 (이미지를 가져올 때 사용합니다)
// 로컬 개발 환경(Spring Boot 기본 포트)에 맞게 설정했습니다. 배포 시에는 실제 도메인으로 변경해야 합니다.
const BACKEND_URL = 'http://localhost:8080';

const AdminWords = () => {
  const [words, setWords] = useState([]);
  
  // =========================================================================
  // [새 단어 추가용 상태값들]
  // =========================================================================
  const [newWord, setNewWord] = useState({ englishSpelling: '', meaning: '', partOfSpeech: '명사' });
  // 💡 [신규 추가] 업로드할 실제 이미지 파일 데이터와, 화면에 보여줄 미리보기 주소
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // =========================================================================
  // [단어 수정용 상태값들]
  // =========================================================================
  const [editingId, setEditingId] = useState(null);
  const [editWord, setEditWord] = useState({ englishSpelling: '', meaning: '', partOfSpeech: '명사' });
  // 💡 [신규 추가] 수정할 때 새로 올릴 이미지 파일과 미리보기
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // 단어 목록 불러오기
  const fetchWords = async () => {
    try {
      const response = await api.get('/words');
      setWords(response.data);
    } catch (error) {
      alert('단어 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => { fetchWords(); }, []);

  // 텍스트 입력값 변경 핸들러
  const handleChange = (e) => setNewWord({ ...newWord, [e.target.name]: e.target.value });
  const handleEditChange = (e) => setEditWord({ ...editWord, [e.target.name]: e.target.value });

  // 💡 [신규 추가] 새 단어 추가 시 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // 실제 파일 데이터 저장
    
    // 파일을 읽어서 브라우저 화면에 미리보기로 띄워줍니다.
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // 💡 [신규 추가] 단어 수정 시 이미지 선택 핸들러
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

  /**
   * 💡 [핵심 변경] 새 단어 추가 함수
   * 기존에는 JSON 텍스트만 보냈지만, 이제 파일과 텍스트를 함께 보내기 위해 'FormData'를 사용합니다.
   */
  const handleAddWord = async (e) => {
    e.preventDefault();
    try {
      // 1. 택배 상자(FormData)를 만듭니다.
      const formData = new FormData();
      
      // 2. 텍스트 데이터(word)를 JSON 형태로 포장해서 상자에 넣습니다.
      // (Spring Boot의 @RequestPart("word")가 이 데이터를 받아갑니다.)
      formData.append('word', new Blob([JSON.stringify(newWord)], {
        type: 'application/json'
      }));

      // 3. 첨부한 이미지가 있다면 상자에 같이 넣습니다.
      // (Spring Boot의 @RequestPart("image")가 이 데이터를 받아갑니다.)
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // 4. axios가 FormData를 감지하고 자동으로 multipart/form-data 방식으로 서버에 전송합니다!
      await api.post('/admin/words', formData);
      
      alert('단어가 성공적으로 추가되었습니다!');
      
      // 5. 입력창 초기화
      setNewWord({ englishSpelling: '', meaning: '', partOfSpeech: '명사' });
      setImageFile(null);
      setImagePreview(null);
      
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

  // 💡 [기능 보강] 수정 버튼을 눌렀을 때, 기존에 등록된 이미지가 있다면 미리보기에 띄워줍니다.
  const startEditing = (word) => {
    setEditingId(word.wordId);
    setEditWord({ 
      englishSpelling: word.englishSpelling, 
      meaning: word.meaning, 
      partOfSpeech: word.partOfSpeech || '명사' 
    });
    
    // 기존 이미지가 있다면 서버 주소를 붙여서 미리보기 세팅
    if (word.imagePath) {
      setEditImagePreview(`${BACKEND_URL}${word.imagePath}`);
    } else {
      setEditImagePreview(null);
    }
    setEditImageFile(null); // 새로 올릴 파일은 비워둠
  };

  /**
   * 💡 [핵심 변경] 단어 수정 함수
   * 수정할 때도 추가할 때와 마찬가지로 FormData를 사용합니다.
   */
  const handleUpdateWord = async (wordId) => {
    try {
      const formData = new FormData();
      formData.append('word', new Blob([JSON.stringify(editWord)], {
        type: 'application/json'
      }));

      // 새로 선택한 이미지가 있을 때만 상자에 담아 보냅니다.
      if (editImageFile) {
        formData.append('image', editImageFile);
      }

      // PATCH 방식으로 수정 요청 전송
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
          
          {/* 💡 [신규 추가] 파일 선택 입력창과 미리보기 영역 */}
          <div className="image-upload-wrapper">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img src={imagePreview} alt="미리보기" style={{ maxWidth: '150px', borderRadius: '8px' }} />
              </div>
            )}
          </div>

          <button type="submit" className="add-word-btn">추가</button>
        </form>
      </div>

      <div className="word-list">
        {words.map((word) => (
          <div key={word.wordId} className="word-item">
            {editingId === word.wordId ? (
              // 💡 [수정 모드 화면]
              <div className="word-item-edit">
                <input name="englishSpelling" value={editWord.englishSpelling} onChange={handleEditChange} />
                <input name="meaning" value={editWord.meaning} onChange={handleEditChange} />
                <select name="partOfSpeech" value={editWord.partOfSpeech} onChange={handleEditChange}>
                  <option value="명사">명사</option>
                  <option value="동사">동사</option>
                  <option value="형용사">형용사</option>
                  <option value="부사">부사</option>
                </select>
                
                {/* 💡 [신규 추가] 수정 시 파일 선택 창 및 미리보기 */}
                <div className="image-edit-wrapper" style={{ margin: '10px 0' }}>
                  <input type="file" accept="image/*" onChange={handleEditImageChange} />
                  {editImagePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={editImagePreview} alt="미리보기" style={{ maxWidth: '100px', borderRadius: '4px' }} />
                    </div>
                  )}
                </div>

                <button className="save-btn" onClick={() => handleUpdateWord(word.wordId)}>저장</button>
                <button className="cancel-btn" onClick={() => setEditingId(null)}>취소</button>
              </div>
            ) : (
              // 💡 [일반 조회 화면]
              <div className="word-item-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="word-item-info" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  
                  {/* 💡 [신규 추가] 등록된 이미지가 있으면 보여주고, 없으면 빈 공간 처리 */}
                  {word.imagePath ? (
                    <img 
                      src={`${BACKEND_URL}${word.imagePath}`} 
                      alt={word.englishSpelling} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>
                      No Img
                    </div>
                  )}

                  <div>
                    <strong>{word.englishSpelling}</strong>
                    <span> ({word.partOfSpeech || '명사'}) {word.meaning}</span>
                  </div>
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