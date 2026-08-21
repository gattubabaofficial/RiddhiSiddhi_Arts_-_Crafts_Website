import asyncio
import os
import shutil
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, init_db, Base, engine
from app.core.security import get_password_hash
from app.models import (
    AdminUser, Category, Product, Review, Enquiry, Reel,
    HeroBanner, Collaboration, HomeSection, AboutBlock, SiteSettings
)

async def seed_data():
    await init_db()

    async with AsyncSessionLocal() as session:
        # Check if Admin exists
        res = await session.execute(select(AdminUser).where(AdminUser.email == "admin@riddhisiddhi.com"))
        if not res.scalars().first():
            admin = AdminUser(
                email="admin@riddhisiddhi.com",
                password_hash=get_password_hash("admin123"),
                role="superadmin"
            )
            session.add(admin)
            print("Created superadmin: admin@riddhisiddhi.com / admin123")

        # Copy local whatsapp images if available
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "uploads"))
        os.makedirs(uploads_dir, exist_ok=True)

        copied_images = []
        for filename in os.listdir(root_dir):
            if filename.endswith((".jpeg", ".jpg", ".png")):
                src = os.path.join(root_dir, filename)
                dest_name = filename.replace(" ", "_")
                dest = os.path.join(uploads_dir, dest_name)
                shutil.copy2(src, dest)
                copied_images.append(f"/static/uploads/{dest_name}")

        default_img = copied_images[0] if copied_images else "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80"
        ele_img = copied_images[1] if len(copied_images) > 1 else "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
        mala_img = copied_images[2] if len(copied_images) > 2 else "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80"
        bead_img = copied_images[3] if len(copied_images) > 3 else "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"

        # Categories
        cat_data = [
            ("Sandalwood Beads Mala", "sandalwood-beads-mala", mala_img, "Authentic handcrafted Indian sandalwood bead malas with natural aromatic essence."),
            ("Sandalwood Japa Mala", "sandalwood-japa-mala", mala_img, "Sacred 108 bead Japa Malas carved out of premium white sandalwood."),
            ("Sandalwood Elephant", "sandalwood-elephant", ele_img, "Handcarved royal sandalwood elephant statues crafted by master artisans in Jaipur."),
            ("Sandalwood Beads", "sandalwood-beads", bead_img, "Loose natural sandalwood beads in multiple sizes from 4mm to 22mm."),
            ("Sandalwood Semi-Finished Beads", "sandalwood-semi-finished-beads", bead_img, "Semi-finished raw sandalwood beads ideal for custom jewelry crafting."),
            ("Sandalwood Bracelet", "sandalwood-bracelet", default_img, "Designer sandalwood round bead bracelets with stretchable and sterling fittings."),
            ("Sandalwood Religious Jewelry", "sandalwood-religious-jewelry", default_img, "Holy religious wristlets, pendants, and sacred wooden jewelry."),
            ("Sandalwood Tashbih", "sandalwood-tashbih", bead_img, "Hand-carved Sandalwood Muslim Misbahah / Tashbih prayer beads.")
        ]

        cat_map = {}
        for idx, (name, slug, img, desc) in enumerate(cat_data, 1):
            res = await session.execute(select(Category).where(Category.slug == slug))
            existing_cat = res.scalars().first()
            if not existing_cat:
                cat = Category(name=name, slug=slug, image_url=img, description=desc, display_order=idx)
                session.add(cat)
                await session.flush()
                cat_map[name] = cat.id
            else:
                cat_map[name] = existing_cat.id

        # Products (from Appendix A)
        products_data = [
            {
                "category": "Sandalwood Japa Mala",
                "title": "Sandalwood Japa Loose Mala Beads",
                "slug": "sandalwood-japa-loose-mala-beads",
                "price": "₹190/Piece",
                "moq": "50 Pieces",
                "short_description": "Pure Indian sandalwood Japa beads suitable for meditation and prayer.",
                "long_description": "Crafted from authentic Mysuru Indian Sandalwood, these 108 Japa loose mala beads retain their soothing, long-lasting natural fragrance. Available in sizes ranging from 4mm to 22mm.",
                "images": [mala_img, bead_img],
                "is_featured": True,
                "specs": [
                    {"label": "Wood Origin", "value": "Indian Sandalwood"},
                    {"label": "Bead Size Range", "value": "4mm - 22mm"},
                    {"label": "Total Beads", "value": "108 Beads"},
                    {"label": "Usage", "value": "Meditation / Japa / Rosary"}
                ]
            },
            {
                "category": "Sandalwood Bracelet",
                "title": "Chinese Sandalwood Bracelet",
                "slug": "chinese-sandalwood-bracelet",
                "price": "₹1,200/Piece",
                "moq": "10 Pieces",
                "short_description": "Aromatic 108 bead neck mala and wrist wrapper made of sandalwood.",
                "long_description": "Versatile multi-wrap sandalwood bracelet & neck mala. Finely polished finish showcasing natural wood grain texture.",
                "images": [default_img, bead_img],
                "is_featured": True,
                "specs": [
                    {"label": "Bead Size", "value": "4mm - 22mm"},
                    {"label": "Total Beads", "value": "108 Beads"},
                    {"label": "Type", "value": "Neck Mala / Multi-wrap Wristlet"}
                ]
            },
            {
                "category": "Sandalwood Beads Mala",
                "title": "Wood Craft Sandalwood Rosary Beads",
                "slug": "wood-craft-sandalwood-rosary-beads",
                "price": "₹250/Piece",
                "moq": "20 Pieces",
                "short_description": "20mm heavy wooden craft sandalwood rosary beads.",
                "long_description": "Handcrafted 20mm Indian Sandalwood beads strung into a sacred rosary mala. Perfect for spiritual practitioners and collectors.",
                "images": [mala_img],
                "is_featured": False,
                "specs": [
                    {"label": "Wood Origin", "value": "Indian Sandalwood"},
                    {"label": "Bead Size", "value": "20mm"},
                    {"label": "Total Beads", "value": "108 Beads"}
                ]
            },
            {
                "category": "Sandalwood Beads Mala",
                "title": "Sandalwood Beads Mala",
                "slug": "sandalwood-beads-mala-10mm",
                "price": "₹199/Piece",
                "moq": "25 Pieces",
                "short_description": "Standard 10mm 108 Indian sandalwood prayer mala.",
                "long_description": "Traditional 10mm sandalwood mala offering a mild natural aroma and smooth tactile feel during daily mantra chanting.",
                "images": [mala_img, default_img],
                "is_featured": True,
                "specs": [
                    {"label": "Wood Origin", "value": "Indian Sandalwood"},
                    {"label": "Bead Size", "value": "10mm"},
                    {"label": "Total Beads", "value": "108 Beads"}
                ]
            },
            {
                "category": "Sandalwood Religious Jewelry",
                "title": "Religious Bead Bracelets",
                "slug": "religious-bead-bracelets",
                "price": "₹1,000/Piece",
                "moq": "15 Pieces",
                "short_description": "Handcrafted religious wood sandalwood wristlet.",
                "long_description": "Sacred wrist jewelry carved out of fragrant sandalwood and hardwood, designed for elegance and spiritual harmony.",
                "images": [default_img],
                "is_featured": False,
                "specs": [
                    {"label": "Material", "value": "Natural Sandalwood & Hardwood"},
                    {"label": "Size", "value": "18"},
                    {"label": "Finish", "value": "Natural Matte Polish"}
                ]
            },
            {
                "category": "Sandalwood Bracelet",
                "title": "Sandalwood Round Beads Designer Bracelet",
                "slug": "sandalwood-round-beads-designer-bracelet",
                "price": "₹3,200/Piece",
                "moq": "5 Pieces",
                "short_description": "Luxury White Sandalwood designer wristlet.",
                "long_description": "Premium quality White Sandalwood beads crafted into an exquisite designer bracelet with silver accent spacers.",
                "images": [default_img, mala_img],
                "is_featured": True,
                "specs": [
                    {"label": "Material", "value": "White Sandalwood"},
                    {"label": "Bead Shape", "value": "Round Spherical"},
                    {"label": "Style", "value": "Designer Wristband"}
                ]
            },
            {
                "category": "Sandalwood Beads",
                "title": "Sandalwood Mala Beads",
                "slug": "sandalwood-mala-beads-8mm",
                "price": "₹180/Piece",
                "moq": "100 Pieces",
                "short_description": "8mm loose Indian sandalwood beads.",
                "long_description": "Pure 8mm sandalwood beads with central stringing hole for mala makers and jewelry artisans.",
                "images": [bead_img],
                "is_featured": False,
                "specs": [
                    {"label": "Wood Origin", "value": "Indian Sandalwood"},
                    {"label": "Bead Size", "value": "8mm"}
                ]
            },
            {
                "category": "Sandalwood Elephant",
                "title": "Handmade Wooden Elephant",
                "slug": "handmade-wooden-elephant-8-12-inch",
                "price": "₹2,500/Piece",
                "moq": "2 Pieces",
                "short_description": "8-12 inch Jaipuri handcrafted sandalwood elephant carving.",
                "long_description": "Detailed undercut lattice carving inside a single block of natural sandalwood depicting a royal Indian elephant.",
                "images": [ele_img, default_img],
                "is_featured": True,
                "specs": [
                    {"label": "Height", "value": "8 - 12 Inch"},
                    {"label": "Craftsmanship", "value": "Undercut Jali Carving"},
                    {"label": "Material", "value": "Sandalwood"}
                ]
            },
            {
                "category": "Sandalwood Elephant",
                "title": "Wooden Elephant Statue",
                "slug": "wooden-elephant-statue-4-8-inch",
                "price": "₹4,000/Piece",
                "moq": "1 Piece",
                "short_description": "Royal ornamental sandalwood elephant statue.",
                "long_description": "Master artisan carved sandalwood elephant figurine with intricate floral trunk motifs and polished tusks.",
                "images": [ele_img],
                "is_featured": True,
                "specs": [
                    {"label": "Height", "value": "4 - 8 Inch"},
                    {"label": "Material", "value": "Solid Sandalwood"},
                    {"label": "Origin", "value": "Jaipur, Rajasthan"}
                ]
            },
            {
                "category": "Sandalwood Tashbih",
                "title": "Sandalwood Muslim Misbahah Beads",
                "slug": "sandalwood-muslim-misbahah-beads",
                "price": "₹220/Piece",
                "moq": "30 Pieces",
                "short_description": "12mm 108 bead Islamic Tashbih prayer beads.",
                "long_description": "Beautifully carved 12mm sandalwood Tashbih prayer beads with traditional tassel divider for daily remembrance.",
                "images": [bead_img, mala_img],
                "is_featured": True,
                "specs": [
                    {"label": "Wood Origin", "value": "Indian Sandalwood"},
                    {"label": "Bead Size", "value": "12mm"},
                    {"label": "Total Beads", "value": "108 Beads / 99 Beads"}
                ]
            }
        ]

        for p in products_data:
            cat_id = cat_map.get(p["category"])
            if cat_id:
                res = await session.execute(select(Product).where(Product.slug == p["slug"]))
                if not res.scalars().first():
                    prod = Product(
                        category_id=cat_id,
                        title=p["title"],
                        slug=p["slug"],
                        price=p["price"],
                        currency="INR",
                        moq=p["moq"],
                        short_description=p["short_description"],
                        long_description=p["long_description"],
                        images=p["images"],
                        is_featured=p["is_featured"],
                        specs=p["specs"]
                    )
                    session.add(prod)

        # Hero Banners
        banners = [
            HeroBanner(
                image_url=mala_img,
                heading="Authentic Indian Sandalwood Handicrafts",
                subheading="Direct from Master Artisans of Jaipur, Rajasthan. Global Exporter of Malas, Elephants, Beads & Tashbih.",
                cta_label="Explore Catalog",
                cta_link="/products",
                display_order=1
            ),
            HeroBanner(
                image_url=ele_img,
                heading="Royal Handcarved Sandalwood Sculptures",
                subheading="Exquisite undercut lattice carving elefants and heritage decor pieces crafted with 100% genuine sandalwood.",
                cta_label="Request Custom Quote",
                cta_link="/contact",
                display_order=2
            )
        ]
        for b in banners:
            res = await session.execute(select(HeroBanner).where(HeroBanner.heading == b.heading))
            if not res.scalars().first():
                session.add(b)

        # Reviews
        reviews = [
            Review(
                user_name="Rajesh Sharma (Surat)",
                user_email="rajesh.surat@gmail.com",
                rating=5,
                text="Purchased 108 Japa Malas for our temple store. The natural sandalwood fragrance is rich, long-lasting, and 100% genuine. Prompt export packaging!",
                status="approved",
                featured_on_home=True
            ),
            Review(
                user_name="Alok Agarwal (Delhi)",
                user_email="alok.agarwal@outlook.com",
                rating=5,
                text="The wooden elephant statues from Ghanshyam Ji's workshop are true masterpieces of Jaipur craftsmanship. Highly recommend Riddhi Siddhi Arts!",
                status="approved",
                featured_on_home=True
            )
        ]
        for r in reviews:
            res = await session.execute(select(Review).where(Review.user_name == r.user_name))
            if not res.scalars().first():
                session.add(r)

        # Reels
        reels = [
            Reel(
                title="Artisans Handcarving Sandalwood Elephants in Jaipur",
                video_url="https://www.youtube.com/embed/dQw4w9WgXcQ",
                thumbnail_url=ele_img,
                is_trending=True,
                display_order=1
            ),
            Reel(
                title="Inspecting 108 Sandalwood Japa Beads Quality",
                video_url="https://www.youtube.com/embed/dQw4w9WgXcQ",
                thumbnail_url=mala_img,
                is_trending=True,
                display_order=2
            )
        ]
        for r in reels:
            res = await session.execute(select(Reel).where(Reel.title == r.title))
            if not res.scalars().first():
                session.add(r)

        # Collaborations & Certificates
        collabs = [
            Collaboration(title="Trustseal Verified Exporter", logo_url=default_img, display_order=1),
            Collaboration(title="GST Registered Business", logo_url=default_img, display_order=2),
            Collaboration(title="IEC (Import Export Code) Certified", logo_url=default_img, display_order=3)
        ]
        for c in collabs:
            res = await session.execute(select(Collaboration).where(Collaboration.title == c.title))
            if not res.scalars().first():
                session.add(c)

        # Site Settings
        res = await session.execute(select(SiteSettings))
        if not res.scalars().first():
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
                logo_url=copied_images[2] if len(copied_images) > 2 else None,
                seo_meta={
                    "meta_title": "Riddhi Siddhi Arts & Crafts | Sandalwood Handicrafts Jaipur",
                    "meta_description": "Manufacturer, Exporter & Supplier of authentic Indian Sandalwood Handicrafts, Malas, Japa Malas, Elephants & Beads in Jaipur."
                }
            )
            session.add(settings_obj)

        await session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
