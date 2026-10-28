import glob
import re

html_files = sorted(glob.glob('*.html'))
results = {}

for html in html_files:
    with open(html, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Find all anchor tags pointing to partners.html
    partner_links = re.findall(r'<a\s+[^>]*href=["\'][^"\']*partners\.html["\'][^>]*>(.*?)</a>', content, re.DOTALL | re.IGNORECASE)
    cleaned = [re.sub(r'<[^>]+>', '', l).strip() for l in partner_links]
    
    # Also find any anchor with text 'Partners'
    other_partner_texts = re.findall(r'<a\s+[^>]*>(\s*Partners\s*)</a>', content, re.IGNORECASE)
    
    if cleaned or other_partner_texts:
        results[html] = {
            'href_partners': cleaned,
            'text_partners': [t.strip() for t in other_partner_texts]
        }

print(f"Total HTML files analyzed: {len(html_files)}")
print(f"HTML files with partner links: {len(results)}")
for k, v in results.items():
    print(f"{k}: href_links={v['href_partners']}, text_links={v['text_partners']}")
