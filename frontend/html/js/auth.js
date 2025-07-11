// DOM элементы
const loginSection = document.getElementById('login');
const adLoginSection = document.getElementById('adLogin');
const dbLoginSection = document.getElementById('dbLogin');

const loginForm = document.getElementById('loginForm');
const adLoginForm = document.getElementById('adLoginForm');
const dbLoginForm = document.getElementById('dbLoginForm');

const loginBtn = document.getElementById('loginBtn');
const adLoginBtn = document.getElementById('adLoginBtn');
const dbLoginBtn = document.getElementById('dbLoginBtn');

const loginError = document.getElementById('loginErrorMessage');
const adError = document.getElementById('adErrorMessage');
const dbError = document.getElementById('dbErrorMessage');

// Кнопки "Назад"
document.getElementById('backToLoginFromAD').addEventListener('click', () => {
    adLoginSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    clearErrors();
});

document.getElementById('backToLoginFromDB').addEventListener('click', () => {
    dbLoginSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    clearErrors();
});

// Очистка ошибок
function clearErrors() {
    loginError.classList.remove('visible');
    adError.classList.remove('visible');
    dbError.classList.remove('visible');
}

// Показать ошибку
function showError(element, message) {
    element.textContent = message;
    element.classList.add('visible');
}

// Включение состояния загрузки
function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Обработка формы входа по логину
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    
    const username = document.getElementById('username').value.trim();
    if (!username) {
        showError(loginError, 'Введите имя пользователя');
        return;
    }

    setLoading(loginBtn, true);
    
    try {
        const response = await fetch('/api/check-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${await response.text()}`);
        }
        
        const data = await response.json();
        
        if (data.exists) {
            // Пользователь есть — показываем форму для входа с паролем
            loginSection.classList.add('hidden');
            dbLoginSection.classList.remove('hidden');
            document.getElementById('dbPassword').focus();
        } else {
            // Пользователя нет — показываем вход через AD
            loginSection.classList.add('hidden');
            adLoginSection.classList.remove('hidden');
            document.getElementById('adPassword').focus();
        }
    } catch (error) {
        console.error('Ошибка при проверке пользователя:', error.message);
        showError(loginError, "Ошибка при проверке пользователя");
    } finally {
        setLoading(loginBtn, false);
    }
});

// Обработка входа через AD
adLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('adPassword').value;
    
    if (!password) {
        showError(adError, 'Введите пароль');
        return;
    }

    setLoading(adLoginBtn, true);
    
    try {
        const response = await fetch('/api/authorization', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${await response.text()}`);
        }
        
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Ошибка при аутентификации через AD:', error.message);
        showError(adError, "Неверный логин или пароль");
        document.getElementById('adPassword').value = '';
        document.getElementById('adPassword').focus();
    } finally {
        setLoading(adLoginBtn, false);
    }
});

// Обработка входа с паролем
dbLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('dbPassword').value;
    
    if (!password) {
        showError(dbError, 'Введите пароль');
        return;
    }

    setLoading(dbLoginBtn, true);
    
    try {
        const response = await fetch('/api/login-with-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${await response.text()}`);
        }
        
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Ошибка при аутентификации по паролю:', error.message);
        showError(dbError, "Неверный пароль");
        document.getElementById('dbPassword').value = '';
        document.getElementById('dbPassword').focus();
    } finally {
        setLoading(dbLoginBtn, false);
    }
});

// Фокус на поле ввода при открытии формы
document.getElementById('username').focus();
