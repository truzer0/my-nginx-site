// Функция экранирования HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Проверка наличия токена
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

// Обработчик для меню приветствия
document.getElementById('welcome').addEventListener('click', function() {
    this.classList.toggle('active');
});

// Загрузка информации о пользователе
async function fetchUserInfo() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('/api/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка получения данных: ${response.status}`);
        }

        const data = await response.json();
        console.log('Данные пользователя:', data);
        
        if (data.name) {
            document.getElementById('userName').textContent = data.name;
            
            // Обновляем аватар
            const avatar = document.getElementById('userAvatar');
            if (data.profile_image) {
                avatar.src = `/uploads/${data.profile_image}?t=${Date.now()}`;
                avatar.onerror = () => {
                };
            }
            
            document.getElementById('profileLink').addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
    }
}

// Проверка прав администратора
async function checkAdminButton() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/users/me/admin-button', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Ошибка проверки прав');

        const data = await response.json();
        if (data.showAdminButton) {
            document.getElementById('adminButton').style.display = 'block';
            document.getElementById('adminButton').addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }
    } catch (error) {
        console.error('Ошибка проверки прав администратора:', error);
    }
}

// Поиск пользователей
async function searchUsers() {
    const searchInput = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    if (!searchInput) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`/api/users/search?query=${encodeURIComponent(searchInput)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Ошибка поиска');

        const users = await response.json();

        if (users.length === 0) {
            resultsContainer.innerHTML = '<p>Пользователи не найдены</p>';
            return;
        }

        users.forEach(user => {
            const card = document.createElement('div');
            card.className = 'profile-card';
            card.innerHTML = `<div class="profile-name">${user.name}</div>`;
            card.addEventListener('click', () => {
                window.location.href = `other_profile?id=${user.id}`;
            });
            resultsContainer.appendChild(card);
        });
    } catch (error) {
        resultsContainer.innerHTML = `<p>${error.message}</p>`;
        console.error('Ошибка поиска пользователей:', error);
    }
}

// Загрузка полезных ссылок
async function loadLinks() {
    try {
        const response = await fetch('/api/links');
        if (!response.ok) throw new Error('Ошибка загрузки ссылок');

        const links = await response.json();
        const linksList = document.getElementById('linksList');
        linksList.innerHTML = '';

        links.forEach(link => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            const button = document.createElement('a');
            
            button.textContent = link.button_text || 'Ссылка';
            button.className = 'nav-button';
            button.href = link.url;
            button.target = '_blank';
            
            cell.appendChild(button);
            row.appendChild(cell);
            linksList.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки ссылок:', error);
        document.getElementById('linksList').innerHTML = '<tr><td>Не удалось загрузить ссылки</td></tr>';
    }
}

// Выход из системы
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

// Обработчики событий
document.getElementById('profile-avatar-container')?.addEventListener('click', function() {
    const dropdown = document.querySelector('.profile-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('searchButton').addEventListener('click', searchUsers);
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchUsers();
});

// Закрытие выпадающего меню при клике вне его
document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-container')) {
        document.querySelector('.profile-dropdown').style.display = 'none';
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    fetchUserInfo();
    checkAdminButton();
    loadLinks();
});
