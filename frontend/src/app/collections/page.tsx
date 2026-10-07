'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI, getMediaUrl } from '@/lib/api';
import { Category } from '@/types';
import { ArrowRight } from 'lucide-react';

const COLLECTIONS_LIST = [
  {
    slug: 'malas',
    title: 'Sacred Malas & Rosaries',
    subtitle: '108 Japa Malas, Temple Rosaries & Islamic Tashbih',
    image: '/static/uploads/products/10-mm-indian-sandalwood-mala_0_indian-sandalwood-mala-500x500.jpg',
    description: 'Authentic pure Mysore Sandalwood prayer malas hand-turned and hand-strung in Jaipur with certified natural essential fragrance.',
    targetCategorySlugs: ['sandalwood-rosary', 'sandalwood-japa-mala', 'sandalwood-beads'],
  },
  {
    slug: 'sculptures',
    title: 'Royal Sculptures & Idols',
    subtitle: 'Undercut Net Jaali Elephants & Sacred Deities',
    image: '/static/uploads/products/elephant-carving-statue_0_elephant-carving-statue-500x500.jpg',
    description: 'Master artisan single-piece undercut jaali elephants, baby-inside-mother sculptures, and divine temple idols.',
    targetCategorySlugs: ['whitewood-handicrafts', 'sandalwood-religious-god-statues', 'handcarved-elephants'],
  },
  {
    slug: 'loose-beads',
    title: 'Loose Beads & Raw Craft',
    subtitle: 'Calibrated 4mm to 22mm Spherical & Semi-Finished Beads',
    image: '/static/uploads/products/12-mm-sandalwood-semi-finished-beads_0_sandalwood-semi-finished-500x500.jpg',
    description: 'Precision center-drilled loose chandan beads, unpolished craft beads, and raw billets for jewelers & wholesalers.',
    targetCategorySlugs: ['sandalwood-beads-semi-finished', 'loose-sandalwood-beads', 'wooden-beads'],
  },
  {
    slug: 'bracelets',
    title: 'Designer Bracelets & Jewelry',
    subtitle: 'Hand Chains, Elastic Wristlets & Carved Pendants',
    image: '/static/uploads/products/10-mm-sandalwood-hand-chain-in-china_0_sandalwood-hand-chain-in-china-500x500.png',
    description: 'Daily spiritual wear sandalwood wrist malas, tiger beads bracelets, and luxury engraved deity pendants.',
    targetCategorySlugs: ['sandalwood-bracelet', 'sandalwood-hand-chain', 'designer-sandalwood-bracelets', 'crafted-sandalwood-jewelery'],
  },
];

export default function CollectionsIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-36 lg:pt-40 pb-24 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-cinzel text-xs uppercase tracking-[0.25em] font-bold text-[#B3873E] block">
          The Atelier&apos;s Signature Universes
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0B3C84] tracking-tight">
          Explore Sandalwood Collections
        </h1>
        <p className="text-sm text-neutral-600 font-sans tracking-wide">
          Handcrafted in Jaipur from 100% certified genuine Indian Mysore Sandalwood (*Santalum album*).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {COLLECTIONS_LIST.map((col) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className="group block bg-[#F6F5F2] overflow-hidden rounded-2xl border border-neutral-200/80 hover:border-[#0B3C84] transition-all shadow-sm"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-white/60 flex items-center justify-center p-6">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-3 bg-[#F6F5F2]">
              <span className="font-cinzel text-[11px] text-[#B3873E] font-semibold uppercase tracking-wider block">
                {col.subtitle}
              </span>
              <h2 className="font-serif text-2xl text-[#0B3C84] group-hover:opacity-85 transition-opacity font-normal">
                {col.title}
              </h2>
              <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                {col.description}
              </p>
              <div className="pt-2">
                <span className="text-xs font-sans font-medium text-[#0B3C84] animated-underline inline-flex items-center gap-1.5 uppercase tracking-wider">
                  Discover Collection <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
