import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  noIndex = false,
}: SEOConfig): Metadata {
  const baseUrl = 'https://cleantabs.app';
  const fullTitle = title.includes('CleanTabs') ? title : `${title} | CleanTabs`;
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const defaultOgImage = ogImage || `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'bookmark manager', 'digital organization', 'productivity', 'CleanTabs'],
    authors: [{ name: 'CleanTabs Team' }],
    creator: 'CleanTabs',
    publisher: 'CleanTabs',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'CleanTabs',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@cleantabs',
      images: [defaultOgImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateStructuredData(type: 'WebSite' | 'Organization' | 'SoftwareApplication' | 'Article') {
  const baseUrl = 'https://cleantabs.app';
  
  const commonData = {
    '@context': 'https://schema.org',
    url: baseUrl,
    name: 'CleanTabs',
  };

  switch (type) {
    case 'WebSite':
      return {
        ...commonData,
        '@type': 'WebSite',
        description: 'Transform digital chaos into organized clarity with CleanTabs - the minimalist bookmark manager',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      };

    case 'Organization':
      return {
        ...commonData,
        '@type': 'Organization',
        description: 'CleanTabs helps individuals and teams organize their digital bookmarks with a clean, intuitive interface',
        logo: `${baseUrl}/logo.png`,
        foundingDate: '2024',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'support@cleantabs.app',
        },
        sameAs: [
          'https://twitter.com/cleantabs',
          'https://github.com/cleantabs',
        ],
      };

    case 'SoftwareApplication':
      return {
        ...commonData,
        '@type': 'SoftwareApplication',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web Browser',
        description: 'A web-based bookmark manager that organizes your digital bookmarks with a clean 3-panel interface',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '150',
          bestRating: '5',
          worstRating: '1',
        },
        featureList: [
          '3-Panel Interface',
          'Drag & Drop Organization',
          'Smart Search',
          'Import from Any Browser',
          'Cross-Platform Sync',
          'Dark Mode Support',
        ],
      };

    default:
      return commonData;
  }
}

export const defaultKeywords = [
  'bookmark manager',
  'bookmark organizer',
  'digital organization',
  'productivity tool',
  'bookmark sync',
  'web bookmarks',
  'bookmark import',
  'site organization',
  'clean interface',
  'bookmark search',
];