import glob
import os
import re

html_files = [f for f in glob.glob('**/*.html', recursive=True) if not any(x in f for x in ['.git', 'node_modules', 'scratch'])]

missing_assets = []
for hf in html_files:
    dir_path = os.path.dirname(hf)
    with open(hf, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    # check css links
    css_links = re.findall(r'<link[^>]+href=["\']([^"\']+)["\']', text, re.I)
    for l in css_links:
        if l.startswith('http') or l.startswith('//') or l.startswith('#') or 'data:' in l:
            continue
        # ignore favicon/canonical if not local file
        if any(term in l for term in ['canonical']):
            continue
        clean_l = l.split('?')[0]
        full_path = os.path.normpath(os.path.join(dir_path, clean_l))
        if not os.path.exists(full_path):
            missing_assets.append((hf, 'CSS', l, full_path))
            
    # check script src
    js_srcs = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', text, re.I)
    for s in js_srcs:
        if s.startswith('http') or s.startswith('//') or 'data:' in s:
            continue
        clean_s = s.split('?')[0]
        full_path = os.path.normpath(os.path.join(dir_path, clean_s))
        if not os.path.exists(full_path):
            missing_assets.append((hf, 'JS', s, full_path))

print(f"Total missing CSS/JS links across all HTML files: {len(missing_assets)}")
for hf, kind, link, full in missing_assets:
    print(f"  {hf} -> [{kind}] {link} (resolved: {full})")
