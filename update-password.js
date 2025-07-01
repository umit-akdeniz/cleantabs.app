const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function updatePassword() {
  try {
    console.log('Finding umit akdeniz user...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'umitakdenizjob@gmail.com' }
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log(`Found user: ${user.name}`);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash('NUrgul_2135', 12);
    
    // Update the password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Password updated successfully!');
    console.log('New credentials:');
    console.log('Email: umitakdenizjob@gmail.com');
    console.log('Password: NUrgul_2135');
    
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();