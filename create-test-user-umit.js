const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Creating test user umitakdenizjob@gmail.com...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'umitakdenizjob@gmail.com' }
    });
    
    if (existingUser) {
      console.log('✅ User already exists:', existingUser.email);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('test123456', 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: 'umitakdenizjob@gmail.com',
        password: hashedPassword,
        emailVerified: new Date(),
        name: 'Umit Test User'
      }
    });
    
    console.log('✅ Test user created successfully:');
    console.log('Email:', user.email);
    console.log('ID:', user.id);
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();