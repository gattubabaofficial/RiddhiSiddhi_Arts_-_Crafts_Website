'use client';

import React, { useEffect, useState } from 'react';
import { APIError, fetchAPI, getMediaUrl, uploadFiles } from '@/lib/api';
import { Category } from '@/types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await fetchAPI<Category[]>('/categories').catch(() => []);
      setCategories(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description || '');
    setImageUrl(c.image_url || '');
    setDisplayOrder(c.display_order ?? 0);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const urls = await uploadFiles([e.target.files[0]]);
      setImageUrl(urls[0]);
    } catch {
      alert('Failed uploading cover image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      image_url: imageUrl,
      display_order: Number(displayOrder),
    };

    try {
      if (editingId) {
        await fetchAPI(`/categories/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchAPI('/categories', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Error saving category');
    }
  };

  const handleDelete = async (id: number) => {
    const category = categories.find((c) => c.id === id);
    const productCount = category?.product_count ?? 0;

    if (!confirm(`Delete the category "${category?.name ?? id}"?`)) return;

    try {
      // The API refuses with 409 when the category still holds products, so a
      // mis-click cannot wipe out a whole section of the catalogue.
      await fetchAPI(`/categories/${id}`, { method: 'DELETE' });
      loadCategories();
    } catch (err) {
      if (err instanceof APIError && err.status === 409) {
        const confirmed = confirm(
          `"${category?.name ?? 'This category'}" still contains ${productCount} product(s).\n\n` +
            'Deleting it will PERMANENTLY DELETE those products as well.\n\n' +
            'Continue?'
        );
        if (!confirmed) return;

        try {
          await fetchAPI(`/categories/${id}?cascade=true`, { method: 'DELETE' });
          loadCategories();
        } catch (cascadeErr) {
          alert(cascadeErr instanceof Error ? cascadeErr.message : 'Failed deleting category');
        }
        return;
      }
      alert(err instanceof Error ? err.message : 'Failed deleting category');
    }
  };

  if (loading) return <div className="text-brand-gold-300 font-cinzel">Loading categories...</div>;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Categories Manager</h1>
          <p className="text-xs text-brand-gold-200/70 mt-1">Create, rename, reorder, or edit product categories.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-bold font-cinzel text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:brightness-110 flex items-center gap-2 shadow-lg shadow-brand-gold-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.id} className="bg-brand-navy-900 border border-brand-gold-500/20 rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-xl hover:border-brand-gold-400/40 transition-all">
            <div className="space-y-3">
              <div className="w-full h-40 bg-brand-navy-950 rounded-2xl overflow-hidden border border-brand-gold-500/20">
                <img
                  src={getMediaUrl(c.image_url) || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80'}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">{c.name}</h3>
              <p className="text-xs text-brand-gold-200/70 line-clamp-2">{c.description}</p>
            </div>

            <div className="pt-3 border-t border-brand-navy-800 flex items-center justify-between text-xs">
              <span className="text-brand-gold-400 font-semibold">{c.product_count || 0} Products</span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(c)}
                  className="p-2 bg-brand-navy-800 hover:bg-brand-gold-500 hover:text-brand-navy-950 rounded-lg text-brand-gold-200 border border-brand-gold-500/20 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 bg-brand-navy-800 hover:bg-rose-600 hover:text-white rounded-lg text-rose-400 border border-rose-500/20 transition-colors"
                  title="Delete Category"
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
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-brand-gold-400 hover:text-white p-1 rounded-full bg-brand-navy-950/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                />
              </div>

              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                />
              </div>

              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Cover Image</label>
                {imageUrl && (
                  <img src={imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover border border-brand-gold-500/30 mb-2" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-2.5 text-brand-gold-100"
                />
              </div>

              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Display Order Index</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-bold font-cinzel text-xs uppercase tracking-wider py-3.5 rounded-xl hover:brightness-110 shadow-lg shadow-brand-gold-500/20 text-sm mt-2 cursor-pointer"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
