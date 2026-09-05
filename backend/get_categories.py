from bs4 import BeautifulSoup
import re
import json

path = r"C:\Users\Dell\.gemini\antigravity-ide\brain\8b8033e9-9630-4be1-85f6-e06060080089\.system_generated\steps\9\content.md"
with open(path, "r", encoding="utf-8") as f:
    raw = f.read()

soup = BeautifulSoup(raw, "html.parser")

sbar_links = []
sbar = soup.find("ul", class_="sbar")
if sbar:
    for li in sbar.find_all("li", recursive=False):
        a = li.find("a")
        if a and a.get("href"):
            name = a.get_text(strip=True)
            href = a.get("href")
            # extract count if present like "Sandalwood Beads Mala (43)"
            sbar_links.append({"name": name, "href": href, "url": f"https://www.sandalwoodhandicrafts.com/{href}"})

print(f"Total categories in sidebar: {len(sbar_links)}")
for item in sbar_links:
    print(f" - {item['name']} -> {item['href']}")

# Save to json
with open(r"c:\Users\Dell\Desktop\Riddhi Siddhi Arts and crafts website\backend\categories_list.json", "w", encoding="utf-8") as f:
    json.dump(sbar_links, f, indent=2)
