<?php
// Проверка аутентификации через JWT в localStorage (обрабатывается на клиенте)
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jira Report System</title>
    <link rel="stylesheet" href="/css/jira.css">
    <link rel="stylesheet" href="/css/messenger.css">
</head>
<body>
    <!-- Сайдбар -->
    <div id="sidebar">
        <div id="welcome">Jira Report System</div>
        <div class="welcome-dropdown">
            <nav>
                <a href="/index" class="nav-button">Главная</a>
                <a href="/about.php" class="nav-button">Для админов</a>
                <a href="/contact" class="nav-button">Контакты</a>
            </nav>
        </div>

        <div id="search-user">
            <h3>Поиск пользователей</h3>
            <input type="text" id="searchInput" placeholder="Введите имя...">
            <button id="searchButton">Найти</button>
            <div id="searchResults" class="profiles-container"></div>
        </div>
    </div>

    <!-- Основное содержимое -->
    <div id="main-content">
        <div class="report-container" id="reportContainer">
            <div class="loading-spinner">Загрузка отчета...</div>
        </div>
    </div>

    <!-- Профиль пользователя -->
    <div class="profile-container">
        <div class="profile-avatar-container" id="profile-avatar-container">
            <img id="userAvatar" class="profile-avatar" src="/images/default-avatar.png" alt="Аватар">
        </div>
        <button class="profile-button" id="profileButton">
            <span id="userName">Профиль</span> ▼
        </button>
        <div class="profile-dropdown">
            <button id="profileLink">Мой профиль</button>
            <button id="adminButton" style="display: none;">Админ-панель</button>
            <button id="logoutButton">Выйти</button>
        </div>
    </div>

    <!-- Мессенджер -->
    <div id="messengerModal" class="messenger-theme">
        <div class="messenger-header">
            <h3>Сообщения</h3>
            <div>
                <button id="showUsersButton" class="messenger-button">Новый чат</button>
                <button id="closeMessengerButton" class="messenger-close-button">×</button>
            </div>
        </div>
        
        <div id="usersList" class="messenger-list-container">
            <!-- Список пользователей -->
        </div>
        
        <div id="conversationsList" class="messenger-list-container">
            <!-- Список диалогов -->
        </div>
        
        <div id="chatContainer" class="messenger-chat-container">
            <div class="messenger-chat-header">
                <div id="chatPartnerInfo">
                    <img id="partnerAvatar" class="messenger-avatar">
                    <span id="partnerName"></span>
                    <span id="unreadMessagesCount" class="messenger-badge"></span>
                </div>
                <button id="backToConversations" class="messenger-back-button">← Назад</button>
            </div>
            
            <div id="messagesContainer" class="messenger-messages-container">
                <!-- Сообщения -->
            </div>
            
            <div class="messenger-form-container">
                <form id="messageForm" class="messenger-form">
                    <textarea id="messageInput" class="messenger-input" placeholder="Введите сообщение..." required></textarea>
                    <button type="submit" class="messenger-submit-button">Отправить</button>
                </form>
            </div>
        </div>
    </div>

    <button id="openMessengerButton" class="messenger-theme messenger-floating-button">💬</button>

    <script src="/js/jira.js"></script>
    <script src="/js/messenger.js"></script>
</body>
</html>
