import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Signup.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const COLLAGE_IMAGES = [
  '/default-images/achievement.jpg',
  '/default-images/analyze.jpg',
  '/default-images/challenge.png',
  '/default-images/colllaborate.jpg',
  '/default-images/beautiful.png',
  '/default-images/accomplish.jpg',
  '/default-images/ambitious.jpg',
  '/default-images/carefully.jpg',
  '/default-images/absolutely.png',
];

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

      {/* 상단 이미지 콜라주 */}
      <div className="login-collage">
        {[0, 1, 2].map((col) => (
          <div key={col} className={`collage-col collage-col-${col}`}>
            {COLLAGE_IMAGES.slice(col * 3, col * 3 + 3).map((src, i) => (
              <img
                key={i}
                src={`${BACKEND_URL}${src}`}
                alt=""
                className="collage-img"
              />
            ))}
          </div>
        ))}
        <div className="collage-gradient" />
      </div>

      {/* 로고 + 폼 */}
      <div className="login-content">
        <div className="pinword-logo-wrap">
          <div className="pinword-logo-circle">P</div>
        </div>
        <h1 className="login-tagline">PinWord에<br />가입하세요</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input name="name" type="text" placeholder="이름" onChange={handleChange} required />
          <input name="email" type="email" placeholder="이메일 주소" onChange={handleChange} required />
          <input name="password" type="password" placeholder="비밀번호 (6자 이상)" onChange={handleChange} required />
          <button type="submit" className="login-btn">가입하기</button>
        </form>

        <div className="login-footer">
          <Link to="/">이미 계정이 있으신가요? <strong>로그인</strong></Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
