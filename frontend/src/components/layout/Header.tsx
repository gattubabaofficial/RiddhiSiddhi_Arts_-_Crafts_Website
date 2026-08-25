'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Send, Menu, X, Phone, MapPin, ChevronRight, Heart, User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Hide the header on admin pages. This must come AFTER every hook: returning
  // early above the useEffects changed the hook count between renders, so
  // navigating from /admin to a public page crashed with "rendered fewer hooks
  // than expected".
  if (isAdminRoute) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setMenuOpen(false);
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header
        className={`w-full z-40 fixed top-0 left-0 right-0 transition-all duration-300 ${
          scrolled
            ? 'bg-brand-navy-950/95 backdrop-blur-md shadow-xl border-b border-brand-gold-500/20 py-2.5'
            : 'bg-brand-navy-950/80 backdrop-blur-sm border-b border-brand-gold-500/10 py-3.5 md:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-2 md:gap-4">
          {/* Left: Menu & Search with Labels */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Menu Toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 p-2 bg-transparent hover:bg-white/10 border-none rounded-xl text-brand-gold-400 hover:text-white transition-all group cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md group-hover:scale-105 transition-transform" />
              <span className="text-[11px] md:text-xs font-cinzel font-semibold tracking-wider text-brand-gold-300 group-hover:text-white uppercase hidden sm:inline drop-shadow-sm">
                Menu
              </span>
            </button>

            {/* Search Icon with Label on Left */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 p-2 bg-transparent hover:bg-white/10 border-none rounded-xl text-brand-gold-400 hover:text-white transition-all group cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5 drop-shadow-md group-hover:scale-105 transition-transform" />
              <span className="text-[11px] md:text-xs font-cinzel font-semibold tracking-wider text-brand-gold-300 group-hover:text-white uppercase hidden sm:inline drop-shadow-sm">
                Search
              </span>
            </button>
          </div>

          {/* Middle: Brand Logo & Company Name */}
          <div className="flex items-center justify-center flex-1 px-2">
            <Link href="/" className="flex items-center gap-2.5 md:gap-3.5 group text-center">
              <div className="relative w-9 h-9 md:w-12 md:h-12 rounded-xl bg-white/95 p-1 shadow-md border border-brand-gold-400/30 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/logo-compact.jpeg"
                  alt="Riddhi Siddhi Arts & Crafts Logo"
                  fill
                  sizes="60px"
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="text-left sm:text-center">
                <div className="font-serif font-bold text-base sm:text-xl md:text-2xl text-white tracking-wide group-hover:text-brand-gold-300 transition-colors leading-tight drop-shadow-md whitespace-nowrap">
                  Riddhi Siddhi
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                  <span className="h-[1px] w-2 sm:w-3 bg-brand-gold-400"></span>
                  <span className="font-cinzel text-[8px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-brand-gold-400 font-semibold drop-shadow-sm whitespace-nowrap">
                    Arts & Crafts
                  </span>
                  <span className="h-[1px] w-2 sm:w-3 bg-brand-gold-400"></span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Call Us, Wishlist, My Profile Icons (Without text labels) */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            {/* Call Us Button */}
            <a
              href="tel:+917942625339"
              className="p-2 sm:p-2.5 bg-transparent hover:bg-white/10 border-none rounded-xl text-brand-gold-400 hover:text-white transition-all group flex items-center justify-center cursor-pointer"
              title="Call Us: +91-7942625339"
              aria-label="Call Us"
            >
              <Phone className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md group-hover:scale-110 transition-transform" />
            </a>

            {/* Wishlist Button */}
            <Link
              href="/products"
              className="p-2 sm:p-2.5 bg-transparent hover:bg-white/10 border-none rounded-xl text-brand-gold-400 hover:text-white transition-all group flex items-center justify-center cursor-pointer"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md group-hover:scale-110 transition-transform" />
            </Link>

            {/* My Profile Button */}
            <Link
              href="/admin/login"
              className="p-2 sm:p-2.5 bg-transparent hover:bg-white/10 border-none rounded-xl text-brand-gold-400 hover:text-white transition-all group flex items-center justify-center cursor-pointer"
              title="My Profile"
              aria-label="My Profile"
            >
              <User className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer from Left (Desktop & Mobile) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop Overlay */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer Panel Sliding from Left */}
        <div
          className={`absolute top-0 left-0 h-full w-full sm:w-[420px] bg-brand-navy-950 border-r border-brand-gold-500/20 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Top Bar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg bg-white p-1">
                  <Image
                    src="/logo-compact.jpeg"
                    alt="Logo"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Riddhi Siddhi</h3>
                  <p className="font-cinzel text-[9px] text-brand-gold-400 uppercase tracking-widest">Arts & Crafts</p>
                </div>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-brand-navy-900 border border-brand-gold-500/30 text-brand-gold-300 hover:text-white hover:border-brand-gold-400 flex items-center justify-center transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Box in Menu */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search malas, elephants, beads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-navy-900 border border-brand-gold-500/30 rounded-2xl py-3 pl-4 pr-11 text-sm text-white placeholder-brand-gold-200/40 focus:outline-none focus:border-brand-gold-400 focus:ring-1 focus:ring-brand-gold-400 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-3.5 text-brand-gold-400 hover:text-white transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Navigation Links */}
            <nav className="space-y-2 pt-2">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-brand-navy-900 text-white hover:text-brand-gold-300 transition-all group"
              >
                <span className="font-serif text-2xl group-hover:translate-x-1.5 transition-transform">Home</span>
                <ChevronRight className="w-4 h-4 text-brand-gold-400/60 group-hover:text-brand-gold-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-brand-navy-900 text-white hover:text-brand-gold-300 transition-all group"
              >
                <span className="font-serif text-2xl group-hover:translate-x-1.5 transition-transform">About Our Heritage</span>
                <ChevronRight className="w-4 h-4 text-brand-gold-400/60 group-hover:text-brand-gold-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-brand-navy-900 text-white hover:text-brand-gold-300 transition-all group"
              >
                <span className="font-serif text-2xl group-hover:translate-x-1.5 transition-transform">Our Products</span>
                <ChevronRight className="w-4 h-4 text-brand-gold-400/60 group-hover:text-brand-gold-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/about#how-to-test"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-brand-navy-900 text-white hover:text-brand-gold-300 transition-all group"
              >
                <span className="font-serif text-2xl group-hover:translate-x-1.5 transition-transform">Authenticity Test</span>
                <ChevronRight className="w-4 h-4 text-brand-gold-400/60 group-hover:text-brand-gold-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-brand-navy-900 text-white hover:text-brand-gold-300 transition-all group"
              >
                <span className="font-serif text-2xl group-hover:translate-x-1.5 transition-transform">Contact Us</span>
                <ChevronRight className="w-4 h-4 text-brand-gold-400/60 group-hover:text-brand-gold-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </nav>
          </div>

          {/* Bottom Actions & Info */}
          <div className="pt-6 space-y-4 border-t border-white/10">
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="w-full bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-cinzel font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-brand-gold-500/20 transition-all text-center"
            >
              <Send className="w-4 h-4" /> Send Wholesale Enquiry
            </Link>

            <div className="text-xs text-brand-gold-100/70 space-y-1.5 pt-2">
              <a href="tel:+917942625339" className="flex items-center gap-2 text-white hover:text-brand-gold-300 transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand-gold-400" /> +91-7942625339
              </a>
              <p className="flex items-start gap-2 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-brand-gold-400 shrink-0 mt-0.5" />
                Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


