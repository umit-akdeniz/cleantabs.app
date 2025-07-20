const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('✅ Test user already exists:', existingUser.email);
      
      // Create some test categories and sites
      const existingCategories = await prisma.category.findMany({
        where: { userId: existingUser.id }
      });

      if (existingCategories.length === 0) {
        console.log('📂 Creating test categories...');
        
        const category1 = await prisma.category.create({
          data: {
            name: 'Development',
            icon: 'Code',
            userId: existingUser.id
          }
        });

        const category2 = await prisma.category.create({
          data: {
            name: 'Design',
            icon: 'Palette',
            userId: existingUser.id
          }
        });

        // Create subcategories
        const subcat1 = await prisma.subcategory.create({
          data: {
            name: 'Frontend',
            icon: 'Globe',
            categoryId: category1.id
          }
        });

        const subcat2 = await prisma.subcategory.create({
          data: {
            name: 'Backend',
            icon: 'Server',
            categoryId: category1.id
          }
        });

        const subcat3 = await prisma.subcategory.create({
          data: {
            name: 'UI/UX',
            icon: 'Brush',
            categoryId: category2.id
          }
        });

        // Create test sites
        await prisma.site.create({
          data: {
            name: 'React',
            url: 'https://reactjs.org',
            description: 'A JavaScript library for building user interfaces',
            color: '#61DAFB',
            subcategoryId: subcat1.id
          }
        });

        await prisma.site.create({
          data: {
            name: 'Node.js',
            url: 'https://nodejs.org',
            description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
            color: '#339933',
            subcategoryId: subcat2.id
          }
        });

        await prisma.site.create({
          data: {
            name: 'Figma',
            url: 'https://figma.com',
            description: 'Design tool for teams',
            color: '#F24E1E',
            subcategoryId: subcat3.id
          }
        });

        console.log('✅ Test data created successfully!');
      } else {
        console.log('✅ Test categories already exist');
      }
      
      return;
    }

    // Create new test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        plan: 'FREE',
        emailVerified: new Date()
      }
    });

    console.log('✅ Test user created:', user.email);

    // Create test categories
    const category1 = await prisma.category.create({
      data: {
        name: 'Development',
        icon: 'Code',
        userId: user.id
      }
    });

    const category2 = await prisma.category.create({
      data: {
        name: 'Design',
        icon: 'Palette',
        userId: user.id
      }
    });

    console.log('✅ Test categories created');

    // Create subcategories
    const subcat1 = await prisma.subcategory.create({
      data: {
        name: 'Frontend',
        icon: 'Globe',
        categoryId: category1.id
      }
    });

    const subcat2 = await prisma.subcategory.create({
      data: {
        name: 'Backend',
        icon: 'Server',
        categoryId: category1.id
      }
    });

    console.log('✅ Test subcategories created');

    // Create test sites
    await prisma.site.create({
      data: {
        name: 'React',
        url: 'https://reactjs.org',
        description: 'A JavaScript library for building user interfaces',
        color: '#61DAFB',
        subcategoryId: subcat1.id
      }
    });

    await prisma.site.create({
      data: {
        name: 'Node.js',
        url: 'https://nodejs.org',
        description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        color: '#339933',
        subcategoryId: subcat2.id
      }
    });

    console.log('✅ Test sites created');
    console.log('🎉 All test data created successfully!');
    console.log('📧 Login with: test@example.com');
    console.log('🔐 Password: password123');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();