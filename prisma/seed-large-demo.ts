import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createLargeDemoData() {
  try {
    // Find demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@aetherion.com' }
    });

    if (!demoUser) {
      console.log('Demo user not found. Please run seed-demo.ts first.');
      return;
    }

    console.log('Creating large dataset for demo user...');

    // Create 30 categories
    for (let i = 1; i <= 30; i++) {
      const category = await prisma.category.create({
        data: {
          id: `demo-cat-${i}`,
          name: `Ana Başlık ${i}`,
          icon: 'Folder'
        }
      });

      console.log(`Created category: ${category.name}`);

      // Create 50 subcategories for each category
      for (let j = 1; j <= 50; j++) {
        const subcategory = await prisma.subcategory.create({
          data: {
            id: `demo-subcat-${i}-${j}`,
            name: `Alt Başlık ${j}`,
            icon: 'FolderOpen',
            categoryId: category.id
          }
        });

        console.log(`  Created subcategory: ${subcategory.name}`);

        // Create 200 sites for each subcategory
        const sites = [];
        for (let k = 1; k <= 200; k++) {
          sites.push({
            id: `demo-site-${i}-${j}-${k}`,
            name: `Site ${k}`,
            url: `https://example${k}.com`,
            description: `Bu site ${k} numaralı örnek sitedir`,
            subcategoryId: subcategory.id,
            favicon: `https://www.google.com/s2/favicons?domain=example${k}.com`,
            reminderEnabled: false
          });
        }

        // Batch create sites for better performance
        await prisma.site.createMany({
          data: sites
        });

        console.log(`    Created 200 sites for ${subcategory.name}`);
      }
    }

    console.log('✅ Large demo dataset created successfully!');
    console.log('📊 Total data created:');
    console.log('  - 30 categories');
    console.log('  - 1,500 subcategories (30 × 50)');
    console.log('  - 300,000 sites (1,500 × 200)');

  } catch (error) {
    console.error('Error creating large demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createLargeDemoData();