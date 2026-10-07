import re

with open(r'C:\Users\Tanish\.gemini\antigravity-ide\brain\33a354b2-c726-44c8-a5a6-be34251c35d0\.system_generated\steps\162\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('Trust We Built')
snippet = text[idx:]

cleaned = re.sub(r'<script.*?</script>', '', snippet, flags=re.DOTALL)
cleaned = re.sub(r'<style.*?</style>', '', cleaned, flags=re.DOTALL)

with open(r'C:\Users\Tanish\.gemini\antigravity-ide\brain\33a354b2-c726-44c8-a5a6-be34251c35d0\scratch\trust_section.html', 'w', encoding='utf-8') as f:
    f.write(cleaned)

print("Saved trust_section.html. Total length:", len(cleaned))
