// src/pages/Mypage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axiosConfig';

const Mypage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('알 수 없음');
  const [stats, setStats] = useState(null); // 백엔드에서 받아올 통계 데이터

  useEffect(() => {
    // 1. 토큰에서 이메일 꺼내기
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.sub);
      } catch (error) {
        console.error('토큰 해독 실패:', error);
      }
    }

    // 2. 백엔드에서 통계 데이터 가져오기
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #3498db', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>👤 내 정보 및 학습 통계</h2>
        <button onClick={handleLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          로그아웃
        </button>
      </div>
      
      <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
        환영합니다, <strong>{userEmail}</strong> 님!
      </p>

      {/* 통계 데이터가 없을 때 로딩 화면 */}
      {!stats ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>데이터를 불러오는 중... ⏳</div>
      ) : (
        <>
          {/* 상단: 요약 카드 2개 (누적 학습량, 평균 정답률) */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '16px' }}>📚 누적 퀴즈 횟수</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50' }}>{stats.totalQuizzes} <span style={{ fontSize:'16px', color:'#95a5a6' }}>회</span></div>
            </div>
            <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '16px' }}>🎯 평균 점수</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>{stats.averageScore} <span style={{ fontSize:'16px', color:'#95a5a6' }}>점</span></div>
            </div>
          </div>

          {/* 하단: 최근 학습 추이 꺾은선 차트 */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>📈 최근 학습 추이 (최근 5회)</h3>
            {stats.recentScores.length > 0 ? (
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer>
                  <LineChart data={stats.recentScores}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3498db" strokeWidth={3} dot={{ r: 5, fill: '#3498db' }} activeDot={{ r: 8 }} name="점수" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                아직 퀴즈 기록이 없습니다. 테스트를 진행해보세요!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Mypage;