import { Module } from '@nestjs/common'
import { BookingsController } from './bookings.controller'
import { BookingsService } from './bookings.service'
import { ZonesModule } from '../zones/zones.module'
import { AvailabilityModule } from '../availability/availability.module'

@Module({
  imports: [ZonesModule, AvailabilityModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
