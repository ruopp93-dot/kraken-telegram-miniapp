import { Module } from '@nestjs/common'
import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'
import { TelegramModule } from '../telegram/telegram.module'
import { BookingsModule } from '../bookings/bookings.module'
import { ZonesModule } from '../zones/zones.module'

@Module({
  imports: [TelegramModule, BookingsModule, ZonesModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
