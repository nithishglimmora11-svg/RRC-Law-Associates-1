from html.parser import HTMLParser
import re

with open('oci-legal-guides.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Use regex to find each <article class="guide-card">...</article>
card_matches = re.findall(r'<article\s+class="guide-card">(.*?)</article>', html, re.DOTALL)
print(f"Total guide-card elements in oci-legal-guides.html: {len(card_matches)}")

for i, card_html in enumerate(card_matches, 1):
    title_m = re.search(r'<h4\s+class="guide-card-title">(.*?)</h4>', card_html, re.DOTALL)
    title = re.sub(r'<[^>]+>', '', title_m.group(1)).strip() if title_m else "No Title"
    
    btn_m = re.search(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*class="guide-action-btn[^"]*"[^>]*>(.*?)</a>', card_html, re.DOTALL)
    if not btn_m:
        btn_m = re.search(r'<a\s+[^>]*class="guide-action-btn[^"]*"[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', card_html, re.DOTALL)
    
    href = btn_m.group(1) if btn_m else "No href"
    btn_text = re.sub(r'<[^>]+>', '', btn_m.group(2)).strip() if btn_m else "No btn"
    
    badge_m = re.search(r'<span\s+class="guide-card-badge[^"]*">(.*?)</span>', card_html, re.DOTALL)
    badge = re.sub(r'<[^>]+>', '', badge_m.group(1)).strip() if badge_m else ""
    
    print(f"[{i:2d}] {title[:48]:48} | badge: {badge:16} | href: {href:52} | btn: {btn_text}")
