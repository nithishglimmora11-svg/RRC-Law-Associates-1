import re

def get_header_and_topbar(fname):
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    topbar_m = re.search(r'(<div class=["\']rrc-topbar["\'].*?</div>\s*</div>)', html, re.DOTALL)
    header_m = re.search(r'(<header class=["\']header["\'].*?</header>)', html, re.DOTALL)
    
    topbar = topbar_m.group(1) if topbar_m else "NO TOPBAR"
    header = header_m.group(1) if header_m else "NO HEADER"
    return topbar, header

tb_part, h_part = get_header_and_topbar('partners.html')
tb_assist, h_assist = get_header_and_topbar('oci-card-assistance.html')
tb_doc, h_doc = get_header_and_topbar('oci-card-application-documents.html')
tb_hub, h_hub = get_header_and_topbar('oci-legal-guides.html')

print("=== TOPBAR DIFF ===")
print("partners == oci-card-assistance?", tb_part.strip() == tb_assist.strip())
print("oci-card-assistance == oci-card-application-documents?", tb_assist.strip() == tb_doc.strip())
print("oci-card-application-documents == oci-legal-guides?", tb_doc.strip() == tb_hub.strip())

print("\n=== HEADER DIFF ===")
print("Length of header in partners:", len(h_part))
print("Length of header in oci-card-assistance:", len(h_assist))
print("Length of header in oci-card-application-documents:", len(h_doc))
print("Length of header in oci-legal-guides:", len(h_hub))
