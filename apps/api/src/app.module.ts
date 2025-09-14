import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { PrismaModule } from './prisma/prisma.module'
import { WebhookModule } from './webhook/webhook.module'
import { ZonesModule } from './zones/zones.module'
import { BookingsModule } from './bookings/bookings.module'
import { AvailabilityModule } from './availability/availability.module'
import { TelegramModule } from './telegram/telegram.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    WebhookModule,
    ZonesModule,
    BookingsModule,
    AvailabilityModule,
    TelegramModule,
  ],
})
export class AppModule {}
