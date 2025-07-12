const API_BASE = 'http://10.100.6.123/api'; // Используем ваши текущие API-маршруты

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE}/login.html`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return await response.json();
};
