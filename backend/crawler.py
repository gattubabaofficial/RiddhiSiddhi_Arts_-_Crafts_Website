import os
import re
import time
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

BASE_URL = "https://www.sandalwoodhandicrafts.com/"

# Output directories
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads", "products")
BANNERS_DIR = os.path.join(BACKEND_DIR, "uploads", "banners")
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(BANNERS_DIR, exist_ok=True)

def clean_text(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def clean_price(price_raw):
    if not price_raw:
        return "Ask for Price"
    p = clean_text(price_raw)
    p = p.replace("Get Latest Price", "").replace("Ask Price", "").strip()
    return p if p else "Ask for Price"

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def download_image(img_url, folder, prefix=""):
    if not img_url or img_url.startswith("data:"):
        return None
    try:
        # Normalize URL to 500x500 for maximum quality
        img_url = re.sub(r'-\d+x\d+\.', '-500x500.', img_url)
        img_url = re.sub(r'_\d+x\d+\.', '_500x500.', img_url)
        
        filename = os.path.basename(img_url.split("?")[0])
        if prefix:
            filename = f"{prefix}_{filename}"
        filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
        
        local_path = os.path.join(folder, filename)
        if os.path.exists(local_path) and os.path.getsize(local_path) > 1000:
            rel_folder = os.path.basename(folder)
            return f"/static/uploads/{rel_folder}/{filename}"
            
        resp = requests.get(img_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200 and len(resp.content) > 500:
            with open(local_path, "wb") as f:
                f.write(resp.content)
            rel_folder = os.path.basename(folder)
            return f"/static/uploads/{rel_folder}/{filename}"
    except Exception as e:
        print(f"Error downloading image {img_url}: {e}")
    return img_url  # fallback to original URL

def parse_category_page(url, category_name, category_slug):
    print(f"\n[Crawling] {category_name} -> {url}")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        if resp.status_code != 200:
            print(f"Failed to fetch {url}, status: {resp.status_code}")
            return []
        soup = BeautifulSoup(resp.text, "html.parser")
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

    sections = soup.find_all("section", class_="pdp_img_txt")
    print(f"Found {len(sections)} products in '{category_name}'")
    
    products = []
    seen_slugs = set()

    for idx, sec in enumerate(sections, 1):
        h3 = sec.find("h3")
        title = clean_text(h3.get_text()) if h3 else f"{category_name} Item {idx}"
        
        base_slug = slugify(title)
        slug = base_slug
        count = 1
        while slug in seen_slugs or not slug:
            slug = f"{base_slug}-{count}"
            count += 1
        seen_slugs.add(slug)

        # Video URL if any
        video_url = None
        for v in sec.find_all(attrs={"onclick": re.compile(r"playVideoInDiv", re.I)}):
            m = re.search(r"playVideoInDiv\(['\"]([^'\"]+)['\"]\)", v["onclick"])
            if m:
                video_url = f"https://www.youtube.com/embed/{m.group(1)}"
                break

        # Images
        raw_images = []
        for img in sec.select(".pdp_img img, .pdp_thmb img, img"):
            src = img.get("dataimg") or img.get("src") or img.get("data-src")
            if src and not src.startswith("data:") and "logo" not in src.lower() and "icon" not in src.lower():
                src = re.sub(r'-\d+x\d+\.', '-500x500.', src)
                if src not in raw_images:
                    raw_images.append(src)

        # Download images
        local_images = []
        for img_idx, r_img in enumerate(raw_images[:5]): # Top 5 high-res images per product
            local_img = download_image(r_img, UPLOADS_DIR, prefix=f"{slug}_{img_idx}")
            if local_img and local_img not in local_images:
                local_images.append(local_img)

        # Price
        price = ""
        prc_elem = sec.find(class_=lambda c: c and any(k in str(c).lower() for k in ["prc", "price"]))
        if prc_elem:
            price = clean_price(prc_elem.get_text())
        else:
            for el in sec.find_all(["span", "p", "div", "b"]):
                txt = el.get_text(strip=True)
                if "₹" in txt and len(txt) < 35 and not any(w in txt.lower() for w in ["call", "gst", "phone", "response"]):
                    price = clean_price(txt)
                    break
        if not price:
            price = "Ask for Price"

        # Specs
        specs = []
        table = sec.find("table")
        if table:
            for row in table.find_all("tr"):
                tds = row.find_all(["td", "th"])
                if len(tds) == 2:
                    lbl = clean_text(tds[0].get_text()).rstrip(":")
                    val = clean_text(tds[1].get_text())
                    if lbl and val:
                        specs.append({"label": lbl, "value": val})
                elif len(tds) >= 4:
                    for i in range(0, len(tds), 2):
                        if i + 1 < len(tds):
                            lbl = clean_text(tds[i].get_text()).rstrip(":")
                            val = clean_text(tds[i+1].get_text())
                            if lbl and val:
                                specs.append({"label": lbl, "value": val})

        # MOQ
        moq = "10 Pieces"
        for s in specs:
            if "minimum order quantity" in s["label"].lower() or "moq" in s["label"].lower():
                moq = s["value"]
                break
        if moq == "10 Pieces":
            for el in sec.find_all(["span", "p", "div", "td", "li"]):
                txt = el.get_text(strip=True)
                if "MOQ" in txt or "Minimum Order Quantity" in txt:
                    moq = clean_text(txt.replace("Minimum Order Quantity", "").replace("MOQ", "").replace(":", ""))
                    break

        # Description
        desc_div = sec.find("p", class_=lambda c: c and "clr3" in c) or sec.find("div", class_=lambda c: c and "desc" in str(c).lower())
        desc = ""
        if desc_div:
            desc = clean_text(desc_div.get_text(separator=" "))
        if not desc:
            ps = [clean_text(p.get_text()) for p in sec.find_all("p") if len(clean_text(p.get_text())) > 30 and "GST" not in p.get_text() and "Call" not in p.get_text()]
            desc = "\n\n".join(ps)

        short_desc = desc[:220] + "..." if len(desc) > 220 else desc
        if not short_desc and specs:
            spec_summary = ", ".join([f"{s['label']}: {s['value']}" for s in specs[:4]])
            short_desc = f"Authentic handcrafted {title}. {spec_summary}."

        products.append({
            "category_name": category_name,
            "category_slug": category_slug,
            "title": title,
            "slug": slug,
            "price": price,
            "moq": moq,
            "images": local_images if local_images else ["/static/uploads/products/default.jpg"],
            "specs": specs,
            "short_description": short_desc if short_desc else f"Authentic handcrafted {title} by Riddhi Siddhi Arts & Crafts.",
            "long_description": desc if desc else short_desc,
            "video_url": video_url,
            "is_featured": idx <= 2
        })

    return products

def main():
    # Load categories list
    categories_file = os.path.join(BACKEND_DIR, "categories_list.json")
    if os.path.exists(categories_file):
        with open(categories_file, "r", encoding="utf-8") as f:
            categories = json.load(f)
    else:
        categories = [
            {"name": "Sandalwood Beads Mala", "href": "sandalwood-beads-mala.html"},
            {"name": "Sandalwood Japa Mala", "href": "sandalwood-japa-mala.html"},
            {"name": "Sandalwood Beads", "href": "sandalwood-beads.html"},
            {"name": "Sandalwood Elephant", "href": "sandalwood-elephant.html"},
            {"name": "Sandalwood Semi Finished Beads", "href": "sandalwood-semi-finished-beads.html"},
            {"name": "Sandalwood Bracelet", "href": "sandalwood-bracelet.html"},
            {"name": "Sandalwood Religious Jewelry", "href": "sandalwood-religious-jewelry.html"},
            {"name": "Sandalwood Tashbih", "href": "sandalwood-tashbih.html"}
        ]

    # Select major categories to scrape
    # Let's take all the top sandalwood & handicraft categories
    target_categories = categories[:20]  # Scrape top 20 comprehensive categories

    all_products = []
    category_summary = []

    for cat in target_categories:
        raw_name = cat["name"]
        clean_name = re.sub(r'\s*\(\d+\)$', '', raw_name).strip()
        slug = cat["href"].replace(".html", "")
        url = urljoin(BASE_URL, cat["href"])
        
        prods = parse_category_page(url, clean_name, slug)
        all_products.extend(prods)
        
        # Category image from first product
        cat_img = prods[0]["images"][0] if prods and prods[0]["images"] else "/static/uploads/products/default.jpg"
        category_summary.append({
            "name": clean_name,
            "slug": slug,
            "image_url": cat_img,
            "description": f"Authentic handcrafted {clean_name} made of genuine Mysore sandalwood and natural materials by master artisans of Jaipur.",
            "product_count": len(prods)
        })
        time.sleep(1) # polite delay

    out_file = os.path.join(BACKEND_DIR, "all_scraped_products.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({
            "categories": category_summary,
            "products": all_products
        }, f, indent=2, ensure_ascii=False)

    print(f"\n==========================================")
    print(f"CRAWL COMPLETE!")
    print(f"Total Categories: {len(category_summary)}")
    print(f"Total Products: {len(all_products)}")
    print(f"Saved to: {out_file}")
    print(f"==========================================")

if __name__ == "__main__":
    main()
