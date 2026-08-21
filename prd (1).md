# Product Requirements Document (PRD)
## Riddhi Siddhi Arts & Crafts — New Website + Admin Panel

**Version:** 1.0
**Date:** 21 August 2026
**Reference site:** https://www.sandalwoodhandicrafts.com/

---

## 1. Overview

### 1.1 Purpose
Build a modern, fully admin-managed marketing and catalog website for **Riddhi Siddhi Arts & Crafts**, a Jaipur-based manufacturer, exporter and supplier of Indian sandalwood handicraft items (malas, japa malas, elephants, beads, bracelets, religious jewelry, tashbih). The site is **not** a checkout/e-commerce store — it is a catalog + enquiry (quote/customization) platform. Every piece of content on the public site must be editable from an admin panel without touching code.

### 1.2 Goals
- Present products by admin-managed categories with rich detail pages.
- Let visitors browse, read reviews, and submit enquiries / customization requests (with image upload).
- Showcase brand story, reels, trending reels, reviews, and brand collaborations / certificates.
- Give the admin full CRUD control over every section, product, category, review, media asset, and enquiry.

### 1.3 Business context (from reference site)
- **Company:** Riddhi Siddhi Arts & Crafts
- **Proprietor:** Ghanshyam Agrawal
- **Address:** Basement, Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India
- **Phone:** +91-7942625339
- **GST No.:** 08ADOPA9061E1ZK
- **Map coordinates:** 26.87013, 75.77491
- **Nature of business:** Manufacturer / Exporter / Trader / Supplier
- **Existing categories:** Sandalwood Beads Mala, Sandalwood Japa Mala, Sandalwood Elephant, Sandalwood Beads, Sandalwood Semi-Finished Beads, Sandalwood Bracelet, Sandalwood Religious Jewelry, Sandalwood Tashbih

---

## 2. Site Map & Navigation

Primary navigation (4 items) plus footer and utility links.

```
Top Nav:  Home  |  About  |  Our Products  |  Contact Us
Utility:  Logo · Search · Phone number · Send Enquiry (CTA)
Footer:   Company info · Quick links · Categories · Social · Map · Copyright
```

| Nav item | Route | Purpose |
|----------|-------|---------|
| Home | `/` | Hero, featured products, company info, reels, trending reels, reviews, collaborations/certificates, location |
| About | `/about` | Vision & mission, CEO story, brand story, why choose us, real vs fake product guide, how to test |
| Our Products | `/products` | Category grid → category listing → product detail |
| Contact Us | `/contact` | Enquiry form with image upload, company details, map |

---

## 3. Public Pages — Detailed Requirements

### 3.1 Home Page (`/`)
Sections, top to bottom, each independently editable in the admin:

1. **Hero — scrolling banners (carousel)**
   - Auto-scrolling banner slider; admin adds/removes/reorders slides.
   - Each slide: background image, heading, subheading, optional CTA button (label + link).
   - Config: autoplay speed, loop on/off.

2. **Products (featured)**
   - Horizontal/grid strip of featured products pulled from the catalog.
   - Admin flags which products are "featured" and their order.
   - Each card: image, title, short spec (e.g., bead size, price/MOQ), "Get Quote"/"View" button.

3. **About our company (info block)**
   - Rich-text intro block ("WELCOME TO Riddhi Siddhi Arts & Crafts…") with an image and a "Read More" link to About.
   - Editable: heading, body (rich text), image, CTA.

4. **Reels section**
   - Grid/row of short video reels (Instagram/YouTube embeds or uploaded MP4).
   - Admin adds reel: video URL or upload, thumbnail, caption, order.

5. **Trending reels section**
   - Same structure as Reels but a separately curated "trending" list.
   - Admin marks reels as trending and orders them.

6. **Reviews section**
   - Displays approved customer reviews (rating, name, text, optional image).
   - Pulls from the global reviews store; admin controls which appear here.

7. **Brand collaboration / certificates**
   - Logo/badge grid of partner brands and certificates (e.g., Trustseal, IEC, GST verified).
   - Each item: image/logo, title, optional link, order. Admin CRUD.

8. **Location**
   - Embedded Google Map centered on the company address (26.87013, 75.77491) with a pin.
   - Address block + "Get Directions" link. Admin can edit address, coordinates, and map embed.

> Every section has a visibility toggle so the admin can show/hide it without deleting content, plus drag-to-reorder.

### 3.2 About Page (`/about`)
Admin-editable rich content blocks:
- **Vision & Mission** — two blocks, each heading + rich text + optional icon/image.
- **CEO story** — photo, name/designation, narrative rich text.
- **Brand story** — narrative rich text with supporting images.
- **Why choose us** — list of value points (icon + title + description), admin CRUD.
- **What are real products** — educational content on genuine sandalwood.
- **How to test them** — step-by-step guide (each step: title, description, optional image).
- Optional: company facts panel (nature of business, employees, GST date, turnover, IEC) mirroring the reference site.

