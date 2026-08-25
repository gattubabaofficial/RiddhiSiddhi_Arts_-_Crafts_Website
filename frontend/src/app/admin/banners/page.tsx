'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI, uploadFiles, getMediaUrl } from '@/lib/api';
import { HeroBanner, Collaboration } from '@/types';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);

  // Banner Modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [ctaLabel, setCtaLabel] = useState('Explore Catalog');
  const [ctaLink, setCtaLink] = useState('/products');
  const [imageUrl, setImageUrl] = useState('');

  // Collab Modal
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [collabTitle, setCollabTitle] = useState('');
  const [collabLogoUrl, setCollabLogoUrl] = useState('');

  useEffect(() => {
    loadBannersAndCollabs();
  }, []);

  async function loadBannersAndCollabs() {
    try {
      const [bRes, cRes] = await Promise.all([
        fetchAPI<HeroBanner[]>('/admin/banners').catch(() => []),
        fetchAPI<Collaboration[]>('/collaborations').catch(() => []),
      ]);
      setBanners(Array.isArray(bRes) ? bRes : []);
      setCollabs(Array.isArray(cRes) ? cRes : []);
    } finally {
      setLoading(false);
    }
  }

  const openBannerModal = (b?: HeroBanner) => {
    if (b) {
      setEditingBannerId(b.id);
      setHeading(b.heading);
      setSubheading(b.subheading || '');
      setCtaLabel(b.cta_label || 'Explore Catalog');
      setCtaLink(b.cta_link || '/products');
      setImageUrl(b.image_url);
    } else {
      setEditingBannerId(null);
      setHeading('');
      setSubheading('');
      setCtaLabel('Explore Catalog');
      setCtaLink('/products');
      setImageUrl('');
    }
    setIsBannerModalOpen(true);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const urls = await uploadFiles([e.target.files[0]]);
      setImageUrl(urls[0]);
    } catch {
      alert('Upload failed');
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      heading,
      subheading,
      cta_label: ctaLabel,
      cta_link: ctaLink,
      image_url: imageUrl,
      is_active: true,
    };

    try {
      if (editingBannerId) {
        await fetchAPI(`/banners/${editingBannerId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchAPI('/banners', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setIsBannerModalOpen(false);
      loadBannersAndCollabs();
    } catch {
      alert('Error saving banner');
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!confirm('Delete banner?')) return;
    try {
      await fetchAPI(`/banners/${id}`, { method: 'DELETE' });
      loadBannersAndCollabs();
    } catch {
      alert('Failed deleting banner');
    }
  };

  const handleSaveCollab = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI('/collaborations', {
        method: 'POST',
        body: JSON.stringify({ title: collabTitle, logo_url: collabLogoUrl || 'https://images.unsplash.com/photo-1615529182904-14819c35db37' }),
      });
      setIsCollabModalOpen(false);
      setCollabTitle('');
      setCollabLogoUrl('');
      loadBannersAndCollabs();
    } catch {
      alert('Error adding certificate');
    }
  };

  const handleDeleteCollab = async (id: number) => {
    if (!confirm('Delete certificate?')) return;
    try {
      await fetchAPI(`/collaborations/${id}`, { method: 'DELETE' });
      loadBannersAndCollabs();
    } catch {
      alert('Failed deleting');
    }
  };

  if (loading) return <div className="text-brand-gold-300 font-cinzel">Loading banners...</div>;

  return (
    <div className="space-y-12">
      
      {/* 1. Hero Banners Manager */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Hero Banners Manager</h1>
            <p className="text-xs text-brand-gold-200/70 mt-1">Add, edit, or remove top homepage carousel banners.</p>
          </div>
          <button
            onClick={() => openBannerModal()}
            className="bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-bold font-cinzel text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:brightness-110 flex items-center gap-2 shadow-lg shadow-brand-gold-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Hero Banner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div key={b.id} className="bg-brand-navy-900 border border-brand-gold-500/20 rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="w-full h-44 bg-brand-navy-950 rounded-2xl overflow-hidden border border-brand-gold-500/20 relative">
                  <img src={getMediaUrl(b.image_url)} alt="" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif font-bold text-lg text-white">{b.heading}</h3>
                <p className="text-xs text-brand-gold-200/70 line-clamp-2">{b.subheading}</p>
              </div>

              <div className="pt-3 border-t border-brand-navy-800 flex items-center justify-between text-xs">
                <span className="text-brand-gold-400 font-semibold">CTA: {b.cta_label}</span>
                <div className="flex gap-2">
                  <button onClick={() => openBannerModal(b)} className="p-2 bg-brand-navy-800 text-brand-gold-200 hover:bg-brand-gold-500 hover:text-brand-navy-950 rounded-lg border border-brand-gold-500/20 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteBanner(b.id)} className="p-2 bg-brand-navy-800 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg border border-rose-500/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Certificates & Collaborations Manager */}
      <div className="space-y-6 pt-6 border-t border-brand-navy-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white tracking-wide">Certificates & Licenses Badges</h2>
            <p className="text-xs text-brand-gold-200/70 mt-1">Manage Trustseal, GST, and IEC badges shown on home.</p>
          </div>
          <button
            onClick={() => setIsCollabModalOpen(true)}
            className="bg-brand-navy-800 hover:bg-brand-gold-500 hover:text-brand-navy-950 text-brand-gold-300 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs border border-brand-gold-500/30 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Certificate
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {collabs.map((c) => (
            <div key={c.id} className="bg-brand-navy-900 border border-brand-gold-500/20 p-4 rounded-2xl flex items-center justify-between shadow-lg">
              <span className="font-serif font-bold text-sm text-white">{c.title}</span>
              <button onClick={() => handleDeleteCollab(c.id)} className="text-rose-400 hover:text-white p-1.5 rounded-lg bg-brand-navy-800 hover:bg-rose-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-brand-navy-900 border border-brand-gold-500/30 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-4 relative">
            <button onClick={() => setIsBannerModalOpen(false)} className="absolute top-5 right-5 text-brand-gold-400 hover:text-white p-1 rounded-full bg-brand-navy-950/60">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-2xl font-bold text-white tracking-wide">{editingBannerId ? 'Edit Hero Banner' : 'Add Hero Banner'}</h2>
            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Heading *</label>
                <input
                  type="text"
                  required
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                />
              </div>
              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Subheading</label>
                <textarea
                  rows={2}
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-gold-300 font-semibold mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-brand-gold-300 font-semibold mb-1">CTA Button Link</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Background Banner Image</label>
                {imageUrl && <img src={imageUrl} alt="" className="w-full h-32 rounded-xl object-cover border border-brand-gold-500/30 mb-2" />}
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-2.5 text-brand-gold-100" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-bold font-cinzel text-xs uppercase tracking-wider py-3.5 rounded-xl hover:brightness-110 shadow-lg shadow-brand-gold-500/20 text-sm mt-2 cursor-pointer">
                Save Hero Banner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {isCollabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-brand-navy-900 border border-brand-gold-500/30 w-full max-w-md rounded-3xl p-6 sm:p-8 text-white space-y-4 relative">
            <button onClick={() => setIsCollabModalOpen(false)} className="absolute top-5 right-5 text-brand-gold-400 hover:text-white p-1 rounded-full bg-brand-navy-950/60">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-xl font-bold text-white tracking-wide">Add Certificate Badge</h2>
            <form onSubmit={handleSaveCollab} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Certificate Title (e.g. IEC Certified Exporter)</label>
                <input
                  type="text"
                  required
                  value={collabTitle}
                  onChange={(e) => setCollabTitle(e.target.value)}
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-bold font-cinzel text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-brand-gold-500/20 text-sm cursor-pointer">
                Add Badge
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
