# Используем официальный образ Nginx
FROM nginx:latest

# Копируем файлы из папки html в директорию, где Nginx ищет статические файлы
COPY ./frontend/html /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY ./frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Копируй SSL сертификаты
COPY ./frontend/nginx/ssl/ /etc/nginx/ssl/

# Открываем порт 80,443
EXPOSE 80 443
