from bs4 import BeautifulSoup
import re

home_path = r"C:\Users\Dell\.gemini\antigravity-ide\brain\8b8033e9-9630-4be1-85f6-e06060080089\.system_generated\steps\70\content.md"
with open(home_path, "r", encoding="utf-8") as f:
    raw = f.read()

soup = BeautifulSoup(raw, "html.parser")

print("--- ALL IMG TAGS ON HOMEPAGE ---")
for img in soup.find_all("img"):
    src = img.get("dataimg") or img.get("src") or img.get("data-src")
    alt = img.get("alt", "")
    cls = img.get("class", "")
    print(f"SRC: {src} | ALT: {alt} | CLASS: {cls}")

print("\n--- ALL SECTIONS / DIVS WITH BACKGROUND IMAGES OR SLIDERS ---")
for el in soup.find_all(attrs={"style": re.compile(r"url\(", re.I)}):
    print("Style with background-image:", el.get("style"))
