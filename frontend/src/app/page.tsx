'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Star,
  Play,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  MessageCircle,
} from 'lucide-react';
import EnquiryModal from '@/components/products/EnquiryModal';

interface VideoShowcase {
  id: string;
  title: string;
  subtitle: string;
  youtubeId: string;
  thumbnail: string;
  duration: string;
  badge: string;
}

const HERO_VIDEOS: VideoShowcase[] = [
  {
    id: 'sink-test',
    title: 'Water Density Purity Test — Does Real Sandalwood Sink in Water?',
    subtitle: 'Demonstrating genuine high-oil Mysuru heartwood density in pure water',
    youtubeId: '4yVb9g14Hj0',
    thumbnail: '/static/uploads/banners/hero_banner_1_template_photo_2.jpg',
    duration: '2:45',
    badge: 'Featured Test',
  },
  {
    id: 'mala-making',
    title: 'Handcrafting 108 Beads Mysore Sandalwood Japa Mala',
    subtitle: 'Master artisans lathe-turning and silk-knotting spiritual beads in Jaipur',
    youtubeId: 'gH7dvcCgk1E',
    thumbnail: '/static/uploads/banners/hero_banner_2_template_photo_3.jpg',
    duration: '3:15',
    badge: 'Artisan Workshop',
  },
  {
    id: 'elephant-carving',
    title: 'Undercut Net Jaali Royal Elephant Single-Piece Carving',
    subtitle: 'Centuries-old Rajasthani royal carving technique inside a single wood block',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: '/static/uploads/banners/hero_banner_5_template_photo_6.jpg',
    duration: '4:10',
    badge: 'Master Carving',
  },
  {
    id: 'aroma-grain',
    title: 'Natural Aroma & Grain Density Verification Guide',
    subtitle: 'Friction warmth test & botanical heartwood grain identification',
    youtubeId: 'L_LUpnjgPso',
    thumbnail: '/static/uploads/banners/hero_banner_4_template_photo_5.jpg',
    duration: '1:50',
    badge: 'Buyer Guide',
  },
];

const CATEGORY_CARDS = [
  {
    id: 'malas',
    title: 'Sacred Malas & Rosaries',
    slug: 'malas',
    link: '/collections/malas',
    image: '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg',
    specs: '108 Beads & Prayer Rosaries',
  },
  {
    id: 'sculptures',
    title: 'Royal Sculptures & Idols',
    slug: 'sculptures',
    link: '/collections/sculptures',
    image: '/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg',
    specs: 'Single-Piece Net Jaali Carvings',
  },
  {
    id: 'loose-beads',
    title: 'Loose Sandalwood Beads',
    slug: 'loose-beads',
    link: '/collections/loose-beads',
    image: '/static/uploads/products/12-mm-sandalwood-semi-finished-beads_0_sandalwood-semi-finished-500x500.jpg',
    specs: 'Calibrated 4mm to 22mm Spherical',
  },
  {
    id: 'bracelets',
    title: 'Designer Sandalwood Bracelets',
    slug: 'bracelets',
    link: '/collections/bracelets',
    image: '/static/uploads/products/10-mm-sandalwood-hand-chain-in-china_0_sandalwood-hand-chain-in-china-500x500.png',
    specs: 'Hand Chains & Elastic Wristlets',
  },
];

interface ShowcaseProductItem {
  id: number;
  title: string;
  slug: string;
  category_slug: string;
  category_name: string;
  image: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  variants: string[];
  badge?: 'BEST' | 'SOLD OUT' | 'NEW';
  hasVideo: boolean;
}

