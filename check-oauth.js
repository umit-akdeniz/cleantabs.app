const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOAuth() {
  try {
    console.log('Checking OAuth accounts...');
    
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        provider: true,
        providerAccountId: true,
        userId: true,
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });
    
    console.log('OAuth Accounts:', accounts);
    
    console.log('\nChecking sessions...');
    
    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        sessionToken: true,
        userId: true,
        expires: true,
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });
    
    console.log('Active Sessions:', sessions);
    
    console.log('\nChecking verification tokens...');
    
    const verificationTokens = await prisma.verificationToken.findMany();
    
    console.log('Verification Tokens:', verificationTokens);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOAuth();