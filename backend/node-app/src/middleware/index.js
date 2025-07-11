const express = require('express');
const { exec } = require('child_process');

const router = express.Router();

router.get('/api/zabbix/check', (req, res) => {
    exec('systemctl is-active zabbix-agent', (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка при выполнении команды: ${stderr}`);
            return res.status(500).json({ message: 'Ошибка при проверке работы Zabbix агента' });
        }

        // Проверяем вывод команды
        if (stdout.trim() === 'active') {
            res.status(200).json({ message: 'Zabbix агент работает' });
        } else {
            res.status(500).json({ message: 'Zabbix агент не запущен' });
        }
    });
});

module.exports = router;