from html.parser import HTMLParser
import glob

class SyntaxChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.errors = []

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

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    parser = SyntaxChecker()
    try:
        parser.feed(c)
        print(f"{f}: Valid HTML")
    except Exception as e:
        print(f"{f}: ERROR: {e}")
