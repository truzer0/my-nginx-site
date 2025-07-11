import { useState } from 'react';
import './Auth.css';
import LoginForm from './LoginForm';
import ADLoginForm from './ADLoginForm';
import DBLoginForm from './DBLoginForm';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [currentView, setCurrentView] = useState('login');
  const [error, setError] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleBackToLogin = () => {
    setCurrentView('login');
    setError({ type: '', message: '' });
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    window.location.href = '/';
  };

  return (
    <div className="auth-container">
      {currentView === 'login' && (
        <LoginForm
          username={username}
          setUsername={setUsername}
          setCurrentView={setCurrentView}
          setError={setError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}

      {currentView === 'ad' && (
        <ADLoginForm
          username={username}
          onBack={handleBackToLogin}
          onSuccess={handleLoginSuccess}
          error={error}
          setError={setError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}

      {currentView === 'db' && (
        <DBLoginForm
          username={username}
          onBack={handleBackToLogin}
          onSuccess={handleLoginSuccess}
          error={error}
          setError={setError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default Auth;
