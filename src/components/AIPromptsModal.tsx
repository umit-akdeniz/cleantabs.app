'use client';

import { useState } from 'react';
import { X, Search, Copy, ExternalLink, Sparkles, Tag, ArrowLeft } from 'lucide-react';
import { showToast } from './Toast';

interface AIPromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  example?: string;
}

const AI_PROMPTS: AIPrompt[] = [
  {
    id: '1',
    title: 'Turkey Economy News',
    description: 'Essential resources for following Turkish economy news and analysis',
    category: 'News & Economy',
    tags: ['turkey', 'economy', 'news', 'finance'],
    prompt: `Create a bookmark HTML file for Turkish breaking economy news, YouTube channels, and financial resources.

**IMPORTANT:** Please use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Economy News Sites</H3>
    <DL><p>
        <DT><A HREF="site_url_here">Site Name</A>
        <!-- Other sites -->
    </DL><p>
    
    <DT><H3>YouTube Economy Channels</H3>
    <DL><p>
        <DT><A HREF="youtube_url_here">Channel Name</A>
        <!-- Other channels -->
    </DL><p>
    
    <!-- Add more categories if needed -->
    
    <!-- General sites outside categories go here -->
    <DT><A HREF="general_site_url">General Site</A>
</DL>
\`\`\`

**Content requirements:**
- Include main Turkish economy news websites
- Find Turkish economy experts' YouTube channels
- Include sites like Borsaist, Bloomberg HT, Para
- Add brief descriptions next to each site name
- Prefer current and active sources

Please provide the complete HTML code with no additional explanations.`,
    example: 'ChatGPT will give you ready HTML code that you can directly import to CleanTabs.'
  },
  {
    id: '2',
    title: 'Developer Tools & Resources',
    description: 'Essential tools and resources for software development',
    category: 'Development',
    tags: ['programming', 'development', 'tools', 'learning'],
    prompt: `Create a bookmark HTML file for software development tools and resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Development Tools</H3>
    <DL><p>
        <DT><A HREF="https://github.com">GitHub - Code Repository</A>
        <DT><A HREF="https://stackoverflow.com">Stack Overflow - Q&A</A>
        <!-- Other development tools -->
    </DL><p>
    
    <DT><H3>Learning Resources</H3>
    <DL><p>
        <DT><A HREF="https://freecodecamp.org">freeCodeCamp - Free Coding Bootcamp</A>
        <!-- Other learning resources -->
    </DL><p>
    
    <DT><H3>Documentation</H3>
    <DL><p>
        <DT><A HREF="https://developer.mozilla.org">MDN Web Docs</A>
        <!-- Other documentation -->
    </DL><p>
    
    <!-- General development sites -->
    <DT><A HREF="https://codepen.io">CodePen - Online Code Editor</A>
</DL>
\`\`\`

**Content requirements:**
- Code repository sites like GitHub, GitLab
- Q&A sites like Stack Overflow, Reddit programming
- Learning platforms like freeCodeCamp, Codecademy
- Documentation sites like MDN, official docs
- Online editors like CodePen, JSFiddle
- Add brief descriptions next to each site name explaining what it's used for

Please provide only the HTML code with no additional explanations.`,
    example: 'Get a ready HTML bookmark file for development tools.'
  },
  {
    id: '3',
    title: 'Social Media & Content',
    description: 'Social media platforms, news sites and content platforms',
    category: 'Social & Content',
    tags: ['social-media', 'news', 'content', 'entertainment'],
    prompt: `Create a bookmark HTML file for social media and content tracking.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Social Media</H3>
    <DL><p>
        <DT><A HREF="https://twitter.com">Twitter - Microblogging</A>
        <DT><A HREF="https://instagram.com">Instagram - Photo Sharing</A>
        <!-- Other social media -->
    </DL><p>
    
    <DT><H3>News Sites</H3>
    <DL><p>
        <DT><A HREF="https://bbc.com">BBC News</A>
        <!-- Other news sites -->
    </DL><p>
    
    <DT><H3>Video Platforms</H3>
    <DL><p>
        <DT><A HREF="https://youtube.com">YouTube</A>
        <!-- Other video platforms -->
    </DL><p>
    
    <!-- General social sites -->
    <DT><A HREF="https://reddit.com">Reddit - Forum</A>
</DL>
\`\`\`

**Content requirements:**
- Popular social media platforms (Twitter, Instagram, TikTok, LinkedIn)
- Main news sites (BBC, CNN, current news)
- Video platforms (YouTube, Twitch, Netflix)
- Forum and community sites (Reddit, Discord)
- Blog and personal development sites
- Add brief descriptions next to each site name explaining its purpose

Please provide only the HTML code with no explanations.`,
    example: 'Organized bookmark list for social media and content tracking.'
  },
  {
    id: '4',
    title: 'E-commerce & Shopping',
    description: 'Online shopping, price comparison and e-commerce sites',
    category: 'Shopping',
    tags: ['shopping', 'e-commerce', 'deals', 'marketplace'],
    prompt: `Create a bookmark HTML file for online shopping and e-commerce.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>E-commerce Sites</H3>
    <DL><p>
        <DT><A HREF="https://amazon.com">Amazon - Global Marketplace</A>
        <DT><A HREF="https://trendyol.com">Trendyol - Turkish E-commerce</A>
        <!-- Other e-commerce sites -->
    </DL><p>
    
    <DT><H3>Price Comparison</H3>
    <DL><p>
        <DT><A HREF="https://akakce.com">Akakçe - Price Comparison</A>
        <!-- Other comparison sites -->
    </DL><p>
    
    <DT><H3>Deals & Coupons</H3>
    <DL><p>
        <DT><A HREF="https://gittigidiyor.com">GittiGidiyor</A>
        <!-- Other deal sites -->
    </DL><p>
    
    <!-- General shopping sites -->
    <DT><A HREF="https://hepsiburada.com">Hepsiburada</A>
</DL>
\`\`\`

**Content requirements:**
- Popular e-commerce sites (Amazon, Trendyol, N11, Hepsiburada)
- Price comparison sites (Akakçe, Epey)
- Deal and coupon sites
- Technology shopping sites (Vatan, Media Markt)
- Fashion and clothing sites
- Add brief descriptions next to each site name explaining its features

Please provide only the HTML code with no explanations.`,
    example: 'All shopping sites organized for your needs.'
  },
  {
    id: '5',
    title: 'Digital Marketing & SEO',
    description: 'Marketing tools, SEO resources, and analytics platforms',
    category: 'Marketing',
    tags: ['marketing', 'seo', 'analytics', 'advertising'],
    prompt: `Create a bookmark HTML file for digital marketing and SEO tools.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>SEO Tools</H3>
    <DL><p>
        <DT><A HREF="https://ahrefs.com">Ahrefs - SEO Analysis</A>
        <DT><A HREF="https://semrush.com">SEMrush - Marketing Toolkit</A>
        <!-- Other SEO tools -->
    </DL><p>
    
    <DT><H3>Analytics</H3>
    <DL><p>
        <DT><A HREF="https://analytics.google.com">Google Analytics</A>
        <!-- Other analytics tools -->
    </DL><p>
    
    <DT><H3>Social Media Marketing</H3>
    <DL><p>
        <DT><A HREF="https://hootsuite.com">Hootsuite - Social Management</A>
        <!-- Other social tools -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- SEO analysis tools (Ahrefs, SEMrush, Moz)
- Analytics platforms (Google Analytics, Adobe Analytics)
- Social media management tools
- Email marketing platforms
- Content marketing resources

Please provide only the HTML code with no explanations.`,
    example: 'Complete digital marketing toolkit for professionals.'
  },
  {
    id: '6',
    title: 'Health & Fitness',
    description: 'Fitness routines, nutrition guides, and wellness resources',
    category: 'Health & Fitness',
    tags: ['health', 'fitness', 'nutrition', 'wellness'],
    prompt: `Create a bookmark HTML file for health and fitness resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Fitness Apps & Websites</H3>
    <DL><p>
        <DT><A HREF="https://myfitnesspal.com">MyFitnessPal - Calorie Tracking</A>
        <DT><A HREF="https://nike.com/training">Nike Training Club</A>
        <!-- Other fitness sites -->
    </DL><p>
    
    <DT><H3>Nutrition Resources</H3>
    <DL><p>
        <DT><A HREF="https://nutritiondata.self.com">Nutrition Data</A>
        <!-- Other nutrition sites -->
    </DL><p>
    
    <DT><H3>Wellness & Mental Health</H3>
    <DL><p>
        <DT><A HREF="https://headspace.com">Headspace - Meditation</A>
        <!-- Other wellness sites -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Fitness tracking apps and workout platforms
- Nutrition databases and meal planning tools
- Mental health and meditation resources
- Health news and medical information sites
- Sports and activity-specific resources

Please provide only the HTML code with no explanations.`,
    example: 'Your complete health and fitness resource collection.'
  },
  {
    id: '7',
    title: 'Educational Resources',
    description: 'Online courses, tutorials, and learning platforms',
    category: 'Education',
    tags: ['education', 'learning', 'courses', 'tutorials'],
    prompt: `Create a bookmark HTML file for educational resources and online learning.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Online Learning Platforms</H3>
    <DL><p>
        <DT><A HREF="https://coursera.org">Coursera - University Courses</A>
        <DT><A HREF="https://udemy.com">Udemy - Skill-based Courses</A>
        <!-- Other learning platforms -->
    </DL><p>
    
    <DT><H3>Free Educational Resources</H3>
    <DL><p>
        <DT><A HREF="https://khanacademy.org">Khan Academy - Free Education</A>
        <!-- Other free resources -->
    </DL><p>
    
    <DT><H3>Language Learning</H3>
    <DL><p>
        <DT><A HREF="https://duolingo.com">Duolingo - Language Learning</A>
        <!-- Other language tools -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- MOOC platforms (Coursera, edX, Udacity)
- Skill-based learning (Udemy, Skillshare, LinkedIn Learning)
- Free educational resources (Khan Academy, MIT OpenCourseWare)
- Language learning platforms
- Academic databases and research tools

Please provide only the HTML code with no explanations.`,
    example: 'Complete educational resource library for lifelong learning.'
  },
  {
    id: '8',
    title: 'Travel & Tourism',
    description: 'Travel planning, booking sites, and destination guides',
    category: 'Travel',
    tags: ['travel', 'booking', 'hotels', 'flights'],
    prompt: `Create a bookmark HTML file for travel and tourism resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Flight Booking</H3>
    <DL><p>
        <DT><A HREF="https://skyscanner.com">Skyscanner - Flight Comparison</A>
        <DT><A HREF="https://expedia.com">Expedia - Travel Booking</A>
        <!-- Other flight sites -->
    </DL><p>
    
    <DT><H3>Hotels & Accommodation</H3>
    <DL><p>
        <DT><A HREF="https://booking.com">Booking.com - Hotel Reservations</A>
        <!-- Other accommodation sites -->
    </DL><p>
    
    <DT><H3>Travel Guides</H3>
    <DL><p>
        <DT><A HREF="https://tripadvisor.com">TripAdvisor - Reviews & Guides</A>
        <!-- Other travel guide sites -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Flight comparison and booking sites
- Hotel and accommodation platforms
- Car rental services
- Travel guides and review sites
- Travel insurance providers

Please provide only the HTML code with no explanations.`,
    example: 'Everything you need for planning your next trip.'
  },
  {
    id: '9',
    title: 'Finance & Investment',
    description: 'Banking, investment platforms, and financial news',
    category: 'Finance',
    tags: ['finance', 'investment', 'banking', 'stocks'],
    prompt: `Create a bookmark HTML file for finance and investment resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Investment Platforms</H3>
    <DL><p>
        <DT><A HREF="https://robinhood.com">Robinhood - Commission-free Trading</A>
        <DT><A HREF="https://etrade.com">E*TRADE - Online Brokerage</A>
        <!-- Other investment platforms -->
    </DL><p>
    
    <DT><H3>Financial News</H3>
    <DL><p>
        <DT><A HREF="https://bloomberg.com">Bloomberg - Financial News</A>
        <!-- Other financial news sites -->
    </DL><p>
    
    <DT><H3>Banking Services</H3>
    <DL><p>
        <DT><A HREF="https://mint.com">Mint - Personal Finance</A>
        <!-- Other banking tools -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Online brokerage and trading platforms
- Financial news and market analysis sites
- Personal finance management tools
- Cryptocurrency exchanges
- Banking and credit card services

Please provide only the HTML code with no explanations.`,
    example: 'Complete financial management and investment toolkit.'
  },
  {
    id: '10',
    title: 'Entertainment & Gaming',
    description: 'Movies, music, games, and entertainment platforms',
    category: 'Entertainment',
    tags: ['entertainment', 'gaming', 'movies', 'music'],
    prompt: `Create a bookmark HTML file for entertainment and gaming resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Streaming Services</H3>
    <DL><p>
        <DT><A HREF="https://netflix.com">Netflix - Movies & TV Shows</A>
        <DT><A HREF="https://spotify.com">Spotify - Music Streaming</A>
        <!-- Other streaming services -->
    </DL><p>
    
    <DT><H3>Gaming Platforms</H3>
    <DL><p>
        <DT><A HREF="https://steam.com">Steam - PC Gaming</A>
        <!-- Other gaming platforms -->
    </DL><p>
    
    <DT><H3>Entertainment News</H3>
    <DL><p>
        <DT><A HREF="https://ign.com">IGN - Gaming News</A>
        <!-- Other entertainment news -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Video streaming platforms (Netflix, Amazon Prime, Disney+)
- Music streaming services (Spotify, Apple Music, YouTube Music)
- Gaming platforms (Steam, Epic Games, PlayStation, Xbox)
- Entertainment news and review sites
- Podcast platforms

Please provide only the HTML code with no explanations.`,
    example: 'Your complete entertainment hub for movies, music, and games.'
  },
  {
    id: '11',
    title: 'Productivity & Organization',
    description: 'Task management, note-taking, and productivity tools',
    category: 'Productivity',
    tags: ['productivity', 'organization', 'tasks', 'notes'],
    prompt: `Create a bookmark HTML file for productivity and organization tools.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Task Management</H3>
    <DL><p>
        <DT><A HREF="https://todoist.com">Todoist - Task Organization</A>
        <DT><A HREF="https://trello.com">Trello - Project Boards</A>
        <!-- Other task management tools -->
    </DL><p>
    
    <DT><H3>Note Taking</H3>
    <DL><p>
        <DT><A HREF="https://notion.so">Notion - All-in-one Workspace</A>
        <!-- Other note-taking apps -->
    </DL><p>
    
    <DT><H3>Communication</H3>
    <DL><p>
        <DT><A HREF="https://slack.com">Slack - Team Communication</A>
        <!-- Other communication tools -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Task and project management tools
- Note-taking and documentation apps
- Team communication platforms
- Time tracking and calendar tools
- File storage and collaboration services

Please provide only the HTML code with no explanations.`,
    example: 'Boost your productivity with these essential organizational tools.'
  },
  {
    id: '12',
    title: 'Food & Cooking',
    description: 'Recipes, cooking tutorials, and food delivery services',
    category: 'Food & Cooking',
    tags: ['food', 'cooking', 'recipes', 'delivery'],
    prompt: `Create a bookmark HTML file for food and cooking resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Recipe Websites</H3>
    <DL><p>
        <DT><A HREF="https://allrecipes.com">AllRecipes - Recipe Collection</A>
        <DT><A HREF="https://foodnetwork.com">Food Network - Cooking Shows</A>
        <!-- Other recipe sites -->
    </DL><p>
    
    <DT><H3>Food Delivery</H3>
    <DL><p>
        <DT><A HREF="https://ubereats.com">Uber Eats - Food Delivery</A>
        <!-- Other delivery services -->
    </DL><p>
    
    <DT><H3>Cooking Education</H3>
    <DL><p>
        <DT><A HREF="https://masterclass.com">MasterClass - Cooking Classes</A>
        <!-- Other cooking education -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Recipe databases and cooking websites
- Food delivery and restaurant services
- Cooking education and tutorial platforms
- Food blogs and culinary magazines
- Kitchen equipment and ingredient suppliers

Please provide only the HTML code with no explanations.`,
    example: 'Everything you need for cooking and food exploration.'
  },
  {
    id: '13',
    title: 'Science & Technology',
    description: 'Tech news, scientific journals, and innovation resources',
    category: 'Science & Technology',
    tags: ['science', 'technology', 'research', 'innovation'],
    prompt: `Create a bookmark HTML file for science and technology resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Tech News</H3>
    <DL><p>
        <DT><A HREF="https://techcrunch.com">TechCrunch - Startup News</A>
        <DT><A HREF="https://arstechnica.com">Ars Technica - Technology News</A>
        <!-- Other tech news sites -->
    </DL><p>
    
    <DT><H3>Scientific Journals</H3>
    <DL><p>
        <DT><A HREF="https://nature.com">Nature - Scientific Journal</A>
        <!-- Other scientific publications -->
    </DL><p>
    
    <DT><H3>Innovation Platforms</H3>
    <DL><p>
        <DT><A HREF="https://github.com">GitHub - Open Source Development</A>
        <!-- Other innovation platforms -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Technology news and analysis sites
- Scientific journals and research databases
- Open source and development platforms
- Innovation and startup resources
- STEM education materials

Please provide only the HTML code with no explanations.`,
    example: 'Stay updated with the latest in science and technology.'
  },
  {
    id: '14',
    title: 'Art & Design',
    description: 'Design inspiration, creative tools, and art galleries',
    category: 'Art & Design',
    tags: ['art', 'design', 'creativity', 'inspiration'],
    prompt: `Create a bookmark HTML file for art and design resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Design Tools</H3>
    <DL><p>
        <DT><A HREF="https://figma.com">Figma - UI/UX Design</A>
        <DT><A HREF="https://canva.com">Canva - Graphic Design</A>
        <!-- Other design tools -->
    </DL><p>
    
    <DT><H3>Inspiration Galleries</H3>
    <DL><p>
        <DT><A HREF="https://dribbble.com">Dribbble - Design Inspiration</A>
        <!-- Other inspiration sites -->
    </DL><p>
    
    <DT><H3>Art Education</H3>
    <DL><p>
        <DT><A HREF="https://skillshare.com">Skillshare - Creative Classes</A>
        <!-- Other art education -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Design software and online tools
- Inspiration galleries and portfolios
- Art education and tutorial platforms
- Stock photo and asset libraries
- Typography and color resources

Please provide only the HTML code with no explanations.`,
    example: 'Complete creative toolkit for artists and designers.'
  },
  {
    id: '15',
    title: 'Sports & Recreation',
    description: 'Sports news, recreational activities, and outdoor adventures',
    category: 'Sports & Recreation',
    tags: ['sports', 'recreation', 'outdoor', 'activities'],
    prompt: `Create a bookmark HTML file for sports and recreational activities.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Sports News</H3>
    <DL><p>
        <DT><A HREF="https://espn.com">ESPN - Sports News</A>
        <DT><A HREF="https://nbcsports.com">NBC Sports</A>
        <!-- Other sports news sites -->
    </DL><p>
    
    <DT><H3>Recreation Planning</H3>
    <DL><p>
        <DT><A HREF="https://alltrails.com">AllTrails - Hiking Trails</A>
        <!-- Other recreation sites -->
    </DL><p>
    
    <DT><H3>Equipment & Gear</H3>
    <DL><p>
        <DT><A HREF="https://rei.com">REI - Outdoor Gear</A>
        <!-- Other equipment sites -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Sports news and score tracking sites
- Outdoor activity planning platforms
- Equipment and gear retailers
- Sports streaming services
- Recreational facility finders

Please provide only the HTML code with no explanations.`,
    example: 'Your complete guide to sports and outdoor recreation.'
  },
  {
    id: '16',
    title: 'Real Estate & Housing',
    description: 'Property listings, home improvement, and real estate news',
    category: 'Real Estate',
    tags: ['real-estate', 'housing', 'property', 'home-improvement'],
    prompt: `Create a bookmark HTML file for real estate and housing resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Property Listings</H3>
    <DL><p>
        <DT><A HREF="https://zillow.com">Zillow - Real Estate Listings</A>
        <DT><A HREF="https://realtor.com">Realtor.com - Property Search</A>
        <!-- Other property sites -->
    </DL><p>
    
    <DT><H3>Home Improvement</H3>
    <DL><p>
        <DT><A HREF="https://homedepot.com">Home Depot - Home Improvement</A>
        <!-- Other home improvement sites -->
    </DL><p>
    
    <DT><H3>Real Estate Tools</H3>
    <DL><p>
        <DT><A HREF="https://mortgage.com">Mortgage Calculator</A>
        <!-- Other real estate tools -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Property listing and search platforms
- Home improvement and DIY resources
- Mortgage and financing tools
- Real estate market analysis
- Home inspection and appraisal services

Please provide only the HTML code with no explanations.`,
    example: 'Everything you need for buying, selling, or improving your home.'
  },
  {
    id: '17',
    title: 'Photography & Video',
    description: 'Camera gear, editing software, and photography tutorials',
    category: 'Photography & Video',
    tags: ['photography', 'video', 'editing', 'cameras'],
    prompt: `Create a bookmark HTML file for photography and video resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Editing Software</H3>
    <DL><p>
        <DT><A HREF="https://adobe.com/photoshop">Adobe Photoshop</A>
        <DT><A HREF="https://adobe.com/premiere">Adobe Premiere Pro</A>
        <!-- Other editing tools -->
    </DL><p>
    
    <DT><H3>Stock Photography</H3>
    <DL><p>
        <DT><A HREF="https://unsplash.com">Unsplash - Free Photos</A>
        <!-- Other stock photo sites -->
    </DL><p>
    
    <DT><H3>Photography Education</H3>
    <DL><p>
        <DT><A HREF="https://petapixel.com">PetaPixel - Photography News</A>
        <!-- Other photography education -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Photo and video editing software
- Stock photography and video libraries
- Photography education and tutorials
- Camera gear and equipment reviews
- Portfolio and showcase platforms

Please provide only the HTML code with no explanations.`,
    example: 'Complete toolkit for photographers and videographers.'
  },
  {
    id: '18',
    title: 'Music & Audio',
    description: 'Music streaming, audio production, and instrument learning',
    category: 'Music & Audio',
    tags: ['music', 'audio', 'streaming', 'instruments'],
    prompt: `Create a bookmark HTML file for music and audio resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Music Streaming</H3>
    <DL><p>
        <DT><A HREF="https://spotify.com">Spotify - Music Streaming</A>
        <DT><A HREF="https://music.apple.com">Apple Music</A>
        <!-- Other streaming services -->
    </DL><p>
    
    <DT><H3>Audio Production</H3>
    <DL><p>
        <DT><A HREF="https://pro-tools.com">Pro Tools - Audio Production</A>
        <!-- Other production tools -->
    </DL><p>
    
    <DT><H3>Music Learning</H3>
    <DL><p>
        <DT><A HREF="https://yousician.com">Yousician - Learn Instruments</A>
        <!-- Other music education -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Music streaming and discovery platforms
- Audio production and recording software
- Music education and instrument learning
- Sheet music and chord resources
- Audio equipment and gear reviews

Please provide only the HTML code with no explanations.`,
    example: 'Everything you need for music creation and enjoyment.'
  },
  {
    id: '19',
    title: 'Automotive & Transportation',
    description: 'Car reviews, public transit, and automotive resources',
    category: 'Automotive',
    tags: ['automotive', 'cars', 'transportation', 'reviews'],
    prompt: `Create a bookmark HTML file for automotive and transportation resources.

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Car Reviews & News</H3>
    <DL><p>
        <DT><A HREF="https://motortrend.com">MotorTrend - Car Reviews</A>
        <DT><A HREF="https://caranddriver.com">Car and Driver</A>
        <!-- Other automotive news -->
    </DL><p>
    
    <DT><H3>Car Shopping</H3>
    <DL><p>
        <DT><A HREF="https://cars.com">Cars.com - Used Cars</A>
        <!-- Other car shopping sites -->
    </DL><p>
    
    <DT><H3>Transportation Services</H3>
    <DL><p>
        <DT><A HREF="https://uber.com">Uber - Ride Sharing</A>
        <!-- Other transportation services -->
    </DL><p>
</DL>
\`\`\`

**Content requirements:**
- Automotive news and review sites
- Car buying and selling platforms
- Transportation and ride-sharing services
- Automotive maintenance and repair resources
- Electric vehicle and sustainability information

Please provide only the HTML code with no explanations.`,
    example: 'Complete automotive and transportation resource hub.'
  },
  {
    id: '20',
    title: 'Custom Prompt Generator',
    description: 'Request custom bookmark lists from AI for your specific needs',
    category: 'Custom',
    tags: ['custom', 'personal', 'specific', 'template'],
    prompt: `Create a bookmark HTML file for [WRITE YOUR NEED HERE].

**IMPORTANT:** Use the following HTML format:

\`\`\`html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DL><p>
    <DT><H3>Category 1 Name</H3>
    <DL><p>
        <DT><A HREF="site_url">Site Name - Brief Description</A>
        <!-- Other sites -->
    </DL><p>
    
    <DT><H3>Category 2 Name</H3>
    <DL><p>
        <DT><A HREF="site_url">Site Name - Brief Description</A>
        <!-- Other sites -->
    </DL><p>
    
    <!-- Add more categories if needed -->
    
    <!-- General sites outside categories -->
    <DT><A HREF="general_site_url">General Site - Description</A>
</DL>
\`\`\`

**Instructions:**
- Find the most popular and current sites related to the topic
- Organize into logical categories (will become folders)
- Add brief descriptions next to each site name explaining what it's used for
- Include YouTube channels if relevant
- Prioritize English sites, include local sites if relevant
- Only include active and working sites

Please provide only the HTML code with no additional explanations.

**EXAMPLE USAGE:**
- Write "Turkey economy news" → get economy sites
- Write "fitness and health" → get sports sites  
- Write "cooking recipes" → get cooking sites`,
    example: 'Use this template to create custom bookmark lists for any topic you want.'
  }
];

