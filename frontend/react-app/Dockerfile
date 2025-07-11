# Этап сборки React-приложения
FROM node:18-alpine as builder

WORKDIR /app
COPY ./frontend/react-app/package*.json ./
RUN npm install
COPY ./frontend/react-app/ .
RUN npm run build

# Финальный образ
FROM nginx:alpine

# Копируем собранное React-приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY ./frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Копируем SSL сертификаты
COPY ./frontend/nginx/ssl/ /etc/nginx/ssl/

# Копируем uploads из Node.js приложения
COPY ./backend/node-app/src/uploads /usr/share/nginx/html/uploads

# Открываем порты
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
