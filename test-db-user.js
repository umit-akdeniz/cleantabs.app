const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testUser() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Check if any users exist
    const userCount = await prisma.user.count();
    console.log(`👥 Total users in database: ${userCount}`);
    
    // List all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        password: true
      }
    });
    
    console.log('📋 All users:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.name}) - Plan: ${user.plan} - Has Password: ${!!user.password}`);
    });
    
    // Create a test user if none exist
    if (userCount === 0) {
      console.log('🆕 Creating test user...');
      const hashedPassword = await bcrypt.hash('Test123!', 12);
      
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword,
          plan: 'FREE',
          emailVerified: new Date()
        }
      });
      
      console.log('✅ Test user created:', testUser.email);
    }
    
    // Test password verification
    const testEmail = 'test@example.com';
    const testPassword = 'Test123!';
    
    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    
    if (user && user.password) {
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`🔑 Password test for ${testEmail}: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUser();