import re

c = open('oci-legal-guides.html', encoding='utf-8').read()
lines = c.splitlines()

# Search for FAQ CSS rules
print("=== FAQ CSS RULES IN oci-legal-guides.html ===")
faq_css = re.findall(r'([^{}]+faq[^{}]*\{[^}]+\})', c, re.IGNORECASE)
for r in faq_css:
    print(r.strip())
    print("-" * 50)

# Also check for accordion CSS rules
print("=== ACCORDION CSS RULES IN oci-legal-guides.html ===")
accordion_css = re.findall(r'([^{}]+accordion[^{}]*\{[^}]+\})', c, re.IGNORECASE)
for r in accordion_css:
    print(r.strip())
    print("-" * 50)

# Check FAQ HTML markup
print("=== FAQ HTML SECTION SNIPPET ===")
faq_match = re.search(r'(<section[^>]*id=["\'](?:faq|faqs)["\'][^>]*>.*?</section>)', c, re.DOTALL | re.IGNORECASE)
if not faq_match:
    faq_match = re.search(r'(<!--[^\n]*FAQ[^\n]*-->.*?)(?=<!--|\Z)', c, re.DOTALL | re.IGNORECASE)
if faq_match:
    print(faq_match.group(0)[:1500])
else:
    # search lines containing FAQ
    for i, l in enumerate(lines, 1):
        if 'faq' in l.lower():
            print(f"L{i}: {l.strip()[:100]}")
