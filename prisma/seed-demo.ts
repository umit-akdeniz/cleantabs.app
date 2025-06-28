import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDemoUser() {
  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@aetherion.com' }
    });

    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 12);

    // Create demo user
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@aetherion.com',
        name: 'Demo User',
        password: hashedPassword,
        plan: 'FREE'
      }
    });

    console.log('Demo user created:', demoUser.email);

    // Create premium user (your account)
    const existingPremium = await prisma.user.findUnique({
      where: { email: 'umitakdenizjob@gmail.com' }
    });

    if (!existingPremium) {
      const premiumPassword = await bcrypt.hash('premium123', 12);
      
      const premiumUser = await prisma.user.create({
        data: {
          email: 'umitakdenizjob@gmail.com',
          name: 'Ümit Akdeniz',
          password: premiumPassword,
          plan: 'PREMIUM'
        }
      });

      console.log('Premium user created:', premiumUser.email);
    } else {
      // Update existing user to premium
      await prisma.user.update({
        where: { email: 'umitakdenizjob@gmail.com' },
        data: { plan: 'PREMIUM' }
      });
      console.log('Premium user updated:', existingPremium.email);
    }

  } catch (error) {
    console.error('Error creating demo users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUser();