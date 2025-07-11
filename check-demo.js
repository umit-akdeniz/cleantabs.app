const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function checkDemo() {
  try {
    console.log('Checking demo account...');
    
    const demoUser = await prisma.user.findUnique({
      where: { email: 'test@test.com' },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        plan: true,
        createdAt: true
      }
    });
    
    if (demoUser) {
      console.log('Demo user found:', {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        plan: demoUser.plan,
        hasPassword: !!demoUser.password,
        createdAt: demoUser.createdAt
      });
      
      if (demoUser.password) {
        // Test password verification
        const testPasswords = ['test', 'test123', 'password', 'demo', '123456'];
        
        for (const pwd of testPasswords) {
          const isValid = await bcrypt.compare(pwd, demoUser.password);
          if (isValid) {
            console.log(`✅ Demo password is: ${pwd}`);
            break;
          }
        }
      }
    } else {
      console.log('Demo user not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDemo();