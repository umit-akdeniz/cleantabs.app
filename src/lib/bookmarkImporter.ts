// Bookmark import utilities for parsing Chrome/Firefox bookmark files
// Supports both HTML and JSON formats

export interface BookmarkFolder {
  type: 'folder';
  title: string;
  children: (BookmarkItem | BookmarkFolder)[];
  addDate?: number;
}

export interface BookmarkItem {
  type: 'link';
  title: string;
  url: string;
  addDate?: number;
  icon?: string;
}

export interface ParsedBookmarks {
  folders: BookmarkFolder[];
  rootBookmarks: BookmarkItem[];
  totalBookmarks: number;
  totalFolders: number;
}

export interface ImportResult {
  success: boolean;
  message: string;
  categoriesCreated: number;
  subcategoriesCreated: number;
  sitesCreated: number;
  errors: string[];
}

// Parse HTML bookmark file (exported from Chrome/Firefox)
export function parseBookmarkHTML(htmlContent: string): ParsedBookmarks {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    // Server-side: use regex-based parsing
    return parseBookmarkHTMLRegex(htmlContent);
  }
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const folders: BookmarkFolder[] = [];
  const rootBookmarks: BookmarkItem[] = [];
  let totalBookmarks = 0;
  let totalFolders = 0;

  function parseNode(node: Element): BookmarkItem | BookmarkFolder | null {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href');
      const title = node.textContent?.trim() || 'Untitled';
      const addDate = node.getAttribute('add_date');
      const icon = node.getAttribute('icon');
      
      if (href && href.startsWith('http')) {
        totalBookmarks++;
        return {
          type: 'link',
          title,
          url: href,
          addDate: addDate ? parseInt(addDate) * 1000 : undefined,
          icon: icon || undefined
        };
      }
    } else if (node.tagName === 'H3') {
      // This is a folder header
      const title = node.textContent?.trim() || 'Untitled Folder';
      const addDate = node.getAttribute('add_date');
      
      // Find the next DL element which contains the folder contents
      let nextSibling = node.nextElementSibling;
      while (nextSibling && nextSibling.tagName !== 'DL') {
        nextSibling = nextSibling.nextElementSibling;
      }
      
      const children: (BookmarkItem | BookmarkFolder)[] = [];
      
      if (nextSibling && nextSibling.tagName === 'DL') {
        const dtElements = nextSibling.querySelectorAll(':scope > DT');
        dtElements.forEach(dt => {
          const child = dt.firstElementChild;
          if (child) {
            const parsed = parseNode(child);
            if (parsed) {
              children.push(parsed);
            }
          }
        });
      }
      
      totalFolders++;
      return {
        type: 'folder',
        title,
        children,
        addDate: addDate ? parseInt(addDate) * 1000 : undefined
      };
    }
    
    return null;
  }

  // Find the main DL element (usually the first one)
  const mainDL = doc.querySelector('DL');
  if (mainDL) {
    const topLevelDTs = mainDL.querySelectorAll(':scope > DT');
    
    topLevelDTs.forEach(dt => {
      const child = dt.firstElementChild;
      if (child) {
        const parsed = parseNode(child);
        if (parsed) {
          if (parsed.type === 'folder') {
            folders.push(parsed);
          } else {
            rootBookmarks.push(parsed);
          }
        }
      }
    });
  }

  return {
    folders,
    rootBookmarks,
    totalBookmarks,
    totalFolders
  };
}

// Server-side regex-based HTML parsing (fallback for when DOMParser is not available)
function parseBookmarkHTMLRegex(htmlContent: string): ParsedBookmarks {
  const folders: BookmarkFolder[] = [];
  const rootBookmarks: BookmarkItem[] = [];
  let totalBookmarks = 0;
  let totalFolders = 0;

  try {
    // Split content by folder sections
    const folderSections = htmlContent.split(/<h3[^>]*>/gi);
    
    // First section contains root bookmarks (before any folder)
    if (folderSections.length > 0) {
      const rootSection = folderSections[0];
      const rootLinkPattern = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
      const rootLinkMatches = [...rootSection.matchAll(rootLinkPattern)];
      
      rootLinkMatches.forEach(match => {
        const url = match[1];
        const title = match[2];
        
        if (url && title && url.startsWith('http')) {
          totalBookmarks++;
          rootBookmarks.push({
            type: 'link',
            title: title.trim().substring(0, 100),
            url: url.trim()
          });
        }
      });
    }

    // Process folder sections
    for (let i = 1; i < folderSections.length; i++) {
      const section = folderSections[i];
      
      // Extract folder name (everything before </h3>)
      const folderNameMatch = section.match(/^([^<]+)<\/h3>/i);
      if (!folderNameMatch) continue;
      
      const folderName = folderNameMatch[1].trim();
      if (!folderName) continue;
      
      totalFolders++;
      
      // Extract bookmarks in this folder (between <h3> and next <h3> or end)
      const folderContent = section.split(/<\/h3>/i)[1] || '';
      const linkPattern = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
      const linkMatches = [...folderContent.matchAll(linkPattern)];
      
      const folderBookmarks: BookmarkItem[] = [];
      linkMatches.forEach(match => {
        const url = match[1];
        const title = match[2];
        
        if (url && title && url.startsWith('http')) {
          totalBookmarks++;
          folderBookmarks.push({
            type: 'link',
            title: title.trim().substring(0, 100),
            url: url.trim()
          });
        }
      });
      
      if (folderBookmarks.length > 0) {
        folders.push({
          type: 'folder',
          title: folderName.substring(0, 50),
          children: folderBookmarks
        });
      }
    }

    // Limit results to prevent memory issues
    if (totalBookmarks > 1000) {
      return {
        folders: folders.slice(0, 10),
        rootBookmarks: rootBookmarks.slice(0, 500),
        totalBookmarks: Math.min(totalBookmarks, 1000),
        totalFolders: Math.min(totalFolders, 10)
      };
    }

  } catch (error) {
    console.error('Error parsing HTML bookmarks:', error);
    // Return minimal safe result
    return {
      folders: [],
      rootBookmarks: [],
      totalBookmarks: 0,
      totalFolders: 0
    };
  }

  return {
    folders,
    rootBookmarks,
    totalBookmarks,
    totalFolders
  };
}

