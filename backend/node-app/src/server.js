const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('./middleware/auth'); // Импортируем middleware для проверки токена
const checkRole = require('./middleware/checkRole'); // Импортируем middleware для проверки роли
const ActiveDirectory = require('activedirectory2');
const ldap = require('ldapjs');
require('dotenv').config();
const redis = require('redis');
const sharp = require('sharp');
const https = require('https');
const http = require('http');
const JiraService = require('./middleware/jira-integration');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 3000;
app.set('trust proxy', true);

// Настройка подключения к базе данных PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('/etc/ssl/postgresql/ca.crt'),
    cert: fs.readFileSync('/etc/ssl/postgresql/server.crt'),
    key: fs.readFileSync('/etc/ssl/postgresql/server.key')
  }
});


const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
};

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD, // Добавляем аутентификацию
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Попытка переподключения к Redis #${retries}`);
      return Math.min(retries * 100, 5000); // Экспоненциальная задержка до 5 сек
    }
  }
});

// Обработчики событий
redisClient.on('connect', () => {
  console.log('Подключено к Redis');
});

redisClient.on('ready', () => {
  console.log('Redis готов к работе');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('end', () => {
  console.log('Соединение с Redis закрыто');
});

// Асинхронное подключение с обработкой ошибок
(async () => {
  try {
    await redisClient.connect();
    console.log('Успешное подключение к Redis');
  } catch (err) {
    console.error('Ошибка подключения к Redis:', err);
    // Можно добавить дополнительные действия при неудачном подключении
  }
})();

// Улучшенная функция кеширования
async function getCachedData(cacheKey, fetchFunction, ttlSeconds = 60) {
  // Проверяем подключение
  if (!redisClient.isOpen) {
    console.warn('Redis соединение не установлено, используем прямой запрос');
    return fetchFunction();
  }

  try {
    // Попытка получить из кеша
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(`Данные для ключа ${cacheKey} получены из кеша`);
      return JSON.parse(cached);
    }

    // Если в кеше нет - получаем свежие данные
    const data = await fetchFunction();

    // Сохраняем в кеш только если данные получены успешно
    if (data !== undefined && data !== null) {
      await redisClient.setEx(cacheKey, ttlSeconds, JSON.stringify(data));
    }

    return data;
  } catch (err) {
    console.error('Ошибка при работе с кешем:', err);
    // В случае ошибки - возвращаем данные без кеша
    return fetchFunction();
  }
}

// Грейсфул шатдаун
process.on('SIGINT', async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  process.exit();
});

process.on('SIGTERM', async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  process.exit();
});


// Конфигурация Jira
const jira = new JiraService(
  process.env.JIRA_BASE_URL, // 'https://jira.sibset.net'
  process.env.JIRA_API_TOKEN // 'ваш_api_токен' (тот же, что используется в Python)
);

app.use((err, req, res, next) => {
  if (err.message && err.message.includes('Jira')) {
    console.error('Jira Integration Error:', {
      message: err.message,
      stack: err.stack,
      request: {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query
      }
    });
    
    return res.status(500).json({ 
      error: 'Jira Service Temporarily Unavailable',
      details: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        type: err.constructor.name
      } : undefined,
      suggestion: 'Please try again later or contact support'
    });
  }
  next(err);
});

// Статические файлы (html)
app.use(express.static('html')); 

// Middleware для парсинга JSON-данных в запросах
app.use(bodyParser.json());


// Используем CORS для разрешения запросов с других источников
app.use(cors({
    origin: '*', // Замените на ваш домен или используйте '*' для разрешения всех источников
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
    credentials: true
}));

// Маршрут для доступа к загруженным изображениям
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Cache-Control', 'public, max-age=2592000');
    }
}));

app.use((req, res, next) => {
    if (req.path.startsWith('/uploads')) {
        return next();
    }
    // Остальная логика middleware
    next();
});

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка для сохранения загруженных файлов
    },
    filename: (req, file, cb) => {
        cb(null,Date.now() + path.extname(file.originalname)); // Сохраняем файл с оригинальным именем
    }
});

const upload = multer({ storage: storage, limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
        files: 1
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    }
});

app.get('/api/files', (req, res) => {
  const dirPath = path.join(__dirname, 'app');
  
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ error: 'Не удалось прочитать папку' });
    
    // Возвращаем список имен файлов
    res.json(files.map(filename => ({ filename })));
  });
});

app.use('/app', express.static(path.join(__dirname, 'app')));

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'app', filename);
  res.download(filePath);
});

// Конфигурация для подключения к AD
const config = {
    url: process.env.LDAP_URL,
    baseDN: process.env.LDAP_BASE_DN,
    username: process.env.LDAP_USERNAME,
    password: process.env.LDAP_PASSWORD,
};

const ad = new ActiveDirectory(config);

// Предположим, у вас есть массив или объект с порядком ролей
const roleHierarchy = ['user', 'editor', 'admin', 'superadmin'];

// Функция для сравнения ролей по иерархии
function isHigherRole(roleA, roleB) {
  const indexA = roleHierarchy.indexOf(roleA);
  const indexB = roleHierarchy.indexOf(roleB);
  if (indexA === -1 || indexB === -1) return false;
  return indexA > indexB; // чем больше индекс — тем выше роль
}


// Middleware для аутентификации через AD и сохранения пользователя в БД с ролью "user"
const authenticateUser = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).send('Тело запроса не может быть пустым');
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Имя пользователя и пароль обязательны');
    }

    ad.authenticate(username + '@sibset-office.211.ru', password, async (err, auth) => {
        if (err) {
            console.error('Ошибка аутентификации:', err);
            return res.status(500).send('Ошибка аутентификации');
        }

        if (!auth) {
            return res.status(401).send('Неверное имя пользователя или пароль');
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Хэшируем пароль

            const role = 'user'; // Устанавливаем роль по умолчанию

            const result = await pool.query(
                'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING *',
                [username, hashedPassword, role] // Сохраняем хэшированный пароль и роль
            );

            req.userData = { username }; // Сохраняем данные о пользователе

            next();
        } catch (dbError) {
            console.error('Ошибка при сохранении пользователя в БД:', dbError);
            return res.status(500).send('Ошибка при сохранении пользователя в БД');
        }
    });
};


