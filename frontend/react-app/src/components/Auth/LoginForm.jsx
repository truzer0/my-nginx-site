const LoginForm = ({
  username,
  setUsername,
  setCurrentView,
  setError,
  isLoading,
  setIsLoading,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ type: '', message: '' });

    if (!username.trim()) {
      setError({ type: 'login', message: 'Введите имя пользователя' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setCurrentView(data.exists ? 'db' : 'ad');
    } catch (error) {
      console.error('Ошибка при проверке пользователя:', error.message);
      setError({ type: 'login', message: 'Ошибка при проверке пользователя' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="logo">ЦУС</div>
      <h1>Вход в систему</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите ваш логин"
            required
            autoComplete="username"
            autoFocus
          />
          {error.type === 'login' && (
            <div className="error-message visible">{error.message}</div>
          )}
        </div>

        <button type="submit" className={isLoading ? 'loading' : ''}>
          Продолжить
        </button>
      </form>

      <div className="auth-footer">
        Система авторизации отдела ЦУС
      </div>
    </div>
  );
};

export default LoginForm;
