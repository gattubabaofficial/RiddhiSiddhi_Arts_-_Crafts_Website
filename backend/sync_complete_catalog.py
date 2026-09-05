import os
import re
import json
import asyncio
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from sqlalchemy import select, delete
from app.core.database import AsyncSessionLocal, init_db
from app.core.security import get_password_hash
from app.models import (
    AdminUser, Category, Product, Review, Enquiry, Reel,
    HeroBanner, Collaboration, HomeSection, AboutBlock, SiteSettings
)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

BASE_URL = "http://www.sandalwoodhandicraft.com/"

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_PRODUCTS = os.path.join(BACKEND_DIR, "uploads", "products")
UPLOADS_BANNERS = os.path.join(BACKEND_DIR, "uploads", "banners")
UPLOADS_GENERAL = os.path.join(BACKEND_DIR, "uploads", "general")

os.makedirs(UPLOADS_PRODUCTS, exist_ok=True)
os.makedirs(UPLOADS_BANNERS, exist_ok=True)
os.makedirs(UPLOADS_GENERAL, exist_ok=True)

ROOT_UPLOADS_PRODUCTS = os.path.join(os.path.dirname(BACKEND_DIR), "uploads", "products")
ROOT_UPLOADS_BANNERS = os.path.join(os.path.dirname(BACKEND_DIR), "uploads", "banners")
ROOT_UPLOADS_GENERAL = os.path.join(os.path.dirname(BACKEND_DIR), "uploads", "general")
os.makedirs(ROOT_UPLOADS_PRODUCTS, exist_ok=True)
os.makedirs(ROOT_UPLOADS_BANNERS, exist_ok=True)
os.makedirs(ROOT_UPLOADS_GENERAL, exist_ok=True)

def clean_text(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def download_image(img_url, folder, prefix=""):
    if not img_url or img_url.startswith("data:"):
        return None
    try:
        high_res_url = re.sub(r'-\d+x\d+\.', '-500x500.', img_url)
        high_res_url = re.sub(r'_\d+x\d+\.', '_500x500.', high_res_url)
        high_res_url = high_res_url.split("?")[0]

        filename = os.path.basename(high_res_url)
        if prefix:
            filename = f"{prefix}_{filename}"
        filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)

        local_path = os.path.join(folder, filename)
        rel_folder = os.path.basename(folder)
        public_path = f"/static/uploads/{rel_folder}/{filename}"

        if os.path.exists(local_path) and os.path.getsize(local_path) > 1000:
            return public_path

        resp = requests.get(high_res_url, headers=HEADERS, timeout=12)
        if resp.status_code != 200:
            resp = requests.get(img_url, headers=HEADERS, timeout=12)

        if resp.status_code == 200 and len(resp.content) > 200:
            with open(local_path, "wb") as f:
                f.write(resp.content)
            
            # Mirror
            if rel_folder == "banners":
                mirror_dir = ROOT_UPLOADS_BANNERS
            elif rel_folder == "general":
                mirror_dir = ROOT_UPLOADS_GENERAL
            else:
                mirror_dir = ROOT_UPLOADS_PRODUCTS

            with open(os.path.join(mirror_dir, filename), "wb") as f:
                f.write(resp.content)

            return public_path
    except Exception as e:
        print(f"Image download skip ({img_url}): {e}")
    return img_url

