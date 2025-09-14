import { Controller, Get, Param, NotFoundException } from '@nestjs/common'
import { ZonesService } from './zones.service'

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  async getAllZones() {
    const zones = await this.zonesService.getAllZones()
    
    return zones.map(zone => ({
      id: zone.id,
      name: zone.name,
      displayName: zone.displayName,
      description: zone.description,
      color: zone.color,
      totalPCs: zone._count.pcs,
      availablePCs: zone.pcs.length, // This would need real availability check
      pcs: zone.pcs.map(pc => ({
        id: pc.id,
        label: pc.label,
        status: pc.status,
      })),
    }))
  }

  @Get(':zoneId')
  async getZoneById(@Param('zoneId') zoneId: string) {
    const zone = await this.zonesService.getZoneById(zoneId)
    
    if (!zone) {
      throw new NotFoundException('Zone not found')
    }

    return {
      id: zone.id,
      name: zone.name,
      displayName: zone.displayName,
      description: zone.description,
      color: zone.color,
      pcs: zone.pcs.map(pc => ({
        id: pc.id,
        label: pc.label,
        specs: pc.specs,
        status: pc.status,
      })),
    }
  }

  @Get(':zoneId/pcs')
  async getPCsByZone(@Param('zoneId') zoneId: string) {
    const pcs = await this.zonesService.getPCsByZone(zoneId)
    
    return pcs.map(pc => ({
      id: pc.id,
      label: pc.label,
      specs: pc.specs,
      status: pc.status,
      zone: pc.zone,
    }))
  }
}
