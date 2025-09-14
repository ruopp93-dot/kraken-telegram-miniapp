import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AvailabilityService } from '../availability/availability.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { addMinutes, differenceInMinutes, format, isWeekend, getDay } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

@Injectable()
export class BookingsService {
  private readonly timezone = 'Europe/Moscow'
  
  constructor(
    private prisma: PrismaService,
    private availabilityService: AvailabilityService,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    const { pcId, startTime, endTime, telegramUserId, userName, userPhone, notes, additionalJoysticks = 0 } = createBookingDto

    // Parse dates and convert to Moscow timezone
    const startDate = new Date(startTime)
    const endDate = new Date(endTime)
    const moscowStart = utcToZonedTime(startDate, this.timezone)
    const moscowEnd = utcToZonedTime(endDate, this.timezone)

    // Validate booking duration (minimum 1 hour, maximum 8 hours)
    const durationMinutes = differenceInMinutes(moscowEnd, moscowStart)
    if (durationMinutes < 60) {
      throw new BadRequestException('Минимальная продолжительность бронирования - 1 час')
    }
    if (durationMinutes > 480) {
      throw new BadRequestException('Максимальная продолжительность бронирования - 8 часов')
    }

    // Check if PC exists and is active
    const pc = await this.prisma.pC.findUnique({
      where: { id: pcId },
      include: { zone: true },
    })

    if (!pc || pc.status !== 'ACTIVE') {
      throw new NotFoundException('ПК не найден или недоступен')
    }

    // Check availability
    const isAvailable = await this.availabilityService.checkSlotAvailability(pcId, moscowStart, moscowEnd)
    if (!isAvailable) {
      throw new ConflictException('Выбранное время уже забронировано')
    }

    // Get or create user
    let user = await this.prisma.user.findUnique({
      where: { telegramId: telegramUserId },
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          telegramId: telegramUserId,
          name: userName,
          phone: userPhone,
        },
      })
    } else {
      // Update user info if provided
      if (userName !== user.name || (userPhone && userPhone !== user.phone)) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            name: userName,
            ...(userPhone && { phone: userPhone }),
          },
        })
      }
    }

    // Calculate pricing
    const pricing = await this.calculatePricing(pc.zoneId, moscowStart, moscowEnd, additionalJoysticks)

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        userId: user.id,
        pcId,
        startTime: moscowStart,
        endTime: moscowEnd,
        status: 'ACTIVE',
        totalPrice: pricing.totalPrice,
        notes,
        additionalJoysticks,
      },
      include: {
        user: true,
        pc: {
          include: { zone: true },
        },
      },
    })

    return {
      id: booking.id,
      pc: {
        id: pc.id,
        label: pc.label,
        zone: pc.zone,
      },
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: durationMinutes,
      pricing,
      user: {
        name: user.name,
        phone: user.phone,
      },
      additionalJoysticks,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt,
    }
  }

  async getUserBookings(telegramUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: telegramUserId },
    })

    if (!user) {
      return []
    }

    const bookings = await this.prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        pc: {
          include: { zone: true },
        },
      },
      orderBy: { startTime: 'desc' },
    })

    return bookings.map(booking => ({
      id: booking.id,
      pc: {
        id: booking.pc.id,
        label: booking.pc.label,
        zone: booking.pc.zone,
      },
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: differenceInMinutes(booking.endTime, booking.startTime),
      totalPrice: booking.totalPrice,
      additionalJoysticks: booking.additionalJoysticks,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt,
    }))
  }

  async cancelBooking(bookingId: string, telegramUserId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        pc: { include: { zone: true } },
      },
    })

    if (!booking) {
      throw new NotFoundException('Бронирование не найдено')
    }

    if (booking.user.telegramId !== telegramUserId) {
      throw new BadRequestException('Вы можете отменить только свои бронирования')
    }

    if (booking.status !== 'ACTIVE') {
      throw new BadRequestException('Бронирование уже отменено или завершено')
    }

    // Check if booking can be cancelled (before start time)
    const now = new Date()
    if (booking.startTime <= now) {
      throw new BadRequestException('Нельзя отменить начавшееся бронирование')
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: {
        pc: { include: { zone: true } },
      },
    })

    return {
      id: updatedBooking.id,
      pc: {
        id: updatedBooking.pc.id,
        label: updatedBooking.pc.label,
        zone: updatedBooking.pc.zone,
      },
      startTime: updatedBooking.startTime,
      endTime: updatedBooking.endTime,
      status: updatedBooking.status,
    }
  }

  private async calculatePricing(zoneId: string, startTime: Date, endTime: Date, additionalJoysticks: number = 0) {
    const durationMinutes = differenceInMinutes(endTime, startTime)
    const durationHours = durationMinutes / 60

    // Get pricing rules for the zone
    const pricingRules = await this.prisma.pricingRule.findMany({
      where: { zoneId },
    })

    if (pricingRules.length === 0) {
      throw new BadRequestException('Тарифы для данной зоны не найдены')
    }

    // Determine if it's weekend (Friday 18:00 to Sunday 22:00)
    const isWeekendTime = this.isWeekendTime(startTime, endTime)
    
    // Find appropriate pricing rule
    let bestRule = null
    let bestPrice = Infinity

    for (const rule of pricingRules) {
      if (rule.type === 'HOURLY') {
        const hourlyRate = isWeekendTime ? rule.weekendPrice : rule.weekdayPrice
        const totalPrice = hourlyRate * durationHours
        
        if (totalPrice < bestPrice) {
          bestPrice = totalPrice
          bestRule = rule
        }
      } else if (rule.type === 'PACKAGE' && rule.durationHours && durationHours >= rule.durationHours) {
        const packagePrice = isWeekendTime ? rule.weekendPrice : rule.weekdayPrice
        
        if (packagePrice < bestPrice) {
          bestPrice = packagePrice
          bestRule = rule
        }
      }
    }

    if (!bestRule) {
      // Fallback to hourly rate
      const hourlyRule = pricingRules.find(r => r.type === 'HOURLY')
      if (hourlyRule) {
        const hourlyRate = isWeekendTime ? hourlyRule.weekendPrice : hourlyRule.weekdayPrice
        bestPrice = hourlyRate * durationHours
        bestRule = hourlyRule
      } else {
        throw new BadRequestException('Не удалось рассчитать стоимость')
      }
    }

    // Add joystick cost (50₽ per joystick for PS5)
    const joystickCost = additionalJoysticks * 50

    return {
      basePrice: bestPrice,
      joystickCost,
      totalPrice: bestPrice + joystickCost,
      rule: {
        type: bestRule.type,
        name: bestRule.name,
        isWeekend: isWeekendTime,
      },
      duration: {
        hours: durationHours,
        minutes: durationMinutes,
      },
    }
  }

  private isWeekendTime(startTime: Date, endTime: Date): boolean {
    // Weekend is Friday 18:00 to Sunday 22:00
    const start = utcToZonedTime(startTime, this.timezone)
    const end = utcToZonedTime(endTime, this.timezone)
    
    const startDay = getDay(start) // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
    const endDay = getDay(end)
    const startHour = start.getHours()
    const endHour = end.getHours()
    
    // Check if any part of the booking falls within weekend hours
    if (startDay === 5 && startHour >= 18) return true // Friday after 18:00
    if (startDay === 6) return true // Saturday
    if (startDay === 0 && startHour < 22) return true // Sunday before 22:00
    if (endDay === 5 && endHour >= 18) return true
    if (endDay === 6) return true
    if (endDay === 0 && endHour <= 22) return true
    
    return false
  }
}
