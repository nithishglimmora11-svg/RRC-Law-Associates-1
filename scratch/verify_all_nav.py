import os, re
html_files = [f for f in os.listdir('.') if f.endswith('.html')]
missing_desktop = []
missing_mobile = []

for f in html_files:
    content = open(f, encoding='utf-8', errors='ignore').read()
    if 'NRI Services' not in content:
        continue
    if not re.search(r'href=["\']/nri-business-commercial-advisory/?["\']', content):
        missing_desktop.append(f)
    if 'm-sub-item' in content and not re.search(r'class=["\']m-sub-item["\'][^>]*href=["\']/nri-business-commercial-advisory/?["\']', content):
        missing_mobile.append(f)

print(f"Total HTML checked: {len(html_files)}")
print(f"Missing desktop Business nav: {len(missing_desktop)} -> {missing_desktop}")
print(f"Missing mobile Business nav: {len(missing_mobile)} -> {missing_mobile}")
