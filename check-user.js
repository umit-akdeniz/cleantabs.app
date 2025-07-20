const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (user) {
      console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        verified: user.verified,
        hasPassword: !!user.password
      });

      // Test password
      if (user.password) {
        const isValid = await bcrypt.compare('password123', user.password);
        console.log('🔐 Password test result:', isValid);
        
        if (!isValid) {
          console.log('❌ Password mismatch, updating...');
          const newHash = await bcrypt.hash('password123', 12);
          await prisma.user.update({
            where: { id: user.id },
            data: { password: newHash }
          });
          console.log('✅ Password updated');
        }
      } else {
        console.log('❌ No password set, creating one...');
        const newHash = await bcrypt.hash('password123', 12);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: newHash }
        });
        console.log('✅ Password created');
      }
    } else {
      console.log('❌ User not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();