// Middleware для проверки JWT
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Получаем токен из заголовка

    if (!token) {
        return res.redirect('/login.html'); // Редирект на страницу входа, если токен отсутствует
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Если ошибка верификации (например, токен истек)
            return res.redirect('/login.html'); // Редирект на страницу входа
        }
        req.user = decoded; // Сохраняем информацию о пользователе в запросе
        next(); // Продолжаем выполнение следующего middleware или маршрута
    });
}

// Функция для обновления данных пользователя
const updateUser = async (id, username, password) => {
  const query = 'UPDATE users SET username = $1, password = $2 WHERE id = $3';
  const values = [username, password, id];

  try {
    await pool.query(query, values);
    console.log('User updated successfully');
  } catch (err) {
    console.error('Error updating user:', err);
  }
};

// Функция для получения роли пользователя по ID
const getUserRole = async (userId) => {
    try {
        const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length > 0) {
            return userResult.rows[0].role; // Возвращаем роль пользователя
        } else {
            throw new Error('Пользователь не найден');
        }
    } catch (error) {
        console.error('Ошибка при получении роли пользователя:', error);
        throw error; // Обработка ошибки
    }
};

const updateUserActivity = async (req, res, next) => {
    if (req.user && req.user.id) {
        const userId = req.user.id;
        const now = new Date();

        try {
            await pool.query(`
                INSERT INTO user_status (user_id, last_active, is_online)
                VALUES ($1, $2, true)
                ON CONFLICT (user_id) DO UPDATE
                SET last_active = EXCLUDED.last_active,
                    is_online = true
            `, [userId, now]);
        } catch (err) {
            console.error('Ошибка обновления статуса пользователя:', err);
        }
    }
    next();
};

app.use(updateUserActivity);

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});



app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'OK', db: 'PostgreSQL', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка доступа к БД', details: err.message });
  }
});


app.post('/api/authorization', authenticateUser, async (req, res) => {
    const { username } = req.userData;

    if (!username) {
        return res.status(500).send('Ошибка получения данных о пользователе.');
    }

    try {
        // Получаем данные о пользователе из базы данных
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(400).send('Пользователь не найден.');
        }

        const user = userResult.rows[0];

        // Генерируем токен с ролью
        const tokenPayload = {
            id: user.id,
            username: user.username,
            role: user.role,
            profile_image: user.profile_image,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Возвращаем токен и роль
        res.status(200).json({ message: 'Успешная аутентификация', token, role: user.role });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        return res.status(500).send('Ошибка при авторизации.');
    }
});

app.post('/api/login-with-password', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Имя пользователя и пароль обязательны');
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(401).send('Неверное имя пользователя или пароль');
        }

        const user = userResult.rows[0];

        // Сравниваем введенный пароль с хэшированным паролем в базе данных
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Неверное имя пользователя или пароль');
        }

        // Генерируем токен с ролью
        const tokenPayload = { id: user.id, username: user.username, role: user.role, profile_image: user.profile_image, };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Успешная авторизация', token });
        
    } catch (error) {
      console.error("Ошибка при повторной авторизации:", error);
      return res.status(500).send("Ошибка при повторной авторизации.");
   }
});

