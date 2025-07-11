import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthPage, ProfilePage } from './pages';
import { Avatar, GlassCard, GradientBg } from './components/UI';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Добавьте другие маршруты по аналогии */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
