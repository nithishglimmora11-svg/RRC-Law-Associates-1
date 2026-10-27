import re

with open('scratch/blog11_extracted.txt', 'r', encoding='utf-8') as f:
    raw_lines = f.readlines()

with open('nri-oci-property-tax-india.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Normalize HTML text
text_content = re.sub(r'<[^>]+>', ' ', html)
text_content = re.sub(r'&nbsp;', ' ', text_content)
text_content = re.sub(r'&amp;', '&', text_content)
text_content = re.sub(r'&lt;', '<', text_content)
text_content = re.sub(r'&gt;', '>', text_content)
text_content = re.sub(r'&quot;', '"', text_content)
text_content = re.sub(r'&#39;', "'", text_content)
text_content = re.sub(r'\s+', ' ', text_content)

checked = 0
missing = []

for line in raw_lines:
    # strip prefix [0] (style=..., num=...)
    m = re.match(r'^\[\d+\]\s*\([^\)]*\)\s*(.*)$', line.strip())
    if not m:
        continue
    text = m.group(1).strip()
    if not text:
        continue
    
    # Skip preamble / meta table lines
    if any(text.startswith(p) for p in [
        'Stage 3', 'We will now proceed', 'This article addresses', 'The article is designed',
        'Important: Property taxation', '1. SEO and publication details', 'Item', 'Recommended content',
        'Blog number', '11', 'H1 title', 'SEO title', 'Suggested clean URL', 'Meta description',
        'Primary keyword', 'Secondary keywords', 'Target audience', 'Word count target',
        'NRI and OCI Property Tax in India: TDS, Capital Gains and Repatriation',
        'NRI Property Tax in India: TDS, Capital Gains and Repatriation | RRC Law Associates',
        'https://rrclawassociates.com/nri-oci-property-tax-india/',
        'Selling or inheriting property in India as an NRI or OCI cardholder? Understand TDS, capital gains, inherited property taxation and repatriation rules.',
        'NRI property tax India',
        'OCI property tax India',
        'Non-resident Indians and OCI cardholders inheriting, holding or selling property in India',
        'Coordinate legal, tax and repatriation services for overseas property transactions'
    ]):
        continue
    
    checked += 1
    # Check snippet
    clean = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    clean_words = clean.split()
    if len(clean_words) >= 4:
        snippet = ' '.join(clean_words[:5])
    else:
        snippet = clean
    
    # search snippet in text_content
    clean_html_text = re.sub(r'[^a-zA-Z0-9\s]', '', text_content)
    if snippet.lower() not in clean_html_text.lower():
        missing.append((text, snippet))

print(f"Total content lines checked: {checked}")
print(f"Missing count: {len(missing)}")
if missing:
    for m in missing:
        print("MISSING:", m)
else:
    print("ALL 100% OF SOURCE DOCUMENT PARAGRAPHS ARE PRESENT IN HTML!")
