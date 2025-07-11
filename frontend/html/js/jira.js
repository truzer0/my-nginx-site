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

// Форматирование даты для отображения
function formatDisplayDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

// Создание кнопок периодов
function createPeriodButtons() {
    const controls = document.createElement('div');
    controls.className = 'period-controls';
    controls.innerHTML = `
        <button class="period-btn active" data-days="1">День</button>
        <button class="period-btn" data-days="7">Неделя</button>
        <button class="period-btn" data-days="30">Месяц</button>
        <button class="period-btn" data-days="90">Квартал</button>
    `;
    return controls;
}

// Загрузка отчета
async function loadReport(days = 7, forceRefresh = false) {
    const container = document.getElementById('reportContainer');
    container.innerHTML = '<div class="loading-spinner">Загрузка отчета...</div>';

    try {
        console.log(`[${new Date().toISOString()}] Загрузка отчета за ${days} дней`);

        // Проверка авторизации
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Требуется авторизация');
        }

        // Формирование дат
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const start = startDate.toISOString().split('T')[0];
        const end = endDate.toISOString().split('T')[0];

        console.log(`Период отчета: ${start} - ${end}`);

        // Формирование URL
        const url = `/api/jira/reports?start=${start}&end=${end}${forceRefresh ? '&force=true' : ''}`;
        console.log(`Запрос к: ${url}`);

        // Выполнение запроса
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 секунд таймаут
        });

        console.log(`Статус ответа: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка ответа:', errorText);
            throw new Error(errorText || `HTTP error ${response.status}`);
        }

        const report = await response.json();
        console.log('Получен отчет:', report);

        if (!report || typeof report !== 'object') {
            throw new Error('Некорректный формат отчета');
        }

        renderReport(report, days);
    } catch (error) {
        console.error('Ошибка при загрузке отчета:', error);
        showError(container, error, days);
    }
}

// Отображение отчета
function renderReport(report, selectedDays) {
    const container = document.getElementById('reportContainer');
    container.innerHTML = '';

    // Кнопки периодов
    const controls = createPeriodButtons();
    container.appendChild(controls);

    // Активируем выбранный период
    document.querySelectorAll('.period-btn').forEach(btn => {
        if (parseInt(btn.dataset.days) === selectedDays) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Статистика
    const statsHtml = `
        <div class="report-stats">
            <div class="stat-card">
                <h3>Всего задач</h3>
                <div class="stat-value">${report.totalTasks || 0}</div>
            </div>
            <div class="stat-card">
                <h3>Затрачено времени</h3>
                <div class="stat-value">${report.totalSpent || '0h'}</div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', statsHtml);

    // Таблица задач
    if (report.tasks && report.tasks.length > 0) {
        const tableHtml = `
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Тип</th>
                        <th>Задача</th>
                        <th>Статус</th>
                        <th>Время</th>
                        <th>Обновлено</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.tasks.map(task => `
                        <tr>
                            <td>${task.issuetype || 'N/A'}</td>
                            <td>
                                <a href="${task.url || '#'}" target="_blank" class="task-link">
                                    ${task.key || ''}: ${escapeHtml(task.summary || '')}
                                </a>
                            </td>
                            <td class="status-${task.statusCategory || 'todo'}">
                                ${task.status || 'N/A'}
                            </td>
                            <td>${task.spent || '0h'}</td>
                            <td>${formatDisplayDate(task.updated)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        container.insertAdjacentHTML('beforeend', tableHtml);
    } else {
        container.insertAdjacentHTML('beforeend', `
            <div class="no-data">
                Нет данных за выбранный период
            </div>
        `);
    }

    // Обработчики для кнопок периодов
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const days = parseInt(btn.dataset.days);
            loadReport(days);
        });
    });
}

// Показ ошибки
function showError(container, error, days) {
    container.innerHTML = `
        <div class="error-message">
            <h3>Ошибка загрузки отчета</h3>
            <p>${escapeHtml(error.message)}</p>
            <button class="retry-button" onclick="loadReport(${days}, true)">
                Попробовать снова
            </button>
            <button class="retry-button" onclick="loadReport(${days})">
                Повторить запрос
            </button>
        </div>
    `;
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
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка загрузки данных пользователя');
        }

        const user = await response.json();
        
        // Обновление аватара и имени
        const avatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        
        if (user.profile_image) {
            avatar.src = `/uploads/${user.profile_image}`;
            avatar.onerror = () => {
                avatar.src = '/images/default-avatar.png';
            };
        }
        
        if (user.name) {
            userName.textContent = user.name;
        }

        await checkAdminRights();
    } catch (error) {
        console.error('Ошибка загрузки информации о пользователе:', error);
    }
}

// Проверка прав администратора
async function checkAdminRights() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/users/check-admin', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.isAdmin) {
                document.getElementById('adminButton').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Ошибка проверки прав администратора:', error);
    }
}

// Настройка обработчиков
function setupProfileHandlers() {
    // Обработчик аватара
    document.getElementById('profile-avatar-container').addEventListener('click', function(e) {
        e.stopPropagation();
        const dropdown = document.querySelector('.profile-dropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function() {
        const dropdown = document.querySelector('.profile-dropdown');
        if (dropdown) dropdown.style.display = 'none';
    });

    // Выход из системы
    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Кнопка админа
    document.getElementById('adminButton').addEventListener('click', function() {
        window.location.href = 'admin.html';
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    // Настройка интерфейса
    fetchUserInfo();
    setupProfileHandlers();
    
    // Загрузка отчета за неделю по умолчанию
    loadReport(7);
});
