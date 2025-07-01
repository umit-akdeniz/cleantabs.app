const { getServerSession } = require('next-auth/next');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAPI() {
  try {
    console.log('Testing API logic...');
    
    // Simulate what API does
    const mockSession = {
      user: {
        email: 'umitakdenizjob@gmail.com'
      }
    };
    
    console.log('Mock session:', mockSession);
    
    if (!mockSession?.user?.email) {
      console.log('❌ No session email');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: mockSession.user.email }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.name, user.id);

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      include: {
        subcategories: {
          include: {
            sites: {
              include: {
                tags: true,
                subLinks: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`✅ Found ${categories.length} categories for user`);
    
    if (categories.length > 0) {
      const firstCat = categories[0];
      console.log(`First category: ${firstCat.name} with ${firstCat.subcategories.length} subcategories`);
    }
    
  } catch (error) {
    console.error('❌ API test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();