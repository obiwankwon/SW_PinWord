import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axiosConfig';
import './Login.css';

const BACKEND_URL = 'http://localhost:8080';

// 콜라주에 쓸 이미지 9장
const COLLAGE_IMAGES = [
  '/default-images/apple.png',
  '/default-images/ambitious.jpg',
  '/default-images/beautiful.png',
  '/default-images/achieve.jpg',
  '/default-images/banana.png',
  '/default-images/challenge.png',
  '/default-images/accomplish.jpg',
  '/default-images/carefully.jpg',
  '/default-images/absolutely.png',
];

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
      localStorage.setItem('userEmail', formData.email);
      const decoded = jwtDecode(token);
      if (decoded.role === 'ROLE_ADMIN') {
        navigate('/admin/words');
      } else {
        navigate('/learning');
      }
    } catch (error) {
      alert('로그인 실패: 이메일이나 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="login-page">

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
        <h1 className="login-tagline">단어 학습의 모든 것을<br />핀워드에서</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input name="email" type="email" placeholder="이메일 주소" onChange={handleChange} required />
          <button type="submit" className="login-btn">계속하기</button>
        </form>

        <div className="login-divider"><span>또는</span></div>

        <form onSubmit={handleSubmit} className="login-form">
          <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
          <button type="submit" className="login-btn-outline">로그인</button>
        </form>

        <div className="login-footer">
          <Link to="/signup">아직 계정이 없으신가요? <strong>회원가입</strong></Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
