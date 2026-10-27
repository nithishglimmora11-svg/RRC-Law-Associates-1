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

target = """                            <li>
                                <a href="oci-card-assistance.html">
                                    <strong><i class="bi bi-briefcase text-gold me-1"></i> OCI Legal Services</strong>
                                    <div class="small text-muted">Our complete scope of representation</div>
                                </a>
                            </li>"""

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    # Normalize CRLF to LF for comparison
    c_lf = c.replace('\r\n', '\n')
    target_lf = target.replace('\r\n', '\n')
    count = c_lf.count(target_lf)
    print(f, 'matches:', count)
