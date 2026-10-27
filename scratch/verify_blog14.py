import re
import json

with open('scratch/blog14_extracted.txt', 'r', encoding='utf-8') as f:
    extracted_lines = [l.strip() for l in f if l.strip()]

# Find start of article text (Line 28 in 0-indexed: [Heading1...])
start_idx = 0
for i, line in enumerate(extracted_lines):
    if line.startswith('[Heading1'):
        start_idx = i
        break

article_source_lines = extracted_lines[start_idx:]
print(f"Total article source lines to verify: {len(article_source_lines)}")

with open('oci-card-cancellation-section-7d-legal-remedies.html', 'r', encoding='utf-8') as f:
    html_text = f.read()

# 1. Verify text presence
missing = []
for idx, line in enumerate(article_source_lines):
    # Strip style tag prefix like [NormalWeb|num=False] or [Heading2|num=False]
    text = re.sub(r'^\[.*?\]\s*', '', line).strip()
    if not text:
        continue
    
    # Check if a substantive phrase or the whole text is in the HTML
    # We remove standard punctuation/quotes if any difference in entities
    clean_text = text.replace('&', '&amp;').replace('"', '&quot;')
    # Try direct match or relaxed match
    if text not in html_text and clean_text not in html_text:
        # Check first 40 chars
        prefix = text[:40]
        if prefix not in html_text:
            missing.append((idx, text))

print(f"Missing items from source DOCX: {len(missing)}")
for m in missing:
    print(f"  Line {m[0]}: {m[1][:80]}")

# 2. Verify TOC anchors
toc_anchors = re.findall(r'<a href="#([^"]+)">', html_text)
unique_anchors = sorted(list(set(toc_anchors)))
print(f"\nUnique TOC anchors found: {len(unique_anchors)}")
missing_anchors = []
for anc in unique_anchors:
    pattern = f'id="{anc}"'
    if pattern not in html_text:
        missing_anchors.append(anc)

print(f"Missing anchor target IDs: {len(missing_anchors)}")
for ma in missing_anchors:
    print(f"  Missing ID: {ma}")

# 3. Verify HTML tag balance
tags = ['div', 'section', 'article', 'main', 'header', 'footer', 'ul', 'ol', 'p']
for tag in tags:
    opens = len(re.findall(f'<{tag}[\\s>]', html_text))
    closes = len(re.findall(f'</{tag}>', html_text))
    print(f"Tag <{tag}>: {opens} open, {closes} close, diff: {opens - closes}")

# 4. Verify JSON-LD
schema_matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html_text, re.DOTALL)
print(f"\nJSON-LD scripts found: {len(schema_matches)}")
for idx, sm in enumerate(schema_matches):
    try:
        data = json.loads(sm.strip())
        print(f"  Script {idx+1} valid JSON! Graph nodes: {len(data.get('@graph', []))}")
        for node in data.get('@graph', []):
            print(f"    - @type: {node.get('@type')}, id: {node.get('@id')}")
            if node.get('@type') == 'FAQPage':
                print(f"      FAQ Questions count: {len(node.get('mainEntity', []))}")
    except Exception as e:
        print(f"  Script {idx+1} JSON ERROR: {e}")

# 5. Check NRI Legal Services dropdown integrity
nri_dropdown = '''                        <ul class="dropdown-menu" aria-labelledby="nriDropdown">
                            <li><a class="dropdown-item" href="oci-card-assistance.html">OCI &amp; Indian Ancestry</a></li>
                            <li><a class="dropdown-item" href="nri-property-disputes.html">Property Disputes</a></li>
                            <li><a class="dropdown-item" href="nri-power-of-attorney.html">Power of Attorney</a></li>
                            <li><a class="dropdown-item" href="nri-criminal-case.html">Criminal Defence</a></li>
                            <li><a class="dropdown-item" href="nri-family-matrimonial.html">Family &amp; Matrimonial</a></li>
                        </ul>'''
print(f"\nNRI Legal Services dropdown perfectly intact: {nri_dropdown in html_text}")
