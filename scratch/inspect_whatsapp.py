import glob
import re

sample = [
  'index.html',
  'oci-card-assistance.html',
  'oci-legal-guides.html',
  'core-practice-areas.html',
  'nri-services.html',
  'oci-card-eligibility-legal-status.html',
  'nri-oci-property-due-diligence-india.html',
  'lawfirm-blog.html',
  'blog-cross-border-child-custody-india.html',
  'blog-deepfake-legal-remedies.html',
  'partners.html',
  'booking.html'
]

for p in sample:
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    wa_matches = re.findall(r'<a[^>]+(?:whatsapp|wa\.me|api\.whatsapp)[^>]*>[\s\S]*?</a>', text, re.I)
    print(f"\n=== {p}: {len(wa_matches)} WhatsApp links ===")
    for m in wa_matches:
        href = re.search(r'href=["\']([^"\']+)["\']', m)
        cls = re.search(r'class=["\']([^"\']+)["\']', m)
        id_m = re.search(r'id=["\']([^"\']+)["\']', m)
        print(f"   id='{id_m.group(1) if id_m else ''}' class='{cls.group(1) if cls else ''}' href='{href.group(1) if href else ''}'")