// Эндпоинт для получения профиля пользователя
app.post('/api/get-user-profile', async (req, res) => {
    console.log('Полученные данные:', req.body);
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Имя пользователя не указано' });
    }

    const cacheKey = `userProfile:${username}`;

    const fetchUserProfile = async () => {
        const result = await pool.query(
            'SELECT name AS firstName, last_name AS lastName FROM users WHERE username=$1',
            [username]
        );
        if (result.rows.length === 0) {
            // Пользователь не найден или профиль не заполнен
            return { firstName: null, lastName: null };
        }
        const { firstName, lastName } = result.rows[0];
        return { firstName, lastName };
    };

    try {
        const data = await getCachedData(cacheKey, fetchUserProfile, 300); // кеш на 5 минут
        return res.json(data);
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Эндпоинт для сохранения профиля пользователя
app.post('/api/save-user-profile', async (req, res) => {
    const { username, firstName, lastName } = req.body;

    if (!username || !firstName || !lastName) {
        return res.status(400).json({ error: 'Недостаточно данных' });
    }

    try {
        await pool.query(
            'UPDATE users SET name=$1, last_name=$2 WHERE username=$3',
            [firstName, lastName, username]
        );

        // Очистка кеша для этого пользователя после обновления
        const cacheKey = `userProfile:${username}`;
        await redisClient.del(cacheKey);

        return res.json({ message: 'Профиль обновлен' });
    } catch (error) {
        console.error('Ошибка сохранения профиля:', error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
});



// Эндпоинт для входа пользователя
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Проверяем существование пользователя в БД
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (userResult.rows.length === 0) {
        return res.status(400).send('Неверное имя пользователя или пароль');
    }

    const user = userResult.rows[0];

    // Проверяем правильность пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        return res.status(400).send('Неверное имя пользователя или пароль');
    }

    // Генерируем токен с ролью
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    //Возвращаем токен, роль
    res.json({ token, role: user.role, id: user.id, });
    
});

// Эндпоинт для проверки существования пользователя
app.post('/api/check-user', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Имя пользователя не указано' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            // Пользователь существует
            return res.json({ exists: true });
        } else {
            // Пользователь не найден
            return res.json({ exists: false });
        }
    } catch (error) {
        console.error('Ошибка при проверке пользователя:', error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Эндпоинт для получения данных профиля пользователя
app.get('/api/user/profile', verifyToken, async (req, res) => {
    const userId = req.user.id; // Получаем ID пользователя из токена
    const cacheKey = `userProfile:${userId}`;

    try {
        // Попытка получить данные из кеша
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            // Если есть — парсим и возвращаем
            console.log('Данные получены из кеша');
            return res.json(JSON.parse(cachedData));
        }

        // Если в кеше нет — делаем запрос к базе
        const userResult = await pool.query(
            'SELECT name, profile_image FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).send('Пользователь не найден');
        }

        const userData = userResult.rows[0];

        // Сохраняем результат в кеш на 10 минут (600 секунд)
        await redisClient.setEx(cacheKey, 10, JSON.stringify(userData));
        console.log('Данные сохранены в кеш');

        res.json(userData);
    } catch (err) {
        console.error('Ошибка при работе с Redis или базой:', err);
        res.status(500).send('Внутренняя ошибка сервера');
    }
});

// Эндпоинт для получения информации о пользователе и его достижениях по имени пользователя
app.get('/api/user/id/:id', auth, async (req, res) => {
    const userId = req.params.id; // Получаем ID пользователя из параметров запроса

    try {
        // Получаем информацию о пользователе по ID
        const userResult = await pool.query(
            'SELECT id, name, profile_image FROM users WHERE id = $1',
            [userId] // Используем ID для получения информации о пользователе
        );

        if (userResult.rows.length === 0) {
            return res.status(404).send('Пользователь не найден');
        }

        const user = userResult.rows[0];

        // Получаем достижения пользователя
        const achievementsResult = await pool.query(
            'SELECT title, description FROM user_achievements WHERE user_id = $1',
            [user.id] // Используем ID пользователя для получения достижений
        );
        
        const avatarUrl = `https://10.100.6.123:3000/uploads/${user.profile_image}`;

        const achievements = achievementsResult.rows;

        // Возвращаем информацию о пользователе и его достижениях
        res.json({ 
            user: {
                id: user.id,
                name: user.name,
                profile_image: avatarUrl 
            },
            achievements 
        });
    } catch (err) {
        console.error('Ошибка при получении информации о пользователе:', err);
        res.status(500).send('Ошибка при получении информации о пользователе');
    }
});

app.get('/api/users/search', auth, async (req, res) => {
    const { query } = req.query;

    try {
        const result = await pool.query(
            'SELECT id, name, username FROM users WHERE name ILIKE $1',
            [`%${query}%`]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при выполнении запроса');
    }
});


// Отправить сообщение
app.post('/api/messages', auth, async (req, res) => {
  const { recipient_id, content } = req.body;
  const sender_id = req.user.id;

  // 1. Базовая валидация
  if (!recipient_id || !content) {
    return res.status(400).json({ 
      error: 'Необходимо указать получателя и текст сообщения',
      details: {
        received_data: req.body
      }
    });
  }

  if (sender_id === recipient_id) {
    return res.status(400).json({ error: 'Нельзя отправить сообщение самому себе' });
  }

  try {
    // 2. Проверка существования получателя (без is_active)
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [recipient_id]
    );
    
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // 3. Сохранение сообщения (упрощенный вариант без проверки блокировок)
    const newMessage = await pool.query(
      `INSERT INTO messages (sender_id, recipient_id, content) 
       VALUES ($1, $2, $3)
       RETURNING id, sender_id, recipient_id, content, created_at`,
      [sender_id, recipient_id, content]
    );

    // 4. Получение данных отправителя для ответа
    const senderInfo = await pool.query(
      `SELECT name, profile_image 
       FROM users 
       WHERE id = $1`,
      [sender_id]
    );

    // 5. Формирование ответа
    const response = {
      ...newMessage.rows[0],
      sender_name: senderInfo.rows[0]?.name,
      sender_avatar: senderInfo.rows[0]?.profile_image,
      status: 'delivered'
    };

    // 6. Отправка через WebSocket (если настроено)
    if (req.app.get('io')) {
      req.app.get('io').to(`user_${recipient_id}`).emit('new_message', response);
    }

    res.status(201).json(response);

  } catch (err) {
    console.error('Ошибка отправки сообщения:', {
      error: err,
      query: err.query, // Показывает проблемный SQL-запрос
      parameters: err.parameters
    });

    res.status(500).json({
      error: 'Ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        code: err.code, // Код ошибки PostgreSQL
        hint: err.hint  // Подсказка от PostgreSQL
      } : undefined
    });
  }
});

// Получить все диалоги пользователя
app.get('/api/conversations', auth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT ON (partner.id)
                partner.id as user_id,
                partner.name,
                partner.last_name,
                partner.profile_image,
                last_msg.content as last_message,
                last_msg.created_at as last_message_time,
                (
                    SELECT COUNT(*) 
                    FROM messages 
                    WHERE sender_id = partner.id 
                    AND recipient_id = $1 
                    AND is_read = false
                ) as unread_count
            FROM (
                SELECT 
                    CASE 
                        WHEN sender_id = $1 THEN recipient_id 
                        ELSE sender_id 
                    END as partner_id
                FROM messages
                WHERE sender_id = $1 OR recipient_id = $1
                GROUP BY CASE 
                    WHEN sender_id = $1 THEN recipient_id 
                    ELSE sender_id 
                    END
            ) as partners
            JOIN users partner ON partner.id = partners.partner_id
            LEFT JOIN LATERAL (
                SELECT content, created_at
                FROM messages
                WHERE (sender_id = $1 AND recipient_id = partner.id) 
                   OR (sender_id = partner.id AND recipient_id = $1)
                ORDER BY created_at DESC
                LIMIT 1
            ) as last_msg ON true
            ORDER BY partner.id, last_msg.created_at DESC
        `, [req.user.id]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении списка диалогов:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/jira-report', auth, async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'html/jira-report.php'));
  } catch (error) {
    console.error('Error serving report page:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/jira/reports', auth, async (req, res) => {
  try {
    const { start, end } = req.query;
    const username = req.user.jiraUsername || req.user.username;

    // Валидация дат
    if (!moment(start, 'YYYY-MM-DD', true).isValid() || 
        !moment(end, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Неверный формат даты. Используйте YYYY-MM-DD' });
    }

    const report = await jira.getReport(username, start, end);
    res.json(report);
  } catch (error) {
    console.error('Jira Report Error:', error);
    res.status(500).json({ 
      error: 'Ошибка при получении отчета',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Сохранение отчета в БД
async function saveJiraReport(userId, username, periodStart, periodEnd, report) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Удаляем старые отчеты за этот период
    await client.query(
      `DELETE FROM jira_reports 
       WHERE user_id = $1 AND period_start = $2 AND period_end = $3`,
      [userId, periodStart, periodEnd]
    );

    // Вставляем новый отчет
    await client.query(
      `INSERT INTO jira_reports (
        user_id, username, report_date, 
        period_start, period_end,
        total_tasks, completed_tasks, remaining_tasks, report_data
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        username,
        new Date(),
        periodStart,
        periodEnd,
        report.totalTasks,
        report.completedTasks,
        report.remainingTasks,
        JSON.stringify(report)
      ]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saving report:', err);
    throw err;
  } finally {
    client.release();
  }
}

