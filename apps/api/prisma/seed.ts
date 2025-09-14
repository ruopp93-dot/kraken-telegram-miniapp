import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding KRAKEN Cyber Arena database...')

  // Create zones
  const standardZone = await prisma.zone.upsert({
    where: { name: 'standard' },
    update: {},
    create: {
      name: 'standard',
      displayName: 'Standard',
      description: 'RTX 3060 • Samsung Odyssey 240Hz',
      color: '#2BE6A0',
      sortOrder: 1,
    },
  })

  const vipZone = await prisma.zone.upsert({
    where: { name: 'vip' },
    update: {},
    create: {
      name: 'vip',
      displayName: 'VIP',
      description: 'RTX 4060 Ti • MSI 360Hz',
      color: '#00E7D4',
      sortOrder: 2,
    },
  })

  const premiumZone = await prisma.zone.upsert({
    where: { name: 'premium' },
    update: {},
    create: {
      name: 'premium',
      displayName: 'Premium',
      description: 'RTX 4070 • LG 27" 240Hz',
      color: '#F20FFF',
      sortOrder: 3,
    },
  })

  const ps5Zone = await prisma.zone.upsert({
    where: { name: 'ps5' },
    update: {},
    create: {
      name: 'ps5',
      displayName: 'PlayStation 5',
      description: 'PS5 • Эксклюзивы PlayStation',
      color: '#FFC857',
      sortOrder: 4,
    },
  })

  console.log('✅ Zones created')

  // Create Standard PCs (15 units: S-01 to S-15)
  const standardSpecs = {
    cpu: 'Intel Core i5-12400F',
    gpu: 'RTX 3060',
    monitor: 'Samsung Odyssey 25" 240Hz',
    mouse: 'Logitech G102',
    keyboard: 'Red Square TKL',
    headphones: 'HyperX Cloud II',
    mousepad: 'ARDOR Jacquard',
    chair: 'Knight Titan'
  }

  for (let i = 1; i <= 15; i++) {
    const label = `S-${i.toString().padStart(2, '0')}`
    await prisma.pC.upsert({
      where: { label },
      update: {},
      create: {
        label,
        zoneId: standardZone.id,
        specs: standardSpecs,
        status: 'ACTIVE',
      },
    })
  }

  // Create VIP PCs (10 units: VIP-01 to VIP-10)
  const vipSpecs = {
    cpu: 'Intel Core i5-12400F',
    gpu: 'RTX 4060 Ti',
    monitor: 'MSI 25" 360Hz',
    mouse: 'Razer DeathAdder V2 X',
    keyboard: 'Razer BlackWidow V3 TKL',
    headphones: 'HyperX Cloud II',
    mousepad: 'ARDOR Jacquard',
    chair: 'Knight Titan'
  }

  for (let i = 1; i <= 10; i++) {
    const label = `VIP-${i.toString().padStart(2, '0')}`
    await prisma.pC.upsert({
      where: { label },
      update: {},
      create: {
        label,
        zoneId: vipZone.id,
        specs: vipSpecs,
        status: 'ACTIVE',
      },
    })
  }

  // Create Premium PCs (5 units: PR-01 to PR-05)
  const premiumSpecs = {
    cpu: 'Intel Core i5-12400F',
    gpu: 'RTX 4070',
    monitor: 'LG 27" 240Hz',
    mouse: 'Dark Project x VGN F1 Black',
    keyboard: 'Dark Project KD83',
    headphones: 'HyperX Cloud III',
    mousepad: 'SkillGroup',
    chair: 'DXRacer Gladiator'
  }

  for (let i = 1; i <= 5; i++) {
    const label = `PR-${i.toString().padStart(2, '0')}`
    await prisma.pC.upsert({
      where: { label },
      update: {},
      create: {
        label,
        zoneId: premiumZone.id,
        specs: premiumSpecs,
        status: 'ACTIVE',
      },
    })
  }

  // Create PS5 units (2 units: PS5-01 to PS5-02)
  const ps5Specs = {
    console: 'PlayStation 5',
    type: 'Gaming Console',
    features: 'Эксклюзивы PlayStation, доп. джойстик +50₽'
  }

  for (let i = 1; i <= 2; i++) {
    const label = `PS5-${i.toString().padStart(2, '0')}`
    await prisma.pC.upsert({
      where: { label },
      update: {},
      create: {
        label,
        zoneId: ps5Zone.id,
        specs: ps5Specs,
        status: 'ACTIVE',
      },
    })
  }

  console.log('✅ PCs created')

  // Create pricing rules based on KRAKEN price list
  const pricingRules = [
    // Standard Zone - Hourly
    { zoneId: standardZone.id, type: 'HOURLY', name: 'Почасовой тариф', weekdayPrice: 13000, weekendPrice: 14000, durationHours: 1 }, // 130₽/140₽

    // VIP Zone - Hourly  
    { zoneId: vipZone.id, type: 'HOURLY', name: 'Почасовой тариф', weekdayPrice: 15000, weekendPrice: 16000, durationHours: 1 }, // 150₽/160₽

    // Premium Zone - Hourly
    { zoneId: premiumZone.id, type: 'HOURLY', name: 'Почасовой тариф', weekdayPrice: 17000, weekendPrice: 19000, durationHours: 1 }, // 170₽/190₽

    // PS5 - Hourly
    { zoneId: ps5Zone.id, type: 'HOURLY', name: 'Почасовой тариф', weekdayPrice: 20000, weekendPrice: 25000, durationHours: 1 }, // 200₽/250₽
  ]

  for (const rule of pricingRules) {
    await prisma.pricingRule.create({
      data: rule,
    })
  }

  console.log('✅ Pricing rules created')

  // Create some calendar exceptions for holidays
  const holidays2024 = [
    new Date('2024-01-01'), // New Year
    new Date('2024-01-07'), // Orthodox Christmas
    new Date('2024-02-23'), // Defender of the Fatherland Day
    new Date('2024-03-08'), // International Women's Day
    new Date('2024-05-01'), // Labour Day
    new Date('2024-05-09'), // Victory Day
    new Date('2024-06-12'), // Russia Day
    new Date('2024-11-04'), // Unity Day
  ]

  for (const holiday of holidays2024) {
    await prisma.calendarException.upsert({
      where: { date: holiday },
      update: {},
      create: {
        date: holiday,
        type: 'holiday',
        active: true,
      },
    })
  }

  console.log('✅ Calendar exceptions created')
  console.log('🎉 KRAKEN Cyber Arena database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
