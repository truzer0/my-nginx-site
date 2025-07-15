# Этап сборки
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Копируем файлы зависимостей
COPY ./frontend/react-app/package.json ./
COPY ./frontend/react-app/package-lock.json ./

# 2. Установка зависимостей с кэшированием
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/.npm \
    npm install --legacy-peer-deps --prefer-offline --no-audit --progress=false

# 3. Копируем исходный код
COPY ./frontend/react-app/ ./

# 4. Сборка приложения (с очисткой предыдущей сборки)
RUN rm -rf .next && \
    npm run build

# 5. Проверка сборки
RUN [ -f .next/BUILD_ID ] || (echo "Build failed - missing BUILD_ID" && exit 1)

# Финальный образ
FROM node:18-alpine

WORKDIR /app

# Копируем только необходимое для production
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Настройки
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Запуск
CMD ["npm", "start"]
