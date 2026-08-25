'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-brand-navy-950 text-brand-gold-100/80 border-t border-brand-gold-500/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        
        {/* Company Info & Logo */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3.5 group inline-flex">
            <div className="relative w-12 h-12 rounded-xl bg-white p-1 shadow-md border border-brand-gold-400/30 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo-compact.jpeg"
                alt="Riddhi Siddhi Arts & Crafts"
                fill
                sizes="50px"
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <div className="font-serif font-bold text-lg text-white group-hover:text-brand-gold-300 transition-colors">
                Riddhi Siddhi
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="h-[1px] w-2.5 bg-brand-gold-400"></span>
                <span className="font-cinzel text-[9px] uppercase tracking-[0.2em] text-brand-gold-400 font-semibold">
                  Arts & Crafts
                </span>
                <span className="h-[1px] w-2.5 bg-brand-gold-400"></span>
              </div>
            </div>
          </Link>
          <p className="text-xs text-brand-gold-100/70 leading-relaxed">
            Jaipur’s premier manufacturer, exporter, and supplier of authentic Indian Sandalwood handicrafts, Japa malas, handcarved elephants, beads, and religious jewelry.
          </p>
          <div className="text-xs text-brand-gold-200/80 space-y-1 pt-2">
            <p><span className="text-brand-gold-400 font-medium font-cinzel">Proprietor:</span> Ghanshyam Agrawal</p>
            <p><span className="text-brand-gold-400 font-medium font-cinzel">GST No:</span> <span className="font-mono text-white">08ADOPA9061E1ZK</span></p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-cinzel font-bold text-brand-gold-400 text-xs mb-4 tracking-[0.2em] uppercase">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Our Heritage</Link></li>
            <li><Link href="/products" className="hover:text-white transition-colors">Our Product Catalog</Link></li>
            <li><Link href="/about#how-to-test" className="hover:text-white transition-colors">Sandalwood Authenticity Test</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact & Custom Quote</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-cinzel font-bold text-brand-gold-400 text-xs mb-4 tracking-[0.2em] uppercase">
            Product Categories
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/products/sandalwood-japa-mala" className="hover:text-white transition-colors">Sandalwood Japa Mala</Link></li>
            <li><Link href="/products/sandalwood-beads-mala" className="hover:text-white transition-colors">Sandalwood Beads Mala</Link></li>
            <li><Link href="/products/handcarved-elephants" className="hover:text-white transition-colors">Handcarved Elephants</Link></li>
            <li><Link href="/products/loose-sandalwood-beads" className="hover:text-white transition-colors">Loose Sandalwood Beads</Link></li>
            <li><Link href="/products/designer-sandalwood-bracelets" className="hover:text-white transition-colors">Designer Sandalwood Bracelets</Link></li>
            <li><Link href="/products/muslim-tashbih-misbahah" className="hover:text-white transition-colors">Muslim Tashbih Misbahah</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-cinzel font-bold text-brand-gold-400 text-xs mb-4 tracking-[0.2em] uppercase">
            Head Office
          </h4>
          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-brand-gold-400 shrink-0 mt-0.5" />
            <span className="text-brand-gold-100/80">Basement, Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India</span>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <a href="tel:+917942625339" className="flex items-center gap-2 text-xs hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-brand-gold-400" />
              +91-7942625339
            </a>
            <span className="inline-flex items-center gap-1.5 bg-brand-navy-900 border border-brand-gold-500/30 text-brand-gold-300 text-[11px] px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-brand-gold-400" />
              100% Genuine Certified
            </span>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-gold-200/50">
        <p>© {new Date().getFullYear()} Riddhi Siddhi Arts & Crafts. All rights reserved.</p>
        <p className="flex items-center gap-1 font-serif">
          Exquisite Handcrafted Indian Sandalwood from Jaipur
        </p>
      </div>
    </footer>
  );
}

