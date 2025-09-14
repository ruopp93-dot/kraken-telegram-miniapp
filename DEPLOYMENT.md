# 🚀 KRAKEN Cyber Arena - Руководство по деплою

## Подготовка к деплою

### 1. Настройка базы данных PostgreSQL

Создайте PostgreSQL базу данных на одном из сервисов:
- **Vercel Postgres** (рекомендуется)
- **Neon** (neon.tech)
- **Supabase** (supabase.com)

### 2. Настройка переменных окружения

В панели Vercel добавьте следующие переменные:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/kraken_db?schema=public"

# Telegram Bot
TELEGRAM_BOT_TOKEN="your_bot_token_from_@BotFather"
TELEGRAM_WEB_APP_URL="https://your-app-name.vercel.app"

# App URLs
API_BASE_URL="https://your-app-name.vercel.app/api"
WEB_APP_URL="https://your-app-name.vercel.app"

# System
TZ="Europe/Moscow"
NODE_ENV="production"
```

### 3. Деплой через Vercel CLI

```bash
# 1. Установите Vercel CLI (если не установлен)
npm install -g vercel

# 2. Авторизуйтесь в Vercel
vercel login

# 3. Задеплойте проект
vercel

# 4. Для продакшен деплоя
vercel --prod
```

### 4. Инициализация базы данных

После деплоя выполните миграции:

```bash
# Генерация Prisma клиента
npx prisma generate

# Применение миграций
npx prisma db push

# Заполнение данными
npx prisma db seed
```

### 5. Настройка Telegram бота

1. Получите токен бота от @BotFather
2. Настройте webhook:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-app-name.vercel.app/api/webhook/telegram"}'
```

3. Настройте Web App в боте:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setChatMenuButton" \
     -H "Content-Type: application/json" \
     -d '{"menu_button": {"type": "web_app", "text": "🎮 Забронировать", "web_app": {"url": "https://your-app-name.vercel.app"}}}'
```

## Проверка деплоя

1. **Frontend**: Откройте https://your-app-name.vercel.app
2. **API**: Проверьте https://your-app-name.vercel.app/api/zones
3. **Telegram**: Отправьте `/start` боту

## Структура проекта

```
kraken-telegram-miniapp/
├── apps/
│   ├── api/          # NestJS Backend API
│   └── web/          # React Frontend
├── vercel.json       # Vercel конфигурация
├── netlify.toml      # Netlify конфигурация (альтернатива)
└── .env.production   # Продакшен переменные
```

## Возможные проблемы

### Database connection issues
- Проверьте правильность DATABASE_URL
- Убедитесь, что база данных доступна из Vercel

### Telegram webhook issues
- Проверьте, что TELEGRAM_BOT_TOKEN корректный
- Убедитесь, что webhook URL доступен

### Build errors
- Проверьте логи сборки в Vercel Dashboard
- Убедитесь, что все зависимости установлены

## Мониторинг

- **Vercel Dashboard**: Логи и метрики
- **Telegram Bot**: Проверка через @BotFather
- **Database**: Мониторинг через провайдера БД

🎮 **KRAKEN Cyber Arena готов к работе!**
