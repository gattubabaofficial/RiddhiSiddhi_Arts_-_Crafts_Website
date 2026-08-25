'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI, getMediaUrl } from '@/lib/api';
import { Review } from '@/types';
import { Star, Check, Trash2, Home } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const res = await fetchAPI<Review[]>('/reviews/admin/all').catch(() => []);
      setReviews(Array.isArray(res) ? res : []);
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
    } catch {
      alert('Failed updating review');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await fetchAPI(`/reviews/${id}`, { method: 'DELETE' });
      loadReviews();
    } catch {
      alert('Failed deleting review');
    }
  };

  if (loading) return <div className="text-brand-gold-300 font-cinzel">Loading reviews moderation...</div>;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Reviews Moderation</h1>
        <p className="text-xs text-brand-gold-200/70 mt-1">Approve, reject, feature on home page, or delete user reviews.</p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-brand-navy-900 border border-brand-gold-500/20 rounded-3xl p-8 text-center text-brand-gold-300/60 text-xs shadow-xl">
            No customer reviews submitted yet.
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-brand-navy-900 border border-brand-gold-500/20 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-brand-navy-800 pb-3">
                <div>
                  <span className="font-serif font-bold text-base text-white">{r.user_name}</span>
                  {r.product_title && (
                    <span className="text-xs text-brand-gold-400 ml-2 font-medium">({r.product_title})</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-brand-gold-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-gold-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-brand-gold-100/90 leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>

              {r.images && r.images.length > 0 && (
                <div className="flex gap-2">
                  {r.images.map((img, i) => (
                    <img key={i} src={getMediaUrl(img)} alt="" className="w-14 h-14 rounded-xl object-cover border border-brand-gold-500/30 bg-brand-navy-950" />
                  ))}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold-300/70">Status:</span>
                  <span className={`font-bold uppercase px-2.5 py-0.5 rounded-full text-[10px] ${
                    r.status === 'approved' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40' :
                    r.status === 'rejected' ? 'bg-rose-900/40 text-rose-300 border border-rose-700/40' : 'bg-amber-900/40 text-amber-300 border border-amber-700/40'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdate(r.id, 'approved', r.featured_on_home)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdate(r.id, 'rejected', false)}
                      className="bg-brand-navy-800 hover:bg-rose-600 text-brand-gold-200 hover:text-white font-semibold px-3 py-1.5 rounded-lg border border-brand-gold-500/20 transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleUpdate(r.id, r.status, !r.featured_on_home)}
                    className={`font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                      r.featured_on_home
                        ? 'bg-brand-gold-500 text-brand-navy-950 font-bold shadow'
                        : 'bg-brand-navy-800 text-brand-gold-300 hover:text-white border border-brand-gold-500/20'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    {r.featured_on_home ? 'Featured on Home' : 'Feature on Home'}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 bg-brand-navy-800 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg border border-rose-500/20 transition-colors"
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
