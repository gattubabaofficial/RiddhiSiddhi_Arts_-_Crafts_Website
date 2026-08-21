'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Reel } from '@/types';
import { Plus, Edit2, Trash2, X, Video, Star } from 'lucide-react';

export default function AdminReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isTrending, setIsTrending] = useState(true);

  useEffect(() => {
    loadReels();
  }, []);

  async function loadReels() {
    try {
      const res = await fetchAPI<Reel[]>('/reels');
      setReels(res);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
    setIsTrending(true);
    setIsModalOpen(true);
  };

  const openEditModal = (r: Reel) => {
    setEditingId(r.id);
    setTitle(r.title);
    setVideoUrl(r.video_url);
    setIsTrending(r.is_trending);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      video_url: videoUrl,
      is_trending: isTrending,
    };

    try {
      if (editingId) {
        await fetchAPI(`/reels/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchAPI('/reels', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setIsModalOpen(false);
      loadReels();
    } catch (err) {
      alert('Error saving reel');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this reel?')) return;
    try {
      await fetchAPI(`/reels/${id}`, { method: 'DELETE' });
      loadReels();
    } catch (err) {
      alert('Failed deleting reel');
    }
  };

  if (loading) return <div className="text-sandalwood-400">Loading reels...</div>;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sandalwood-100">Reels & Video Manager</h1>
          <p className="text-xs text-sandalwood-400">Curate workshop videos and trending short reels for the homepage.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gold-500 text-sandalwood-950 font-bold px-5 py-2.5 rounded-xl hover:brightness-110 flex items-center gap-2 text-sm shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Reel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reels.map((r) => (
          <div key={r.id} className="bg-sandalwood-900 border border-sandalwood-800 rounded-3xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-full h-48 bg-sandalwood-950 rounded-2xl overflow-hidden relative">
                <iframe src={r.video_url} title={r.title} className="w-full h-full" allowFullScreen />
              </div>
              <h3 className="font-serif font-bold text-sm text-sandalwood-100 line-clamp-2">{r.title}</h3>
            </div>

            <div className="pt-3 border-t border-sandalwood-800 flex items-center justify-between text-xs">
              {r.is_trending ? (
                <span className="bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-gold-500/30">
                  Trending Reel
                </span>
              ) : (
                <span className="text-sandalwood-500">Standard</span>
              )}
              <div className="flex gap-2">
                <button onClick={() => openEditModal(r)} className="p-1.5 bg-sandalwood-800 text-sandalwood-300 hover:text-gold-400 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 bg-sandalwood-800 text-rose-400 hover:text-rose-300 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-sandalwood-900 border border-sandalwood-700 w-full max-w-md rounded-3xl p-6 shadow-2xl text-sandalwood-100 space-y-4 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-sandalwood-400 hover:text-gold-400 p-1">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-2xl font-bold">{editingId ? 'Edit Reel' : 'Add New Reel'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-sandalwood-300 mb-1">Reel Title / Caption *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                />
              </div>
              <div>
                <label className="block text-sandalwood-300 mb-1">Video Embed URL (YouTube/MP4) *</label>
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="trending-check"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded border-sandalwood-700 text-gold-500"
                />
                <label htmlFor="trending-check" className="text-sandalwood-200 font-semibold cursor-pointer">
                  Mark as Trending Reel Section
                </label>
              </div>
              <button type="submit" className="w-full bg-gold-500 text-sandalwood-950 font-bold py-3 rounded-xl hover:brightness-110 text-sm mt-2">
                Save Reel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
