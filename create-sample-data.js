const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample data structure
const sampleData = {
  categories: [
    {
      name: "Getting Started 🚀",
      icon: "🚀",
      color: "#3b82f6",
      subcategories: [
        {
          name: "Welcome Guide",
          icon: "👋",
          color: "#10b981",
          sites: [
            {
              title: "Welcome to CleanTabs!",
              url: "https://cleantabs.app/help",
              description: `🎉 Welcome to CleanTabs! Here's how to get started:

**Step 1: Organize Your Bookmarks**
• Create categories for different topics (Work, Personal, Learning, etc.)
• Add subcategories for better organization
• Use emojis to make categories visually appealing

**Step 2: Add Your First Website**
• Click the "+" button to add a new site
• Choose the right category and subcategory
• Add a description to remember why you saved it

**Step 3: Set Reminders**
• Click on any site to set a reminder
• Choose when you want to revisit the site
• Add notes about what to do when you return

**Step 4: Use Smart Features**
• Search through your bookmarks quickly
• Export your data anytime
• Access from any device

🎯 **Pro Tip**: Start by importing your existing browser bookmarks using the Import feature!`,
              favicon: "https://cleantabs.app/favicon.ico",
              tags: ["tutorial", "getting-started", "help"],
              isOpen: true
            }
          ]
        }
      ]
    },
    {
      name: "Work & Productivity 💼",
      icon: "💼", 
      color: "#8b5cf6",
      subcategories: [
        {
          name: "Tools & Apps",
          icon: "🛠️",
          color: "#f59e0b",
          sites: [
            {
              title: "Google Drive",
              url: "https://drive.google.com",
              description: `📁 **Cloud Storage & Collaboration**

**What it's for:**
• Store files online safely
• Share documents with team members
• Work on files from anywhere

**How to use:**
1. Create folders for different projects
2. Upload important documents
3. Share folders with collaborators
4. Use Google Docs/Sheets for real-time editing

**Quick Actions:**
• Upload: Drag & drop files
• Share: Right-click → Share
• Organize: Create folders and move files
• Backup: Keep important files here

💡 **Tip**: Use Chrome extension for quick saves!`,
              favicon: "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png",
              tags: ["productivity", "storage", "collaboration"]
            },
            {
              title: "Notion",
              url: "https://notion.so",
              description: `📝 **All-in-One Workspace**

**Perfect for:**
• Project management
• Note-taking
• Documentation
• Team collaboration

**Getting Started:**
1. Create your first page
2. Choose a template or start blank
3. Add blocks (text, images, databases)
4. Organize with nested pages

**Power Features:**
• Databases for tracking
• Templates for consistency
• Sharing & permissions
• Mobile app sync

🎯 **Use Case**: Create a personal dashboard for goals and tasks!`,
              favicon: "https://www.notion.so/images/favicon.ico",
              tags: ["productivity", "notes", "project-management"]
            }
          ]
        },
        {
          name: "Communication",
          icon: "💬",
          color: "#06b6d4",
          sites: [
            {
              title: "Slack",
              url: "https://slack.com",
              description: `💬 **Team Communication Hub**

**Key Features:**
• Organized channels by topic
• Direct messaging
• File sharing
• App integrations

**Best Practices:**
1. Join relevant channels
2. Use threads for discussions
3. Set status when busy/away
4. Use @mentions sparingly

**Productivity Tips:**
• Customize notifications
• Use keyboard shortcuts
• Search with filters
• Pin important messages

⚡ **Quick Start**: Download desktop app for better experience!`,
              favicon: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
              tags: ["communication", "team", "chat"]
            }
          ]
        }
      ]
    },
    {
      name: "Learning & Development 📚",
      icon: "📚",
      color: "#10b981",
      subcategories: [
        {
          name: "Online Courses",
          icon: "🎓",
          color: "#ef4444",
          sites: [
            {
              title: "YouTube",
              url: "https://youtube.com",
              description: `🎥 **Free Learning Platform**

**Why it's great:**
• Millions of tutorial videos
• Learn any skill for free
• Multiple teaching styles
• Available 24/7

**Learning Strategy:**
1. Search for your topic + "tutorial"
2. Look for channels with good ratings
3. Create playlists for courses
4. Take notes while watching
5. Practice what you learn

**Pro Features:**
• Save videos to Watch Later
• Create custom playlists
• Use speed controls (1.25x, 1.5x)
• Turn on captions for better understanding

📱 **Mobile Tip**: Download videos for offline learning!`,
              favicon: "https://www.youtube.com/s/desktop/12345678/img/favicon_32x32.png",
              tags: ["learning", "videos", "tutorials", "free"]
            },
            {
              title: "Coursera",
              url: "https://coursera.org",
              description: `🎓 **University-Quality Courses**

**What makes it special:**
• Courses from top universities
• Professional certificates
• Structured learning paths
• Peer interaction

**How to succeed:**
1. Set a study schedule
2. Complete all assignments
3. Participate in forums
4. Apply learnings to real projects

**Course Types:**
• Single courses (4-6 weeks)
• Specializations (3-6 months)
• Degree programs (1-4 years)
• Professional certificates

💰 **Money-Saving Tip**: Apply for financial aid on most courses!`,
              favicon: "https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-32x32.png",
              tags: ["learning", "courses", "certificates", "university"]
            }
          ]
        },
        {
          name: "Documentation",
          icon: "📖",
          color: "#8b5cf6",
          sites: [
            {
              title: "MDN Web Docs",
              url: "https://developer.mozilla.org",
              description: `🌐 **Web Development Reference**

**Essential for:**
• HTML, CSS, JavaScript reference
• Web API documentation
• Browser compatibility info
• Best practices

**How to use effectively:**
1. Bookmark specific technology pages
2. Use the search function
3. Check browser support tables
4. Follow the learning pathway
5. Practice with examples

**Key Sections:**
• Learn web development
• HTML reference
• CSS reference  
• JavaScript guide
• Web APIs

🔥 **Developer Secret**: Always check MDN first for web questions!`,
              favicon: "https://developer.mozilla.org/favicon-48x48.png",
              tags: ["programming", "web-development", "reference", "documentation"]
            }
          ]
        }
      ]
    },
    {
      name: "Entertainment & Lifestyle 🎮",
      icon: "🎮",
      color: "#f59e0b",
      subcategories: [
        {
          name: "Streaming",
          icon: "📺",
          color: "#ef4444",
          sites: [
            {
              title: "Netflix",
              url: "https://netflix.com",
              description: `🎬 **Streaming Entertainment**

**Content Types:**
• Movies and TV shows
• Original series
• Documentaries
• International content

**Features to explore:**
1. Create multiple profiles
2. Download for offline viewing
3. Use ratings to improve recommendations
4. Browse by categories
5. Use My List for watchlist

**Viewing Tips:**
• Check "New & Popular" regularly
• Try different genres
• Use skip intro feature
• Turn on subtitles for foreign content

🍿 **Pro Tip**: Use Netflix codes to find hidden categories!`,
              favicon: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico",
              tags: ["entertainment", "streaming", "movies", "tv-shows"]
            }
          ]
        },
        {
          name: "Gaming",
          icon: "🎮",
          color: "#8b5cf6",
          sites: [
            {
              title: "Steam",
              url: "https://store.steampowered.com",
              description: `🎮 **PC Gaming Platform**

**What you can do:**
• Buy and download games
• Play with friends
• Join communities
• Track achievements

**Money-saving features:**
1. Wait for seasonal sales
2. Check daily deals
3. Add games to wishlist
4. Use Steam points for rewards

**Social Features:**
• Add friends
• Join groups
• Share screenshots
• Write reviews

**Library Management:**
• Create categories
• Hide games you don't play
• Use favorites for quick access

💰 **Budget Tip**: Major sales happen 4 times a year!`,
              favicon: "https://store.steampowered.com/favicon.ico",
              tags: ["gaming", "pc", "platform", "social"]
            }
          ]
        }
      ]
    },
    {
      name: "News & Information 📰",
      icon: "📰",
      color: "#06b6d4",
      subcategories: [
        {
          name: "Technology News",
          icon: "💻",
          color: "#3b82f6",
          sites: [
            {
              title: "TechCrunch",
              url: "https://techcrunch.com",
              description: `💻 **Startup & Technology News**

**Why follow TechCrunch:**
• Latest startup news
• Product launches
• Investment rounds
• Industry analysis

**Best sections:**
1. Startups - New companies
2. Apps - Mobile app reviews
3. Gadgets - Hardware reviews
4. Events - Tech conferences

**Reading Strategy:**
• Check daily for trending topics
• Follow specific writers you like
• Use tags to filter content
• Subscribe to newsletters

**For Entrepreneurs:**
• Learn from success stories
• Understand market trends
• Network at events
• Follow funding news

📊 **Insider Tip**: Follow their event coverage for industry insights!`,
              favicon: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png",
              tags: ["technology", "news", "startups", "business"]
            }
          ]
        }
      ]
    }
  ]
};

