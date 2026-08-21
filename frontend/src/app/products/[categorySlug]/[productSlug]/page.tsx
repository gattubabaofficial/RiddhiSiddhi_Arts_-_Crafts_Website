'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI, uploadFiles } from '@/lib/api';
import { Product, Review } from '@/types';
import { Send, Star, ChevronRight, CheckCircle, ShieldCheck, Phone, Upload, Image as ImageIcon } from 'lucide-react';
import EnquiryModal from '@/components/products/EnquiryModal';

export default function ProductDetailPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const productSlug = params.productSlug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImg, setSelectedImg] = useState<string>('');
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
        if (prodRes.images && prodRes.images.length > 0) {
          setSelectedImg(prodRes.images[0]);
        }

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
    } catch (err) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sandalwood-600">Loading product detail...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-sandalwood-900">Product Not Found</h2>
        <Link href="/products" className="inline-flex bg-gold-500 text-sandalwood-950 font-bold px-6 py-2 rounded-full">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-sandalwood-500">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-sandalwood-400" />
        <Link href="/products" className="hover:text-gold-600">Our Products</Link>
        <ChevronRight className="w-3 h-3 text-sandalwood-400" />
        <Link href={`/products/${categorySlug}`} className="hover:text-gold-600 capitalize">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3 h-3 text-sandalwood-400" />
        <span className="font-bold text-sandalwood-900 line-clamp-1">{product.title}</span>
      </div>

      {/* Main Product Specs & Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="w-full h-[420px] md:h-[480px] bg-white border border-sandalwood-200 rounded-3xl overflow-hidden wood-card-shadow relative">
            <img
              src={selectedImg || product.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImg === img ? 'border-gold-500 scale-95 shadow-md' : 'border-sandalwood-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & Enquiry CTA */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-gold-600 block mb-1">
              {product.category_name}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-sandalwood-900">
              {product.title}
            </h1>
          </div>

          {/* Price & MOQ Block */}
          <div className="bg-sandalwood-100 border border-sandalwood-300 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-sandalwood-500 block">Wholesale Rate / Price</span>
              <span className="font-serif font-bold text-2xl text-sandalwood-900">
                {product.price || 'Ask for Bulk Quote'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-sandalwood-500 block">Minimum Order (MOQ)</span>
              <span className="font-bold text-sm text-gold-700 bg-white px-3 py-1 rounded-full border border-sandalwood-200">
                {product.moq}
              </span>
            </div>
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-sm text-sandalwood-700 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Specifications Table Matrix */}
          {product.specs && product.specs.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-sm text-sandalwood-900 uppercase tracking-wider">
                Product Specifications
              </h3>
              <div className="border border-sandalwood-200 rounded-2xl overflow-hidden bg-white text-xs">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-sandalwood-50/50' : 'bg-white'}>
                        <td className="py-2.5 px-4 font-semibold text-sandalwood-700 border-r border-sandalwood-100 w-1/3">
                          {spec.label}
                        </td>
                        <td className="py-2.5 px-4 text-sandalwood-900 font-medium">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 text-sandalwood-950 font-bold py-3.5 px-6 rounded-2xl hover:brightness-110 flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Send className="w-4 h-4" /> Request Quote & Customization
            </button>
            <a
              href="tel:+917942625339"
              className="border border-sandalwood-800 bg-sandalwood-950 text-gold-400 font-bold py-3.5 px-6 rounded-2xl hover:bg-sandalwood-900 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Phone className="w-4 h-4" /> Call +91-7942625339
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs text-sandalwood-500 pt-2 border-t border-sandalwood-200">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-gold-600" /> 100% Genuine Sandalwood</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-gold-600" /> Jaipur Artisan Handcrafted</span>
          </div>
        </div>
      </div>

      {/* Full Description Section */}
      {product.long_description && (
        <section className="bg-white border border-sandalwood-200 rounded-3xl p-8 wood-card-shadow space-y-4">
          <h2 className="font-serif text-2xl font-bold text-sandalwood-900">
            Detailed Description & Craftsmanship
          </h2>
          <div className="text-sm text-sandalwood-700 leading-relaxed whitespace-pre-line">
            {product.long_description}
          </div>
        </section>
      )}

      {/* Product Reviews & Visitor Submission Form */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-sandalwood-200 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-sandalwood-900">
              Customer Reviews & Ratings
            </h2>
            <p className="text-xs text-sandalwood-600">
              Verified feedback from buyers of this item.
            </p>
          </div>
        </div>

        {/* Existing Approved Reviews */}
        {reviews.length === 0 ? (
          <p className="text-xs text-sandalwood-500 italic">No approved reviews yet for this product. Be the first to leave a review below!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white border border-sandalwood-200 rounded-2xl p-5 wood-card-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-sandalwood-900">{r.user_name}</span>
                  <div className="flex text-gold-500">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-gold-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-sandalwood-700">{r.text}</p>
                {r.images && r.images.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {r.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-12 h-12 rounded-lg object-cover border border-sandalwood-200" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Submit Review Form */}
        <div className="bg-sandalwood-100 border border-sandalwood-300 rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="font-serif text-xl font-bold text-sandalwood-900">
            Write a Customer Review
          </h3>

          {reviewSuccess ? (
            <div className="bg-emerald-900 text-emerald-100 p-4 rounded-xl text-xs text-center font-medium">
              Thank you! Your review has been submitted for admin approval.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sandalwood-700 font-semibold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-white border border-sandalwood-300 rounded-xl p-2.5 text-sandalwood-900"
                  />
                </div>
                <div>
                  <label className="block text-sandalwood-700 font-semibold mb-1">Your Email (Optional)</label>
                  <input
                    type="email"
                    value={reviewerEmail}
                    onChange={(e) => setReviewerEmail(e.target.value)}
                    className="w-full bg-white border border-sandalwood-300 rounded-xl p-2.5 text-sandalwood-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sandalwood-700 font-semibold mb-1">Rating *</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="bg-white border border-sandalwood-300 rounded-xl p-2.5 text-sandalwood-900 font-bold"
                >
                  <option value={5}>5 Stars - Excellent Quality</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Expectations</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sandalwood-700 font-semibold mb-1">Review Comments *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about the sandalwood aroma, bead finish, or craftsmanship..."
                  className="w-full bg-white border border-sandalwood-300 rounded-xl p-3 text-sandalwood-900"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sandalwood-700 font-semibold mb-1">Attach Product Photo (Optional)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && setReviewFiles(Array.from(e.target.files))}
                  className="bg-white border border-sandalwood-300 rounded-xl p-2 w-full text-sandalwood-800"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="bg-sandalwood-900 hover:bg-gold-500 hover:text-sandalwood-950 text-gold-400 font-bold px-6 py-2.5 rounded-xl transition-colors"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-sandalwood-900">
            Similar Sandalwood Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <div key={p.id} className="bg-white border border-sandalwood-200 rounded-2xl overflow-hidden wood-card-shadow flex flex-col justify-between hover:border-gold-400 transition-all">
                <Link href={`/products/${categorySlug}/${p.slug}`}>
                  <div className="h-48 bg-sandalwood-50 relative overflow-hidden group">
                    <img src={p.images[0] || ''} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </Link>
                <div className="p-4 space-y-2">
                  <h3 className="font-serif font-bold text-sandalwood-900 text-sm line-clamp-1">{p.title}</h3>
                  <span className="font-bold text-sandalwood-900 text-xs block">{p.price || 'Contact for Quote'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        productTitle={product.title}
        productId={product.id}
      />
    </div>
  );
}
