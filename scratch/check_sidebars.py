import os

files = [
    'nri-oci-property-tax-india.html',
    'nri-oci-property-due-diligence-india.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-for-children-born-abroad.html',
    'oci-foreign-spouse-eligibility.html',
    'oci-card-application-documents.html',
    'oci-vs-nri-vs-indian-citizen.html',
    'oci-card-eligibility-legal-status.html'
]

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    for needle in ['Related OCI Guides', 'Related Guides', 'OCI Legal Guides', 'All OCI Guides']:
        pos = content.find(needle)
        if pos != -1:
            print(f'=== {fname} has "{needle}" at {pos} ===')
            # Look for the </ul> that closes this sidebar list
            ul_end = content.find('</ul>', pos)
            # print the last 300 chars before ul_end
            print(content[max(pos, ul_end-350):ul_end+10])
            break
    else:
        print(f'{fname}: NO MATCH')
