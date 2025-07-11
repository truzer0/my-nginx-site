<?php
// Настройки подключения к базе данных PostgreSQL
$host = 'db'; // имя сервиса базы данных
$dbname = 'Link';
$user = 'CYS';
$pass = 'kjT346bjTDF';
$charset = 'utf8';

$dsn = "pgsql:host=$host;port=5432;dbname=$dbname;options='--client_encoding=$charset'";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}

// Базовые URL
define('BASE_URL', 'http://10.100.6.123:3000');
define('BASE_UPLOAD_URL', BASE_URL . '/uploads/');

?>
