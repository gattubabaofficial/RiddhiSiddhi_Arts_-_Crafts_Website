'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI, getMediaUrl, getEmbedUrl } from '@/lib/api';
import { Product, Category, HeroBanner, Review, Reel, Collaboration } from '@/types';
import { ArrowRight, Star, Send, ShieldCheck, MapPin, Play, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import EnquiryModal from '@/components/products/EnquiryModal';

const DEFAULT_BANNERS: HeroBanner[] = [
  {
    id: 1,
    heading: 'Royal Sandalwood Handicrafts & Heritage Malas',
    subheading: 'Jaipur’s premier manufacturer & exporter of certified pure Mysuru Chandan artifacts, Japa malas, handcarved elephants, and loose beads.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
    cta_label: 'Explore Catalog',
    cta_link: '/products',
    display_order: 1,
    is_active: true,
  },
  {
    id: 2,
    heading: 'Handcarved Sandalwood Elephants & Bespoke Artifacts',
    subheading: 'Masterfully sculpted net-cut jaali elephants, temple deities, and luxury bespoke handicraft pieces crafted by Jaipur master artisans.',
    image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=1600',
    cta_label: 'View Masterpieces',
    cta_link: '/products/handcarved-elephants',
    display_order: 2,
    is_active: true,
  },
  {
    id: 3,
    heading: '108 Beads Pure Sandalwood Japa Malas',
    subheading: 'Naturally fragrant, calibrated 6mm–12mm beads strung for meditation, spiritual practice, and wholesale export with certificate of authenticity.',
    image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1600',
    cta_label: 'Browse Malas',
    cta_link: '/products/sandalwood-japa-mala',
    display_order: 3,
    is_active: true,
  },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Sandalwood Japa Mala', slug: 'sandalwood-japa-mala', description: 'Certified 108 beads pure chandan rosaries for meditation & prayer', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', display_order: 1 },
  { id: 2, name: 'Sandalwood Beads Mala', slug: 'sandalwood-beads-mala', description: 'Handcrafted spiritual necklaces and decorative malas', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600', display_order: 2 },
  { id: 3, name: 'Handcarved Elephants', slug: 'handcarved-elephants', description: 'Intricate Jaali net-cut elephants and heritage figurines', image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=600', display_order: 3 },
  { id: 4, name: 'Loose Sandalwood Beads', slug: 'loose-sandalwood-beads', description: 'Calibrated beads from 6mm to 20mm with natural fragrant oil content', image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600', display_order: 4 },
  { id: 5, name: 'Designer Sandalwood Bracelets', slug: 'designer-sandalwood-bracelets', description: 'Stretchable wrist malas and silver/gold capped luxury jewelry', image_url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=600', display_order: 5 },
  { id: 6, name: 'Muslim Tashbih Misbahah', slug: 'muslim-tashbih-misbahah', description: 'Authentic 33 & 99 beads islamic prayer beads exported globally', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600', display_order: 6 },
];

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, title: 'Authentic 108 Beads Mysore Sandalwood Japa Mala (8mm)', slug: 'authentic-108-beads-mysore-sandalwood-japa-mala-8mm', short_description: 'Certified pure Mysore Sandalwood Japa Mala with natural long-lasting aroma. Perfect for meditation and spiritual practice.', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'], moq: '10 Pieces', is_featured: true, category_id: 1 },
  { id: 2, title: 'Handcarved Sandalwood Undercut Net Jaali Elephant (6 Inch)', slug: 'handcarved-sandalwood-undercut-net-jaali-elephant-6-inch', short_description: 'Masterpiece single-piece undercut carving containing a baby elephant inside. Jaipur royal heritage artifact.', images: ['https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=800'], moq: '2 Pieces', is_featured: true, category_id: 3 },
  { id: 3, title: 'Calibrated Loose Sandalwood Beads (10mm, Grade A)', slug: 'calibrated-loose-sandalwood-beads-10mm-grade-a', short_description: 'Uniform spherical sandalwood beads with high natural essential oil content. Ideal for luxury jewelry crafting.', images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800'], moq: '500 Pieces', is_featured: true, category_id: 4 },
  { id: 4, title: 'Pure Sandalwood Islamic Tashbih 99 Beads (8mm)', slug: 'pure-sandalwood-islamic-tashbih-99-beads-8mm', short_description: 'Handcrafted 99-bead Islamic prayer rosary with traditional imame and dividers, carved from pure fragrant sandalwood.', images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'], moq: '25 Pieces', is_featured: true, category_id: 6 },
];

interface SubCategoryItem {
  name: string;
  slug: string;
  image: string;
  tagline: string;
  specs: string;
}

interface ParentUniverse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  exploreLink: string;
  subcategories: SubCategoryItem[];
}

const PARENT_UNIVERSES: ParentUniverse[] = [
  {
    id: 'malas',
    title: 'Sacred Malas & Rosaries',
    subtitle: 'SPIRITUAL CHANTING & DEVOTIONAL JEWELRY',
    description: 'Certified 108 pure Mysuru Sandalwood Japa malas, hand-strung spiritual necklaces, and authentic Islamic Tashbih prayer beads.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
    exploreLink: '/products/sandalwood-japa-mala',
    subcategories: [
      {
        name: '108 Beads Pure Japa Mala',
        slug: 'sandalwood-japa-mala',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
        tagline: 'Traditional Chanting Rosary (6mm–12mm)',
        specs: 'Certified 100% Mysuru Chandan'
      },
      {
        name: 'Sandalwood Beads Mala',
        slug: 'sandalwood-beads-mala',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
        tagline: 'Decorative & Temple Spiritual Necklaces',
        specs: 'Handcrafted Silk Tassel Finish'
      },
      {
        name: 'Muslim Tashbih Misbahah',
        slug: 'muslim-tashbih-misbahah',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
        tagline: '33 & 99 Beads Islamic Prayer Rosary',
        specs: 'Carved Imame & Custom Dividers'
      },
      {
        name: 'Compact Wrist Malas',
        slug: 'designer-sandalwood-bracelets',
        image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=600',
        tagline: '27 Beads Meditation Wrist Counters',
        specs: 'Elastic & Adjustable Pull Threads'
      }
    ]
  },
  {
    id: 'elephants',
    title: 'Royal Handcarved Sculptures',
    subtitle: 'JAIPUR MASTER ARTISAN HERITAGE',
    description: 'Bespoke single-piece undercut net-jaali elephants, baby-inside-mother carvings, and sacred temple deities.',
    heroImage: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=1600',
    exploreLink: '/products/handcarved-elephants',
    subcategories: [
      {
        name: 'Undercut Net Jaali Elephants',
        slug: 'handcarved-elephants',
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=600',
        tagline: 'Single Piece Baby Inside Masterpiece',
        specs: '2 inch to 12 inch Carvings'
      },
      {
        name: 'Solid Carved Royal Elephants',
        slug: 'handcarved-elephants',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
        tagline: 'Howdah Trunk-Up Royal Figurines',
        specs: 'Antique Wax & Natural Polish'
      },
      {
        name: 'Temple Deities & Idols',
        slug: 'handcarved-elephants',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
        tagline: 'Ganesha, Krishna & Divine Statues',
        specs: 'Sacred Altar Carvings'
      },
      {
        name: 'Heritage Wooden Artifacts',
        slug: 'handcarved-elephants',
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=600',
        tagline: 'Boxes, Incense Stands & Decorative Art',
        specs: 'Bespoke Royal Artifacts'
      }
    ]
  },
  {
    id: 'beads',
    title: 'Loose Sandalwood Beads',
    subtitle: 'CALIBRATED JEWELRY COMPONENT SUPPLY',
    description: 'Precision spherical, cylindrical, and oval fragrant sandalwood beads from 4mm to 22mm for custom rosaries and luxury jewelry.',
    heroImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600',
    exploreLink: '/products/loose-sandalwood-beads',
    subcategories: [
      {
        name: 'Calibrated Round Beads (6mm–20mm)',
        slug: 'loose-sandalwood-beads',
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600',
        tagline: 'High Essential Oil Aroma Content',
        specs: 'Wholesale Packs (500–10,000 pcs)'
      },
      {
        name: 'Semi-Finished Raw Beads',
        slug: 'loose-sandalwood-beads',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
        tagline: 'Natural Unpolished Wood Texture',
        specs: 'For Custom Artisans & Crafters'
      },
      {
        name: 'Cylindrical & Barrel Spacer Beads',
        slug: 'loose-sandalwood-beads',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
        tagline: 'Mala Markers & Guru Bead Sets',
        specs: 'Precision Center-Drilled'
      },
      {
        name: 'Aged Sandalwood Billets & Logs',
        slug: 'loose-sandalwood-beads',
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=600',
        tagline: 'Govt Certified Sourced Mysore Wood',
        specs: '100% Genuine Heartwood'
      }
    ]
  },
  {
    id: 'bracelets',
    title: 'Designer Bracelets & Jewelry',
    subtitle: 'CONTEMPORARY SPIRITUAL LUXURY',
    description: 'Everyday fragrant wrist malas, silver capped statement bracelets, and protective sandalwood amulets.',
    heroImage: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=1600',
    exploreLink: '/products/designer-sandalwood-bracelets',
    subcategories: [
      {
        name: 'Stretchable Wrist Malas',
        slug: 'designer-sandalwood-bracelets',
        image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=600',
        tagline: 'Durable Elastic Fit (8mm & 10mm)',
        specs: 'Unisex Daily Spiritual Wear'
      },
      {
        name: 'Sterling Silver Capped Bracelets',
        slug: 'designer-sandalwood-bracelets',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
        tagline: '925 Silver & Gold Accent Fittings',
        specs: 'Luxury Export Grade'
      },
      {
        name: 'Sacred Wooden Pendants',
        slug: 'designer-sandalwood-bracelets',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
        tagline: 'Om, Gayatri & Protective Symbols',
        specs: 'Hand-Engraved Sandalwood'
      },
      {
        name: 'Luxury Gift Box Sets',
        slug: 'designer-sandalwood-bracelets',
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=600',
        tagline: 'Mala & Bracelet Meditation Sets',
        specs: 'Velvet Presentation Box'
      }
    ]
  }
];

export default function HomePage() {
  const [banners, setBanners] = useState<HeroBanner[]>(DEFAULT_BANNERS);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedUniverseId, setSelectedUniverseId] = useState<string>('all');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProductTitle, setSelectedProductTitle] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [bRes, pRes, cRes, rRes, relRes, colRes] = await Promise.all([
          fetchAPI<HeroBanner[]>('/banners').catch(() => []),
          fetchAPI<Product[]>('/products?featured=true&limit=8').catch(() => []),
          fetchAPI<Category[]>('/categories').catch(() => []),
          fetchAPI<Review[]>('/reviews?status_filter=approved&featured_only=true').catch(() => []),
          fetchAPI<Reel[]>('/reels').catch(() => []),
          fetchAPI<Collaboration[]>('/collaborations').catch(() => []),
        ]);
        if (bRes && bRes.length > 0) setBanners(bRes);
        if (pRes && pRes.length > 0) setFeaturedProducts(pRes);
        if (cRes && cRes.length > 0) setCategories(cRes);
        if (rRes && rRes.length > 0) setReviews(rRes);
        if (relRes && relRes.length > 0) setReels(relRes);
        if (colRes && colRes.length > 0) setCollabs(colRes);
      } catch (err) {
        console.error('Failed loading homepage data:', err);
      }
    }
    loadHomeData();
  }, []);

  // Auto banner carousel
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const openQuoteModal = (title: string, id: number) => {
    setSelectedProductTitle(title);
    setSelectedProductId(id);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. LOUIS VUITTON STYLE LUXURY HERO */}
      <section className="relative w-full h-[88vh] min-h-[560px] max-h-[860px] md:h-[92vh] overflow-hidden flex flex-col justify-end items-center text-center pb-8 sm:pb-12 md:pb-14">
        {/* Background Banners */}
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeBannerIdx ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center brightness-80 transition-transform duration-1000 ease-out transform scale-100"
              style={{ backgroundImage: `url(${getMediaUrl(b.image_url)})` }}
            />
            {/* Top dark gradient for navbar legibility & bottom gradient for title legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />
          </div>
        ))}

        {/* Center-Bottom Hero Content (Matching Louis Vuitton Layout) */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-2.5 sm:space-y-3.5 mb-2 sm:mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Small Category / Heritage Tag */}
          <span className="font-cinzel text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] md:tracking-[0.3em] uppercase text-brand-gold-200/90 block drop-shadow-md">
            HERITAGE COLLECTION 2026
          </span>

          {/* Prominent Editorial Title */}
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-wide leading-tight md:leading-[1.15] drop-shadow-xl max-w-3xl mx-auto">
            {banners[activeBannerIdx]?.heading || 'Royal Sandalwood Malas & Artifacts'}
          </h1>

          {/* Underlined Minimalist Action Links with Reverse White Directional Line */}
          {/* Underlined Minimalist Action Links with Reverse White Directional Line */}
          <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-10 text-white font-sans text-xs sm:text-sm md:text-base tracking-wide">
            <Link
              href={banners[activeBannerIdx]?.cta_link || '/products'}
              className="text-white hover:text-white/90 animated-underline-reverse-white font-medium py-1 drop-shadow-md"
            >
              {banners[activeBannerIdx]?.cta_label || 'Discover the Collection'}
            </Link>
            {banners[activeBannerIdx]?.cta_label?.toLowerCase() !== 'explore latest artifacts' && (
              <Link
                href="/products"
                className="text-white hover:text-white/90 animated-underline-reverse-white font-medium py-1 drop-shadow-md"
              >
                Explore Latest Artifacts
              </Link>
            )}
            {banners[activeBannerIdx]?.cta_label?.toLowerCase() !== 'request custom quote' && (
              <button
                type="button"
                onClick={() => openQuoteModal('General Wholesale Requirement', 0)}
                className="text-white hover:text-white/90 animated-underline-reverse-white font-medium py-1 drop-shadow-md cursor-pointer"
              >
                Request Custom Quote
              </button>
            )}
          </div>
        </div>

        {/* Minimalist Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-8 md:right-12 z-20 flex items-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveBannerIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeBannerIdx
                    ? 'w-7 bg-brand-gold-400 shadow-md shadow-brand-gold-500/50'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. LOUIS VUITTON STYLE "EXPLORE A SELECTION OF THE ATELIER'S CREATIONS" */}
      <section className="bg-white py-16 md:py-24 border-b border-brand-sandalwood-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          {/* Section Heading - Clean Minimalist Royal Blue */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84] tracking-wide">
              Explore a Selection of the Atelier&apos;s Creations
            </h2>
            <p className="text-sm text-neutral-600 font-sans tracking-wide">
              Rare, fragrant, certified Mysore Sandalwood handcrafted in Jaipur, India
            </p>
          </div>

          {/* Luxury Studio Creation Cards Grid - Full Frame Images, No Border, Sharp Corners */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {PARENT_UNIVERSES.map((universe) => (
              <Link
                key={universe.id}
                href={universe.exploreLink}
                className="group flex flex-col cursor-pointer"
              >
                {/* Full Frame Studio Photo Container */}
                <div className="w-full aspect-[3/4] bg-[#F6F5F2] overflow-hidden relative mb-4 rounded-none border-none">
                  <img
                    src={universe.heroImage}
                    alt={universe.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
                </div>

                {/* Typography Below Image */}
                <div className="space-y-1 text-center px-1">
                  <h3 className="font-serif text-base sm:text-lg text-[#0B3C84] font-normal tracking-wide group-hover:opacity-75 transition-opacity leading-snug">
                    {universe.title}
                  </h3>
                  <div className="pt-1">
                    <span className="text-xs font-sans text-neutral-700 group-hover:text-[#0B3C84] animated-underline inline-block">
                      Discover the Collection
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LOUIS VUITTON EDITORIAL UNIVERSE SHOWCASES WITH SUB-CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-28 py-8">
        {PARENT_UNIVERSES.map((universe, uIdx) => (
          <div key={universe.id} className="space-y-10">
            
            {/* Split Editorial Feature Banner (Alternating Left/Right) */}
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center ${uIdx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Editorial Large Visual - Full Bleed, No Border, Sharp Corners */}
              <div className={`lg:col-span-7 ${uIdx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-none border-none shadow-md bg-[#F6F5F2]">
                  <img
                    src={universe.heroImage}
                    alt={universe.title}
                    className="w-full h-full object-cover hover:scale-103 transition-transform duration-1000 ease-out"
                  />
                </div>
              </div>

              {/* Editorial Text Block */}
              <div className={`lg:col-span-5 space-y-4 sm:space-y-6 ${uIdx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84] leading-tight">
                  {universe.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-700 font-sans leading-relaxed">
                  {universe.description}
                </p>
                <div className="pt-2">
                  <Link
                    href={universe.exploreLink}
                    className="text-[#0B3C84] hover:text-[#0B3C84] animated-underline text-sm font-sans tracking-wide inline-flex items-center gap-2 font-medium transition-all"
                  >
                    Explore Entire {universe.title} Collection <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Sub-Category Studio Gallery Row (4 Columns) - Full Bleed, No Borders, Sharp Corners */}
            <div className="space-y-4 pt-4 border-t border-brand-sandalwood-100">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm sm:text-base font-normal text-[#0B3C84]">
                  Subcategories in {universe.title}
                </span>
                <Link
                  href={universe.exploreLink}
                  className="text-xs font-sans text-neutral-600 hover:text-[#0B3C84] animated-underline transition-colors"
                >
                  View All {universe.subcategories.length} Categories
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {universe.subcategories.map((sub, sIdx) => (
                  <Link
                    key={sIdx}
                    href={`/products/${sub.slug}`}
                    className="group flex flex-col cursor-pointer"
                  >
                    {/* Subcategory Studio Card Frame */}
                    <div className="w-full aspect-[4/5] bg-[#F6F5F2] overflow-hidden mb-3 relative rounded-none border-none">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-white/95 text-black font-cinzel text-[8px] sm:text-[9px] font-bold px-2 py-0.5 tracking-wider shadow-sm">
                        {sub.specs}
                      </span>
                    </div>

                    {/* Subcategory Info */}
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm sm:text-base text-[#0B3C84] font-medium group-hover:opacity-75 transition-opacity line-clamp-1">
                        {sub.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-neutral-500 font-sans line-clamp-1">
                        {sub.tagline}
                      </p>
                      <span className="text-[11px] font-sans text-neutral-700 group-hover:text-[#0B3C84] animated-underline inline-block pt-1">
                        Explore
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        ))}
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="bg-white py-16 md:py-24 border-t border-brand-sandalwood-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84]">
              Featured Handicraft Products
            </h2>
            <p className="text-sm text-neutral-600 font-sans">
              Every item is intricately handcrafted from genuine, fragrant Indian Sandalwood by skilled Jaipuri artisans.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((p) => {
              const catSlug = categories.find(c => c.id === p.category_id)?.slug || p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'all';
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-none border-none flex flex-col justify-between group"
                >
                  <Link href={`/products/${catSlug}/${p.slug}`} className="block">
                    <div className="w-full aspect-[4/5] bg-[#F6F5F2] relative overflow-hidden rounded-none border-none">
                      <img
                        src={getMediaUrl(p.images[0]) || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 text-black font-cinzel text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider shadow-sm">
                        MOQ: {p.moq}
                      </span>
                    </div>
                  </Link>

                  <div className="pt-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-sans text-neutral-500 uppercase tracking-wider block">
                        {p.category_name}
                      </span>
                      <Link href={`/products/${catSlug}/${p.slug}`}>
                        <h3 className="font-serif text-[#0B3C84] text-base sm:text-lg hover:opacity-75 transition-opacity line-clamp-1 font-normal">
                          {p.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {p.short_description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-brand-sandalwood-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-neutral-400 block uppercase tracking-wider">Wholesale</span>
                        <span className="font-bold text-[#0B3C84] text-sm sm:text-base">{p.price || 'Contact for Price'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openQuoteModal(p.title, p.id)}
                        className="text-xs font-sans font-medium text-[#0B3C84] hover:text-[#0B3C84] animated-underline uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Get Quote <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ABOUT COMPANY INFO BLOCK */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0B3C84] leading-tight">
            WELCOME TO Riddhi Siddhi Arts & Crafts
          </h2>
          <p className="text-neutral-700 text-base leading-relaxed">
            Headquartered in the cultural capital of Jaipur, Rajasthan, <strong>Riddhi Siddhi Arts & Crafts</strong> (Proprietor: Ghanshyam Agrawal) is a premier manufacturer, exporter, and supplier of authentic Indian Sandalwood handicraft items.
          </p>
          <p className="text-neutral-600 text-sm leading-relaxed">
            We specialize in crafting 108 Japa Malas, handcarved royal sandalwood elephants, loose sandalwood beads (4mm to 22mm), designer bracelets, religious wristlets, and Muslim Tashbih prayer beads. Every piece preserves the natural aromatic essence and timeless luxury of pure Mysore sandalwood.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-brand-sandalwood-200 wood-card-shadow">
              <CheckCircle2 className="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-[#0B3C84] text-sm">100% Genuine Wood</h4>
                <p className="text-xs text-neutral-500">Pure Indian Mysore Sandalwood</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-brand-sandalwood-200 wood-card-shadow">
              <Award className="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-[#0B3C84] text-sm">Global Exporter</h4>
                <p className="text-xs text-neutral-500">IEC & GST Verified Supplier</p>
              </div>
            </div>
          </div>

          <div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-[#0B3C84] hover:bg-[#082C62] text-white font-cinzel text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-full transition-all shadow-md"
            >
              Read Full Brand Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="w-full h-[450px] overflow-hidden rounded-none border-none shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
              alt="Jaipur Sandalwood Artisan"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-[#0B3C84] text-white p-6 rounded-none shadow-2xl max-w-xs hidden sm:block">
            <span className="font-serif text-2xl font-bold text-white block">Jaipur Craft</span>
            <p className="text-xs text-blue-100 mt-1">Master wood carvers preserving centuries of royal Rajasthani heritage.</p>
          </div>
        </div>
      </section>

      {/* 6. REELS & VIDEO SHOWCASE */}
      {reels.length > 0 && (
        <section className="bg-white py-16 border-t border-brand-sandalwood-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84]">
                Short Reels & Workshop Demonstrations
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {reels.map((r) => (
                <div key={r.id} className="bg-[#F6F5F2] overflow-hidden shadow-sm space-y-3 p-4">
                  <div className="w-full h-64 overflow-hidden relative group">
                    {r.video_url.includes('youtube.com') || r.video_url.includes('youtu.be') ? (
                      <iframe
                        src={getEmbedUrl(r.video_url)}
                        title={r.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={getMediaUrl(r.video_url)} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h3 className="font-serif font-semibold text-sm text-[#0B3C84] line-clamp-2">
                    {r.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. VERIFIED CUSTOMER REVIEWS */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 py-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84]">
              What Our Buyers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-[#F6F5F2] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-neutral-700 italic leading-relaxed">
                  &ldquo;{rev.text}&rdquo;
                </p>
                <div className="pt-2 border-t border-brand-sandalwood-200 flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#0B3C84]">{rev.user_name}</span>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. BRAND COLLABORATIONS & CERTIFICATES */}
      <section className="bg-brand-sandalwood-100/60 py-12 border-y border-brand-sandalwood-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 text-center">
          <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-semibold text-brand-navy-900/70 block">
            Certifications & Registered Trade Licenses
          </span>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            <div className="bg-white px-6 py-3 rounded-xl border border-brand-sandalwood-300 font-serif font-bold text-brand-navy-900 text-sm shadow-sm">
              GST Registration: <span className="text-brand-gold-600 font-mono">08ADOPA9061E1ZK</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-xl border border-brand-sandalwood-300 font-serif font-bold text-brand-navy-900 text-sm shadow-sm">
              IEC Code Certified Exporter
            </div>
            <div className="bg-white px-6 py-3 rounded-xl border border-brand-sandalwood-300 font-serif font-bold text-brand-navy-900 text-sm shadow-sm">
              Trustseal Verified Manufacturer
            </div>
          </div>
        </div>
      </section>

      {/* 8. LOCATION & GOOGLE MAP */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-brand-navy-950 text-white p-8 rounded-3xl space-y-6 flex flex-col justify-between border border-brand-gold-500/20 shadow-xl">
          <div className="space-y-4">
            <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-brand-gold-400">Visit Workshop</span>
            <h3 className="font-serif text-2xl font-bold">Factory & Office Address</h3>
            <p className="text-sm text-brand-gold-100/80 leading-relaxed">
              Basement, Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India
            </p>
            <div className="space-y-2 text-sm pt-2">
              <p><span className="text-brand-gold-400 font-medium font-cinzel">Proprietor:</span> Ghanshyam Agrawal</p>
              <p><span className="text-brand-gold-400 font-medium font-cinzel">GSTIN:</span> <span className="font-mono">08ADOPA9061E1ZK</span></p>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=26.87013,75.77491"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-navy-950 font-cinzel font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full text-center flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <MapPin className="w-4 h-4" /> Get Directions on Google Maps
          </a>
        </div>

        <div className="lg:col-span-2 w-full h-[380px] rounded-3xl overflow-hidden border border-brand-sandalwood-300 wood-card-shadow">
          <iframe
            src="https://maps.google.com/maps?q=26.87013,75.77491&z=15&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        productTitle={selectedProductTitle}
        productId={selectedProductId}
      />
    </div>
  );
}
