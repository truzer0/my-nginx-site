// Инициализация мессенджера
const messengerModal = document.getElementById('messengerModal');
const openMessengerButton = document.getElementById('openMessengerButton');
const closeMessengerButton = document.getElementById('closeMessengerButton');
const messagesButton = document.getElementById('messagesButton');
const conversationsList = document.getElementById('conversationsList');
const usersList = document.getElementById('usersList');
const chatContainer = document.getElementById('chatContainer');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const messageForm = document.getElementById('messageForm');
const backToConversations = document.getElementById('backToConversations');
const partnerName = document.getElementById('partnerName');
const partnerAvatar = document.getElementById('partnerAvatar');
const showUsersButton = document.getElementById('showUsersButton');
const unreadMessagesCount = document.getElementById('unreadMessagesCount');

let currentChatPartnerId = null;
let refreshInterval = null;

// Открыть мессенджер
function openMessenger() {
    messengerModal.style.display = 'flex';
    showConversationsList();
    startRefreshing();
}

// Закрыть мессенджер
function closeMessenger() {
    messengerModal.style.display = 'none';
    stopRefreshing();
}

// Показать список пользователей
function showUsersList() {
    conversationsList.style.display = 'none';
    chatContainer.style.display = 'none';
    usersList.style.display = 'block';
    loadAvailableUsers();
}

// Показать список диалогов
function showConversationsList() {
    usersList.style.display = 'none';
    chatContainer.style.display = 'none';
    conversationsList.style.display = 'block';
    loadConversations();
}

// Назад к списку диалогов
function backToConversationsList() {
    chatContainer.style.display = 'none';
    showConversationsList();
    currentChatPartnerId = null;
}

// Открыть чат с пользователем
function openChat(userId, userName, userAvatar) {
    if (!userId) {
        console.error('Не указан ID пользователя для открытия чата');
        messagesContainer.innerHTML = '<div style="color: var(--error-color); padding: 20px;">Ошибка: не выбран собеседник</div>';
        return;
    }
    
    currentChatPartnerId = userId;
    partnerName.textContent = userName || 'Неизвестный пользователь';
    partnerAvatar.src = userAvatar ? '/uploads/' + userAvatar : 'https://10.100.6.123:3000/uploads/default-avatar.jpg';
    partnerAvatar.onerror = () => { partnerAvatar.src = '/uploads/default-avatar.jpg'; };
    
    conversationsList.style.display = 'none';
    usersList.style.display = 'none';
    chatContainer.style.display = 'flex';
    
    loadMessages(userId);
}

// Загрузка сообщений
async function loadMessages(userId) {
    if (!userId || isNaN(userId)) {
        console.error('Invalid user ID:', userId);
        messagesContainer.innerHTML = '<div class="error-message">Error: invalid chat</div>';
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Check scroll position before loading
        const wasScrolledToBottom = messagesContainer.scrollHeight - messagesContainer.clientHeight <= messagesContainer.scrollTop + 50;

        const response = await fetch(`/api/messages/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load messages');
        
        const messages = await response.json();
        messagesContainer.innerHTML = '';
        
        if (!Array.isArray(messages)) {
            throw new Error('Invalid messages format');
        }

        if (messages.length === 0) {
            messagesContainer.innerHTML = '<div class="no-messages">No messages yet</div>';
            return;
        }
        
        const currentUserId = JSON.parse(atob(token.split('.')[1])).id;
        
        messages.forEach(message => {
            if (!message.sender_id || !message.content) {
                console.warn('Invalid message format:', message);
                return;
            }

            const isCurrentUser = message.sender_id === currentUserId;
            const messageEl = document.createElement('div');
            messageEl.className = isCurrentUser ? 'message my-message' : 'message their-message';
            
            // Force avatar size with inline styles
            messageEl.innerHTML = `
                ${!isCurrentUser ? `
                <img src="${message.sender_avatar ? '/uploads/' + message.sender_avatar : 'https://10.100.6.123:3000/uploads/default-avatar.jpg'}" 
                     class="message-avatar"
                     style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid var(--primary-color);margin-right:10px;"
                     onerror="this.onerror=null;this.src='http://10.100.6.123:3000/uploads/default-avatar.jpg'">
                ` : ''}
                <div class="message-content" style="max-width:${isCurrentUser ? '100%' : 'calc(100% - 50px)'};padding:10px 15px;border-radius:18px;background-color:${isCurrentUser ? 'var(--primary-color)' : 'var(--darker-bg)'};color:${isCurrentUser ? 'white' : 'var(--text-color)'};word-wrap:break-word;">
                    ${escapeHtml(message.content)}
                    <div class="message-time" style="font-size:11px;color:${isCurrentUser ? 'rgba(255,255,255,0.7)' : '#aaa'};margin-top:5px;text-align:right;">
                        ${new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
            `;
            
            messagesContainer.appendChild(messageEl);
        });

        // Scroll to bottom if needed
        if (wasScrolledToBottom || currentChatPartnerId === userId) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 0);
        }
        
    } catch (error) {
        console.error('Error:', error);
        messagesContainer.innerHTML = `
            <div class="error-message" style="padding:20px;color:var(--error-color);">
                Error loading messages: ${escapeHtml(error.message)}
            </div>
        `;
    }
}

// Загрузка списка доступных пользователей
async function loadAvailableUsers() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/users/available', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки пользователей');
        
        const users = await response.json();
        usersList.innerHTML = '';
        
        if (!Array.isArray(users)) {
            throw new Error('Некорректный формат данных пользователей');
        }
        
        if (users.length === 0) {
            usersList.innerHTML = '<div style="padding: 20px; text-align: center;">Нет доступных пользователей</div>';
            return;
        }
        
        users.forEach(user => {
            if (!user.id) {
                console.warn('Пользователь без ID:', user);
                return;
            }

            const userEl = document.createElement('div');
            userEl.style.padding = '10px';
            userEl.style.borderBottom = '1px solid var(--darker-bg)';
            userEl.style.cursor = 'pointer';
            userEl.style.display = 'flex';
            userEl.style.alignItems = 'center';
            
            userEl.innerHTML = `
                <img src="${user.profile_image ? '/uploads/' + user.profile_image : 'https://10.100.6.123:3000/uploads/default-avatar.jpg'}" 
                     class="author-avatar" 
                     style="margin-right: 10px;"
                     onerror="this.src='/uploads/default-avatar.jpg'">
                <div>
                    <div style="font-weight: bold;">${escapeHtml(user.name)} ${escapeHtml(user.last_name || '')}</div>
                </div>
            `;
            
            userEl.addEventListener('click', async () => {
                try {
                    // Проверяем, можно ли начать диалог с этим пользователем
                    const checkResponse = await fetch(`/api/conversations/check/${user.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (!checkResponse.ok) {
                        throw new Error('Ошибка проверки диалога');
                    }
                    
                    const checkData = await checkResponse.json();
                    
                    if (checkData.canSend) {
                        openChat(user.id, `${user.name} ${user.last_name || ''}`, user.profile_image);
                    } else {
                        alert('Не удалось начать диалог с этим пользователем');
                    }
                } catch (error) {
                    console.error('Ошибка:', error);
                    alert('Ошибка при проверке возможности начать диалог');
                }
            });
            
            usersList.appendChild(userEl);
        });
    } catch (error) {
        console.error('Ошибка:', error);
        usersList.innerHTML = `
            <div style="padding: 20px; color: var(--error-color);">
                ${escapeHtml(error.message || 'Не удалось загрузить пользователей')}
            </div>
        `;
    }
}

