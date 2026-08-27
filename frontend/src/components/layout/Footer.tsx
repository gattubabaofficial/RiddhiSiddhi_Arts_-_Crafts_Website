'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, ShieldCheck, Send, ArrowRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-white text-neutral-700 border-t border-neutral-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-100">

        {/* Company Info & Logo */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3.5 group inline-flex">
            <div className="relative w-12 h-12 rounded-xl bg-white p-1 shadow-sm border border-neutral-200 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo-compact.jpeg"
                alt="Riddhi Siddhi Arts & Crafts"
                fill
                sizes="50px"
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <div className="font-serif font-bold text-lg text-[#0B3C84] group-hover:opacity-80 transition-opacity">
                Riddhi Siddhi
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="h-[1px] w-2.5 bg-[#B3873E]"></span>
                <span className="font-cinzel text-[9px] uppercase tracking-[0.2em] text-[#B3873E] font-semibold">
                  Arts & Crafts
                </span>
                <span className="h-[1px] w-2.5 bg-[#B3873E]"></span>
              </div>
            </div>
          </Link>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Jaipur’s premier manufacturer, exporter, and supplier of authentic Indian Sandalwood handicrafts, Japa malas, handcarved elephants, beads, and religious jewelry.
          </p>
          <div className="text-xs text-neutral-600 space-y-1 pt-1">
            <p><span className="text-[#0B3C84] font-medium font-cinzel">Proprietor:</span> Ghanshyam Agrawal</p>
            <p><span className="text-[#0B3C84] font-medium font-cinzel">GST No:</span> <span className="font-mono text-neutral-800">08ADOPA9061E1ZK</span></p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-cinzel font-bold text-[#0B3C84] text-xs mb-4 tracking-[0.2em] uppercase">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">Home Page</Link></li>
            <li><Link href="/about" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">About Our Heritage</Link></li>
            <li><Link href="/products" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">Our Product Catalog</Link></li>
            <li><Link href="/about#how-to-test" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">Sandalwood Authenticity Test</Link></li>
            <li><Link href="/contact" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">Contact & Custom Quote</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-cinzel font-bold text-[#0B3C84] text-xs mb-4 tracking-[0.2em] uppercase">
            Product Categories
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/products/sandalwood-japa-mala" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">Sandalwood Japa Mala</Link></li>
            <li><Link href="/products/sandalwood-beads-mala" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">Sandalwood Beads Mala</Link></li>
            <li><Link href="/products/handcarved-elephants" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">Handcarved Elephants</Link></li>
            <li><Link href="/products/loose-sandalwood-beads" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">Loose Sandalwood Beads</Link></li>
            <li><Link href="/products/designer-sandalwood-bracelets" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">Designer Sandalwood Bracelets</Link></li>
            <li><Link href="/products/muslim-tashbih-misbahah" className="text-neutral-600 hover:text-[#0B3C84] transition-colors cursor-pointer block py-0.5">Muslim Tashbih Misbahah</Link></li>
          </ul>
        </div>

        {/* Contact Info & Blue Buttons */}
        <div className="space-y-3">
          <h4 className="font-cinzel font-bold text-[#0B3C84] text-xs mb-4 tracking-[0.2em] uppercase">
            Head Office
          </h4>
          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-[#B3873E] shrink-0 mt-0.5" />
            <span className="text-neutral-600">Basement, Plot 115, Mohan Nagar, Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India</span>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="tel:+917942625339"
              className="bg-[#0B3C84] text-white text-xs font-cinzel font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm w-full text-center cursor-pointer select-none"
            >
              <Phone className="w-3.5 h-3.5" /> Call +91-7942625339
            </a>

            <Link
              href="/contact"
              className="bg-[#0B3C84] text-white text-xs font-cinzel font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm w-full text-center cursor-pointer select-none"
            >
              <Send className="w-3.5 h-3.5" /> Send Wholesale Enquiry
            </Link>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} Riddhi Siddhi Arts & Crafts. All rights reserved.</p>
        <p className="flex items-center gap-1 font-serif text-neutral-600">
          Exquisite Handcrafted Indian Sandalwood from Jaipur
        </p>
      </div>
    </footer>
  );
}

