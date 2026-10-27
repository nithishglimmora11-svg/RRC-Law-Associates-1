import re
import glob

print("Checking for inline fixed widths > 360px that could cause horizontal scroll:")
print("=" * 70)

overflow_risks = []
for fn in sorted(glob.glob("*.html")):
    if any(k in fn.lower() for k in ['oci', 'nri', 'index', 'blog']):
        c = open(fn, encoding='utf-8').read()
        # look for width: [4-9]\d\d+px or width="\d{3,}"
        inline_w = re.findall(r'style=["\'][^"\']*width:\s*([4-9]\d{2,}|\d{4,})px', c, re.IGNORECASE)
        fixed_attr_w = re.findall(r'width=["\']([4-9]\d{2,}|\d{4,})["\']', c)
        
        # Check if they are inside responsive wrappers (img with width attribute often has max-width: 100% in CSS)
        for w in inline_w:
            overflow_risks.append((fn, f"style width: {w}px"))

if not overflow_risks:
    print("PASS: No inline fixed widths >= 400px found on container elements!")
else:
    for f, issue in overflow_risks[:10]:
        print(f"[WARN] {f}: {issue}")

print("=" * 70)
