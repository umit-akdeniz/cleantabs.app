import { generateSEO } from '@/lib/seo';
import HelpPageClient from './HelpPageClient';

export const metadata = generateSEO({
  title: 'Help Center - CleanTabs Support & FAQ',
  description: 'Get answers to common questions about CleanTabs bookmark manager. Find video tutorials, import guides, and step-by-step help for organizing your digital bookmarks.',
  keywords: ['cleantabs help', 'bookmark manager support', 'FAQ', 'tutorials', 'help center', 'user guide', 'bookmark organization help'],
  canonical: '/help',
});

export default function HelpPage() {
  return <HelpPageClient />;
}

