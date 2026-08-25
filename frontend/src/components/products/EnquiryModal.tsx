'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Send, CheckCircle2, PackageCheck, Tag, ShieldCheck, Layers, Sparkles } from 'lucide-react';
import { fetchAPI, uploadFiles, getMediaUrl } from '@/lib/api';
import { Product } from '@/types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  productTitle?: string;
  productId?: number;
  selectedSize?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  product,
  productTitle,
  productId,
  selectedSize,
}: EnquiryModalProps) {
  const activeTitle = product?.title || productTitle || '';
  const activeId = product?.id || productId || undefined;
  const activeImage = product?.images && product.images.length > 0 ? product.images[0] : null;
  const activeSku = product?.specs?.find(s => s.label.toLowerCase().includes('code'))?.value || (activeId ? `SW-B-${activeId}` : null);
  const activePrice = product?.price || null;
  const activeMoq = product?.moq || null;
  const activeCategory = product?.category_name || null;
  const activeOrigin = product?.specs?.find(s => s.label.toLowerCase().includes('origin'))?.value || 'Mysore Indian Sandalwood';

  const [salutation, setSalutation] = useState('Mr.');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Automatically update pre-filled message with comprehensive product parameters
  useEffect(() => {
    if (activeTitle) {
      const detailsList: string[] = [];
      if (activeSku) detailsList.push(`Code: ${activeSku}`);
      if (selectedSize) detailsList.push(`Size: ${selectedSize.toUpperCase()}`);
      if (activePrice) detailsList.push(`Price: ${activePrice}`);
      if (activeMoq) detailsList.push(`MOQ: ${activeMoq}`);

      const detailsStr = detailsList.length > 0 ? ` (${detailsList.join(', ')})` : '';
      setMessage(
        `Hello, I would like to inquire about wholesale pricing, custom engraving, and export dispatch timelines for '${activeTitle}'${detailsStr}.`
      );
    } else {
      setMessage('Hello, I would like to inquire about custom sandalwood handicrafts and wholesale export parameters.');
    }
  }, [activeTitle, activeSku, selectedSize, activePrice, activeMoq, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        uploadedUrls = await uploadFiles(files);
      }

      await fetchAPI('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          title_salutation: salutation,
          name,
          mobile,
          email,
          message,
          images: uploadedUrls,
          product_id: activeId || null,
          product_title: activeTitle ? `${activeTitle}${activeSku ? ` [${activeSku}]` : ''}${selectedSize ? ` - ${selectedSize}` : ''}` : null,
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Failed to submit enquiry. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border border-black/10 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl relative text-[#19110B] max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-black/50 hover:text-black p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-black mx-auto" />
            <h3 className="font-serif text-2xl font-normal text-black">Quote Request Received</h3>
            <p className="text-xs text-black/70 max-w-md mx-auto leading-relaxed">
              Thank you for contacting <strong>Riddhi Siddhi Arts & Crafts</strong>. Our Jaipur concierge team will reach out directly with official pricing and export specifications.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4 space-y-0.5">
              <span className="text-[10px] uppercase tracking-widest text-black/50 font-medium block">
                Jaipur Workshop & Export Concierge
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-black tracking-tight">
                Send Product Enquiry & Quote
              </h3>
            </div>

            {/* Clean Studio Product Details Card */}
            {activeTitle && (
              <div className="bg-[#F7F7F7] border border-black/10 rounded-2xl p-4 mb-5 space-y-3">
                <div className="flex items-start gap-3.5">
                  {activeImage && (
                    <div className="w-16 h-16 bg-white border border-black/10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <img
                        src={getMediaUrl(activeImage)}
                        alt={activeTitle}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {activeSku && (
                        <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 rounded-md uppercase font-normal">
                          {activeSku}
                        </span>
                      )}
                      {activeCategory && (
                        <span className="text-[10px] text-black/60 uppercase tracking-wider font-medium">
                          {activeCategory}
                        </span>
                      )}
                      {selectedSize && (
                        <span className="text-[10px] bg-black/5 text-black border border-black/10 px-2 py-0.5 rounded-md font-medium uppercase">
                          Size: {selectedSize}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-sm font-semibold text-black line-clamp-1">
                      {activeTitle}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-black/80 pt-0.5">
                      {activePrice && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-black/60" />
                          <span className="font-medium text-black">{activePrice}</span>
                        </div>
                      )}
                      {activeMoq && (
                        <div className="flex items-center gap-1">
                          <PackageCheck className="w-3 h-3 text-black/60" />
                          <span className="text-black/70">MOQ: <strong className="text-black">{activeMoq}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Spec Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-black/10 text-[10px] text-black/70">
                  <div className="flex items-center gap-1.5 truncate">
                    <ShieldCheck className="w-3 h-3 text-black/50 shrink-0" />
                    <span className="truncate">{activeOrigin}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3 h-3 text-black/50 shrink-0" />
                    <span className="truncate">High Natural Aroma</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Layers className="w-3 h-3 text-black/50 shrink-0" />
                    <span className="truncate">Silk Polished Finish</span>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="flex gap-2">
                <select
                  value={salutation}
                  onChange={(e) => setSalutation(e.target.value)}
                  className="bg-white border border-black/15 rounded-xl px-3 py-2.5 text-black focus:border-black focus:outline-none cursor-pointer"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                </select>
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-white border border-black/15 rounded-xl px-3.5 py-2.5 text-black placeholder:text-black/35 focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="tel"
                  placeholder="Mobile / WhatsApp *"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="bg-white border border-black/15 rounded-xl px-3.5 py-2.5 text-black placeholder:text-black/35 focus:border-black focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-black/15 rounded-xl px-3.5 py-2.5 text-black placeholder:text-black/35 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-black/50 mb-1">
                  Enquiry Message & Custom Specifications
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Requirement details, quantity, custom engraving..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-black/15 rounded-xl p-3 text-black placeholder:text-black/35 focus:border-black focus:outline-none leading-relaxed text-xs"
                />
              </div>

              {/* Reference Image Upload */}
              <div className="border border-dashed border-black/20 bg-[#FAFAFA] rounded-xl p-3 text-center cursor-pointer hover:border-black/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="enquiry-file-upload"
                />
                <label htmlFor="enquiry-file-upload" className="cursor-pointer space-y-0.5 block">
                  <Upload className="w-4 h-4 text-black/60 mx-auto" />
                  <span className="text-[11px] font-semibold text-black block uppercase tracking-wide">
                    Upload Reference Photos / Drawings (Optional)
                  </span>
                  <span className="text-[10px] text-black/50 block">
                    Attach reference images for custom carving designs or sizing requirements
                  </span>
                </label>
                {files.length > 0 && (
                  <div className="mt-1.5 text-xs text-black font-medium">
                    {files.length} file(s) attached
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black hover:bg-black/85 text-white font-sans font-normal text-xs py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                {submitting ? 'Sending Request...' : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Submit Quote Request
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