app.get('/api/jira/report-data', auth, async (req, res) => {
  const userId = req.user.id;
  const username = req.user.jiraUsername || req.user.username;
  const currentDate = moment().format('YYYY-MM-DD');
  const cacheKey = `jira:daily-report:${username}:${currentDate}`;
  const forceRefresh = req.query.force === 'true';

  try {
    const report = await getCachedData(cacheKey, async () => {
      try {
        // Используем daysAgo из запроса или по умолчанию 1
        const daysAgo = parseInt(req.query.days) || 1;
        const freshReport = await jira.getDailyReport(username, daysAgo);
        await saveJiraReportToDB(userId, username, freshReport);
        return freshReport;
      } catch (error) {
        console.error('Error fetching fresh Jira report:', error);
        // Пробуем получить последний сохраненный отчет из БД
        const lastReport = await pool.query(
          'SELECT report_data FROM jira_reports WHERE user_id = $1 ORDER BY report_date DESC LIMIT 1',
          [userId]
        );
        if (lastReport.rows.length > 0) {
          return lastReport.rows[0].report_data;
        }
        throw error;
      }
    }, forceRefresh ? 0 : 60 * 15); // 15 минут кэша, 0 при принудительном обновлении

    res.json(report);
  } catch (error) {
    console.error('Error in /api/jira/report-data:', error);
    res.status(500).json({
      error: 'Failed to get Jira report',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Эндпоинт для получения ежедневного отчета из Jira с кэшированием и сохранением в БД
app.get('/api/jira/daily-report', auth, async (req, res) => {
  const userId = req.user.id;
  const username = req.user.jiraUsername || req.user.username;
  const cacheKey = `jira:daily-report:${username}`;
  
  try {
    const report = await getCachedData(cacheKey, async () => {
      try {
        const freshReport = await jira.getDailyReport(username);
        await saveJiraReportToDB(userId, username, freshReport);
        return freshReport;
      } catch (error) {
        console.error('Error fetching fresh Jira report:', error);
        // Попробуем получить последний сохраненный отчет из БД
        const lastReport = await pool.query(
          'SELECT report_data FROM jira_reports WHERE user_id = $1 ORDER BY report_date DESC LIMIT 1',
          [userId]
        );
        if (lastReport.rows.length > 0) {
          return lastReport.rows[0].report_data;
        }
        throw error;
      }
    }, 60 * 15); // 15 минут кэша

    res.json(report);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get Jira report',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Функция для сохранения отчета Jira в базу данных
async function saveJiraReportToDB(userId, username, report) {
  const client = await pool.connect();
  
  try {
    // Парсим даты периода из отчета
    const [startDateStr, endDateStr] = report.period.split(' - ');
    const periodStart = moment(startDateStr, 'YYYY-MM-DD').toDate();
    const periodEnd = moment(endDateStr, 'YYYY-MM-DD').toDate();
    const reportDate = new Date(); // Текущая дата и время как дата отчета

    await client.query('BEGIN');

    await client.query(
      `INSERT INTO jira_reports
       (user_id, username, report_date, period_start, period_end, 
        total_tasks, completed_tasks, remaining_tasks, report_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id, report_date)
       DO UPDATE SET
         period_start = EXCLUDED.period_start,
         period_end = EXCLUDED.period_end,
         total_tasks = EXCLUDED.total_tasks,
         completed_tasks = EXCLUDED.completed_tasks,
         remaining_tasks = EXCLUDED.remaining_tasks,
         report_data = EXCLUDED.report_data,
         updated_at = NOW()`,
      [
        userId,
        username,
        reportDate,
        periodStart,
        periodEnd,
        report.totalTasks,
        report.completedTasks,
        report.remainingTasks || 0,
        JSON.stringify(report)
      ]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saving Jira report to DB:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Маршрут для проверки пользователя и получения выполненных задач
app.get('/api/jira/user-tasks/:username', auth, async (req, res) => {
  try {
    const result = await jira.getCompletedTasks(req.params.username, {
      filterName: req.query.filter || 'count_cus',
      daysAgo: parseInt(req.query.days) || 30
    });
    
    if (!result.exists) {
      return res.status(404).json(result);
    }
    
    // Дополнительно можно сохранить в базу данных
    if (result.success && req.user?.id) {
      await saveJiraReportToDB(req.user.id, req.params.username, result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in user-tasks endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user tasks',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Маршрут только для проверки существования пользователя
app.get('/api/jira/check-user/:username', auth, async (req, res) => {
  try {
    const exists = await jira.checkUserExists(req.params.username);
    res.json({
      user: req.params.username,
      exists
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to check user existence',
      details: error.message
    });
  }
});


// Получение списка доступных пользователей
app.get('/api/users/available', auth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, last_name, profile_image
            FROM users
            WHERE id != $1 AND is_active = true
            ORDER BY name
        `, [req.user.id]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении списка пользователей:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Проверка возможности начать диалог
app.get('/api/conversations/check/:user_id', auth, async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, name, last_name, profile_image FROM users WHERE id = $1 AND is_active = true',
            [req.params.user_id]
        );
        
        if (user.rowCount === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.status(200).json({ 
            canSend: true,
            user: user.rows[0]
        });
    } catch (err) {
        console.error('Ошибка проверки диалога:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/conversations/unread', auth, async (req, res) => {
  const user_id = req.user.id;

  try {
    const unreadMessages = await pool.query(`
      SELECT 
        sender_id as user_id,
        COUNT(*) as count
      FROM messages
      WHERE recipient_id = $1 AND is_read = false
      GROUP BY sender_id
    `, [user_id]);

    res.json(unreadMessages.rows);
  } catch (err) {
    console.error('Ошибка при получении непрочитанных сообщений:', err);
    res.status(500).json({ 
      error: 'Ошибка сервера при получении непрочитанных сообщений',
      details: err.message 
    });
  }
});

// Получить сообщения с конкретным пользователем (добавим проверку существования пользователя)
app.get('/api/messages/:user_id', auth, async (req, res) => {
  const current_user_id = req.user.id;
  const other_user_id = req.params.user_id;

  // Валидация ID
  if (isNaN(other_user_id)) {
    return res.status(400).json({ error: 'Неверный ID пользователя' });
  }

  try {
    // Проверяем существует ли пользователь
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [other_user_id]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Помечаем сообщения как прочитанные
    await pool.query(
      'UPDATE messages SET is_read = true WHERE sender_id = $1 AND recipient_id = $2 AND is_read = false',
      [other_user_id, current_user_id]
    );

    // Получаем сообщения
    const messages = await pool.query(`
      SELECT m.*, 
        u1.name as sender_name, 
        u1.last_name as sender_last_name,
        u1.profile_image as sender_avatar
      FROM messages m
      JOIN users u1 ON m.sender_id = u1.id
      WHERE (m.sender_id = $1 AND m.recipient_id = $2) OR
            (m.sender_id = $2 AND m.recipient_id = $1)
      ORDER BY m.created_at ASC
    `, [current_user_id, other_user_id]);

    res.json(messages.rows);
  } catch (err) {
    console.error('Ошибка при получении сообщений:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении сообщений', details: err.message });
  }
});

app.get('/api/messages/check/:recipient_id', auth, async (req, res) => {
  const sender_id = req.user.id;
  const recipient_id = req.params.recipient_id;

  try {
    // Проверка существования пользователя
    const user = await pool.query(
      'SELECT id, name, profile_image FROM users WHERE id = $1 AND is_active = true',
      [recipient_id]
    );
    
    if (user.rowCount === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Проверка блокировок
    const isBlocked = await pool.query(
      'SELECT id FROM blocks WHERE (blocker_id = $1 AND blocked_id = $2) OR (blocker_id = $2 AND blocked_id = $1)',
      [sender_id, recipient_id]
    );
    
    if (isBlocked.rowCount > 0) {
      return res.status(200).json({ 
        canSend: false,
        reason: 'blocked',
        user: user.rows[0]
      });
    }

    res.status(200).json({ 
      canSend: true,
      user: user.rows[0]
    });
  } catch (err) {
    console.error('Ошибка проверки:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Эндпоинт для обновления данных профиля пользователя
app.put('/api/user/profile', auth, upload.single('profileImage'), async (req, res) => {
    const userId = req.user.id;
    const { name, password } = req.body;

    let updateQuery = 'UPDATE users SET name = $1';
    const values = [name];
    let paramIndex = 2;

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateQuery += `, password = $${paramIndex}`;
        values.push(hashedPassword);
        paramIndex++;
    }

    // Удаление старого изображения
    if (req.user.profile_image) {
        const oldProfileImagePath = path.join(__dirname, 'uploads', req.user.profile_image);
        if (fs.existsSync(oldProfileImagePath)) {
            fs.unlinkSync(oldProfileImagePath);
        }
    }

    // Проверка на наличие нового изображения
    if (req.file) {
        updateQuery += `, profile_image = $${paramIndex}`;
        values.push(req.file.filename);
        paramIndex++;
    }

    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`; // Добавляем RETURNING для получения обновленных данных
    values.push(userId);

    try {
        const result = await pool.query(updateQuery, values);
        const updatedUser = result.rows[0];
        
        const responseData = {
            name: updatedUser.name,
            // другие поля...
        };

        if (updatedUser.profile_image) {
            responseData.profile_image = `/uploads/${updatedUser.profile_image}`;
        }

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/user/status', auth, updateUserActivity, async (req, res) => {
    const userId = req.user.id;
    const timeoutMinutes = 5; // например, если пользователь не активен 5 минут — оффлайн

    try {
        const result = await pool.query('SELECT last_active FROM user_status WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.json({ online: false });
        }

        const lastActive = result.rows[0].last_active;
        const now = new Date();

        // Проверяем разницу во времени
        const diffMinutes = (now - new Date(lastActive)) / (1000 * 60);

        if (diffMinutes <= timeoutMinutes) {
            return res.json({ online: true });
        } else {
            // Обновляем статус на оффлайн
            await pool.query('UPDATE user_status SET is_online = false WHERE user_id = $1', [userId]);
            return res.json({ online: false });
        }
    } catch (err) {
        console.error('Ошибка получения статуса пользователя:', err);
        res.status(500).json({ online: false });
    }
});


// Эндпоинт для получения списка всех пользователей
app.get('/api/users', auth, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, profile_image, username, role FROM users'); // Получаем всех пользователей
        res.status(200).json(result.rows); // Возвращаем массив пользователей
    } catch (err) {
        console.error('Ошибка при получении списка пользователей:', err);
        res.status(500).send('Ошибка при получении списка пользователей');
    }
});

// Эндпоинт для получения информации о текущем пользователе (GET)
app.get('/api/users/:id', auth, async (req, res) => {
    const userId = req.user.id; // Получаем ID пользователя из токена

    try {
        const result = await pool.query('SELECT username, name, last_name, profile_image FROM users WHERE id = $1', [userId]);

        if (result.rowCount === 0) {
            return res.status(404).send('Пользователь не найден');
        }

        const userData = {
            username: result.rows[0].username,
            name: result.rows[0].name,
            last_name: result.rows[0].last_name
        };

        // Добавляем URL изображения, если оно есть
        if (result.rows[0].profile_image) {
            userData.profile_image = result.rows[0].profile_image;
        }

        res.status(200).json(userData);
    } catch (err) {
        console.error('Ошибка при получении информации о пользователе:', err);
        res.status(500).send('Ошибка при получении информации о пользователе');
    }
});

// Эндпоинт для обновления роли пользователя (PUT)
app.put('/api/users/:id/role', auth, checkRole('admin'), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
        return res.status(400).send('Роль обязательна');
    }

    try {
        // Получаем текущего пользователя из auth middleware
        const currentUser = req.user; // предполагается, что auth добавляет req.user

        // Получаем текущую роль пользователя-исполнителя
        const currentUserResult = await pool.query('SELECT role FROM users WHERE id = $1', [currentUser.id]);
        if (currentUserResult.rowCount === 0) {
            return res.status(404).send('Текущий пользователь не найден');
        }
        const currentUserRole = currentUserResult.rows[0].role;

        // Получаем роль пользователя, которого меняем
        const targetUserResult = await pool.query('SELECT role FROM users WHERE id = $1', [id]);
        if (targetUserResult.rowCount === 0) {
            return res.status(404).send('Пользователь не найден');
        }
        const targetUserRole = targetUserResult.rows[0].role;

        // Проверка: если пользователь пытается повысить себе роль выше своей
        if (currentUser.id === id && isHigherRole(role, currentUserRole)) {
            // Назначаем "позер"
            const poserRole = 'poser'; // или другой уровень по вашему определению
            const result = await pool.query(
                'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
                [poserRole, id]
            );
            return res.status(200).json({ message: `Вы не можете повысить себе роль выше своей. Вам назначена роль "${poserRole}".`, user: result.rows[0] });
        }

        // Также можно добавить проверку: если пользователь пытается повысить чужую роль выше своей
        if (isHigherRole(role, currentUserRole)) {
            // Можно запретить или установить "позер"
            const poserRole = 'poser';
            const result = await pool.query(
                'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
                [poserRole, id]
            );
            return res.status(200).json({ message: `Попытка повысить чужую роль запрещена. Пользователю назначена роль "${poserRole}".`, user: result.rows[0] });
        }

        // Всё в порядке — обновляем роль
        const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING *', [role, id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Пользователь не найден');
        }

        res.status(200).json({ message: 'Роль успешно обновлена', user: result.rows[0] });
    } catch (err) {
        console.error('Ошибка при обновлении роли:', err);
        res.status(500).send('Ошибка при обновлении роли');
    }
});


// Эндпоинт для получения ссылок из базы данных (GET)
app.get('/api/links', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM links');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при получении ссылок');
    }
});

// Эндпоинт для добавления новой ссылки в базу данных (POST)
app.post('/api/links', auth, checkRole(['admin', 'editor']), async (req, res) => { 
   const { url, button_text } = req.body;

   if (!url) {
       return res.status(400).send('URL обязателен');
   }

   try {
       const result = await pool.query('INSERT INTO links (url, button_text) VALUES ($1, $2) RETURNING *', [url, button_text]);
       res.status(201).json(result.rows[0]);
   } catch (err) {
       console.error('Ошибка при добавлении ссылки:', err);
       res.status(500).send('Ошибка при добавлении ссылки');
   }
});

// Эндпоинт для удаления ссылки по ID (DELETE)
app.delete('/api/links/:id', auth, checkRole('admin'), async (req, res) => { 
   const { id } = req.params;

   if (!id) {
       return res.status(400).send('ID обязателен');
   }

   try {
       const result = await pool.query('DELETE FROM links WHERE id = $1 RETURNING *', [id]);

       if (result.rowCount === 0) {
           return res.status(404).send('Запись не найдена');
       }

       res.status(200).json({ message: 'Запись успешно удалена', deleted: result.rows[0] });
   } catch (err) {
       console.error('Ошибка при удалении ссылки:', err);
       res.status(500).send('Ошибка при удалении ссылки');
   }
});

// Эндпоинт для удаления пользователя
app.delete('/api/users/:id', auth, checkRole('admin'), async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('ID обязателен');
    }

    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Пользователь не найден');
        }

        res.status(200).json({ message: 'Пользователь успешно удален', deleted: result.rows[0] });
    } catch (err) {
        console.error('Ошибка при удалении пользователя:', err);
        res.status(500).send('Ошибка при удалении пользователя');
    }
});


// Эндпоинт для получения информации о пользователе и отображения кнопки admin (GET)
app.get('/api/users/:id/admin-button', auth, async (req, res) => {
    const userId = req.user.id; // Получаем ID текущего пользователя из токена

    try {
        const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);

        if (result.rowCount === 0) {
            return res.status(404).send('Пользователь не найден');
        }
        
        const user = result.rows[0];

        // Проверяем, является ли текущий пользователь администратором
        const showAdminButton = user.role === 'admin';

        res.status(200).json({ showAdminButton });
    } catch (err) {
        console.error('Ошибка при получении роли пользователя:', err);
        res.status(500).send('Ошибка при получении роли пользователя');
    }
});

// Эндпоинт для парсинга достижений
app.get('/api/available_achievements', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM achievements');
        
        // Возвращаем данные в формате JSON
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении достижений:', err);
        res.status(500).send('Ошибка при получении достижений');
    }
});

