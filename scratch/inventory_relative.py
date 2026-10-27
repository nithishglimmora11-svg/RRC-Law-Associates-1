import os
import re

files = [
    'oci-legal-guides.html',
    'oci-card-eligibility-legal-status.html',
    'oci-vs-nri-vs-indian-citizen.html',
    'oci-card-application-documents.html',
    'oci-card-indian-ancestry-assistance.html',
    'oci-foreign-spouse-eligibility.html',
    'oci-for-children-born-abroad.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-renewal-passport-update.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html'
]

summary = {}

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    # Find relative links in <link> tags
    links = re.findall(r'<link\s+[^>]*href=["\']([^"\']+)["\']', html)
    rel_links = [l for l in links if not l.startswith('http') and not l.startswith('/')]

    # Find relative images in <img> tags
    imgs = re.findall(r'<img\s+[^>]*src=["\']([^"\']+)["\']', html)
    rel_imgs = [i for i in imgs if not i.startswith('http') and not i.startswith('/')]

    # Find relative scripts in <script> tags
    scripts = re.findall(r'<script\s+[^>]*src=["\']([^"\']+)["\']', html)
    rel_scripts = [s for s in scripts if not s.startswith('http') and not s.startswith('/')]

    # Find relative page hrefs in <a> tags (excluding anchor fragments, tel:, mailto:)
    a_tags = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', html)
    rel_a = [a for a in a_tags if not a.startswith('http') and not a.startswith('/') and not a.startswith('#') and not a.startswith('tel:') and not a.startswith('mailto:')]

    summary[fname] = {
        'rel_links': sorted(list(set(rel_links))),
        'rel_imgs': sorted(list(set(rel_imgs))),
        'rel_scripts': sorted(list(set(rel_scripts))),
        'rel_a_count': len(rel_a),
        'rel_a_unique': sorted(list(set(rel_a)))
    }

for fname, data in summary.items():
    print(f"\n==========================================")
    print(f"FILE: {fname}")
    print(f"  rel_links: {data['rel_links']}")
    print(f"  rel_imgs: {data['rel_imgs']}")
    print(f"  rel_scripts: {data['rel_scripts']}")
    print(f"  rel_a ({data['rel_a_count']} total, {len(data['rel_a_unique'])} unique):")
    for a in data['rel_a_unique']:
        print(f"    {a}")
