# 🚀 Быстрый деплой KRAKEN Cyber Arena

## Шаг 1: Авторизация в Vercel
Откройте ссылку из терминала и авторизуйтесь в Vercel, затем нажмите ENTER в терминале.

## Шаг 2: Настройка проекта в Vercel
После авторизации Vercel CLI предложит настроить проект:

```
? Set up and deploy "kraken-telegram-miniapp"? [Y/n] Y
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? [y/N] N
? What's your project's name? kraken-cyber-arena
? In which directory is your code located? ./
```

## Шаг 3: Настройка PostgreSQL базы данных

### Вариант A: Vercel Postgres (рекомендуется)
1. Перейдите в Vercel Dashboard → Storage → Create Database → Postgres
2. Скопируйте DATABASE_URL из настроек

### Вариант B: Neon (бесплатно)
1. Зарегистрируйтесь на https://neon.tech
2. Создайте новую базу данных
3. Скопируйте connection string

## Шаг 4: Настройка переменных окружения в Vercel

В Vercel Dashboard → Settings → Environment Variables добавьте:

```
DATABASE_URL = "postgresql://..."
TELEGRAM_BOT_TOKEN = "получите от @BotFather"
TELEGRAM_WEB_APP_URL = "https://kraken-cyber-arena.vercel.app"
API_BASE_URL = "https://kraken-cyber-arena.vercel.app/api"
WEB_APP_URL = "https://kraken-cyber-arena.vercel.app"
TZ = "Europe/Moscow"
NODE_ENV = "production"
```

## Шаг 5: Инициализация базы данных

После настройки переменных окружения:

```powershell
# Установите DATABASE_URL локально для миграций
$env:DATABASE_URL="your_postgres_connection_string"

# Запустите скрипт настройки БД
.\setup-db.ps1
```

## Шаг 6: Настройка Telegram бота

1. Получите токен от @BotFather:
   ```
   /newbot
   Название: KRAKEN Cyber Arena
   Username: kraken_cyber_arena_bot
   ```

2. Настройте webhook:
   ```bash
   curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "https://kraken-cyber-arena.vercel.app/api/webhook/telegram"}'
   ```

3. Настройте Web App кнопку:
   ```bash
   curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setChatMenuButton" \
        -H "Content-Type: application/json" \
        -d '{"menu_button": {"type": "web_app", "text": "🎮 Забронировать", "web_app": {"url": "https://kraken-cyber-arena.vercel.app"}}}'
   ```

## Шаг 7: Проверка деплоя

1. **Frontend**: https://kraken-cyber-arena.vercel.app
2. **API**: https://kraken-cyber-arena.vercel.app/api/zones
3. **Telegram**: Отправьте `/start` боту

## 🎉 Готово!

Ваше приложение KRAKEN Cyber Arena теперь доступно в продакшене!
