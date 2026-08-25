import type { Metadata } from 'next';

import { siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact & Wholesale Enquiries | Riddhi Siddhi Arts & Crafts',
  description:
    'Contact Riddhi Siddhi Arts & Crafts in Jaipur for wholesale pricing, minimum order quantities, customisation and export enquiries on sandalwood handicrafts.',
  alternates: { canonical: `${siteUrl()}/contact` },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
