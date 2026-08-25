'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI, uploadFiles, getMediaUrl, getEmbedUrl } from '@/lib/api';
import { Product, Review } from '@/types';
import {
  Star, ChevronRight, Heart, Play, Check
} from 'lucide-react';
import EnquiryModal from '@/components/products/EnquiryModal';

const DEFAULT_SIZES = [
  { label: '6MM - 108 BEADS', value: '6mm' },
  { label: '8MM - 108 BEADS', value: '8mm' },
  { label: '10MM - 108 BEADS', value: '10mm' },
  { label: '12MM - 108 BEADS', value: '12mm' },
  { label: '15MM - 54 BEADS', value: '15mm' },
  { label: '20MM - 27 BEADS', value: '20mm' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const productSlug = params.productSlug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSize, setSelectedSize] = useState('8mm');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('store');
  const [scrolledPast, setScrolledPast] = useState(false);
  const [loading, setLoading] = useState(true);

  // Enquiry Modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewFiles, setReviewFiles] = useState<File[]>([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function loadProductDetail() {
      try {
        const prodRes = await fetchAPI<Product>(`/products/${productSlug}`);
        setProduct(prodRes);

        const [simRes, revRes] = await Promise.all([
          fetchAPI<Product[]>(`/products?category_id=${prodRes.category_id}&limit=4`).catch(() => []),
          fetchAPI<Review[]>(`/reviews?product_id=${prodRes.id}&status_filter=approved`).catch(() => []),
        ]);
        setSimilarProducts(simRes.filter(p => p.id !== prodRes.id));
        setReviews(revRes);
      } catch (err) {
        console.error('Failed loading product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductDetail();
  }, [productSlug]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setScrolledPast(true);
      } else {
        setScrolledPast(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setReviewSubmitting(true);

    try {
      let uploadedUrls: string[] = [];
      if (reviewFiles.length > 0) {
        uploadedUrls = await uploadFiles(reviewFiles);
      }

      await fetchAPI('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          product_id: product.id,
          user_name: reviewerName,
          user_email: reviewerEmail,
          rating: reviewRating,
          text: reviewText,
          images: uploadedUrls,
        }),
      });

      setReviewSuccess(true);
      setReviewerName('');
      setReviewerEmail('');
      setReviewText('');
      setReviewFiles([]);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch {
      alert('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-32 pb-20 text-black font-sans text-sm">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="tracking-widest uppercase text-[11px] font-semibold text-black/60">Loading Presentation...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-36 pb-20 text-center space-y-6">
        <h2 className="font-serif text-3xl font-bold text-black">Product Not Found</h2>
        <p className="text-xs text-black/60 uppercase tracking-widest font-sans">The requested sandalwood artifact could not be located in our catalog.</p>
        <Link href="/products" className="inline-flex bg-black text-white font-sans text-xs uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-black/80 transition-colors">
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Build the list of continuous seamless full-fill images
  const allImages = (product.images && product.images.length > 0)
    ? product.images
    : ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1600&q=90'];

  const continuousMediaList: Array<{ type: 'image' | 'video'; url: string }> = [];

  allImages.forEach((img) => {
    continuousMediaList.push({
      type: 'image',
      url: img,
    });
  });

  if (product.videos && product.videos.length > 0) {
    product.videos.forEach(vid => {
      continuousMediaList.push({
        type: 'video',
        url: vid,
      });
    });
  }

  if (continuousMediaList.length === 1) {
    continuousMediaList.push({
      type: 'image',
      url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1600&q=90',
    });
    continuousMediaList.push({
      type: 'image',
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=90',
    });
  }

  const productCode = product.specs?.find(s => s.label.toLowerCase().includes('code'))?.value || `LP00${product.id}`;

  return (
    <div className="bg-white text-[#19110B] min-h-screen selection:bg-black selection:text-white font-sans antialiased">
      
      {/* 1. STICKY TOP MINI CONCIERGE BAR */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10 py-3.5 px-4 md:px-12 transition-all duration-300 ${
          scrolledPast ? 'translate-y-0 opacity-100 shadow-xs' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-[#F4F4F4] overflow-hidden shrink-0">
              <img
                src={getMediaUrl(allImages[0])}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="font-serif font-bold text-sm text-black block truncate">{product.title}</span>
              <span className="text-xs text-black/70 font-medium">{product.price || '₹190.00'}</span>
            </div>
          </div>

          <button
            onClick={() => setEnquiryModalOpen(true)}
            className="bg-black hover:bg-black/90 text-white font-sans text-xs font-semibold px-6 py-2.5 rounded-full transition-all shrink-0 cursor-pointer"
          >
            Contact Concierge Services
          </button>
        </div>
      </div>

      {/* 2. EXACT CONTINUOUS 50/50 LOUIS VUITTON HERO PRESENTATION */}
      <div className="w-full pt-16 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          
          {/* LEFT HALF: 100% FULL-FIT CONTINUOUS VERTICAL STACK WITH NO GAP BETWEEN PICTURES */}
          <div className="w-full flex flex-col p-0 m-0 bg-[#EFEFEF]">
            {continuousMediaList.map((item, idx) => (
              <div
                key={idx}
                className="w-full h-[75vh] sm:h-[88vh] lg:h-screen p-0 m-0 bg-[#EFEFEF] relative overflow-hidden flex items-center justify-center border-0"
              >
                {item.type === 'video' ? (
                  item.url.includes('youtube.com') || item.url.includes('youtu.be') ? (
                    <iframe
                      src={getEmbedUrl(item.url)}
                      title="Workshop Demonstration"
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={getMediaUrl(item.url)}
                      controls
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover p-0 m-0 border-0"
                    />
                  )
                ) : (
                  <img
                    src={getMediaUrl(item.url)}
                    alt={`${product.title} - View ${idx + 1}`}
                    className="w-full h-full object-cover p-0 m-0 border-0 block select-none"
                  />
                )}
              </div>
            ))}
          </div>

          {/* RIGHT HALF: STICKY BUY BOX WITH EXACT LOUIS VUITTON SPACING */}
          <div className="bg-white flex flex-col justify-start px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-10 lg:py-16 lg:sticky lg:top-20 h-fit">
            <div className="max-w-md w-full mx-auto lg:mx-0 space-y-6">
              
              {/* Product Code & Heart Wishlist */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-black/60 mb-1.5">
                  <span className="font-sans uppercase tracking-widest text-[10px] font-normal text-black/60">
                    {productCode}
                  </span>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-1 text-black hover:opacity-70 transition-opacity cursor-pointer"
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-black'}`} />
                  </button>
                </div>

                {/* Subtitle */}
                <p className="text-[11px] text-black/55 font-sans font-normal mb-1">
                  Icon — Personalisable & refillable
                </p>

                {/* Title */}
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-black tracking-tight leading-snug">
                  {product.title}
                </h1>

                {/* Price */}
                <div className="mt-2.5 space-y-0.5">
                  <div className="text-lg sm:text-xl font-sans font-medium text-black">
                    {product.price || '₹190.00'}
                  </div>
                  <span className="text-[11px] text-black/50 block font-sans">
                    (M.R.P. incl. of all taxes)
                  </span>
                </div>
              </div>

              {/* Sizes Heading & Pills */}
              <div className="space-y-2 pt-0.5">
                <span className="text-[11px] font-semibold text-black block">Sizes</span>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_SIZES.slice(0, 2).map((sz) => (
                    <button
                      key={sz.value}
                      type="button"
                      onClick={() => setSelectedSize(sz.value)}
                      className={`py-2 px-3.5 text-[11px] font-sans font-normal tracking-wide uppercase transition-all cursor-pointer border ${
                        selectedSize === sz.value
                          ? 'border-black bg-white text-black ring-1 ring-black font-medium'
                          : 'border-black/20 bg-white text-black/70 hover:border-black/50 hover:text-black'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Action Pill: Contact Concierge Services (Compact Luxury Width) */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="w-auto inline-flex px-8 h-11 bg-black hover:bg-black/85 text-white font-sans font-normal text-xs rounded-full transition-colors cursor-pointer items-center justify-center shadow-xs"
                >
                  Contact Concierge Services
                </button>

                <p className="text-[11px] text-black/65 font-sans leading-relaxed pt-0.5">
                  Our Digital Concierge is available if you have any question on this product.{' '}
                  <button
                    onClick={() => setEnquiryModalOpen(true)}
                    className="underline font-semibold text-black hover:text-black/80 cursor-pointer"
                  >
                    Contact us.
                  </button>
                </p>
              </div>

              {/* Poetic Narrative + Read More Toggle with Formulation & Origin details */}
              <div className="border-t border-black/10 pt-4 space-y-1.5 text-xs">
                <p className="text-xs text-black/85 leading-relaxed font-sans font-medium">
                  A whisper of fresh Mysore sandalwood speaks of an infinite inner journey.
                </p>
                
                {product.short_description && (
                  <p className="text-xs text-black/70 leading-relaxed">
                    {product.short_description}
                  </p>
                )}

                {/* Expanded Details inside Read More (Clean Simple Text) */}
                {readMore && (
                  <div className="pt-2 space-y-2 text-xs text-black/75 leading-relaxed animate-fadeIn">
                    {product.long_description && (
                      <p>{product.long_description}</p>
                    )}
                    <p>
                      Crafted from pure Indian sandalwood (Mysore heartwood) featuring natural santalol oil essence, calibrated spheres, and a natural silk lustre with long-lasting aroma retention.
                    </p>
                    <p>
                      100% pure and authentic Indian sandalwood (Santalum album), natural cotton-silk thread, and sacred handcarved guru bead. Contains zero artificial scent oils, synthetic waxes, or color additives.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setReadMore(!readMore)}
                  className="text-[11px] font-semibold text-black underline underline-offset-4 hover:text-black/70 transition-colors block pt-0.5 cursor-pointer"
                >
                  {readMore ? 'Read Less' : 'Read More'}
                </button>
              </div>

              {/* Collapsible Accordions (LV Clean Minimalist +/- List) */}
              <div className="border-t border-black/10 divide-y divide-black/10 text-xs">
                
                {/* 1. Find in Store */}
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion('store')}
                    className="w-full flex items-center justify-between font-normal text-black text-[11px] cursor-pointer text-left"
                  >
                    <span>Find in Store</span>
                    <span className="text-sm font-light">{openAccordion === 'store' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'store' && (
                    <div className="pt-2 pb-1 text-xs text-black/75 space-y-1.5 leading-relaxed">
                      <p>
                        <strong>Jaipur Flagship Showroom:</strong> Basement, Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India.
                      </p>
                      <p>
                        Appointments with Master Craftsman <strong>Ghanshyam Agrawal</strong> available upon inquiry.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Delivery & Returns */}
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion('delivery')}
                    className="w-full flex items-center justify-between font-normal text-black text-[11px] cursor-pointer text-left"
                  >
                    <span>Delivery & Returns</span>
                    <ChevronRight className="w-3 h-3 text-black/50" />
                  </button>
                  {openAccordion === 'delivery' && (
                    <div className="pt-2 pb-1 text-xs text-black/75 space-y-1 leading-relaxed">
                      <p>• Dispatched with official Certificate of Authenticity & Mysore Origin Guarantee.</p>
                      <p>• Express international courier dispatch with protective shockproof packaging.</p>
                    </div>
                  )}
                </div>

                {/* 3. Gifting */}
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion('gifting')}
                    className="w-full flex items-center justify-between font-normal text-black text-xs cursor-pointer text-left"
                  >
                    <span className="text-[11px]">Gifting</span>
                    <ChevronRight className="w-3 h-3 text-black/50" />
                  </button>
                  {openAccordion === 'gifting' && (
                    <div className="pt-2 pb-1 text-xs text-black/75 space-y-1 leading-relaxed">
                      <p>
                        Every piece is sealed in aroma-preserving wrapping and accompanied by an artisan certificate, ready for presentation.
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 3. VERIFIED CLIENT REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-16 space-y-10 border-t border-black/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-black/10 pb-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-black/50 block mb-1">Authentic Testimonials</span>
            <h2 className="font-serif text-3xl font-bold text-black">Client Reviews ({reviews.length})</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <span className="text-xs font-bold text-black">4.9 / 5.0 Global Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-[#F9F9F9] p-8 rounded-xl text-center space-y-1">
                <p className="text-xs text-black/60">No reviews submitted yet for this product.</p>
                <p className="text-[11px] text-black/40">Be the first to share your experience with Riddhi Siddhi sandalwood.</p>
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="bg-white border border-black/10 rounded-xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-serif font-bold text-sm text-black block">{r.user_name}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">Verified Buyer</span>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-black/80 leading-relaxed italic">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  {r.images && r.images.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {r.images.map((img, idx) => (
                        <img key={idx} src={getMediaUrl(img)} alt="" className="w-12 h-12 rounded-lg object-cover border border-black/10" />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-5 bg-[#F9F9F9] border border-black/10 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-black">Write a Review</h3>
              <p className="text-[11px] text-black/60">Share your feedback on aroma, finish, and craftsmanship.</p>
            </div>

            {reviewSuccess ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Thank You!
                </div>
                <p className="text-[11px]">Your review has been submitted and will appear after moderation.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-black mb-1">Your Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-black/20'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-white border border-black/15 rounded-lg p-2.5 text-black placeholder-black/30 focus:outline-none focus:border-black"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email *"
                    value={reviewerEmail}
                    onChange={(e) => setReviewerEmail(e.target.value)}
                    className="w-full bg-white border border-black/15 rounded-lg p-2.5 text-black placeholder-black/30 focus:outline-none focus:border-black"
                  />
                </div>

                <textarea
                  rows={3}
                  required
                  placeholder="Your review comments regarding wood quality, beads finish, fragrance..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-white border border-black/15 rounded-lg p-2.5 text-black placeholder-black/30 focus:outline-none focus:border-black leading-relaxed"
                />

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full bg-black hover:bg-black/90 text-white font-sans font-semibold py-2.5 rounded-full transition-colors cursor-pointer text-xs"
                >
                  {reviewSubmitting ? 'Submitting Review...' : 'Submit Client Review'}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* 4. YOU MAY ALSO LIKE */}
      {similarProducts.length > 0 && (
        <section className="border-t border-black/10 bg-[#FAFAFA] py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-black/50 block mb-1">Jaipur Collection</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-black">You May Also Like</h2>
              </div>
              <Link href={`/products/${categorySlug}`} className="text-xs font-semibold text-black underline underline-offset-4 hover:text-black/70">
                View All Category &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${categorySlug}/${p.slug}`}
                  className="group bg-white border border-black/5 rounded-none overflow-hidden hover:border-black/30 transition-all flex flex-col justify-between"
                >
                  <div className="h-64 bg-[#F6F6F6] overflow-hidden relative flex items-center justify-center p-6">
                    <img
                      src={getMediaUrl(p.images[0]) || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80'}
                      alt={p.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-mono text-black/50 uppercase tracking-widest block">
                      {p.specs?.find(s => s.label.toLowerCase().includes('code'))?.value || `SW-${p.id}`}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-black group-hover:underline line-clamp-1">
                      {p.title}
                    </h3>
                    <span className="text-xs font-semibold text-black block pt-1">{p.price || 'Contact for Price'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry Modal with Full Product Details */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        product={product}
        selectedSize={selectedSize}
      />

    </div>
  );
}
