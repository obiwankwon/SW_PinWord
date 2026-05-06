// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axiosConfig';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. 로그인 요청
      const response = await api.post('/auth/login', formData);
      const token = response.data.token; // 백엔드가 준 방문증(토큰)

      // 2. 브라우저 금고에 토큰 저장
      localStorage.setItem('token', token);

      // 3. 토큰 해독해서 권한(Role) 확인
      const decoded = jwtDecode(token);
      const userRole = decoded.role; // 백엔드 JwtUtil에서 넣어준 그 'role'이야!

      // 4. 권한에 따라 다른 페이지로 이동
      if (userRole === 'ROLE_ADMIN') {
        alert('관리자님 환영합니다!');
        navigate('/admin/words');
      } else {
        alert('유저님 환영합니다!');
        navigate('/learning');
      }
      
    } catch (error) {
      alert('로그인 실패: 이메일이나 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>📚 PinWord</h1>
      <h3>단어 학습의 모든 것</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <input name="email" type="email" placeholder="이메일" onChange={handleChange} required />
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
        <button type="submit">로그인</button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <Link to="/signup">회원가입 하러가기</Link>
      </div>
    </div>
  );
};

export default Login;