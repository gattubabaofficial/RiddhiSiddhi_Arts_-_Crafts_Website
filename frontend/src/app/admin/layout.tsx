'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, MessageSquare, Star, Video, Image as ImageIcon,
  Settings, LogOut, Home, ExternalLink
} from 'lucide-react';
import { getAuthToken, removeAuthToken } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setIsAuthenticated(false);
      setIsChecking(false);
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsAuthenticated(true);
      setIsChecking(false);
    }
  }, [pathname, router]);

  // If on login page, render login page directly without admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state while checking token
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#010F34] text-[#E8C795] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 rounded-full border-3 border-[#C0883B] border-t-transparent animate-spin"></div>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#E8C795]">Checking Admin Authentication...</p>
      </div>
    );
  }

  // Not authenticated: redirecting screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#010F34] text-[#E8C795] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 rounded-full border-3 border-[#C0883B] border-t-transparent animate-spin"></div>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#E8C795]">Redirecting to Admin Login...</p>
        <Link
          href="/admin/login"
          className="mt-2 text-xs bg-[#C0883B] text-[#010F34] font-bold px-4 py-2 rounded-xl"
        >
          Click here if not redirected automatically
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Enquiries Inbox', href: '/admin/enquiries', icon: MessageSquare },
    { label: 'Reviews Moderation', href: '/admin/reviews', icon: Star },
    { label: 'Reels Manager', href: '/admin/reels', icon: Video },
    { label: 'Banners & Media', href: '/admin/banners', icon: ImageIcon },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    removeAuthToken();
    window.location.href = '/admin/login';
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#010F34] text-white flex flex-col md:flex-row font-sans">
      
      {/* Left Sticky Sidebar Navigation */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#021D62] border-r border-[#C0883B]/20 p-6 flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0 md:overflow-y-auto shadow-2xl z-40">
        <div className="space-y-8">
          
          {/* Logo & Header */}
          <div className="flex items-center gap-3 pb-2 border-b border-[#C0883B]/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DCAD67] to-[#C0883B] text-[#010F34] font-serif font-bold text-lg flex items-center justify-center shadow-md shrink-0">
              RS
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-white tracking-wide">
                Admin Panel
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-[#DCAD67] font-semibold block font-cinzel">
                Riddhi Siddhi Arts
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-[#C0883B] via-[#DCAD67] to-[#A67129] text-[#010F34] font-bold shadow-lg shadow-[#C0883B]/20 scale-[1.02]'
                      : 'text-[#FAF0DE]/70 hover:bg-[#0A2454] hover:text-white hover:translate-x-1'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#010F34]' : 'text-[#DCAD67]'}`} />
                  <span className="text-xs uppercase tracking-wider font-cinzel">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#C0883B]/20 space-y-2 mt-6">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#E8C795]/80 hover:text-white hover:bg-[#0A2454] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-[#DCAD67]" />
              <span>View Public Site</span>
            </div>
            <ExternalLink className="w-3 h-3 text-[#DCAD67]/60" />
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (Right Side) */}
      <main className="flex-1 min-h-screen p-6 md:p-10 overflow-y-auto bg-[#010F34] text-white">
        {children}
      </main>
    </div>
  );
}
