import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar/Sidebar';
import ProfileDropdown from '../profile/ProfileDropdown';
import Messenger from '../messenger/Messenger';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [showMessenger, setShowMessenger] = useState(false);

  return (
    <div className="app-container">
      <Sidebar />
      
      <main className="main-content">
        {children}
      </main>
      
      <div className="profile-container">
        <ProfileDropdown />
      </div>
      
      <button 
        className="open-messenger-button" 
        onClick={() => setShowMessenger(!showMessenger)}
      >
        💬
      </button>
      
      {showMessenger && (
        <Messenger onClose={() => setShowMessenger(false)} />
      )}
    </div>
  );
};

export default MainLayout;
