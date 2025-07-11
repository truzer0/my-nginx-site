const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const auth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Получаем токен из заголовка

    if (!token) {
        console.error('Токен не предоставлен');
        return res.status(401).send('Токен не предоставлен');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Ошибка при проверке токена:', err);
            return res.status(401).send('Недействительный токен');
        }
        req.user = user; // Сохраняем информацию о пользователе в запросе
        next(); // Переходим к следующему middleware или маршруту
    });
};

module.exports = auth
