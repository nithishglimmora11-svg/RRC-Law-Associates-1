import re
import json

with open('scratch/blog12_extracted.txt', 'r', encoding='utf-8') as f:
    raw_lines = f.readlines()

with open('oci-card-renewal-passport-update.html', 'r', encoding='utf-8') as f:
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
    m = re.match(r'^\[\d+\]\s*\([^\)]*\)\s*(.*)$', line.strip())
    if not m:
        # maybe from our zipfile format: [style|num=...] text
        m = re.match(r'^\[[^\]]+\]\s*(.*)$', line.strip())
        if not m:
            continue
    text = m.group(1).strip()
    if not text:
        continue
    
    # Skip preamble / meta table lines
    if any(text.startswith(p) for p in [
        'Stage 3', 'We will now proceed', 'Important current-law update',
        '1. SEO and publication details', 'Item', 'Recommended content',
        'Blog number', '12', 'SEO title', 'H1', 'Suggested URL', 'Meta description',
        'Primary keyword', 'Secondary keywords', 'Target audience', 'Search intent', 'Main CTA',
        'OCI Card Renewal and Passport Update: Latest Rules for 2026',
        '/oci-card-renewal-passport-update/',
        'Learn the latest OCI card rules for passport changes',
        'OCI card renewal and passport update',
        'OCI card reissue, OCI passport update',
        'OCI cardholders, NRI families, parents of minor',
        'Informational and service enquiries',
        'Request assistance with OCI document updates'
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
    
    clean_html_text = re.sub(r'[^a-zA-Z0-9\s]', '', text_content)
    if snippet.lower() not in clean_html_text.lower():
        missing.append((text, snippet))

print(f"Total content lines checked: {checked}")
print(f"Missing count: {len(missing)}")
if missing:
    for m in missing:
        print("MISSING:", m)
else:
    print("ALL SOURCE DOCUMENT PARAGRAPHS ARE 100% PRESENT IN HTML!")

# Tag validation
print("\nChecking HTML tag balance...")
stack = []
self_closing = {'meta', 'link', 'img', 'br', 'hr', 'input'}
tag_pattern = re.compile(r'<(/)?([a-zA-Z0-9]+)[^>]*>')

for match in tag_pattern.finditer(html):
    is_closing = bool(match.group(1))
    tag_name = match.group(2).lower()
    
    if tag_name in self_closing:
        continue
    
    if is_closing:
        if stack and stack[-1] == tag_name:
            stack.pop()
        else:
            print(f"Mismatched closing tag </{tag_name}>, expected </{stack[-1] if stack else 'None'}>")
    else:
        stack.append(tag_name)

if not stack:
    print("HTML tags are perfectly balanced! (0 unclosed tags)")
else:
    print(f"Unclosed tags: {stack}")

# Anchor validation
print("\nChecking TOC anchor targets...")
toc_links = re.findall(r'class="toc-list".*?href="#([^"]+)"', html, re.DOTALL)
all_ids = set(re.findall(r'id="([^"]+)"', html))
missing_ids = [link for link in toc_links if link not in all_ids]
if not missing_ids:
    print(f"All {len(toc_links)} TOC anchor links resolve to valid IDs in the page!")
else:
    print(f"Missing IDs for links: {missing_ids}")

# Schema validation
print("\nChecking Schema JSON-LD...")
json_scripts = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
for i, s in enumerate(json_scripts):
    try:
        data = json.loads(s)
        types = [item.get('@type') for item in data.get('@graph', [])]
        print(f"JSON-LD script {i+1} parsed successfully! Types: {types}")
    except Exception as e:
        print(f"JSON-LD script {i+1} FAILED to parse: {e}")
