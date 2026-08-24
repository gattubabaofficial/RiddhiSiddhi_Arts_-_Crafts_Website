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
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-12 space-y-12">
      
      {/* Search & Header */}
      <div className="bg-brand-navy-950 text-white p-8 md:p-12 rounded-3xl space-y-6 border border-brand-gold-500/20 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-brand-gold-400">Jaipur Handicrafts Catalog</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">
            Our Sandalwood Products & Categories
          </h1>
          <p className="text-sm text-brand-gold-100/80">
            Explore 108 bead Japa Malas, handcarved elephants, loose beads, bracelets, and religious jewelry.
          </p>
        </div>

        <div className="max-w-md relative">
          <input
            type="text"
            placeholder="Search products or bead size (e.g. 108 beads, elephant, 10mm)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-navy-900 border border-brand-gold-500/30 rounded-full py-3 pl-4 pr-10 text-sm text-white placeholder-brand-gold-200/50 focus:border-brand-gold-400 focus:outline-none"
          />
          <Search className="w-4 h-4 text-brand-gold-400 absolute right-4 top-3.5" />
        </div>
      </div>

      {/* Category Grid Section */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy-900">
          Product Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products/${c.slug}`}
              className="group bg-white border border-brand-sandalwood-200 rounded-3xl p-5 wood-card-shadow hover:border-brand-gold-500 transition-all transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 bg-brand-sandalwood-100 relative">
                <img
                  src={c.image_url || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80'}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div>
                <h3 className="font-serif font-bold text-brand-navy-900 text-lg group-hover:text-brand-gold-600 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-brand-navy-950/60 mt-1 line-clamp-2">
                  {c.description || 'Authentic Mysuru sandalwood craft item.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-sandalwood-100 flex items-center justify-end text-xs">
                <span className="font-cinzel text-brand-navy-900 font-bold flex items-center gap-1 group-hover:text-brand-gold-600 uppercase tracking-wider text-[11px]">
                  Browse <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Product Search Results / All Catalog Grid */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy-900">
          {search ? `Search Results for "${search}"` : 'All Catalog Items'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white border border-brand-sandalwood-200 rounded-2xl overflow-hidden wood-card-shadow flex flex-col justify-between hover:border-brand-gold-400 transition-all">
              <Link href={`/products/${p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'item'}/${p.slug}`}>
                <div className="h-56 bg-brand-sandalwood-50 relative overflow-hidden group">
                  <img
                    src={p.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80'}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-brand-navy-950/85 backdrop-blur-sm text-brand-gold-300 font-cinzel text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    MOQ: {p.moq}
                  </span>
                </div>
              </Link>

              <div className="p-5 space-y-3">
                <span className="font-cinzel text-[11px] font-bold text-brand-gold-700 uppercase tracking-wider block">
                  {p.category_name}
                </span>
                <Link href={`/products/${p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'item'}/${p.slug}`}>
                  <h3 className="font-serif font-bold text-brand-navy-900 text-base hover:text-brand-gold-600 line-clamp-1">
                    {p.title}
                  </h3>
                </Link>
                <p className="text-xs text-brand-navy-950/70 line-clamp-2">
                  {p.short_description}
                </p>

                <div className="pt-2 border-t border-brand-sandalwood-100 flex items-center justify-between">
                  <span className="font-bold text-brand-navy-900 text-sm">{p.price || 'Contact for Price'}</span>
                  <Link
                    href={`/products/${p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'item'}/${p.slug}`}
                    className="bg-brand-navy-900 text-brand-gold-300 font-cinzel text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-brand-gold-500 hover:text-brand-navy-950 transition-colors uppercase tracking-wider"
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

