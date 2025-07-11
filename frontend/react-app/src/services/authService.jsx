export const login = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Ошибка авторизации');
  }
  
  return response.json();
};

export const adLogin = async (credentials) => {
  const response = await fetch('/api/ad-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Ошибка AD авторизации');
  }
  
  return response.json();
};

export const completeRegistration = async (username, data) => {
  const response = await fetch('/api/complete-registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, ...data })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Ошибка регистрации');
  }
  
  return response.json();
};
