export const fetchProfile = async (userId) => {
  const response = await fetch(`/api/profile/${userId}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Ошибка загрузки профиля');
  }
  
  return response.json();
};

export const updateProfile = async (userId, data) => {
  const response = await fetch(`/api/profile/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Ошибка обновления профиля');
  }
  
  return response.json();
};

export const searchUsers = async (query) => {
  const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Ошибка поиска пользователей');
  }
  
  return response.json();
};
