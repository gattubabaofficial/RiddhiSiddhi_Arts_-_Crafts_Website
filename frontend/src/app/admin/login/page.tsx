'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI, setAuthToken } from '@/lib/api';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@riddhisiddhi.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetchAPI<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(res.access_token);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sandalwood-950 flex items-center justify-center p-4">
      <div className="bg-sandalwood-900 border border-sandalwood-800 w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6 text-sandalwood-100">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gold-500 text-sandalwood-950 font-serif font-bold text-2xl mx-auto flex items-center justify-center shadow-lg">
            RS
          </div>
          <h1 className="font-serif text-2xl font-bold">Admin Portal Login</h1>
          <p className="text-xs text-sandalwood-400">
            Riddhi Siddhi Arts & Crafts Backoffice
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-sandalwood-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl py-2.5 pl-10 pr-4 text-sandalwood-100 placeholder-sandalwood-500 focus:border-gold-500"
              />
              <Mail className="w-4 h-4 text-sandalwood-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-sandalwood-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl py-2.5 pl-10 pr-4 text-sandalwood-100 placeholder-sandalwood-500 focus:border-gold-500"
              />
              <Lock className="w-4 h-4 text-sandalwood-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-sandalwood-950 font-bold py-3 rounded-xl hover:brightness-110 shadow-lg transition-all"
          >
            {loading ? 'Authenticating...' : 'Log In to Admin Dashboard'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-sandalwood-500">
          Default Seed Login: <span className="text-gold-400">admin@riddhisiddhi.com</span> / <span className="text-gold-400">admin123</span>
        </div>
      </div>
    </div>
  );
}
