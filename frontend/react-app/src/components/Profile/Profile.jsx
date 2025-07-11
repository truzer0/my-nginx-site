import { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../Navbar/Navbar';
import ProfileCard from './ProfileCard';
import AchievementsSection from './AchievementsSection';
import ArticlesSection from './ArticlesSection';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'Загрузка...',
    username: '',
    avatar: '/uploads/default-avatar.jpg',
    status: 'online',
    isAdmin: false
  });

  const [achievements, setAchievements] = useState([]);
  const [articles, setArticles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    avatar: null
  });

  useEffect(() => {
    // Загрузка данных пользователя
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setUserData(data);
        setFormData({ name: data.name, password: '', avatar: null });
        
        // Загрузка достижений
        const achievementsResponse = await fetch('/api/achievements');
        setAchievements(await achievementsResponse.json());
        
        // Загрузка статей
        const articlesResponse = await fetch('/api/articles');
        setArticles(await articlesResponse.json());
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.password) formDataToSend.append('password', formData.password);
      if (formData.avatar) formDataToSend.append('avatar', formData.avatar);

      const response = await fetch('/api/user/update', {
        method: 'POST',
        body: formDataToSend
      });

      const updatedData = await response.json();
      setUserData(updatedData);
      setEditMode(false);
    } catch (error) {
      console.error('Ошибка обновления данных:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <div className="profile-container">
      <Navbar />
      
      <ProfileCard 
        userData={userData} 
        onEditClick={() => setEditMode(true)} 
      />
      
      {editMode && (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label htmlFor="editName">Имя:</label>
            <input
              type="text"
              id="editName"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="editPassword">Новый пароль:</label>
            <input
              type="password"
              id="editPassword"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editAvatar">Аватар:</label>
            <input
              type="file"
              id="editAvatar"
              name="avatar"
              className="form-control"
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Сохранить</button>
        </form>
      )}
      
      <AchievementsSection achievements={achievements} />
      <ArticlesSection articles={articles} />
    </div>
  );
};

export default Profile;

