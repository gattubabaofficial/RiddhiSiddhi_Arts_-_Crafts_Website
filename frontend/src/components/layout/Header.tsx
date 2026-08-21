'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Search, Send, Menu, X, ShieldCheck, User } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-sandalwood-900 text-sandalwood-50 shadow-md">
      {/* Top Utility Bar */}
      <div className="bg-sandalwood-950 border-b border-sandalwood-800 text-xs py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4 text-sandalwood-300">
            <span className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              Jaipur, Rajasthan, India
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
              GST: 08ADOPA9061E1ZK
            </span>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-sandalwood-950 font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            RS
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl md:text-2xl text-sandalwood-100 group-hover:text-gold-400 transition-colors tracking-wide">
              Riddhi Siddhi
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold">
              Arts & Crafts • Jaipur
            </p>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
          <input
            type="text"
            placeholder="Search sandalwood malas, elephants, beads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-sandalwood-800 border border-sandalwood-700 rounded-full py-2 pl-4 pr-10 text-sm text-sandalwood-100 placeholder-sandalwood-400 focus:outline-none focus:border-gold-500 transition-colors"
          />
          <button type="submit" className="absolute right-3 text-sandalwood-400 hover:text-gold-400">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Navigation & CTA */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
          <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-gold-400 transition-colors">About Us</Link>
          <Link href="/products" className="hover:text-gold-400 transition-colors">Our Products</Link>
          <Link href="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link>
          <Link
            href="/contact"
            className="bg-gradient-to-r from-gold-500 to-gold-600 text-sandalwood-950 px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:brightness-110 shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4" />
            Send Enquiry
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-sandalwood-100 hover:text-gold-400 p-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-sandalwood-950 border-t border-sandalwood-800 px-6 py-6 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex items-center relative mb-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sandalwood-900 border border-sandalwood-700 rounded-full py-2 pl-4 pr-10 text-sm text-sandalwood-100"
            />
            <button type="submit" className="absolute right-3 text-gold-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-gold-400">Home</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-gold-400">About Us</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-gold-400">Our Products</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-gold-400">Contact Us</Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-gold-500 text-sandalwood-950 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 mt-2"
          >
            <Send className="w-5 h-5" />
            Send Enquiry
          </Link>
        </div>
      )}
    </header>
  );
}
