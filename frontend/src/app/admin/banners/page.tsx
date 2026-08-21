'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI, uploadFiles } from '@/lib/api';
import { HeroBanner, Collaboration } from '@/types';
import { Plus, Trash2, Edit2, X, Image as ImageIcon, Upload } from 'lucide-react';

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
        fetchAPI<HeroBanner[]>('/admin/banners'),
        fetchAPI<Collaboration[]>('/collaborations'),
      ]);
      setBanners(bRes);
      setCollabs(cRes);
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
    } catch (err) {
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
    } catch (err) {
      alert('Error saving banner');
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!confirm('Delete banner?')) return;
    try {
      await fetchAPI(`/banners/${id}`, { method: 'DELETE' });
      loadBannersAndCollabs();
    } catch (err) {
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
    } catch (err) {
      alert('Error adding certificate');
    }
  };

  const handleDeleteCollab = async (id: number) => {
    if (!confirm('Delete certificate?')) return;
    try {
      await fetchAPI(`/collaborations/${id}`, { method: 'DELETE' });
      loadBannersAndCollabs();
    } catch (err) {
      alert('Failed deleting');
    }
  };

  if (loading) return <div className="text-sandalwood-400">Loading banners...</div>;

  return (
    <div className="space-y-12">
      
      {/* 1. Hero Banners Manager */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-sandalwood-100">Hero Banners Manager</h1>
            <p className="text-xs text-sandalwood-400">Add, edit, or remove top homepage carousel banners.</p>
          </div>
          <button
            onClick={() => openBannerModal()}
            className="bg-gold-500 text-sandalwood-950 font-bold px-5 py-2.5 rounded-xl hover:brightness-110 flex items-center gap-2 text-sm shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Hero Banner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div key={b.id} className="bg-sandalwood-900 border border-sandalwood-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-full h-44 bg-sandalwood-950 rounded-2xl overflow-hidden border border-sandalwood-800 relative">
                  <img src={b.image_url} alt="" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif font-bold text-lg text-sandalwood-100">{b.heading}</h3>
                <p className="text-xs text-sandalwood-300 line-clamp-2">{b.subheading}</p>
              </div>

              <div className="pt-3 border-t border-sandalwood-800 flex items-center justify-between text-xs">
                <span className="text-gold-400 font-semibold">CTA: {b.cta_label}</span>
                <div className="flex gap-2">
                  <button onClick={() => openBannerModal(b)} className="p-1.5 bg-sandalwood-800 text-sandalwood-300 hover:text-gold-400 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteBanner(b.id)} className="p-1.5 bg-sandalwood-800 text-rose-400 hover:text-rose-300 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Certificates & Collaborations Manager */}
      <div className="space-y-6 pt-6 border-t border-sandalwood-850">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-sandalwood-100">Certificates & Licenses Badges</h2>
            <p className="text-xs text-sandalwood-400">Manage Trustseal, GST, and IEC badges shown on home.</p>
          </div>
          <button
            onClick={() => setIsCollabModalOpen(true)}
            className="bg-sandalwood-800 hover:bg-gold-500 hover:text-sandalwood-950 text-gold-400 font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Certificate
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {collabs.map((c) => (
            <div key={c.id} className="bg-sandalwood-900 border border-sandalwood-800 p-4 rounded-2xl flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-sandalwood-100">{c.title}</span>
              <button onClick={() => handleDeleteCollab(c.id)} className="text-rose-400 hover:text-rose-300 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-sandalwood-900 border border-sandalwood-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl text-sandalwood-100 space-y-4 relative">
            <button onClick={() => setIsBannerModalOpen(false)} className="absolute top-4 right-4 text-sandalwood-400 hover:text-gold-400 p-1">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-2xl font-bold">{editingBannerId ? 'Edit Hero Banner' : 'Add Hero Banner'}</h2>
            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block text-sandalwood-300 mb-1">Heading *</label>
                <input
                  type="text"
                  required
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                />
              </div>
              <div>
                <label className="block text-sandalwood-300 mb-1">Subheading</label>
                <textarea
                  rows={2}
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sandalwood-300 mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                  />
                </div>
                <div>
                  <label className="block text-sandalwood-300 mb-1">CTA Button Link</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sandalwood-300 mb-1">Background Banner Image</label>
                {imageUrl && <img src={imageUrl} alt="" className="w-full h-32 rounded-xl object-cover border border-sandalwood-700 mb-2" />}
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2 text-sandalwood-200" />
              </div>
              <button type="submit" className="w-full bg-gold-500 text-sandalwood-950 font-bold py-3 rounded-xl hover:brightness-110 text-sm mt-2">
                Save Hero Banner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {isCollabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-sandalwood-900 border border-sandalwood-700 w-full max-w-md rounded-3xl p-6 text-sandalwood-100 space-y-4 relative">
            <button onClick={() => setIsCollabModalOpen(false)} className="absolute top-4 right-4 text-sandalwood-400 hover:text-gold-400 p-1">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-xl font-bold">Add Certificate Badge</h2>
            <form onSubmit={handleSaveCollab} className="space-y-4 text-xs">
              <div>
                <label className="block text-sandalwood-300 mb-1">Certificate Title (e.g. IEC Certified Exporter)</label>
                <input
                  type="text"
                  required
                  value={collabTitle}
                  onChange={(e) => setCollabTitle(e.target.value)}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                />
              </div>
              <button type="submit" className="w-full bg-gold-500 text-sandalwood-950 font-bold py-3 rounded-xl text-sm">
                Add Badge
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
