import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      alert('회원가입 성공! 로그인해주세요.');
      navigate('/');
    } catch (error) {
      alert('회원가입 실패: ' + (error.response?.data || '알 수 없는 오류'));
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2 className="signup-title">📝 회원가입</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input name="email" type="email" placeholder="이메일" onChange={handleChange} required />
          <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
          <input name="name" type="text" placeholder="이름" onChange={handleChange} required />
          <button type="submit" className="signup-btn">가입하기</button>
        </form>
        <div className="signup-footer">
          <Link to="/">이미 계정이 있으신가요? 로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
