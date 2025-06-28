import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categoryNames = [
  'Development Tools', 'Design Resources', 'Productivity Apps', 'Social Media', 'E-commerce',
  'Cloud Services', 'Entertainment', 'Education', 'News & Media', 'Finance',
  'Health & Fitness', 'Travel', 'Food & Drink', 'Shopping', 'Business Tools',
  'Communication', 'Security Tools', 'Analytics', 'Marketing', 'Research'
];

const subcategoryNames = [
  'Code Editors', 'Version Control', 'Database Tools', 'API Testing', 'Deployment',
  'Monitoring', 'Documentation', 'Project Management', 'Bug Tracking', 'CI/CD',
  'Framework Resources', 'Libraries', 'Templates', 'Icons', 'Fonts',
  'Color Palettes', 'Stock Photos', 'UI Kits', 'Prototyping', 'Wireframing',
  'Design Systems', 'Animation Tools', 'Video Editing', 'Audio Tools', 'Graphics',
  'Task Management', 'Note Taking', 'Calendar Apps', 'File Storage', 'Communication'
];

const siteData = [
  { name: 'GitHub', url: 'https://github.com', description: 'Code hosting platform' },
  { name: 'GitLab', url: 'https://gitlab.com', description: 'DevOps platform' },
  { name: 'Bitbucket', url: 'https://bitbucket.org', description: 'Git repository management' },
  { name: 'Visual Studio Code', url: 'https://code.visualstudio.com', description: 'Code editor' },
  { name: 'Sublime Text', url: 'https://sublimetext.com', description: 'Text editor' },
  { name: 'WebStorm', url: 'https://jetbrains.com/webstorm', description: 'JavaScript IDE' },
  { name: 'Atom', url: 'https://atom.io', description: 'Hackable text editor' },
  { name: 'Vim', url: 'https://vim.org', description: 'Modal text editor' },
  { name: 'Emacs', url: 'https://gnu.org/software/emacs', description: 'Extensible text editor' },
  { name: 'IntelliJ IDEA', url: 'https://jetbrains.com/idea', description: 'Java IDE' },
  { name: 'MongoDB', url: 'https://mongodb.com', description: 'NoSQL database' },
  { name: 'PostgreSQL', url: 'https://postgresql.org', description: 'Relational database' },
  { name: 'MySQL', url: 'https://mysql.com', description: 'Database management system' },
  { name: 'Redis', url: 'https://redis.io', description: 'In-memory data store' },
  { name: 'Firebase', url: 'https://firebase.google.com', description: 'Backend platform' },
  { name: 'Supabase', url: 'https://supabase.com', description: 'Open source Firebase alternative' },
  { name: 'PlanetScale', url: 'https://planetscale.com', description: 'MySQL platform' },
  { name: 'Vercel', url: 'https://vercel.com', description: 'Frontend deployment' },
  { name: 'Netlify', url: 'https://netlify.com', description: 'Web deployment platform' },
  { name: 'Heroku', url: 'https://heroku.com', description: 'Cloud platform' },
  { name: 'AWS', url: 'https://aws.amazon.com', description: 'Cloud services' },
  { name: 'Google Cloud', url: 'https://cloud.google.com', description: 'Cloud platform' },
  { name: 'Azure', url: 'https://azure.microsoft.com', description: 'Cloud computing' },
  { name: 'DigitalOcean', url: 'https://digitalocean.com', description: 'Cloud infrastructure' },
  { name: 'Postman', url: 'https://postman.com', description: 'API testing tool' },
  { name: 'Insomnia', url: 'https://insomnia.rest', description: 'REST client' },
  { name: 'Swagger', url: 'https://swagger.io', description: 'API documentation' },
  { name: 'Docker', url: 'https://docker.com', description: 'Containerization platform' },
  { name: 'Kubernetes', url: 'https://kubernetes.io', description: 'Container orchestration' },
  { name: 'Jenkins', url: 'https://jenkins.io', description: 'CI/CD automation' },
  { name: 'GitHub Actions', url: 'https://github.com/features/actions', description: 'CI/CD workflows' },
  { name: 'CircleCI', url: 'https://circleci.com', description: 'Continuous integration' },
  { name: 'Travis CI', url: 'https://travis-ci.org', description: 'CI service' },
  { name: 'Figma', url: 'https://figma.com', description: 'Design collaboration' },
  { name: 'Sketch', url: 'https://sketch.com', description: 'Digital design toolkit' },
  { name: 'Adobe XD', url: 'https://adobe.com/products/xd.html', description: 'UX/UI design' },
  { name: 'InVision', url: 'https://invisionapp.com', description: 'Prototyping platform' },
  { name: 'Framer', url: 'https://framer.com', description: 'Interactive design' },
  { name: 'Canva', url: 'https://canva.com', description: 'Graphic design platform' },
  { name: 'Dribbble', url: 'https://dribbble.com', description: 'Design community' },
  { name: 'Behance', url: 'https://behance.net', description: 'Creative portfolio' },
  { name: 'Unsplash', url: 'https://unsplash.com', description: 'Free stock photos' },
  { name: 'Pexels', url: 'https://pexels.com', description: 'Free stock photography' },
  { name: 'Pixabay', url: 'https://pixabay.com', description: 'Free images and videos' },
  { name: 'Font Awesome', url: 'https://fontawesome.com', description: 'Icon library' },
  { name: 'Feather Icons', url: 'https://feathericons.com', description: 'Simple icons' },
  { name: 'Heroicons', url: 'https://heroicons.com', description: 'SVG icons' },
  { name: 'Google Fonts', url: 'https://fonts.google.com', description: 'Web fonts' },
  { name: 'Adobe Fonts', url: 'https://fonts.adobe.com', description: 'Typography service' },
  { name: 'Coolors', url: 'https://coolors.co', description: 'Color palette generator' },
  { name: 'Slack', url: 'https://slack.com', description: 'Team communication' },
  { name: 'Discord', url: 'https://discord.com', description: 'Voice and text chat' },
  { name: 'Microsoft Teams', url: 'https://teams.microsoft.com', description: 'Collaboration platform' },
  { name: 'Zoom', url: 'https://zoom.us', description: 'Video conferencing' },
  { name: 'Google Meet', url: 'https://meet.google.com', description: 'Video meetings' },
  { name: 'Trello', url: 'https://trello.com', description: 'Project management' },
  { name: 'Asana', url: 'https://asana.com', description: 'Task management' },
  { name: 'Notion', url: 'https://notion.so', description: 'Workspace for notes' },
  { name: 'Obsidian', url: 'https://obsidian.md', description: 'Knowledge management' },
  { name: 'Evernote', url: 'https://evernote.com', description: 'Note-taking app' },
  { name: 'OneNote', url: 'https://onenote.com', description: 'Digital notebook' },
  { name: 'Google Drive', url: 'https://drive.google.com', description: 'Cloud storage' },
  { name: 'Dropbox', url: 'https://dropbox.com', description: 'File hosting service' },
  { name: 'OneDrive', url: 'https://onedrive.com', description: 'Cloud storage' },
  { name: 'iCloud', url: 'https://icloud.com', description: 'Apple cloud services' },
  { name: 'Box', url: 'https://box.com', description: 'Cloud content management' },
  { name: 'YouTube', url: 'https://youtube.com', description: 'Video sharing platform' },
  { name: 'Netflix', url: 'https://netflix.com', description: 'Streaming service' },
  { name: 'Spotify', url: 'https://spotify.com', description: 'Music streaming' },
  { name: 'Apple Music', url: 'https://music.apple.com', description: 'Music streaming service' },
  { name: 'Amazon Prime', url: 'https://primevideo.com', description: 'Video streaming' },
  { name: 'Hulu', url: 'https://hulu.com', description: 'TV streaming service' },
  { name: 'Twitch', url: 'https://twitch.tv', description: 'Live streaming platform' },
  { name: 'Twitter', url: 'https://twitter.com', description: 'Social networking' },
  { name: 'Facebook', url: 'https://facebook.com', description: 'Social media platform' },
  { name: 'Instagram', url: 'https://instagram.com', description: 'Photo sharing' },
  { name: 'LinkedIn', url: 'https://linkedin.com', description: 'Professional networking' },
  { name: 'Reddit', url: 'https://reddit.com', description: 'Social news aggregation' },
  { name: 'Pinterest', url: 'https://pinterest.com', description: 'Image sharing' },
  { name: 'TikTok', url: 'https://tiktok.com', description: 'Short video platform' },
  { name: 'Snapchat', url: 'https://snapchat.com', description: 'Multimedia messaging' },
  { name: 'WhatsApp', url: 'https://whatsapp.com', description: 'Messaging app' },
  { name: 'Telegram', url: 'https://telegram.org', description: 'Cloud-based messaging' },
  { name: 'Signal', url: 'https://signal.org', description: 'Private messaging' },
  { name: 'Amazon', url: 'https://amazon.com', description: 'E-commerce platform' },
  { name: 'eBay', url: 'https://ebay.com', description: 'Online marketplace' },
  { name: 'Shopify', url: 'https://shopify.com', description: 'E-commerce platform' },
  { name: 'WooCommerce', url: 'https://woocommerce.com', description: 'WordPress e-commerce' },
  { name: 'Stripe', url: 'https://stripe.com', description: 'Payment processing' },
  { name: 'PayPal', url: 'https://paypal.com', description: 'Online payments' },
  { name: 'Square', url: 'https://squareup.com', description: 'Payment solutions' },
  { name: 'Etsy', url: 'https://etsy.com', description: 'Handmade marketplace' },
  { name: 'Alibaba', url: 'https://alibaba.com', description: 'B2B marketplace' },
  { name: 'AliExpress', url: 'https://aliexpress.com', description: 'Online retail' },
  { name: 'Coursera', url: 'https://coursera.org', description: 'Online learning platform' },
  { name: 'Udemy', url: 'https://udemy.com', description: 'Online courses' },
  { name: 'Khan Academy', url: 'https://khanacademy.org', description: 'Free education' },
  { name: 'edX', url: 'https://edx.org', description: 'Online university courses' },
  { name: 'Pluralsight', url: 'https://pluralsight.com', description: 'Technology learning' },
  { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning', description: 'Professional development' },
  { name: 'MasterClass', url: 'https://masterclass.com', description: 'Expert-led classes' },
  { name: 'Skillshare', url: 'https://skillshare.com', description: 'Creative learning' },
  { name: 'Duolingo', url: 'https://duolingo.com', description: 'Language learning' },
  { name: 'Babbel', url: 'https://babbel.com', description: 'Language learning app' }
];

async function createLargeDataset() {
  try {
    // Find or create the user
    let user = await prisma.user.findUnique({
      where: { email: 'umitakdenizjob@gmail.com' }
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash('demo123', 12);
      user = await prisma.user.create({
        data: {
          email: 'umitakdenizjob@gmail.com',
          name: 'Umit Akdeniz',
          password: hashedPassword,
          plan: 'PREMIUM'
        }
      });
    }

    console.log('Creating 20 categories...');
    
    // Create 20 categories
    for (let i = 0; i < 20; i++) {
      const categoryName = categoryNames[i];
      
      const category = await prisma.category.create({
        data: {
          id: `cat-${i + 1}`,
          name: categoryName,
          icon: 'Folder'
        }
      });

      console.log(`Created category: ${categoryName}`);

      // For the first category, create 30 subcategories
      if (i === 0) {
        console.log('Creating 30 subcategories for first category...');
        
        for (let j = 0; j < 30; j++) {
          const subcategoryName = subcategoryNames[j % subcategoryNames.length] + ` ${Math.floor(j / subcategoryNames.length) + 1}`;
          
          const subcategory = await prisma.subcategory.create({
            data: {
              id: `subcat-${i + 1}-${j + 1}`,
              name: subcategoryName,
              icon: 'FolderOpen',
              categoryId: category.id
            }
          });

          console.log(`Created subcategory: ${subcategoryName}`);

          // For the first subcategory, create 100 sites
          if (j === 0) {
            console.log('Creating 100 sites for first subcategory...');
            
            for (let k = 0; k < 100; k++) {
              const siteTemplate = siteData[k % siteData.length];
              const siteName = `${siteTemplate.name} ${Math.floor(k / siteData.length) + 1}`;
              const siteUrl = siteTemplate.url.replace('https://', `https://${k + 1}.`);
              
              await prisma.site.create({
                data: {
                  id: `site-${i + 1}-${j + 1}-${k + 1}`,
                  name: siteName,
                  url: siteUrl,
                  description: `${siteTemplate.description} - Instance ${k + 1}`,
                  subcategoryId: subcategory.id,
                  reminderEnabled: false,
                  color: '#10b981',
                  tags: {
                    create: [
                      { name: 'test-data' },
                      { name: `category-${i + 1}` }
                    ]
                  }
                }
              });

              if ((k + 1) % 10 === 0) {
                console.log(`Created ${k + 1} sites...`);
              }
            }
          } else {
            // For other subcategories, create 2-3 sites
            const siteCount = Math.floor(Math.random() * 2) + 2;
            for (let k = 0; k < siteCount; k++) {
              const siteTemplate = siteData[(j + k) % siteData.length];
              
              await prisma.site.create({
                data: {
                  id: `site-${i + 1}-${j + 1}-${k + 1}`,
                  name: siteTemplate.name,
                  url: siteTemplate.url,
                  description: siteTemplate.description,
                  subcategoryId: subcategory.id,
                  reminderEnabled: false,
                  color: '#10b981'
                }
              });
            }
          }
        }
      } else {
        // For other categories, create 2-5 subcategories
        const subcategoryCount = Math.floor(Math.random() * 4) + 2;
        
        for (let j = 0; j < subcategoryCount; j++) {
          const subcategoryName = subcategoryNames[(i + j) % subcategoryNames.length];
          
          const subcategory = await prisma.subcategory.create({
            data: {
              id: `subcat-${i + 1}-${j + 1}`,
              name: subcategoryName,
              icon: 'FolderOpen',
              categoryId: category.id
            }
          });

          // Create 1-3 sites per subcategory
          const siteCount = Math.floor(Math.random() * 3) + 1;
          for (let k = 0; k < siteCount; k++) {
            const siteTemplate = siteData[(i + j + k) % siteData.length];
            
            await prisma.site.create({
              data: {
                id: `site-${i + 1}-${j + 1}-${k + 1}`,
                name: siteTemplate.name,
                url: siteTemplate.url,
                description: siteTemplate.description,
                subcategoryId: subcategory.id,
                reminderEnabled: false,
                color: '#10b981'
              }
            });
          }
        }
      }
    }

    console.log('✅ Large dataset created successfully!');
    console.log('📊 Summary:');
    console.log('- 20 categories created');
    console.log('- First category has 30 subcategories');
    console.log('- First subcategory has 100 sites');
    console.log('- Other categories have 2-5 subcategories each');
    console.log('- Other subcategories have 1-3 sites each');

  } catch (error) {
    console.error('Error creating large dataset:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createLargeDataset()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });