import os
import glob
import re
from collections import defaultdict

def get_files():
    return [f.replace('\\', '/') for f in glob.glob('**/*.html', recursive=True) if not any(x in f for x in ['.git', 'node_modules', 'scratch'])]

files = sorted(get_files())

stats = []
for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    
    viewport = re.search(r'<meta\s+name=["\']viewport["\'][^>]*content=["\']([^"\']+)["\']', content, re.I)
    viewport_val = viewport.group(1) if viewport else 'NONE'
    
    css = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', content, re.I)
    css += re.findall(r'<link[^>]+href=["\']([^"\']+\.css[^"\']*)["\'][^>]+rel=["\']stylesheet["\']', content, re.I)
    css = sorted(list(set(css)))
    
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', content, re.I)
    scripts = sorted(list(set(scripts)))
    
    has_header = bool(re.search(r'<header', content, re.I))
    has_topbar = bool(re.search(r'class=["\'][^"\']*top[-_]?bar', content, re.I))
    has_nav = bool(re.search(r'<nav', content, re.I))
    has_footer = bool(re.search(r'<footer', content, re.I))
    has_whatsapp = bool(re.search(r'whatsapp', content, re.I))
    has_ai = bool(re.search(r'data-rrc-ai|chat-root|rrc-law-ai', content, re.I))
    
    stats.append({
        'file': f,
        'viewport': viewport_val,
        'css': css,
        'scripts': scripts,
        'has_header': has_header,
        'has_topbar': has_topbar,
        'has_nav': has_nav,
        'has_footer': has_footer,
        'has_whatsapp': has_whatsapp,
        'has_ai': has_ai,
        'size': len(content)
    })

print(f"Total HTML files: {len(stats)}")
missing_vp = [s['file'] for s in stats if s['viewport'] == 'NONE']
print(f"Missing viewport ({len(missing_vp)}): {missing_vp}")

# Group by template/styling
css_combos = defaultdict(list)
for s in stats:
    key = tuple(sorted(s['css']))
    css_combos[key].append(s['file'])

print("\n=== CSS Combinations across pages ===")
for css_k, flist in css_combos.items():
    print(f"\nCSS Files: {list(css_k)} -> Count: {len(flist)}")
    for f in flist[:5]:
        print(f"   - {f}")
    if len(flist) > 5:
        print(f"   ... and {len(flist)-5} more")

# Template categories
templates = {
    'Homepage': ['index.html'],
    'OCI Hub & Landing': ['oci-card-assistance.html', 'oci-legal-guides.html', 'nri-legal-services/oci-card-assistance/index.html'],
    'Main Practice Areas & Services': [
        'nri-services.html', 'core-practice-areas.html', 'family-law.html', 'property-law.html',
        'employment-law.html', 'cyber-law.html', 'intellectual-property.html',
        'litigation-dispute-resolution.html', 'white-collar-crime.html', 'cheque-bounce-lawyer.html',
        'nri-family-matrimonial.html', 'nri-property-disputes.html', 'nri-power-of-attorney.html',
        'nri-criminal-case.html', 'passport-travel-restrictions.html', 'sectors.html'
    ],
    'OCI Articles': [s['file'] for s in stats if ('oci-' in s['file'] or 'ancestral-property' in s['file'] or 'due-diligence' in s['file'] or 'property-tax' in s['file']) and s['file'] not in ['oci-card-assistance.html', 'oci-legal-guides.html', 'nri-legal-services/oci-card-assistance/index.html']],
    'General Blog & Articles': [
        'lawfirm-blog.html',
        'blog-brother-claim-ancestral-property-long-possession.html',
        'blog-cross-border-child-custody-india.html',
        'blog-deepfake-legal-remedies.html',
        'blog-evolution-of-digital-evidence-india.html',
        'blog-nri-child-custody-in-india.html',
        'blog-nri-property-remedies.html',
        'enforce-foreign-divorce-decree-property-india.html',
        'enforce-foreign-divorce-decree-property-india-part2.html',
        'enforce-foreign-divorce-decree-property-india-part3.html'
    ],
    'Firm Info & Contact/Booking': ['partners.html', 'opportunities.html', 'booking.html']
}

print("\n=== Template Categorization Count ===")
total_cat = 0
for cat, plist in templates.items():
    print(f"Category: {cat} -> {len(plist)} pages")
    total_cat += len(plist)
print(f"Total classified: {total_cat} (should equal {len(stats)})")

# Check if any file missed
all_cat_files = set()
for plist in templates.values():
    all_cat_files.update(plist)
unclassified = [s['file'] for s in stats if s['file'] not in all_cat_files]
if unclassified:
    print(f"Unclassified files ({len(unclassified)}): {unclassified}")
