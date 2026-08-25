import type { Metadata } from 'next';

import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sandalwood Product Catalogue | Riddhi Siddhi Arts & Crafts',
  description:
    'Browse the full catalogue of authentic Indian sandalwood handicrafts: japa malas, bead malas, handcarved elephants, loose beads, bracelets and tashbih, made in Jaipur.',
  alternates: { canonical: `${siteUrl()}/products` },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
