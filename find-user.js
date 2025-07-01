const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findUser() {
  try {
    console.log('Looking for users...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    console.log('All users:', users);
    
    // Look for umit akdeniz specifically
    const umitUser = users.find(u => 
      u.name?.toLowerCase().includes('umit') || 
      u.email?.toLowerCase().includes('umit')
    );
    
    if (umitUser) {
      console.log('Found Umit user:', umitUser);
    } else {
      console.log('No Umit user found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findUser();