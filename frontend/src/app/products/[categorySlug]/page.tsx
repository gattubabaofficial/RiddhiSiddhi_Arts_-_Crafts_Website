'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI, getMediaUrl } from '@/lib/api';
import { Category, Product } from '@/types';
import { Heart } from 'lucide-react';
import EnquiryModal from '@/components/products/EnquiryModal';

export default function CategoryListingPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeSub, setActiveSub] = useState<string>('View All');
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  useEffect(() => {
    async function loadCategoryProducts() {
      try {
        const [cRes, pRes] = await Promise.all([
          fetchAPI<Category>(`/categories/${categorySlug}`).catch(() => null),
          fetchAPI<Product[]>(`/products?category_slug=${categorySlug}`).catch(() => []),
        ]);
        setCategory(cRes);
        setProducts(Array.isArray(pRes) ? pRes : []);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryProducts();
  }, [categorySlug]);

  const openQuoteModal = (prod: Product) => {
    setSelectedProduct(prod);
    setEnquiryModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-36 pb-20 text-center text-neutral-800 font-sans text-sm tracking-widest uppercase">
        Loading category items...
      </div>
    );
  }

  const subcategories = [
    { title: 'View All' },
    ...(categorySlug === 'sandalwood-japa-mala' ? [
      { title: '108 Beads Japa Mala' },
      { title: 'Muslim Tashbih' },
      { title: 'Beads Mala & Garlands' },
      { title: 'Wrist Malas' }
    ] : categorySlug === 'handcarved-elephants' ? [
      { title: 'Undercut Net Elephants' },
      { title: 'Solid Royal Elephants' },
      { title: 'Temple Deities' },
      { title: 'Heritage Boxes' }
    ] : categorySlug === 'loose-sandalwood-beads' ? [
      { title: 'Calibrated Round Beads' },
      { title: 'Raw Beads' },
      { title: 'Cylindrical Spacers' },
      { title: 'Sandalwood Billets' }
    ] : categorySlug === 'designer-sandalwood-bracelets' ? [
      { title: 'Stretchable Bracelets' },
      { title: 'Silver Capped' },
      { title: 'Sacred Pendants' },
      { title: 'Braided Cord' }
    ] : categorySlug === 'muslim-tashbih-misbahah' ? [
      { title: '33 Beads Pocket' },
      { title: '99 Beads Full' },
      { title: 'Carved Imame' }
    ] : [
      { title: 'Standard' },
      { title: 'Custom Artisan' }
    ])
  ];

  const filteredProducts = activeSub === 'View All' 
    ? products 
    : products.filter(p => p.title.toLowerCase().includes(activeSub.toLowerCase()) || p.short_description?.toLowerCase().includes(activeSub.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-36 lg:pt-40 pb-24 space-y-6">
      
      {/* Category Header (Matching Louis Vuitton Clean Sans-Serif Typography) */}
      <div>
        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-900 tracking-tight leading-tight">
          {category?.name || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
      </div>

      {/* Horizontal Subcategory Navigation (Exact Louis Vuitton Sub-Nav) */}
      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 md:-mx-8 md:px-8 pt-1">
        <div className="flex items-center gap-6 sm:gap-8 md:gap-9 whitespace-nowrap min-w-max pb-2">
          {subcategories.map((sub, idx) => {
            const isActive = activeSub === sub.title;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSub(sub.title)}
                className={`text-xs sm:text-[13px] font-sans tracking-wide transition-colors cursor-pointer py-1 select-none ${
                  isActive
                    ? 'text-black font-medium border-b-[1.5px] border-black'
                    : 'text-neutral-500 hover:text-black animated-underline'
                }`}
              >
                {sub.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid (Matching Louis Vuitton Studio Grid) */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-transparent space-y-4">
          <p className="text-neutral-600 font-sans text-sm">No items found in this section.</p>
          <button
            type="button"
            onClick={() => setActiveSub('View All')}
            className="inline-flex bg-black text-white font-sans text-xs uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            View All {category?.name || 'Category'} Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-0 gap-y-8 sm:gap-y-12 pt-2">
          {filteredProducts.map((p) => {
            const isWishlisted = !!wishlist[p.id];
            return (
              <div key={p.id} className="group flex flex-col cursor-pointer select-none">
                {/* Clean Studio Photo Frame Touching Edge-to-Edge with Zero Gap */}
                <div className="relative w-full aspect-[4/5] bg-[#F6F5F2] overflow-hidden flex items-center justify-center p-3 sm:p-4">
                  <Link href={`/products/${categorySlug}/${p.slug}`} className="w-full h-full flex items-center justify-center">
                    <img
                      src={getMediaUrl(p.images[0]) || '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg'}
                      alt={p.title}
                      className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
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
                  <Link href={`/products/${categorySlug}/${p.slug}`} className="block">
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

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
