import re

with open('scratch/world_map.svg', 'r', encoding='utf-8') as f:
    svg = f.read().strip()

with open('scratch/generate_partners_html.py', 'r', encoding='utf-8') as f:
    gen = f.read()

# Replace the svg inside generate_partners_html.py
old_svg_match = re.search(r'<svg class="lp-map-svg".*?</svg>', gen, re.DOTALL)
if old_svg_match:
    gen = gen.replace(old_svg_match.group(0), svg)
    with open('scratch/generate_partners_html.py', 'w', encoding='utf-8') as f:
        f.write(gen)
    print("Replaced SVG in generate_partners_html.py successfully!")
else:
    print("Could not find SVG match.")

