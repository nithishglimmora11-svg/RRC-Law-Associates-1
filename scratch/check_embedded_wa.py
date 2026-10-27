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
    'oci-card-cancellation-section-7d-legal-remedies.html'
]

for a in articles:
    with open(a, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Find all style tags
    style_blocks = re.findall(r'<style[^>]*>([\s\S]*?)</style>', text)
    wa_styles = []
    for sb in style_blocks:
        wa_matches = re.findall(r'[^{}]*whatsapp[^{}]*\{[^}]*\}', sb)
        if wa_matches:
            wa_styles.extend(wa_matches)
    
    print(f"=== {a} ===")
    if wa_styles:
        for ws in wa_styles:
            print("  STYLE:", ws.strip().replace('\n', ' '))
    else:
        print("  No embedded whatsapp styles found.")