const CATEGORIES = ['All', 'News & Economy', 'Development', 'Social & Content', 'Shopping', 'Marketing', 'Health & Fitness', 'Education', 'Travel', 'Finance', 'Entertainment', 'Productivity', 'Food & Cooking', 'Science & Technology', 'Art & Design', 'Sports & Recreation', 'Real Estate', 'Photography & Video', 'Music & Audio', 'Automotive', 'Custom'];

export default function AIPromptsModal({ isOpen, onClose }: AIPromptsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrompt, setSelectedPrompt] = useState<AIPrompt | null>(null);

  const filteredPrompts = AI_PROMPTS.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    showToast({
      type: 'success',
      title: 'Copied!',
      message: 'Prompt copied to clipboard'
    });
  };

  const openAI = (prompt: string, aiSystem: string) => {
    const encodedPrompt = encodeURIComponent(prompt);
    let url = '';
    
    switch (aiSystem) {
      case 'chatgpt':
        url = `https://chat.openai.com/?q=${encodedPrompt}`;
        break;
      case 'claude':
        url = `https://claude.ai/chat`;
        break;
      case 'gemini':
        url = `https://gemini.google.com/chat`;
        break;
      case 'perplexity':
        url = `https://www.perplexity.ai/?q=${encodedPrompt}`;
        break;
      case 'copilot':
        url = `https://copilot.microsoft.com/?q=${encodedPrompt}`;
        break;
      case 'poe':
        url = `https://poe.com/`;
        break;
      default:
        url = `https://chat.openai.com/?q=${encodedPrompt}`;
    }
    
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  if (selectedPrompt) {
    // Detail View
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Detail Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedPrompt(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {selectedPrompt.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedPrompt.description}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Detail Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                {selectedPrompt.category}
              </span>
            </div>

            {/* Prompt Content */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-4 border border-slate-200 dark:border-slate-600">
              <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                {selectedPrompt.prompt}
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-3 h-3 text-slate-400" />
              <div className="flex flex-wrap gap-1">
                {selectedPrompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => copyPrompt(selectedPrompt.prompt)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-sm font-medium"
                >
                  <Copy className="w-4 h-4" />
                  Copy Prompt
                </button>
              </div>

              {/* AI Systems */}
              <div>
                <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Open in AI Systems:</h5>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  <button
                    onClick={() => openAI(selectedPrompt.prompt, 'chatgpt')}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    🤖 ChatGPT
                  </button>
                  <button
                    onClick={() => openAI(selectedPrompt.prompt, 'claude')}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    🧠 Claude
                  </button>
                  <button
                    onClick={() => openAI(selectedPrompt.prompt, 'gemini')}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    💎 Gemini
                  </button>
                  <button
                    onClick={() => openAI(selectedPrompt.prompt, 'perplexity')}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                  >
                    🔍 Perplexity
                  </button>
                  <button
                    onClick={() => openAI(selectedPrompt.prompt, 'copilot')}
                    className="flex items-center gap-2 px-3 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
                  >
                    💼 Copilot
                  </button>
                  <button
                    onClick={() => openAI(selectedPrompt.prompt, 'poe')}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                  >
                    🌟 Poe
                  </button>
                </div>
              </div>
            </div>

            {/* Example */}
            {selectedPrompt.example && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> {selectedPrompt.example}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden flex">
        
        {/* Left Sidebar - Categories */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-900">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  AI Prompts
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Bookmark generators
                </p>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {category}
                  {category !== 'All' && (
                    <span className="float-right text-xs opacity-60">
                      {AI_PROMPTS.filter(p => p.category === category).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {selectedCategory === 'All' ? 'All Prompts' : selectedCategory}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'} available
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content Grid */}
          <div className="p-4 overflow-y-auto flex-1">
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  No prompts found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your search or select a different category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    onClick={() => setSelectedPrompt(prompt)}
                    className="bg-white dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer transition-all hover:shadow-md min-h-[120px] flex flex-col"
                  >
                    {/* Title */}
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm leading-tight">
                      {prompt.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed flex-1 line-clamp-3">
                      {prompt.description}
                    </p>
                    
                    {/* Tags Preview */}
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-400 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {prompt.tags.length > 2 && (
                        <span className="text-xs text-slate-500">+{prompt.tags.length - 2}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}