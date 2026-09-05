from bs4 import BeautifulSoup
import re

path = r"C:\Users\Dell\.gemini\antigravity-ide\brain\8b8033e9-9630-4be1-85f6-e06060080089\.system_generated\steps\80\content.md"
with open(path, "r", encoding="utf-8") as f:
    raw = f.read()

soup = BeautifulSoup(raw, "html.parser")

print("All links on page:")
for a in soup.find_all("a", href=True):
    txt = a.get_text(strip=True)
    href = a['href']
    if ".html" in href:
        print(f"Text: '{txt}' -> Href: '{href}'")
