import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/settings/',
          '/preferences/',
          '/account/',
          '/reminders/',
          '/api/',
          '/auth/verified/',
        ],
      },
    ],
    sitemap: 'https://cleantabs.app/sitemap.xml',
  };
}