### 3.3 Our Products (`/products`)
Three levels:

**(a) Category grid** (`/products`)
- Grid of categories (image + name + product count). Categories are created/edited/deleted by admin.

**(b) Category listing** (`/products/:categorySlug`)
- All products in that category as cards; supports sort (price, newest) and simple filters (bead size, wood origin, price range) where attributes exist.
- Each card: image, title, price, MOQ, "View" / "Get Quote".

**(c) Product detail** (`/products/:categorySlug/:productSlug`)
- **Image gallery** (multiple images, zoom, thumbnails).
- **Title**, **price** (e.g., ₹199/Piece), **short description**.
- **Specifications table** (dynamic key/value pairs — e.g., Wood Origin, Bead Size, Total Beads, Material, Mala Type, Height, Size, Color).
- **Minimum Order Quantity (MOQ)**.
- **Full description** (rich text).
- **Get Quote / Enquire** button → opens enquiry form pre-filled with product name.
- **Reviews & comments** for this product: rating, text, and user-uploaded product image; average rating shown. Includes a form for visitors to submit a review + image.
- **Similar products** — auto-suggested from the same category (and/or admin-picked).

> Product data model and initial catalog seed should be derived from the reference site (titles, specs, prices, MOQ) listed in Appendix A.

### 3.4 Contact Us (`/contact`)
- **Enquiry / customization form** with fields:
  - Title (Mr./Ms./Mrs./Dr.), Name*, Mobile*, Email*, Requirement/Message* (customization or general query), **Image upload** (one or more, for reference images).
  - Optional: linked product (if arriving from a product page).
  - Anti-spam (captcha), success confirmation message.
- **Company phone number** shown prominently (+91-7942625339) with click-to-call.
- **Company address** and **embedded map** (same as home location section).
- Submissions are stored and appear in the admin **Enquiries** inbox; optional email notification to admin.

---

## 4. Admin Panel — Requirements

A secure, authenticated back office. The admin can **view, edit, add, and delete** every piece of public content.

### 4.1 Access & security
- Login (email + password), session/JWT auth, password reset.
- Roles: **Super Admin** (all rights). Optional **Editor** role (content only, no user management) for future.
- All admin routes protected; audit log of changes (who/when) recommended.

### 4.2 Dashboard
- Summary tiles: total products, categories, pending reviews, new enquiries, total reels.
- Recent enquiries and recent reviews awaiting approval.

### 4.3 Content managers (CRUD for each)
1. **Home sections** — edit hero banners, featured products selection/order, company info block, reels, trending reels, reviews shown, collaborations/certificates, location; toggle visibility; reorder.
2. **About page** — edit vision, mission, CEO story, brand story, why-choose-us points, real-products content, how-to-test steps.
3. **Categories** — create / rename / set image / delete; set display order.
4. **Products** — create / edit / delete; assign category; upload multiple images; set title, price, MOQ, short + full description, dynamic spec key/values; mark as featured; set similar-product overrides.
5. **Reviews & comments** — view all (per product and global); approve / reject / edit / delete; moderate user-uploaded images; feature on home.
6. **Reels** — add/edit/delete reels; mark trending; set order; upload or embed.
7. **Collaborations / Certificates** — CRUD logos/badges.
8. **Enquiries inbox** — view submissions (name, contact, message, uploaded images, linked product); mark status (new / in-progress / closed); export.
9. **Site settings** — company name, phone, email, address, map coordinates/embed, social links, logo, SEO meta defaults.

### 4.4 Media library
- Central upload store for images/videos; reusable across sections; supports alt text; image optimization/thumbnails.

---

## 5. Data Model (high level)

```
Category      { id, name, slug, image, order, description, createdAt }
Product       { id, title, slug, categoryId, price, currency, moq,
                shortDescription, longDescription(richtext),
                images[], featured(bool), order,
                specs[ {label, value} ], similarProductIds[], createdAt }
Review        { id, productId(nullable for global), userName, rating(1-5),
                text, images[], status(pending/approved/rejected),
                featuredOnHome(bool), createdAt }
Reel          { id, title/caption, videoUrl|videoFile, thumbnail,
                type(reel/trending), order, createdAt }
Banner        { id, image, heading, subheading, ctaLabel, ctaLink, order, active }
Collaboration { id, title, logo, link, order }         // brands & certificates
Enquiry       { id, title, name, mobile, email, message,
                images[], productId(nullable), status, createdAt }
HomeSection   { id, key, title, body(richtext), image, visible, order }
AboutBlock    { id, key, title, body(richtext), images[], order }
SiteSettings  { companyName, phone, email, address, lat, lng, mapEmbed,
                socialLinks{}, logo, seo{} }
AdminUser     { id, email, passwordHash, role, createdAt }
```