// Parse Firefox JSON bookmark file
export function parseBookmarkJSON(jsonContent: string): ParsedBookmarks {
  try {
    const data = JSON.parse(jsonContent);
    
    const folders: BookmarkFolder[] = [];
    const rootBookmarks: BookmarkItem[] = [];
    let totalBookmarks = 0;
    let totalFolders = 0;

    function parseFirefoxNode(node: any): BookmarkItem | BookmarkFolder | null {
      if (node.type === 'text/x-moz-place') {
        if (node.uri) {
          // This is a bookmark
          totalBookmarks++;
          return {
            type: 'link',
            title: node.title || 'Untitled',
            url: node.uri,
            addDate: node.dateAdded ? new Date(node.dateAdded / 1000).getTime() : undefined
          };
        } else if (node.children) {
          // This is a folder
          totalFolders++;
          const children: (BookmarkItem | BookmarkFolder)[] = [];
          
          node.children.forEach((child: any) => {
            const parsed = parseFirefoxNode(child);
            if (parsed) {
              children.push(parsed);
            }
          });
          
          return {
            type: 'folder',
            title: node.title || 'Untitled Folder',
            children,
            addDate: node.dateAdded ? new Date(node.dateAdded / 1000).getTime() : undefined
          };
        }
      }
      
      return null;
    }

    // Firefox JSON has a root object with children
    if (data.children) {
      data.children.forEach((child: any) => {
        const parsed = parseFirefoxNode(child);
        if (parsed) {
          if (parsed.type === 'folder') {
            folders.push(parsed);
          } else {
            rootBookmarks.push(parsed);
          }
        }
      });
    }

    return {
      folders,
      rootBookmarks,
      totalBookmarks,
      totalFolders
    };
  } catch (error) {
    console.error('Error parsing JSON bookmark file:', error);
    return {
      folders: [],
      rootBookmarks: [],
      totalBookmarks: 0,
      totalFolders: 0
    };
  }
}

// Convert parsed bookmarks to our category structure
export function convertToCategories(parsed: ParsedBookmarks, browserType: 'firefox' | 'chrome' = 'firefox') {
  const categories: Array<{
    name: string;
    icon: string;
    subcategories: Array<{
      name: string;
      icon: string;
      sites: Array<{
        name: string;
        url: string;
        description?: string;
        favicon?: string;
      }>;
    }>;
  }> = [];

  // Create main bookmark category
  const mainCategory = {
    name: `Bookmarks - ${browserType === 'firefox' ? 'Firefox' : 'Chrome'}`,
    icon: browserType === 'firefox' ? '🦊' : '🟢',
    subcategories: [] as Array<{
      name: string;
      icon: string;
      sites: Array<{
        name: string;
        url: string;
        description?: string;
        favicon?: string;
      }>;
    }>
  };

  // Convert folders to subcategories
  parsed.folders.forEach(folder => {
    // Create subcategory for each folder
    const subcategory = {
      name: folder.title,
      icon: '📁',
      sites: [] as Array<{
        name: string;
        url: string;
        description?: string;
        favicon?: string;
      }>
    };

    // Add all bookmarks from this folder (including nested folders)
    function collectBookmarksFromFolder(items: (BookmarkItem | BookmarkFolder)[]) {
      items.forEach(item => {
        if (item.type === 'link') {
          subcategory.sites.push({
            name: item.title,
            url: item.url,
            favicon: item.icon
          });
        } else if (item.type === 'folder') {
          // For nested folders, flatten them into the parent subcategory
          collectBookmarksFromFolder(item.children);
        }
      });
    }

    collectBookmarksFromFolder(folder.children);
    
    // Only add subcategory if it has bookmarks
    if (subcategory.sites.length > 0) {
      mainCategory.subcategories.push(subcategory);
    }
  });

  // Add root bookmarks (bookmarks not in any folder) to "Genel" subcategory
  if (parsed.rootBookmarks.length > 0) {
    const generalSubcategory = {
      name: 'Genel',
      icon: '🌐',
      sites: parsed.rootBookmarks.map(bookmark => ({
        name: bookmark.title,
        url: bookmark.url,
        favicon: bookmark.icon
      }))
    };
    
    mainCategory.subcategories.push(generalSubcategory);
  }

  categories.push(mainCategory);
  
  return categories;
}

// Detect file type based on content
export function detectBookmarkFileType(content: string): 'html' | 'json' | 'unknown' {
  const trimmed = content.trim();
  
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.includes('<title>Bookmarks</title>')) {
    return 'html';
  }
  
  if (trimmed.startsWith('{') && trimmed.includes('"type":"text/x-moz-place"')) {
    return 'json';
  }
  
  return 'unknown';
}

// Main parsing function that auto-detects format
export function parseBookmarkFile(content: string): ParsedBookmarks {
  const fileType = detectBookmarkFileType(content);
  
  switch (fileType) {
    case 'html':
      return parseBookmarkHTML(content);
    case 'json':
      return parseBookmarkJSON(content);
    default:
      throw new Error('Unsupported bookmark file format. Please use HTML or JSON format.');
  }
}