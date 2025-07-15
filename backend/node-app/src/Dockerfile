FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

COPY ./backend/node-app/src/package.json /usr/src/app/
# Копируем package.json и устанавливаем зависимости
#COPY package*.json ./

# Установите зависимости приложения
RUN npm install

# Копируем все остальные файлы приложения
COPY ./backend/node-app/src .

# Копируем сертификаты
COPY ./backend/node-app/src/certs /usr/src/app/certs

# Открываем порт, на котором будет работать приложение
EXPOSE 3000

# Запускаем приложение
CMD ["node", "server.js"]
