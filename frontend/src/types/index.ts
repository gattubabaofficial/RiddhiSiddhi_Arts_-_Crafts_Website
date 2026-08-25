/**
 * Mirrors the backend Pydantic schemas in backend/app/schemas/.
 *
 * Previously these interfaces carried both the real field names and a parallel
 * set that no endpoint ever returned (`sku`, `min_order_quantity`, `sort_order`,
 * `is_active`, `description`). Because every one was optional, TypeScript could
 * not tell the two apart, and the homepage fallback data silently used the
 * phantom set -- so placeholder content rendered differently from live content.
 * Keep this file in step with the backend schemas.
 */

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
  description?: string | null;
  display_order?: number;
  product_count?: number;
  created_at?: string;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  price?: string | null;
  currency?: string;
  /** Minimum order quantity, e.g. "10 Pieces". */
  moq?: string;
  short_description?: string | null;
  long_description?: string | null;
  images: string[];
  videos?: string[];
  is_featured: boolean;
  display_order?: number;
  specs?: SpecItem[];
  similar_product_ids?: number[];
  category_name?: string | null;
  created_at?: string;
}

/** What the public /reviews endpoint returns. Never includes user_email. */
export interface Review {
  id: number;
  product_id?: number | null;
  user_name: string;
  rating: number;
  text: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  featured_on_home?: boolean;
  product_title?: string | null;
  created_at?: string;
}

/** Admin-only view from /reviews/admin/all. */
export interface AdminReview extends Review {
  user_email?: string | null;
}

export interface Enquiry {
  id: number;
  title_salutation: string;
  name: string;
  mobile: string;
  email: string;
  message: string;
  images?: string[];
  product_id?: number | null;
  product_title?: string | null;
  status: 'new' | 'in_progress' | 'closed';
  created_at: string;
}

export interface Reel {
  id: number;
  title: string;
  video_url: string;
  thumbnail_url?: string | null;
  is_trending?: boolean;
  display_order?: number;
  created_at?: string;
}

export interface HeroBanner {
  id: number;
  image_url: string;
  heading: string;
  subheading?: string | null;
  cta_label?: string | null;
  cta_link?: string | null;
  display_order?: number;
  is_active: boolean;
  created_at?: string;
}

export interface Collaboration {
  id: number;
  title: string;
  logo_url: string;
  link?: string | null;
  display_order?: number;
  created_at?: string;
}

export interface SiteSettings {
  id: number;
  company_name: string;
  proprietor: string;
  phone: string;
  email: string;
  gst_number: string;
  address: string;
  latitude: string;
  longitude: string;
  map_embed_url: string;
  social_links: {
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  logo_url?: string | null;
  seo_meta?: {
    meta_title?: string;
    meta_description?: string;
  };
  updated_at?: string;
}
