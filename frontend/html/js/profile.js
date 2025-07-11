// DOM элементы
const profileAvatar = document.getElementById('profileAvatar');
const statusBadge = document.getElementById('statusBadge');
const userName = document.getElementById('userName');
const usernameDisplay = document.getElementById('usernameDisplay');
const editButton = document.getElementById('editButton');
const editForm = document.getElementById('editForm');
const achievementsToggle = document.getElementById('achievementsToggle');
const achievementsList = document.getElementById('achievementsList');
const adminButtonContainer = document.getElementById('admin-button-container');

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

// Загрузка данных профиля
async function loadProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Загрузка основной информации
        const profileResponse = await fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!profileResponse.ok) throw new Error('Ошибка загрузки профиля');
        const profileData = await profileResponse.json();

        // Загрузка статуса
        const statusResponse = await fetch('/api/user/status', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const statusData = statusResponse.ok ? await statusResponse.json() : { online: false };

        // Обновление UI
        userName.textContent = profileData.name || 'Пользователь';
        usernameDisplay.textContent = profileData.username || '';

        if (profileData.profile_image) {
            profileAvatar.src = `/uploads/${profileData.profile_image}`;
        } else {
            profileAvatar.src = '/uploads/default-avatar.jpg';
        }

        statusBadge.className = statusData.online ? 'status-badge online' : 'status-badge offline'; 
        document.querySelector('.status-text').textContent = statusData.online ? 'online' : 'offline';
        document.querySelector('.status-text').style.color = statusData.online ? '#28a745' : '#dc3545';

        // Проверка прав администратора
        await checkAdminButton();

    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить данные профиля');
    }
}

async function loadUserArticles() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('/api/user/articles', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки статей');
        
        const articles = await response.json();
        const articlesContainer = document.getElementById('userArticlesContainer');
        
        articlesContainer.innerHTML = '';
        
        if (articles.length === 0) {
            articlesContainer.innerHTML = '<p>У вас пока нет статей</p>';
            return;
        }
        
        articles.forEach(article => {
            const articleEl = document.createElement('div');
            articleEl.className = 'article-item';
            
            // Обрезаем длинный текст для превью
            const contentPreview = article.content.length > 100 
                ? article.content.substring(0, 100) + '...' 
                : article.content;
            
            articleEl.innerHTML = `
                <div class="article-item-title">${escapeHtml(article.title)}</div>
                <div class="article-item-content">${escapeHtml(contentPreview)}</div>
                <div class="article-item-meta">
                    <span>${new Date(article.created_at).toLocaleDateString()}</span>
                    ${article.category_name ? `<span>${escapeHtml(article.category_name)}</span>` : ''}
                </div>
                <div class="article-item-actions">
                    <button class="article-action-btn" onclick="viewFullArticle(${article.id}, event)">Читать</button>
                    <button class="article-action-btn edit" onclick="editArticle(${article.id}, event)">Редактировать</button>
                </div>
            `;
            
            articlesContainer.appendChild(articleEl);
        });
        
    } catch (error) {
        console.error('Ошибка загрузки статей:', error);
        document.getElementById('userArticlesContainer').innerHTML = 
            '<p>Не удалось загрузить статьи</p>';
    }
}

// Функции для работы со статьями
function viewFullArticle(articleId, event) {
    event.stopPropagation();
    window.open(`/article.php?id=${articleId}`, '_blank');
}

function editArticle(articleId, event) {
    event.stopPropagation();
    window.location.href = `/api.php?id=${articleId}`;
}

// Загрузка достижений
async function loadAchievements() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/my_achievements', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Ошибка загрузки достижений');
        const achievements = await response.json();

        achievementsList.innerHTML = '';
        if (achievements.length === 0) {
            achievementsList.innerHTML = '<li class="achievement-item">У вас пока нет достижений</li>';
        } else {
            achievements.forEach(ach => {
                const li = document.createElement('li');
                li.className = 'achievement-item';
                li.innerHTML = `
                    <div class="achievement-title">${ach.title}</div>
                    <div class="achievement-description">${ach.description}</div>
                `;
                achievementsList.appendChild(li);
            });
        }

    } catch (error) {
        console.error('Ошибка:', error);
        achievementsList.innerHTML = '<li class="achievement-item">Не удалось загрузить достижения</li>';
    }
}

// Проверка прав администратора
async function checkAdminButton() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/me/admin-button', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Ошибка проверки прав');
        const data = await response.json();

        if (data.showAdminButton) {
            adminButtonContainer.innerHTML = `
                <button class="btn admin-button" id="adminButton">Админ-панель</button>
            `;
            document.getElementById('adminButton').addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Обработчики событий
editButton.addEventListener('click', () => {
    document.querySelector('.profile-card').style.display = 'none';
    editForm.style.display = 'block';
    document.getElementById('editName').value = userName.textContent;
});

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        formData.append('name', document.getElementById('editName').value);
        formData.append('password', document.getElementById('editPassword').value);
        
        const avatarFile = document.getElementById('editAvatar').files[0];
        if (avatarFile) formData.append('profileImage', avatarFile);

        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) throw new Error('Ошибка обновления профиля');
        
        alert('Данные успешно обновлены!');
        loadProfile();
        editForm.style.display = 'none';
        document.querySelector('.profile-card').style.display = 'flex';

    } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message);
    }
});

achievementsToggle.addEventListener('click', () => {
    achievementsList.classList.toggle('show');
    const arrow = achievementsToggle.querySelector('span:last-child');
    arrow.textContent = achievementsList.classList.contains('show') ? '▲' : '▼';
});

// Обработчик для toggle статей
document.getElementById('articlesToggle').addEventListener('click', () => {
    const container = document.getElementById('userArticlesContainer');
    container.classList.toggle('show');
    const arrow = document.querySelector('#articlesToggle span:last-child');
    arrow.textContent = container.classList.contains('show') ? '▲' : '▼';
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadAchievements();
    loadUserArticles();
});
