const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addWebsites() {
  try {
    console.log('Web Development alt kategorisine 30 website ekleniyor...');
    
    // Technology kategorisini bul
    const techCategory = await prisma.category.findFirst({
      where: { 
        name: 'Technology',
        userId: 'cmcivnz8h0000ld04g0r9w18i' // umit akdeniz user ID
      },
      include: {
        subcategories: true
      }
    });
    
    if (!techCategory) {
      console.log('❌ Technology kategorisi bulunamadı');
      return;
    }
    
    console.log(`✅ Technology kategorisi bulundu: ${techCategory.id}`);
    
    // Web Development alt kategorisini bul
    const webDevSubcategory = techCategory.subcategories.find(sub => 
      sub.name === 'Web Development'
    );
    
    if (!webDevSubcategory) {
      console.log('❌ Web Development alt kategorisi bulunamadı');
      return;
    }
    
    console.log(`✅ Web Development alt kategorisi bulundu: ${webDevSubcategory.id}`);
    
    // Eklenecek websiteler
    const websites = [
      // Framework & Library Resources
      { name: 'React Documentation', url: 'https://react.dev', description: 'Official React documentation and tutorials' },
      { name: 'Vue.js Guide', url: 'https://vuejs.org/guide/', description: 'Official Vue.js guide and documentation' },
      { name: 'Angular Docs', url: 'https://angular.io/docs', description: 'Official Angular documentation' },
      { name: 'Svelte Tutorial', url: 'https://svelte.dev/tutorial', description: 'Interactive Svelte tutorial' },
      { name: 'Next.js Docs', url: 'https://nextjs.org/docs', description: 'Next.js documentation and guides' },
      
      // CSS & Styling
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com', description: 'Utility-first CSS framework' },
      { name: 'Styled Components', url: 'https://styled-components.com', description: 'CSS-in-JS library for React' },
      { name: 'Emotion', url: 'https://emotion.sh', description: 'CSS-in-JS library with source maps' },
      { name: 'CSS Grid Generator', url: 'https://cssgrid-generator.netlify.app', description: 'Visual CSS Grid layout generator' },
      { name: 'Flexbox Froggy', url: 'https://flexboxfroggy.com', description: 'Learn CSS Flexbox with a game' },
      
      // Development Tools
      { name: 'Vite', url: 'https://vitejs.dev', description: 'Next generation frontend tooling' },
      { name: 'Webpack', url: 'https://webpack.js.org', description: 'Static module bundler' },
      { name: 'Parcel', url: 'https://parceljs.org', description: 'Zero configuration build tool' },
      { name: 'Rollup', url: 'https://rollupjs.org', description: 'Module bundler for JavaScript' },
      { name: 'ESBuild', url: 'https://esbuild.github.io', description: 'Extremely fast JavaScript bundler' },
      
      // Testing
      { name: 'Jest', url: 'https://jestjs.io', description: 'JavaScript testing framework' },
      { name: 'Cypress', url: 'https://cypress.io', description: 'End-to-end testing framework' },
      { name: 'Playwright', url: 'https://playwright.dev', description: 'Cross-browser automation library' },
      { name: 'Testing Library', url: 'https://testing-library.com', description: 'Simple and complete testing utilities' },
      { name: 'Vitest', url: 'https://vitest.dev', description: 'Blazing fast unit test framework' },
      
      // Development Resources
      { name: 'Mozilla Web Docs', url: 'https://developer.mozilla.org', description: 'Web development documentation' },
      { name: 'Web.dev', url: 'https://web.dev', description: 'Google\'s web development guidance' },
      { name: 'Frontend Masters', url: 'https://frontendmasters.com', description: 'Advanced frontend engineering courses' },
      { name: 'FreeCodeCamp', url: 'https://freecodecamp.org', description: 'Free coding bootcamp and tutorials' },
      { name: 'Codecademy', url: 'https://codecademy.com', description: 'Interactive coding courses' },
      
      // Code Playgrounds
      { name: 'CodeSandbox', url: 'https://codesandbox.io', description: 'Online code editor and prototyping tool' },
      { name: 'StackBlitz', url: 'https://stackblitz.com', description: 'Online IDE for web development' },
      { name: 'Replit', url: 'https://replit.com', description: 'Collaborative online IDE' },
      { name: 'JSBin', url: 'https://jsbin.com', description: 'Live pastebin for HTML, CSS & JavaScript' },
      { name: 'CodePen', url: 'https://codepen.io', description: 'Social development environment for front-end designers and developers' }
    ];
    
    console.log(`📝 ${websites.length} website eklenecek...`);
    
    // Mevcut siteleri kontrol et
    const existingSites = await prisma.site.findMany({
      where: { subcategoryId: webDevSubcategory.id }
    });
    
    console.log(`📊 Mevcut ${existingSites.length} site var`);
    
    // Websiteleri ekle
    for (let i = 0; i < websites.length; i++) {
      const website = websites[i];
      
      // Aynı isimde site var mı kontrol et
      const existingSite = existingSites.find(site => 
        site.name.toLowerCase() === website.name.toLowerCase()
      );
      
      if (existingSite) {
        console.log(`⏭️  "${website.name}" zaten mevcut, atlanıyor`);
        continue;
      }
      
      const newSite = await prisma.site.create({
        data: {
          name: website.name,
          url: website.url,
          description: website.description,
          subcategoryId: webDevSubcategory.id,
          order: existingSites.length + i,
          color: getRandomColor()
        }
      });
      
      console.log(`✅ ${i + 1}. "${newSite.name}" eklendi`);
    }
    
    console.log('\n🎉 Tüm websiteler başarıyla eklendi!');
    
    // Son durum
    const finalSites = await prisma.site.findMany({
      where: { subcategoryId: webDevSubcategory.id }
    });
    
    console.log(`📊 Web Development alt kategorisinde toplam ${finalSites.length} site var`);
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Rastgele renk üretici
function getRandomColor() {
  const colors = [
    '#3B82F6', // blue
    '#EF4444', // red
    '#10B981', // green
    '#F59E0B', // yellow
    '#8B5CF6', // purple
    '#06B6D4', // cyan
    '#F97316', // orange
    '#84CC16', // lime
    '#EC4899', // pink
    '#6B7280'  // gray
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

addWebsites();