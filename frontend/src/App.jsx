import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Learning from './pages/Learning';
import ImageLearning from './pages/ImageLearning';
import Quiz from './pages/Quiz';
import ImageQuiz from './pages/ImageQuiz';
import Mypage from './pages/Mypage';
import AdminWords from './pages/AdminWords';
import AdminMypage from './pages/AdminMypage';
import './App.css';

const UserLayout = ({ children }) => (
  <div className="layout-root">
    <nav className="user-nav">
      <div className="nav-logo">
        <span className="nav-logo-circle">P</span>
        <span className="nav-logo-text">PinWord</span>
      </div>
      <div className="nav-links">
        <NavLink to="/learning"        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>학습하기</NavLink>
        <NavLink to="/image-learning"  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>이미지 학습</NavLink>
        <NavLink to="/quiz"            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>테스트</NavLink>
        <NavLink to="/image-quiz"      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>이미지 테스트</NavLink>
        <NavLink to="/mypage"          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>내 정보</NavLink>
      </div>
    </nav>
    <div className="layout-content">{children}</div>
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="layout-root">
    <nav className="admin-nav">
      <div className="nav-logo">
        <span className="nav-logo-circle">P</span>
        <span className="nav-logo-text">PinWord</span>
        <span className="nav-admin-badge">ADMIN</span>
      </div>
      <div className="nav-links">
        <NavLink to="/admin/words"   className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>단어 관리</NavLink>
        <NavLink to="/admin/mypage"  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>관리자 홈</NavLink>
      </div>
    </nav>
    <div className="layout-content">{children}</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Login />} />
        <Route path="/signup"        element={<Signup />} />
        <Route path="/learning"      element={<UserLayout><Learning /></UserLayout>} />
        <Route path="/image-learning"element={<UserLayout><ImageLearning /></UserLayout>} />
        <Route path="/quiz"          element={<UserLayout><Quiz /></UserLayout>} />
        <Route path="/image-quiz"    element={<UserLayout><ImageQuiz /></UserLayout>} />
        <Route path="/mypage"        element={<UserLayout><Mypage /></UserLayout>} />
        <Route path="/admin/words"   element={<AdminLayout><AdminWords /></AdminLayout>} />
        <Route path="/admin/mypage"  element={<AdminLayout><AdminMypage /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
