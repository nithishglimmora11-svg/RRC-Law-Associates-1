with open('partners.html.bak', 'r', encoding='utf-8') as f:
    text = f.read()

topbar_idx = text.find('<div class="rrc-topbar">')
hero_idx = text.find('<section class="opps-hero"')
nav = text[topbar_idx:hero_idx].strip()
print("Nav start:")
print(nav[:200])
print("\nNav end:")
print(nav[-200:])

footer_idx = text.find('<footer class="footer">')
script_idx = text.find('<script src="https://cdn.jsdelivr.net/npm/bootstrap')
footer = text[footer_idx:script_idx].strip()
print("\nFooter start:")
print(footer[:200])
print("\nFooter end:")
print(footer[-200:])

