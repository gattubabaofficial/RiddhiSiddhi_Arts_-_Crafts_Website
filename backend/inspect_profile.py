from bs4 import BeautifulSoup
import re

path = r"C:\Users\Dell\.gemini\antigravity-ide\brain\8b8033e9-9630-4be1-85f6-e06060080089\.system_generated\steps\118\content.md"
with open(path, "r", encoding="utf-8") as f:
    raw = f.read()

soup = BeautifulSoup(raw, "html.parser")

print("Title:", soup.title.string if soup.title else "")
print("\nImages on profile page:")
for img in soup.find_all("img"):
    src = img.get("dataimg") or img.get("src") or img.get("data-src")
    if src and not src.startswith("data:"):
        print(" -", src)

print("\nText snippets:")
for p in soup.find_all(["p", "div"], class_=lambda c: c and any(k in str(c) for k in ["about", "profile", "desc"])):
    txt = p.get_text(strip=True)
    if len(txt) > 50:
        print("Snippet:", txt[:200])
