import { NextRequest, NextResponse } from 'next/server';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';

// Security validation for AI prompts
function validatePrompt(prompt: string): { isValid: boolean; error?: string } {
  // Check length
  if (prompt.length > 1000) {
    return { isValid: false, error: 'Prompt too long. Please keep it under 1000 characters.' };
  }

  // Block malicious patterns
  const maliciousPatterns = [
    /javascript:/i,
    /<script/i,
    /onload=/i,
    /onerror=/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i,
    /exec\s*\(/i
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(prompt)) {
      return { isValid: false, error: 'Invalid characters detected in prompt.' };
    }
  }

  return { isValid: true };
}

// Generate bookmarks based on AI prompt
function generateBookmarks(prompt: string) {
  const topics = extractTopics(prompt);
  const bookmarks = [];

  // Generate relevant bookmarks based on topics
  for (const topic of topics) {
    const sites = getRelevantSites(topic);
    bookmarks.push(...sites);
  }

  // Create HTML format for consistency
  const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file. -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>AI Generated Bookmarks</TITLE>
<H1>Bookmarks</H1>

<DT><H3 FOLDED>${prompt.slice(0, 50)}...</H3>
<DL><p>
${bookmarks.map(bookmark => 
  `    <DT><A HREF="${bookmark.url}">${bookmark.title}</A>`
).join('\n')}
</DL><p>`;

  return html;
}

function extractTopics(prompt: string): string[] {
  const commonTopics = {
    'web development': ['react', 'javascript', 'typescript', 'nodejs', 'css', 'html'],
    'design': ['figma', 'adobe', 'sketch', 'ui', 'ux', 'color'],
    'productivity': ['notion', 'trello', 'slack', 'calendar', 'task'],
    'learning': ['documentation', 'tutorial', 'course', 'education'],
    'development tools': ['github', 'vscode', 'terminal', 'api', 'testing'],
    'data science': ['python', 'jupyter', 'pandas', 'machine learning', 'ai'],
    'marketing': ['analytics', 'seo', 'social media', 'email'],
    'business': ['startup', 'finance', 'management', 'strategy']
  };

  const foundTopics = [];
  const lowerPrompt = prompt.toLowerCase();

  for (const [topic, keywords] of Object.entries(commonTopics)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword)) || lowerPrompt.includes(topic)) {
      foundTopics.push(topic);
    }
  }

  return foundTopics.length > 0 ? foundTopics : ['general'];
}

function getRelevantSites(topic: string) {
  const sitesDb = {
    'web development': [
      { title: 'React Documentation', url: 'https://reactjs.org/docs', description: 'Official React documentation' },
      { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', description: 'Web development resources' },
      { title: 'JavaScript Info', url: 'https://javascript.info/', description: 'Modern JavaScript tutorial' },
      { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', description: 'TypeScript documentation' },
      { title: 'Node.js Documentation', url: 'https://nodejs.org/docs/', description: 'Node.js official docs' },
      { title: 'CSS-Tricks', url: 'https://css-tricks.com/', description: 'CSS tips and tricks' },
      { title: 'Can I Use', url: 'https://caniuse.com/', description: 'Browser compatibility tables' },
      { title: 'Stack Overflow', url: 'https://stackoverflow.com/', description: 'Developer Q&A community' }
    ],
    'design': [
      { title: 'Figma', url: 'https://figma.com/', description: 'Collaborative design tool' },
      { title: 'Dribbble', url: 'https://dribbble.com/', description: 'Design inspiration' },
      { title: 'Behance', url: 'https://behance.net/', description: 'Creative portfolios' },
      { title: 'Adobe Creative Cloud', url: 'https://creative.adobe.com/', description: 'Adobe design tools' },
      { title: 'Coolors', url: 'https://coolors.co/', description: 'Color palette generator' },
      { title: 'Unsplash', url: 'https://unsplash.com/', description: 'Free stock photos' },
      { title: 'Google Fonts', url: 'https://fonts.google.com/', description: 'Free web fonts' }
    ],
    'productivity': [
      { title: 'Notion', url: 'https://notion.so/', description: 'All-in-one workspace' },
      { title: 'Trello', url: 'https://trello.com/', description: 'Project management boards' },
      { title: 'Slack', url: 'https://slack.com/', description: 'Team communication' },
      { title: 'Google Calendar', url: 'https://calendar.google.com/', description: 'Schedule management' },
      { title: 'Todoist', url: 'https://todoist.com/', description: 'Task management' },
      { title: 'Evernote', url: 'https://evernote.com/', description: 'Note taking app' },
      { title: 'RescueTime', url: 'https://rescuetime.com/', description: 'Time tracking tool' }
    ],
    'learning': [
      { title: 'Khan Academy', url: 'https://khanacademy.org/', description: 'Free online courses' },
      { title: 'Coursera', url: 'https://coursera.org/', description: 'University courses online' },
      { title: 'freeCodeCamp', url: 'https://freecodecamp.org/', description: 'Free coding education' },
      { title: 'Codecademy', url: 'https://codecademy.com/', description: 'Interactive coding lessons' },
      { title: 'Udemy', url: 'https://udemy.com/', description: 'Online video courses' },
      { title: 'edX', url: 'https://edx.org/', description: 'University-level courses' },
      { title: 'YouTube', url: 'https://youtube.com/', description: 'Educational videos' }
    ],
    'development tools': [
      { title: 'GitHub', url: 'https://github.com/', description: 'Code hosting platform' },
      { title: 'GitLab', url: 'https://gitlab.com/', description: 'DevOps platform' },
      { title: 'Visual Studio Code', url: 'https://code.visualstudio.com/', description: 'Code editor' },
      { title: 'Postman', url: 'https://postman.com/', description: 'API testing tool' },
      { title: 'Docker Hub', url: 'https://hub.docker.com/', description: 'Container registry' },
      { title: 'npm', url: 'https://npmjs.com/', description: 'JavaScript package manager' },
      { title: 'CodePen', url: 'https://codepen.io/', description: 'Online code editor' }
    ],
    'general': [
      { title: 'Google', url: 'https://google.com/', description: 'Search engine' },
      { title: 'Wikipedia', url: 'https://wikipedia.org/', description: 'Free encyclopedia' },
      { title: 'Gmail', url: 'https://gmail.com/', description: 'Email service' },
      { title: 'Google Drive', url: 'https://drive.google.com/', description: 'Cloud storage' },
      { title: 'YouTube', url: 'https://youtube.com/', description: 'Video platform' },
      { title: 'Reddit', url: 'https://reddit.com/', description: 'Community discussions' }
    ]
  };

  return sitesDb[topic as keyof typeof sitesDb] || sitesDb['general'];
}

export async function POST(request: NextRequest) {
  try {
    const user = await MiddlewareUtils.getAuthenticatedUser(request);
    
    if (!user) {
      return MiddlewareUtils.unauthorizedResponse();
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Valid prompt required' }, { status: 400 });
    }

    // Validate prompt for security
    const validation = validatePrompt(prompt);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Generate bookmarks
    const bookmarkData = generateBookmarks(prompt);

    return NextResponse.json({
      success: true,
      bookmarkData,
      message: 'Bookmarks generated successfully'
    });

  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate bookmarks' 
    }, { status: 500 });
  }
}