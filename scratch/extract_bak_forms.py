with open('partners.html.bak', 'r', encoding='utf-8', errors='ignore') as f:
    orig = f.read()

import re
m = re.findall(r'<form[\s\S]*?</form>', orig)
for i, f_str in enumerate(m):
    with open(f'scratch/bak_form_{i}.html', 'w', encoding='utf-8') as out:
        out.write(f_str)
    print(f"Wrote bak_form_{i}.html ({len(f_str)} chars)")

