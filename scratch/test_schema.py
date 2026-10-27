import json
import re

files = ['oci-card-renewal-passport-update.html', 'oci-legal-guides.html', 'lawfirm-blog.html']
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        html = fp.read()
    scripts = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
    print(f"File {f}: found {len(scripts)} json-ld scripts")
    for i, s in enumerate(scripts):
        try:
            data = json.loads(s)
            print(f"  Script {i+1}: parsed successfully!")
            if '@graph' in data:
                types = [item.get('@type') for item in data['@graph']]
                print(f"    @graph types: {types}")
            else:
                print(f"    @type: {data.get('@type')}")
        except Exception as e:
            print(f"  Script {i+1}: FAILED to parse! {e}")
