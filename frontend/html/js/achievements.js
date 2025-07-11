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

// Проверка авторизации
function checkAuthorization() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Загрузка информации о пользователе
async function fetchUserInfo() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('/api/users/me', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при загрузке информации о пользователе');
        }
        
        const data = await response.json();
        document.getElementById('name').textContent = data.name || 'Пользователь';
        
        const avatar = document.getElementById('userAvatar');
        if (data.profile_image) {
            avatar.src = `/uploads/${data.profile_image}?t=${Date.now()}`;
            avatar.onerror = () => {
                avatar.src = '/uploads/default-avatar.jpg';
            };
        }
        
        if (data.is_admin) {
            document.getElementById('adminButton').style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('name').textContent = 'Ошибка загрузки';
    }
}

// Загрузка достижений
async function loadAchievements() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [allAchievementsRes, myAchievementsRes] = await Promise.all([
            fetch('/api/available_achievements', {
                headers: { 'Authorization': 'Bearer ' + token }
            }),
            fetch('/api/my_achievements', {
                headers: { 'Authorization': 'Bearer ' + token }
            })
        ]);

        if (!allAchievementsRes.ok || !myAchievementsRes.ok) {
            throw new Error('Ошибка при загрузке достижений');
        }

        const [allAchievements, myAchievements] = await Promise.all([
            allAchievementsRes.json(),
            myAchievementsRes.json()
        ]);

        const achievementsDiv = document.getElementById('available-achievements');
        achievementsDiv.innerHTML = '';
        
        const myAchievementTitles = myAchievements.map(a => a.title);
        const availableAchievements = allAchievements.filter(a => !myAchievementTitles.includes(a.title));
        
        availableAchievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement';
            achievementElement.innerHTML = `
                <strong>${escapeHtml(achievement.title)}</strong>
                <p>${escapeHtml(achievement.description)}</p>
                <button onclick="unlockAchievement('${escapeHtml(achievement.title)}')">Получить</button>`;
            achievementsDiv.appendChild(achievementElement);
        });
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('available-achievements').innerHTML = `
            <div style="color: var(--error-color); padding: 20px;">
                Не удалось загрузить достижения
            </div>`;
    }
}

// Разблокировка достижения
async function unlockAchievement(title) {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/achievements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ title })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при получении достижения');
        }
        
        const data = await response.json();
        alert(data.message || 'Достижение успешно получено!');
        loadAchievements();
    } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message || 'Не удалось получить достижение');
    }
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    checkAuthorization();
    fetchUserInfo();
    loadAchievements();
    
    // Обработчики событий для кнопок
    document.getElementById('profileButton').addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
    
    document.getElementById('adminButton').addEventListener('click', () => {
        window.location.href = 'admin.html';
    });
    
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Обработка ошибок загрузки аватара
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
        avatar.onerror = function() {
            this.src = '/uploads/default-avatar.jpg';
        };
    }
});