async function createSampleDataForUser(userId) {
  try {
    console.log(`🎯 Creating sample data for user ${userId}...`);
    
    for (const categoryData of sampleData.categories) {
      // Create category
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          icon: categoryData.icon,
          userId: userId,
          order: sampleData.categories.indexOf(categoryData)
        }
      });
      
      console.log(`✅ Created category: ${category.name}`);
      
      for (const subCatData of categoryData.subcategories) {
        // Create subcategory
        const subcategory = await prisma.subcategory.create({
          data: {
            name: subCatData.name,
            icon: subCatData.icon,
            categoryId: category.id,
            order: categoryData.subcategories.indexOf(subCatData)
          }
        });
        
        console.log(`  ✅ Created subcategory: ${subcategory.name}`);
        
        for (const siteData of subCatData.sites) {
          // Create site
          const site = await prisma.site.create({
            data: {
              name: siteData.title,
              url: siteData.url,
              description: siteData.description,
              favicon: siteData.favicon,
              color: siteData.color,
              subcategoryId: subcategory.id,
              order: subCatData.sites.indexOf(siteData)
            }
          });
          
          // Create tags for site
          if (siteData.tags && siteData.tags.length > 0) {
            for (const tagName of siteData.tags) {
              await prisma.tag.create({
                data: {
                  name: tagName,
                  siteId: site.id
                }
              });
            }
          }
          
          console.log(`    ✅ Created site: ${site.name}`);
        }
      }
    }
    
    console.log(`🎉 Sample data created successfully for user ${userId}!`);
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  }
}

// Export function for use in other files
module.exports = { createSampleDataForUser };

// If running directly, ask for user ID
if (require.main === module) {
  const userId = process.argv[2];
  
  if (!userId) {
    console.log('Usage: node create-sample-data.js <userId>');
    process.exit(1);
  }
  
  createSampleDataForUser(userId)
    .then(() => {
      console.log('✅ Sample data creation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}