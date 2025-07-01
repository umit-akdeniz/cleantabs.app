const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres:eag8kyu!VDK6nrc_rhe@db.pfscuhenzunlnqtfkvbd.supabase.co:5432/postgres"
      }
    }
  });

  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test user query
    const users = await prisma.user.findMany();
    console.log(`✅ Found ${users.length} users`);
    
    // Test categories query
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            sites: true
          }
        }
      }
    });
    console.log(`✅ Found ${categories.length} categories`);
    
    // Show first user details
    if (users.length > 0) {
      const firstUser = users[0];
      console.log(`First user: ${firstUser.name} (${firstUser.email})`);
      
      // Test user-specific categories
      const userCategories = await prisma.category.findMany({
        where: { userId: firstUser.id },
        include: {
          subcategories: {
            include: {
              sites: true
            }
          }
        }
      });
      console.log(`✅ User ${firstUser.name} has ${userCategories.length} categories`);
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();