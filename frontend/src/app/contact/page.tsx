'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin, Send, Upload, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { fetchAPI, uploadFiles } from '@/lib/api';

export default function ContactPage() {
  const [salutation, setSalutation] = useState('Mr.');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
        }),
      });

      setSuccess(true);
      setName('');
      setMobile('');
      setEmail('');
      setMessage('');
      setFiles([]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please call us at +91-7942625339.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-36 lg:pt-40 pb-24 space-y-12 sm:space-y-16">
      
      {/* Editorial Header */}
      <section className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-cinzel text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#B3873E] block">
          Jaipur Factory & Export Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84] tracking-tight leading-tight">
          Contact & Wholesale Enquiry
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base font-sans leading-relaxed">
          Connect directly with Ghanshyam Agrawal and our artisan sales team for wholesale mala rates, custom elephant sculptures, export documentation, or sample requests.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
        
        {/* Left Column: Direct Contact & Factory Info */}
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-serif font-normal text-xl text-[#0B3C84]">Direct Contact</h3>
            <div className="space-y-4 text-sm font-sans">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F6F5F2] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-[#B3873E]" />
                </div>
                <div>
                  <span className="font-cinzel text-[10px] text-[#0B3C84] font-bold block uppercase tracking-wider">Direct Phone & WhatsApp</span>
                  <a href="tel:+917942625339" className="text-neutral-900 font-bold text-sm hover:text-[#0B3C84] transition-colors block mt-0.5">
                    +91-7942625339
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F6F5F2] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#B3873E]" />
                </div>
                <div>
                  <span className="font-cinzel text-[10px] text-[#0B3C84] font-bold block uppercase tracking-wider">Jaipur Atelier Address</span>
                  <p className="text-neutral-600 text-xs leading-relaxed mt-0.5">
                    Basement, Plot 115, Mohan Nagar, Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F6F5F2] border border-neutral-200/80 rounded-2xl p-6 space-y-3">
            <h4 className="font-cinzel font-bold text-[#0B3C84] text-xs uppercase tracking-wider">Key Business Credentials</h4>
            <ul className="space-y-2 text-xs font-sans text-neutral-700">
              <li><strong className="text-neutral-900 font-medium">Proprietor:</strong> Ghanshyam Agrawal</li>
              <li><strong className="text-neutral-900 font-medium">GST Registration:</strong> <span className="font-mono text-[#0B3C84] font-bold">08ADOPA9061E1ZK</span></li>
              <li><strong className="text-neutral-900 font-medium">GPS Location:</strong> 26.87013, 75.77491</li>
              <li><strong className="text-neutral-900 font-medium">Business Nature:</strong> Manufacturer / Exporter / Supplier</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Custom Wholesale Enquiry Form */}
        <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="font-cinzel text-xs uppercase tracking-wider text-[#B3873E] font-semibold">
              Online Quotation Desk
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
              Submit Custom Specification
            </h2>
          </div>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-8 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-xl font-bold">Enquiry Received</h3>
              <p className="text-xs sm:text-sm text-emerald-800">
                Thank you for your submission. Our Jaipur office will review your specifications and contact you promptly with our wholesale catalog and rates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm font-sans">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-3">
                <select
                  value={salutation}
                  onChange={(e) => setSalutation(e.target.value)}
                  className="bg-[#F6F5F2] border border-neutral-300 rounded-xl px-3 py-3 text-neutral-900 font-medium focus:border-[#0B3C84] focus:outline-none"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-[#F6F5F2] border border-neutral-300 rounded-xl px-4 py-3 text-neutral-900 placeholder-neutral-500 focus:border-[#0B3C84] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  required
                  placeholder="Mobile / WhatsApp Number *"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="bg-[#F6F5F2] border border-neutral-300 rounded-xl px-4 py-3 text-neutral-900 placeholder-neutral-500 focus:border-[#0B3C84] focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#F6F5F2] border border-neutral-300 rounded-xl px-4 py-3 text-neutral-900 placeholder-neutral-500 focus:border-[#0B3C84] focus:outline-none"
                />
              </div>

              <div>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe your requirement, preferred bead size, mala count, elephant height, or custom carving details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#F6F5F2] border border-neutral-300 rounded-xl p-4 text-neutral-900 placeholder-neutral-500 focus:border-[#0B3C84] focus:outline-none"
                />
              </div>

              {/* Upload Drag & Drop Box */}
              <div className="border-2 border-dashed border-neutral-300 bg-[#F6F5F2] rounded-xl p-5 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="contact-file-upload"
                />
                <label htmlFor="contact-file-upload" className="cursor-pointer space-y-1 block">
                  <Upload className="w-7 h-7 text-[#B3873E] mx-auto" />
                  <span className="font-cinzel text-xs font-bold text-neutral-900 block uppercase tracking-wider">
                    Upload Reference Images (Optional)
                  </span>
                  <span className="text-[11px] text-neutral-500 block">
                    Attach photos of designs or custom specifications
                  </span>
                </label>
                {files.length > 0 && (
                  <div className="mt-2 text-xs text-[#0B3C84] font-bold">
                    {files.length} file(s) attached
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0B3C84] hover:bg-[#082C62] text-white font-cinzel font-bold text-xs uppercase tracking-wider py-4 rounded-xl hover:brightness-105 flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer select-none"
              >
                {submitting ? 'Submitting Enquiry...' : (
                  <>
                    <Send className="w-4 h-4" /> Submit Wholesale Enquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Embedded Map Section */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl text-[#0B3C84] font-normal">
          Factory Map Location (Jaipur)
        </h3>
        <div className="w-full h-[380px] rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
          <iframe
            src="https://maps.google.com/maps?q=26.87013,75.77491&z=15&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Riddhi Siddhi Arts and Crafts Jaipur Factory Location"
          />
        </div>
      </div>
    </div>
  );
}

