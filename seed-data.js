const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('Finding user...');
    
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: 'umitakdenizjob@gmail.com' }
    });
    
    if (!user) {
      console.log('User not found with email umitakdenizjob@gmail.com');
      return;
    }
    
    console.log(`Found user: ${user.name} (${user.id})`);
    
    // Create 30 main categories
    console.log('Creating 30 main categories...');
    const categories = [];
    const categoryNames = [
      'Technology', 'Programming', 'Design', 'Business', 'Finance',
      'Education', 'Science', 'Health', 'Sports', 'Entertainment',
      'News', 'Social Media', 'Shopping', 'Travel', 'Food',
      'Photography', 'Music', 'Gaming', 'Art', 'Books',
      'Movies', 'Tools', 'Productivity', 'Research', 'Development',
      'Marketing', 'Analytics', 'Security', 'AI/ML', 'Blockchain'
    ];
    
    for (let i = 0; i < 30; i++) {
      const category = await prisma.category.create({
        data: {
          name: categoryNames[i],
          userId: user.id,
          order: i
        }
      });
      categories.push(category);
      console.log(`Created category: ${category.name}`);
    }
    
    // Add 30 subcategories to the first category (Technology)
    console.log('Creating 30 subcategories for Technology...');
    const subcategories = [];
    const subcategoryNames = [
      'Web Development', 'Mobile Apps', 'Cloud Computing', 'DevOps', 'APIs',
      'Databases', 'Frontend Frameworks', 'Backend Services', 'Testing', 'Deployment',
      'Version Control', 'Code Editors', 'Documentation', 'Monitoring', 'Performance',
      'Security Tools', 'CI/CD', 'Microservices', 'Containers', 'Serverless',
      'Machine Learning', 'Data Science', 'Analytics', 'Automation', 'Networking',
      'Hardware', 'IoT', 'Blockchain Tech', 'Cybersecurity', 'Open Source'
    ];
    
    for (let i = 0; i < 30; i++) {
      const subcategory = await prisma.subcategory.create({
        data: {
          name: subcategoryNames[i],
          categoryId: categories[0].id,
          order: i
        }
      });
      subcategories.push(subcategory);
      console.log(`Created subcategory: ${subcategory.name}`);
    }
    
    // Add 30 websites to the first subcategory (Web Development)
    console.log('Creating 30 websites for Web Development...');
    const websites = [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Web development documentation' },
      { name: 'Stack Overflow', url: 'https://stackoverflow.com', description: 'Programming Q&A community' },
      { name: 'GitHub', url: 'https://github.com', description: 'Code hosting and collaboration' },
      { name: 'CodePen', url: 'https://codepen.io', description: 'Frontend code playground' },
      { name: 'W3Schools', url: 'https://w3schools.com', description: 'Web development tutorials' },
      { name: 'CSS-Tricks', url: 'https://css-tricks.com', description: 'CSS tips and tricks' },
      { name: 'Can I Use', url: 'https://caniuse.com', description: 'Browser compatibility tables' },
      { name: 'JSFiddle', url: 'https://jsfiddle.net', description: 'JavaScript code testing' },
      { name: 'Smashing Magazine', url: 'https://smashingmagazine.com', description: 'Web design and development' },
      { name: 'A List Apart', url: 'https://alistapart.com', description: 'Web standards and best practices' },
      { name: 'Frontend Mentor', url: 'https://frontendmentor.io', description: 'Frontend challenges' },
      { name: 'Dev.to', url: 'https://dev.to', description: 'Developer community' },
      { name: 'Netlify', url: 'https://netlify.com', description: 'Web hosting and deployment' },
      { name: 'Vercel', url: 'https://vercel.com', description: 'Frontend cloud platform' },
      { name: 'npm', url: 'https://npmjs.com', description: 'JavaScript package manager' },
      { name: 'Yarn', url: 'https://yarnpkg.com', description: 'Package manager' },
      { name: 'Webpack', url: 'https://webpack.js.org', description: 'Module bundler' },
      { name: 'Vite', url: 'https://vitejs.dev', description: 'Build tool' },
      { name: 'ESLint', url: 'https://eslint.org', description: 'JavaScript linter' },
      { name: 'Prettier', url: 'https://prettier.io', description: 'Code formatter' },
      { name: 'TypeScript', url: 'https://typescriptlang.org', description: 'Typed JavaScript' },
      { name: 'React', url: 'https://reactjs.org', description: 'JavaScript library for UIs' },
      { name: 'Vue.js', url: 'https://vuejs.org', description: 'Progressive JavaScript framework' },
      { name: 'Angular', url: 'https://angular.io', description: 'Web application framework' },
      { name: 'Next.js', url: 'https://nextjs.org', description: 'React framework' },
      { name: 'Nuxt.js', url: 'https://nuxtjs.org', description: 'Vue.js framework' },
      { name: 'Svelte', url: 'https://svelte.dev', description: 'Cybernetically enhanced web apps' },
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com', description: 'Utility-first CSS framework' },
      { name: 'Bootstrap', url: 'https://getbootstrap.com', description: 'CSS framework' },
      { name: 'Sass', url: 'https://sass-lang.com', description: 'CSS extension language' }
    ];
    
    for (let i = 0; i < 30; i++) {
      const website = await prisma.site.create({
        data: {
          name: websites[i].name,
          url: websites[i].url,
          description: websites[i].description,
          subcategoryId: subcategories[0].id,
          order: i
        }
      });
      console.log(`Created website: ${website.name}`);
    }
    
    console.log('\n✅ Seed data created successfully!');
    console.log(`Created 30 categories, 30 subcategories, and 30 websites for user: ${user.name}`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();