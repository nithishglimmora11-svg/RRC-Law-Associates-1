import os

for css in ['style.css', 'style2.css']:
    with open(css, encoding='utf-8') as f:
        c = f.read()
    print(f"{css}:")
    print("  .litigation-row-card:", ".litigation-row-card" in c)
    print("  .custom-faq-accordion:", ".custom-faq-accordion" in c)
    print("  .service-card:", ".service-card" in c)

