import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axiosConfig';
import './Mypage.css';

const Mypage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('알 수 없음');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.sub);
      } catch (error) {
        console.error('토큰 해독 실패:', error);
      }
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/quiz/stats');
        setStats(response.data);
      } catch (error) {
        console.error('통계 불러오기 실패:', error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('안전하게 로그아웃 되었습니다. 👋');
    navigate('/');
  };

  return (
    <div className="mypage">
      <div className="mypage-header">
        <h2>👤 내 정보 및 학습 통계</h2>
        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
      </div>

      <p className="mypage-greeting">환영합니다, <strong>{userEmail}</strong> 님!</p>

      {!stats ? (
        <div className="mypage-loading">데이터를 불러오는 중... ⏳</div>
      ) : (
        <>
          <div className="stat-cards">
            <div className="stat-card">
              <h3>📚 누적 퀴즈 횟수</h3>
              <div className="stat-value">{stats.totalQuizzes}<span className="stat-unit">회</span></div>
            </div>
            <div className="stat-card">
              <h3>🎯 평균 점수</h3>
              <div className="stat-value green">{stats.averageScore}<span className="stat-unit">점</span></div>
            </div>
          </div>

          <div className="chart-card">
            <h3>📈 최근 학습 추이 (최근 5회)</h3>
            {stats.recentScores.length > 0 ? (
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer>
                  <LineChart data={stats.recentScores}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#e60023" strokeWidth={3} dot={{ r: 5, fill: '#e60023' }} activeDot={{ r: 8, fill: '#c0001d' }} name="점수" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="chart-empty">아직 퀴즈 기록이 없습니다. 테스트를 진행해보세요!</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Mypage;
