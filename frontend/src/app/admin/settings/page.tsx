'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI, uploadFiles } from '@/lib/api';
import { SiteSettings } from '@/types';
import { Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [proprietor, setProprietor] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('26.87013');
  const [longitude, setLongitude] = useState('75.77491');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetchAPI<SiteSettings>('/settings');
        setSettings(res);
        setCompanyName(res.company_name);
        setProprietor(res.proprietor);
        setPhone(res.phone);
        setEmail(res.email);
        setGstNumber(res.gst_number);
        setAddress(res.address);
        setLatitude(res.latitude);
        setLongitude(res.longitude);
        setMetaTitle(res.seo_meta?.meta_title || '');
        setMetaDescription(res.seo_meta?.meta_description || '');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI('/settings', {
        method: 'PUT',
        body: JSON.stringify({
          company_name: companyName,
          proprietor,
          phone,
          email,
          gst_number: gstNumber,
          address,
          latitude,
          longitude,
          map_embed_url: `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`,
          seo_meta: {
            meta_title: metaTitle,
            meta_description: metaDescription,
          },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed saving site settings');
    }
  };

  if (loading) return <div className="text-sandalwood-400">Loading site settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      
      <div>
        <h1 className="font-serif text-3xl font-bold text-sandalwood-100">Site Settings</h1>
        <p className="text-xs text-sandalwood-400">Configure global company information, Jaipur address, GST, and SEO tags.</p>
      </div>

      {saved && (
        <div className="bg-emerald-900/60 border border-emerald-700 text-emerald-200 p-4 rounded-2xl flex items-center gap-2 text-xs">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          Settings updated successfully! Changes reflect on public website immediately.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-sandalwood-900 border border-sandalwood-800 rounded-3xl p-8 space-y-6 text-xs text-sandalwood-100">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sandalwood-300 font-semibold mb-1">Company Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-3 text-sandalwood-100"
            />
          </div>
          <div>
            <label className="block text-sandalwood-300 font-semibold mb-1">Proprietor Name</label>
            <input
              type="text"
              required
              value={proprietor}
              onChange={(e) => setProprietor(e.target.value)}
              className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-3 text-sandalwood-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sandalwood-300 font-semibold mb-1">Official Phone</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-3 text-sandalwood-100"
            />
          </div>
          <div>
            <label className="block text-sandalwood-300 font-semibold mb-1">Official Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-3 text-sandalwood-100"
            />
          </div>
          <div>
            <label className="block text-sandalwood-300 font-semibold mb-1">GST Registration No.</label>
            <input
              type="text"
              required
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-3 text-sandalwood-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sandalwood-300 font-semibold mb-1">Full Factory / Office Address</label>
          <textarea
            rows={3}
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-3 text-sandalwood-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sandalwood-300 font-semibold mb-1">Google Map Latitude</label>
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-3 text-sandalwood-100"
            />
          </div>
          <div>
            <label className="block text-sandalwood-300 font-semibold mb-1">Google Map Longitude</label>
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-3 text-sandalwood-100"
            />
          </div>
        </div>

        <div className="border-t border-sandalwood-800 pt-4 space-y-4">
          <h3 className="font-serif font-bold text-base text-gold-400">SEO Default Meta Tags</h3>
          <div>
            <label className="block text-sandalwood-300 font-semibold mb-1">Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-3 text-sandalwood-100"
            />
          </div>
          <div>
            <label className="block text-sandalwood-300 font-semibold mb-1">Meta Description</label>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-3 text-sandalwood-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-gold-500 text-sandalwood-950 font-bold px-8 py-3 rounded-xl hover:brightness-110 flex items-center gap-2 text-sm shadow-lg transition-all"
        >
          <Save className="w-4 h-4" /> Save All Settings
        </button>
      </form>
    </div>
  );
}
