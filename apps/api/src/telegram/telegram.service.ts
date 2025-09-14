import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

interface TelegramMessage {
  chat: {
    id: number
    type: string
  }
  from?: {
    id: number
    first_name: string
    last_name?: string
    username?: string
  }
  text?: string
  web_app_data?: {
    data: string
    button_text: string
  }
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name)
  private readonly botToken: string
  private readonly webAppUrl: string

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN')
    this.webAppUrl = this.configService.get<string>('TELEGRAM_WEB_APP_URL')
  }

  async sendMessage(chatId: number, text: string, options?: any) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          ...options,
        }),
      })

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      this.logger.error(`Failed to send message to ${chatId}:`, error)
      throw error
    }
  }

  async sendBookingConfirmation(chatId: number, booking: any) {
    const message = `
🎮 <b>Бронирование подтверждено!</b>

📍 <b>ПК:</b> ${booking.pc.label} (${booking.pc.zone.displayName})
⏰ <b>Время:</b> ${this.formatDateTime(booking.startTime)} - ${this.formatTime(booking.endTime)}
⏱️ <b>Длительность:</b> ${Math.round(booking.duration / 60)} ч.
💰 <b>Стоимость:</b> ${booking.pricing.totalPrice} ₽

${booking.additionalJoysticks > 0 ? `🎮 <b>Доп. джойстики:</b> ${booking.additionalJoysticks} шт.\n` : ''}
${booking.notes ? `📝 <b>Примечания:</b> ${booking.notes}\n` : ''}

<i>Отменить бронирование можно до начала сеанса.</i>
`

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '📱 Открыть приложение',
            web_app: { url: this.webAppUrl }
          }
        ],
        [
          {
            text: '❌ Отменить бронирование',
            callback_data: `cancel_booking_${booking.id}`
          }
        ]
      ]
    }

    return this.sendMessage(chatId, message, { reply_markup: keyboard })
  }

  async sendBookingReminder(chatId: number, booking: any, minutesBefore: number) {
    const message = `
⏰ <b>Напоминание о бронировании!</b>

Ваш сеанс начнется через ${minutesBefore} минут.

📍 <b>ПК:</b> ${booking.pc.label} (${booking.pc.zone.displayName})
⏰ <b>Время:</b> ${this.formatDateTime(booking.startTime)} - ${this.formatTime(booking.endTime)}

🏢 <b>Адрес:</b> Великий Новгород, ул. Примерная, 1
📞 <b>Телефон:</b> +7 (999) 123-45-67

Ждем вас в KRAKEN Cyber Arena! 🎮
`

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '📱 Открыть приложение',
            web_app: { url: this.webAppUrl }
          }
        ]
      ]
    }

    return this.sendMessage(chatId, message, { reply_markup: keyboard })
  }

  async sendCancellationConfirmation(chatId: number, booking: any) {
    const message = `
❌ <b>Бронирование отменено</b>

📍 <b>ПК:</b> ${booking.pc.label} (${booking.pc.zone.displayName})
⏰ <b>Время:</b> ${this.formatDateTime(booking.startTime)} - ${this.formatTime(booking.endTime)}

Вы можете забронировать другое время через приложение.
`

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '📱 Забронировать снова',
            web_app: { url: this.webAppUrl }
          }
        ]
      ]
    }

    return this.sendMessage(chatId, message, { reply_markup: keyboard })
  }

  async handleStart(message: TelegramMessage) {
    const welcomeText = `
🎮 <b>Добро пожаловать в KRAKEN Cyber Arena!</b>

Здесь вы можете забронировать игровые ПК и PS5 консоли в нашем киберспортивном клубе в Великом Новгороде.

<b>Наши зоны:</b>
🖥️ Standard - RTX 3060, 240Hz мониторы
💎 VIP - RTX 4060 Ti, 360Hz мониторы  
👑 Premium - RTX 4070, 240Hz мониторы
🎮 PS5 - консоли с дополнительными джойстиками

<b>Часы работы:</b> 09:00 - 00:00
<b>Адрес:</b> Великий Новгород, ул. Примерная, 1
<b>Телефон:</b> +7 (999) 123-45-67
`

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '🎮 Забронировать ПК',
            web_app: { url: this.webAppUrl }
          }
        ],
        [
          {
            text: '📋 Мои бронирования',
            callback_data: 'my_bookings'
          },
          {
            text: '📞 Поддержка',
            callback_data: 'support'
          }
        ]
      ]
    }

    return this.sendMessage(message.chat.id, welcomeText, { reply_markup: keyboard })
  }

  private formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Moscow'
    }).format(date)
  }

  private formatTime(date: Date): string {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Moscow'
    }).format(date)
  }
}
