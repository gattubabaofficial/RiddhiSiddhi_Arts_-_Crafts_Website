'use client';

import React, { useEffect, useState } from 'react';
import { fetchAPI, uploadFiles, uploadFilesWithProgress, getMediaUrl, getEmbedUrl } from '@/lib/api';
import { Product, Category, SpecItem } from '@/types';
import { Plus, Edit2, Trash2, X, Upload, Star, Sparkles, Video, Film, Image as ImageIcon } from 'lucide-react';

const SANDALWOOD_DEFAULT_SPECS: SpecItem[] = [
  { label: 'Product Code', value: 'SW-B-41' },
  { label: 'Brand', value: 'Riddhi Siddhi' },
  { label: 'Wood Origin', value: 'Indian Sandalwood (Mysore / Malayagiri)' },
  { label: 'Material', value: '100% Genuine Sandalwood' },
  { label: 'Bead Size', value: '4-22mm (6mm, 8mm, 10mm, 12mm, 15mm, 18mm, 20mm, 22mm)' },
  { label: 'Size', value: 'Max. 22 mm' },
  { label: 'Number Of Beads', value: '108 beads' },
  { label: 'Total Beads', value: '27 Beads / 108 Beads' },
  { label: 'Bead Shape', value: 'Round' },
  { label: 'Shape', value: 'Round' },
  { label: 'Color', value: 'Natural Dark Golden Brown' },
  { label: 'Fragrance Level', value: 'High Aroma (Long-lasting Natural Essence)' },
  { label: 'Finish', value: 'Polished' },
  { label: 'String Material', value: 'Cotton Thread' },
  { label: 'Usage / Application', value: 'Religious, Aroma Jewellery, Mala, Bracelet, Chanting' },
  { label: 'Age', value: '50++' },
  { label: 'Packaging Type', value: 'Carefully pack the beads in plastic bags and finally packed in corrugated box.' },
  { label: 'Country of Origin', value: 'Made in India' },
  { label: 'Minimum Order Quantity (MOQ)', value: '800 Piece' },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [price, setPrice] = useState('₹190/Piece');
  const [moq, setMoq] = useState('800 Piece');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Specs state
  const [specs, setSpecs] = useState<SpecItem[]>([]);

  useEffect(() => {
    loadProductsAndCategories();
  }, []);

  async function loadProductsAndCategories() {
    try {
      const [pRes, cRes] = await Promise.all([
        fetchAPI<Product[]>('/products?limit=100').catch(() => []),
        fetchAPI<Category[]>('/categories').catch(() => [])
      ]);
      setProducts(Array.isArray(pRes) ? pRes : []);
      setCategories(Array.isArray(cRes) ? cRes : []);
      if (Array.isArray(cRes) && cRes.length > 0 && categoryId === 0) {
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
    setPrice('₹190/Piece');
    setMoq('800 Piece');
    setShortDesc('');
    setLongDesc('');
    setIsFeatured(false);
    setImages([]);
    setVideos([]);
    setVideoUrlInput('');
    setVideoProgress(0);
    setSpecs(SANDALWOOD_DEFAULT_SPECS.map(s => ({ ...s })));
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategoryId(p.category_id);
    setPrice(p.price || '');
    setMoq(p.moq || '1 Piece');
    setShortDesc(p.short_description || '');
    setLongDesc(p.long_description || '');
    setIsFeatured(p.is_featured);
    setImages(p.images || []);
    setVideos(p.videos || []);
    setVideoUrlInput('');
    setVideoProgress(0);
    setSpecs(p.specs && p.specs.length > 0 ? p.specs : [{ label: 'Wood Origin', value: 'Indian Sandalwood' }]);
    setIsModalOpen(true);
  };

  const handleApplySandalwoodTemplate = () => {
    setSpecs(SANDALWOOD_DEFAULT_SPECS.map(s => ({ ...s })));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const inputEl = e.target;
    setUploading(true);
    try {
      const urls = await uploadFiles(Array.from(inputEl.files || []));
      setImages(prev => [...prev, ...urls]);
    } catch (err: any) {
      console.error('Image upload error:', err);
      const msg = typeof err === 'object' && err?.message ? err.message : String(err || 'Failed uploading images');
      alert(msg);
    } finally {
      setUploading(false);
      inputEl.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const inputEl = e.target;
    setUploadingVideo(true);
    setVideoProgress(0);
    try {
      const urls = await uploadFilesWithProgress(Array.from(inputEl.files || []), (percent) => {
        setVideoProgress(percent);
      });
      setVideos(prev => [...prev, ...urls]);
    } catch (err: any) {
      console.error('Video upload error:', err);
      const msg = typeof err === 'object' && err?.message ? err.message : String(err || 'Failed uploading video');
      alert(msg);
    } finally {
      setUploadingVideo(false);
      setVideoProgress(0);
      inputEl.value = '';
    }
  };

  const handleAddVideoUrl = () => {
    const raw = videoUrlInput.trim();
    if (!raw) return;
    const embedUrl = getEmbedUrl(raw);
    setVideos(prev => [...prev, embedUrl]);
    setVideoUrlInput('');
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
      videos,
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
    } catch {
      alert('Failed to delete product');
    }
  };

  if (loading) return <div className="text-brand-gold-300 font-cinzel">Loading products catalog...</div>;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">Products Manager</h1>
          <p className="text-xs text-brand-gold-200/70 mt-1">Add, edit, or remove catalog items, video demonstrations, rich specifications, and price quotes.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-bold font-cinzel text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:brightness-110 flex items-center gap-2 shadow-lg shadow-brand-gold-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Products Data Table */}
      <div className="bg-brand-navy-900 border border-brand-gold-500/20 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-brand-navy-800 text-brand-gold-400 uppercase tracking-wider bg-brand-navy-950/60 font-cinzel">
              <th className="py-3.5 px-4">Media</th>
              <th className="py-3.5 px-4">Title & Specs</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price / MOQ</th>
              <th className="py-3.5 px-4">Featured</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy-800 text-brand-gold-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-brand-navy-850/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-brand-gold-500/30 bg-brand-navy-950">
                    <img
                      src={getMediaUrl(p.images[0]) || '/static/uploads/products/sandalwood-japa-mala_sandalwood-japa-mala.jpg'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {p.videos && p.videos.length > 0 && (
                      <span className="absolute bottom-0 right-0 bg-brand-gold-500 text-brand-navy-950 p-0.5 rounded-tl text-[8px] font-bold flex items-center" title={`${p.videos.length} video(s)`}>
                        <Video className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 max-w-sm">
                  <div className="font-bold text-white text-sm line-clamp-1">{p.title}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.videos && p.videos.length > 0 && (
                      <span className="bg-brand-gold-500/20 text-brand-gold-300 text-[10px] px-2 py-0.5 rounded border border-brand-gold-500/30 flex items-center gap-1 font-semibold">
                        <Film className="w-2.5 h-2.5 text-brand-gold-400" /> {p.videos.length} Video{p.videos.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {p.specs?.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="bg-brand-navy-950 text-brand-gold-300 text-[10px] px-2 py-0.5 rounded border border-brand-gold-500/20">
                        {s.label}: {s.value}
                      </span>
                    ))}
                    {p.specs && p.specs.length > 2 && (
                      <span className="text-[10px] text-brand-gold-400 font-semibold self-center">
                        +{p.specs.length - 2} more specs
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-brand-gold-400 font-semibold">{p.category_name}</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white">{p.price || 'Bulk Quote'}</div>
                  <div className="text-[10px] text-brand-gold-300/70">MOQ: {p.moq}</div>
                </td>
                <td className="py-3.5 px-4">
                  {p.is_featured ? (
                    <span className="bg-brand-gold-500/20 text-brand-gold-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-brand-gold-500/30 flex items-center gap-1 w-fit">
                      <Star className="w-3 h-3 fill-brand-gold-400" /> Featured
                    </span>
                  ) : (
                    <span className="text-brand-gold-300/40">Standard</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-2 bg-brand-navy-800 hover:bg-brand-gold-500 hover:text-brand-navy-950 rounded-lg text-brand-gold-200 border border-brand-gold-500/20 transition-colors cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 bg-brand-navy-800 hover:bg-rose-600 hover:text-white rounded-lg text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                    title="Delete Product"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-brand-navy-900 border border-brand-gold-500/30 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto space-y-6 relative font-sans">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-brand-gold-400 hover:text-white p-1 rounded-full bg-brand-navy-950/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
                {editingId ? 'Edit Product, Videos & Specifications' : 'Add New Product'}
              </h2>
              <p className="text-xs text-brand-gold-200/70 mt-0.5">
                Configure title, photos, craft demonstration videos, wholesale MOQ, and detailed specifications matrix.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-gold-300 font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sandalwood Beads Sandalwood Japa Mala Loose Mala Beads"
                    className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white placeholder-brand-gold-200/40 focus:outline-none focus:border-brand-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-brand-gold-300 font-semibold mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-brand-navy-950 text-white">{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-gold-300 font-semibold mb-1">Price / Wholesale Rate</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. ₹190/Piece or Bulk Quote"
                    className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white placeholder-brand-gold-200/40 focus:outline-none focus:border-brand-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-brand-gold-300 font-semibold mb-1">Minimum Order Quantity (MOQ)</label>
                  <input
                    type="text"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    placeholder="e.g. 800 Piece"
                    className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white placeholder-brand-gold-200/40 focus:outline-none focus:border-brand-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Summary of product for cards and quick overview..."
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white placeholder-brand-gold-200/40 focus:outline-none focus:border-brand-gold-400"
                />
              </div>

              <div>
                <label className="block text-brand-gold-300 font-semibold mb-1">Full Craftsmanship & Heritage Description</label>
                <textarea
                  rows={5}
                  value={longDesc}
                  onChange={(e) => setLongDesc(e.target.value)}
                  placeholder="Detailed description of sandalwood origin, Malayagiri/Mysuru heritage, therapeutic aroma, healing benefits, etc."
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-3 text-white placeholder-brand-gold-200/40 focus:outline-none focus:border-brand-gold-400 leading-relaxed"
                />
              </div>

              {/* Dynamic Specifications Matrix */}
              <div className="space-y-3 border border-brand-gold-500/20 p-5 rounded-2xl bg-brand-navy-950/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-serif font-bold text-sm text-brand-gold-400 tracking-wide block">
                      Product Specifications Key-Values ({specs.length} items)
                    </span>
                    <span className="text-[11px] text-brand-gold-200/60">
                      Wood Origin, Bead Size, Bead Shape, Total Beads, Fragrance Level, Finish, Age, MOQ, etc.
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleApplySandalwoodTemplate}
                      className="text-[11px] bg-brand-navy-800 hover:bg-brand-gold-500 hover:text-brand-navy-950 px-3 py-1.5 rounded-lg text-brand-gold-300 font-bold border border-brand-gold-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Load standard 19-point sandalwood specs template"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold-400" />
                      Auto-Fill Sandalwood Specs
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="text-[11px] bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-navy-950 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Row
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1 divide-y divide-brand-navy-800">
                  {specs.map((s, idx) => (
                    <div key={idx} className="flex gap-2 items-center pt-2 first:pt-0">
                      <input
                        type="text"
                        placeholder="Label (e.g. Wood Origin)"
                        value={s.label}
                        onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                        className="w-2/5 bg-brand-navy-950 border border-brand-gold-500/30 rounded-lg p-2 text-white font-medium text-xs focus:outline-none focus:border-brand-gold-400"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. Indian Sandalwood)"
                        value={s.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        className="w-3/5 bg-brand-navy-950 border border-brand-gold-500/30 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-brand-gold-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 bg-brand-navy-800 rounded-lg border border-rose-500/20"
                        title="Remove row"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery Photos Upload Manager */}
              <div className="space-y-2 border border-brand-gold-500/20 p-5 rounded-2xl bg-brand-navy-950/40">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-brand-gold-400" />
                  <label className="block text-brand-gold-300 font-semibold">Product Photos Gallery ({images.length})</label>
                </div>
                <div className="flex flex-wrap gap-3 items-center pt-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-brand-gold-500/30 bg-brand-navy-950 shadow">
                      <img src={getMediaUrl(img)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1 shadow"
                        title="Delete Photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-brand-gold-500/30 bg-brand-navy-950 flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold-400 transition-colors">
                    <Upload className="w-5 h-5 text-brand-gold-400" />
                    <span className="text-[9px] text-brand-gold-300 mt-1 font-medium">Upload Photos</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {uploading && <span className="text-xs text-brand-gold-400 animate-pulse block pt-1">Uploading photos...</span>}
              </div>

              {/* Product Videos Upload & Embed Manager */}
              <div className="space-y-3 border border-brand-gold-500/20 p-5 rounded-2xl bg-brand-navy-950/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-brand-gold-400" />
                    <label className="block text-brand-gold-300 font-semibold">Product Craft Demonstration Videos ({videos.length})</label>
                  </div>
                  <span className="text-[10px] text-brand-gold-300/70">MP4, WebM, MOV or Video URLs</span>
                </div>

                {/* Upload Video Files & Add Video URLs */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      placeholder="Paste direct video URL or YouTube/CDN embed URL..."
                      className="w-full bg-brand-navy-950 border border-brand-gold-500/30 rounded-xl p-2.5 text-white placeholder-brand-gold-200/40 focus:outline-none focus:border-brand-gold-400 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddVideoUrl}
                      className="bg-brand-navy-800 hover:bg-brand-gold-500 hover:text-brand-navy-950 text-brand-gold-300 font-bold px-3 py-2 rounded-xl border border-brand-gold-500/30 shrink-0 text-xs transition-colors"
                    >
                      Add URL
                    </button>
                  </div>

                  <label className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-navy-950 font-bold px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 shrink-0 transition-colors shadow">
                    <Upload className="w-4 h-4" />
                    <span>Upload Video File</span>
                    <input type="file" multiple accept="video/*,.mp4,.mov,.webm,.mkv" onChange={handleVideoUpload} className="hidden" />
                  </label>
                </div>
                {uploadingVideo && <span className="text-xs text-brand-gold-400 animate-pulse block">Uploading product video... Please wait.</span>}

                {/* Video Previews List */}
                {videos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {videos.map((vid, idx) => (
                      <div key={idx} className="relative bg-brand-navy-950 border border-brand-gold-500/30 rounded-2xl overflow-hidden p-2 space-y-2">
                        <div className="w-full h-36 bg-black rounded-xl overflow-hidden relative">
                          {vid.includes('youtube.com') || vid.includes('youtu.be') ? (
                            <iframe src={vid} title={`Video ${idx + 1}`} className="w-full h-full" allowFullScreen />
                          ) : (
                            <video src={getMediaUrl(vid)} controls className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] text-brand-gold-300/80 truncate max-w-[200px]">Video #{idx + 1}: {vid}</span>
                          <button
                            type="button"
                            onClick={() => setVideos(videos.filter((_, i) => i !== idx))}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded-lg bg-brand-navy-800"
                            title="Remove Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-brand-gold-500/40 text-brand-gold-500 focus:ring-brand-gold-500 bg-brand-navy-950"
                />
                <label htmlFor="featured-check" className="text-brand-gold-100 font-medium cursor-pointer">
                  Feature on Public Homepage Carousel Strip
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-bold font-cinzel text-xs uppercase tracking-wider py-3.5 rounded-xl hover:brightness-110 shadow-lg shadow-brand-gold-500/20 transition-all mt-4 cursor-pointer"
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
