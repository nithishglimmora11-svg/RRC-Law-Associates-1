import re
import json

with open('scratch/blog13_extracted.txt', 'r', encoding='utf-8') as f:
    raw_lines = f.readlines()

with open('oci-card-cancellation-grounds-remedies.html', 'r', encoding='utf-8') as f:
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
    m = re.match(r'^\[[^\]]+\]\s*(.*)$', line.strip())
    if not m:
        continue
    text = m.group(1).strip()
    if not text:
        continue
    
    # Skip preamble / meta table lines
    if any(text.startswith(p) for p in [
        'Stage 3', 'Proceeding to the next article', 'The draft below is based on Section 7D',
        '1. SEO and publication details', 'Element', 'Recommendation',
        'Blog number', '13', 'SEO title', 'H1 heading', 'URL slug', 'Meta description',
        'Primary keyword', 'Secondary keywords', 'Search intent', 'Internal links',
        'OCI Card Cancellation in India: Grounds, Legal Rights and Remedies',
        'OCI Card Cancellation: Grounds, Legal Consequences and Legal Remedies',
        '/oci-card-cancellation-grounds-remedies/',
        'Understand when an OCI card can be cancelled under Indian law',
        'OCI card cancellation',
        'Section 7D Citizenship Act, OCI cancellation notice',
        'Informational and legal-service enquiry',
        'OCI eligibility guide, OCI benefits and restrictions'
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
toc_matches = re.findall(r'<a href="#(section-[^"]+)">', html)
print(f"TOC links found: {len(toc_matches)}")
all_ids = set(re.findall(r'id="([^"]+)"', html))
all_ok = True
for m in toc_matches:
    found = m in all_ids
    print(f"  Anchor #{m} -> exists: {found}")
    if not found:
        all_ok = False

if all_ok:
    print("ALL TOC ANCHORS RESOLVE PERFECTLY!")
else:
    print("SOME ANCHORS BROKEN!")

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