const SHOWCASE_PRODUCTS: ShowcaseProductItem[] = [
  {
    id: 1,
    title: '10 mm Pure Indian Mysore Sandalwood 108 Japa Mala',
    slug: '10-mm-indian-sandalwood-mala',
    category_slug: 'sandalwood-rosary',
    category_name: 'Sacred Malas',
    image: '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg',
    priceRange: '₹2,800 – ₹5,400',
    rating: 5,
    reviewCount: 42,
    variants: ['20–25g', '50g', '100g'],
    badge: 'BEST',
    hasVideo: true,
  },
  {
    id: 2,
    title: '10 mm Sandalwood Islamic Tasbih Prayer Rosary (99 Beads)',
    slug: '10-mm-sandalwood-tasbih-supplier-in-uae',
    category_slug: 'sandalwood-rosary',
    category_name: 'Tasbih Rosaries',
    image: '/static/uploads/products/10-mm-sandalwood-tasbih-supplier-in-uae_0_sandalwood-tasbih-500x500.jpg',
    priceRange: '₹1,900 – ₹3,800',
    rating: 5,
    reviewCount: 28,
    variants: ['33 Beads', '66 Beads', '99 Beads'],
    hasVideo: true,
  },
  {
    id: 3,
    title: '10 mm Artisanal Sandalwood Hand Chain Wrist Mala',
    slug: '10-mm-sandalwood-hand-chain-in-china',
    category_slug: 'sandalwood-bracelet',
    category_name: 'Bracelets',
    image: '/static/uploads/products/10-mm-sandalwood-hand-chain-in-china_0_sandalwood-hand-chain-in-china-500x500.png',
    priceRange: '₹1,200 – ₹2,400',
    rating: 5,
    reviewCount: 19,
    variants: ['8mm', '10mm', '12mm'],
    hasVideo: true,
  },
  {
    id: 4,
    title: 'Undercut Net Jaali Royal Sandalwood Elephant Carving',
    slug: 'elephant-carving-statue',
    category_slug: 'whitewood-handicrafts',
    category_name: 'Sculptures',
    image: '/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg',
    priceRange: '₹4,500 – ₹9,200',
    rating: 5,
    reviewCount: 35,
    variants: ['3 Inch', '4 Inch', '6 Inch'],
    badge: 'BEST',
    hasVideo: true,
  },
  {
    id: 5,
    title: '12 mm Calibrated Loose Mysore Sandalwood Beads Pack',
    slug: '12-mm-sandalwood-semi-finished-beads',
    category_slug: 'sandalwood-beads-semi-finished',
    category_name: 'Loose Beads',
    image: '/static/uploads/products/12-mm-sandalwood-semi-finished-beads_0_sandalwood-semi-finished-500x500.jpg',
    priceRange: '₹3,200 – ₹6,500',
    rating: 5,
    reviewCount: 22,
    variants: ['50 Pcs', '108 Pcs', '250 Pcs'],
    hasVideo: true,
  },
  {
    id: 6,
    title: '15 mm Natural Tiger Sandalwood Meditation Bracelet',
    slug: '15-mm-sandalwood-tiger-beads-bracelet-supplier-in-hong-kong',
    category_slug: 'sandalwood-bracelet',
    category_name: 'Bracelets',
    image: '/static/uploads/products/15-mm-sandalwood-tiger-beads-bracelet-supplier-in-hong-kong_0_20-mm-sandalwood-semi-finished-beads-500x500.png',
    priceRange: '₹1,600 – ₹3,100',
    rating: 5,
    reviewCount: 16,
    variants: ['12mm', '15mm', '18mm'],
    hasVideo: true,
  },
  {
    id: 7,
    title: 'Handcarved Sandalwood Lord Ganesha Deity Idol',
    slug: 'hindu-god-idol-sandalwood-ganesha',
    category_slug: 'sandalwood-religious-god-statues',
    category_name: 'Deities',
    image: '/static/uploads/products/hindu-god-idol-sandalwood-ganesha_0_hindu-god-idol-sandalwood-ganesha-500x500.jpg',
    priceRange: '₹6,800 – ₹14,500',
    rating: 5,
    reviewCount: 31,
    variants: ['2.5 Inch', '4 Inch', '5.5 Inch'],
    badge: 'SOLD OUT',
    hasVideo: true,
  },
  {
    id: 8,
    title: '108 Beads Sandalwood Mala with Om Sacred Pendant',
    slug: '108-mala-bead-sandalwood-mala-beads-mala-necklace',
    category_slug: 'crafted-sandalwood-jewelery',
    category_name: 'Sacred Jewelry',
    image: '/static/uploads/products/108-mala-bead-sandalwood-mala-beads-mala-necklace_108-mala-bead-sandalwood-mala-beads-mala-necklace.jpg',
    priceRange: '₹3,500 – ₹6,900',
    rating: 5,
    reviewCount: 27,
    variants: ['6mm Beads', '8mm Beads', '10mm Beads'],
    hasVideo: true,
  },
];

