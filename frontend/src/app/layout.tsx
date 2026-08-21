import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Riddhi Siddhi Arts & Crafts | Sandalwood Handicrafts Jaipur',
  description: 'Manufacturer, Exporter & Supplier of authentic Indian Sandalwood Handicrafts, Malas, Japa Malas, Elephants & Loose Beads in Jaipur, Rajasthan, India.',
  keywords: ['Sandalwood Mala', 'Japa Mala', 'Sandalwood Elephant', 'Jaipur Sandalwood', 'Riddhi Siddhi Arts', 'Ghanshyam Agrawal'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
