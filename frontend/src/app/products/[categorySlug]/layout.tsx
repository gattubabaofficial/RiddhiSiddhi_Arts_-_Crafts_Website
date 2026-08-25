import type { Metadata } from 'next';

import { absoluteMediaUrl, getCategory, siteUrl, truncate } from '@/lib/seo';

type Props = {
  params: Promise<{ categorySlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategory(categorySlug);

  if (!category) {
    return { title: 'Collection | Riddhi Siddhi Arts & Crafts' };
  }

  const description =
    truncate(category.description) ??
    `Browse our ${category.name.toLowerCase()} collection - authentic Indian sandalwood handicrafts manufactured and exported from Jaipur.`;

  const image = absoluteMediaUrl(category.image_url);
  const canonical = `${siteUrl()}/products/${category.slug}`;

  return {
    title: `${category.name} | Riddhi Siddhi Arts & Crafts`,
    description,
    alternates: { canonical },
    openGraph: {
      title: category.name,
      description,
      url: canonical,
      type: 'website',
      images: image ? [{ url: image, alt: category.name }] : undefined,
    },
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
