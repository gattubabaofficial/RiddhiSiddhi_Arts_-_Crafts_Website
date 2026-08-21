'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Product, Category, HeroBanner, Review, Reel, Collaboration } from '@/types';
import { ArrowRight, Star, Send, ShieldCheck, MapPin, Play, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import EnquiryModal from '@/components/products/EnquiryModal';

export default function HomePage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
        setBanners(bRes);
        setFeaturedProducts(pRes);
        setCategories(cRes);
        setReviews(rRes);
        setReels(relRes);
        setCollabs(colRes);
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
      <section className="relative bg-sandalwood-950 text-sandalwood-50 overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
        {banners.length > 0 ? (
          banners.map((b, idx) => (
            <div
              key={b.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeBannerIdx ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center brightness-40 transform scale-105"
                style={{ backgroundImage: `url(${b.image_url})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-sandalwood-950 via-sandalwood-950/80 to-transparent" />

              <div className="relative max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center pt-16 pb-12">
                <div className="max-w-2xl space-y-6">
                  <span className="inline-flex items-center gap-2 bg-sandalwood-900/90 border border-gold-500/40 text-gold-400 text-xs px-3.5 py-1.5 rounded-full font-semibold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    Authentic Mysuru & Jaipuri Sandalwood
                  </span>
                  <h2 className="font-serif text-4xl md:text-6xl font-bold text-sandalwood-50 leading-tight">
                    {b.heading}
                  </h2>
                  {b.subheading && (
                    <p className="text-sandalwood-200 text-base md:text-lg leading-relaxed font-sans">
                      {b.subheading}
                    </p>
                  )}
                  <div className="pt-2 flex flex-wrap gap-4">
                    <Link
                      href={b.cta_link || '/products'}
                      className="bg-gradient-to-r from-gold-500 to-gold-600 text-sandalwood-950 font-bold px-7 py-3.5 rounded-full hover:brightness-110 shadow-xl transition-all flex items-center gap-2"
                    >
                      {b.cta_label || 'Explore Catalog'} <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openQuoteModal('General Wholesale Requirement', 0)}
                      className="border border-sandalwood-600 bg-sandalwood-900/60 hover:bg-sandalwood-800 text-sandalwood-100 font-semibold px-6 py-3.5 rounded-full transition-all flex items-center gap-2"
                    >
                      <Send className="w-4 h-4 text-gold-400" /> Request Custom Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center space-y-4">
            <h2 className="font-serif text-4xl font-bold text-sandalwood-100">
              Authentic Indian Sandalwood Handicrafts
            </h2>
            <p className="text-sandalwood-300 max-w-xl mx-auto">
              Jaipur’s trusted manufacturer & exporter of Sandalwood Malas, Handcarved Elephants, Rosary Beads & Religious Jewelry.
            </p>
            <Link href="/products" className="inline-flex bg-gold-500 text-sandalwood-950 font-bold px-6 py-3 rounded-full">
              Explore Products
            </Link>
          </div>
        )}
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-gold-600">Product Line</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-sandalwood-900">
              Browse Categories
            </h2>
          </div>
          <Link href="/products" className="text-sm font-bold text-gold-600 hover:text-sandalwood-900 flex items-center gap-1">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products/${c.slug}`}
              className="group bg-white border border-sandalwood-200 rounded-2xl p-4 text-center wood-card-shadow hover:border-gold-500 transition-all transform hover:-translate-y-1"
            >
              <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-sandalwood-100 relative">
                <img
                  src={c.image_url || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80'}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif font-bold text-sandalwood-900 text-base group-hover:text-gold-600 transition-colors">
                {c.name}
              </h3>
              <p className="text-xs text-sandalwood-500 mt-1">
                {c.product_count} items listed
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="bg-sandalwood-100 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-gold-600">Handcrafted Excellence</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-sandalwood-900">
              Featured Handicraft Products
            </h2>
            <p className="text-sm text-sandalwood-700">
              Every item is intricately handcrafted from genuine, fragrant Indian Sandalwood by skilled Jaipuri artisans.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-sandalwood-200 rounded-2xl overflow-hidden wood-card-shadow flex flex-col justify-between hover:border-gold-400 transition-all"
              >
                <Link href={`/products/${p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'all'}/${p.slug}`} className="block">
                  <div className="h-56 bg-sandalwood-50 relative overflow-hidden group">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80'}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-sandalwood-950/80 backdrop-blur-sm text-gold-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      MOQ: {p.moq}
                    </span>
                  </div>
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wider block">
                      {p.category_name}
                    </span>
                    <Link href={`/products/${p.category_name?.toLowerCase().replace(/\s+/g, '-') || 'all'}/${p.slug}`}>
                      <h3 className="font-serif font-bold text-sandalwood-900 text-lg hover:text-gold-600 transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-sandalwood-600 line-clamp-2">
                      {p.short_description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-sandalwood-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-sandalwood-400 block">Wholesale Rate</span>
                      <span className="font-bold text-sandalwood-900 text-base">{p.price || 'Contact for Price'}</span>
                    </div>
                    <button
                      onClick={() => openQuoteModal(p.title, p.id)}
                      className="bg-sandalwood-900 hover:bg-gold-500 hover:text-sandalwood-950 text-sandalwood-100 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Get Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT COMPANY INFO BLOCK */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-600">Company Overview</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-sandalwood-900 leading-tight">
            WELCOME TO Riddhi Siddhi Arts & Crafts
          </h2>
          <p className="text-sandalwood-700 text-base leading-relaxed">
            Headquartered in the cultural capital of Jaipur, Rajasthan, <strong>Riddhi Siddhi Arts & Crafts</strong> (Proprietor: Ghanshyam Agrawal) is a premier manufacturer, exporter, and supplier of authentic Indian Sandalwood handicraft items.
          </p>
          <p className="text-sandalwood-600 text-sm leading-relaxed">
            We specialize in crafting 108 Japa Malas, handcarved royal sandalwood elephants, loose sandalwood beads (4mm to 22mm), designer bracelets, religious wristlets, and Muslim Tashbih prayer beads. Every piece preserves the natural aromatic essence and timeless luxury of pure Mysore sandalwood.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-sandalwood-200 wood-card-shadow">
              <CheckCircle2 className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-sandalwood-900 text-sm">100% Genuine Wood</h4>
                <p className="text-xs text-sandalwood-500">Pure Indian Mysore Sandalwood</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-sandalwood-200 wood-card-shadow">
              <Award className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-sandalwood-900 text-sm">Global Exporter</h4>
                <p className="text-xs text-sandalwood-500">IEC & GST Verified Supplier</p>
              </div>
            </div>
          </div>

          <div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-sandalwood-900 hover:bg-sandalwood-800 text-gold-400 font-bold px-6 py-3 rounded-full text-sm transition-all"
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
          <div className="absolute -bottom-6 -left-6 bg-sandalwood-950 text-sandalwood-50 p-6 rounded-2xl border border-sandalwood-800 shadow-2xl max-w-xs hidden sm:block">
            <span className="font-serif text-3xl font-bold text-gold-400 block">Jaipur Craft</span>
            <p className="text-xs text-sandalwood-300">Master wood carvers preserving centuries of royal Rajasthani heritage.</p>
          </div>
        </div>
      </section>

      {/* 5. REELS & VIDEO SHOWCASE */}
      {reels.length > 0 && (
        <section className="bg-sandalwood-950 text-sandalwood-50 py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-gold-400">Workshop & Craft Videos</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-sandalwood-100">
                  Short Reels & Workshop Demonstrations
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {reels.map((r) => (
                <div key={r.id} className="bg-sandalwood-900 border border-sandalwood-800 rounded-2xl overflow-hidden shadow-xl space-y-3 p-4">
                  <div className="w-full h-64 bg-sandalwood-950 rounded-xl overflow-hidden relative group">
                    <iframe
                      src={r.video_url}
                      title={r.title}
                      className="w-full h-full rounded-xl"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="font-serif font-semibold text-sm text-sandalwood-100 line-clamp-2">
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
            <span className="text-xs uppercase tracking-widest font-bold text-gold-600">Client Feedback</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-sandalwood-900">
              What Our Buyers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-sandalwood-200 rounded-2xl p-6 wood-card-shadow space-y-4">
                <div className="flex items-center gap-1 text-gold-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500" />
                  ))}
                </div>
                <p className="text-sm text-sandalwood-800 italic leading-relaxed">
                  "{rev.text}"
                </p>
                <div className="pt-2 border-t border-sandalwood-100 flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-sandalwood-900">{rev.user_name}</span>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. BRAND COLLABORATIONS & CERTIFICATES */}
      <section className="bg-sandalwood-100 py-12 border-y border-sandalwood-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 text-center">
          <span className="text-xs uppercase tracking-widest font-semibold text-sandalwood-600 block">
            Certifications & Registered Trade Licenses
          </span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="bg-white px-6 py-3 rounded-xl border border-sandalwood-300 font-serif font-bold text-sandalwood-900 text-sm shadow-sm">
              GST Registration: <span className="text-gold-600">08ADOPA9061E1ZK</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-xl border border-sandalwood-300 font-serif font-bold text-sandalwood-900 text-sm shadow-sm">
              IEC Code Certified Exporter
            </div>
            <div className="bg-white px-6 py-3 rounded-xl border border-sandalwood-300 font-serif font-bold text-sandalwood-900 text-sm shadow-sm">
              Trustseal Verified Manufacturer
            </div>
          </div>
        </div>
      </section>

      {/* 8. LOCATION & GOOGLE MAP */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-sandalwood-900 text-sandalwood-100 p-8 rounded-3xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-gold-400">Visit Workshop</span>
            <h3 className="font-serif text-2xl font-bold">Factory & Office Address</h3>
            <p className="text-sm text-sandalwood-300 leading-relaxed">
              Basement, Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India
            </p>
            <div className="space-y-2 text-sm pt-2">
              <p><span className="text-gold-400 font-medium">Proprietor:</span> Ghanshyam Agrawal</p>
              <p><span className="text-gold-400 font-medium">GSTIN:</span> 08ADOPA9061E1ZK</p>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=26.87013,75.77491"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold-500 text-sandalwood-950 font-bold py-3 px-6 rounded-full text-center flex items-center justify-center gap-2 hover:brightness-110 transition-all"
          >
            <MapPin className="w-4 h-4" /> Get Directions on Google Maps
          </a>
        </div>

        <div className="lg:col-span-2 w-full h-[380px] rounded-3xl overflow-hidden border border-sandalwood-300 wood-card-shadow">
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
