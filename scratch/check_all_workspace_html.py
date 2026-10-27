import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

print("=== CHECKING ALL HTML FILES IN WORKSPACE FOR OCI GUIDE LINKS ===")
for fname in sorted(html_files):
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    clean_oci_links = re.findall(r'<a\s+[^>]*href=["\'](/(?:oci-|nri-oci-)[^"\']*/?)["\']', content)
    if clean_oci_links:
        print(f"{fname:55}: {len(clean_oci_links)} links -> {set(clean_oci_links)}")
