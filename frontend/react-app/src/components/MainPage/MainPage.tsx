// src/components/MainPage/MainPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

interface Link {
  id: number;
  url: string;
  button_text: string;
}

interface User {
  id: number;
  name: string;
  last_name: string;
  profile_image: string;
  is_admin: boolean;
}

const MainPage = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMessenger, setShowMessenger] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    loadLinks();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      navigate('/login');
    }
  };

  const loadLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (!response.ok) throw new Error('Failed to load links');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Error loading links:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`/api/users/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="main-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div 
          className="welcome" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Добро пожаловать в отдел ЦУС
        </div>
        
        {showDropdown && (
          <div className="welcome-dropdown">
            <nav>
              <a href="/about" className="nav-button">Для реальных админов</a>
              <a href="/articles" className="nav-button">Статьи</a>
              <a href="/contact" className="nav-button">Контакты</a>
            </nav>
          </div>
        )}
        
        <div className="search-user">
          <h3>Поиск пользователей</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
            placeholder="Введите имя..."
          />
          <button onClick={searchUsers}>Найти</button>
          
          {searchResults.length > 0 && (
            <div className="profiles-container">
              {searchResults.map((user) => (
                <div 
                  key={user.id} 
                  className="profile-card"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <div className="profile-name">
                    {user.name} {user.last_name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <div className="links-container">
          <h2>Полезные ссылки</h2>
          <table className="links-table">
            <thead>
              <tr>
                <th>Название</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id}>
                  <td>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="nav-button"
                    >
                      {link.button_text}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Profile Container */}
      <div className="profile-container">
        <div className="profile-avatar-container">
          {user?.profile_image ? (
            <img 
              src={`/uploads/${user.profile_image}`} 
              alt="Аватар" 
              className="profile-avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.jpg';
              }}
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {user?.name?.charAt(0)}
            </div>
          )}
        </div>
        
        <button className="profile-button">
          <span>{user?.name || 'Профиль'}</span>
          <span>▼</span>
        </button>
        
        <div className="profile-dropdown">
          <button onClick={() => navigate('/profile')}>Мой профиль</button>
          {user?.is_admin && (
            <button onClick={() => navigate('/admin')}>Админ</button>
          )}
          <button onClick={handleLogout}>Выход</button>
        </div>
      </div>
      
      {/* Messenger Button */}
      <button 
        className="open-messenger-button"
        onClick={() => setShowMessenger(!showMessenger)}
      >
        💬
      </button>
      
      {/* Messenger Modal */}
      {showMessenger && (
        <Messenger onClose={() => setShowMessenger(false)} />
      )}
    </div>
  );
};

export default MainPage;
