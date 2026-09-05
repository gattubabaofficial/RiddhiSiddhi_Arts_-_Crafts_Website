import requests
from bs4 import BeautifulSoup
import json

url = "https://www.sandalwoodhandicrafts.com/sandalwood-beads-mala.html"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.text, "html.parser")

print("Title:", soup.title.string if soup.title else "")

# Find category links from menu / sbar
categories = []
for a in soup.select(".sbar a, .mega-menu a"):
    href = a.get("href", "")
    text = a.get_text(strip=True)
    if href and href.endswith(".html") and not href.startswith("http") and text:
        categories.append((text, href))

print("Found links sample:", categories[:15])

# Find products on this page
# Let's inspect potential product blocks
product_blocks = soup.select(".ps-product, .pdp_box, .product-box, [id*='pdp'], .row .col-md-9 .row, .jk-product, .card, div[id]")
print("Checking product sections...")

# Let's find all headers or product containers
items = []
# On IndiaMart / TDW template, products often have h2/h3 or class product-heading-box or id
for h in soup.find_all(["h2", "h3", "h4"]):
    parent = h.find_parent("div")
    # print headers
    text = h.get_text(strip=True)
    if text:
        # check if it looks like a product
        img = parent.find("img") if parent else None
        # print(f"Header: {text} | Img: {img.get('src') or img.get('dataimg') if img else None}")

# Let's search for table or specs or product list divs
divs = soup.find_all("div", class_=lambda c: c and any(k in c.lower() for k in ["product", "item", "pdp", "listing"]))
print(f"Divs matching product keywords count: {len(divs)}")
for d in divs[:10]:
    print("Class:", d.get("class"), "ID:", d.get("id"))
