'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI, getMediaUrl } from '@/lib/api';
import { Category, Product } from '@/types';
import { Heart, Star, Play, ArrowRight } from 'lucide-react';
import EnquiryModal from '@/components/products/EnquiryModal';

interface CollectionDef {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  categorySlugs: string[];
}

const COLLECTIONS_MAP: Record<string, CollectionDef> = {
  malas: {
    slug: 'malas',
    title: 'Sacred Malas & Rosaries',
    subtitle: 'Spiritual Chanting & Devotional Jewelry',
    description: 'Certified 108 pure Mysuru Sandalwood Japa malas, hand-strung spiritual necklaces, and authentic Islamic Tashbih prayer beads.',
    coverImage: '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg',
    categorySlugs: ['sandalwood-rosary', 'sandalwood-japa-mala', 'sandalwood-beads', 'religious-sandalwood-jewellery'],
  },
  sculptures: {
    slug: 'sculptures',
    title: 'Royal Sculptures & Idols',
    subtitle: 'Jaipur Master Artisan Heritage',
    description: 'Bespoke single-piece undercut net-jaali elephants, baby-inside-mother carvings, and sacred temple deities.',
    coverImage: '/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg',
    categorySlugs: ['whitewood-handicrafts', 'sandalwood-religious-god-statues', 'handcarved-elephants', 'religious-handicraft-sandalwood', 'sandalwood-gift-items'],
  },
  'loose-beads': {
    slug: 'loose-beads',
    title: 'Loose Beads & Semi Finished Craft',
    subtitle: 'Calibrated Jewelry Component Supply',
    description: 'Precision spherical, cylindrical, and oval fragrant sandalwood beads from 4mm to 22mm for custom rosaries and luxury jewelry.',
    coverImage: '/static/uploads/products/12-mm-sandalwood-semi-finished-beads_0_sandalwood-semi-finished-500x500.jpg',
    categorySlugs: ['sandalwood-beads-semi-finished', 'loose-sandalwood-beads', 'natural-brown-wooden-beads', 'wooden-beads', 'sandalwood-product'],
  },
  bracelets: {
    slug: 'bracelets',
    title: 'Designer Bracelets & Hand Chains',
    subtitle: 'Contemporary Spiritual Luxury',
    description: 'Everyday fragrant wrist malas, hand chains, carved charms, and protective sandalwood jewelry.',
    coverImage: '/static/uploads/products/10-mm-sandalwood-hand-chain-in-china_0_sandalwood-hand-chain-in-china-500x500.png',
    categorySlugs: ['sandalwood-bracelet', 'sandalwood-hand-chain', 'designer-sandalwood-bracelets', 'sandalwood-carvings-bracelets', 'crafted-sandalwood-jewelery'],
  },
};

