import re

def inspect_page(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        c = f.read()
    print(f"=== {filename} ===")
    
    # Check whatsapp links
    wa_links = re.findall(r'<a[^>]*wa\.me[^>]*>[\s\S]*?</a>', c)
    for i, w in enumerate(wa_links):
        print(f"  WA link {i+1}: {w[:150]}")
        
    # Check script.js
    sjs = re.findall(r'<script[^>]*script\.js[^>]*>', c)
    print(f"  Script tags: {sjs}")
    
    # Check chat root
    cr = re.findall(r'<[^>]*data-rrc-ai-chat-root[^>]*>', c)
    print(f"  Chat root tags: {cr}")

inspect_page('index.html')
inspect_page('lawfirm-blog.html')
inspect_page('oci-legal-guides.html')
inspect_page('nri-services.html')
