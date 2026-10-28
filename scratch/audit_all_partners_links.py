import glob
import re

for html in sorted(glob.glob('*.html')):
    with open(html, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    
    matches = re.findall(r'<a[^>]+href=["\'][^"\']*partners\.html["\'][^>]*>[\s\S]*?</a>', c, re.I)
    # also check if href comes second
    matches2 = re.findall(r'<a[^>]+class=["\'][^"\']*["\'][^>]+href=["\'][^"\']*partners\.html["\'][^>]*>[\s\S]*?</a>', c, re.I)
    all_m = list(dict.fromkeys(matches + matches2))
    
    # filter for navigation links (e.g. in header or nav or mobile-menu)
    print(f"=== {html} ({len(all_m)} matches) ===")
    for m in all_m:
        clean = " ".join(m.split())
        print("   ", clean[:120])