// Exact WhatsApp Testimonial Screenshot list from purechandan.com
const PURECHANDAN_TESTIMONIALS = [
  'https://purechandan.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-09.15.47_33ed6c3d.jpg',
  'https://purechandan.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-09.15.48_d45577e1.jpg',
  'https://purechandan.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-09.15.49_a4dd680a.jpg',
  'https://purechandan.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-09.15.48_aaeaa146.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-24-11-52-45-553_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-24-11-52-35-325_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-21-08-41-56-313_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-27-35-626_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-24-33-184_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-24-11-58-05-624_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-20-24-543_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-18-17-696_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-18-07-019_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-16-22-961_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-15-50-987_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-15-25-182_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-12-27-102_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-05-50-395_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2025/05/Screenshot_2025-05-20-07-03-24-047_com.whatsapp.w4b.jpg',
  'https://purechandan.com/wp-content/uploads/2024/11/1000060243-rotated.jpg',
  'https://purechandan.com/wp-content/uploads/2024/10/IMG_0048-rotated.jpeg',
];

// YouTube Shorts list from purechandan.com
const PURECHANDAN_SHORTS = [
  { id: '1', embedUrl: 'https://www.youtube.com/embed/K6zDM2rynSs', title: 'Sandalwood Purity Demo' },
  { id: '2', embedUrl: 'https://www.youtube.com/embed/qo_8SWhjC-Y', title: 'Chandan Stick Quality Test' },
  { id: '3', embedUrl: 'https://www.youtube.com/embed/UHxLGI3fq6w', title: 'Authentic Heartwood Check' },
  {
    id: '4',
    embedUrl: 'https://www.youtube.com/embed/2niTTYVh98s',
    title: 'Does Red Sandalwood Sink in Water?',
    thumbnail: 'https://purechandan.com/wp-content/uploads/2024/08/WhatsApp-Image-2025-01-27-at-17.06.07_718345c9-e1737977824540.jpg',
  },
];

