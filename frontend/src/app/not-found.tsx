import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 space-y-6">
      <span className="text-xs font-cinzel tracking-widest text-amber-800 uppercase font-semibold">
        404 — Page Not Located
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-stone-900">
        Artifact or Collection Not Found
      </h1>
      <p className="text-xs sm:text-sm text-stone-600 max-w-md font-sans">
        The handcrafted sandalwood artifact, category, or page you are looking for may have been updated or moved in our catalog.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex bg-stone-900 hover:bg-stone-800 text-white font-sans text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-colors"
        >
          Return to Atelier Home
        </Link>
      </div>
    </div>
  );
}
