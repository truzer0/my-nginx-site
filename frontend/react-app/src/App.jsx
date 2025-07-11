import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Auth from './components/Auth/Auth';
import Profile from './components/Profile/Profile';
import MainPage from './components/MainPage/MainPage';
import JiraReport from './components/jira/JiraReport';
import Navbar from './components/Navbar/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar />}
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<MainPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/jira-report" element={<JiraReport />} />
              <Route
                path="/logout"
                element={
                  <Logout onLogout={() => setIsAuthenticated(false)} />
                }
              />
            </>
          ) : (
            <Route path="*" element={<Auth onLogin={() => setIsAuthenticated(true)} />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

// Простой компонент для выхода
function Logout({ onLogout }) {
  React.useEffect(() => {
    localStorage.removeItem('token');
    onLogout();
    window.location.href = '/';
  }, [onLogout]);

  return null;
}

export default App;
