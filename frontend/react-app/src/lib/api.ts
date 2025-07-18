const API_URL = '/api'

interface Link {
  id: number
  url: string
  button_text?: string
}

// Экспортируем интерфейс
export interface Resource extends Link {
  title: string
  description: string
  category: string
  is_favorite: boolean
  last_accessed: string | null
}

export async function getLinks(): Promise<Resource[]> {
  const response = await fetch(`${API_URL}/links`)
  if (!response.ok) throw new Error('Ошибка загрузки ссылок')
  
  const links: Link[] = await response.json()
  
  // Преобразуем Link в Resource с значениями по умолчанию
  return links.map(link => ({
    ...link,
    title: link.button_text || 'Новый ресурс',
    description: '',
    category: 'Общее',
    is_favorite: false,
    last_accessed: null
  }))
}

// Остальные функции остаются без изменений
export async function getCurrentUser() {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Токен не найден')

  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) throw new Error('Ошибка получения данных')
  return response.json()
}

export async function searchUsers(query: string) {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_URL}/users/search?query=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!response.ok) throw new Error('Ошибка поиска')
  return response.json()
}

interface ApiUser {
  id: number;
  username: string;
  name?: string;
  profile_image?: string;
}

export async function checkUserExists(username: string): Promise<boolean> {
  const response = await fetch('/api/check-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  
  if (!response.ok) throw new Error('Failed to check user');
  const data = await response.json();
  return data.exists;
}

export async function loginAD(username: string, password: string): Promise<{ 
  user: ApiUser; 
  role: string; 
  token: string 
}> {
  const response = await fetch('/api/authorization', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) throw new Error('AD login failed');
  return response.json();
}

export async function loginWithPassword(username: string, password: string): Promise<{ 
  user: ApiUser; 
  role: string; 
  token: string 
}> {
  const response = await fetch('/api/login-with-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) throw new Error('Password login failed');
  return response.json();
}

export async function logout(): Promise<void> {
  // Опционально: можно добавить вызов к API для серверного логаута
  // await fetch('/api/logout', { method: 'POST' });
  return Promise.resolve();
}
