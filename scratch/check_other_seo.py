import re

for page in ['index.html', 'wills-probate-estate-administration.html', 'nri-services.html']:
    with open(page, 'r', encoding='utf-8') as f:
        text = f.read()
    canonical = re.findall(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', text)
    schema = re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', text, re.DOTALL)
    print(f"=== {page} ===")
    print("Canonical:", canonical)
    print("Schemas:", len(schema))

