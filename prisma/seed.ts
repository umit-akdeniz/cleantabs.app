import { PrismaClient } from '@prisma/client'
import { categories, initialSites } from '../src/lib/data'

const prisma = new PrismaClient()

async function main() {
  // Önce mevcut verileri temizle
  await prisma.subLink.deleteMany()
  await prisma.tag.deleteMany() 
  await prisma.site.deleteMany()
  await prisma.subcategory.deleteMany()
  await prisma.category.deleteMany()

  // Kategorileri ve alt kategorileri oluştur
  for (const category of categories) {
    await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        subcategories: {
          create: category.subcategories.map(sub => ({
            id: sub.id,
            name: sub.name,
            icon: sub.icon
          }))
        }
      }
    })
  }

  // Siteleri oluştur
  for (const site of initialSites) {
    await prisma.site.create({
      data: {
        id: site.id,
        name: site.name,
        url: site.url,
        description: site.description,
        color: site.color,
        reminderEnabled: site.reminderEnabled,
        subcategoryId: site.subcategoryId,
        tags: {
          create: site.tags.map(tag => ({ name: tag }))
        },
        subLinks: {
          create: site.subLinks.map(subLink => ({
            name: subLink.name,
            url: subLink.url
          }))
        }
      }
    })
  }

  // Create premium user - Ümit Akdeniz
  await prisma.user.upsert({
    where: { email: 'umitakdenizjob@gmail.com' },
    create: {
      name: 'Ümit Akdeniz',
      email: 'umitakdenizjob@gmail.com',
      plan: 'PREMIUM'
    },
    update: {
      plan: 'PREMIUM'
    }
  })

  // Also create the old email as premium (in case it exists)
  await prisma.user.upsert({
    where: { email: 'umit.akdeniz@example.com' },
    create: {
      name: 'Ümit Akdeniz',
      email: 'umit.akdeniz@example.com',
      plan: 'PREMIUM'
    },
    update: {
      plan: 'PREMIUM'
    }
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })