'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Review } from '@/types';
import { Star, Check, X, Trash2, Home } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const res = await fetchAPI<Review[]>('/reviews/admin/all');
      setReviews(res);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (id: number, statusVal: string, featuredVal?: boolean) => {
    try {
      await fetchAPI(`/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: statusVal,
          featured_on_home: featuredVal !== undefined ? featuredVal : undefined,
        }),
      });
      loadReviews();
    } catch (err) {
      alert('Failed updating review');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await fetchAPI(`/reviews/${id}`, { method: 'DELETE' });
      loadReviews();
    } catch (err) {
      alert('Failed deleting review');
    }
  };

  if (loading) return <div className="text-sandalwood-400">Loading reviews...</div>;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="font-serif text-3xl font-bold text-sandalwood-100">Reviews & Moderation</h1>
        <p className="text-xs text-sandalwood-400">Approve, reject, feature on home page, or delete user reviews.</p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-sandalwood-900 border border-sandalwood-800 rounded-3xl p-8 text-center text-sandalwood-400 text-xs">
            No customer reviews submitted yet.
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-sandalwood-900 border border-sandalwood-800 rounded-3xl p-6 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-sandalwood-800 pb-3">
                <div>
                  <span className="font-serif font-bold text-base text-sandalwood-100">{r.user_name}</span>
                  {r.product_title && (
                    <span className="text-xs text-gold-400 ml-2">({r.product_title})</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gold-500">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-sandalwood-200 leading-relaxed italic">"{r.text}"</p>

              {r.images && r.images.length > 0 && (
                <div className="flex gap-2">
                  {r.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-14 h-14 rounded-xl object-cover border border-sandalwood-700 bg-sandalwood-950" />
                  ))}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-sandalwood-400">Status:</span>
                  <span className={`font-bold uppercase px-2.5 py-0.5 rounded-full text-[10px] ${
                    r.status === 'approved' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' :
                    r.status === 'rejected' ? 'bg-rose-900/40 text-rose-300' : 'bg-amber-900/40 text-amber-300'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdate(r.id, 'approved', r.featured_on_home)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdate(r.id, 'rejected', false)}
                      className="bg-sandalwood-800 hover:bg-rose-600 text-sandalwood-300 hover:text-white font-semibold px-3 py-1 rounded-lg"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleUpdate(r.id, r.status, !r.featured_on_home)}
                    className={`font-semibold px-3 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                      r.featured_on_home
                        ? 'bg-gold-500 text-sandalwood-950 font-bold'
                        : 'bg-sandalwood-800 text-sandalwood-300 hover:text-gold-400'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    {r.featured_on_home ? 'Featured on Home' : 'Feature on Home'}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 bg-sandalwood-800 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