// Эндпоинт для присвоения достижения пользователю
app.post('/api/achievements', auth, checkRole('admin'), async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    try {
        // Проверяем, существует ли достижение
        const achievementResult = await pool.query(
            'SELECT * FROM achievements WHERE title = $1',
            [title]
        );

        if (achievementResult.rows.length === 0) {
            return res.status(404).json({ message: 'Достижение не найдено' });
        }

        // Проверяем, есть ли уже такое достижение у пользователя
        const existingAchievement = await pool.query(
            'SELECT * FROM user_achievements WHERE user_id = $1 AND title = $2',
            [userId, title]
        );

        if (existingAchievement.rows.length > 0) {
            return res.status(400).json({ message: 'Вы уже получили это достижение' });
        }

        // Добавляем достижение пользователю
        await pool.query(
            'INSERT INTO user_achievements (user_id, title, username, description) VALUES ($1, $2, $3, $4)',
            [userId, title, username, achievementResult.rows[0].description]
        );

        res.status(201).json({ 
            message: 'Достижение успешно присвоено',
            achievement: {
                title,
                description: achievementResult.rows[0].description
            }
        });
    } catch (err) {
        console.error('Ошибка при присвоении достижения:', err);
        res.status(500).json({ message: 'Ошибка при присвоении достижения' });
    }
});

