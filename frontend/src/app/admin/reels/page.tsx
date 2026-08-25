'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI, uploadFilesWithProgress, getMediaUrl, getEmbedUrl } from '@/lib/api';
import { Reel } from '@/types';
import { Plus, Edit2, Trash2, X, Upload, Video } from 'lucide-react';

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
      const res = await fetchAPI<Reel[]>('/reels').catch(() => []);
      setReels(Array.isArray(res) ? res : []);
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
    setIsTrending(r.is_trending ?? true);
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
    } catch {
      alert('Error saving reel');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this reel?')) return;
    try {
      await fetchAPI(`/reels/${id}`, { method: 'DELETE' });
      loadReels();
    } catch {
      alert('Failed deleting reel');
    }
  };

  if (loading) return <div className="text-brand-gold-300 font-cinzel">Loading reels...</div>;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Reels & Video Manager</h1>
          <p className="text-xs text-brand-gold-200/70 mt-1">Curate workshop videos and trending short reels for the homepage.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-bold font-cinzel text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:brightness-110 flex items-center gap-2 shadow-lg shadow-brand-gold-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Reel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reels.map((r) => (
          <div key={r.id} className="bg-brand-navy-900 border border-brand-gold-500/20 rounded-3xl p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-full h-48 bg-brand-navy-950 rounded-2xl overflow-hidden relative border border-brand-gold-500/20">
                {r.video_url.includes('youtube.com') || r.video_url.includes('youtu.be') ? (
                  <iframe src={getEmbedUrl(r.video_url)} title={r.title} className="w-full h-full" allowFullScreen />
                ) : (
                  <video src={getMediaUrl(r.video_url)} controls className="w-full h-full object-cover" />
                )}
              </div>
              <h3 className="font-serif font-bold text-sm text-white line-clamp-2">{r.title}</h3>
            </div>

            <div className="pt-3 border-t border-brand-navy-800 flex items-center justify-between text-xs">
              {r.is_trending ? (
                <span className="bg-brand-gold-500/20 text-brand-gold-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-brand-gold-500/30">
                  Trending Reel
                </span>
              ) : (
                <span className="text-brand-gold-300/40">Standard</span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(r)}
                  className="p-2 bg-brand-navy-800 text-brand-gold-200 hover:bg-brand-gold-500 hover:text-brand-navy-950 rounded-lg border border-brand-gold-500/20 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 bg-brand-navy-800 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg border border-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-brand-navy-900 border border-brand-gold-500/30 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-4 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-brand-gold-400 hover:text-white p-1 rounded-full bg-brand-navy-950/60">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-2xl font-bold text-white tracking-wide">{editingId ? 'Edit Reel' : 'Add New Reel'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Reel Title / Caption *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                />
              </div>
              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Video Embed URL (YouTube/MP4) *</label>
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="trending-check"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded border-brand-gold-500/40 text-brand-gold-500 focus:ring-brand-gold-500 bg-brand-navy-950"
                />
                <label htmlFor="trending-check" className="text-brand-gold-100 font-medium cursor-pointer">
                  Mark as Trending Reel Section
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-bold font-cinzel text-xs uppercase tracking-wider py-3.5 rounded-xl hover:brightness-110 shadow-lg shadow-brand-gold-500/20 text-sm mt-2 cursor-pointer"
              >
                Save Reel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
