# Используем официальный образ PHP с FPM
FROM php:8.2-fpm

# Обновляем пакеты и устанавливаем необходимые расширения
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql

# Копируем файлы проекта в контейнер
WORKDIR /var/www/html

# Копируем локальные файлы проекта (если есть)
 COPY ./frontend/html /var/www/html

# Настраиваем права доступа (по необходимости)
# RUN chown -R www-data:www-data /var/www/html

# Настройки PHP-FPM
COPY ./php-fpm/php.ini /usr/local/etc/php/conf.d/custom.ini

EXPOSE 9000

CMD ["php-fpm"]
