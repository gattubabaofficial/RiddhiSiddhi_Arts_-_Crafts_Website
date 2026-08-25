'use client';

import React from 'react';
import Image from 'next/image';
import { Award, CheckCircle2, ShieldCheck, HelpCircle, Flame, Eye, Sparkles, Building, Phone } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-brand-navy-950 text-white pt-32 md:pt-36 pb-16 text-center border-b border-brand-gold-500/20">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg border border-brand-gold-400/40 relative overflow-hidden mb-2">
            <Image
              src="/logo-compact.jpeg"
              alt="Riddhi Siddhi Arts & Crafts Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-brand-gold-400 block">
            Jaipur Sandalwood Heritage & Craftsmanship
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">
            About Riddhi Siddhi Arts & Crafts
          </h1>
          <p className="text-brand-gold-100/80 text-base leading-relaxed max-w-2xl mx-auto">
            Jaipur’s trusted Manufacturer, Exporter & Supplier of 100% Genuine Indian Mysuru Sandalwood Handicrafts, Malas, Beads & Spiritual Statues.
          </p>
        </div>
      </section>

      {/* CEO & Brand Story */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-brand-gold-600">Proprietor Narrative</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-navy-900">
            The Story Behind Riddhi Siddhi Arts
          </h2>
          <p className="text-brand-navy-950/80 text-sm leading-relaxed">
            Founded and spearheaded by <strong>Mr. Ghanshyam Agrawal</strong>, Riddhi Siddhi Arts &amp; Crafts has grown into one of Jaipur&rsquo;s most revered manufacturers and exporters of authentic sandalwood handicraft items.
          </p>
          <p className="text-brand-navy-950/70 text-sm leading-relaxed">
            Operating from Triveni Nagar, Gopalpura By Pass Road, Jaipur, our enterprise combines traditional Rajasthani wood carving heritage with strict quality control. From harvesting genuine aged sandalwood logs to precision lathe-turning 108 Japa beads and hand-carving royal elephant lattice sculptures, every stage is driven by artisanal devotion.
          </p>

          <div className="bg-brand-sandalwood-100/80 border border-brand-sandalwood-300 p-6 rounded-2xl space-y-2 wood-card-shadow">
            <h4 className="font-serif font-bold text-brand-navy-900 text-base">Ghanshyam Agrawal</h4>
            <p className="font-cinzel text-xs text-brand-gold-700 font-semibold uppercase tracking-wider">Proprietor & Master Artisan Director</p>
            <p className="text-xs text-brand-navy-950/70 italic leading-relaxed">
              &ldquo;Our mission is to bring sacred, genuine Mysuru sandalwood artifacts to spiritual seekers and art connoisseurs across the globe with transparent pricing and uncompromised authenticity.&rdquo;
            </p>
          </div>
        </div>

        <div className="w-full h-96 rounded-3xl overflow-hidden wood-card-shadow border-4 border-white bg-brand-sandalwood-200">
          <img
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
            alt="Ghanshyam Agrawal Sandalwood Workshop"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-brand-sandalwood-100/60 py-16 border-y border-brand-sandalwood-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-brand-sandalwood-200 wood-card-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy-950 text-brand-gold-400 flex items-center justify-center shadow-md">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-brand-navy-900">Our Vision</h3>
            <p className="text-sm text-brand-navy-950/75 leading-relaxed">
              To be the globally recognized benchmark for genuine Indian sandalwood craftsmanship, expanding the reach of Jaipuri art while preserving ancient wood carving traditions and ethical sourcing.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-brand-sandalwood-200 wood-card-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy-950 text-brand-gold-400 flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-brand-navy-900">Our Mission</h3>
            <p className="text-sm text-brand-navy-950/75 leading-relaxed">
              To provide wholesale buyers, temples, exporters, and individual collectors with 100% verified sandalwood malas, statues, and beads with guaranteed aroma, fine finish, and prompt export fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* Company Facts Panel */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy-900 text-center">
          Company Facts & Credentials
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-brand-navy-950 text-white p-4 rounded-2xl text-center space-y-1 border border-brand-gold-500/20 shadow-md">
            <span className="font-cinzel text-[10px] text-brand-gold-400 block uppercase tracking-wider">Nature of Business</span>
            <span className="font-bold text-sm block">Manufacturer & Exporter</span>
          </div>
          <div className="bg-brand-navy-950 text-white p-4 rounded-2xl text-center space-y-1 border border-brand-gold-500/20 shadow-md">
            <span className="font-cinzel text-[10px] text-brand-gold-400 block uppercase tracking-wider">Location</span>
            <span className="font-bold text-sm block">Jaipur, Rajasthan</span>
          </div>
          <div className="bg-brand-navy-950 text-white p-4 rounded-2xl text-center space-y-1 border border-brand-gold-500/20 shadow-md">
            <span className="font-cinzel text-[10px] text-brand-gold-400 block uppercase tracking-wider">GST Number</span>
            <span className="font-mono text-xs block text-brand-gold-300 font-bold">08ADOPA9061E1ZK</span>
          </div>
          <div className="bg-brand-navy-950 text-white p-4 rounded-2xl text-center space-y-1 border border-brand-gold-500/20 shadow-md">
            <span className="font-cinzel text-[10px] text-brand-gold-400 block uppercase tracking-wider">Primary Wood</span>
            <span className="font-bold text-sm block">Indian Mysuru Sandalwood</span>
          </div>
          <div className="bg-brand-navy-950 text-white p-4 rounded-2xl text-center space-y-1 border border-brand-gold-500/20 shadow-md">
            <span className="font-cinzel text-[10px] text-brand-gold-400 block uppercase tracking-wider">Bead Sizes</span>
            <span className="font-bold text-sm block">4mm to 22mm</span>
          </div>
          <div className="bg-brand-navy-950 text-white p-4 rounded-2xl text-center space-y-1 border border-brand-gold-500/20 shadow-md">
            <span className="font-cinzel text-[10px] text-brand-gold-400 block uppercase tracking-wider">Export Reach</span>
            <span className="font-bold text-sm block">Global Dispatch</span>
          </div>
        </div>
      </section>

      {/* Real vs Fake Sandalwood Educational Guide */}
      <section id="how-to-test" className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-cinzel text-xs uppercase tracking-[0.2em] font-bold text-brand-gold-600">Buyer Protection & Education</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-navy-900">
            Real vs Fake Sandalwood: How to Test Authenticity
          </h2>
          <p className="text-sm text-brand-navy-950/70">
            Due to the high market value of genuine Indian Sandalwood (Santalum album), counterfeit synthetic scented beads are prevalent. Here is our official artisan guide to testing real sandalwood:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-brand-sandalwood-200 rounded-3xl p-6 wood-card-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy-950 text-brand-gold-400 font-cinzel flex items-center justify-center font-bold">1</div>
            <h3 className="font-serif font-bold text-lg text-brand-navy-900">Natural Persistent Aroma</h3>
            <p className="text-xs text-brand-navy-950/70 leading-relaxed">
              Genuine sandalwood scent comes from natural essential oil inside the wood fibers. It does not fade quickly. Synthetic beads lose scent in days, whereas genuine beads retain aroma for decades.
            </p>
          </div>

          <div className="bg-white border border-brand-sandalwood-200 rounded-3xl p-6 wood-card-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy-950 text-brand-gold-400 font-cinzel flex items-center justify-center font-bold">2</div>
            <h3 className="font-serif font-bold text-lg text-brand-navy-900">Sinking / Grain Density Test</h3>
            <p className="text-xs text-brand-navy-950/70 leading-relaxed">
              Mature heartwood of Indian Sandalwood is dense and heavy. When placed in water, genuine high-grade sandalwood sinks or hovers near the bottom, unlike light softwood imitations.
            </p>
          </div>

          <div className="bg-white border border-brand-sandalwood-200 rounded-3xl p-6 wood-card-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy-950 text-brand-gold-400 font-cinzel flex items-center justify-center font-bold">3</div>
            <h3 className="font-serif font-bold text-lg text-brand-navy-900">Friction Warmth Activation</h3>
            <p className="text-xs text-brand-navy-950/70 leading-relaxed">
              Rubbing genuine sandalwood beads vigorously between your palms generates mild warmth which releases a sweet, woody, soothing fragrance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-brand-navy-950 text-white rounded-3xl p-8 md:p-12 text-center space-y-6 border border-brand-gold-500/20 shadow-2xl">
          <h2 className="font-serif text-3xl font-bold text-white">
            Need Custom Sandalwood Carvings or Bulk Mala Orders?
          </h2>
          <p className="text-brand-gold-100/80 max-w-xl mx-auto text-sm">
            Contact Ghanshyam Agrawal directly or submit your custom specifications with reference images online.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-navy-950 font-cinzel font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full hover:brightness-110 shadow-lg transition-all"
            >
              Submit Custom Enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

