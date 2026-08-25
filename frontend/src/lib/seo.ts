/**
 * Server-side helpers for page metadata and the sitemap.
 *
 * Every page in this app is a client component, so `export const metadata` is
 * not available on them. A server `layout.tsx` per route segment can still
 * supply it -- that is how each product and category gets its own title and
 * description instead of every page sharing the generic root one.
 */
import type { Category, Product } from '@/types';

const DEFAULT_BACKEND_ORIGIN = 'http://127.0.0.1:8000';

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

function apiOrigin(): string {
  return (process.env.BACKEND_ORIGIN || DEFAULT_BACKEND_ORIGIN).replace(/\/+$/, '');
}

/**
 * Fetches from the API at build/request time. Metadata and sitemaps must never
 * take the whole page down, so failures resolve to `null` and callers fall back
 * to static copy.
 */
export async function fetchServer<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(`${apiOrigin()}/api/v1${path}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function absoluteMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${siteUrl()}${url.startsWith('/') ? url : `/${url}`}`;
}

export function getProduct(slug: string) {
  return fetchServer<Product>(`/products/${encodeURIComponent(slug)}`);
}

export function getCategory(slug: string) {
  return fetchServer<Category>(`/categories/${encodeURIComponent(slug)}`);
}

/** Trims to a sensible meta-description length on a word boundary. */
export function truncate(text: string | null | undefined, max = 158): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, clean.lastIndexOf(' ', max - 1))}...`;
}
