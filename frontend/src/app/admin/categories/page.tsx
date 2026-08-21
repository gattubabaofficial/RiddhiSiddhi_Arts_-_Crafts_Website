'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI, uploadFiles } from '@/lib/api';
import { Category } from '@/types';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';

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
      const res = await fetchAPI<Category[]>('/categories');
      setCategories(res);
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
    setDisplayOrder(c.display_order);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const urls = await uploadFiles([e.target.files[0]]);
      setImageUrl(urls[0]);
    } catch (err) {
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
    if (!confirm('Are you sure you want to delete this category? All associated products will be deleted.')) return;
    try {
      await fetchAPI(`/categories/${id}`, { method: 'DELETE' });
      loadCategories();
    } catch (err) {
      alert('Failed deleting category');
    }
  };

  if (loading) return <div className="text-sandalwood-400">Loading categories...</div>;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sandalwood-100">Categories Manager</h1>
          <p className="text-xs text-sandalwood-400">Create, rename, reorder, or edit product categories.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gold-500 text-sandalwood-950 font-bold px-5 py-2.5 rounded-xl hover:brightness-110 flex items-center gap-2 text-sm shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.id} className="bg-sandalwood-900 border border-sandalwood-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-full h-40 bg-sandalwood-950 rounded-2xl overflow-hidden border border-sandalwood-800">
                <img
                  src={c.image_url || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80'}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif font-bold text-lg text-sandalwood-100">{c.name}</h3>
              <p className="text-xs text-sandalwood-400 line-clamp-2">{c.description}</p>
            </div>

            <div className="pt-3 border-t border-sandalwood-800 flex items-center justify-between text-xs">
              <span className="text-gold-400 font-semibold">{c.product_count} Products</span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(c)}
                  className="p-1.5 bg-sandalwood-800 hover:bg-gold-500 hover:text-sandalwood-950 rounded-lg text-sandalwood-300"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 bg-sandalwood-800 hover:bg-rose-600 hover:text-white rounded-lg text-rose-400"
                >
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
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-sandalwood-400 hover:text-gold-400 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-sandalwood-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                />
              </div>

              <div>
                <label className="block text-sandalwood-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                />
              </div>

              <div>
                <label className="block text-sandalwood-300 mb-1">Cover Image</label>
                {imageUrl && (
                  <img src={imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover border border-sandalwood-700 mb-2" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2 text-sandalwood-200"
                />
              </div>

              <div>
                <label className="block text-sandalwood-300 mb-1">Display Order Index</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold-500 text-sandalwood-950 font-bold py-3 rounded-xl hover:brightness-110 text-sm mt-2"
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
