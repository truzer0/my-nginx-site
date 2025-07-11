import { useEffect, useState } from 'react';
import './Messenger.css';

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

interface Conversation {
  user_id: number;
  name: string;
  last_name: string;
  profile_image: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface User {
  id: number;
  name: string;
  last_name: string;
  profile_image: string;
}

const Messenger = ({ onClose }: { onClose: () => void }) => {
  const [activeView, setActiveView] = useState<'conversations' | 'chat' | 'users'>('conversations');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [currentChatPartner, setCurrentChatPartner] = useState<{
    id: number;
    name: string;
    avatar: string;
  } | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (activeView === 'conversations') {
      loadConversations();
    } else if (activeView === 'users') {
      loadAvailableUsers();
    }
    
    checkUnreadMessages();
    
    const interval = setInterval(() => {
      if (activeView === 'chat' && currentChatPartner) {
        loadMessages(currentChatPartner.id);
      } else if (activeView === 'conversations') {
        loadConversations();
      }
      checkUnreadMessages();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeView, currentChatPartner]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to load conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/users/available', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to load users');
      const data = await response.json();
      setAvailableUsers(data);
    } catch (error) {
      console.error('Error loading available users:', error);
    }
  };

  const loadMessages = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to load messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const checkUnreadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/conversations/unread', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.total_unread || 0);
      }
    } catch (error) {
      console.error('Error checking unread messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentChatPartner) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient_id: currentChatPartner.id,
          content: messageInput
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
      
      setMessageInput('');
      loadMessages(currentChatPartner.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const openChat = (userId: number, userName: string, userAvatar: string) => {
    setCurrentChatPartner({ id: userId, name: userName, avatar: userAvatar });
    setActiveView('chat');
    loadMessages(userId);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else {
      return date.toLocaleDateString([], {month: 'short', day: 'numeric'});
    }
  };

  return (
    <div className="messenger-modal">
      {/* Header */}
      <div className="messenger-header">
        <div className="messenger-header-content">
          <h3>Сообщения</h3>
          <div>
            {activeView !== 'users' && (
              <button 
                className="show-users-button"
                onClick={() => setActiveView('users')}
              >
                Новый чат
              </button>
            )}
            <button 
              className="close-messenger-button"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="messenger-content">
        {/* Conversations List */}
        {activeView === 'conversations' && (
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">У вас пока нет сообщений</div>
            ) : (
              conversations.map(conversation => (
                <div 
                  key={conversation.user_id}
                  className="conversation-item"
                  onClick={() => openChat(
                    conversation.user_id,
                    `${conversation.name} ${conversation.last_name || ''}`,
                    conversation.profile_image
                  )}
                >
                  <img 
                    src={conversation.profile_image ? `/uploads/${conversation.profile_image}` : '/default-avatar.jpg'}
                    alt="Avatar"
                    className="conversation-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-avatar.jpg';
                    }}
                  />
                  <div className="conversation-info">
                    <div className="conversation-name">
                      {conversation.name} {conversation.last_name || ''}
                    </div>
                    <div className="conversation-preview">
                      {conversation.last_message}
                    </div>
                  </div>
                  <div className="conversation-meta">
                    <div className="conversation-time">
                      {formatTime(conversation.last_message_time)}
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="unread-count">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Users List */}
        {activeView === 'users' && (
          <div className="users-list">
            {availableUsers.length === 0 ? (
              <div className="no-users">Нет доступных пользователей</div>
            ) : (
              availableUsers.map(user => (
                <div 
                  key={user.id}
                  className="user-item"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      if (!token) return;
                      
                      const response = await fetch(`/api/conversations/check/${user.id}`, {
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        if (data.canSend) {
                          openChat(user.id, `${user.name} ${user.last_name || ''}`, user.profile_image);
                        } else {
                          alert('Не удалось начать диалог с этим пользователем');
                        }
                      }
                    } catch (error) {
                      console.error('Error checking conversation:', error);
                    }
                  }}
                >
                  <img 
                    src={user.profile_image ? `/uploads/${user.profile_image}` : '/default-avatar.jpg'}
                    alt="Avatar"
                    className="user-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-avatar.jpg';
                    }}
                  />
                  <div className="user-info">
                    <div className="user-name">
                      {user.name} {user.last_name || ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Chat */}
        {activeView === 'chat' && currentChatPartner && (
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-partner-info">
                <img 
                  src={currentChatPartner.avatar ? `/uploads/${currentChatPartner.avatar}` : '/default-avatar.jpg'}
                  alt="Avatar"
                  className="partner-avatar"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.jpg';
                  }}
                />
                <span className="partner-name">{currentChatPartner.name}</span>
                {unreadCount > 0 && (
                  <span className="unread-messages-count">{unreadCount}</span>
                )}
              </div>
              <button 
                className="back-to-conversations"
                onClick={() => setActiveView('conversations')}
              >
                ← Назад
              </button>
            </div>
            
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="no-messages">Нет сообщений</div>
              ) : (
                messages.map(message => {
                  const isCurrentUser = message.sender_id === JSON.parse(atob(localStorage.getItem('token')!.split('.')[1])).id;
                  
                  return (
                    <div 
                      key={message.id}
                      className={`message ${isCurrentUser ? 'my-message' : 'their-message'}`}
                    >
                      {!isCurrentUser && (
                        <img 
                          src={message.sender_avatar ? `/uploads/${message.sender_avatar}` : '/default-avatar.jpg'}
                          alt="Avatar"
                          className="message-avatar"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/default-avatar.jpg';
                          }}
                        />
                      )}
                      <div className="message-content">
                        {message.content}
                        <div className="message-time">
                          {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <form onSubmit={sendMessage} className="message-form">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Введите сообщение..."
                className="message-input"
                required
              />
              <button type="submit" className="send-button">
                Отправить
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
