import os, re

target_files = [
    'nri-property-disputes.html',
    'nri-power-of-attorney.html',
    'property-law.html',
    'nri-oci-property-due-diligence-india.html',
    'cheque-bounce-lawyer.html',
    'litigation-dispute-resolution.html',
    'white-collar-crime.html',
    'core-practice-areas.html',
    'nri-services.html'
]

print("==================================================================")
print("     AUDIT OF EXISTING NRI PROPERTY & LITIGATION PAGES")
print("==================================================================\n")

for tf in target_files:
    if not os.path.exists(tf):
        print(f"File NOT FOUND: {tf}")
        continue
    c = open(tf, encoding='utf-8', errors='ignore').read()
    title_m = re.search(r'<title>(.*?)</title>', c, re.DOTALL)
    title = title_m.group(1).strip() if title_m else 'No title'
    desc_m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', c, re.IGNORECASE | re.DOTALL)
    desc = desc_m.group(1).strip() if desc_m else 'No description'
    h1_m = re.search(r'<h1[^>]*>(.*?)</h1>', c, re.DOTALL)
    h1 = re.sub(r'<[^>]+>', '', h1_m.group(1)).strip() if h1_m else 'No H1'
    canonical_m = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', c, re.IGNORECASE)
    canonical = canonical_m.group(1).strip() if canonical_m else 'No canonical'
    h2s = [re.sub(r'<[^>]+>', '', h).strip() for h in re.findall(r'<h2[^>]*>(.*?)</h2>', c, re.DOTALL)][:6]
    
    print(f"File: {tf} ({len(c.splitlines())} lines, {len(c)} bytes)")
    print(f"  Title: {title}")
    print(f"  Meta Description: {desc[:90]}...")
    print(f"  Canonical: {canonical}")
    print(f"  Primary H1: {h1}")
    print(f"  Sample H2s: {h2s}")
    print("-" * 65)

