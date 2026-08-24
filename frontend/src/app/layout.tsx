import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Cinzel } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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

export const metadata: Metadata = {
  title: 'Riddhi Siddhi Arts & Crafts | Authentic Sandalwood Handicrafts Jaipur',
  description: 'Manufacturer, Exporter & Supplier of authentic Indian Sandalwood Handicrafts, Malas, Japa Malas, Elephants & Loose Beads in Jaipur, Rajasthan, India.',
  keywords: ['Sandalwood Mala', 'Japa Mala', 'Sandalwood Elephant', 'Jaipur Sandalwood', 'Riddhi Siddhi Arts', 'Ghanshyam Agrawal'],
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
      <body suppressHydrationWarning className="flex flex-col min-h-screen font-sans bg-brand-sandalwood-50 text-brand-navy-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

