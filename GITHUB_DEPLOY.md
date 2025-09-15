# 🚀 Деплой через GitHub + Vercel Dashboard

## Альтернативный способ деплоя (если CLI не работает)

### Шаг 1: Загрузка на GitHub

1. Создайте новый репозиторий на GitHub:
   - Название: `kraken-cyber-arena`
   - Описание: `KRAKEN Cyber Arena - Telegram Mini App for PC booking`
   - Публичный репозиторий

2. Подключите локальный репозиторий:
```bash
git remote add origin https://github.com/YOUR_USERNAME/kraken-cyber-arena.git
git branch -M main
git push -u origin main
```

### Шаг 2: Импорт в Vercel

1. Перейдите на https://vercel.com/dashboard
2. Нажмите "New Project"
3. Выберите "Import Git Repository"
4. Найдите репозиторий `kraken-cyber-arena`
5. Настройте проект:
   - **Project Name**: `kraken-cyber-arena`
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `apps/web/dist`

### Шаг 3: Настройка Environment Variables

В настройках проекта Vercel добавьте переменные:

```
DATABASE_URL = "postgresql://..."
TELEGRAM_BOT_TOKEN = "your_bot_token"
TELEGRAM_WEB_APP_URL = "https://kraken-cyber-arena.vercel.app"
API_BASE_URL = "https://kraken-cyber-arena.vercel.app/api"
WEB_APP_URL = "https://kraken-cyber-arena.vercel.app"
TZ = "Europe/Moscow"
NODE_ENV = "production"
```

### Шаг 4: Deploy

Нажмите "Deploy" - Vercel автоматически соберет и задеплоит проект.

### Готово! 🎉

Ваше приложение будет доступно по адресу:
`https://kraken-cyber-arena.vercel.app`
