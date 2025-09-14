import { Controller, Post, Body, HttpCode } from '@nestjs/common'
import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('telegram')
  @HttpCode(200)
  async handleTelegramWebhook(@Body() update: any) {
    await this.webhookService.handleUpdate(update)
    return { ok: true }
  }
}
