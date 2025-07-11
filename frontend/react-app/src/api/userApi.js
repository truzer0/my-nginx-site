export const getUserData = async () => {
  const response = await fetch('/api/user');
  return await response.json();
};

export const updateUserData = async (formData) => {
  const response = await fetch('/api/user/update', {
    method: 'POST',
    body: formData
  });
  return await response.json();
};

export const getAchievements = async () => {
  const response = await fetch('/api/achievements');
  return await response.json();
};

export const getArticles = async () => {
  const response = await fetch('/api/articles');
  return await response.json();
};