// Эндпоинт для получения всех достижений
app.get('/api/achievements', auth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.title, a.description, a.username 
            FROM achievements a 
            
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении достижений:', err);
        res.status(500).send('Ошибка при получении достижений');
    }
});

// Эндпоинт для получения достижений текущего пользователя
app.get('/api/my_achievements', auth, async (req, res) => {
    const userId = req.user.id; // Получаем ID текущего пользователя из токена

    try {
        const result = await pool.query(
            'SELECT title, description FROM user_achievements WHERE user_id = $1',
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении достижений пользователя:', err);
        res.status(500).send('Ошибка при получении достижений пользователя');
    }
});

// Эндпоинт для получения достижений других пользователей
app.get('/api/other_achievements', auth, async (req, res) => {
    const userId = req.user.id; // Получаем ID текущего пользователя из токена

    try {
        const result = await pool.query(
            'SELECT title, description, username FROM user_achievements WHERE user_id != $1',
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении достижений других пользователей:', err);
        res.status(500).send('Ошибка при получении достижений других пользователей');
    }
});

// Получение всех статей с возможностью фильтрации по категории
app.get('/api/articles', auth, async (req, res) => {
  try {
    const { category_id } = req.query;
    let query = `
      SELECT a.*, c.name as category_name, u.name as author_name, u.last_name as author_last_name
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
    `;
    
    const params = [];
    
    if (category_id) {
      query += ' WHERE a.category_id = $1';
      params.push(category_id);
    }
    
    query += ' ORDER BY a.created_at DESC';
    
    const articlesResult = await pool.query(query, params);
    res.json(articlesResult.rows);
  } catch (err) {
    console.error('Ошибка при получении статей:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создание новой статьи с категорией
app.post('/api/articles', auth, async (req, res) => {
  const { title, content, category_id } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Заголовок и содержание обязательны' });
  }
  
  try {
    // Проверяем существование категории, если она указана
    if (category_id) {
      const categoryCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [category_id]);
      if (categoryCheck.rowCount === 0) {
        return res.status(400).json({ error: 'Указанная категория не существует' });
      }
    }
    
    const result = await pool.query(
      `INSERT INTO articles (title, content, author_id, category_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, content, req.user.id, category_id || null]
    );
    
    res.status(201).json({ message: 'Статья успешно создана', article: result.rows[0] });
  } catch (err) {
    console.error('Ошибка при создании статьи:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/articles/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const currentUser = req.user;
    const articleResult = await pool.query('SELECT author_id FROM articles WHERE id = $1', [id]);

    if (articleResult.rowCount === 0) {
      return res.status(404).json({ error: 'Статья не найдена' });
    }

    const article = articleResult.rows[0];

    // Проверка прав
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [currentUser.id]);
    const userRole = userResult.rows[0].role;

    if (article.author_id !== currentUser.id && !['admin', 'moderator'].includes(userRole)) {
      return res.status(403).json({ error: 'Нет прав на удаление этой статьи' });
    }

    // Удаляем статью
    await pool.query('DELETE FROM articles WHERE id = $1', [id]);

    res.json({ message: 'Статья успешно удалена' });
  } catch (err) {
    console.error('Ошибка при удалении статьи:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление статьи (включая категорию)
app.put('/api/articles/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, content, category_id } = req.body;

  try {
    const currentUser = req.user;
    const articleResult = await pool.query('SELECT author_id FROM articles WHERE id = $1', [id]);

    if (articleResult.rowCount === 0) {
      return res.status(404).json({ error: 'Статья не найдена' });
    }

    const article = articleResult.rows[0];

    // Проверка прав
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [currentUser.id]);
    const userRole = userResult.rows[0].role;

    if (article.author_id !== currentUser.id && !['admin', 'moderator'].includes(userRole)) {
      return res.status(403).json({ error: 'Нет прав на редактирование этой статьи' });
    }

    // Проверяем существование категории, если она указана
    if (category_id) {
      const categoryCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [category_id]);
      if (categoryCheck.rowCount === 0) {
        return res.status(400).json({ error: 'Указанная категория не существует' });
      }
    }

    // Обновляем статью
    const updatedArticle = await pool.query(
      `UPDATE articles 
       SET title = $1, content = $2, category_id = $3 
       WHERE id = $4 RETURNING *`,
      [title, content, category_id || null, id]
    );

    res.json({ message: 'Статья обновлена', article: updatedArticle.rows[0] });
  } catch (err) {
    console.error('Ошибка при обновлении статьи:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение конкретной статьи
app.get('/api/articles/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const articleResult = await pool.query(
      `SELECT a.*, c.name as category_name, u.name as author_name, u.last_name as author_last_name
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN users u ON a.author_id = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (articleResult.rowCount === 0) {
      return res.status(404).json({ error: 'Статья не найдена' });
    }

    res.json(articleResult.rows[0]);
  } catch (err) {
    console.error('Ошибка при получении статьи:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
})

// Маршруты для работы с категориями

// Получение всех категорий
app.get('/api/categories', auth, async (req, res) => {
  try {
    const categoriesResult = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(categoriesResult.rows);
  } catch (err) {
    console.error('Ошибка при получении категорий:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение популярных категорий
app.get('/api/categories/popular', auth, async (req, res) => {
  try {
    const popularCategories = await pool.query(`
      SELECT c.id, c.name, COUNT(a.id) as article_count 
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id
      GROUP BY c.id
      ORDER BY article_count DESC
      LIMIT 5
    `);
    res.json(popularCategories.rows);
  } catch (err) {
    console.error('Ошибка при получении популярных категорий:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создание новой категории (только для админов/модераторов)
app.post('/api/categories', auth, async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Название категории обязательно' });
  }
  
  try {
    // Проверяем права пользователя
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    const userRole = userResult.rows[0].role;
    
    if (!['admin', 'moderator'].includes(userRole)) {
      return res.status(403).json({ error: 'Недостаточно прав для создания категорий' });
    }
    
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    
    res.status(201).json({ message: 'Категория успешно создана', category: result.rows[0] });
  } catch (err) {
    console.error('Ошибка при создании категории:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление категории (только для админов/модераторов)
app.delete('/api/categories/:id', auth, async (req, res) => {
  const { id } = req.params;
  
  try {
    // Проверяем права пользователя
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    const userRole = userResult.rows[0].role;
    
    if (!['admin', 'moderator'].includes(userRole)) {
      return res.status(403).json({ error: 'Недостаточно прав для удаления категорий' });
    }
    
    // Удаляем связь статей с этой категорией
    await pool.query('UPDATE articles SET category_id = NULL WHERE category_id = $1', [id]);
    
    // Удаляем саму категорию
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    res.json({ message: 'Категория успешно удалена', category: result.rows[0] });
  } catch (err) {
    console.error('Ошибка при удалении категории:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение статей текущего пользователя
app.get('/api/user/articles', auth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*, c.name as category_name 
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.author_id = $1
            ORDER BY a.created_at DESC
        `, [req.user.id]);
        
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении статей пользователя:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


app.post('/api/computer/register', async (req, res) => {
  const { hostname } = req.body;

  if (!hostname) {
    return res.status(400).json({ message: 'Hostname is required' });
  }

  try {
    // Проверяем, есть ли уже такой компьютер
    const existing = await pool.query('SELECT * FROM computers WHERE hostname=$1', [hostname]);

    if (existing.rows.length > 0) {
      return res.status(200).json({ message: 'Computer already registered' });
    }

    // Добавляем новую запись
    await pool.query(
      'INSERT INTO computers (hostname, status, last_seen) VALUES ($1, $2, NOW())',
      [hostname, 'online']
    );

    res.json({ message: 'Computer registered successfully' });
  } catch (err) {
    console.error('Ошибка при регистрации компьютера:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/computer/:hostname/status', async (req, res) => {
  const { hostname } = req.params;
  const result = await pool.query('SELECT * FROM computers WHERE hostname=$1', [hostname]);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Computer not found' });
  
  const computer = result.rows[0];
  
  // Обновляем статус последнего обращения
  await pool.query('UPDATE computers SET last_seen=NOW() WHERE id=$1', [computer.id]);
  
  res.json({ status: computer.status });
});

app.get('/api/agents', async (req, res) => {
  try {
    const result = await pool.query('SELECT hostname FROM computers');
    const hostnames = result.rows.map(row => row.hostname);
    res.json(hostnames);
  } catch (err) {
    console.error('Ошибка при получении хостнеймов:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/send-command', auth, checkRole('admin'), async (req, res) => {
  const { command_type, is_custom } = req.body;
  const hostname = req.body.hostname || null; // по желанию

  // Получить компьютер по hostname или ID пользователя/сервера

  // Предположим у вас есть функция получения компьютера по hostname

  const computerResult = await pool.query('SELECT * FROM computers WHERE hostname=$1', [hostname]);
  if (computerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Computer not found' });
  }
  const computerId = computerResult.rows[0].id;

  // Создать новую команду с статусом pending
  await pool.query(
      `INSERT INTO commands (computer_id, command_type, status) VALUES ($1,$2,'pending')`,
      [computerId, command_type]
  );

  res.json({ message: 'Команда добавлена' });
});

app.post('/api/commands/:commandId/result', async (req, res) => {
  const { commandId } = req.params;
  const { status } = req.body; // например, 'completed', 'failed'

  await pool.query(
      `UPDATE commands SET status=$1 WHERE id=$2`,
      [status, commandId]
  );

  res.json({ message: 'Result received' });
});

app.get('/api/computer/:hostname/commands', async (req, res) => {
  const { hostname } = req.params;
  const result = await pool.query('SELECT * FROM computers WHERE hostname=$1', [hostname]);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Computer not found' });
  
  const computerId = result.rows[0].id;

  // Получить последнюю команду со статусом pending или active
  const cmdResult = await pool.query(
      `SELECT * FROM commands WHERE computer_id=$1 AND status='pending' ORDER BY created_at LIMIT 1`,
      [computerId]
  );

  if (cmdResult.rows.length === 0) {
      return res.json({}); // Нет новых команд
  }

  const command = cmdResult.rows[0];

  res.json({
      command_id: command.id,
      command_type: command.command_type,
      status: command.status,
  });
});
        
// Пример защищенного маршрута с проверкой роли пользователя
app.get('/api/protected', auth, async (req, res) => {
     try {
         const role = await getUserRole(req.user.id); // Получаем роль текущего пользователя

         if(role === 'admin') {
             return res.send(`Привет ${req.user.username}, вы администратор!`);
         } else if(role === 'editor') {
             return res.send(`Привет ${req.user.username}, вы редактор!`);
         } else {
             return res.send(`Привет ${req.user.username}, у вас нет специальных прав!`);
         }
     } catch(err) {
         console.error(err);
         return res.status(500).send("Ошибка при получении информации о пользователе");
     }
 });



// Создаем HTTPS сервер
app.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${port}`);
});

// Обработка ошибок приложения
app.on('error', (error) => {
  console.error('Ошибка приложения:', error);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Получен сигнал завершения, закрываем соединения...');
  
  if (redisClient.isOpen) {
    await redisClient.quit();
    console.log('Соединение с Redis закрыто');
  }
  
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
