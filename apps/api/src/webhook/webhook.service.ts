import { Injectable, Logger } from '@nestjs/common'
import { TelegramService } from '../telegram/telegram.service'
import { BookingsService } from '../bookings/bookings.service'

interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    from: {
      id: number
      is_bot: boolean
      first_name: string
      last_name?: string
      username?: string
    }
    chat: {
      id: number
      first_name?: string
      last_name?: string
      username?: string
      type: string
    }
    date: number
    text?: string
    web_app_data?: {
      data: string
      button_text: string
    }
  }
  callback_query?: {
    id: string
    from: {
      id: number
      is_bot: boolean
      first_name: string
      last_name?: string
      username?: string
    }
    message: {
      message_id: number
      chat: {
        id: number
        type: string
      }
    }
    data: string
  }
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name)

  constructor(
    private telegramService: TelegramService,
    private bookingsService: BookingsService,
  ) {}

  async handleUpdate(update: TelegramUpdate) {
    try {
      this.logger.debug(`Received update: ${JSON.stringify(update)}`)

      if (update.message) {
        await this.handleMessage(update.message)
      } else if (update.callback_query) {
        await this.handleCallbackQuery(update.callback_query)
      }
    } catch (error) {
      this.logger.error('Error handling update:', error)
    }
  }

  private async handleMessage(message: any) {
    const text = message.text?.trim()

    if (text === '/start') {
      await this.telegramService.handleStart(message)
    } else if (message.web_app_data) {
      await this.handleWebAppData(message)
    } else {
      // Handle other text messages
      await this.handleTextMessage(message)
    }
  }

  private async handleWebAppData(message: any) {
    try {
      const data = JSON.parse(message.web_app_data.data)
      
      if (data.type === 'booking_created') {
        // Web app notifies about successful booking
        const booking = data.booking
        await this.telegramService.sendBookingConfirmation(message.chat.id, booking)
      }
    } catch (error) {
      this.logger.error('Error handling web app data:', error)
      await this.telegramService.sendMessage(
        message.chat.id,
        '❌ Произошла ошибка при обработке данных приложения.'
      )
    }
  }

  private async handleTextMessage(message: any) {
    const text = message.text?.toLowerCase()

    if (text?.includes('бронирование') || text?.includes('забронировать')) {
      const keyboard = {
        inline_keyboard: [
          [
            {
              text: '🎮 Забронировать ПК',
              web_app: { url: process.env.TELEGRAM_WEB_APP_URL }
            }
          ]
        ]
      }

      await this.telegramService.sendMessage(
        message.chat.id,
        'Для бронирования ПК используйте наше приложение:',
        { reply_markup: keyboard }
      )
    } else if (text?.includes('помощь') || text?.includes('поддержка')) {
      await this.handleSupport(message.chat.id)
    } else {
      // Default response
      await this.telegramService.sendMessage(
        message.chat.id,
        'Используйте команду /start для начала работы с ботом.'
      )
    }
  }

  private async handleCallbackQuery(callbackQuery: any) {
    const data = callbackQuery.data

    if (data === 'my_bookings') {
      await this.handleMyBookings(callbackQuery)
    } else if (data === 'support') {
      await this.handleSupport(callbackQuery.message.chat.id)
    } else if (data.startsWith('cancel_booking_')) {
      const bookingId = data.replace('cancel_booking_', '')
      await this.handleCancelBooking(callbackQuery, bookingId)
    }

    // Answer callback query to remove loading state
    await this.answerCallbackQuery(callbackQuery.id)
  }

  private async handleMyBookings(callbackQuery: any) {
    try {
      const telegramUserId = callbackQuery.from.id.toString()
      const bookings = await this.bookingsService.getUserBookings(telegramUserId)

      if (bookings.length === 0) {
        await this.telegramService.sendMessage(
          callbackQuery.message.chat.id,
          '📋 У вас пока нет активных бронирований.\n\nИспользуйте приложение для создания нового бронирования.',
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🎮 Забронировать ПК',
                    web_app: { url: process.env.TELEGRAM_WEB_APP_URL }
                  }
                ]
              ]
            }
          }
        )
        return
      }

      const activeBookings = bookings.filter(b => b.status === 'ACTIVE')
      
      let message = '📋 <b>Ваши бронирования:</b>\n\n'
      
      activeBookings.forEach((booking, index) => {
        const startTime = new Intl.DateTimeFormat('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Moscow'
        }).format(booking.startTime)

        const endTime = new Intl.DateTimeFormat('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Moscow'
        }).format(booking.endTime)

        message += `${index + 1}. <b>${booking.pc.label}</b> (${booking.pc.zone.displayName})\n`
        message += `   ⏰ ${startTime} - ${endTime}\n`
        message += `   💰 ${booking.totalPrice} ₽\n\n`
      })

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: '📱 Открыть приложение',
              web_app: { url: process.env.TELEGRAM_WEB_APP_URL }
            }
          ]
        ]
      }

      await this.telegramService.sendMessage(
        callbackQuery.message.chat.id,
        message,
        { reply_markup: keyboard }
      )
    } catch (error) {
      this.logger.error('Error fetching user bookings:', error)
      await this.telegramService.sendMessage(
        callbackQuery.message.chat.id,
        '❌ Произошла ошибка при загрузке ваших бронирований.'
      )
    }
  }

  private async handleCancelBooking(callbackQuery: any, bookingId: string) {
    try {
      const telegramUserId = callbackQuery.from.id.toString()
      const cancelledBooking = await this.bookingsService.cancelBooking(bookingId, telegramUserId)
      
      await this.telegramService.sendCancellationConfirmation(
        callbackQuery.message.chat.id,
        cancelledBooking
      )
    } catch (error) {
      this.logger.error('Error cancelling booking:', error)
      await this.telegramService.sendMessage(
        callbackQuery.message.chat.id,
        '❌ Не удалось отменить бронирование. Возможно, оно уже началось или было отменено ранее.'
      )
    }
  }

  private async handleSupport(chatId: number) {
    const message = `
📞 <b>Поддержка KRAKEN Cyber Arena</b>

<b>Контакты:</b>
📱 Телефон: +7 (999) 123-45-67
📧 Email: support@kraken-arena.ru
🌐 Сайт: kraken-arena.ru

<b>Адрес:</b>
🏢 Великий Новгород, ул. Примерная, 1

<b>Часы работы:</b>
🕘 Ежедневно: 09:00 - 00:00

<b>Социальные сети:</b>
📱 VK: vk.com/kraken_arena
📷 Instagram: @kraken_arena

Мы всегда готовы помочь! 🎮
`

    await this.telegramService.sendMessage(chatId, message)
  }

  private async answerCallbackQuery(callbackQueryId: string, text?: string) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to answer callback query: ${response.statusText}`)
      }
    } catch (error) {
      this.logger.error('Error answering callback query:', error)
    }
  }
}
