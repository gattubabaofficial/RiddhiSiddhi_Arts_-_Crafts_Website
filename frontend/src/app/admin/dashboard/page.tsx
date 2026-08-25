'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Product, Category, Enquiry, Review, Reel } from '@/types';
import { Package, FolderTree, MessageSquare, Star, Video, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        const [pRes, cRes, eRes, rRes, relRes] = await Promise.all([
          fetchAPI<Product[]>('/products?limit=100').catch(() => []),
          fetchAPI<Category[]>('/categories').catch(() => []),
          fetchAPI<Enquiry[]>('/enquiries').catch(() => []),
          fetchAPI<Review[]>('/reviews/admin/all').catch(() => []),
          fetchAPI<Reel[]>('/reels').catch(() => []),
        ]);
        setProducts(pRes);
        setCategories(cRes);
        setEnquiries(eRes);
        setReviews(rRes);
        setReels(relRes);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardStats();
  }, []);

  const pendingEnquiries = enquiries.filter(e => e.status === 'new');
  const pendingReviews = reviews.filter(r => r.status === 'pending');

  if (loading) {
    return <div className="text-brand-gold-300 font-cinzel">Loading admin dashboard overview...</div>;
  }

  return (
    <div className="space-y-10">
      
      <div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Admin Dashboard</h1>
        <p className="text-xs text-brand-gold-200/70 mt-1">Manage catalog products, customer quote enquiries, and site content.</p>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Link href="/admin/products" className="bg-brand-navy-900 border border-brand-gold-500/20 p-5 rounded-2xl space-y-3 hover:border-brand-gold-400 hover:shadow-lg hover:shadow-brand-gold-500/10 transition-all group">
          <div className="flex justify-between items-center text-brand-gold-400 group-hover:text-brand-gold-300">
            <Package className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-white block">{products.length}</span>
            <span className="text-[11px] text-brand-gold-300/80 uppercase tracking-wider font-semibold">Total Products</span>
          </div>
        </Link>

        <Link href="/admin/categories" className="bg-brand-navy-900 border border-brand-gold-500/20 p-5 rounded-2xl space-y-3 hover:border-brand-gold-400 hover:shadow-lg hover:shadow-brand-gold-500/10 transition-all group">
          <div className="flex justify-between items-center text-brand-gold-400 group-hover:text-brand-gold-300">
            <FolderTree className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-white block">{categories.length}</span>
            <span className="text-[11px] text-brand-gold-300/80 uppercase tracking-wider font-semibold">Categories</span>
          </div>
        </Link>

        <Link href="/admin/enquiries" className="bg-brand-navy-900 border border-brand-gold-500/20 p-5 rounded-2xl space-y-3 hover:border-brand-gold-400 hover:shadow-lg hover:shadow-brand-gold-500/10 transition-all group">
          <div className="flex justify-between items-center text-brand-gold-400 group-hover:text-brand-gold-300">
            <MessageSquare className="w-6 h-6" />
            <span className="bg-brand-gold-500 text-brand-navy-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              {pendingEnquiries.length} New
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-white block">{enquiries.length}</span>
            <span className="text-[11px] text-brand-gold-300/80 uppercase tracking-wider font-semibold">Enquiries</span>
          </div>
        </Link>

        <Link href="/admin/reviews" className="bg-brand-navy-900 border border-brand-gold-500/20 p-5 rounded-2xl space-y-3 hover:border-brand-gold-400 hover:shadow-lg hover:shadow-brand-gold-500/10 transition-all group">
          <div className="flex justify-between items-center text-brand-gold-400 group-hover:text-brand-gold-300">
            <Star className="w-6 h-6" />
            <span className="bg-amber-400 text-brand-navy-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              {pendingReviews.length} Pending
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-white block">{reviews.length}</span>
            <span className="text-[11px] text-brand-gold-300/80 uppercase tracking-wider font-semibold">Reviews</span>
          </div>
        </Link>

        <Link href="/admin/reels" className="bg-brand-navy-900 border border-brand-gold-500/20 p-5 rounded-2xl space-y-3 hover:border-brand-gold-400 hover:shadow-lg hover:shadow-brand-gold-500/10 transition-all group">
          <div className="flex justify-between items-center text-brand-gold-400 group-hover:text-brand-gold-300">
            <Video className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-white block">{reels.length}</span>
            <span className="text-[11px] text-brand-gold-300/80 uppercase tracking-wider font-semibold">Reels</span>
          </div>
        </Link>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-brand-navy-900 border border-brand-gold-500/20 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-white">
            Recent Customer Enquiries
          </h2>
          <Link href="/admin/enquiries" className="text-xs font-bold text-brand-gold-400 hover:text-brand-gold-300 hover:underline">
            View All Inbox &rarr;
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <p className="text-xs text-brand-gold-300/60 py-4">No customer enquiries submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-navy-800 text-brand-gold-400 uppercase tracking-wider bg-brand-navy-950/60">
                  <th className="py-3.5 px-4 font-cinzel">Client Name</th>
                  <th className="py-3.5 px-4 font-cinzel">Contact Info</th>
                  <th className="py-3.5 px-4 font-cinzel">Product / Query</th>
                  <th className="py-3.5 px-4 font-cinzel">Images</th>
                  <th className="py-3.5 px-4 font-cinzel">Status</th>
                  <th className="py-3.5 px-4 font-cinzel">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy-800 text-brand-gold-100">
                {enquiries.slice(0, 5).map((e) => (
                  <tr key={e.id} className="hover:bg-brand-navy-850/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{e.title_salutation} {e.name}</td>
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-medium text-brand-gold-400">{e.mobile}</div>
                      <div className="text-[11px] text-brand-gold-200/60">{e.email}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      {e.product_title && <span className="font-bold text-brand-gold-300 block mb-0.5">{e.product_title}</span>}
                      <span className="line-clamp-1 text-brand-gold-100/80">{e.message}</span>
                    </td>
                    <td className="py-3 px-4">
                      {e.images && e.images.length > 0 ? (
                        <span className="bg-brand-navy-800 text-brand-gold-400 px-2 py-0.5 rounded text-[10px] font-bold border border-brand-gold-500/20">
                          {e.images.length} File(s)
                        </span>
                      ) : (
                        <span className="text-brand-gold-200/40">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        e.status === 'new' ? 'bg-brand-gold-500/20 text-brand-gold-400 border border-brand-gold-500/30' :
                        e.status === 'in_progress' ? 'bg-blue-900/40 text-blue-300 border border-blue-700/30' : 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/30'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-brand-gold-200/60">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
