import re
import os

files = [
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-application-documents.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html',
    'oci-card-eligibility-legal-status.html',
    'oci-card-renewal-passport-update.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'oci-for-children-born-abroad.html',
    'oci-foreign-spouse-eligibility.html',
    'oci-vs-nri-vs-indian-citizen.html'
]

pattern_div = re.compile(
    r'\s*<div class="article-meta-item">\s*<i class="bi bi-clock-fill text-gold"></i>\s*<span>\d+\s*min\s*read</span>\s*</div>',
    re.IGNORECASE
)

pattern_span = re.compile(
    r'\s*<span>\s*<i class="bi bi-clock-history[^"]*"></i>\s*\d+\s*min\s*read\s*</span>',
    re.IGNORECASE
)

for fn in files:
    content = open(fn, encoding='utf-8').read()
    orig_len = len(content)
    
    # Try pattern_div
    new_content, n_div = pattern_div.subn('', content)
    # Try pattern_span
    new_content, n_span = pattern_span.subn('', new_content)
    
    total_removed = n_div + n_span
    if total_removed > 0:
        with open(fn, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"[REMOVED {total_removed}] {fn} (divs={n_div}, spans={n_span})")
    else:
        print(f"[WARNING: NONE MATCHED] {fn}")

print("Done.")
