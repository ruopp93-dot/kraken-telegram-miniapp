import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { addDays, startOfDay, endOfDay, addMinutes, format, isWithinInterval } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'

@Injectable()
export class AvailabilityService {
  private readonly timezone = 'Europe/Moscow'
  
  constructor(private prisma: PrismaService) {}

  async getAvailability(date?: string, zoneId?: string) {
    const targetDate = date ? new Date(date) : new Date()
    const moscowDate = utcToZonedTime(targetDate, this.timezone)
    const dayStart = startOfDay(moscowDate)
    const dayEnd = endOfDay(moscowDate)

    // Get all active PCs
    const whereClause: any = { status: 'ACTIVE' }
    if (zoneId) {
      whereClause.zoneId = zoneId
    }

    const pcs = await this.prisma.pC.findMany({
      where: whereClause,
      include: {
        zone: true,
        bookings: {
          where: {
            status: 'ACTIVE',
            startTime: { lte: dayEnd },
            endTime: { gte: dayStart },
          },
        },
      },
    })

    // Generate time slots (30-minute intervals from 09:00 to 23:30)
    const timeSlots = this.generateTimeSlots()

    return pcs.map(pc => ({
      id: pc.id,
      label: pc.label,
      zone: pc.zone,
      specs: pc.specs,
      availability: timeSlots.map(slot => {
        const slotStart = this.createDateTime(moscowDate, slot)
        const slotEnd = addMinutes(slotStart, 30)
        
        // Check if slot conflicts with any booking
        const isBooked = pc.bookings.some(booking => 
          isWithinInterval(slotStart, { start: booking.startTime, end: booking.endTime }) ||
          isWithinInterval(slotEnd, { start: booking.startTime, end: booking.endTime }) ||
          (slotStart <= booking.startTime && slotEnd >= booking.endTime)
        )

        return {
          time: slot,
          available: !isBooked,
        }
      }),
    }))
  }

  async checkSlotAvailability(pcId: string, startTime: Date, endTime: Date) {
    const conflictingBookings = await this.prisma.booking.findMany({
      where: {
        pcId,
        status: 'ACTIVE',
        OR: [
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime },
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime },
          },
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime },
          },
        ],
      },
    })

    return conflictingBookings.length === 0
  }

  async getZoneAvailabilitySummary(date?: string) {
    const targetDate = date ? new Date(date) : new Date()
    const moscowDate = utcToZonedTime(targetDate, this.timezone)
    const dayStart = startOfDay(moscowDate)
    const dayEnd = endOfDay(moscowDate)

    const zones = await this.prisma.zone.findMany({
      where: { active: true },
      include: {
        pcs: {
          where: { status: 'ACTIVE' },
          include: {
            bookings: {
              where: {
                status: 'ACTIVE',
                startTime: { lte: dayEnd },
                endTime: { gte: dayStart },
              },
            },
          },
        },
      },
    })

    return zones.map(zone => {
      const totalPCs = zone.pcs.length
      const currentTime = new Date()
      
      // Count PCs that are currently available (not in active booking right now)
      const availablePCs = zone.pcs.filter(pc => {
        return !pc.bookings.some(booking => 
          isWithinInterval(currentTime, { start: booking.startTime, end: booking.endTime })
        )
      }).length

      return {
        id: zone.id,
        name: zone.name,
        displayName: zone.displayName,
        description: zone.description,
        color: zone.color,
        totalPCs,
        availablePCs,
        occupancyRate: totalPCs > 0 ? Math.round(((totalPCs - availablePCs) / totalPCs) * 100) : 0,
      }
    })
  }

  private generateTimeSlots(): string[] {
    const slots: string[] = []
    
    // Generate slots from 09:00 to 23:30 in 30-minute intervals
    for (let hour = 9; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(timeString)
      }
    }
    
    return slots
  }

  private createDateTime(date: Date, timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number)
    const result = new Date(date)
    result.setHours(hours, minutes, 0, 0)
    return result
  }

  async getNextAvailableSlot(pcId: string, duration: number = 60) {
    const now = new Date()
    const moscowNow = utcToZonedTime(now, this.timezone)
    
    // Check next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const checkDate = addDays(moscowNow, dayOffset)
      const timeSlots = this.generateTimeSlots()
      
      for (const slot of timeSlots) {
        const slotStart = this.createDateTime(checkDate, slot)
        const slotEnd = addMinutes(slotStart, duration)
        
        // Skip past slots for today
        if (dayOffset === 0 && slotStart <= moscowNow) {
          continue
        }
        
        const isAvailable = await this.checkSlotAvailability(pcId, slotStart, slotEnd)
        
        if (isAvailable) {
          return {
            date: format(checkDate, 'yyyy-MM-dd'),
            time: slot,
            startTime: slotStart,
            endTime: slotEnd,
          }
        }
      }
    }
    
    return null
  }
}
