'use client';

import React from 'react';
import { Award, CheckCircle, ShieldCheck, HelpCircle, Flame, Eye, Sparkles, Building, Phone } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-sandalwood-950 text-sandalwood-50 py-16 text-center border-b border-sandalwood-800">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-400">Jaipur Sandalwood Heritage</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-sandalwood-100">
            About Riddhi Siddhi Arts & Crafts
          </h1>
          <p className="text-sandalwood-300 text-base leading-relaxed">
            Manufacturer, Exporter & Supplier of 100% Genuine Indian Mysuru Sandalwood Handicrafts & Spiritual Rosaries.
          </p>
        </div>
      </section>

      {/* CEO & Brand Story */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-600">Proprietor Narrative</span>
          <h2 className="font-serif text-3xl font-bold text-sandalwood-900">
            The Story Behind Riddhi Siddhi Arts
          </h2>
          <p className="text-sandalwood-700 text-sm leading-relaxed">
            Founded and spearheaded by <strong>Mr. Ghanshyam Agrawal</strong>, Riddhi Siddhi Arts & Crafts has grown into one of Jaipur's most revered manufacturers and exporters of authentic sandalwood handicraft items.
          </p>
          <p className="text-sandalwood-600 text-sm leading-relaxed">
            Operating from Triveni Nagar, Gopalpura By Pass Road, Jaipur, our enterprise combines traditional Rajasthani wood carving heritage with strict quality control. From harvesting genuine aged sandalwood logs to precision lathe-turning 108 Japa beads and hand-carving royal elephant lattice sculptures, every stage is driven by artisanal devotion.
          </p>

          <div className="bg-sandalwood-100 border border-sandalwood-300 p-5 rounded-2xl space-y-2">
            <h4 className="font-serif font-bold text-sandalwood-900 text-sm">Ghanshyam Agrawal</h4>
            <p className="text-xs text-gold-700 font-semibold">Proprietor & Master Artisan Director</p>
            <p className="text-xs text-sandalwood-600">"Our mission is to bring sacred, genuine Mysuru sandalwood artifacts to spiritual seekers and art connoisseurs across the globe with transparent pricing and uncompromised authenticity."</p>
          </div>
        </div>

        <div className="w-full h-96 rounded-3xl overflow-hidden wood-card-shadow border-4 border-white bg-sandalwood-200">
          <img
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
            alt="Ghanshyam Agrawal Sandalwood Workshop"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-sandalwood-100 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-sandalwood-200 wood-card-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-sandalwood-900">Our Vision</h3>
            <p className="text-sm text-sandalwood-700 leading-relaxed">
              To be the globally recognized benchmark for genuine Indian sandalwood craftsmanship, expanding the reach of Jaipuri art while preserving ancient wood carving traditions and ethical sourcing.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-sandalwood-200 wood-card-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-sandalwood-900">Our Mission</h3>
            <p className="text-sm text-sandalwood-700 leading-relaxed">
              To provide wholesale buyers, temples, exporters, and individual collectors with 100% verified sandalwood malas, statues, and beads with guaranteed aroma, fine finish, and prompt export fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* Company Facts Panel */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <h2 className="font-serif text-2xl font-bold text-sandalwood-900 text-center">
          Company Facts & Credentials
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-sandalwood-900 text-sandalwood-100 p-4 rounded-2xl text-center space-y-1">
            <span className="text-xs text-gold-400 block uppercase">Nature of Business</span>
            <span className="font-bold text-sm block">Manufacturer & Exporter</span>
          </div>
          <div className="bg-sandalwood-900 text-sandalwood-100 p-4 rounded-2xl text-center space-y-1">
            <span className="text-xs text-gold-400 block uppercase">Location</span>
            <span className="font-bold text-sm block">Jaipur, Rajasthan</span>
          </div>
          <div className="bg-sandalwood-900 text-sandalwood-100 p-4 rounded-2xl text-center space-y-1">
            <span className="text-xs text-gold-400 block uppercase">GST Number</span>
            <span className="font-bold text-xs block text-gold-300">08ADOPA9061E1ZK</span>
          </div>
          <div className="bg-sandalwood-900 text-sandalwood-100 p-4 rounded-2xl text-center space-y-1">
            <span className="text-xs text-gold-400 block uppercase">Primary Wood</span>
            <span className="font-bold text-sm block">Indian Mysuru Sandalwood</span>
          </div>
          <div className="bg-sandalwood-900 text-sandalwood-100 p-4 rounded-2xl text-center space-y-1">
            <span className="text-xs text-gold-400 block uppercase">Bead Sizes</span>
            <span className="font-bold text-sm block">4mm to 22mm</span>
          </div>
          <div className="bg-sandalwood-900 text-sandalwood-100 p-4 rounded-2xl text-center space-y-1">
            <span className="text-xs text-gold-400 block uppercase">Export Reach</span>
            <span className="font-bold text-sm block">Global Dispatch</span>
          </div>
        </div>
      </section>

      {/* Real vs Fake Sandalwood Educational Guide */}
      <section id="how-to-test" className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-600">Buyer Protection & Education</span>
          <h2 className="font-serif text-3xl font-bold text-sandalwood-900">
            Real vs Fake Sandalwood: How to Test Authenticity
          </h2>
          <p className="text-sm text-sandalwood-700">
            Due to the high market value of genuine Indian Sandalwood (Santalum album), counterfeit synthetic scented beads are prevalent. Here is our official artisan guide to testing real sandalwood:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-sandalwood-200 rounded-3xl p-6 wood-card-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center font-bold">1</div>
            <h3 className="font-serif font-bold text-lg text-sandalwood-900">Natural Persistent Aroma</h3>
            <p className="text-xs text-sandalwood-600 leading-relaxed">
              Genuine sandalwood scent comes from natural essential oil inside the wood fibers. It does not fade quickly. Synthetic beads lose scent in days, whereas genuine beads retain aroma for decades.
            </p>
          </div>

          <div className="bg-white border border-sandalwood-200 rounded-3xl p-6 wood-card-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center font-bold">2</div>
            <h3 className="font-serif font-bold text-lg text-sandalwood-900">Sinking / Grain Density Test</h3>
            <p className="text-xs text-sandalwood-600 leading-relaxed">
              Mature heartwood of Indian Sandalwood is dense and heavy. When placed in water, genuine high-grade sandalwood sinks or hovers near the bottom, unlike light softwood imitations.
            </p>
          </div>

          <div className="bg-white border border-sandalwood-200 rounded-3xl p-6 wood-card-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center font-bold">3</div>
            <h3 className="font-serif font-bold text-lg text-sandalwood-900">Friction Warmth Activation</h3>
            <p className="text-xs text-sandalwood-600 leading-relaxed">
              Rubbing genuine sandalwood beads vigorously between your palms generates mild warmth which releases a sweet, woody, soothing fragrance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-sandalwood-900 text-sandalwood-100 rounded-3xl p-8 md:p-12 text-center space-y-6">
          <h2 className="font-serif text-3xl font-bold text-sandalwood-50">
            Need Custom Sandalwood Carvings or Bulk Mala Orders?
          </h2>
          <p className="text-sandalwood-300 max-w-xl mx-auto text-sm">
            Contact Ghanshyam Agrawal directly or submit your custom specifications with reference images online.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/contact" className="bg-gold-500 text-sandalwood-950 font-bold px-7 py-3 rounded-full hover:brightness-110">
              Submit Custom Enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
