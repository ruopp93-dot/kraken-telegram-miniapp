import { Controller, Get, Query, Param } from '@nestjs/common'
import { AvailabilityService } from './availability.service'

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getAvailability(
    @Query('date') date?: string,
    @Query('zoneId') zoneId?: string,
  ) {
    return this.availabilityService.getAvailability(date, zoneId)
  }

  @Get('zones')
  async getZoneAvailabilitySummary(@Query('date') date?: string) {
    return this.availabilityService.getZoneAvailabilitySummary(date)
  }

  @Get('pc/:pcId/next-slot')
  async getNextAvailableSlot(
    @Param('pcId') pcId: string,
    @Query('duration') duration?: string,
  ) {
    const durationMinutes = duration ? parseInt(duration) : 60
    return this.availabilityService.getNextAvailableSlot(pcId, durationMinutes)
  }
}
