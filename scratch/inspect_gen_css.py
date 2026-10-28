# -*- coding: utf-8 -*-
with open('scratch/generate_partners_html.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's inspect current CSS definitions inside generate_partners_html.py
targets = [
    ('.header {', 20),
    ('.lp-hero {', 20),
    ('.lp-benefits {', 20),
    ('.lp-network-section {', 20),
    ('.lp-cta-banner {', 20),
    ('.lp-testimonials {', 20),
    ('.lp-app-section {', 20),
    ('.lp-preserved-section {', 20),
]

for t, n in targets:
    idx = code.find(t)
    print(f"Target '{t}': found at {idx}")

