import glob
import re

for html in sorted(glob.glob('*.html')):
    if html == 'partners.html':
        continue
    with open(html, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Desktop nav occurrences
    desk_matches = list(re.finditer(r'<a[^>]*class=["\'][^"\']*nav-link-custom[^"\']*["\'][^>]*href=["\'][^"\']*partners\.html["\'][^>]*>\s*Partners\s*</a>', content, re.DOTALL | re.I))
    desk_matches2 = list(re.finditer(r'<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*class=["\'][^"\']*nav-link-custom[^"\']*["\'][^>]*>\s*Partners\s*</a>', content, re.DOTALL | re.I))
    
    # Mobile nav occurrences
    mob_matches = list(re.finditer(r'<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*class=["\'][^"\']*m-link[^"\']*["\'][^>]*>\s*Partners\s*</a>', content, re.DOTALL | re.I))
    mob_matches2 = list(re.finditer(r'<a[^>]*class=["\'][^"\']*m-link[^"\']*["\'][^>]*href=["\'][^"\']*partners\.html["\'][^>]*>\s*Partners\s*</a>', content, re.DOTALL | re.I))

    total_desk = len(desk_matches) + len(desk_matches2)
    total_mob = len(mob_matches) + len(mob_matches2)

    if total_desk == 0:
        print(f"WARNING: {html} has 0 desktop matches!")
        # Print lines around partners.html
        for m in re.finditer(r'partners\.html', content):
            start = max(0, m.start() - 100)
            end = min(len(content), m.end() + 100)
            print(f"  Context in {html}:\n{content[start:end]}\n")

