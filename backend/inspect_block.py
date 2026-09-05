from bs4 import BeautifulSoup
import json

content_path = r"C:\Users\Dell\.gemini\antigravity-ide\brain\8b8033e9-9630-4be1-85f6-e06060080089\.system_generated\steps\9\content.md"
with open(content_path, "r", encoding="utf-8") as f:
    raw = f.read()

soup = BeautifulSoup(raw, "html.parser")

# Let's inspect the h3 elements and their siblings / parent blocks
h3s = soup.find_all("h3")
for i, h3 in enumerate(h3s[:3]):
    print(f"\n================ PRODUCT {i+1}: {h3.get_text(strip=True)} ================")
    # Find container
    # Let's traverse upwards or check siblings
    container = h3.find_parent("div", class_=lambda c: c and ("row" in c or "pdp" in c or "card" in c or "box" in c))
    # print all images inside this product section
    # Let's find the section or parent containing this h3 up to the next h3
    parent = h3.parent
    # Let's see what is inside container
    print("Container tag:", parent.name, parent.get("class"), parent.get("id"))
    
    # Let's find the closest encompassing product block
    # Often each product is inside a div with class or id
    cur = h3
    while cur and cur.name != "body":
        if cur.name == "div" and (cur.get("id") or "pdp" in str(cur.get("class")) or "item" in str(cur.get("class"))):
            # check if it has multiple h3s
            if len(cur.find_all("h3")) == 1:
                break
        cur = cur.parent
    
    if cur and cur != soup.body:
        print("Found discrete product block:", cur.name, cur.get("id"), cur.get("class"))
        print("HTML snippet (first 1000 chars):\n", cur.prettify()[:1000])
    else:
        print("Could not isolate single product block, printing parent:\n", parent.prettify()[:1000])