const DEFAULT_FALLBACK_PRODUCTS: Product[] = [
  { id: 1, title: '10 mm Indian Sandalwood Mala', slug: '10-mm-indian-sandalwood-mala', short_description: 'Certified pure Mysore Sandalwood Japa Mala with natural long-lasting aroma. Perfect for meditation and spiritual practice.', images: ['/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg'], moq: '10 Pieces', price: '₹2,800 – ₹5,400', is_featured: true, category_id: 1, category_name: 'Sandalwood Rosary' },
  { id: 2, title: '10 mm Sandalwood Tasbih Rosary', slug: '10-mm-sandalwood-tasbih-supplier-in-uae', short_description: 'Natural aromatic chandan rosary mala hand-strung by Jaipur artisans with authentic sandalwood fragrance.', images: ['/static/uploads/products/10-mm-sandalwood-tasbih-supplier-in-uae_0_sandalwood-tasbih-500x500.jpg'], moq: '10 Pieces', price: '₹1,900 – ₹3,800', is_featured: true, category_id: 2, category_name: 'Sandalwood Rosary' },
  { id: 3, title: '10 mm Sandalwood Hand Chain', slug: '10-mm-sandalwood-hand-chain-in-china', short_description: 'Exquisite sandalwood hand chain and wrist mala with natural smooth finish and soothing essential aroma.', images: ['/static/uploads/products/10-mm-sandalwood-hand-chain-in-china_0_sandalwood-hand-chain-in-china-500x500.png'], moq: '10 Pieces', price: '₹1,200 – ₹2,400', is_featured: true, category_id: 17, category_name: 'Sandalwood Bracelet' },
  { id: 4, title: 'Elephant Wood Carving Sculpture', slug: 'elephant-carving-statue', short_description: 'Masterfully hand-carved traditional wooden royal elephant created by Jaipur royal handicraft artisans.', images: ['/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg'], moq: '1 Piece', price: '₹4,500 – ₹9,200', is_featured: true, category_id: 15, category_name: 'Whitewood Handicrafts' },
];

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = (params.slug as string) || 'malas';

  const collection = COLLECTIONS_MAP[slug] || {
    slug,
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    subtitle: 'Exclusive Chandan Collection',
    description: 'Masterfully handcrafted in Jaipur from 100% genuine Mysore Sandalwood.',
    coverImage: '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg',
    categorySlugs: [slug],
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>({});
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantPill, setSelectedVariantPill] = useState<string>('');

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleSelectVariant = (productId: number, variant: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  const openQuote = (p: Product) => {
    setSelectedProduct(p);
    setSelectedVariantPill(selectedVariants[p.id] || 'Standard');
    setEnquiryModalOpen(true);
  };

  useEffect(() => {
    async function loadCollectionData() {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetchAPI<Category[]>('/categories').catch(() => []),
          fetchAPI<Product[]>('/products').catch(() => []),
        ]);
        setCategories(Array.isArray(catsRes) ? catsRes : []);

        const allProds = Array.isArray(prodsRes) && prodsRes.length > 0 ? prodsRes : DEFAULT_FALLBACK_PRODUCTS;
        
        // Filter products that belong to this collection's category slugs or names
        const matched = allProds.filter((p) => {
          const pCatSlug = p.category_name?.toLowerCase().replace(/\s+/g, '-') || '';
          return collection.categorySlugs.some((cs) => cs === pCatSlug || cs.includes(pCatSlug) || pCatSlug.includes(cs) || p.title.toLowerCase().includes(cs.replace(/-/g, ' ')));
        });

        setProducts(matched.length > 0 ? matched : allProds);
      } finally {
        setLoading(false);
      }
    }
    loadCollectionData();
  }, [slug]);

  const defaultVariants = ['20–25g', '50g', '100g'];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-36 lg:pt-40 pb-24 space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-cinzel text-xs uppercase tracking-[0.25em] font-bold text-[#B3873E] block">
          {collection.subtitle}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84] tracking-tight">
          {collection.title}
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed">
          {collection.description}
        </p>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-sans text-neutral-500 border-b border-neutral-200 pb-3">
        <Link href="/" className="hover:text-[#0B3C84]">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-[#0B3C84]">Collections</Link>
        <span>/</span>
        <span className="text-[#0B3C84] font-medium">{collection.title}</span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20 text-sm font-cinzel text-neutral-500 tracking-widest uppercase">
          Loading Collection Products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl space-y-4">
          <p className="text-neutral-600 text-sm">No items found in this collection.</p>
          <Link href="/products" className="inline-block bg-[#0B3C84] text-white px-6 py-2.5 rounded-full text-xs font-cinzel uppercase tracking-wider">
            Explore All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((p, idx) => {
            const catSlug = categories.find((c) => c.id === p.category_id)?.slug || p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'all';
            const isWishlisted = !!wishlist[p.id];
            const currentVariant = selectedVariants[p.id] || defaultVariants[0];

            return (
              <div
                key={p.id}
                className="bg-white rounded-none border-none flex flex-col justify-between group select-none"
              >
                {/* Image Container with Badges */}
                <div className="relative w-full aspect-[4/5] bg-[#F6F5F2] overflow-hidden flex items-center justify-center p-3 sm:p-4">
                  <Link href={`/products/${catSlug}/${p.slug}`} className="w-full h-full flex items-center justify-center">
                    <img
                      src={getMediaUrl(p.images[0]) || collection.coverImage}
                      alt={p.title}
                      className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                    />
                  </Link>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                    {idx === 0 && (
                      <span className="bg-[#0B3C84] text-white font-cinzel text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase shadow-sm">
                        BEST
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 bg-white/95 text-[#0B3C84] font-sans text-[10px] font-medium px-2 py-0.5 shadow-sm">
                      <Play className="w-2.5 h-2.5 fill-[#0B3C84]" /> Video Inside
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(p.id, e)}
                    aria-label="Add to wishlist"
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 hover:bg-white text-neutral-700 hover:text-black transition-colors"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-700'}`} />
                  </button>
                </div>

                {/* Info Container */}
                <div className="pt-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Title */}
                    <Link href={`/products/${catSlug}/${p.slug}`}>
                      <h3 className="font-serif text-[#0B3C84] text-base sm:text-lg hover:opacity-75 transition-opacity line-clamp-1 font-normal leading-snug">
                        {p.title}
                      </h3>
                    </Link>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-[11px] font-sans text-neutral-500">
                        ({20 + (p.id * 7) % 35} reviews)
                      </span>
                    </div>

                    {/* Price Range */}
                    <div className="pt-1">
                      <span className="font-sans font-semibold text-[#0B3C84] text-sm sm:text-base">
                        {p.price || '₹2,800 – ₹5,400'}
                      </span>
                    </div>
                  </div>

                  {/* Variant Selection Pills */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                    <span className="text-[10px] uppercase font-cinzel text-neutral-500 font-semibold tracking-wider block">
                      Select Variant
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {defaultVariants.map((v) => {
                        const isSelected = currentVariant === v;
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={(e) => handleSelectVariant(p.id, v, e)}
                            className={`px-2.5 py-1 text-[11px] font-sans font-medium transition-all rounded-sm cursor-pointer ${
                              isSelected
                                ? 'bg-[#0B3C84] text-white border border-[#0B3C84] shadow-xs'
                                : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-500'
                            }`}
                          >
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => openQuote(p)}
                      className="w-full bg-white hover:bg-[#0B3C84] text-[#0B3C84] hover:text-white border border-[#0B3C84] font-cinzel font-bold text-xs uppercase tracking-wider py-2.5 px-4 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      Select options <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        product={selectedProduct}
        productTitle={selectedProduct?.title}
        productId={selectedProduct?.id}
        selectedSize={selectedVariantPill}
      />
    </div>
  );
}
