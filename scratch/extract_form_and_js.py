with open('partners.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Extract form
form_start = text.find('<form id="partnerApplicationForm"')
form_end = text.find('</form>', form_start) + len('</form>')
form_html = text[form_start:form_end]

with open('scratch/extracted_form.html', 'w', encoding='utf-8') as out:
    out.write(form_html)
print(f"Form HTML extracted ({len(form_html)} chars)")

# Extract script blocks
scripts = re.findall(r'<script(?![^>]*src=)[^>]*>([\s\S]*?)</script>', text, re.I)
for i, s in enumerate(scripts):
    if 'partnerApplicationForm' in s or 'goToStep' in s:
        with open('scratch/extracted_form_script.js', 'w', encoding='utf-8') as out:
            out.write(s)
        print(f"Form Script extracted ({len(s)} chars)")

