<?php
require_once 'config.php';
session_start();

// Функция для безопасного вывода HTML
function escapeHtml($text) {
    if (!$text) return '';
    $map = [
        '&' => '&amp;',
        '<' => '&lt;',
        '>' => '&gt;',
        '"' => '&quot;',
        "'" => '&#039;'
    ];
    return str_replace(array_keys($map), array_values($map), $text);
}

// Функция для форматирования даты
function formatDate($dateString) {
    $date = new DateTime($dateString);
    return $date->format('d.m.Y');
}

// Получаем ID статьи из GET-параметра
$articleId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Загружаем статью из базы данных
$article = null;
$similarArticles = [];

if ($articleId > 0) {
    try {
        // Запрос для получения статьи
        $stmt = $pdo->prepare("
            SELECT a.*, c.name as category_name, 
                   u.name as author_name, u.last_name as author_last_name, u.profile_image as author_avatar
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            LEFT JOIN users u ON a.author_id = u.id
            WHERE a.id = ?
        ");
        $stmt->execute([$articleId]);
        $article = $stmt->fetch(PDO::FETCH_ASSOC);

        // Если статья найдена, загружаем похожие статьи
        if ($article) {
            $stmt = $pdo->prepare("
                SELECT a.*, c.name as category_name
                FROM articles a
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE a.category_id = ? AND a.id != ?
                ORDER BY a.created_at DESC
                LIMIT 3
            ");
            $stmt->execute([$article['category_id'], $articleId]);
            $similarArticles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    } catch (PDOException $e) {
        error_log('Ошибка при загрузке статьи: ' . $e->getMessage());
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<link rel="icon" href="data:image/jpeg;base64,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" type="image/jpeg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $article ? escapeHtml($article['title']) : 'Статья не найдена' ?></title>
    <style>
        :root {
            --dark-bg: #2a2a2a;
            --darker-bg: #1e1e1e;
            --card-bg: #333333;
            --text-color: #f0f0f0;
            --accent-color: #4361ee;
            --accent-hover: #3a56d4;
            --border-radius: 8px;
            --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            --transition: all 0.3s ease;
        }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: var(--dark-bg);
            margin: 0;
            padding: 20px;
            color: var(--text-color);
            line-height: 1.6;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        .article-header {
            margin-bottom: 30px;
        }

        .article-title {
            font-size: 28px;
            margin-bottom: 10px;
            color: var(--text-color);
        }

        .article-meta {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            color: #aaa;
            font-size: 14px;
        }

        .author-info {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .author-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
        }

        .article-category {
            background-color: var(--accent-color);
            color: white;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 12px;
        }

        .article-content {
            background-color: var(--card-bg);
            padding: 25px;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            margin-bottom: 30px;
            white-space: pre-wrap;
        }

        .article-actions {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: var(--transition);
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary {
            background-color: var(--accent-color);
            color: white;
        }

        .btn-primary:hover {
            background-color: var(--accent-hover);
        }

        .btn-secondary {
            background-color: var(--darker-bg);
            color: var(--text-color);
        }

        .btn-secondary:hover {
            background-color: #3a3a3a;
        }

        .similar-articles {
            margin-top: 40px;
        }

        .section-title {
            font-size: 22px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #444;
        }

        .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }

        .article-card {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            padding: 15px;
            transition: var(--transition);
        }

        .article-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.4);
        }

        .article-card-title {
            font-size: 16px;
            margin-bottom: 8px;
        }

        .article-card-meta {
            font-size: 12px;
            color: #aaa;
            display: flex;
            justify-content: space-between;
        }

        .error-message {
            text-align: center;
            padding: 40px;
            color: #ff6b6b;
        }

        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: var(--accent-color);
            text-decoration: none;
        }

        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="javascript:history.back()" class="back-link">← Назад</a>
        
        <?php if (!$article): ?>
            <div class="error-message">
                <p>Статья не найдена</p>
                <a href="/index.html" class="btn btn-secondary">На главную</a>
            </div>
        <?php else: ?>
            <div class="article-header">
                <h1 class="article-title"><?= escapeHtml($article['title']) ?></h1>
                <div class="article-meta">
                    <div class="author-info">
                        <img src="<?= $article['author_avatar'] ? BASE_UPLOAD_URL . escapeHtml($article['author_avatar']) : 'https://via.placeholder.com/32' ?>" 
                             class="author-avatar" 
                             alt="<?= escapeHtml($article['author_name'] . ' ' . escapeHtml($article['author_last_name'])) ?>">
                        <span><?= escapeHtml($article['author_name']) ?> <?= escapeHtml($article['author_last_name']) ?></span>
                    </div>
                    <span><?= formatDate($article['created_at']) ?></span>
                    <?php if ($article['category_name']): ?>
                        <span class="article-category"><?= escapeHtml($article['category_name']) ?></span>
                    <?php endif; ?>
                </div>
            </div>
            <div class="article-content"><?= escapeHtml($article['content']) ?></div>
            <div class="article-actions">
                <?php if (isset($_SESSION['user_id'])): ?>
                    <a href="/edit-article.php?id=<?= $article['id'] ?>" class="btn btn-primary">Редактировать</a>
                <?php endif; ?>
                <a href="/index.html" class="btn btn-secondary">На главную</a>
            </div>

            <?php if (!empty($similarArticles)): ?>
                <div class="similar-articles">
                    <h3 class="section-title">Похожие статьи</h3>
                    <div class="articles-grid">
                        <?php foreach ($similarArticles as $similar): ?>
                            <a href="/article.php?id=<?= $similar['id'] ?>" class="article-card">
                                <h4 class="article-card-title"><?= escapeHtml($similar['title']) ?></h4>
                                <div class="article-card-meta">
                                    <span><?= formatDate($similar['created_at']) ?></span>
                                    <?php if ($similar['category_name']): ?>
                                        <span><?= escapeHtml($similar['category_name']) ?></span>
                                    <?php endif; ?>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</body>
</html>
