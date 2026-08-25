import type { MetadataRoute } from 'next';

import type { Category, Product } from '@/types';
import { fetchServer, siteUrl } from '@/lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const [categories, products] = await Promise.all([
    fetchServer<Category[]>('/categories'),
    fetchServer<Product[]>('/products?limit=100'),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((category) => ({
    url: `${base}/products/${category.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryById = new Map((categories ?? []).map((c) => [c.id, c.slug]));

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).flatMap((product) => {
    const categorySlug = categoryById.get(product.category_id);
    if (!categorySlug) return [];
    return [
      {
        url: `${base}/products/${categorySlug}/${product.slug}`,
        lastModified: product.created_at ? new Date(product.created_at) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
    ];
  });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
