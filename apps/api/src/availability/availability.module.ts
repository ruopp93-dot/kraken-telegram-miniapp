import { Module } from '@nestjs/common'
import { AvailabilityController } from './availability.controller'
import { AvailabilityService } from './availability.service'
import { ZonesModule } from '../zones/zones.module'

@Module({
  imports: [ZonesModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
