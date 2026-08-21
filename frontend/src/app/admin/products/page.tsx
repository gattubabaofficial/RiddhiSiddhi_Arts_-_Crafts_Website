'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI, uploadFiles } from '@/lib/api';
import { Product, Category, SpecItem } from '@/types';
import { Plus, Edit2, Trash2, X, Upload, Check, Star } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [price, setPrice] = useState('₹199/Piece');
  const [moq, setMoq] = useState('1 Piece');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Specs state
  const [specs, setSpecs] = useState<SpecItem[]>([
    { label: 'Wood Origin', value: 'Indian Sandalwood' },
    { label: 'Bead Size', value: '10mm' }
  ]);

  useEffect(() => {
    loadProductsAndCategories();
  }, []);

  async function loadProductsAndCategories() {
    try {
      const [pRes, cRes] = await Promise.all([
        fetchAPI<Product[]>('/products'),
        fetchAPI<Category[]>('/categories')
      ]);
      setProducts(pRes);
      setCategories(cRes);
      if (cRes.length > 0 && categoryId === 0) {
        setCategoryId(cRes[0].id);
      }
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    if (categories.length > 0) setCategoryId(categories[0].id);
    setPrice('₹199/Piece');
    setMoq('1 Piece');
    setShortDesc('');
    setLongDesc('');
    setIsFeatured(false);
    setImages([]);
    setSpecs([{ label: 'Wood Origin', value: 'Indian Sandalwood' }]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategoryId(p.category_id);
    setPrice(p.price || '');
    setMoq(p.moq);
    setShortDesc(p.short_description || '');
    setLongDesc(p.long_description || '');
    setIsFeatured(p.is_featured);
    setImages(p.images || []);
    setSpecs(p.specs || []);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    try {
      const urls = await uploadFiles(Array.from(e.target.files));
      setImages(prev => [...prev, ...urls]);
    } catch (err) {
      alert('Failed uploading images');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSpecRow = () => {
    setSpecs(prev => [...prev, { label: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    setSpecs(prev => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      category_id: categoryId,
      price,
      moq,
      short_description: shortDesc,
      long_description: longDesc,
      is_featured: isFeatured,
      images,
      specs: specs.filter(s => s.label.trim() !== ''),
    };

    try {
      if (editingId) {
        await fetchAPI(`/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchAPI('/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      loadProductsAndCategories();
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetchAPI(`/products/${id}`, { method: 'DELETE' });
      loadProductsAndCategories();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) return <div className="text-sandalwood-400">Loading products...</div>;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sandalwood-100">Products Manager</h1>
          <p className="text-xs text-sandalwood-400">Add, edit, or remove catalog items, specs, and price quotes.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gold-500 text-sandalwood-950 font-bold px-5 py-2.5 rounded-xl hover:brightness-110 flex items-center gap-2 text-sm shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Products Data Table */}
      <div className="bg-sandalwood-900 border border-sandalwood-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-sandalwood-800 text-sandalwood-400 uppercase tracking-wider bg-sandalwood-950/40">
              <th className="py-3.5 px-4">Image</th>
              <th className="py-3.5 px-4">Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price / MOQ</th>
              <th className="py-3.5 px-4">Featured</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandalwood-850 text-sandalwood-200">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-sandalwood-850/50">
                <td className="py-3 px-4">
                  <img
                    src={p.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=200&q=80'}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-sandalwood-700 bg-sandalwood-950"
                  />
                </td>
                <td className="py-3 px-4 font-bold text-sandalwood-100 max-w-xs">{p.title}</td>
                <td className="py-3 px-4 text-gold-400 font-semibold">{p.category_name}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-sandalwood-100">{p.price}</div>
                  <div className="text-[10px] text-sandalwood-400">MOQ: {p.moq}</div>
                </td>
                <td className="py-3 px-4">
                  {p.is_featured ? (
                    <span className="bg-gold-500/20 text-gold-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold-500/30 flex items-center gap-1 w-fit">
                      <Star className="w-3 h-3 fill-gold-400" /> Featured
                    </span>
                  ) : (
                    <span className="text-sandalwood-500">Standard</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 bg-sandalwood-800 hover:bg-gold-500 hover:text-sandalwood-950 rounded-lg text-sandalwood-300 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 bg-sandalwood-800 hover:bg-rose-600 hover:text-white rounded-lg text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-sandalwood-900 border border-sandalwood-700 w-full max-w-2xl rounded-3xl p-6 shadow-2xl text-sandalwood-100 max-h-[90vh] overflow-y-auto space-y-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-sandalwood-400 hover:text-gold-400 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sandalwood-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                  />
                </div>
                <div>
                  <label className="block text-sandalwood-300 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sandalwood-300 mb-1">Price / Wholesale Rate</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                  />
                </div>
                <div>
                  <label className="block text-sandalwood-300 mb-1">Minimum Order Quantity (MOQ)</label>
                  <input
                    type="text"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sandalwood-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                />
              </div>

              <div>
                <label className="block text-sandalwood-300 mb-1">Full Craft Description</label>
                <textarea
                  rows={4}
                  value={longDesc}
                  onChange={(e) => setLongDesc(e.target.value)}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-xl p-2.5 text-sandalwood-100"
                />
              </div>

              {/* Dynamic Specifications Matrix */}
              <div className="space-y-2 border border-sandalwood-800 p-4 rounded-2xl bg-sandalwood-950/40">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gold-400">Specifications Key-Values</span>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-xs bg-sandalwood-800 hover:bg-gold-500 hover:text-sandalwood-950 px-3 py-1 rounded-lg text-sandalwood-200 font-bold"
                  >
                    + Add Spec Row
                  </button>
                </div>
                {specs.map((s, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Label (e.g. Bead Size)"
                      value={s.label}
                      onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                      className="w-1/2 bg-sandalwood-950 border border-sandalwood-700 rounded-lg p-2 text-sandalwood-100"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 10mm)"
                      value={s.value}
                      onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                      className="w-1/2 bg-sandalwood-950 border border-sandalwood-700 rounded-lg p-2 text-sandalwood-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecRow(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Images Upload Manager */}
              <div className="space-y-2">
                <label className="block text-sandalwood-300 font-medium">Product Images</label>
                <div className="flex flex-wrap gap-3 items-center">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-sandalwood-700">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 rounded-xl border-2 border-dashed border-sandalwood-700 bg-sandalwood-950 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500">
                    <Upload className="w-5 h-5 text-gold-400" />
                    <span className="text-[9px] text-sandalwood-400 mt-1">Upload</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {uploading && <span className="text-xs text-gold-400">Uploading files...</span>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-sandalwood-700 text-gold-500 focus:ring-gold-500"
                />
                <label htmlFor="featured-check" className="text-sandalwood-200 font-semibold cursor-pointer">
                  Feature on Home Page Carousel Strip
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gold-500 text-sandalwood-950 font-bold py-3 rounded-xl hover:brightness-110 shadow-lg text-sm mt-4"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
