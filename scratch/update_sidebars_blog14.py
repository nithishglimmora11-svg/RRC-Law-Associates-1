files = [
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-renewal-passport-update.html',
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

insertion = """                            <li>
                                <a href="oci-card-cancellation-section-7d-legal-remedies.html">
                                    <strong><i class="bi bi-shield-lock text-gold me-1"></i> Guide 14: Section 7D &amp; Criminal Cases</strong>
                                    <div class="small text-muted">Criminal proceedings, notifications &amp; writ review</div>
                                </a>
                            </li>
"""

target = """                            <li>
                                <a href="oci-card-assistance.html">
                                    <strong><i class="bi bi-briefcase text-gold me-1"></i> OCI Legal Services</strong>
                                    <div class="small text-muted">Our complete scope of representation</div>
                                </a>
                            </li>"""

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Detect CRLF or LF
    crlf = '\r\n' in content
    target_matched = target.replace('\r\n', '\n')
    content_norm = content.replace('\r\n', '\n')

    if target_matched not in content_norm:
        print(f"ERROR: target not found in {fname}")
        continue

    count = content_norm.count(target_matched)
    if count != 1:
        print(f"ERROR: target found {count} times in {fname}")
        continue

    new_content_norm = content_norm.replace(target_matched, insertion.replace('\r\n', '\n') + target_matched)

    if crlf:
        new_content = new_content_norm.replace('\n', '\r\n')
    else:
        new_content = new_content_norm

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Successfully updated {fname}")
