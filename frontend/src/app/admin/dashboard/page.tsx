'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Product, Category, Enquiry, Review, Reel } from '@/types';
import { Package, FolderTree, MessageSquare, Star, Video, ArrowUpRight, CheckCircle2 } from 'lucide-react';

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
          fetchAPI<Product[]>('/products').catch(() => []),
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
    return <div className="text-sandalwood-400">Loading admin stats...</div>;
  }

  return (
    <div className="space-y-10">
      
      <div>
        <h1 className="font-serif text-3xl font-bold text-sandalwood-100">Admin Dashboard</h1>
        <p className="text-xs text-sandalwood-400">Manage catalog products, customer quote enquiries, and site content.</p>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Link href="/admin/products" className="bg-sandalwood-900 border border-sandalwood-800 p-5 rounded-2xl space-y-3 hover:border-gold-500 transition-all">
          <div className="flex justify-between items-center text-gold-400">
            <Package className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-sandalwood-100 block">{products.length}</span>
            <span className="text-xs text-sandalwood-400 uppercase tracking-wider font-semibold">Total Products</span>
          </div>
        </Link>

        <Link href="/admin/categories" className="bg-sandalwood-900 border border-sandalwood-800 p-5 rounded-2xl space-y-3 hover:border-gold-500 transition-all">
          <div className="flex justify-between items-center text-gold-400">
            <FolderTree className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-sandalwood-100 block">{categories.length}</span>
            <span className="text-xs text-sandalwood-400 uppercase tracking-wider font-semibold">Categories</span>
          </div>
        </Link>

        <Link href="/admin/enquiries" className="bg-sandalwood-900 border border-sandalwood-800 p-5 rounded-2xl space-y-3 hover:border-gold-500 transition-all">
          <div className="flex justify-between items-center text-gold-400">
            <MessageSquare className="w-6 h-6" />
            <span className="bg-gold-500 text-sandalwood-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {pendingEnquiries.length} New
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-sandalwood-100 block">{enquiries.length}</span>
            <span className="text-xs text-sandalwood-400 uppercase tracking-wider font-semibold">Enquiries</span>
          </div>
        </Link>

        <Link href="/admin/reviews" className="bg-sandalwood-900 border border-sandalwood-800 p-5 rounded-2xl space-y-3 hover:border-gold-500 transition-all">
          <div className="flex justify-between items-center text-gold-400">
            <Star className="w-6 h-6" />
            <span className="bg-amber-500 text-sandalwood-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {pendingReviews.length} Pending
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-sandalwood-100 block">{reviews.length}</span>
            <span className="text-xs text-sandalwood-400 uppercase tracking-wider font-semibold">Reviews</span>
          </div>
        </Link>

        <Link href="/admin/reels" className="bg-sandalwood-900 border border-sandalwood-800 p-5 rounded-2xl space-y-3 hover:border-gold-500 transition-all">
          <div className="flex justify-between items-center text-gold-400">
            <Video className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl font-bold font-serif text-sandalwood-100 block">{reels.length}</span>
            <span className="text-xs text-sandalwood-400 uppercase tracking-wider font-semibold">Reels</span>
          </div>
        </Link>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-sandalwood-900 border border-sandalwood-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-sandalwood-100">
            Recent Customer Enquiries
          </h2>
          <Link href="/admin/enquiries" className="text-xs font-bold text-gold-400 hover:underline">
            View All Inbox
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <p className="text-xs text-sandalwood-500">No customer enquiries submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-sandalwood-800 text-sandalwood-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Product / Query</th>
                  <th className="py-3 px-4">Images</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandalwood-850 text-sandalwood-200">
                {enquiries.slice(0, 5).map((e) => (
                  <tr key={e.id} className="hover:bg-sandalwood-850/50">
                    <td className="py-3 px-4 font-bold text-sandalwood-100">{e.title_salutation} {e.name}</td>
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-medium text-gold-400">{e.mobile}</div>
                      <div className="text-[11px] text-sandalwood-400">{e.email}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      {e.product_title && <span className="font-bold text-gold-300 block mb-0.5">{e.product_title}</span>}
                      <span className="line-clamp-1">{e.message}</span>
                    </td>
                    <td className="py-3 px-4">
                      {e.images && e.images.length > 0 ? (
                        <span className="bg-sandalwood-800 text-gold-400 px-2 py-0.5 rounded text-[10px] font-bold">
                          {e.images.length} File(s)
                        </span>
                      ) : (
                        <span className="text-sandalwood-500">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        e.status === 'new' ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' :
                        e.status === 'in_progress' ? 'bg-blue-900/40 text-blue-300' : 'bg-emerald-900/40 text-emerald-300'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-sandalwood-400">
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
