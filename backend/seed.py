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

async def seed_data():
    await init_db()

    async with AsyncSessionLocal() as session:
        # Admin User
        admin_email = (os.environ.get("SEED_ADMIN_EMAIL") or "").strip() or "admin@riddhisiddhi.com"
        res = await session.execute(select(AdminUser).where(AdminUser.email == admin_email))
        if not res.scalars().first():
            admin_password = (os.environ.get("SEED_ADMIN_PASSWORD") or "").strip() or "admin123"
            session.add(AdminUser(
                email=admin_email,
                password_hash=get_password_hash(admin_password),
                role="superadmin"
            ))
            print(f"Created superadmin: {admin_email}")

        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)

            banners_data = data.get("banners", [])
            logo_url = data.get("logo", "/static/uploads/general/logo_template_photo_1.png")
            categories_data = data.get("categories", [])

            # Banners
            await session.execute(delete(HeroBanner))
            for b in banners_data:
                session.add(HeroBanner(
                    image_url=b["image_url"],
                    heading=b["heading"],
                    subheading=b["subheading"],
                    cta_label=b["cta_label"],
                    cta_link=b["cta_link"],
                    display_order=b.get("display_order", 0),
                    is_active=True
                ))

            # Categories & Products
            for cat_idx, cat in enumerate(categories_data, 1):
                res = await session.execute(select(Category).where(Category.slug == cat["slug"]))
                cat_obj = res.scalars().first()
                if not cat_obj:
                    cat_obj = Category(
                        name=cat["name"],
                        slug=cat["slug"],
                        image_url=cat.get("image_url"),
                        description=cat.get("description"),
                        display_order=cat_idx
                    )
                    session.add(cat_obj)
                    await session.flush()
                else:
                    cat_obj.name = cat["name"]
                    if cat.get("image_url"):
                        cat_obj.image_url = cat["image_url"]
                    cat_obj.description = cat.get("description")
                    cat_obj.display_order = cat_idx
                    await session.flush()

                for p_idx, p in enumerate(cat.get("products", []), 1):
                    p_slug = p["slug"]
                    res = await session.execute(select(Product).where(Product.slug == p_slug))
                    prod_obj = res.scalars().first()
                    valid_imgs = [img for img in p.get("images", []) if img]
                    if not valid_imgs and cat_obj.image_url:
                        valid_imgs = [cat_obj.image_url]

                    if not prod_obj:
                        session.add(Product(
                            category_id=cat_obj.id,
                            title=p["title"],
                            slug=p_slug,
                            price=p.get("price", "Ask for Price"),
                            currency=p.get("currency", "INR"),
                            moq=p.get("moq", "10 Pieces"),
                            short_description=p.get("short_description"),
                            long_description=p.get("long_description"),
                            images=valid_imgs,
                            videos=[],
                            is_featured=p.get("is_featured", False),
                            display_order=p_idx,
                            specs=p.get("specs", [])
                        ))
                    else:
                        prod_obj.category_id = cat_obj.id
                        prod_obj.title = p["title"]
                        prod_obj.price = p.get("price", "Ask for Price")
                        prod_obj.moq = p.get("moq", "10 Pieces")
                        prod_obj.short_description = p.get("short_description")
                        prod_obj.long_description = p.get("long_description")
                        if valid_imgs:
                            prod_obj.images = valid_imgs
                        prod_obj.specs = p.get("specs", [])
                        prod_obj.is_featured = p.get("is_featured", False)
                        prod_obj.display_order = p_idx

        # Site Settings
        res = await session.execute(select(SiteSettings))
        settings_obj = res.scalars().first()
        if not settings_obj:
            settings_obj = SiteSettings(
                company_name="Riddhi Siddhi Arts & Crafts",
                proprietor="Ghanshyam Agarwal",
                phone="+91-7942625339",
                email="info@sandalwoodhandicraft.com",
                gst_number="08ADOPA9061E1ZK",
                address="Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India",
                latitude="26.87013",
                longitude="75.77491",
                map_embed_url="https://maps.google.com/maps?q=26.87013,75.77491&z=15&output=embed",
                social_links={
                    "whatsapp": "+917942625339",
                    "facebook": "https://facebook.com",
                    "instagram": "https://instagram.com",
                    "youtube": "https://youtube.com"
                },
                logo_url="/static/uploads/general/logo_template_photo_1.png",
                seo_meta={
                    "meta_title": "Riddhi Siddhi Arts & Crafts | Sandalwood Handicrafts Jaipur",
                    "meta_description": "Manufacturer, Exporter & Supplier of authentic Indian Sandalwood Handicrafts, Malas, Japa Malas, Elephants & Beads in Jaipur."
                }
            )
            session.add(settings_obj)

        # About Blocks
        about_data = [
            {
                "block_key": "company_profile",
                "title": "Heritage Sandalwood Artisans Since Establishment",
                "content": "Riddhi Siddhi Arts & Crafts has carved a niche as one of the prime Manufacturers, Exporters, Traders, Suppliers and Wholesalers of White Wood Handicrafts, Elephant Statues, Sandalwood Beads, Decorative Wooden Handicrafts, and Decorative Items. With the help of high tech tools and a master creative team in Jaipur, Rajasthan, we have been offering par excellence products to global clients."
            },
            {
                "block_key": "services",
                "title": "Bespoke Services & Export Quality",
                "content": "We offer complete Buyer Label Service, Custom Design Service, and OEM Service. We cater to bulk wholesale demands across India and international export markets including USA, UK, Europe, Middle East, Japan, and Southeast Asia."
            },
            {
                "block_key": "quality_assurance",
                "title": "Authentic Mysore Sandalwood Guarantee",
                "content": "Every piece of Sandalwood is ethically sourced from certified Indian Mysore reserves (Santalum Album), known globally for superior rich aroma, cooling properties, and high aromatic oil content."
            }
        ]

        await session.execute(delete(AboutBlock))
        for idx, ab in enumerate(about_data, 1):
            session.add(AboutBlock(
                block_key=ab["block_key"],
                title=ab["title"],
                content=ab["content"],
                images=["/static/uploads/general/logo_template_photo_1.png"],
                display_order=idx
            ))

        await session.commit()
        print("Database seed completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
