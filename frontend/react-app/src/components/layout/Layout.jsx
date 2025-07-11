import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import ProfileDropdown from '../profile/ProfileDropdown';
import Messenger from '../messenger/Messenger';
import { useAuthStore } from '../../store/authStore';
import './Layout.css';
function Layout() {
  const { user, isAuthenticated, initialize } = useAuthStore();
  const [showMessenger, setShowMessenger] = React.useState(false);
  useEffect(() => {
    initialize();
  }, [initialize]);
  if (!isAuthenticated) return null;
  return (
    <div className="layout">
      <Sidebar />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <div className="profile-container">
        <ProfileDropdown user={user} />
      </div>
      
      <button 
        className="open-messenger-button" 
        onClick={() => setShowMessenger(!showMessenger)}
      >
        💬
      </button>
      
      {showMessenger && <Messenger onClose={() => setShowMessenger(false)} />}
    </div>
  );
}
export default Layout;
