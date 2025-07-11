import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserSearch from '../UserSearch/UserSearch';
import './Sidebar.css';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="sidebar">
      <div 
        className={`welcome ${isDropdownOpen ? 'active' : ''}`} 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Добро пожаловать в отдел ЦУС
      </div>
      
      {isDropdownOpen && (
        <div className="welcome-dropdown">
          <nav>
            <Link to="/about" className="nav-button">Для реальных админов</Link>
            <Link to="/articles" className="nav-button">Статьи</Link>
            <Link to="/contact" className="nav-button">Контакты</Link>
          </nav>
        </div>
      )}
      
      <UserSearch />
    </div>
  );
};

export default Sidebar;