export default function HomePage() {
  // Hero Video state
  const [isPlaying, setIsPlaying] = useState(false);

  // Products state
  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>({});
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});

  // WhatsApp Screenshot Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // YouTube Shorts playing states
  const [playingShorts, setPlayingShorts] = useState<Record<string, boolean>>({});

  // Enquiry Modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProductTitle, setSelectedProductTitle] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const [selectedVariantPill, setSelectedVariantPill] = useState<string>('');

  const activeVideo = HERO_VIDEOS[0];

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleVariantSelect = (productId: number, variant: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  const openQuoteModal = (product: ShowcaseProductItem) => {
    setSelectedProductTitle(product.title);
    setSelectedProductId(product.id);
    setSelectedVariantPill(selectedVariants[product.id] || product.variants[0]);
    setEnquiryModalOpen(true);
  };

  // Testimonial auto-carousel
  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % PURECHANDAN_TESTIMONIALS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isCarouselHovered]);

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev === 0 ? PURECHANDAN_TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % PURECHANDAN_TESTIMONIALS.length);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#010F34]">

      {/* ========================================================================= */}
      {/* 1. HERO — YOUTUBE VIDEO (First section, directly below the navbar)         */}
      {/* ========================================================================= */}
      <section className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-12 md:pb-16 bg-[#FDFBF7] border-b border-[#EBE0CA]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Main Featured Video Player (Façade Pattern for Maximum Performance) */}
          <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-200/80 group">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center select-none"
              >
                {/* Lightweight Background Thumbnail */}
                <img
                  src={activeVideo.thumbnail}
                  alt={activeVideo.title}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out brightness-90"
                />

                {/* Dark Vignette Overlay for Crisp Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 group-hover:bg-black/40 transition-colors" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
                  <span className="bg-[#0B3C84] text-white font-cinzel text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {activeVideo.badge}
                  </span>
                  <span className="bg-black/60 text-white/90 backdrop-blur-md text-[11px] font-mono px-2.5 py-0.5 rounded-full">
                    {activeVideo.duration}
                  </span>
                </div>

                {/* Clean Centered Luxury Play Button Overlay */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-[#0B3C84] group-hover:bg-[#0B3C84] group-hover:text-white flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </div>
                  <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-semibold text-white drop-shadow-md hidden sm:block">
                    Click to Play Demonstration
                  </span>
                </div>

                {/* Bottom Video Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-left">
                  <h3 className="font-serif text-lg sm:text-2xl text-white font-normal drop-shadow-md line-clamp-1">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-200 font-sans line-clamp-1 mt-0.5">
                    {activeVideo.subtitle}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORIES (Second section)                                             */}
      {/* Replicate reference style: Centered serif heading, 4 off-white cards        */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 md:py-24 border-b border-[#EBE0CA]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Centered Serif Heading & Muted Subheading */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84] tracking-wide">
              Explore a Selection of the Atelier&apos;s Creations
            </h2>
            <p className="text-sm text-neutral-600 font-sans tracking-wide">
              Rare, fragrant, certified Mysore Sandalwood handcrafted in Jaipur, India
            </p>
          </div>

          {/* 4 Category Cards Grid: 4-col desktop, 2-col tablet, 1-col mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.id}
                href={cat.link}
                className="group flex flex-col cursor-pointer select-none"
              >
                {/* Soft Off-White / Cream Card Container with Centered Product Image */}
                <div className="w-full aspect-[4/5] bg-[#F6F5F2] overflow-hidden relative mb-4 rounded-xl border border-neutral-200/60 flex items-center justify-center p-6 shadow-xs group-hover:shadow-md transition-shadow">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-contain object-center group-hover:scale-106 transition-transform duration-700 ease-out select-none"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/3 transition-colors pointer-events-none" />
                </div>

                {/* Typography Below Card: Blue Serif Title & Underline Link */}
                <div className="space-y-1.5 text-center px-1">
                  <h3 className="font-serif text-lg sm:text-xl text-[#0B3C84] font-normal tracking-wide group-hover:opacity-80 transition-opacity leading-snug">
                    {cat.title}
                  </h3>
                  <div className="pt-0.5">
                    <span className="text-xs font-sans text-neutral-700 group-hover:text-[#0B3C84] animated-underline inline-block font-medium">
                      Discover the Collection
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PRODUCTS (Third section)                                                */}
      {/* Product cards with: image, Video badge, title, star rating, price range,   */}
      {/* selectable variant pills, and "Select options" button                      */}
      {/* ========================================================================= */}
      <section className="bg-[#FDFBF7] py-16 md:py-24 border-b border-[#EBE0CA]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EBE0CA]/80 pb-6">
            <div className="space-y-2 max-w-2xl">
              <span className="font-cinzel text-xs uppercase tracking-[0.25em] font-bold text-[#B3873E] block">
                Master Handicrafts
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84]">
                Featured Sandalwood Catalog
              </h2>
              <p className="text-sm text-neutral-600 font-sans">
                Each piece preserves the pure, soothing botanical essential oils of genuine Mysuru Chandan.
              </p>
            </div>

            <div>
              <Link
                href="/products"
                className="text-xs font-cinzel font-bold text-[#0B3C84] animated-underline uppercase tracking-wider inline-flex items-center gap-1.5 py-1"
              >
                Browse All 50+ Artifacts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 4 Cards per row on Desktop, 2 on Tablet, 1 on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {SHOWCASE_PRODUCTS.map((prod) => {
              const isWishlisted = !!wishlist[prod.id];
              const selectedVariant = selectedVariants[prod.id] || prod.variants[0];
              const isSoldOut = prod.badge === 'SOLD OUT';

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden flex flex-col justify-between group shadow-xs hover:shadow-md transition-all select-none"
                >
                  {/* Card Header / Image Container */}
                  <div className="relative w-full aspect-[4/5] bg-[#F6F5F2] overflow-hidden flex items-center justify-center p-4">
                    <Link
                      href={`/products/${prod.category_slug}/${prod.slug}`}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className={`w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none ${
                          isSoldOut ? 'opacity-70 grayscale-[20%]' : ''
                        }`}
                      />
                    </Link>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                      {prod.badge === 'BEST' && (
                        <span className="bg-[#0B3C84] text-white font-cinzel text-[9px] font-bold px-2.5 py-0.5 tracking-wider uppercase shadow-sm rounded-xs">
                          BEST
                        </span>
                      )}
                      {prod.badge === 'SOLD OUT' && (
                        <span className="bg-neutral-800 text-white font-cinzel text-[9px] font-bold px-2.5 py-0.5 tracking-wider uppercase shadow-sm rounded-xs">
                          SOLD OUT
                        </span>
                      )}
                      {prod.hasVideo && (
                        <span className="inline-flex items-center gap-1 bg-white/95 text-[#0B3C84] font-sans text-[10px] font-medium px-2 py-0.5 shadow-sm rounded-xs">
                          <Play className="w-2.5 h-2.5 fill-[#0B3C84]" /> Detailed Video Inside
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(prod.id, e)}
                      aria-label="Add to wishlist"
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-neutral-700 hover:text-black transition-colors z-10 shadow-xs"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-cinzel text-[#B3873E] font-semibold uppercase tracking-wider block">
                        {prod.category_name}
                      </span>

                      <Link href={`/products/${prod.category_slug}/${prod.slug}`}>
                        <h3 className="font-serif text-[#0B3C84] text-base sm:text-lg hover:opacity-80 transition-opacity line-clamp-2 font-normal leading-snug">
                          {prod.title}
                        </h3>
                      </Link>

                      {/* Star Rating & Review Count */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <div className="flex items-center text-amber-500">
                          {[...Array(prod.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                          ))}
                        </div>
                        <span className="text-[11px] font-sans text-neutral-500">
                          ({prod.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Price Range */}
                      <div className="pt-1.5">
                        <span className="font-sans font-semibold text-[#0B3C84] text-base">
                          {prod.priceRange}
                        </span>
                      </div>
                    </div>

                    {/* Selectable Size/Weight Variant Pills */}
                    <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                      <span className="text-[10px] uppercase font-cinzel text-neutral-500 font-semibold tracking-wider block">
                        Available Variants
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {prod.variants.map((variant) => {
                          const isSelected = selectedVariant === variant;
                          return (
                            <button
                              key={variant}
                              type="button"
                              onClick={(e) => handleVariantSelect(prod.id, variant, e)}
                              className={`px-2.5 py-1 text-[11px] font-sans font-medium transition-all rounded cursor-pointer ${
                                isSelected
                                  ? 'bg-[#0B3C84] text-white border border-[#0B3C84] shadow-xs'
                                  : 'bg-[#F6F5F2] text-neutral-700 border border-neutral-200/80 hover:border-neutral-400'
                              }`}
                            >
                              {variant}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Select Options Action Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => openQuoteModal(prod)}
                        className={`w-full font-cinzel font-bold text-xs uppercase tracking-wider py-2.5 px-4 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs rounded-lg ${
                          isSoldOut
                            ? 'bg-neutral-100 text-neutral-600 border border-neutral-300 hover:bg-neutral-200'
                            : 'bg-[#0B3C84] hover:bg-[#082C62] text-white'
                        }`}
                      >
                        {isSoldOut ? 'Request Restock Quote' : 'Select options'} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CUSTOMER TESTIMONIAL (WhatsApp Screenshots Carousel from purechandan.com) */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 md:py-24 border-b border-[#EBE0CA]/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84]">
              Customer Testimonial
            </h2>
          </div>

          {/* Testimonial Images Carousel */}
          <div
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
            className="relative"
          >
            {/* Sliding Track */}
            <div className="overflow-hidden py-4">
              <div
                className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
                style={{
                  transform: `translateX(-${carouselIndex * (100 / (typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 3 : 4))}%)`,
                }}
              >
                {PURECHANDAN_TESTIMONIALS.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxImg(imgUrl)}
                    className="shrink-0 w-1/2 sm:w-1/3 lg:w-1/4 cursor-pointer group"
                  >
                    <div className="relative aspect-[9/16] max-h-[420px] bg-[#F6F5F2] rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm group-hover:shadow-lg group-hover:border-[#0B3C84]/40 transition-all flex items-center justify-center p-2">
                      <img
                        src={imgUrl}
                        alt={`Customer Testimonial ${idx + 1}`}
                        className="w-full h-full object-contain rounded-xl select-none group-hover:scale-103 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-[#0B3C84] shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="absolute top-1/2 -translate-y-1/2 left-0 -ml-2 sm:-ml-4 w-11 h-11 rounded-full bg-white text-[#0B3C84] shadow-lg border border-neutral-200 flex items-center justify-center hover:bg-[#0B3C84] hover:text-white transition-all cursor-pointer z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="absolute top-1/2 -translate-y-1/2 right-0 -mr-2 sm:-mr-4 w-11 h-11 rounded-full bg-white text-[#0B3C84] shadow-lg border border-neutral-200 flex items-center justify-center hover:bg-[#0B3C84] hover:text-white transition-all cursor-pointer z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dot indicators */}
            <div className="flex justify-center items-center gap-1.5 pt-6">
              {PURECHANDAN_TESTIMONIALS.slice(0, 10).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCarouselIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    carouselIndex % 10 === idx
                      ? 'w-7 bg-[#0B3C84]'
                      : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Chat With Amit Button (Exact WhatsApp button from purechandan.com) */}
          <div className="pt-8 flex justify-center">
            <a
              href="https://api.whatsapp.com/send/?phone=919971918546&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 select-none"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
              <span>Chat With Amit</span>
            </a>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. YOUTUBE SHORTS (Exact section from purechandan.com)                    */}
      {/* ========================================================================= */}
      <section className="bg-[#FDFBF7] py-16 md:py-24 border-b border-[#EBE0CA]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84]">
              YouTube Shorts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PURECHANDAN_SHORTS.map((s) => {
              const isPlayingShort = playingShorts[s.id];

              return (
                <div
                  key={s.id}
                  className="bg-neutral-900 rounded-2xl overflow-hidden aspect-[9/16] shadow-md border border-neutral-200/60 relative group"
                >
                  {isPlayingShort || !s.thumbnail ? (
                    <iframe
                      src={`${s.embedUrl}?autoplay=1&rel=0`}
                      title={s.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      onClick={() => setPlayingShorts((prev) => ({ ...prev, [s.id]: true }))}
                      className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center select-none"
                    >
                      <img
                        src={s.thumbnail}
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                      {/* YouTube Play Icon Overlay */}
                      <div className="relative z-10 w-16 h-12 bg-red-600 group-hover:bg-red-700 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all transform group-hover:scale-110">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <p className="text-xs font-sans text-white font-medium drop-shadow-md line-clamp-2">
                          {s.title}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOLLOW US & DESCRIPTION (Exact layout & links from purechandan.com)     */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 md:py-20 border-b border-[#EBE0CA]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84]">
            Follow Us
          </h2>

          <div className="space-y-3 max-w-2xl mx-auto text-neutral-600 font-sans text-sm sm:text-base leading-relaxed">
            <p>
              PureChandan.com offers 100% pure and premium-quality sandalwood, carefully sourced for authenticity and freshness, perfect for religious rituals, meditation, or personal care, designed to enhance your experience and delivered with complete trust.
            </p>
            <p className="font-medium text-neutral-800 pt-1">
              2199, Gali Hinga Beg, Tilak Bazar, Khari Baoli, Chandni Chowk, Delhi-110006
            </p>
          </div>

          {/* Social Icons matching purechandan.com */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {/* X / Twitter */}
            <a
              href="https://x.com/AmitGoyal837495?t=NfcmJZVQe54AfAr9tV-YKQ&s=09"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X"
              className="w-10 h-10 rounded-full bg-[#F6F5F2] hover:bg-[#0B3C84] text-neutral-700 hover:text-white border border-neutral-200/80 flex items-center justify-center transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61568239840771"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="w-10 h-10 rounded-full bg-[#F6F5F2] hover:bg-[#1877F2] text-neutral-700 hover:text-white border border-neutral-200/80 flex items-center justify-center transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 32 32">
                <path d="M 19.253906 2 C 15.311906 2 13 4.0821719 13 8.8261719 L 13 13 L 8 13 L 8 18 L 13 18 L 13 30 L 18 30 L 18 18 L 22 18 L 23 13 L 18 13 L 18 9.671875 C 18 7.884875 18.582766 7 20.259766 7 L 23 7 L 23 2.2050781 C 22.526 2.1410781 21.144906 2 19.253906 2 z"/>
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href="https://pin.it/7mt2Ks9S4"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Pinterest"
              className="w-10 h-10 rounded-full bg-[#F6F5F2] hover:bg-[#E60023] text-neutral-700 hover:text-white border border-neutral-200/80 flex items-center justify-center transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                <path d="M 7.5 1 C 3.910156 1 1 3.910156 1 7.5 C 1 10.253906 2.714844 12.605469 5.132813 13.554688 C 5.074219 13.039063 5.023438 12.25 5.152344 11.6875 C 5.273438 11.183594 5.914063 8.457031 5.914063 8.457031 C 5.914063 8.457031 5.722656 8.066406 5.722656 7.492188 C 5.722656 6.589844 6.246094 5.914063 6.898438 5.914063 C 7.453125 5.914063 7.71875 6.332031 7.71875 6.828125 C 7.71875 7.386719 7.363281 8.222656 7.183594 8.992188 C 7.027344 9.640625 7.507813 10.167969 8.144531 10.167969 C 9.300781 10.167969 10.1875 8.949219 10.1875 7.191406 C 10.1875 5.636719 9.070313 4.546875 7.472656 4.546875 C 5.625 4.546875 4.539063 5.933594 4.539063 7.367188 C 4.539063 7.925781 4.753906 8.527344 5.023438 8.851563 C 5.074219 8.917969 5.082031 8.972656 5.066406 9.039063 C 5.019531 9.242188 4.90625 9.6875 4.886719 9.777344 C 4.859375 9.894531 4.792969 9.921875 4.667969 9.863281 C 3.855469 9.484375 3.347656 8.296875 3.347656 7.34375 C 3.347656 5.292969 4.839844 3.410156 7.644531 3.410156 C 9.898438 3.410156 11.652344 5.015625 11.652344 7.164063 C 11.652344 9.402344 10.238281 11.207031 8.277344 11.207031 C 7.617188 11.207031 7 10.863281 6.789063 10.460938 C 6.789063 10.460938 6.460938 11.703125 6.382813 12.007813 C 6.234375 12.570313 5.839844 13.277344 5.574219 13.710938 C 6.183594 13.898438 6.828125 14 7.5 14 C 11.089844 14 14 11.089844 14 7.5 C 14 3.910156 11.089844 1 7.5 1 Z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/pure_chandan/profilecard/?igsh=MWo5N3VqMXlhdnFqYw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="w-10 h-10 rounded-full bg-[#F6F5F2] hover:bg-[#E4405F] text-neutral-700 hover:text-white border border-neutral-200/80 flex items-center justify-center transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 48 48">
                <path d="M 16.5 5 C 10.16639 5 5 10.16639 5 16.5 L 5 31.5 C 5 37.832757 10.166209 43 16.5 43 L 31.5 43 C 37.832938 43 43 37.832938 43 31.5 L 43 16.5 C 43 10.166209 37.832757 5 31.5 5 L 16.5 5 z M 16.5 8 L 31.5 8 C 36.211243 8 40 11.787791 40 16.5 L 40 31.5 C 40 36.211062 36.211062 40 31.5 40 L 16.5 40 C 11.787791 40 8 36.211243 8 31.5 L 8 16.5 C 8 11.78761 11.78761 8 16.5 8 z M 34 12 C 32.895 12 32 12.895 32 14 C 32 15.105 32.895 16 34 16 C 35.105 16 36 15.105 36 14 C 36 12.895 35.105 12 34 12 z M 24 14 C 18.495178 14 14 18.495178 14 24 C 14 29.504822 18.495178 34 24 34 C 29.504822 34 34 29.504822 34 24 C 34 18.495178 29.504822 14 24 14 z M 24 17 C 27.883178 17 31 20.116822 31 24 C 31 27.883178 27.883178 31 24 31 C 20.116822 31 17 27.883178 17 24 C 17 20.116822 20.116822 17 24 17 z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@purechandandotcom?si=_-egO8NbA533pVSk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on YouTube"
              className="w-10 h-10 rounded-full bg-[#F6F5F2] hover:bg-[#FF0000] text-neutral-700 hover:text-white border border-neutral-200/80 flex items-center justify-center transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,14.598V9.402c0-0.385,0.417-0.625,0.75-0.433l4.5,2.598c0.333,0.192,0.333,0.674,0,0.866l-4.5,2.598 C10.417,15.224,10,14.983,10,14.598z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://api.whatsapp.com/send/?phone=919971918546&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on WhatsApp"
              className="w-10 h-10 rounded-full bg-[#F6F5F2] hover:bg-[#25D366] text-neutral-700 hover:text-white border border-neutral-200/80 flex items-center justify-center transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M 12.011719 2 C 6.5057187 2 2.0234844 6.478375 2.0214844 11.984375 C 2.0204844 13.744375 2.4814687 15.462563 3.3554688 16.976562 L 2 22 L 7.2324219 20.763672 C 8.6914219 21.559672 10.333859 21.977516 12.005859 21.978516 L 12.009766 21.978516 C 17.514766 21.978516 21.995047 17.499141 21.998047 11.994141 C 22.000047 9.3251406 20.962172 6.8157344 19.076172 4.9277344 C 17.190172 3.0407344 14.683719 2.001 12.011719 2 z M 12.009766 4 C 14.145766 4.001 16.153109 4.8337969 17.662109 6.3417969 C 19.171109 7.8517969 20.000047 9.8581875 19.998047 11.992188 C 19.996047 16.396187 16.413812 19.978516 12.007812 19.978516 C 10.674812 19.977516 9.3544062 19.642812 8.1914062 19.007812 L 7.5175781 18.640625 L 6.7734375 18.816406 L 4.8046875 19.28125 L 5.2851562 17.496094 L 5.5019531 16.695312 L 5.0878906 15.976562 C 4.3898906 14.768562 4.0204844 13.387375 4.0214844 11.984375 C 4.0234844 7.582375 7.6067656 4 12.009766 4 z M 8.4765625 7.375 C 8.3095625 7.375 8.0395469 7.4375 7.8105469 7.6875 C 7.5815469 7.9365 6.9355469 8.5395781 6.9355469 9.7675781 C 6.9355469 10.995578 7.8300781 12.182609 7.9550781 12.349609 C 8.0790781 12.515609 9.68175 15.115234 12.21875 16.115234 C 14.32675 16.946234 14.754891 16.782234 15.212891 16.740234 C 15.670891 16.699234 16.690438 16.137687 16.898438 15.554688 C 17.106437 14.971687 17.106922 14.470187 17.044922 14.367188 C 16.982922 14.263188 16.816406 14.201172 16.566406 14.076172 C 16.317406 13.951172 15.090328 13.348625 14.861328 13.265625 C 14.632328 13.182625 14.464828 13.140625 14.298828 13.390625 C 14.132828 13.640625 13.655766 14.201187 13.509766 14.367188 C 13.363766 14.534188 13.21875 14.556641 12.96875 14.431641 C 12.71875 14.305641 11.914938 14.041406 10.960938 13.191406 C 10.218937 12.530406 9.7182656 11.714844 9.5722656 11.464844 C 9.4272656 11.215844 9.5585938 11.079078 9.6835938 10.955078 C 9.7955938 10.843078 9.9316406 10.663578 10.056641 10.517578 C 10.180641 10.371578 10.223641 10.267562 10.306641 10.101562 C 10.389641 9.9355625 10.347156 9.7890625 10.285156 9.6640625 C 10.223156 9.5390625 9.737625 8.3065 9.515625 7.8125 C 9.328625 7.3975 9.131125 7.3878594 8.953125 7.3808594 C 8.808125 7.3748594 8.6425625 7.375 8.4765625 7.375 z"/>
              </svg>
            </a>
          </div>

        </div>
      </section>

      {/* Lightbox for WhatsApp Testimonial Screenshots */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors cursor-pointer z-10"
            aria-label="Close image preview"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl"
          >
            <img
              src={lightboxImg}
              alt="Testimonial Full View"
              className="w-full h-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        productTitle={selectedProductTitle}
        productId={selectedProductId}
        selectedSize={selectedVariantPill}
      />

    </div>
  );
}
