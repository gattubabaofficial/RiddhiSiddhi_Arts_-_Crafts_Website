'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchAPI, getMediaUrl } from '@/lib/api';
import { Category, Product } from '@/types';
import { Heart } from 'lucide-react';

function CategoryGridContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetchAPI<Category[]>('/categories').catch(() => []),
          fetchAPI<Product[]>('/products').catch(() => []),
        ]);
        setCategories(Array.isArray(catsRes) ? catsRes : []);
        setProducts(Array.isArray(prodsRes) ? prodsRes : []);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-36 pb-20 text-center text-neutral-800 font-sans text-sm tracking-widest uppercase">
        Loading collections...
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.short_description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-36 lg:pt-40 pb-24 space-y-6">
      
      {/* Catalog Title */}
      <div>
        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-900 tracking-tight leading-tight">
          {search ? `Search Results for "${search}"` : 'All Sandalwood Creations'}
        </h1>
      </div>

      {/* Product Catalog Studio Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-transparent space-y-4">
          <p className="text-neutral-600 font-sans text-sm">No items found in this section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-0 gap-y-8 sm:gap-y-12 pt-2">
          {filteredProducts.map((p) => {
            const catSlug = categories.find(c => c.id === p.category_id)?.slug || p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'all';
            const isWishlisted = !!wishlist[p.id];
            return (
              <div key={p.id} className="group flex flex-col cursor-pointer select-none">
                {/* Clean Studio Photo Frame Touching Edge-to-Edge with Zero Gap */}
                <div className="relative w-full aspect-[4/5] bg-[#F6F5F2] overflow-hidden">
                  <Link href={`/products/${catSlug}/${p.slug}`} className="block w-full h-full">
                    <img
                      src={getMediaUrl(p.images[0]) || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80'}
                      alt={p.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </Link>

                  {/* Top-Right Minimalist Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(p.id, e)}
                    aria-label="Add to wishlist"
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/70 hover:bg-white text-neutral-700 hover:text-black transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                      }`}
                    />
                  </button>
                </div>

                {/* Minimalist Product Typography Underneath */}
                <div className="pt-3 sm:pt-4 px-2 sm:px-3 space-y-1">
                  <Link href={`/products/${catSlug}/${p.slug}`} className="block">
                    <h3 className="text-xs sm:text-[13px] md:text-sm font-sans text-neutral-900 group-hover:text-black font-normal leading-snug line-clamp-1">
                      {p.title}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-[13px] font-sans text-neutral-600 font-normal">
                    {p.price ? (p.price.startsWith('₹') ? p.price : `₹${p.price}`) : 'Ask for Wholesale Quote'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CategoryGridPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-32 text-center text-brand-navy-900 font-cinzel">Loading Catalog...</div>}>
      <CategoryGridContent />
    </Suspense>
  );
}
