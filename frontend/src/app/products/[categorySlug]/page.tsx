'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Category, Product } from '@/types';
import { Send, ChevronRight, Filter } from 'lucide-react';
import EnquiryModal from '@/components/products/EnquiryModal';

export default function CategoryListingPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProductTitle, setSelectedProductTitle] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function loadCategoryProducts() {
      try {
        const [cRes, pRes] = await Promise.all([
          fetchAPI<Category>(`/categories/${categorySlug}`).catch(() => null),
          fetchAPI<Product[]>(`/products?category_slug=${categorySlug}`).catch(() => []),
        ]);
        setCategory(cRes);
        setProducts(pRes);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryProducts();
  }, [categorySlug]);

  const openQuoteModal = (title: string, id: number) => {
    setSelectedProductTitle(title);
    setSelectedProductId(id);
    setEnquiryModalOpen(true);
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sandalwood-600">Loading catalog items...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-10">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-sandalwood-500">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-sandalwood-400" />
        <Link href="/products" className="hover:text-gold-600">Our Products</Link>
        <ChevronRight className="w-3 h-3 text-sandalwood-400" />
        <span className="font-bold text-sandalwood-900">{category?.name || categorySlug}</span>
      </div>

      {/* Category Banner */}
      <div className="bg-sandalwood-950 text-sandalwood-50 p-8 rounded-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-gold-400">Category Catalog</span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold">
          {category?.name || categorySlug.replace(/-/g, ' ').toUpperCase()}
        </h1>
        {category?.description && (
          <p className="text-sm text-sandalwood-300 max-w-2xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Product Cards Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-sandalwood-200 wood-card-shadow space-y-4">
          <p className="text-sandalwood-700">No products found in this category yet.</p>
          <Link href="/products" className="inline-flex bg-gold-500 text-sandalwood-950 font-bold px-6 py-2.5 rounded-full text-xs">
            Browse All Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white border border-sandalwood-200 rounded-2xl overflow-hidden wood-card-shadow flex flex-col justify-between hover:border-gold-400 transition-all">
              <Link href={`/products/${categorySlug}/${p.slug}`}>
                <div className="h-56 bg-sandalwood-50 relative overflow-hidden group">
                  <img
                    src={p.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80'}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-sandalwood-950/80 backdrop-blur-sm text-gold-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    MOQ: {p.moq}
                  </span>
                </div>
              </Link>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <Link href={`/products/${categorySlug}/${p.slug}`}>
                    <h3 className="font-serif font-bold text-sandalwood-900 text-base hover:text-gold-600 line-clamp-1">
                      {p.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-sandalwood-600 line-clamp-2">
                    {p.short_description}
                  </p>
                </div>

                <div className="pt-3 border-t border-sandalwood-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-sandalwood-400 block">Rate</span>
                    <span className="font-bold text-sandalwood-900 text-sm">{p.price || 'Ask Quote'}</span>
                  </div>
                  <button
                    onClick={() => openQuoteModal(p.title, p.id)}
                    className="bg-sandalwood-900 hover:bg-gold-500 hover:text-sandalwood-950 text-sandalwood-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Get Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        productTitle={selectedProductTitle}
        productId={selectedProductId}
      />
    </div>
  );
}
