import glob
import os
import re

html_files = sorted([f for f in glob.glob('*.html')])

print(f"Total root HTML files: {len(html_files)}")

for hf in html_files:
    with open(hf, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    links = re.findall(r'<link[^>]+href=["\']([^"\']+\.css[^"\']*)["\']', text, re.I)
    links += re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', text, re.I)
    links = sorted(list(set([l.split('?')[0] for l in links if not l.startswith('http') and not l.startswith('//')])))
    
    # Check if has mobileMenu
    has_mmenu = 'id="mobileMenu"' in text or "id='mobileMenu'" in text
    has_toggle = 'id="menuToggle"' in text or "id='menuToggle'" in text
    has_wa = 'whatsapp-float' in text
    has_ai = 'data-rrc-ai-chat-root' in text
    
    # Check if style.css or style2.css is loaded
    print(f"{hf:<50} | CSS: {str(links):<40} | Menu:{has_mmenu} Tog:{has_toggle} WA:{has_wa} AI:{has_ai}")
