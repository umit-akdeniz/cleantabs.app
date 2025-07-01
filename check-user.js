const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'umitakdenizjob@gmail.com' }
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User details:');
    console.log('ID:', user.id);
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Has password:', !!user.password);
    console.log('Password length:', user.password?.length);
    
    // Test password
    if (user.password) {
      const testPassword = 'NUrgul_2135';
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('Password test with "NUrgul_2135":', isValid);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();