import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Learning from './pages/Learning';
import ImageLearning from './pages/ImageLearning';
import Quiz from './pages/Quiz';
import ImageQuiz from './pages/ImageQuiz'; // 💡 [신규 추가] 이미지 퀴즈 컴포넌트
import Mypage from './pages/Mypage';
import AdminWords from './pages/AdminWords';
import AdminMypage from './pages/AdminMypage';
import './App.css';

const UserLayout = ({ children }) => (
  <div>
    <nav className="user-nav">
      <Link to="/learning">학습하기</Link>
      <Link to="/image-learning">이미지 학습</Link>
      <Link to="/quiz">테스트</Link>
      <Link to="/image-quiz">이미지 테스트</Link> {/* 💡 [신규 추가] */}
      <Link to="/mypage">내 정보</Link>
    </nav>
    <div className="user-layout-content">{children}</div>
  </div>
);

const AdminLayout = ({ children }) => (
  <div>
    <nav className="admin-nav">
      <Link to="/admin/words">단어 관리</Link>
      <Link to="/admin/mypage">관리자 홈</Link>
    </nav>
    <div className="admin-layout-content">{children}</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/learning" element={<UserLayout><Learning /></UserLayout>} />
        <Route path="/image-learning" element={<UserLayout><ImageLearning /></UserLayout>} />
        <Route path="/quiz" element={<UserLayout><Quiz /></UserLayout>} />
        <Route path="/image-quiz" element={<UserLayout><ImageQuiz /></UserLayout>} /> {/* 💡 [신규 라우터] */}
        <Route path="/mypage" element={<UserLayout><Mypage /></UserLayout>} />
        <Route path="/admin/words" element={<AdminLayout><AdminWords /></AdminLayout>} />
        <Route path="/admin/mypage" element={<AdminLayout><AdminMypage /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;