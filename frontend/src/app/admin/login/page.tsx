'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchAPI, setAuthToken, getAuthToken } from '@/lib/api';
import { Lock, Mail } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect right away
    const token = getAuthToken();
    if (token) {
      router.replace(redirectPath);
    }
  }, [router, redirectPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await fetchAPI<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!data?.access_token) {
        throw new Error('The server did not return a session token.');
      }

      setAuthToken(data.access_token);
      window.location.href = redirectPath;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#010F34] flex items-center justify-center p-4 font-sans">
      <div suppressHydrationWarning className="bg-[#021D62] border border-[#C0883B]/20 w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6 text-[#FAF0DE]">
        
        <div suppressHydrationWarning className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#C0883B] text-[#010F34] font-serif font-bold text-2xl mx-auto flex items-center justify-center shadow-lg">
            RS
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Admin Portal Login</h1>
          <p className="text-xs text-[#E8C795]/80 font-cinzel tracking-wider">
            Riddhi Siddhi Arts & Crafts Backoffice
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-sm" suppressHydrationWarning>
          <div>
            <label className="block text-xs font-medium text-[#E8C795] mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#010F34] border border-[#C0883B]/30 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#E8C795]/40 focus:outline-none focus:border-[#DCAD67] focus:ring-1 focus:ring-[#DCAD67]"
              />
              <Mail className="w-4 h-4 text-[#DCAD67] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#E8C795] mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#010F34] border border-[#C0883B]/30 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[#E8C795]/40 focus:outline-none focus:border-[#DCAD67] focus:ring-1 focus:ring-[#DCAD67]"
              />
              <Lock className="w-4 h-4 text-[#DCAD67] absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#C0883B] via-[#DCAD67] to-[#A67129] text-[#010F34] font-bold font-cinzel text-xs uppercase tracking-wider py-3.5 rounded-xl hover:brightness-110 shadow-lg shadow-[#C0883B]/20 transition-all cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Log In to Admin Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#010F34] flex items-center justify-center text-[#E8C795]">
        <div className="w-8 h-8 rounded-full border-2 border-[#C0883B] border-t-transparent animate-spin"></div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
