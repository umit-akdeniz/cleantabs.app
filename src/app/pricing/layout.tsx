import { generateSEO } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  ...generateSEO({
    title: "CleanTabs Pricing - Free & Premium Plans for Bookmark Organization",
    description: "Choose the perfect CleanTabs plan for your needs. Start free with unlimited bookmarks, or upgrade to Premium for advanced features like API access, team collaboration, and priority support.",
    keywords: ['cleantabs pricing', 'bookmark manager pricing', 'free bookmark manager', 'premium bookmark features', 'pricing plans', 'bookmark organization pricing', 'productivity tool pricing', 'digital organization pricing'],
    canonical: '/pricing',
  }),
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}