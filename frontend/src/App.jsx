// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Learning from './pages/Learning';
import Quiz from './pages/Quiz';
import Mypage from './pages/Mypage';
import AdminWords from './pages/AdminWords';
import AdminMypage from './pages/AdminMypage';

// 임시 레이아웃 (나중에 파일로 뺄 예정)
const UserLayout = ({ children }) => (
  <div>
    <nav style={{ background: '#eee', padding: '10px', display: 'flex', gap: '10px' }}>
      <Link to="/learning">학습하기</Link>
      <Link to="/quiz">테스트</Link>
      <Link to="/mypage">내 정보</Link>
    </nav>
    <div style={{ padding: '20px' }}>{children}</div>
  </div>
);

const AdminLayout = ({ children }) => (
  <div>
    <nav style={{ background: '#ffe0e0', padding: '10px', display: 'flex', gap: '10px' }}>
      <Link to="/admin/words">단어 관리</Link>
      <Link to="/admin/mypage">관리자 홈</Link>
    </nav>
    <div style={{ padding: '20px' }}>{children}</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        
        <Route path="/learning" element={<UserLayout><Learning /></UserLayout>} />
        <Route path="/quiz" element={<UserLayout><Quiz /></UserLayout>} />
        <Route path="/mypage" element={<UserLayout><Mypage /></UserLayout>} />

        <Route path="/admin/words" element={<AdminLayout><AdminWords /></AdminLayout>} />
        <Route path="/admin/mypage" element={<AdminLayout><AdminMypage /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;