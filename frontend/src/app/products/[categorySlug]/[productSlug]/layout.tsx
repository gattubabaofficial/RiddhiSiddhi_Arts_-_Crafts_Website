import type { Metadata } from 'next';

import { absoluteMediaUrl, getProduct, siteUrl, truncate } from '@/lib/seo';

type Props = {
  params: Promise<{ categorySlug: string; productSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const product = await getProduct(productSlug);

  if (!product) {
    return { title: 'Product | Riddhi Siddhi Arts & Crafts' };
  }

  const description =
    truncate(product.short_description) ??
    truncate(product.long_description) ??
    `${product.title} - authentic Indian sandalwood handicraft, handcrafted in Jaipur by Riddhi Siddhi Arts & Crafts.`;

  const image = absoluteMediaUrl(product.images?.[0]);
  const canonical = `${siteUrl()}/products/${categorySlug}/${product.slug}`;

  return {
    title: `${product.title} | Riddhi Siddhi Arts & Crafts`,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.title,
      description,
      url: canonical,
      type: 'website',
      images: image ? [{ url: image, alt: product.title }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: product.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
