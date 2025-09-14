import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // Enable CORS for Telegram Web App
  app.enableCors({
    origin: [
      'https://web.telegram.org',
      process.env.TELEGRAM_WEB_APP_URL || 'http://localhost:5173',
      /\.vercel\.app$/,
    ],
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  // Set timezone
  process.env.TZ = process.env.TZ || 'Europe/Moscow'

  const port = process.env.PORT || 3000
  await app.listen(port)
  
  console.log(`🚀 KRAKEN API running on port ${port}`)
}

// For Vercel serverless deployment
if (process.env.VERCEL) {
  module.exports = bootstrap()
} else {
  bootstrap()
}
