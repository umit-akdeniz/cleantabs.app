export async function fetchFavicon(url: string): Promise<string | null> {
  try {
    const hostname = new URL(url).hostname;
    
    // Use reliable favicon services
    const faviconUrls = [
      `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
      `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
      `https://icon.horse/icon/${hostname}`,
      `https://api.faviconkit.com/${hostname}/32`,
      `https://${hostname}/favicon.ico`
    ];

    // Return the first viable URL (Google's service is most reliable)
    return faviconUrls[0];
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return null;
  }
}

export function extractDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return url;
  }
}

// Generate creative initials with better logic
export function generateCreativeInitials(name: string, customInitials?: string): string {
  if (customInitials && customInitials.trim()) {
    return customInitials.slice(0, 2).toUpperCase();
  }
  
  const words = name.trim().split(/\s+/);
  
  if (words.length === 1) {
    // Single word: take first two characters
    return words[0].slice(0, 2).toUpperCase();
  } else if (words.length === 2) {
    // Two words: take first character of each
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  } else {
    // Multiple words: take first character of first two words
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
}

// Generate creative background patterns
export function generateCreativeBackground(name: string): string {
  const patterns = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)',
    'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
  ];
  
  // Use name hash to consistently pick the same pattern
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % patterns.length;
  
  return patterns[index];
}

// Create geometric clip path based on initials
export function createGeometricClipPath(initials: string): string {
  const shapes: { [key: string]: string } = {
    'A': 'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle
    'B': 'circle(50% at 50% 50%)', // Circle
    'C': 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)', // Octagon
    'D': 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', // Rounded square
    'E': 'polygon(25% 0%, 100% 0%, 100% 25%, 75% 25%, 75% 75%, 100% 75%, 100% 100%, 25% 100%, 0% 75%, 0% 25%)', // E shape
    'F': 'polygon(0% 0%, 100% 0%, 100% 25%, 50% 25%, 50% 50%, 75% 50%, 75% 75%, 0% 75%)', // F shape
    'G': 'polygon(50% 0%, 80% 10%, 100% 40%, 90% 70%, 60% 100%, 40% 100%, 10% 70%, 0% 40%, 20% 10%)', // Star-like
    'H': 'polygon(0% 0%, 25% 0%, 25% 40%, 75% 40%, 75% 0%, 100% 0%, 100% 100%, 75% 100%, 75% 60%, 25% 60%, 25% 100%, 0% 100%)', // H shape
    'I': 'polygon(25% 0%, 75% 0%, 75% 25%, 62.5% 25%, 62.5% 75%, 75% 75%, 75% 100%, 25% 100%, 25% 75%, 37.5% 75%, 37.5% 25%, 25% 25%)', // I shape
    'J': 'polygon(50% 0%, 100% 0%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 50% 25%)', // J shape
    'default': 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond
  };
  
  const firstLetter = initials.charAt(0);
  return shapes[firstLetter] || shapes['default'];
}