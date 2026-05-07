import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './AdminMypage.css';

const AdminMypage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let adminEmail = '알 수 없음';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      adminEmail = decoded.sub;
    } catch (error) {
      console.error('토큰 해독 실패:', error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('관리자 계정에서 안전하게 로그아웃 되었습니다. 👋');
    navigate('/');
  };

  return (
    <div className="admin-mypage">
      <h2 className="admin-mypage-title">👑 관리자 홈</h2>

      <div className="admin-info-card">
        <p className="admin-email"><strong>최고 관리자:</strong> {adminEmail}</p>
        <p className="admin-status">시스템 상태: 정상 작동 중 🟢</p>
        <p className="admin-notice">* 추후 전체 유저 통계 및 시스템 로그 대시보드가 추가될 예정입니다.</p>
      </div>

      <button className="admin-logout-btn" onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default AdminMypage;
