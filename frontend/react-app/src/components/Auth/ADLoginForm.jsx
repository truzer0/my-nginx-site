import { useState } from 'react';
import { motion } from 'framer-motion';

export const ADLoginForm = ({ username, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/ad-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (data.firstLogin) {
        onSuccess(username, true);
      } else {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      }
    } catch (err) {
      setError('Неверные учетные данные');
      setPassword('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <p className="text-gray-300">Вход для <span className="font-medium">{username}</span></p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Пароль AD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-3 text-white"
            required
          />
          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mt-1"
            >
              {error}
            </motion.p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition"
        >
          Войти
        </button>
      </form>
    </motion.div>
  );
};
