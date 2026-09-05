import os
from bs4 import BeautifulSoup
import json
import re

content_path = r"C:\Users\Dell\.gemini\antigravity-ide\brain\8b8033e9-9630-4be1-85f6-e06060080089\.system_generated\steps\9\content.md"
with open(content_path, "r", encoding="utf-8") as f:
    raw = f.read()

# Strip metadata prefix if any
html_start = raw.find("<!DOCTYPE html>")
if html_start != -1:
    html = raw[html_start:]
else:
    html = raw

soup = BeautifulSoup(html, "html.parser")

# In IndiaMART/TDW category pages, products are listed in sections.
# Let's find product containers. Often they have class `pdp_box`, `jk-pdp-box`, `pro_box`, or an id.
# Let's inspect divs inside the main right column (.col-md-9 or similar).

col9 = soup.find("div", class_=lambda c: c and "col-md-9" in c)
if not col9:
    # let's search all divs with an id that have an image and title
    print("No col-md-9 found, checking general containers")

# Let's find all product titles (often h2, h3 or links with product titles)
products = []

# Let's look for product blocks
for card in soup.find_all("div", class_=lambda c: c and any(k in c.lower() for k in ["pdp_box", "jk-box", "pro-box", "pro_card", "pro_list", "item_list", "col-md-9"])):
    print("Found container class:", card.get("class"))

# Let's inspect all h2/h3 tags in the page
print("\n--- ALL H2/H3 TAGS ---")
for h in soup.find_all(["h2", "h3"]):
    text = h.get_text(strip=True)
    parent = h.find_parent("div")
    # check if there is an image in or near parent
    img = parent.find("img") if parent else None
    img_url = (img.get("dataimg") or img.get("src")) if img else ""
    print(f"[{h.name}] {text} | Parent classes: {parent.get('class') if parent else None} | Img: {img_url[:60] if img_url else 'None'}")

