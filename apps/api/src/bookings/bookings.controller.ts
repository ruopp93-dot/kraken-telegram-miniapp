import { Controller, Get, Post, Delete, Body, Param, Query, ValidationPipe } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body(ValidationPipe) createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto)
  }

  @Get('user/:telegramUserId')
  async getUserBookings(@Param('telegramUserId') telegramUserId: string) {
    return this.bookingsService.getUserBookings(telegramUserId)
  }

  @Delete(':bookingId')
  async cancelBooking(
    @Param('bookingId') bookingId: string,
    @Query('telegramUserId') telegramUserId: string,
  ) {
    return this.bookingsService.cancelBooking(bookingId, telegramUserId)
  }
}
