export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
  display_order: number;
  product_count?: number;
  created_at: string;
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
  price?: string;
  currency: string;
  moq: string;
  short_description?: string;
  long_description?: string;
  images: string[];
  is_featured: bool;
  display_order: number;
  specs: SpecItem[];
  similar_product_ids: number[];
  category_name?: string;
  created_at: string;
}

export interface Review {
  id: number;
  product_id?: number;
  user_name: string;
  user_email?: string;
  rating: number;
  text: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  featured_on_home: boolean;
  product_title?: string;
  created_at: string;
}

export interface Enquiry {
  id: number;
  title_salutation: string;
  name: string;
  mobile: string;
  email: string;
  message: string;
  images: string[];
  product_id?: number;
  product_title?: string;
  status: 'new' | 'in_progress' | 'closed';
  created_at: string;
}

export interface Reel {
  id: number;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  is_trending: boolean;
  display_order: number;
  created_at: string;
}

export interface HeroBanner {
  id: number;
  image_url: string;
  heading: string;
  subheading?: string;
  cta_label?: string;
  cta_link?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Collaboration {
  id: number;
  title: string;
  logo_url: string;
  link?: string;
  display_order: number;
  created_at: string;
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
  logo_url?: string;
  seo_meta: {
    meta_title?: string;
    meta_description?: string;
  };
  updated_at: string;
}
