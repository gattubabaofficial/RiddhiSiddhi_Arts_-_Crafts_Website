import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Award, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sandalwood-950 text-sandalwood-300 border-t border-sandalwood-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-sandalwood-800">
        
        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-sandalwood-950 font-serif font-bold text-lg">
              RS
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-sandalwood-100">
                Riddhi Siddhi
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold">
                Arts & Crafts
              </p>
            </div>
          </div>
          <p className="text-xs text-sandalwood-400 leading-relaxed">
            Jaipur’s premier manufacturer, exporter, and supplier of authentic Indian Sandalwood handicrafts, Japa malas, handcarved elephants, beads, and religious jewelry.
          </p>
          <div className="text-xs text-sandalwood-400 space-y-1 pt-2">
            <p><span className="text-gold-400 font-medium">Proprietor:</span> Ghanshyam Agrawal</p>
            <p><span className="text-gold-400 font-medium">GST No:</span> 08ADOPA9061E1ZK</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-semibold text-sandalwood-100 text-sm mb-4 tracking-wider uppercase">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/" className="hover:text-gold-400 transition-colors">Home Page</Link></li>
            <li><Link href="/about" className="hover:text-gold-400 transition-colors">About Our Story</Link></li>
            <li><Link href="/products" className="hover:text-gold-400 transition-colors">Our Product Catalog</Link></li>
            <li><Link href="/about#how-to-test" className="hover:text-gold-400 transition-colors">Sandalwood Authenticity Test</Link></li>
            <li><Link href="/contact" className="hover:text-gold-400 transition-colors">Contact & Custom Quote</Link></li>
            <li><Link href="/admin/login" className="hover:text-gold-400 transition-colors">Admin Backoffice</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-serif font-semibold text-sandalwood-100 text-sm mb-4 tracking-wider uppercase">
            Product Categories
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/products/sandalwood-japa-mala" className="hover:text-gold-400 transition-colors">Sandalwood Japa Mala</Link></li>
            <li><Link href="/products/sandalwood-beads-mala" className="hover:text-gold-400 transition-colors">Sandalwood Beads Mala</Link></li>
            <li><Link href="/products/sandalwood-elephant" className="hover:text-gold-400 transition-colors">Handcarved Elephants</Link></li>
            <li><Link href="/products/sandalwood-beads" className="hover:text-gold-400 transition-colors">Loose Sandalwood Beads</Link></li>
            <li><Link href="/products/sandalwood-bracelet" className="hover:text-gold-400 transition-colors">Designer Sandalwood Bracelets</Link></li>
            <li><Link href="/products/sandalwood-tashbih" className="hover:text-gold-400 transition-colors">Muslim Tashbih Misbahah</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-serif font-semibold text-sandalwood-100 text-sm mb-4 tracking-wider uppercase">
            Head Office
          </h4>
          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <span>Basement, Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Phone className="w-4 h-4 text-gold-400 shrink-0" />
            <a href="tel:+917942625339" className="hover:text-gold-400 text-sandalwood-200 font-medium">+91-7942625339</a>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Mail className="w-4 h-4 text-gold-400 shrink-0" />
            <a href="mailto:info@riddhisiddhiarts.com" className="hover:text-gold-400">info@riddhisiddhiarts.com</a>
          </div>
          <div className="pt-2 flex items-center gap-3">
            <span className="bg-sandalwood-900 border border-sandalwood-800 text-gold-400 text-[11px] px-3 py-1.5 rounded-md flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              100% Genuine Certified
            </span>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sandalwood-500">
        <p>© {new Date().getFullYear()} Riddhi Siddhi Arts & Crafts. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed for authentic Jaipur Sandalwood Handicrafts
        </p>
      </div>
    </footer>
  );
}
