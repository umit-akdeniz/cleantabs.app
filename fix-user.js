const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUser() {
  try {
    console.log('Looking for test user...');
    
    // Find the test user
    const user = await prisma.user.findUnique({
      where: { email: 'test@test.com' }
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', user.id);
    
    // Create account record for credentials provider
    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: 'credentials',
        provider: 'credentials',
        providerAccountId: user.id,
      }
    });
    
    console.log('Account created:', account.id);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUser();