import os
import re
import json
from bs4 import BeautifulSoup

content_path = r"C:\Users\Dell\.gemini\antigravity-ide\brain\8b8033e9-9630-4be1-85f6-e06060080089\.system_generated\steps\9\content.md"
with open(content_path, "r", encoding="utf-8") as f:
    raw = f.read()

soup = BeautifulSoup(raw, "html.parser")
sections = soup.find_all("section", class_="pdp_img_txt")

parsed_products = []

for idx, sec in enumerate(sections, 1):
    # Title
    h3 = sec.find("h3")
    title = h3.get_text(strip=True) if h3 else f"Product {idx}"
    
    # ID/Anchor
    sec_id = sec.get("id", "") or f"product-{idx}"
    
    # Images - find all high quality images
    images = []
    
    # Main image
    for img in sec.select(".pdp_img img, .pdp_thmb img"):
        src = img.get("dataimg") or img.get("src") or img.get("data-src")
        if src and not src.startswith("data:"):
            # High-res replacement if it has 120x120 or 250x250 or 500x500
            # IndiaMART images are like: .../2974090/sandalwood-mala-beads-500x500.jpg or -120x120.jpg -> replace with 500x500
            src = re.sub(r'-\d+x\d+\.', '-500x500.', src)
            if src not in images:
                images.append(src)
                
    for img in sec.find_all("img"):
        src = img.get("dataimg") or img.get("src")
        if src and not src.startswith("data:"):
            if "logo" not in src.lower() and "icon" not in src.lower() and "banner" not in src.lower():
                src = re.sub(r'-\d+x\d+\.', '-500x500.', src)
                if src not in images:
                    images.append(src)

    # Price
    price = ""
    # Look for price element
    prc_elem = sec.find(class_=lambda c: c and any(k in str(c).lower() for k in ["prc", "price"]))
    if prc_elem:
        price = prc_elem.get_text(strip=True)
    else:
        # Search text with ₹
        for el in sec.find_all(["span", "p", "div", "b"]):
            txt = el.get_text(strip=True)
            if "₹" in txt and len(txt) < 40 and not any(w in txt.lower() for w in ["call", "gst", "phone"]):
                price = txt
                break

    # MOQ
    moq = ""
    for el in sec.find_all(["span", "p", "div", "td", "li"]):
        txt = el.get_text(strip=True)
        if "MOQ" in txt or "Minimum Order Quantity" in txt:
            moq = txt.replace("Minimum Order Quantity", "").replace("MOQ", "").replace(":", "").strip()
            if moq:
                break

    # Specs table
    specs = []
    table = sec.find("table")
    if table:
        for row in table.find_all("tr"):
            tds = row.find_all(["td", "th"])
            if len(tds) == 2:
                lbl = tds[0].get_text(strip=True).rstrip(":")
                val = tds[1].get_text(strip=True)
                if lbl and val:
                    specs.append({"label": lbl, "value": val})
            elif len(tds) >= 4:
                for i in range(0, len(tds), 2):
                    if i + 1 < len(tds):
                        lbl = tds[i].get_text(strip=True).rstrip(":")
                        val = tds[i+1].get_text(strip=True)
                        if lbl and val:
                            specs.append({"label": lbl, "value": val})

    # Description
    desc = ""
    # In TDW template, description is often in a div with clr3 or pdp_desc or paragraph
    desc_div = sec.find("p", class_=lambda c: c and "clr3" in c) or sec.find("div", class_=lambda c: c and "desc" in str(c).lower())
    if desc_div:
        desc = desc_div.get_text(separator="\n", strip=True)
    if not desc:
        ps = [p.get_text(strip=True) for p in sec.find_all("p") if len(p.get_text(strip=True)) > 30 and "GST" not in p.get_text() and "Call" not in p.get_text()]
        desc = "\n\n".join(ps)

    # Short description
    short_desc = desc[:200] + "..." if len(desc) > 200 else desc
    if not short_desc and specs:
        spec_summary = ", ".join([f"{s['label']}: {s['value']}" for s in specs[:4]])
        short_desc = f"Authentic handcrafted {title}. {spec_summary}."

    # If moq was not found separately, check specs
    if not moq:
        for s in specs:
            if "minimum order quantity" in s["label"].lower() or "moq" in s["label"].lower():
                moq = s["value"]
                break

    parsed_products.append({
        "index": idx,
        "id": sec_id,
        "title": title,
        "price": price if price else "Ask for Price",
        "moq": moq if moq else "10 Pieces",
        "images": images,
        "specs": specs,
        "short_description": short_desc,
        "long_description": desc if desc else short_desc,
    })

out_file = r"c:\Users\Dell\Desktop\Riddhi Siddhi Arts and crafts website\backend\extracted_products.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(parsed_products, f, indent=2, ensure_ascii=False)

print(f"Successfully extracted {len(parsed_products)} products to {out_file}")
