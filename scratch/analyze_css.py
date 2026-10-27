import re
import glob

css_files = ['style.css', 'style2.css', 'topbar.css', 'oci-style.css']

for cf in css_files:
    try:
        with open(cf, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        print(f"\n=================== {cf} ({len(content)} bytes) ===================")
        # Media queries
        medias = re.findall(r'@media[^{]+', content)
        print(f"Media queries count: {len(medias)}")
        unique_medias = sorted(list(set([m.strip() for m in medias])))
        for m in unique_medias:
            print(f"  {m}")
        
        # Check for potential responsive hazards
        hazard_100vw = re.findall(r'[^}\n]*100vw[^;\n]*;', content)
        if hazard_100vw:
            print(f"  Hazard 100vw ({len(hazard_100vw)}): {hazard_100vw[:3]}")
        
        fixed_large_widths = re.findall(r'[^}\n]*(?:min-)?width:\s*(?:[5-9]\d{2}|\d{4,})px[^;\n]*;', content)
        if fixed_large_widths:
            print(f"  Large fixed/min-width ({len(fixed_large_widths)}): {fixed_large_widths[:5]}")
            
    except Exception as e:
        print(f"Error {cf}: {e}")
