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

export default function HomePage() {
  const [banners, setBanners] = useState<HeroBanner[]>(DEFAULT_BANNERS);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
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
      
      {/* 1. HERO CAROUSEL */}
      <section className="relative bg-brand-navy-950 text-white overflow-hidden min-h-[520px] md:min-h-[620px] flex items-center">
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeBannerIdx ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center brightness-40 transform scale-105"
              style={{ backgroundImage: `url(${getMediaUrl(b.image_url)})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-950 via-brand-navy-950/85 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center pt-28 md:pt-36 pb-16">
              <div className="max-w-2xl space-y-6">
                <span className="inline-flex items-center gap-2 bg-brand-navy-900/90 border border-brand-gold-400/40 text-brand-gold-300 text-xs px-4 py-1.5 rounded-full font-semibold uppercase tracking-[0.15em] font-cinzel shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-brand-gold-400" />
                  Authentic Mysuru & Jaipuri Sandalwood
                </span>
                <h2 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight">
                  {b.heading}
                </h2>
                {b.subheading && (
                  <p className="text-brand-gold-100/80 text-base md:text-lg leading-relaxed font-sans">
                    {b.subheading}
                  </p>
                )}
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href={b.cta_link || '/products'}
                    className="bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-600 text-brand-navy-950 font-bold font-cinzel tracking-wider text-xs uppercase px-7 py-3.5 rounded-full hover:brightness-110 shadow-xl shadow-brand-gold-500/20 transition-all flex items-center gap-2"
                  >
                    {b.cta_label || 'Explore Catalog'} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => openQuoteModal('General Wholesale Requirement', 0)}
                    className="border border-brand-gold-400/40 bg-brand-navy-900/80 hover:bg-brand-navy-800 text-white font-cinzel text-xs uppercase tracking-wider font-semibold px-6 py-3.5 rounded-full transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 text-brand-gold-400" /> Request Custom Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 right-6 md:right-12 z-20 flex items-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeBannerIdx
                    ? 'w-8 bg-brand-gold-400 shadow-md shadow-brand-gold-500/50'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-brand-gold-600">Product Line</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-navy-900">
              Browse Categories
            </h2>
          </div>
          <Link href="/products" className="text-xs font-cinzel font-bold uppercase tracking-wider text-brand-gold-600 hover:text-brand-navy-900 flex items-center gap-1">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products/${c.slug}`}
              className="group bg-white border border-brand-sandalwood-200 rounded-2xl p-4 text-center wood-card-shadow hover:border-brand-gold-500 transition-all transform hover:-translate-y-1"
            >
              <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-brand-sandalwood-100 relative">
                <img
                  src={getMediaUrl(c.image_url) || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80'}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif font-bold text-brand-navy-900 text-base group-hover:text-brand-gold-600 transition-colors">
                {c.name}
              </h3>
              <p className="text-xs text-brand-sandalwood-600 mt-1 font-medium">
                {c.product_count || 0} items listed
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="bg-brand-sandalwood-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-brand-gold-600">Handcrafted Excellence</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-navy-900">
              Featured Handicraft Products
            </h2>
            <p className="text-sm text-brand-navy-900/70">
              Every item is intricately handcrafted from genuine, fragrant Indian Sandalwood by skilled Jaipuri artisans.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => {
              const catSlug = categories.find(c => c.id === p.category_id)?.slug || p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'all';
              return (
                <div
                  key={p.id}
                  className="bg-white border border-brand-sandalwood-200 rounded-2xl overflow-hidden wood-card-shadow flex flex-col justify-between hover:border-brand-gold-400 transition-all"
                >
                  <Link href={`/products/${catSlug}/${p.slug}`} className="block">
                    <div className="h-56 bg-brand-sandalwood-50 relative overflow-hidden group">
                      <img
                        src={getMediaUrl(p.images[0]) || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-brand-navy-950/85 backdrop-blur-sm text-brand-gold-300 font-cinzel text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        MOQ: {p.moq}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="font-cinzel text-[11px] font-bold text-brand-gold-700 uppercase tracking-wider block">
                        {p.category_name}
                      </span>
                      <Link href={`/products/${catSlug}/${p.slug}`}>
                        <h3 className="font-serif font-bold text-brand-navy-900 text-lg hover:text-brand-gold-600 transition-colors line-clamp-1">
                          {p.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-brand-navy-950/70 line-clamp-2">
                        {p.short_description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-brand-sandalwood-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-brand-navy-950/50 block">Wholesale Rate</span>
                        <span className="font-bold text-brand-navy-900 text-base">{p.price || 'Contact for Price'}</span>
                      </div>
                      <button
                        onClick={() => openQuoteModal(p.title, p.id)}
                        className="bg-brand-navy-900 hover:bg-brand-gold-500 hover:text-brand-navy-950 text-white font-cinzel text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1 uppercase tracking-wider"
                      >
                        <Send className="w-3.5 h-3.5" /> Get Quote
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ABOUT COMPANY INFO BLOCK */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-brand-gold-600">Company Overview</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-navy-900 leading-tight">
            WELCOME TO Riddhi Siddhi Arts & Crafts
          </h2>
          <p className="text-brand-navy-950/80 text-base leading-relaxed">
            Headquartered in the cultural capital of Jaipur, Rajasthan, <strong>Riddhi Siddhi Arts & Crafts</strong> (Proprietor: Ghanshyam Agrawal) is a premier manufacturer, exporter, and supplier of authentic Indian Sandalwood handicraft items.
          </p>
          <p className="text-brand-navy-950/70 text-sm leading-relaxed">
            We specialize in crafting 108 Japa Malas, handcarved royal sandalwood elephants, loose sandalwood beads (4mm to 22mm), designer bracelets, religious wristlets, and Muslim Tashbih prayer beads. Every piece preserves the natural aromatic essence and timeless luxury of pure Mysore sandalwood.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-brand-sandalwood-200 wood-card-shadow">
              <CheckCircle2 className="w-5 h-5 text-brand-gold-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-brand-navy-900 text-sm">100% Genuine Wood</h4>
                <p className="text-xs text-brand-navy-950/60">Pure Indian Mysore Sandalwood</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-brand-sandalwood-200 wood-card-shadow">
              <Award className="w-5 h-5 text-brand-gold-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-brand-navy-900 text-sm">Global Exporter</h4>
                <p className="text-xs text-brand-navy-950/60">IEC & GST Verified Supplier</p>
              </div>
            </div>
          </div>

          <div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-brand-gold-300 font-cinzel text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-full transition-all shadow-md"
            >
              Read Full Brand Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="w-full h-[450px] rounded-3xl overflow-hidden wood-card-shadow border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
              alt="Jaipur Sandalwood Artisan"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-brand-navy-950 text-white p-6 rounded-2xl border border-brand-gold-500/30 shadow-2xl max-w-xs hidden sm:block">
            <span className="font-serif text-2xl font-bold text-brand-gold-400 block">Jaipur Craft</span>
            <p className="text-xs text-brand-gold-100/70 mt-1">Master wood carvers preserving centuries of royal Rajasthani heritage.</p>
          </div>
        </div>
      </section>

      {/* 5. REELS & VIDEO SHOWCASE */}
      {reels.length > 0 && (
        <section className="bg-brand-navy-950 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-brand-gold-400">Workshop & Craft Videos</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                  Short Reels & Workshop Demonstrations
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {reels.map((r) => (
                <div key={r.id} className="bg-brand-navy-900 border border-brand-gold-500/20 rounded-2xl overflow-hidden shadow-xl space-y-3 p-4">
                  <div className="w-full h-64 bg-brand-navy-950 rounded-xl overflow-hidden relative group">
                    {r.video_url.includes('youtube.com') || r.video_url.includes('youtu.be') ? (
                      <iframe
                        src={getEmbedUrl(r.video_url)}
                        title={r.title}
                        className="w-full h-full rounded-xl"
                        allowFullScreen
                      />
                    ) : (
                      <video src={getMediaUrl(r.video_url)} controls className="w-full h-full object-cover rounded-xl" />
                    )}
                  </div>
                  <h3 className="font-serif font-semibold text-sm text-white line-clamp-2">
                    {r.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. VERIFIED CUSTOMER REVIEWS */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-brand-gold-600">Client Feedback</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-navy-900">
              What Our Buyers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-brand-sandalwood-200 rounded-2xl p-6 wood-card-shadow space-y-4">
                <div className="flex items-center gap-1 text-brand-gold-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-gold-500" />
                  ))}
                </div>
                <p className="text-sm text-brand-navy-950/80 italic leading-relaxed">
                  &ldquo;{rev.text}&rdquo;
                </p>
                <div className="pt-2 border-t border-brand-sandalwood-100 flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-brand-navy-900">{rev.user_name}</span>
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
