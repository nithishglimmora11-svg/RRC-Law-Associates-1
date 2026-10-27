import re

html_c = open('oci-legal-guides.html', encoding='utf-8').read()

print("=== FAQ CSS IN oci-legal-guides.html ===")
for m in re.finditer(r'([^{}]*(?:oci-faq|faq-accordion|accordion-body|accordion-button|accordion-item)[^{}]*\{[^}]+\})', html_c, re.IGNORECASE):
    print(m.group(0).strip())
    print("-" * 40)

print("\n=== ACCORDION IN style.css ===")
style_c = open('style.css', encoding='utf-8').read()
for m in re.finditer(r'([^{}]*accordion[^{}]*\{[^}]+\})', style_c, re.IGNORECASE):
    print(m.group(0).strip())
    print("-" * 40)

print("\n=== ACCORDION IN style2.css ===")
style2_c = open('style2.css', encoding='utf-8').read()
for m in re.finditer(r'([^{}]*accordion[^{}]*\{[^}]+\})', style2_c, re.IGNORECASE):
    print(m.group(0).strip())
    print("-" * 40)
