const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    console.log('Updating password for umitakdenizjob@gmail.com...');
    
    // Hash new password
    const hashedPassword = await bcrypt.hash('umit123', 12);
    
    // Update user password
    const user = await prisma.user.update({
      where: { email: 'umitakdenizjob@gmail.com' },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null
      }
    });
    
    console.log('✅ Password updated successfully for:', user.email);
    console.log('New password: umit123');
    
  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();