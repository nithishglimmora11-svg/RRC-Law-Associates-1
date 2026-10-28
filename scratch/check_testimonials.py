import glob
import re

for html in ['index.html', 'partners.html', 'nri-services.html']:
    with open(html, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    testims = re.findall(r'testimonial', text, re.I)
    print(f"{html}: {len(testims)} matches for 'testimonial'")

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()
    reviews = re.findall(r'<div[^>]*class=["\'][^"\']*review[^"\']*["\'][^>]*>(.*?)</div>', text, re.DOTALL | re.I)
    print(f"index.html reviews: {len(reviews)}")
    if 'testim' in text.lower():
        for m in re.finditer(r'testimonial', text, re.I):
            start = max(0, m.start() - 100)
            end = min(len(text), m.end() + 200)
            print("--- match in index.html ---")
            print(text[start:end])

