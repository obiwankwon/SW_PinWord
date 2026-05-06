// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Signup = () => {
  const navigate = useNavigate();
  // 사용자가 입력할 3가지 정보 보관함
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  // 글씨를 칠 때마다 보관함 업데이트
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 회원가입 버튼 눌렀을 때 실행
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 백엔드로 데이터 전송!
      await api.post('/auth/signup', formData);
      alert('회원가입 성공! 로그인해주세요.');
      navigate('/'); // 성공하면 로그인 화면으로 쫓아냄(?)
    } catch (error) {
      alert('회원가입 실패: ' + (error.response?.data || '알 수 없는 오류'));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>📝 회원가입</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="email" type="email" placeholder="이메일 (test@test.com)" onChange={handleChange} required />
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
        <input name="name" type="text" placeholder="이름 (홍길동)" onChange={handleChange} required />
        <button type="submit">가입하기</button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <Link to="/">이미 계정이 있으신가요? 로그인</Link>
      </div>
    </div>
  );
};

export default Signup;