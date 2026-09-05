import os
import re
import time
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

def clean_price(price_raw):
    if not price_raw:
        return "Ask for Price"
    p = clean_text(price_raw)
    p = p.replace("Get Latest Price", "").replace("Ask Price", "").strip()
    return p if p else "Ask for Price"

def download_image(img_url, folder, prefix=""):
    if not img_url or img_url.startswith("data:"):
        return None
    try:
        # Request high resolution image where possible
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

        resp = requests.get(high_res_url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            resp = requests.get(img_url, headers=HEADERS, timeout=15)

        if resp.status_code == 200 and len(resp.content) > 200:
            with open(local_path, "wb") as f:
                f.write(resp.content)
            
            # Mirror to root uploads
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
        print(f"Error downloading image {img_url}: {e}")
    return img_url

def scrape_homepage():
    print(f"\n[Scraping] Homepage & Banners: {BASE_URL}")
    resp = requests.get(BASE_URL, headers=HEADERS, timeout=15)

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

    downloaded_banners = []
    for idx, (b_url, meta) in enumerate(zip(banner_urls, banner_meta), 1):
        local_img = download_image(b_url, UPLOADS_BANNERS, prefix=f"hero_banner_{idx}")
        downloaded_banners.append({
            "image_url": local_img,
            "heading": meta["heading"],
            "subheading": meta["subheading"],
            "cta_label": meta["cta_label"],
            "cta_link": meta["cta_link"],
            "display_order": idx,
            "is_active": True
        })

    # Logo
    logo_url = "https://cpimg.tistatic.com//47962/6/template_photo_1.png"
    downloaded_logo = download_image(logo_url, UPLOADS_GENERAL, prefix="logo")

    return downloaded_banners, downloaded_logo

def scrape_categories():
    return [
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

def scrape_category_and_products(cat_info, global_seen_slugs):
    cat_name = cat_info["name"]
    slug = slugify(cat_name)
    url = urljoin(BASE_URL, cat_info["href"])
    print(f"\n[Crawling Category] {cat_name} -> {url}")

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(resp.text, "html.parser")
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return {
            "name": cat_name,
            "slug": slug,
            "description": f"Authentic handcrafted {cat_name} made of genuine Mysore sandalwood by master artisans of Jaipur.",
            "image_url": None,
            "products": []
        }

    # Index all images by product ID
    image_map = {}
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or img.get("dataimg")
        alt = img.get("alt", "")
        if src and "cpimg.tistatic.com/" in src:
            m = re.search(r"cpimg\.tistatic\.com/(\d+)/", src)
            if m:
                pid = m.group(1).lstrip("0")
                image_map[pid] = (src, alt)

    product_items = []
    seen_in_category = set()

    for a in soup.find_all("a", href=re.compile(r"-(\d+)\.html")):
        href = a["href"]
        m = re.search(r"-(\d+)\.html", href)
        if not m:
            continue
        pid = m.group(1).lstrip("0")

        title = clean_text(a.get_text())
        if (not title or title.lower() in ["product image", "view more", "more", "details"]) and pid in image_map:
            alt_txt = clean_text(image_map[pid][1])
            if alt_txt and alt_txt.lower() not in ["product image", "product"]:
                title = alt_txt

        if not title or len(title) < 3 or title.lower() in ["product image", "send sms", "send inquiry", "read more"]:
            continue

        base_slug = slugify(title)
        if not base_slug or base_slug in seen_in_category:
            continue
        seen_in_category.add(base_slug)

        prod_slug = base_slug
        count = 1
        while prod_slug in global_seen_slugs:
            prod_slug = f"{base_slug}-{count}"
            count += 1
        global_seen_slugs.add(prod_slug)

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

        # MOQ
        moq = "10 Pieces"
        if any(k in title.lower() for k in ["loose bead", "beads", "semi finished"]):
            moq = "100 Pieces"
        elif any(k in title.lower() for k in ["statue", "elephant", "ganesh", "idol", "flower pot"]):
            moq = "1 Piece"
        elif any(k in title.lower() for k in ["mala", "rosary", "tashbih", "necklace"]):
            moq = "10 Pieces"

        desc = f"Authentic handcrafted {title} manufactured and exported by Riddhi Siddhi Arts & Crafts, Jaipur. Hand-turned and carved using pure seasoned sandalwood with deep aromatic fragrance and exquisite craftsmanship."

        product_items.append({
            "title": title,
            "slug": prod_slug,
            "price": "Ask for Price",
            "currency": "INR",
            "moq": moq,
            "short_description": desc,
            "long_description": desc + " Ideal for spiritual chanting, temple worship, holistic meditation, luxury personal gifting, and global wholesale export.",
            "images": [local_img] if local_img else [],
            "specs": specs,
            "is_featured": len(product_items) < 3
        })

    print(f"-> Extracted {len(product_items)} authentic products for '{cat_name}'")

    cat_image = product_items[0]["images"][0] if product_items and product_items[0]["images"] else None

    return {
        "name": cat_name,
        "slug": slug,
        "description": f"Authentic handcrafted {cat_name} made of genuine Mysore sandalwood and natural materials by master artisans of Jaipur.",
        "image_url": cat_image,
        "products": product_items
    }

async def sync_database(all_categories_data, hero_banners, logo_url):
    await init_db()
    print("\n==========================================")
    print("SYNCING DATA TO DATABASE...")
    print("==========================================")

    async with AsyncSessionLocal() as session:
        # Admin check
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
        for b in hero_banners:
            session.add(HeroBanner(
                image_url=b["image_url"],
                heading=b["heading"],
                subheading=b["subheading"],
                cta_label=b["cta_label"],
                cta_link=b["cta_link"],
                display_order=b["display_order"],
                is_active=True
            ))
        print(f"Synced {len(hero_banners)} Hero Banners.")

        # Categories & Products
        total_prods = 0
        for cat_order, cat_data in enumerate(all_categories_data, 1):
            cat_slug = cat_data["slug"]
            cat_name = cat_data["name"]

            res = await session.execute(select(Category).where(Category.slug == cat_slug))
            cat_obj = res.scalars().first()

            if not cat_obj:
                cat_obj = Category(
                    name=cat_name,
                    slug=cat_slug,
                    image_url=cat_data["image_url"],
                    description=cat_data["description"],
                    display_order=cat_order
                )
                session.add(cat_obj)
                await session.flush()
            else:
                cat_obj.name = cat_name
                if cat_data["image_url"]:
                    cat_obj.image_url = cat_data["image_url"]
                cat_obj.description = cat_data["description"]
                cat_obj.display_order = cat_order
                await session.flush()

            # Insert / update products
            for p_order, p in enumerate(cat_data["products"], 1):
                p_slug = p["slug"]
                res = await session.execute(select(Product).where(Product.slug == p_slug))
                prod_obj = res.scalars().first()

                valid_imgs = [img for img in p["images"] if img]
                if not valid_imgs and cat_obj.image_url:
                    valid_imgs = [cat_obj.image_url]

                if not prod_obj:
                    prod_obj = Product(
                        category_id=cat_obj.id,
                        title=p["title"],
                        slug=p_slug,
                        price=p["price"],
                        currency=p["currency"],
                        moq=p["moq"],
                        short_description=p["short_description"],
                        long_description=p["long_description"],
                        images=valid_imgs,
                        videos=[],
                        is_featured=p.get("is_featured", False),
                        display_order=p_order,
                        specs=p["specs"]
                    )
                    session.add(prod_obj)
                else:
                    prod_obj.category_id = cat_obj.id
                    prod_obj.title = p["title"]
                    prod_obj.price = p["price"]
                    prod_obj.moq = p["moq"]
                    prod_obj.short_description = p["short_description"]
                    prod_obj.long_description = p["long_description"]
                    if valid_imgs:
                        prod_obj.images = valid_imgs
                    prod_obj.specs = p["specs"]
                    prod_obj.is_featured = p.get("is_featured", False)
                    prod_obj.display_order = p_order

                total_prods += 1

        print(f"Synced {len(all_categories_data)} Categories and {total_prods} Products.")

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
        print("Database sync completed successfully!")

def main():
    print("Starting full scrape & sync from http://www.sandalwoodhandicraft.com/...")
    hero_banners, logo_url = scrape_homepage()

    categories_list = scrape_categories()
    all_categories_data = []
    global_seen_slugs = set()

    for cat in categories_list:
        cat_data = scrape_category_and_products(cat, global_seen_slugs)
        all_categories_data.append(cat_data)
        time.sleep(0.5)

    backup_file = os.path.join(BACKEND_DIR, "all_scraped_products.json")
    with open(backup_file, "w", encoding="utf-8") as f:
        json.dump({
            "banners": hero_banners,
            "logo": logo_url,
            "categories": all_categories_data
        }, f, indent=2, ensure_ascii=False)
    print(f"\nSaved structured backup to {backup_file}")

    asyncio.run(sync_database(all_categories_data, hero_banners, logo_url))

if __name__ == "__main__":
    main()
