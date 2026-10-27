import re

html_c = open('oci-legal-guides.html', encoding='utf-8').read()
style_c = open('style.css', encoding='utf-8').read()
style2_c = open('style2.css', encoding='utf-8').read()
topbar_c = open('topbar.css', encoding='utf-8').read()

print("=== CHECKING RULES FOR p, .accordion-body, etc. ===")

# In style.css
for sel in ['p', '.accordion', 'body', '.mb-0', '.text-']:
    for m in re.finditer(rf'([^{{}}]*{re.escape(sel)}[^{{}}]*\{{[^}}]+\}})', style_c, re.IGNORECASE):
        rule = m.group(0).strip().replace('\n', ' ')
        if any(prop in rule for prop in ['color:', 'opacity:', 'display:', 'visibility:']):
            print(f"style.css -> {rule[:120]}")

# In style2.css
for sel in ['p', '.accordion', 'body', '.mb-0']:
    for m in re.finditer(rf'([^{{}}]*{re.escape(sel)}[^{{}}]*\{{[^}}]+\}})', style2_c, re.IGNORECASE):
        rule = m.group(0).strip().replace('\n', ' ')
        if any(prop in rule for prop in ['color:', 'opacity:', 'display:', 'visibility:']):
            print(f"style2.css -> {rule[:120]}")

# In oci-legal-guides.html
for sel in ['p', 'body', '.mb-0', '.accordion-body', '::selection', 'selection']:
    for m in re.finditer(rf'([^{{}}]*{re.escape(sel)}[^{{}}]*\{{[^}}]+\}})', html_c, re.IGNORECASE):
        rule = m.group(0).strip().replace('\n', ' ')
        if any(prop in rule for prop in ['color:', 'opacity:', 'display:', 'visibility:', 'selection']):
            print(f"html embedded -> {rule[:120]}")
