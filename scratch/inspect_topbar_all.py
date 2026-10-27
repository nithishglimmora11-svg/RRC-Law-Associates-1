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

    topbar_match = re.search(r'<div class=["\']rrc-topbar["\'].*?</div>\s*</div>', html, re.DOTALL)
    topbar_summary = "YES" if topbar_match else "NO"
    
    # check header style in <style>
    header_css = re.findall(r'\.header\s*\{[^}]*\}', html)
    topbar_css_in_style = re.findall(r'\.rrc-topbar\s*\{[^}]*\}', html)
    
    print(f"{fname}:")
    print(f"  topbar markup: {topbar_summary}")
    print(f"  header CSS in <style>: {header_css}")
    print(f"  topbar CSS in <style>: {topbar_css_in_style}")
