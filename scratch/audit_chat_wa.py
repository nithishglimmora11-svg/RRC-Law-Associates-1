import glob
import re

articles = [
    'oci-card-eligibility-legal-status.html',
    'oci-vs-nri-vs-indian-citizen.html',
    'oci-card-application-documents.html',
    'oci-foreign-spouse-eligibility.html',
    'oci-for-children-born-abroad.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-renewal-passport-update.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html',
    'oci-legal-guides.html',
    'oci-card-assistance.html',
    'oci-card-indian-ancestry-assistance.html'
]

print(f"{'Article':<55} | {'floating-wa':<11} | {'wa-float':<9} | {'script.js':<9} | {'chat-root':<9}")
print("-" * 105)

for a in articles:
    with open(a, 'r', encoding='utf-8') as f:
        c = f.read()
    fw = len(re.findall(r'floating-whatsapp', c))
    wf = len(re.findall(r'whatsapp-float', c))
    sjs = len(re.findall(r'script\.js', c))
    cr = len(re.findall(r'data-rrc-ai-chat-root', c))
    print(f"{a:<55} | {fw:<11} | {wf:<9} | {sjs:<9} | {cr:<9}")
