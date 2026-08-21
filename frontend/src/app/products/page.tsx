'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Category, Product } from '@/types';
import { Search, ChevronRight, Filter } from 'lucide-react';

export default function CategoryGridPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, pRes] = await Promise.all([
          fetchAPI<Category[]>('/categories').catch(() => []),
          fetchAPI<Product[]>('/products?limit=100').catch(() => []),
        ]);
        setCategories(cRes);
        setProducts(pRes);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter(p => 
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.short_description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      
      {/* Search & Header */}
      <div className="bg-sandalwood-950 text-sandalwood-50 p-8 rounded-3xl space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-400">Jaipur Handicrafts Catalog</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">
            Our Sandalwood Products & Categories
          </h1>
          <p className="text-sm text-sandalwood-300">
            Explore 108 bead Japa Malas, handcarved elephants, loose beads, bracelets, and religious jewelry.
          </p>
        </div>

        <div className="max-w-md relative">
          <input
            type="text"
            placeholder="Search products or bead size (e.g. 108 beads, elephant, 10mm)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sandalwood-900 border border-sandalwood-700 rounded-full py-3 pl-4 pr-10 text-sm text-sandalwood-100 placeholder-sandalwood-500 focus:border-gold-500"
          />
          <Search className="w-4 h-4 text-gold-400 absolute right-4 top-3.5" />
        </div>
      </div>

      {/* Category Grid Section */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-sandalwood-900">
          Product Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products/${c.slug}`}
              className="group bg-white border border-sandalwood-200 rounded-3xl p-5 wood-card-shadow hover:border-gold-500 transition-all transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 bg-sandalwood-100 relative">
                <img
                  src={c.image_url || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80'}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div>
                <h3 className="font-serif font-bold text-sandalwood-900 text-lg group-hover:text-gold-600 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-sandalwood-500 mt-1 line-clamp-2">
                  {c.description || 'Authentic Mysuru sandalwood craft item.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-sandalwood-100 flex items-center justify-between text-xs">
                <span className="text-gold-700 font-semibold">{c.product_count || 0} Products</span>
                <span className="text-sandalwood-900 font-bold flex items-center gap-1 group-hover:text-gold-600">
                  Browse <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Product Search Results / All Catalog Grid */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-sandalwood-900">
          {search ? `Search Results for "${search}"` : 'All Catalog Items'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white border border-sandalwood-200 rounded-2xl overflow-hidden wood-card-shadow flex flex-col justify-between hover:border-gold-400 transition-all">
              <Link href={`/products/${p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'item'}/${p.slug}`}>
                <div className="h-56 bg-sandalwood-50 relative overflow-hidden group">
                  <img
                    src={p.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80'}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-sandalwood-950/80 backdrop-blur-sm text-gold-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    MOQ: {p.moq}
                  </span>
                </div>
              </Link>

              <div className="p-5 space-y-3">
                <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wider block">
                  {p.category_name}
                </span>
                <Link href={`/products/${p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'item'}/${p.slug}`}>
                  <h3 className="font-serif font-bold text-sandalwood-900 text-base hover:text-gold-600 line-clamp-1">
                    {p.title}
                  </h3>
                </Link>
                <p className="text-xs text-sandalwood-600 line-clamp-2">
                  {p.short_description}
                </p>

                <div className="pt-2 border-t border-sandalwood-100 flex items-center justify-between">
                  <span className="font-bold text-sandalwood-900 text-sm">{p.price || 'Contact for Price'}</span>
                  <Link
                    href={`/products/${p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'item'}/${p.slug}`}
                    className="bg-sandalwood-900 text-gold-400 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gold-500 hover:text-sandalwood-950 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
