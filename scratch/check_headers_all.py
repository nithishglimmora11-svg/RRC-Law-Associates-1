import glob
import re

print(f"{'FILE':<55} {'DIV_LOGO':<10} {'MS_AUTO':<10} {'LOGO_IMG_H':<15}")
print("-" * 90)

for fn in sorted(glob.glob("*.html")):
    c = open(fn, encoding="utf-8").read()
    # Check if page has header
    if "<header" not in c:
        continue
    header_chunk = re.search(r"<header.*?</header>", c, re.DOTALL)
    if not header_chunk:
        continue
    htext = header_chunk.group(0)
    has_div_logo = 'class="logo"' in htext or "class='logo'" in htext
    has_ms_auto = "ms-auto" in htext
    
    # check logo height styling in page
    logo_h = "default"
    lh_match = re.search(r"\.logo-img\s*\{[^}]*height:\s*([^;]+);", c)
    if lh_match:
        logo_h = lh_match.group(1).strip()
    
    # only print if OCI or index or blog
    if any(k in fn.lower() for k in ["oci", "ancestral", "nri-oci", "index", "blog"]):
        print(f"{fn:<55} {str(has_div_logo):<10} {str(has_ms_auto):<10} {logo_h:<15}")
