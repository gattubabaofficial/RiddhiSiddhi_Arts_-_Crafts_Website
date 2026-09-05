from bs4 import BeautifulSoup
import json

content_path = r"C:\Users\Dell\.gemini\antigravity-ide\brain\8b8033e9-9630-4be1-85f6-e06060080089\.system_generated\steps\9\content.md"
with open(content_path, "r", encoding="utf-8") as f:
    raw = f.read()

soup = BeautifulSoup(raw, "html.parser")

sections = soup.find_all("section", class_="pdp_img_txt")
print(f"Total product sections found on this page: {len(sections)}")

if sections:
    first = sections[0]
    print("\n--- FIRST SECTION PRETTY PRINT ---")
    print(first.prettify())
