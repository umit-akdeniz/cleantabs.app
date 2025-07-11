// Test login endpoint
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔐 Testing login process...');
    
    // Test with existing user
    const email = 'umitakdenizjob@gmail.com';
    const password = 'Dsa123!'; // Şifren neydi?
    
    console.log(`🔍 Testing login for: ${email}`);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('👤 User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      hasPassword: !!user.password
    });
    
    if (!user.password) {
      console.log('❌ User has no password');
      return;
    }
    
    // Test different password variations
    const testPasswords = [
      'Dsa123!',
      'dsa123!',
      'DSA123!',
      'Test123!',
      'Admin123!',
      'Password123!',
      'Umit123!'
    ];
    
    console.log('🔑 Testing passwords...');
    for (const testPwd of testPasswords) {
      const isValid = await bcrypt.compare(testPwd, user.password);
      console.log(`  - "${testPwd}": ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      if (isValid) {
        console.log(`🎉 CORRECT PASSWORD FOUND: ${testPwd}`);
        break;
      }
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();