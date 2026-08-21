'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Enquiry } from '@/types';
import { Trash2, Phone, Mail, FileText, CheckCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'closed'>('all');

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function loadEnquiries() {
    try {
      const res = await fetchAPI<Enquiry[]>('/enquiries');
      setEnquiries(res);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await fetchAPI(`/enquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      loadEnquiries();
    } catch (err) {
      alert('Failed updating status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await fetchAPI(`/enquiries/${id}`, { method: 'DELETE' });
      loadEnquiries();
    } catch (err) {
      alert('Failed deleting record');
    }
  };

  const filteredEnquiries = enquiries.filter(e => filter === 'all' || e.status === filter);

  if (loading) return <div className="text-sandalwood-400">Loading enquiries inbox...</div>;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sandalwood-100">Enquiries & Quote Inbox</h1>
          <p className="text-xs text-sandalwood-400">Manage buyer requests, wholesale quotes, and reference image uploads.</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-sandalwood-900 border border-sandalwood-800 p-1 rounded-xl text-xs font-semibold">
          {(['all', 'new', 'in_progress', 'closed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === f ? 'bg-gold-500 text-sandalwood-950 font-bold' : 'text-sandalwood-400 hover:text-gold-400'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredEnquiries.length === 0 ? (
          <div className="bg-sandalwood-900 border border-sandalwood-800 rounded-3xl p-8 text-center text-sandalwood-400 text-xs">
            No enquiries found under this filter.
          </div>
        ) : (
          filteredEnquiries.map((e) => (
            <div key={e.id} className="bg-sandalwood-900 border border-sandalwood-800 rounded-3xl p-6 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-sandalwood-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-serif font-bold text-lg text-sandalwood-100">
                    {e.title_salutation} {e.name}
                  </span>
                  {e.product_title && (
                    <span className="bg-sandalwood-800 text-gold-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-sandalwood-700">
                      Product: {e.product_title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-sandalwood-500">{new Date(e.created_at).toLocaleString()}</span>
                  <select
                    value={e.status}
                    onChange={(evt) => handleStatusChange(e.id, evt.target.value)}
                    className="bg-sandalwood-950 border border-sandalwood-700 rounded-lg px-2.5 py-1 text-gold-400 font-bold text-xs"
                  >
                    <option value="new">Status: New</option>
                    <option value="in_progress">Status: In Progress</option>
                    <option value="closed">Status: Closed</option>
                  </select>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 bg-sandalwood-950 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message & Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="md:col-span-2 bg-sandalwood-950/60 p-4 rounded-2xl border border-sandalwood-850 space-y-2">
                  <span className="text-sandalwood-400 font-semibold block">Message / Requirements:</span>
                  <p className="text-sandalwood-200 leading-relaxed whitespace-pre-line">{e.message}</p>
                </div>

                <div className="bg-sandalwood-950/60 p-4 rounded-2xl border border-sandalwood-850 space-y-3">
                  <span className="text-sandalwood-400 font-semibold block">Buyer Contact Details:</span>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <a href={`tel:${e.mobile}`} className="font-bold text-gold-400 hover:underline">{e.mobile}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <a href={`mailto:${e.email}`} className="text-sandalwood-200 hover:underline">{e.email}</a>
                  </div>
                </div>
              </div>

              {/* Uploaded Attached Reference Photos */}
              {e.images && e.images.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs text-gold-400 font-semibold block mb-2">Attached Reference Photos:</span>
                  <div className="flex flex-wrap gap-3">
                    {e.images.map((imgUrl, i) => (
                      <a key={i} href={imgUrl} target="_blank" rel="noopener noreferrer" className="relative group">
                        <img src={imgUrl} alt="" className="w-20 h-20 rounded-xl object-cover border border-sandalwood-700 bg-sandalwood-950 group-hover:scale-105 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
