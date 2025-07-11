function checkRoles(roles) {
    return (req, res, next) => {
        console.log('Проверка ролей:', req.user ? req.user.role : 'Пользователь не авторизован');

        if (req.user && roles.includes(req.user.role)) {
            next(); // Пользователь имеет одну из нужных ролей
        } else {
            console.error('Доступ запрещен: недостаточно прав');
            return res.status(403).send('Доступ запрещен');
        }
    };
}

module.exports = checkRoles;