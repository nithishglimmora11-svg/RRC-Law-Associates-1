import glob
import re

all_passed = True
for html in sorted(glob.glob('*.html')):
    with open(html, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Desktop nav
    m_desk = re.findall(r'<a[^>]*class=["\'][^"\']*nav-link-custom[^"\']*["\'][^>]*href=["\'][^"\']*partners\.html["\'][^>]*>(.*?)</a>', content, re.DOTALL | re.I)
    m_desk2 = re.findall(r'<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*class=["\'][^"\']*nav-link-custom[^"\']*["\'][^>]*>(.*?)</a>', content, re.DOTALL | re.I)
    
    # Mobile nav
    m_mob = re.findall(r'<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*class=["\'][^"\']*(?:m-link|mobile-link)[^"\']*["\'][^>]*>(.*?)</a>', content, re.DOTALL | re.I)
    m_mob2 = re.findall(r'<a[^>]*class=["\'][^"\']*(?:m-link|mobile-link)[^"\']*["\'][^>]*href=["\'][^"\']*partners\.html["\'][^>]*>(.*?)</a>', content, re.DOTALL | re.I)

    desk_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in (m_desk + m_desk2)]
    mob_texts = [re.sub(r'<[^>]+>', '', t).strip() for t in (m_mob + m_mob2)]
    
    if desk_texts != ['Legal Partners'] or mob_texts != ['Legal Partners']:
        print(f"MISMATCH in {html}: Desktop={desk_texts}, Mobile={mob_texts}")
        all_passed = False

if all_passed:
    print("SUCCESS: All 49 HTML files consistently display 'Legal Partners' in both Desktop and Mobile navigation!")

