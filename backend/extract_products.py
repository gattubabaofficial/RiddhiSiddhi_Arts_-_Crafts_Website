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
    
    # Anchor id / slug source
    sec_id = sec.get("id", "")
    
    # Images - check main image and thumbnails
    images = []
    
    # Main image
    main_img = sec.select_one(".pdp_img img")
    if main_img:
        src = main_img.get("dataimg") or main_img.get("src")
        if src and not src.startswith("data:"):
            images.append(src)
            
    # Thumbnails
    for th in sec.select(".pdp_thmb img"):
        src = th.get("dataimg") or th.get("src") or th.get("data-src")
        if src and not src.startswith("data:") and src not in images:
            images.append(src)
            
    # Also check any other img tags inside the section
    for img in sec.find_all("img"):
        src = img.get("dataimg") or img.get("src")
        if src and not src.startswith("data:") and src not in images:
            # filter out icons or logos
            if "logo" not in src.lower() and "icon" not in src.lower():
                images.append(src)

    # Price & MOQ
    price = ""
    moq = ""
    
    price_tag = sec.select_one(".prc_pdp, .price, .jk-price, span.fw-bold")
    # Search for price text like ₹ 190 / Piece
    for el in sec.find_all(["span", "p", "div"], class_=lambda c: c and any(k in c.lower() for k in ["prc", "price", "pdp_prc"])):
        txt = el.get_text(strip=True)
        if "₹" in txt or "Rs" in txt:
            price = txt
            break
            
    moq_tag = sec.find(string=re.compile(r"Minimum Order Quantity|MOQ", re.I))
    if moq_tag:
        # Usually inside a table or next sibling
        parent = moq_tag.parent
        moq = parent.get_text(strip=True)

    # Specifications table
    specs = []
    # Tables in pdp
    table = sec.find("table")
    if table:
        for row in table.find_all("tr"):
            cols = [td.get_text(strip=True) for td in row.find_all(["td", "th"])]
            if len(cols) == 2:
                specs.append({"label": cols[0], "value": cols[1]})
            elif len(cols) > 2:
                # sometimes 4 columns (key, val, key, val)
                for i in range(0, len(cols), 2):
                    if i+1 < len(cols) and cols[i]:
                        specs.append({"label": cols[i], "value": cols[i+1]})

    # Description
    desc_p = sec.select_one(".pdp_desc, .prod_desc, .des_box, .fs14.lh24, p.clr3")
    desc = ""
    if desc_p:
        desc = desc_p.get_text(strip=True)
    else:
        # look for any paragraphs after table
        ps = [p.get_text(strip=True) for p in sec.find_all("p") if len(p.get_text(strip=True)) > 40]
        if ps:
            desc = "\n\n".join(ps)

    parsed_products.append({
        "id": sec_id,
        "title": title,
        "price": price,
        "moq": moq,
        "specs": specs,
        "description": desc,
        "images": images
    })

print(f"Parsed {len(parsed_products)} products.")
print("\nSample Product 1:")
print(json.dumps(parsed_products[0], indent=2, ensure_ascii=False))
if len(parsed_products) > 1:
    print("\nSample Product 2:")
    print(json.dumps(parsed_products[1], indent=2, ensure_ascii=False))
