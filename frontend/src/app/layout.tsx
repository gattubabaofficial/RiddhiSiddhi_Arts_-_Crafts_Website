import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Cinzel } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { siteUrl } from '@/lib/seo';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const SITE_NAME = 'Riddhi Siddhi Arts & Crafts';
const SITE_DESCRIPTION =
  'Manufacturer, Exporter & Supplier of authentic Indian Sandalwood Handicrafts, Malas, Japa Malas, Elephants & Loose Beads in Jaipur, Rajasthan, India.';

export const metadata: Metadata = {
  // Required for relative Open Graph / canonical URLs to resolve. Set
  // NEXT_PUBLIC_SITE_URL to the real domain before deploying.
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} | Authentic Sandalwood Handicrafts Jaipur`,
    // Per-route layouts supply their own full titles.
    template: '%s',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Sandalwood Mala',
    'Japa Mala',
    'Sandalwood Elephant',
    'Jaipur Sandalwood',
    'Riddhi Siddhi Arts',
    'Ghanshyam Agrawal',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Authentic Sandalwood Handicrafts Jaipur`,
    description: SITE_DESCRIPTION,
    locale: 'en_IN',
  },
  icons: {
    icon: '/logo-compact.jpeg',
    apple: '/logo-compact.jpeg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${plusJakarta.variable} ${cinzel.variable}`}>
      <body suppressHydrationWarning className="flex flex-col min-h-screen font-sans bg-white text-black">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

