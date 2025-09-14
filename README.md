# KRAKEN Cyber Arena - Telegram Mini App

Telegram Mini App для бронирования компьютеров в киберарене KRAKEN (Великий Новгород).

## Особенности

- 🎮 **Зоны**: Standard (15 ПК), VIP (10 ПК), Premium (5 ПК), PS5 (2 консоли)
- ⏰ **Бронирование**: слоты по 30 минут, минимум 1 час, горизонт 7 дней
- 💰 **Прайс**: будни/выходные, пакеты утро/день/ночь
- 🎨 **Дизайн**: тёмная тема с неоновыми акцентами KRAKEN
- 📱 **UX**: Telegram WebApp + бот для уведомлений

## Структура проекта

```
kraken-telegram-miniapp/
├── apps/
│   ├── web/          # React + TS + Vite (Mini App)
│   └── api/          # NestJS + Prisma (Backend)
├── package.json      # Workspace root
└── README.md
```

## Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
```bash
# В apps/api создайте .env
cp apps/api/.env.example apps/api/.env
```

Заполните:
- `TELEGRAM_BOT_TOKEN` - токен от @BotFather для @KRAKEN_CYBERbot
- `DATABASE_URL` - строка подключения к PostgreSQL
- `APP_BASE_URL` - URL вашего Vercel проекта

### 3. База данных
```bash
# Миграции
npm run db:migrate

# Заполнение тестовыми данными (зоны, ПК, прайс)
npm run db:seed

# Просмотр данных (опционально)
npm run db:studio
```

### 4. Запуск dev-серверов
```bash
# Запуск web + api одновременно
npm run dev

# Или по отдельности:
npm run dev:web   # http://localhost:5173
npm run dev:api   # http://localhost:3000
```

## Деплой на Vercel

### 1. Создание проекта
```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

### 2. Настройка переменных
В Vercel Dashboard → Settings → Environment Variables добавьте:
- `TELEGRAM_BOT_TOKEN`
- `DATABASE_URL` (Neon/PlanetScale/Supabase)
- `TZ=Europe/Moscow`

### 3. Подключение Telegram бота
После деплоя установите webhook:
```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-app.vercel.app/api/webhook"}'
```

### 4. Настройка Mini App
В @BotFather:
1. `/setmenubutton` → выберите @KRAKEN_CYBERbot
2. Установите URL: `https://your-app.vercel.app`
3. Текст кнопки: "🎮 Забронировать"

## Архитектура

### Frontend (apps/web)
- **React 18** + TypeScript + Vite
- **Telegram Web Apps SDK** для интеграции
- **Тёмная тема KRAKEN**: #0B1220, #00E7D4, #F20FFF
- **Шрифты**: Inter SemiBold, JetBrains Mono

### Backend (apps/api)
- **NestJS** + TypeScript
- **Prisma ORM** + PostgreSQL
- **Serverless** для Vercel Functions
- **Timezone**: Europe/Moscow

### База данных
- **Zones**: standard, vip, premium, ps5
- **PCs**: S-01..S-15, VIP-01..VIP-10, PR-01..PR-05, PS5-01..PS5-02
- **Bookings**: слоты, статусы, пользователи
- **PricingRules**: будни/выходные, пакеты времени

## API Endpoints

- `POST /api/webhook` - Telegram webhook
- `GET /api/availability` - доступность ПК/слотов
- `POST /api/bookings` - создание брони
- `GET /api/bookings/:userId` - брони пользователя
- `DELETE /api/bookings/:id` - отмена брони

## Команды разработки

```bash
# Разработка
npm run dev              # web + api
npm run dev:web          # только frontend
npm run dev:api          # только backend

# Сборка
npm run build            # web + api
npm run build:web        # только frontend
npm run build:api        # только backend

# База данных
npm run db:migrate       # применить миграции
npm run db:seed          # заполнить тестовыми данными
npm run db:studio        # Prisma Studio
```

## Поддержка

- **Telegram**: @KRAKEN_CYBERbot
- **Локация**: Великий Новгород
- **Часовой пояс**: Europe/Moscow (UTC+3)
