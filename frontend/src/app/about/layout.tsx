import type { Metadata } from 'next';

import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Us | Riddhi Siddhi Arts & Crafts, Jaipur',
  description:
    'Riddhi Siddhi Arts & Crafts is a Jaipur-based manufacturer and exporter of authentic Indian sandalwood handicrafts, led by proprietor Ghanshyam Agrawal.',
  alternates: { canonical: `${siteUrl()}/about` },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
