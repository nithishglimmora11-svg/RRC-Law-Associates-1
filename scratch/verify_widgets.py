import glob
import re

print(f"{'FILE':<55} {'WHATSAPP':<10} {'AI_CHAT':<10}")
print("-" * 75)

for fn in sorted(glob.glob("*.html")):
    if any(k in fn.lower() for k in ['oci', 'nri', 'index', 'blog']):
        c = open(fn, encoding='utf-8').read()
        wa_count = c.count('class="whatsapp-float"') + c.count("class='whatsapp-float'")
        ai_count = c.count('data-rrc-ai-chat-root')
        print(f"{fn:<55} {wa_count:<10} {ai_count:<10}")
