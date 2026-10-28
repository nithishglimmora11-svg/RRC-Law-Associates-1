import glob, os, re

files = sorted(glob.glob("*.html")) + ['nri-landlord-tenant-eviction/index.html']
desktop_patterns = set()
mobile_patterns = set()

for f in files:
    with open(f, encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    
    # Extract Core Practice Areas desktop block
    m_desk = re.search(r'<div class="dropdown">\s*<a[^>]*href="[^"]*core-practice-areas\.html"[^>]*>.*?Core Practice Areas.*?</ul>\s*</div>', c, re.S)
    if m_desk:
        # Normalize whitespace to see unique patterns
        norm = re.sub(r'\s+', ' ', m_desk.group(0).strip())
        desktop_patterns.add(norm)
    else:
        print(f"NO DESKTOP CORE PRACTICE in {f}")

    # Extract Core Practice Areas mobile block
    m_mob = re.search(r'<div class="m-dropdown">\s*<a class="m-link m-trigger"[^>]*href="[^"]*core-practice-areas\.html"[^>]*>.*?Core Practice Areas.*?</div>\s*</div>', c, re.S)
    if m_mob:
        norm = re.sub(r'\s+', ' ', m_mob.group(0).strip())
        mobile_patterns.add(norm)
    else:
        print(f"NO MOBILE CORE PRACTICE in {f}")

print(f"\nUnique Desktop Patterns: {len(desktop_patterns)}")
print(f"Unique Mobile Patterns: {len(mobile_patterns)}")