// Загрузка списка диалогов
async function loadConversations() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/conversations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки диалогов');
        
        const conversations = await response.json();
        conversationsList.innerHTML = '';
        
        if (!Array.isArray(conversations)) {
            throw new Error('Некорректный формат диалогов');
        }
        
        if (conversations.length === 0) {
            conversationsList.innerHTML = '<div class="no-conversations">У вас пока нет сообщений</div>';
            return;
        }
        
        conversations.forEach(conversation => {
            const item = document.createElement('div');
            item.className = 'conversation-item';
            
            item.innerHTML = `
                <img src="${conversation.profile_image ? '/uploads/' + conversation.profile_image : 'https://10.100.6.123:3000/uploads/default-avatar.jpg'}" 
                     class="conversation-avatar"
                     onerror="this.src='/uploads/default-avatar.jpg'">
                <div class="conversation-info">
                    <div class="conversation-name">${escapeHtml(conversation.name)} ${escapeHtml(conversation.last_name || '')}</div>
                    <div class="conversation-preview">${escapeHtml(conversation.last_message || '')}</div>
                </div>
                <div class="conversation-meta">
                    <div class="conversation-time">${conversation.last_message_time ? formatTime(conversation.last_message_time) : ''}</div>
                    ${conversation.unread_count > 0 ? `<div class="unread-count">${conversation.unread_count}</div>` : ''}
                </div>
            `;
            
            item.addEventListener('click', () => {
                openChat(conversation.user_id, `${conversation.name} ${conversation.last_name || ''}`, conversation.profile_image);
            });
            
            conversationsList.appendChild(item);
        });
        
    } catch (error) {
        console.error('Ошибка:', error);
        conversationsList.innerHTML = `
            <div class="error-message">
                ${escapeHtml(error.message || 'Не удалось загрузить диалоги')}
            </div>
        `;
    }
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else {
        return date.toLocaleDateString([], {month: 'short', day: 'numeric'});
    }
}

// Отправка сообщения
async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || !currentChatPartnerId) return;
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                recipient_id: currentChatPartnerId,
                content: content
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка отправки сообщения');
        }
        
        messageInput.value = '';
        await loadMessages(currentChatPartnerId);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось отправить сообщение: ' + error.message);
    }
}

// Обновление счетчика непрочитанных сообщений
function updateUnreadCount(count) {
    if (count > 0) {
        unreadMessagesCount.textContent = count;
        unreadMessagesCount.style.display = 'inline';
    } else {
        unreadMessagesCount.style.display = 'none';
    }
}

// Проверка непрочитанных сообщений
async function checkUnreadMessages() {
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
            updateUnreadCount(data.total_unread || 0);
        }
    } catch (error) {
        console.error('Ошибка при проверке непрочитанных сообщений:', error);
    }
}

// Начать автоматическое обновление
function startRefreshing() {
    refreshInterval = setInterval(() => {
        if (currentChatPartnerId) {
            loadMessages(currentChatPartnerId);
        } else {
            loadConversations();
        }
        checkUnreadMessages();
    }, 5000);
}

// Остановить автоматическое обновление
function stopRefreshing() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// Инициализация мессенджера
document.addEventListener('DOMContentLoaded', () => {
    // Обработчики для мессенджера
    if (openMessengerButton) {
        openMessengerButton.addEventListener('click', openMessenger);
    }
    if (closeMessengerButton) {
        closeMessengerButton.addEventListener('click', closeMessenger);
    }
    if (messagesButton) {
        messagesButton.addEventListener('click', openMessenger);
    }
    if (backToConversations) {
        backToConversations.addEventListener('click', backToConversationsList);
    }
    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await sendMessage();
        });
    }
    if (showUsersButton) {
        showUsersButton.addEventListener('click', showUsersList);
    }
    
    // Первоначальная проверка непрочитанных сообщений
    checkUnreadMessages();
});