---

## 6. Suggested Tech Stack (recommendation, not mandatory)

| Layer | Suggested option | Notes |
|-------|-----------------|-------|
| Frontend | React / Next.js + Tailwind CSS | SEO-friendly, fast, responsive |
| Admin UI | Same framework, protected routes, or a headless CMS admin | |
| Backend/API | Node.js (Express/NestJS) **or** a headless CMS (Strapi/Payload) | CMS gives ready-made admin CRUD |
| Database | PostgreSQL or MongoDB | |
| Media | Cloud storage (S3 / Cloudinary) | image optimization, video hosting |
| Auth | JWT / session-based | |
| Map | Google Maps Embed API | |
| Reels | Instagram/YouTube embed + MP4 upload fallback | |
| Hosting | Vercel/Netlify (front) + managed host (API/DB) | |

> A headless CMS (e.g., **Strapi** or **Payload CMS**) is worth strong consideration: it delivers most of the admin panel (CRUD, media library, roles, editable content) out of the box, cutting build time significantly.

---

## 7. Non-Functional Requirements
- **Responsive** across mobile / tablet / desktop.
- **SEO**: editable meta titles/descriptions per page and product, semantic markup, sitemap, fast load.
- **Performance**: lazy-loaded images/reels, optimized assets.
- **Accessibility**: alt text, keyboard navigation, sufficient contrast.
- **Security**: input validation, file-type/size limits on uploads, spam protection on forms, HTTPS.
- **Reliability**: form submissions persisted even if email notification fails.

---

## 8. Enquiry & Review Flows

**Enquiry flow**
1. Visitor submits form (contact page or product "Get Quote").
2. Optional image(s) uploaded; product auto-linked if from product page.
3. Stored as `Enquiry` (status: new); optional email to admin.
4. Admin views in inbox, updates status, follows up via phone/email.

**Review flow**
1. Visitor submits rating + text + optional product image on a product page.
2. Stored as `Review` (status: pending).
3. Admin moderates (approve/reject/edit/delete).
4. Approved reviews appear on the product page; admin may feature select reviews on Home.

---

## 9. Out of Scope (v1)
- Online payments / cart / checkout (site is catalog + enquiry only).
- Customer accounts/login (reviews and enquiries are submitted without accounts; email/name captured in the form).
- Multi-language (can be a future phase).

---

## 10. Milestones (suggested)
1. **Phase 1 — Foundations:** data models, admin auth, site settings, categories & products CRUD, media library.
2. **Phase 2 — Public catalog:** Home, Products (grid/listing/detail), About, Contact + enquiry.
3. **Phase 3 — Engagement:** reviews & moderation, reels & trending reels, collaborations/certificates.
4. **Phase 4 — Polish:** SEO, performance, accessibility, analytics, launch.

---

## Appendix A — Seed Catalog (from reference site)

**Categories:** Sandalwood Beads Mala · Sandalwood Japa Mala · Sandalwood Elephant · Sandalwood Beads · Sandalwood Semi-Finished Beads · Sandalwood Bracelet · Sandalwood Religious Jewelry · Sandalwood Tashbih

Sample products (title — price — key specs):
- Sandalwood Japa Loose Mala Beads — ₹190/Piece — Indian Sandalwood, 4–22mm, 108 beads
- Chinese Sandalwood Bracelet — ₹1,200/Piece — 4–22mm, 108 beads, Neck Mala
- Wood Craft Sandalwood Rosary Beads — ₹250/Piece — Indian Sandalwood, 20mm, 108 beads
- Sandalwood Beads Mala — ₹199/Piece — Indian Sandalwood, 10mm, 108 beads
- Religious Bead Bracelets — ₹1,000/Piece — wood/sandalwood, size 18
- Sandalwood Round Beads Designer Bracelet — ₹3,200/Piece — White Sandalwood, bracelet
- Sandalwood Mala Beads — ₹180/Piece — Indian Sandalwood, 8mm
- Handmade Wooden Elephant — ₹2,500/Piece — 8–12 inch
- Wooden Elephant Statue — ₹4,000/Piece — Sandalwood, 4–8 inch
- Sandalwood Muslim Misbahah Beads — ₹220/Piece — Indian Sandalwood, 12mm, 108 beads

(Full catalog to be imported by admin; the above illustrates the product/spec structure.)

## Appendix B — Company Contact Block
```
Riddhi Siddhi Arts & Crafts
Ghanshyam Agrawal (Proprietor)
Basement, Plot 115, Mohan Nagar Triveni Nagar,
Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India
Phone: +91-7942625339
GST No.: 08ADOPA9061E1ZK
Map: 26.87013, 75.77491
```
