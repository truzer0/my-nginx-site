import { useState } from 'react';
import { motion } from 'framer-motion';

export const LoginForm = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Введите имя пользователя');
      return;
    }
    
    try {
      const response = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      onSuccess(username, data.exists);
    } catch (err) {
      setError('Ошибка соединения');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Имя пользователя</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-4 py-3 text-white"
            autoFocus
          />
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
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
          Продолжить
        </button>
      </form>
    </>
  );
};