def get_banners_and_logo():
    print("[1/3] Preparing Banners & Logo...")
    banner_urls = [
        "https://cpimg.tistatic.com//47962/6/template_photo_2.jpg",
        "https://cpimg.tistatic.com//47962/6/template_photo_3.jpg",
        "https://cpimg.tistatic.com//47962/6/template_photo_4.jpg",
        "https://cpimg.tistatic.com//47962/6/template_photo_5.jpg",
        "https://cpimg.tistatic.com//47962/6/template_photo_6.jpg",
    ]

    banner_meta = [
        {
            "heading": "Authentic Mysore Sandalwood Handicrafts & Malas",
            "subheading": "Jaipur's leading manufacturer & exporter of certified pure Chandan artifacts, Japa malas, handcarved elephants & beads.",
            "cta_label": "Explore Sandalwood Catalog",
            "cta_link": "/products/sandalwood-beads"
        },
        {
            "heading": "Royal Handcrafted Sandalwood Rosaries & Japa Malas",
            "subheading": "108 beads natural aromatic malas meticulously hand-strung for meditation, temple rituals, and spiritual chanting.",
            "cta_label": "Browse Rosary Malas",
            "cta_link": "/products/sandalwood-rosary"
        },
        {
            "heading": "Exquisite Sandalwood Carved Bracelets & Jewelry",
            "subheading": "Artisanal wrist malas, intricately carved deity charms, and luxury aromatic wooden jewelry crafted in Rajasthan.",
            "cta_label": "View Jewelry Collection",
            "cta_link": "/products/crafted-sandalwood-jewelery"
        },
        {
            "heading": "Pure Sandalwood Loose Beads & Semi Finished Craft",
            "subheading": "Calibrated beads from 4mm to 22mm with rich natural essential oil content for global wholesale export.",
            "cta_label": "Explore Loose Beads",
            "cta_link": "/products/sandalwood-beads-semi-finished"
        },
        {
            "heading": "Masterpiece Sandalwood & Whitewood Handicrafts",
            "subheading": "Traditional Rajasthani elephant statues, flower pots, religious idols, and bespoke royal gift collections.",
            "cta_label": "View Handicrafts",
            "cta_link": "/products/whitewood-handicrafts"
        }
    ]

    banners = []
    for idx, (b_url, meta) in enumerate(zip(banner_urls, banner_meta), 1):
        local_img = download_image(b_url, UPLOADS_BANNERS, prefix=f"hero_banner_{idx}")
        banners.append({
            "image_url": local_img,
            "heading": meta["heading"],
            "subheading": meta["subheading"],
            "cta_label": meta["cta_label"],
            "cta_link": meta["cta_link"],
            "display_order": idx,
            "is_active": True
        })

    logo_url = download_image("https://cpimg.tistatic.com//47962/6/template_photo_1.png", UPLOADS_GENERAL, prefix="logo")
    return banners, logo_url

