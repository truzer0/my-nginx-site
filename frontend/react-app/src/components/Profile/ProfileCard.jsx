import React from 'react';

const ProfileCard = ({ userData, onEditClick }) => {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar-status-container">
          <div className="avatar-container">
            <img 
              src={userData.avatar} 
              alt="Аватар" 
              className="avatar-image"
            />
          </div>
          <div className="status-indicator">
            <div className={`status-badge ${userData.status}`}></div>
            <div className="status-text">{userData.status}</div>
          </div>
        </div>
        <h2 className="profile-name">{userData.name}</h2>
      </div>

      <div className="profile-details">
        <div className="detail-row">
          <span className="detail-label">Имя пользователя:</span>
          <span>{userData.username}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Пароль:</span>
          <span>********</span>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          onClick={onEditClick}
          className="btn btn-primary"
        >
          Изменить данные
        </button>
        {userData.isAdmin && (
          <button className="btn btn-admin">
            Админ-панель
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
