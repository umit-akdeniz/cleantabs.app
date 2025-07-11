const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    console.log('🔐 Resetting password...');
    
    const email = 'umitakdenizjob@gmail.com';
    const newPassword = 'Admin123!';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Password updated for:', updatedUser.email);
    console.log('🔑 New password:', newPassword);
    
    // Test the new password
    const testUser = await prisma.user.findUnique({
      where: { email }
    });
    
    const isValid = await bcrypt.compare(newPassword, testUser.password);
    console.log('🧪 Password test:', isValid ? '✅ VALID' : '❌ INVALID');
    
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();