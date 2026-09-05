from bs4 import BeautifulSoup
import re
import json

path = r"C:\Users\Dell\.gemini\antigravity-ide\brain\8b8033e9-9630-4be1-85f6-e06060080089\.system_generated\steps\80\content.md"
with open(path, "r", encoding="utf-8") as f:
    raw = f.read()

soup = BeautifulSoup(raw, "html.parser")

print("Title:", soup.title.string if soup.title else "")

categories = []
for a in soup.find_all("a", href=True):
    href = a["href"]
    # check category boxes
    h3 = a.find(["h2", "h3", "h4", "h5"])
    img = a.find("img")
    if href.endswith(".html") and not href.startswith("http") and h3:
        cat_name = h3.get_text(strip=True)
        img_src = (img.get("dataimg") or img.get("src") or "") if img else ""
        categories.append({
            "name": cat_name,
            "url": f"https://www.sandalwoodhandicrafts.com/{href}",
            "slug": href.replace(".html", ""),
            "image": img_src
        })

# Also check any category grids / lists
for card in soup.select(".col-md-3, .col-md-4, .ps-product, .card, .pdp_box, .category-box, .jk-category"):
    h = card.find(["h2", "h3", "h4", "h5", "a"])
    img = card.find("img")
    a = card.find("a", href=True)
    if a and h:
        href = a["href"]
        if href.endswith(".html") and not href.startswith("http") and "profile" not in href and "video" not in href:
            name = h.get_text(strip=True)
            img_src = (img.get("dataimg") or img.get("src") or "") if img else ""
            if name and not any(c["slug"] == href.replace(".html", "") for c in categories):
                categories.append({
                    "name": name,
                    "url": f"https://www.sandalwoodhandicrafts.com/{href}",
                    "slug": href.replace(".html", ""),
                    "image": img_src
                })

print(f"Categories found ({len(categories)}):")
for c in categories:
    print(f" - {c['name']} -> {c['url']} | Img: {c['image'][:60]}")
