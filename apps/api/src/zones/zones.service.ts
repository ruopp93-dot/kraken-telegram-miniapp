import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  async getAllZones() {
    return this.prisma.zone.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        pcs: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            label: true,
            status: true,
          },
        },
        _count: {
          select: {
            pcs: {
              where: { status: 'ACTIVE' },
            },
          },
        },
      },
    })
  }

  async getZoneById(zoneId: string) {
    return this.prisma.zone.findUnique({
      where: { id: zoneId },
      include: {
        pcs: {
          where: { status: 'ACTIVE' },
          orderBy: { label: 'asc' },
        },
      },
    })
  }

  async getZoneByName(name: string) {
    return this.prisma.zone.findUnique({
      where: { name },
      include: {
        pcs: {
          where: { status: 'ACTIVE' },
          orderBy: { label: 'asc' },
        },
      },
    })
  }

  async getPCsByZone(zoneId: string) {
    return this.prisma.pC.findMany({
      where: {
        zoneId,
        status: 'ACTIVE',
      },
      orderBy: { label: 'asc' },
      include: {
        zone: {
          select: {
            name: true,
            displayName: true,
            color: true,
          },
        },
      },
    })
  }

  async getPCById(pcId: string) {
    return this.prisma.pC.findUnique({
      where: { id: pcId },
      include: {
        zone: true,
      },
    })
  }

  async getPCByLabel(label: string) {
    return this.prisma.pC.findUnique({
      where: { label },
      include: {
        zone: true,
      },
    })
  }
}