def scrape_all_categories_and_products():
    print("\n[2/3] Crawling all 19 categories from http://www.sandalwoodhandicraft.com/...")
    categories_def = [
        {"name": "Sandalwood Beads", "href": "sandalwood-beads.html"},
        {"name": "Sandalwood Rosary", "href": "sandalwood-rosary-.html"},
        {"name": "Crafted Sandalwood Jewelery", "href": "crafted-sandalwood-jewelery.html"},
        {"name": "Sandalwood Beads Semi Finished", "href": "sandalwood-beads-semi-finished.html"},
        {"name": "Sandalwood Bracelet", "href": "sandalwood-bracelet.html"},
        {"name": "Religious Handicraft Sandalwood", "href": "religious-handicraft-sandalwood-.html"},
        {"name": "Sandalwood Jewellery", "href": "sandalwood-jewellery.html"},
        {"name": "Sandalwood Carvings Bracelets", "href": "sandalwood-carvings-bracelets.html"},
        {"name": "Sandalwood Ornaments", "href": "sandalwood-ornaments.html"},
        {"name": "Religious Sandalwood Jewellery", "href": "religious-sandalwood-jewellery.html"},
        {"name": "Sandalwood Product", "href": "sandalwood-product.html"},
        {"name": "Sandalwood Gift Items", "href": "sandalwood-gift-items.html"},
        {"name": "Sandalwood Beads Bracelet", "href": "sandalwood-beads-bracelet.html"},
        {"name": "Sandalwood Religious God Statues", "href": "sandalwood-religious-god-statues.html"},
        {"name": "Whitewood Handicrafts", "href": "whitewood-handicrafts.html"},
        {"name": "Wooden Jewellery", "href": "wooden-jewellery.html"},
        {"name": "Sandalwood Hand Chain", "href": "sandalwood-hand-chain-5784989.html"},
        {"name": "Wooden Beads", "href": "wooden-beads.html"},
        {"name": "Natural Brown Wooden Beads", "href": "natural-brown-wooden-beads.html"}
    ]

    all_categories = []
    global_seen_slugs = set()
    total_products_count = 0

    for cat in categories_def:
        cat_name = cat["name"]
        cat_slug = slugify(cat_name)
        url = urljoin(BASE_URL, cat["href"])

        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            soup = BeautifulSoup(resp.text, "html.parser")
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            soup = BeautifulSoup("", "html.parser")

        # Map product ID to image
        image_map = {}
        for img in soup.find_all("img"):
            src = img.get("src") or img.get("data-src") or img.get("dataimg")
            alt = img.get("alt", "")
            if src and "cpimg.tistatic.com/" in src:
                m = re.search(r"cpimg\.tistatic\.com/(\d+)/", src)
                if m:
                    pid = m.group(1).lstrip("0")
                    image_map[pid] = (src, alt)

        prods_in_cat = []
        seen_in_cat = set()

        for a in soup.find_all("a", href=re.compile(r"-(\d+)\.html")):
            href = a["href"]
            m = re.search(r"-(\d+)\.html", href)
            if not m:
                continue
            pid = m.group(1).lstrip("0")

            title = clean_text(a.get_text())
            if (not title or title.lower() in ["product image", "view more", "more", "details", ""]) and pid in image_map:
                alt_txt = clean_text(image_map[pid][1])
                if alt_txt and alt_txt.lower() not in ["product image", "product", "done", "send inq"]:
                    title = alt_txt

            if not title or len(title) < 3 or title.lower() in ["product image", "send sms", "send inquiry", "read more", "terms of use"]:
                continue

            base_slug = slugify(title)
            if not base_slug or base_slug in seen_in_cat:
                continue
            seen_in_cat.add(base_slug)

            prod_slug = base_slug
            count = 1
            while prod_slug in global_seen_slugs:
                prod_slug = f"{base_slug}-{count}"
                count += 1
            global_seen_slugs.add(prod_slug)

            # Get image
            img_data = image_map.get(pid)
            raw_img_url = img_data[0] if img_data else None

            local_img = None
            if raw_img_url:
                local_img = download_image(raw_img_url, UPLOADS_PRODUCTS, prefix=f"{prod_slug}")

            # Specs
            specs = [
                {"label": "Wood Origin", "value": "Mysore, Karnataka / Jaipur Art Studio" if "sandal" in cat_name.lower() or "sandal" in title.lower() else "Natural Fine Hardwood"},
                {"label": "Material", "value": "100% Genuine Natural Sandalwood (Santalum Album)" if "sandal" in cat_name.lower() or "sandal" in title.lower() else "White Wood / Rosewood / Hardwood"},
                {"label": "Craftsmanship", "value": "Handmade, Calibrated & Polished by Master Artisans"},
                {"label": "Aroma", "value": "Rich, Natural Long-Lasting Chandan Fragrance" if "sandal" in cat_name.lower() or "sandal" in title.lower() else "Natural Wood Grain"},
                {"label": "Export Purity", "value": "Grade-A Certified Artisanal Export Quality"}
            ]

            moq = "10 Pieces"
            if any(k in title.lower() for k in ["loose bead", "beads", "semi finished"]):
                moq = "100 Pieces"
            elif any(k in title.lower() for k in ["statue", "elephant", "ganesh", "idol", "flower pot"]):
                moq = "1 Piece"

            desc = f"Authentic handcrafted {title} manufactured and exported by Riddhi Siddhi Arts & Crafts, Jaipur. Hand-turned and carved using pure seasoned sandalwood with deep aromatic fragrance and exquisite craftsmanship."

            prods_in_cat.append({
                "title": title,
                "slug": prod_slug,
                "price": "Ask for Price",
                "currency": "INR",
                "moq": moq,
                "short_description": desc,
                "long_description": desc + " Ideal for spiritual chanting, temple worship, holistic meditation, luxury personal gifting, and global wholesale export.",
                "images": [local_img] if local_img else [],
                "specs": specs,
                "is_featured": len(prods_in_cat) < 3
            })

        print(f"[{len(all_categories)+1}/19] {cat_name}: {len(prods_in_cat)} products extracted")
        total_products_count += len(prods_in_cat)

        cat_image = prods_in_cat[0]["images"][0] if prods_in_cat and prods_in_cat[0]["images"] else None

        all_categories.append({
            "name": cat_name,
            "slug": cat_slug,
            "description": f"Authentic handcrafted {cat_name} made of genuine Mysore sandalwood and natural materials by master artisans of Jaipur.",
            "image_url": cat_image,
            "products": prods_in_cat
        })

    print(f"\nTotal extracted products across 19 categories: {total_products_count}")
    return all_categories

