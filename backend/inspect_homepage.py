import os
import re
import json
from bs4 import BeautifulSoup

home_path = r"C:\Users\Dell\.gemini\antigravity-ide\brain\8b8033e9-9630-4be1-85f6-e06060080089\.system_generated\steps\70\content.md"
with open(home_path, "r", encoding="utf-8") as f:
    raw = f.read()

soup = BeautifulSoup(raw, "html.parser")

print("Homepage Title:", soup.title.string if soup.title else "")

# Find banners / carousel images
banner_imgs = []
for el in soup.select(".ps-banner, .jk-banner, .carousel, .slider, .banner, .swiper-slide, [class*='banner'], [class*='slider']"):
    for img in el.find_all("img"):
        src = img.get("dataimg") or img.get("src")
        if src and not src.startswith("data:") and src not in banner_imgs:
            banner_imgs.append(src)

# Also check for all banner images matching imimg / seller / banner
for img in soup.find_all("img"):
    src = img.get("dataimg") or img.get("src") or ""
    if any(k in src.lower() for k in ["banner", "slider", "slide", "carousel", "hero", "header"]):
        if src not in banner_imgs and not src.startswith("data:"):
            banner_imgs.append(src)

print(f"Banner images found ({len(banner_imgs)}):")
for b in banner_imgs:
    print(" -", b)

# Find all category links on homepage
cat_links = []
for a in soup.find_all("a", href=True):
    href = a["href"]
    text = a.get_text(strip=True)
    if href.endswith(".html") and not href.startswith("http") and text and "#" not in href:
        if (text, href) not in cat_links:
            cat_links.append((text, href))

print(f"\nAll Category/Page links found ({len(cat_links)}):")
for t, h in cat_links:
    print(f" - {t}: {h}")

# Video reels / YouTube links
videos = []
for iframe in soup.find_all("iframe"):
    src = iframe.get("src", "")
    if "youtube" in src or "youtu.be" in src:
        videos.append(src)

for a in soup.find_all("a", href=True):
    href = a["href"]
    if "youtube.com" in href or "youtu.be" in href:
        videos.append(href)

for onclick in soup.find_all(attrs={"onclick": re.compile(r"playVideoInDiv|youtube", re.I)}):
    match = re.search(r"playVideoInDiv\(['\"]([^'\"]+)['\"]\)", onclick["onclick"])
    if match:
        v_id = match.group(1)
        videos.append(f"https://www.youtube.com/embed/{v_id}")

print(f"\nVideos found ({len(videos)}):", list(set(videos)))

