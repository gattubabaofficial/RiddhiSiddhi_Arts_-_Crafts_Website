'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Upload, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      
      {/* Page Title Header */}
      <div className="bg-sandalwood-950 text-sandalwood-50 p-8 md:p-12 rounded-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-gold-400">Jaipur Factory & Export Desk</span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold">
          Contact & Wholesale Enquiry
        </h1>
        <p className="text-sm text-sandalwood-300 max-w-2xl">
          Get in touch with Ghanshyam Agrawal and our artisan sales team for wholesale mala rates, custom elephant carvings, export documentation, or sample requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Column: Contact Cards */}
        <div className="space-y-6">
          <div className="bg-white border border-sandalwood-200 rounded-3xl p-6 wood-card-shadow space-y-4">
            <h3 className="font-serif font-bold text-xl text-sandalwood-900">Direct Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-sandalwood-500 block">Email Inquiry</span>
                  <a href="mailto:info@riddhisiddhiarts.com" className="font-semibold text-sandalwood-900 hover:text-gold-600">
                    info@riddhisiddhiarts.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-sandalwood-500 block">Factory Address</span>
                  <p className="text-sandalwood-800 text-xs leading-relaxed">
                    Basement, Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sandalwood-900 text-sandalwood-100 p-6 rounded-3xl space-y-3">
            <h4 className="font-serif font-bold text-gold-400 text-base">Key Business Credentials</h4>
            <ul className="space-y-2 text-xs text-sandalwood-300">
              <li><strong className="text-sandalwood-100">Proprietor:</strong> Ghanshyam Agrawal</li>
              <li><strong className="text-sandalwood-100">GST Registration:</strong> 08ADOPA9061E1ZK</li>
              <li><strong className="text-sandalwood-100">GPS Coordinates:</strong> 26.87013, 75.77491</li>
              <li><strong className="text-sandalwood-100">Business Nature:</strong> Manufacturer / Exporter / Supplier</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Custom Enquiry Form */}
        <div className="lg:col-span-2 bg-white border border-sandalwood-200 rounded-3xl p-8 wood-card-shadow space-y-6">
          <h2 className="font-serif text-2xl font-bold text-sandalwood-900">
            Submit Custom Specification / Quote Form
          </h2>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-xl font-bold">Enquiry Received!</h3>
              <p className="text-xs text-emerald-800">
                Thank you for your submission. Our Jaipur office will review your message and uploaded reference images and contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-3">
                <select
                  value={salutation}
                  onChange={(e) => setSalutation(e.target.value)}
                  className="bg-sandalwood-50 border border-sandalwood-300 rounded-xl px-3 py-3 text-sandalwood-900 font-semibold"
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
                  className="flex-1 bg-sandalwood-50 border border-sandalwood-300 rounded-xl px-4 py-3 text-sandalwood-900 placeholder-sandalwood-400 focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  required
                  placeholder="Mobile / WhatsApp Number *"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="bg-sandalwood-50 border border-sandalwood-300 rounded-xl px-4 py-3 text-sandalwood-900 placeholder-sandalwood-400 focus:border-gold-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-sandalwood-50 border border-sandalwood-300 rounded-xl px-4 py-3 text-sandalwood-900 placeholder-sandalwood-400 focus:border-gold-500"
                />
              </div>

              <div>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe your requirement, preferred bead size, mala count, elephant height, or custom carving details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-sandalwood-50 border border-sandalwood-300 rounded-xl p-4 text-sandalwood-900 placeholder-sandalwood-400 focus:border-gold-500"
                />
              </div>

              {/* Upload Drag & Drop Box */}
              <div className="border-2 border-dashed border-sandalwood-300 bg-sandalwood-50 rounded-2xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="contact-file-upload"
                />
                <label htmlFor="contact-file-upload" className="cursor-pointer space-y-1 block">
                  <Upload className="w-8 h-8 text-gold-600 mx-auto" />
                  <span className="text-xs font-bold text-sandalwood-900 block">
                    Upload Reference Images (Optional)
                  </span>
                  <span className="text-[11px] text-sandalwood-500 block">
                    Attach photos of designs or custom specifications you wish to reproduce
                  </span>
                </label>
                {files.length > 0 && (
                  <div className="mt-2 text-xs text-gold-700 font-bold">
                    {files.length} file(s) attached
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-sandalwood-950 font-bold py-4 rounded-2xl hover:brightness-110 flex items-center justify-center gap-2 shadow-lg transition-all text-base"
              >
                {submitting ? 'Submitting Enquiry...' : (
                  <>
                    <Send className="w-5 h-5" /> Submit Wholesale Enquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Embedded Map Section */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-sandalwood-900">
          Factory Map Location (Jaipur)
        </h3>
        <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-sandalwood-300 wood-card-shadow">
          <iframe
            src="https://maps.google.com/maps?q=26.87013,75.77491&z=15&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