async def sync_all_to_db(banners, logo_url, categories_data):
    print("\n[3/3] Synchronizing all data to database...")
    await init_db()

    async with AsyncSessionLocal() as session:
        # Admin User
        admin_email = "admin@riddhisiddhi.com"
        res = await session.execute(select(AdminUser).where(AdminUser.email == admin_email))
        if not res.scalars().first():
            session.add(AdminUser(
                email=admin_email,
                password_hash=get_password_hash("admin123"),
                role="superadmin"
            ))
            print(f"Ensured Superadmin Account: {admin_email}")

        # Hero Banners
        await session.execute(delete(HeroBanner))
        for b in banners:
            session.add(HeroBanner(
                image_url=b["image_url"],
                heading=b["heading"],
                subheading=b["subheading"],
                cta_label=b["cta_label"],
                cta_link=b["cta_link"],
                display_order=b["display_order"],
                is_active=True
            ))

        # Clear existing categories & products for a clean, accurate import
        await session.execute(delete(Product))
        await session.execute(delete(Category))
        await session.flush()

        total_inserted_products = 0

        for cat_idx, cat in enumerate(categories_data, 1):
            category_obj = Category(
                name=cat["name"],
                slug=cat["slug"],
                image_url=cat["image_url"],
                description=cat["description"],
                display_order=cat_idx
            )
            session.add(category_obj)
            await session.flush()

            for p_idx, p in enumerate(cat["products"], 1):
                valid_images = [img for img in p["images"] if img]
                if not valid_images and category_obj.image_url:
                    valid_images = [category_obj.image_url]

                prod = Product(
                    category_id=category_obj.id,
                    title=p["title"],
                    slug=p["slug"],
                    price=p["price"],
                    currency=p["currency"],
                    moq=p["moq"],
                    short_description=p["short_description"],
                    long_description=p["long_description"],
                    images=valid_images,
                    videos=[],
                    is_featured=p.get("is_featured", False),
                    display_order=p_idx,
                    specs=p["specs"]
                )
                session.add(prod)
                total_inserted_products += 1

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
                logo_url=logo_url or "/static/uploads/general/logo_template_photo_1.png",
                seo_meta={
                    "meta_title": "Riddhi Siddhi Arts & Crafts | Sandalwood Handicrafts Jaipur",
                    "meta_description": "Manufacturer, Exporter & Supplier of authentic Indian Sandalwood Handicrafts, Malas, Japa Malas, Elephants & Beads in Jaipur."
                }
            )
            session.add(settings_obj)
        else:
            settings_obj.company_name = "Riddhi Siddhi Arts & Crafts"
            settings_obj.proprietor = "Ghanshyam Agarwal"
            settings_obj.gst_number = "08ADOPA9061E1ZK"
            settings_obj.address = "Plot 115, Mohan Nagar Triveni Nagar, Gopalpura By Pass Road, Jaipur - 302018, Rajasthan, India"
            if logo_url:
                settings_obj.logo_url = logo_url

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
                images=[logo_url] if logo_url else [],
                display_order=idx
            ))

        await session.commit()
        print(f"\nSUCCESS: Database populated with {len(categories_data)} Categories, {total_inserted_products} Products, and {len(banners)} Banners!")

def main():
    banners, logo_url = get_banners_and_logo()
    categories_data = scrape_all_categories_and_products()

    # Save to JSON
    backup_path = os.path.join(BACKEND_DIR, "all_scraped_products.json")
    with open(backup_path, "w", encoding="utf-8") as f:
        json.dump({
            "banners": banners,
            "logo": logo_url,
            "categories": categories_data
        }, f, indent=2, ensure_ascii=False)
    print(f"Saved JSON snapshot to {backup_path}")

    asyncio.run(sync_all_to_db(banners, logo_url, categories_data))

if __name__ == "__main__":
    main()
