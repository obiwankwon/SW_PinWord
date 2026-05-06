// src/pages/AdminMypage.jsx
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminMypage = () => {
  const navigate = useNavigate();

  // 1. 브라우저 금고에서 토큰 꺼내기
  const token = localStorage.getItem('token');
  let adminEmail = '알 수 없음';

  // 2. 관리자 정보(이메일) 읽기
  if (token) {
    try {
      const decoded = jwtDecode(token);
      adminEmail = decoded.sub; 
    } catch (error) {
      console.error('토큰 해독 실패:', error);
    }
  }

  // 3. 관리자 로그아웃 기능
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('관리자 계정에서 안전하게 로그아웃 되었습니다. 👋');
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ borderBottom: '2px solid #c0392b', paddingBottom: '10px', color: '#c0392b' }}>
        👑 관리자 홈
      </h2>
      
      <div style={{ 
        backgroundColor: '#ffe0e0', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <p style={{ fontSize: '18px', margin: '0 0 10px 0', color: '#2c3e50' }}>
          <strong>최고 관리자:</strong> {adminEmail}
        </p>
        <p style={{ color: '#c0392b', margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          시스템 상태: 정상 작동 중 🟢
        </p>
        <p style={{ color: '#7f8c8d', margin: '15px 0 0 0', fontSize: '13px' }}>
          * 추후 전체 유저 통계 및 시스템 로그 대시보드가 추가될 예정입니다.
        </p>
      </div>

      <button 
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#34495e', // 관리자는 좀 더 묵직한 색상으로!
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        로그아웃
      </button>
    </div>
  );
};

export default AdminMypage;