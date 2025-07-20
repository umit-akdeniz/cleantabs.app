const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetTestData() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!user) {
      console.log('❌ Test user not found');
      return;
    }

    console.log('🗑️ Deleting existing test data...');

    // Delete in correct order due to foreign key constraints
    await prisma.tag.deleteMany({
      where: {
        site: {
          subcategory: {
            category: {
              userId: user.id
            }
          }
        }
      }
    });

    await prisma.subLink.deleteMany({
      where: {
        site: {
          subcategory: {
            category: {
              userId: user.id
            }
          }
        }
      }
    });

    await prisma.reminder.deleteMany({
      where: {
        site: {
          subcategory: {
            category: {
              userId: user.id
            }
          }
        }
      }
    });

    await prisma.site.deleteMany({
      where: {
        subcategory: {
          category: {
            userId: user.id
          }
        }
      }
    });

    await prisma.subcategory.deleteMany({
      where: {
        category: {
          userId: user.id
        }
      }
    });

    await prisma.category.deleteMany({
      where: {
        userId: user.id
      }
    });

    console.log('✅ Old data deleted');

    // Create new test data
    console.log('📂 Creating fresh test data...');
    
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

    const category3 = await prisma.category.create({
      data: {
        name: 'Tools',
        icon: 'Wrench',
        userId: user.id
      }
    });

    console.log('✅ Categories created');

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
        name: 'UI Design',
        icon: 'Brush',
        categoryId: category2.id
      }
    });

    const subcat4 = await prisma.subcategory.create({
      data: {
        name: 'UX Research',
        icon: 'Users',
        categoryId: category2.id
      }
    });

    const subcat5 = await prisma.subcategory.create({
      data: {
        name: 'Productivity',
        icon: 'Zap',
        categoryId: category3.id
      }
    });

    console.log('✅ Subcategories created');

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
        name: 'Vue.js',
        url: 'https://vuejs.org',
        description: 'The Progressive JavaScript Framework',
        color: '#4FC08D',
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
        name: 'Express.js',
        url: 'https://expressjs.com',
        description: 'Fast, unopinionated, minimalist web framework for Node.js',
        color: '#000000',
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

    await prisma.site.create({
      data: {
        name: 'Adobe XD',
        url: 'https://www.adobe.com/products/xd.html',
        description: 'Design and prototype user experiences',
        color: '#FF61F6',
        subcategoryId: subcat3.id
      }
    });

    await prisma.site.create({
      data: {
        name: 'Maze',
        url: 'https://maze.co',
        description: 'User testing platform',
        color: '#1BC47D',
        subcategoryId: subcat4.id
      }
    });

    await prisma.site.create({
      data: {
        name: 'Notion',
        url: 'https://notion.so',
        description: 'All-in-one workspace',
        color: '#000000',
        subcategoryId: subcat5.id
      }
    });

    await prisma.site.create({
      data: {
        name: 'Slack',
        url: 'https://slack.com',
        description: 'Team communication platform',
        color: '#4A154B',
        subcategoryId: subcat5.id
      }
    });

    console.log('✅ Test sites created');
    console.log('🎉 Fresh test data created successfully!');
    console.log('📧 Login with: test@example.com');
    console.log('🔐 Password: password123');

  } catch (error) {
    console.error('❌ Error resetting test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetTestData();