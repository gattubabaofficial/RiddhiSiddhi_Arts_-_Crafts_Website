'use client';

import React from 'react';
import Image from 'next/image';
import { Eye, Sparkles, ShieldCheck, CheckCircle2, Phone, Send, Award, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-36 lg:pt-40 pb-24 space-y-16 sm:space-y-20">
      
      {/* Editorial Header */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <span className="font-cinzel text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#B3873E] block">
          Jaipur Sandalwood Heritage & Craftsmanship
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#0B3C84] tracking-tight leading-tight">
          The Atelier of Riddhi Siddhi
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base font-sans leading-relaxed max-w-2xl mx-auto">
          Jaipur’s trusted Manufacturer, Exporter & Supplier of 100% Genuine Indian Mysuru Sandalwood Handicrafts, Sacred Malas, Beads & Handcarved Sculptures.
        </p>
      </section>

      {/* Brand Narrative & Master Artisan Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="font-cinzel text-xs uppercase tracking-wider font-semibold text-[#0B3C84]">
              Proprietor Narrative
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-neutral-900 font-normal leading-snug">
              Preserving Ancient Sandalwood Carving Traditions
            </h2>
          </div>
          <p className="text-neutral-700 text-sm sm:text-[15px] font-sans leading-relaxed">
            Founded and spearheaded by <strong>Mr. Ghanshyam Agrawal</strong>, Riddhi Siddhi Arts &amp; Crafts has flourished into one of Jaipur&rsquo;s most revered manufacturers and export ateliers of authentic sandalwood artifacts.
          </p>
          <p className="text-neutral-600 text-sm sm:text-[15px] font-sans leading-relaxed">
            Operating from Triveni Nagar, Jaipur, our enterprise combines centuries of Rajasthani wood carving heritage with stringent botanical authenticity. From acquiring matured high-oil sandalwood logs to precision lathe-turning 108 Japa malas and hand-carving royal undercut lattice elephants, every artifact undergoes master artisanal curation.
          </p>

          <div className="bg-[#F6F5F2] border border-neutral-200/80 p-6 rounded-2xl space-y-2">
            <h4 className="font-serif font-bold text-[#0B3C84] text-base">Ghanshyam Agrawal</h4>
            <p className="font-cinzel text-[11px] text-[#B3873E] font-semibold uppercase tracking-wider">
              Proprietor & Master Artisan Director
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 italic font-sans leading-relaxed pt-1">
              &ldquo;Our mission is to bring sacred, genuine Mysuru sandalwood artifacts to spiritual seekers and wholesale connoisseurs across the globe with total transparency, botanical purity, and honest pricing.&rdquo;
            </p>
          </div>
        </div>

        {/* Clean Studio Workshop Image Frame */}
        <div className="relative w-full aspect-[4/5] bg-[#F6F5F2] rounded-2xl overflow-hidden shadow-sm">
          <img
            src="/static/uploads/banners/hero_banner_1_template_photo_2.jpg"
            alt="Riddhi Siddhi Sandalwood Workshop and Artisans"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* Vision & Mission Minimalist Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4 hover:border-[#0B3C84] transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#0B3C84] text-white flex items-center justify-center shadow-sm">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal">Our Vision</h3>
          <p className="text-sm text-neutral-600 font-sans leading-relaxed">
            To be the globally recognized benchmark for genuine Indian sandalwood craftsmanship, elevating Rajasthani heritage woodworking while maintaining strict sustainability and ethical sourcing.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4 hover:border-[#0B3C84] transition-colors">
          <div className="w-11 h-11 rounded-xl bg-[#0B3C84] text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal">Our Mission</h3>
          <p className="text-sm text-neutral-600 font-sans leading-relaxed">
            To deliver verified 100% natural sandalwood malas, sculptures, and calibrated loose beads with persistent natural aroma, flawless finish, and prompt wholesale fulfillment worldwide.
          </p>
        </div>
      </section>

      {/* Company Credentials Metadata Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="font-cinzel text-xs uppercase tracking-wider text-[#B3873E] font-semibold">
            Institutional Verification
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0B3C84] font-normal">
            Company Facts & Credentials
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl text-center space-y-1 border border-neutral-200/80 shadow-sm">
            <span className="font-cinzel text-[10px] text-[#0B3C84] block uppercase tracking-wider font-semibold">Business Type</span>
            <span className="font-sans font-medium text-xs sm:text-sm text-neutral-900 block">Manufacturer & Exporter</span>
          </div>
          <div className="bg-white p-4 rounded-xl text-center space-y-1 border border-neutral-200/80 shadow-sm">
            <span className="font-cinzel text-[10px] text-[#0B3C84] block uppercase tracking-wider font-semibold">Origin Location</span>
            <span className="font-sans font-medium text-xs sm:text-sm text-neutral-900 block">Jaipur, Rajasthan</span>
          </div>
          <div className="bg-white p-4 rounded-xl text-center space-y-1 border border-neutral-200/80 shadow-sm">
            <span className="font-cinzel text-[10px] text-[#0B3C84] block uppercase tracking-wider font-semibold">GST Registration</span>
            <span className="font-mono text-xs text-neutral-900 font-bold block">08ADOPA9061E1ZK</span>
          </div>
          <div className="bg-white p-4 rounded-xl text-center space-y-1 border border-neutral-200/80 shadow-sm">
            <span className="font-cinzel text-[10px] text-[#0B3C84] block uppercase tracking-wider font-semibold">Primary Wood</span>
            <span className="font-sans font-medium text-xs sm:text-sm text-neutral-900 block">Mysuru Santalum Album</span>
          </div>
          <div className="bg-white p-4 rounded-xl text-center space-y-1 border border-neutral-200/80 shadow-sm">
            <span className="font-cinzel text-[10px] text-[#0B3C84] block uppercase tracking-wider font-semibold">Calibrated Sizes</span>
            <span className="font-sans font-medium text-xs sm:text-sm text-neutral-900 block">4mm to 22mm Beads</span>
          </div>
          <div className="bg-white p-4 rounded-xl text-center space-y-1 border border-neutral-200/80 shadow-sm">
            <span className="font-cinzel text-[10px] text-[#0B3C84] block uppercase tracking-wider font-semibold">Logistics</span>
            <span className="font-sans font-medium text-xs sm:text-sm text-neutral-900 block">Worldwide Dispatch</span>
          </div>
        </div>
      </section>

      {/* Real vs Fake Sandalwood Educational Guide */}
      <section id="how-to-test" className="space-y-8 pt-4">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="font-cinzel text-xs uppercase tracking-wider font-semibold text-[#B3873E]">
            Buyer Protection & Authenticity
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#0B3C84] font-normal">
            Real vs Fake Sandalwood: How to Test Authenticity
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans">
            Genuine Indian Sandalwood (*Santalum album*) possesses distinctive natural characteristics that distinguish it from synthetic imitations:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F6F5F2] border border-neutral-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B3C84] text-white font-cinzel flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h3 className="font-serif text-lg text-neutral-900 font-medium">Natural Persistent Aroma</h3>
            <p className="text-xs sm:text-[13px] text-neutral-600 font-sans leading-relaxed">
              Genuine sandalwood scent originates from natural essential oils infused deep within the heartwood fibers. It never evaporates completely and endures for decades, unlike synthetically fragranced imitations.
            </p>
          </div>

          <div className="bg-[#F6F5F2] border border-neutral-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B3C84] text-white font-cinzel flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h3 className="font-serif text-lg text-neutral-900 font-medium">Grain Density & Water Test</h3>
            <p className="text-xs sm:text-[13px] text-neutral-600 font-sans leading-relaxed">
              Mature heartwood of Indian Sandalwood is dense, heavy, and tightly grained. When immersed in water, genuine high-grade beads submerge toward the bottom, in contrast to light porous softwoods.
            </p>
          </div>

          <div className="bg-[#F6F5F2] border border-neutral-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B3C84] text-white font-cinzel flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h3 className="font-serif text-lg text-neutral-900 font-medium">Friction Warmth Activation</h3>
            <p className="text-xs sm:text-[13px] text-neutral-600 font-sans leading-relaxed">
              Vigorously rubbing genuine sandalwood beads between palms creates mild warmth that instantly releases a sweet, warm, woody balsamic fragrance without artificial undertones.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-[#F6F5F2] border border-neutral-200/80 rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#0B3C84] font-normal">
          Custom Carvings & Wholesale Enquiries
        </h2>
        <p className="text-neutral-600 max-w-xl mx-auto text-xs sm:text-sm font-sans">
          Contact our master atelier directly for wholesale bulk rates, custom deity sculptures, or specific mala requirements.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/contact"
            className="bg-[#0B3C84] hover:bg-[#082C62] text-white font-cinzel font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-colors shadow-sm flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit Custom Enquiry
          </Link>
          <a
            href="tel:+917942625339"
            className="bg-white hover:bg-neutral-50 text-[#0B3C84] border border-neutral-300 font-cinzel font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-colors shadow-sm flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#B3873E]" /> Call Us Directly
          </a>
        </div>
      </section>
    </div>
  );
}

