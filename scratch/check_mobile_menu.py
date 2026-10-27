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

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()

    has_drawer = 'id="mobileMenu"' in html
    has_toggle = 'id="menuToggle"' in html
    has_script = 'menuToggle.addEventListener' in html or 'getElementById(\'menuToggle\')' in html
    print(f"{fname}: has_drawer={has_drawer}, has_toggle={has_toggle}, has_script={has_script}")
