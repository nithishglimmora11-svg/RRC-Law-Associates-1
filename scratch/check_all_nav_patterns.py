import glob
import re

patterns = {}

for html in sorted(glob.glob('*.html')):
    if html == 'partners.html':
        continue
    with open(html, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Desktop nav match
    desktop_m = re.findall(r'<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*class=["\'][^"\']*nav-link-custom[^"\']*["\'][^>]*>(.*?)</a>', content, re.DOTALL | re.I)
    desktop_m2 = re.findall(r'<a[^>]*class=["\'][^"\']*nav-link-custom[^"\']*["\'][^>]*href=["\'][^"\']*partners\.html["\'][^>]*>(.*?)</a>', content, re.DOTALL | re.I)
    
    # Mobile nav match
    mobile_m = re.findall(r'<a[^>]*href=["\'][^"\']*partners\.html["\'][^>]*class=["\'][^"\']*m-link[^"\']*["\'][^>]*>(.*?)</a>', content, re.DOTALL | re.I)
    mobile_m2 = re.findall(r'<a[^>]*class=["\'][^"\']*m-link[^"\']*["\'][^>]*href=["\'][^"\']*partners\.html["\'][^>]*>(.*?)</a>', content, re.DOTALL | re.I)
    
    desktop_all = desktop_m + desktop_m2
    mobile_all = mobile_m + mobile_m2
    
    print(f"{html}: Desktop nav: {len(desktop_all)}, Mobile nav: {len(mobile_all)}")

