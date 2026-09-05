import asyncio
import os
import json
import secrets
import shutil
from sqlalchemy import select, delete
from app.core.database import AsyncSessionLocal, init_db
from app.core.security import get_password_hash
from app.models import (
    AdminUser, Category, Product, Review, Enquiry, Reel,
    HeroBanner, Collaboration, HomeSection, AboutBlock, SiteSettings
)

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BACKEND_DIR, "all_scraped_products.json")

async def ingest():
    await init_db()

    if not os.path.exists(DATA_FILE):
        print(f"File {DATA_FILE} not found! Please wait for crawler to finish.")
        return

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    categories_data = data.get("categories", [])
    products_data = data.get("products", [])

    print(f"Starting ingestion: {len(categories_data)} categories, {len(products_data)} products...")

    async with AsyncSessionLocal() as session:
        # Admin User Check
        admin_email = (os.environ.get("SEED_ADMIN_EMAIL") or "").strip() or "admin@riddhisiddhi.com"
        res = await session.execute(select(AdminUser).where(AdminUser.email == admin_email))
        if not res.scalars().first():
            admin_password = (os.environ.get("SEED_ADMIN_PASSWORD") or "").strip() or "admin123"
            session.add(AdminUser(
                email=admin_email,
                password_hash=get_password_hash(admin_password),
                role="superadmin"
            ))
            print(f"Admin account ensured: {admin_email}")

        # Categories
        cat_map = {}
        for idx, cat_info in enumerate(categories_data, 1):
            slug = cat_info["slug"]
            name = cat_info["name"]
            res = await session.execute(select(Category).where(Category.slug == slug))
            existing_cat = res.scalars().first()
            if not existing_cat:
                cat = Category(
                    name=name,
                    slug=slug,
                    image_url=cat_info.get("image_url"),
                    description=cat_info.get("description"),
                    display_order=idx
                )
                session.add(cat)
                await session.flush()
                cat_map[slug] = cat.id
            else:
                existing_cat.image_url = cat_info.get("image_url") or existing_cat.image_url
                existing_cat.description = cat_info.get("description") or existing_cat.description
                existing_cat.display_order = idx
                await session.flush()
                cat_map[slug] = existing_cat.id

        print(f"Categories synchronized: {len(cat_map)}")

        # Products
        inserted_count = 0
        updated_count = 0
        reels_to_add = []

        for p in products_data:
            cat_id = cat_map.get(p["category_slug"])
            if not cat_id:
                # If category wasn't in summary, find by slug or create
                res = await session.execute(select(Category).where(Category.slug == p["category_slug"]))
                cat = res.scalars().first()
                if not cat:
                    cat = Category(
                        name=p["category_name"],
                        slug=p["category_slug"],
                        image_url=p["images"][0] if p["images"] else None,
                        description=f"Authentic {p['category_name']} handcrafted by Riddhi Siddhi Arts & Crafts."
                    )
                    session.add(cat)
                    await session.flush()
                cat_id = cat.id
                cat_map[p["category_slug"]] = cat_id

            # Filter valid images
            valid_images = [img for img in p.get("images", []) if img and "default.jpg" not in img]
            if not valid_images and p.get("images"):
                valid_images = p.get("images")

            res = await session.execute(select(Product).where(Product.slug == p["slug"]))
            existing_product = res.scalars().first()

            if not existing_product:
                prod = Product(
                    category_id=cat_id,
                    title=p["title"],
                    slug=p["slug"],
                    price=p["price"],
                    currency="INR",
                    moq=p.get("moq", "10 Pieces"),
                    short_description=p.get("short_description"),
                    long_description=p.get("long_description"),
                    images=valid_images,
                    videos=[p["video_url"]] if p.get("video_url") else [],
                    is_featured=p.get("is_featured", False),
                    specs=p.get("specs", [])
                )
                session.add(prod)
                inserted_count += 1
            else:
                existing_product.title = p["title"]
                existing_product.price = p["price"]
                existing_product.moq = p.get("moq", "10 Pieces")
                existing_product.short_description = p.get("short_description")
                existing_product.long_description = p.get("long_description")
                existing_product.images = valid_images
                if p.get("video_url"):
                    existing_product.videos = [p["video_url"]]
                existing_product.specs = p.get("specs", [])
                updated_count += 1

            if p.get("video_url") and len(reels_to_add) < 6:
                reels_to_add.append({
                    "title": f"Handcrafting {p['title']} - Jaipur Workshop",
                    "video_url": p["video_url"],
                    "thumbnail_url": valid_images[0] if valid_images else None
                })

        print(f"Products: {inserted_count} new inserted, {updated_count} updated.")

        # Hero Banners from the finest products
        # Pick top featured products for banners
        banner_candidates = [
            {
                "heading": "Authentic Indian Sandalwood Beads Mala",
                "subheading": "Handmade 108 Beads Aromatic Japa Malas directly from Jaipur artisans. Pure Mysore Sandalwood.",
                "cta_label": "Shop Sandalwood Malas",
                "cta_link": "/products/sandalwood-beads-mala",
                "img_slug": "sandalwood-beads-mala"
            },
            {
                "heading": "Sacred Mysore Sandalwood Japa Malas",
                "subheading": "Natural soothing fragrance for spiritual chanting, meditation, and temple rituals.",
                "cta_label": "Explore Japa Malas",
                "cta_link": "/products/sandalwood-japa-mala",
                "img_slug": "sandalwood-japa-mala"
            },
            {
                "heading": "Royal Sandalwood Elephant Carvings",
                "subheading": "Exquisite undercut jali lattice wood sculptures hand-carved by master craftsmen in Rajasthan.",
                "cta_label": "View Sculptures",
                "cta_link": "/products/sandalwood-elephant",
                "img_slug": "sandalwood-elephant"
            },
            {
                "heading": "Pure Loose Sandalwood Beads (4mm - 22mm)",
                "subheading": "High aromatic oil content, polished and semi-finished beads for global export.",
                "cta_label": "Explore Loose Beads",
                "cta_link": "/products/sandalwood-beads",
                "img_slug": "sandalwood-beads"
            }
        ]

        # Clear old banners and insert fresh ones with valid local images
        await session.execute(delete(HeroBanner))
        for idx, b_info in enumerate(banner_candidates, 1):
            # Find an image for this banner
            res = await session.execute(select(Category).where(Category.slug == b_info["img_slug"]))
            cat = res.scalars().first()
            img_url = cat.image_url if cat and cat.image_url else "/static/uploads/products/sandalwood-beads-mala_0_sandalwood-mala-beads-500x500.jpg"
            
            banner = HeroBanner(
                image_url=img_url,
                heading=b_info["heading"],
                subheading=b_info["subheading"],
                cta_label=b_info["cta_label"],
                cta_link=b_info["cta_link"],
                display_order=idx,
                is_active=True
            )
            session.add(banner)

        # Reels / Videos
        if reels_to_add:
            await session.execute(delete(Reel))
            for idx, r in enumerate(reels_to_add, 1):
                reel = Reel(
                    title=r["title"],
                    video_url=r["video_url"],
                    thumbnail_url=r["thumbnail_url"],
                    is_trending=True,
                    display_order=idx
                )
                session.add(reel)

        # Collaborations / Certifications
        await session.execute(delete(Collaboration))
        collabs = [
            Collaboration(title="Trustseal Verified Exporter", logo_url="/static/uploads/products/default.jpg", display_order=1),
            Collaboration(title="GST Registered Enterprise (08ADOPA9061E1ZK)", logo_url="/static/uploads/products/default.jpg", display_order=2),
            Collaboration(title="IEC (Import Export Code) Certified", logo_url="/static/uploads/products/default.jpg", display_order=3),
            Collaboration(title="Handmade in Jaipur, Rajasthan", logo_url="/static/uploads/products/default.jpg", display_order=4)
        ]
        for c in collabs:
            session.add(c)

        # Site Settings
        res = await session.execute(select(SiteSettings))
        settings_obj = res.scalars().first()
        if not settings_obj:
            settings_obj = SiteSettings(
                company_name="Riddhi Siddhi Arts & Crafts",
                proprietor="Ghanshyam Agrawal",
                phone="+91-7942625339",
                email="info@riddhisiddhiarts.com",
                gst_number="08ADOPA9061E1ZK",
                address="Basement, Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India",
                latitude="26.87013",
                longitude="75.77491",
                map_embed_url="https://maps.google.com/maps?q=26.87013,75.77491&z=15&output=embed",
                social_links={
                    "whatsapp": "+917942625339",
                    "facebook": "https://facebook.com",
                    "instagram": "https://instagram.com",
                    "youtube": "https://youtube.com"
                },
                logo_url="https://5.imimg.com/data5/SELLER/Logo/2026/8/635161760/QR/FM/XR/2974090/untitled-2-jpg-120x120.jpeg",
                seo_meta={
                    "meta_title": "Riddhi Siddhi Arts & Crafts | Sandalwood Handicrafts Jaipur",
                    "meta_description": "Manufacturer, Exporter & Supplier of authentic Indian Sandalwood Handicrafts, Malas, Japa Malas, Elephants & Beads in Jaipur."
                }
            )
            session.add(settings_obj)

        await session.commit()
        print("\nAll database tables enriched successfully!")

if __name__ == "__main__":
    asyncio.run(ingest())
