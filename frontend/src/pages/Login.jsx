import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axiosConfig';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const token = response.data.token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const userRole = decoded.role;

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
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">📚</div>
        <h1 className="login-title">PinWord</h1>
        <p className="login-subtitle">단어 학습의 모든 것</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input name="email" type="email" placeholder="이메일" onChange={handleChange} required />
          <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
          <button type="submit" className="login-btn">로그인</button>
        </form>
        <div className="login-footer">
          <Link to="/signup">아직 계정이 없으신가요? 회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
