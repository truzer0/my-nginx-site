import { useState } from 'react';

const DBLoginForm = ({
  username,
  onBack,
  onSuccess,
  error,
  setError,
  isLoading,
  setIsLoading,
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ type: '', message: '' });

    if (!password) {
      setError({ type: 'db', message: 'Введите пароль' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/login-with-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      onSuccess(data.token);
    } catch (error) {
      console.error('Ошибка при аутентификации по паролю:', error.message);
      setError({ type: 'db', message: 'Неверный пароль' });
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="back-link" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Назад
      </div>

      <h1>Вход с паролем</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="dbPassword">Пароль</label>
          <input
            type="password"
            id="dbPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите ваш пароль"
            required
            autoComplete="current-password"
            autoFocus
          />
          {error.type === 'db' && (
            <div className="error-message visible">{error.message}</div>
          )}
        </div>

        <button type="submit" className={isLoading ? 'loading' : ''}>
          Войти
        </button>
      </form>
    </div>
  );
};

export default DBLoginForm;
