import re

c = open('oci-legal-guides.html', encoding='utf-8').read()

# Find all classes with background white or light
print("=== SECTIONS IN oci-legal-guides.html ===")
sections = re.findall(r'<section[^>]*class=["\']([^"\']+)["\'][^>]*id=["\']([^"\']+)["\']', c)
for sec_class, sec_id in sections:
    # find background color for this section
    bg_match = re.search(rf'\.{sec_class}\s*\{{[^}}]*background(?:-color)?:\s*([^;}}]+)', c)
    bg = bg_match.group(1).strip() if bg_match else "unknown"
    print(f"Section #{sec_id} (class: {sec_class}): bg = {bg}")

print("\n=== PARAGRAPH CLASSES IN oci-legal-guides.html ===")
p_tags = set(re.findall(r'<p\s+class=["\']([^"\']+)["\']', c))
for p_cls in sorted(p_tags):
    # find rule for this class
    r_match = re.search(rf'\.{p_cls}\s*\{{[^}}]*color:\s*([^;}}]+)', c)
    color = r_match.group(1).strip() if r_match else "NO EXPLICIT COLOR (inherits or defaults to p)"
    print(f"p.{p_cls}: color = {color}")

# Check any p tags without a class
p_no_cls = re.findall(r'<p>(.*?)</p>', c, re.DOTALL)
print(f"\nTotal <p> tags with NO class: {len(p_no_cls)}")
for p_text in p_no_cls[:5]:
    print(" - Snippet:", p_text.strip()[:80])
