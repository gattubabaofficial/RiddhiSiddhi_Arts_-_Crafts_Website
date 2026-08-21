'use client';

import React, { useState } from 'react';
import { X, Upload, Send, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { fetchAPI, uploadFiles } from '@/lib/api';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
  productId?: number;
}

export default function EnquiryModal({ isOpen, onClose, productTitle, productId }: EnquiryModalProps) {
  const [salutation, setSalutation] = useState('Mr.');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(productTitle ? `Hello, I would like to inquire about pricing, MOQ, and customization details for '${productTitle}'.` : '');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
          product_id: productId || null,
          product_title: productTitle || null,
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-sandalwood-900 border border-sandalwood-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative text-sandalwood-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sandalwood-400 hover:text-gold-400 p-1.5 rounded-full hover:bg-sandalwood-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="font-serif text-2xl font-bold text-sandalwood-100">Enquiry Submitted!</h3>
            <p className="text-sm text-sandalwood-300">
              Thank you for contacting Riddhi Siddhi Arts & Crafts. Our Jaipur team will reach out to you shortly via Phone/WhatsApp.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="font-serif text-xl font-bold text-sandalwood-100 mb-1">
              Send Product Enquiry & Quote
            </h3>
            <p className="text-xs text-sandalwood-400 mb-6">
              {productTitle ? `Inquiring for: ${productTitle}` : 'Customization & Bulk Export Requirements'}
            </p>

            {errorMsg && (
              <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-3 rounded-lg mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="flex gap-2">
                <select
                  value={salutation}
                  onChange={(e) => setSalutation(e.target.value)}
                  className="bg-sandalwood-950 border border-sandalwood-700 rounded-lg px-3 py-2 text-sandalwood-100 focus:border-gold-500"
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
                  className="flex-1 bg-sandalwood-950 border border-sandalwood-700 rounded-lg px-4 py-2 text-sandalwood-100 placeholder-sandalwood-500 focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Mobile / WhatsApp *"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="bg-sandalwood-950 border border-sandalwood-700 rounded-lg px-4 py-2 text-sandalwood-100 placeholder-sandalwood-500 focus:border-gold-500"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-sandalwood-950 border border-sandalwood-700 rounded-lg px-4 py-2 text-sandalwood-100 placeholder-sandalwood-500 focus:border-gold-500"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Requirement details, quantity, customization requests..."
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-sandalwood-950 border border-sandalwood-700 rounded-lg p-3 text-sandalwood-100 placeholder-sandalwood-500 focus:border-gold-500"
                />
              </div>

              {/* Reference Image Upload */}
              <div className="border-2 border-dashed border-sandalwood-700 bg-sandalwood-950/50 rounded-xl p-4 text-center cursor-pointer hover:border-gold-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="enquiry-file-upload"
                />
                <label htmlFor="enquiry-file-upload" className="cursor-pointer space-y-1 block">
                  <Upload className="w-6 h-6 text-gold-400 mx-auto" />
                  <span className="text-xs font-medium text-sandalwood-300 block">
                    Upload Reference Photos (Optional)
                  </span>
                  <span className="text-[10px] text-sandalwood-500 block">
                    Attach images for custom carve designs or specs
                  </span>
                </label>
                {files.length > 0 && (
                  <div className="mt-2 text-xs text-gold-400 font-medium">
                    {files.length} file(s) attached
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-sandalwood-950 font-bold py-3 rounded-xl hover:brightness-110 flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {submitting ? 'Sending Request...' : (
                  <>
                    <Send className="w-4 h-4" /> Submit Quote Request
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
