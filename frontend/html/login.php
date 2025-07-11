<?php
ob_start();
require_once 'config.php';

// Обработка выхода
if (isset($_GET['logout'])) {
    setcookie('auth_token', '', time() - 3600, '/');
    header('Location: login.php');
    exit();
}

// Проверка авторизации по кукам (только если пользователь есть в БД)
if (isset($_COOKIE['auth_token'])) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE auth_token = ?");
        $stmt->execute([$_COOKIE['auth_token']]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Проверяем, не истек ли срок действия токена (если используете JWT)
            if (isset($user['token_expires']) && $user['token_expires'] < time()) {
                setcookie('auth_token', '', time() - 3600, '/');
            } else {
                header('Location: about.php');
                exit();
            }
        }
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        setcookie('auth_token', '', time() - 3600, '/');
    }
}

// Обработка форм авторизации
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $auth_type = $_POST['auth_type'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = "Заполните все поля";
    } else {
        try {
            // Общая логика аутентификации
            if ($auth_type === 'ad') {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND is_ad_user = TRUE");
            } else {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            }
            
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            
            if (!$user) {
                $error = "Пользователь не найден";
            } elseif ($auth_type === 'ad' && $password !== 'ad_password') {
                $error = "Неверный пароль AD";
            } elseif ($auth_type !== 'ad' && !password_verify($password, $user['password'])) {
                $error = "Неверный пароль";
            } else {
                // Успешная аутентификация
                $token = bin2hex(random_bytes(32));
                $expires = time() + 3600 * 24 * 7; // 7 дней
                
                setcookie('auth_token', $token, [
                    'expires' => $expires,
                    'path' => '/',
                    'secure' => isset($_SERVER['HTTPS']),
                    'httponly' => true,
                    'samesite' => 'Strict'
                ]);
                
                // Обновляем токен и время его действия в базе
                $stmt = $pdo->prepare("UPDATE users SET auth_token = ?, token_expires = ? WHERE id = ?");
                $stmt->execute([$token, date('Y-m-d H:i:s', $expires), $user['id']]);
                
                header('Location: about.php');
                exit();
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            $error = "Ошибка системы. Пожалуйста, попробуйте позже.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Авторизация</title>
    <style>
        :root {
            --primary-color: #4361ee;
            --primary-hover: #3a56d4;
            --dark-bg: #1a1a2e;
            --dark-card-bg: #2d2d2d;
            --darker-bg: #1f1f1f;
            --text-color: #e0e0e0;
            --light-text: #f5f5f5;
            --border-color: #444444;
            --error-color: #ff6b6b;
            --success-color: #4caf50;
            --border-radius: 8px;
            --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            --transition: all 0.3s ease;
        }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: var(--darker-bg);
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: var(--text-color);
        }

        .auth-container {
            width: 100%;
            max-width: 420px;
            padding: 0 20px;
        }

        .auth-card {
            background-color: var(--dark-card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            padding: 30px;
            text-align: center;
            border: 1px solid var(--border-color);
        }

        .logo {
            margin-bottom: 20px;
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
        }

        h1 {
            font-size: 22px;
            margin-bottom: 25px;
            color: var(--light-text);
        }

        .auth-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .form-group {
            text-align: left;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--light-text);
        }

        input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            font-size: 16px;
            transition: var(--transition);
            box-sizing: border-box;
            background-color: #3a3a3a;
            color: var(--light-text);
        }

        input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
        }

        button {
            width: 100%;
            padding: 12px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            margin-top: 10px;
        }

        button:hover {
            background-color: var(--primary-hover);
        }

        .secondary-btn {
            background-color: transparent;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
        }

        .secondary-btn:hover {
            background-color: rgba(67, 97, 238, 0.1);
        }

        .error-message {
            color: var(--error-color);
            font-size: 14px;
            margin-top: 5px;
            text-align: left;
        }

        .hidden {
            display: none;
        }

        .loading {
            position: relative;
            pointer-events: none;
            opacity: 0.7;
        }

        .loading::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <!-- Блок для входа по логину -->
        <div class="auth-card" id="login">
            <div class="logo">ЦУС</div>
            <h1>Вход в систему</h1>
            
            <?php if ($error): ?>
                <div class="error-message"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>
            
            <form id="loginForm" class="auth-form" method="POST" action="">
                <input type="hidden" name="auth_type" id="authType" value="">
                
                <div class="form-group">
                    <label for="username">Имя пользователя</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username"
                        placeholder="Введите ваш логин" 
                        required 
                        autocomplete="username"
                        autofocus
                        value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
                    />
                </div>
                
                <div class="form-group hidden" id="passwordGroup">
                    <label for="password">Пароль</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        placeholder="Введите ваш пароль" 
                        autocomplete="current-password"
                    />
                </div>
                
                <button type="submit" id="submitBtn">Продолжить</button>
            </form>
            
            <div class="auth-footer">
                Система авторизации отдела ЦУС
            </div>
        </div>
    </div>

    <script>
        // Проверяем, есть ли пользователь в системе
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            const username = document.getElementById('username').value.trim();
            const passwordGroup = document.getElementById('passwordGroup');
            const passwordInput = document.getElementById('password');
            const submitBtn = document.getElementById('submitBtn');
            const authType = document.getElementById('authType');
            
            if (!passwordGroup.classList.contains('hidden')) {
                // Если поле пароля видимо, значит форма готова к отправке
                // Добавляем required атрибут только когда поле видимо
                passwordInput.required = true;
                return true;
            }
            
            e.preventDefault();
            
            // Проверяем тип пользователя (AJAX запрос)
            fetch('check_user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            })
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    // Пользователь есть - показываем поле пароля
                    passwordGroup.classList.remove('hidden');
                    passwordInput.required = true;
                    passwordInput.focus();
                    submitBtn.textContent = 'Войти';
                    authType.value = 'db';
                } else {
                    // Пользователя нет - отправляем как AD пользователя
                    passwordGroup.classList.remove('hidden');
                    passwordInput.required = true;
                    passwordInput.focus();
                    submitBtn.textContent = 'Войти через AD';
                    authType.value = 'ad';
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Ошибка при проверке пользователя');
            });
        });
    </script>
</body>
</html>
<?php ob_end_flush(); ?>
