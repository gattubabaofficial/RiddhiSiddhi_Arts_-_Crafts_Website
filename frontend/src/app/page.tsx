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
    heading: 'Authentic Mysore Sandalwood Handicrafts & Malas',
    subheading: 'Jaipur’s leading manufacturer & exporter of certified pure Chandan artifacts, Japa malas, handcarved elephants & beads.',
    image_url: '/static/uploads/banners/hero_banner_1_template_photo_2.jpg',
    cta_label: 'Explore Sandalwood Catalog',
    cta_link: '/products/sandalwood-beads',
    display_order: 1,
    is_active: true,
  },
  {
    id: 2,
    heading: 'Royal Handcrafted Sandalwood Rosaries & Japa Malas',
    subheading: '108 beads natural aromatic malas meticulously hand-strung for meditation, temple rituals, and spiritual chanting.',
    image_url: '/static/uploads/banners/hero_banner_2_template_photo_3.jpg',
    cta_label: 'Browse Rosary Malas',
    cta_link: '/products/sandalwood-rosary',
    display_order: 2,
    is_active: true,
  },
  {
    id: 3,
    heading: 'Exquisite Sandalwood Carved Bracelets & Jewelry',
    subheading: 'Artisanal wrist malas, intricately carved deity charms, and luxury aromatic wooden jewelry crafted in Rajasthan.',
    image_url: '/static/uploads/banners/hero_banner_3_template_photo_4.jpg',
    cta_label: 'View Jewelry Collection',
    cta_link: '/products/crafted-sandalwood-jewelery',
    display_order: 3,
    is_active: true,
  },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Sandalwood Beads', slug: 'sandalwood-beads', description: 'Certified pure Mysore sandalwood loose and rosary beads with natural essential aroma', image_url: '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg', display_order: 1 },
  { id: 2, name: 'Sandalwood Rosary', slug: 'sandalwood-rosary', description: '108 beads and custom prayer malas hand-turned for spiritual chanting and meditation', image_url: '/static/uploads/products/10-mm-sandalwood-tasbih-supplier-in-uae_0_sandalwood-tasbih-500x500.jpg', display_order: 2 },
  { id: 3, name: 'Crafted Sandalwood Jewelery', slug: 'crafted-sandalwood-jewelery', description: 'Intricate carved deity pendants, beads necklaces and artisanal jewelry', image_url: '/static/uploads/products/108-mala-bead-sandalwood-mala-beads-mala-necklace_108-mala-bead-sandalwood-mala-beads-mala-necklace.jpg', display_order: 3 },
  { id: 4, name: 'Sandalwood Beads Semi Finished', slug: 'sandalwood-beads-semi-finished', description: 'Unpolished and semi-finished raw sandalwood beads for craftsmen & global export', image_url: '/static/uploads/products/12-mm-sandalwood-semi-finished-beads_0_sandalwood-semi-finished-500x500.jpg', display_order: 4 },
  { id: 5, name: 'Sandalwood Bracelet', slug: 'sandalwood-bracelet', description: 'Stretchable wrist malas, dhikr bracelets, and luxury designer wooden cuffs', image_url: '/static/uploads/products/15-mm-sandalwood-tiger-beads-bracelet-supplier-in-hong-kong_0_20-mm-sandalwood-semi-finished-beads-500x500.png', display_order: 5 },
  { id: 6, name: 'Whitewood Handicrafts', slug: 'whitewood-handicrafts', description: 'Traditional Rajasthani wood sculptures, decorative pots, jaali elephants and artifacts', image_url: '/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg', display_order: 6 },
];

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, title: '10 mm Indian Sandalwood Mala', slug: '10-mm-indian-sandalwood-mala', short_description: 'Certified pure Mysore Sandalwood Japa Mala with natural long-lasting aroma. Perfect for meditation and spiritual practice.', images: ['/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg'], moq: '10 Pieces', is_featured: true, category_id: 1 },
  { id: 2, title: '10 mm Sandalwood Tasbih Rosary', slug: '10-mm-sandalwood-tasbih-supplier-in-uae', short_description: 'Natural aromatic chandan rosary mala hand-strung by Jaipur artisans with authentic sandalwood fragrance.', images: ['/static/uploads/products/10-mm-sandalwood-tasbih-supplier-in-uae_0_sandalwood-tasbih-500x500.jpg'], moq: '10 Pieces', is_featured: true, category_id: 2 },
  { id: 3, title: '10 mm Sandalwood Hand Chain', slug: '10-mm-sandalwood-hand-chain-in-china', short_description: 'Exquisite sandalwood hand chain and wrist mala with natural smooth finish and soothing essential aroma.', images: ['/static/uploads/products/10-mm-sandalwood-hand-chain-in-china_0_sandalwood-hand-chain-in-china-500x500.png'], moq: '10 Pieces', is_featured: true, category_id: 17 },
  { id: 4, title: 'Elephant Wood Carving Sculpture', slug: 'elephant-carving-statue', short_description: 'Masterfully hand-carved traditional wooden royal elephant created by Jaipur royal handicraft artisans.', images: ['/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg'], moq: '1 Piece', is_featured: true, category_id: 15 },
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
  coverImage: string;
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
    coverImage: '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg',
    heroImage: '/static/uploads/banners/hero_banner_2_template_photo_3.jpg',
    exploreLink: '/products/sandalwood-rosary',
    subcategories: [
      {
        name: '108 Beads Pure Japa Mala',
        slug: 'sandalwood-rosary',
        image: '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg',
        tagline: 'Traditional Chanting Rosary (6mm–12mm)',
        specs: 'Certified 100% Mysuru Chandan'
      },
      {
        name: 'Sandalwood Beads',
        slug: 'sandalwood-beads',
        image: '/static/uploads/products/10-mm-sandalwood-beads-unpolished_0_sandalwood-beads-unpolished-500x500.jpg',
        tagline: 'Decorative & Temple Spiritual Necklaces',
        specs: 'Natural Essential Aroma'
      },
      {
        name: 'Islamic Tasbih Beads',
        slug: 'sandalwood-rosary',
        image: '/static/uploads/products/10-mm-sandalwood-tasbih-supplier-in-uae_0_sandalwood-tasbih-500x500.jpg',
        tagline: '33 & 99 Beads Islamic Prayer Rosary',
        specs: 'Hand-Turned Imame'
      },
      {
        name: 'Religious Sandalwood Jewelry',
        slug: 'religious-sandalwood-jewellery',
        image: '/static/uploads/products/religious-sandalwood-prayer-beads_0_religious-sandalwood-prayer-beads-500x500.jpg',
        tagline: 'Amulets & Mantra Beads',
        specs: 'Jaipur Master Knotting'
      }
    ]
  },
  {
    id: 'elephants',
    title: 'Royal Sculptures & Idols',
    subtitle: 'JAIPUR MASTER ARTISAN HERITAGE',
    description: 'Bespoke single-piece undercut net-jaali elephants, baby-inside-mother carvings, and sacred temple deities.',
    coverImage: '/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg',
    heroImage: '/static/uploads/banners/hero_banner_5_template_photo_6.jpg',
    exploreLink: '/products/sandalwood-religious-god-statues',
    subcategories: [
      {
        name: 'Deity God Statues',
        slug: 'sandalwood-religious-god-statues',
        image: '/static/uploads/products/hindu-god-idol-sandalwood-ganesha_0_hindu-god-idol-sandalwood-ganesha-500x500.jpg',
        tagline: 'Ganesha & Divine Altar Statues',
        specs: 'Solid Pure Sandalwood'
      },
      {
        name: 'Whitewood Handicrafts',
        slug: 'whitewood-handicrafts',
        image: '/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg',
        tagline: 'Undercut Net Jaali Elephants',
        specs: 'Single Piece Carving'
      },
      {
        name: 'Religious Handicrafts',
        slug: 'religious-handicraft-sandalwood',
        image: '/static/uploads/products/aromatic-muslim-bead_Aromatic-Muslim-Bead.jpg',
        tagline: 'Sacred Temple Puja Crafts',
        specs: 'Master Artisanal Finish'
      },
      {
        name: 'Royal Gift Items',
        slug: 'sandalwood-gift-items',
        image: '/static/uploads/products/mysore-sandal-beads-souvenirs-craft-japa-mala_0_mysore-sandal-beads-souvenirs-craft-japa-mala-500x500.jpg',
        tagline: 'Heritage Boxes & Souvenirs',
        specs: 'Luxury Presentation'
      }
    ]
  },
  {
    id: 'beads',
    title: 'Loose Beads & Semi Finished Craft',
    subtitle: 'CALIBRATED JEWELRY COMPONENT SUPPLY',
    description: 'Precision spherical, cylindrical, and oval fragrant sandalwood beads from 4mm to 22mm for custom rosaries and luxury jewelry.',
    coverImage: '/static/uploads/products/12-mm-sandalwood-semi-finished-beads_0_sandalwood-semi-finished-beads-500x500.jpg',
    heroImage: '/static/uploads/banners/hero_banner_4_template_photo_5.jpg',
    exploreLink: '/products/sandalwood-beads-semi-finished',
    subcategories: [
      {
        name: 'Semi Finished Beads',
        slug: 'sandalwood-beads-semi-finished',
        image: '/static/uploads/products/12-mm-sandalwood-semi-finished-beads_0_sandalwood-semi-finished-500x500.jpg',
        tagline: 'Raw Unpolished Beads',
        specs: 'Wholesale Export Packs'
      },
      {
        name: 'Natural Brown Wooden Beads',
        slug: 'natural-brown-wooden-beads',
        image: '/static/uploads/products/brown-beads_Brown-Beads.jpg',
        tagline: 'Rustic Dark & Golden Beads',
        specs: 'Natural Wood Grain'
      },
      {
        name: 'Wooden Beads',
        slug: 'wooden-beads',
        image: '/static/uploads/products/10-mm-sandalwood-beads-unpolished_0_sandalwood-beads-unpolished-500x500.jpg',
        tagline: 'Hardwood & Rosewood Beads',
        specs: 'Precision Center-Drilled'
      },
      {
        name: 'Pure Sandalwood Products',
        slug: 'sandalwood-product',
        image: '/static/uploads/products/pure-sandalwood-prayer-beads_Pure-Sandalwood-Prayer-Beads.jpg',
        tagline: 'Billets, Logs & Wood Craft',
        specs: '100% Pure Santalum Album'
      }
    ]
  },
  {
    id: 'bracelets',
    title: 'Designer Bracelets & Hand Chains',
    subtitle: 'CONTEMPORARY SPIRITUAL LUXURY',
    description: 'Everyday fragrant wrist malas, hand chains, carved charms, and protective sandalwood jewelry.',
    coverImage: '/static/uploads/products/10-mm-sandalwood-hand-chain-in-china_0_sandalwood-hand-chain-in-china-500x500.png',
    heroImage: '/static/uploads/banners/hero_banner_3_template_photo_4.jpg',
    exploreLink: '/products/sandalwood-bracelet',
    subcategories: [
      {
        name: 'Sandalwood Hand Chain',
        slug: 'sandalwood-hand-chain',
        image: '/static/uploads/products/10-mm-sandalwood-hand-chain-in-china_0_sandalwood-hand-chain-in-china-500x500.png',
        tagline: 'Artisanal Wrist Mala Chain',
        specs: 'Unisex Daily Spiritual Wear'
      },
      {
        name: 'Sandalwood Bracelets',
        slug: 'sandalwood-bracelet',
        image: '/static/uploads/products/15-mm-sandalwood-tiger-beads-bracelet-supplier-in-hong-kong_0_20-mm-sandalwood-semi-finished-beads-500x500.png',
        tagline: 'Tiger Sandalwood Wristlet',
        specs: 'Elastic Stretch Fit'
      },
      {
        name: 'Carved Bracelets',
        slug: 'sandalwood-carvings-bracelets',
        image: '/static/uploads/products/10-mm-white-sandalwood-jap-mala-in-hong-kong_0_gemstone-mala-with-sandalwood-beads-500x500.jpg',
        tagline: 'Embossed Motifs & Mantras',
        specs: 'Master Engraved'
      },
      {
        name: 'Crafted Jewelry',
        slug: 'crafted-sandalwood-jewelery',
        image: '/static/uploads/products/108-mala-bead-sandalwood-mala-beads-mala-necklace_108-mala-bead-sandalwood-mala-beads-mala-necklace.jpg',
        tagline: 'Pendants & Statement Pieces',
        specs: 'Jaipur Art Studio'
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
                <div className="w-full aspect-[4/5] bg-[#F6F5F2] overflow-hidden relative mb-4 rounded-none border-none flex items-center justify-center p-3 sm:p-4">
                  <img
                    src={universe.coverImage || universe.heroImage}
                    alt={universe.title}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
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
                    <div className="w-full aspect-[4/5] bg-[#F6F5F2] overflow-hidden mb-3 relative rounded-none border-none flex items-center justify-center p-3 sm:p-4">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-full h-full object-contain object-center group-hover:scale-106 transition-transform duration-700 ease-out select-none"
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
                    <div className="w-full aspect-[4/5] bg-[#F6F5F2] relative overflow-hidden rounded-none border-none flex items-center justify-center p-3 sm:p-4">
                      <img
                        src={getMediaUrl(p.images[0]) || '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg'}
                        alt={p.title}
                        className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
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
