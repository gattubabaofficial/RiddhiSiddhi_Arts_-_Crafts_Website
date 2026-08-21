'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, MessageSquare, Star, Video, Image as ImageIcon,
  Settings, LogOut, ShieldCheck, Home
} from 'lucide-react';
import { getAuthToken, removeAuthToken } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setIsAuthenticated(false);
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-sandalwood-950 flex items-center justify-center text-sandalwood-300">Checking auth state...</div>;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products CRUD', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Enquiries Inbox', href: '/admin/enquiries', icon: MessageSquare },
    { label: 'Reviews Moderation', href: '/admin/reviews', icon: Star },
    { label: 'Reels Manager', href: '/admin/reels', icon: Video },
    { label: 'Banners & Media', href: '/admin/banners', icon: ImageIcon },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-sandalwood-950 text-sandalwood-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-sandalwood-900 border-r border-sandalwood-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo & Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500 text-sandalwood-950 font-serif font-bold text-lg flex items-center justify-center">
              RS
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-sandalwood-100">
                Admin Panel
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                Riddhi Siddhi Arts
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    active
                      ? 'bg-gold-500 text-sandalwood-950 font-bold shadow-md'
                      : 'text-sandalwood-300 hover:bg-sandalwood-800 hover:text-gold-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-sandalwood-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-sandalwood-400 hover:text-gold-400"
          >
            <Home className="w-4 h-4" /> View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 font-semibold pt-2"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-sandalwood-950">
        {children}
      </main>
    </div>
  );
}
