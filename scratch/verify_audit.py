import os, re

files_to_check = [
    'oci-foreign-spouse-eligibility.html',
    'oci-for-children-born-abroad.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-renewal-passport-update.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html',
    'oci-vs-nri-vs-indian-citizen.html',
    'oci-card-application-documents.html',
    'oci-card-eligibility-legal-status.html',
    'oci-card-assistance.html',
    'oci-legal-guides.html',
    'lawfirm-blog.html',
    'index.html',
]

print('POST-FIX AUDIT REPORT')
print('=' * 80)

all_pass = True
for f in files_to_check:
    if not os.path.exists(f):
        print(f'MISSING: {f}')
        all_pass = False
        continue
    c = open(f, encoding='utf-8', errors='ignore').read()
    has_topbar = 'rrc-topbar' in c
    has_rrclogo = 'rrclogo.png' in c
    has_approved_phone = '97511 82452' in c
    has_approved_email = 'dr.kumar@rrclawassociates.com' in c
    has_wrong_phone = '98402 99699' in c
    has_wrong_email = 'admin@rrclawassociates.com' in c
    has_whatsapp = 'whatsapp-float' in c
    has_ai_chat = 'data-rrc-ai-chat-root' in c

    issues = []
    if not has_topbar: issues.append('NO_TOPBAR')
    if not has_rrclogo: issues.append('NO_RRCLOGO')
    if not has_approved_phone: issues.append('NO_APPROVED_PHONE')
    if has_wrong_phone: issues.append('WRONG_PHONE')
    if has_wrong_email: issues.append('WRONG_EMAIL')
    if not has_whatsapp: issues.append('NO_WA_FLOAT')
    if not has_ai_chat: issues.append('NO_AI_CHAT')

    status = 'PASS' if not issues else 'FAIL'
    if issues:
        all_pass = False
    print(f'[{status}] {f}')
    if issues:
        print(f'       Issues: {", ".join(issues)}')

print()
if all_pass:
    print('ALL PAGES PASS - No issues found.')
else:
    print('SOME PAGES STILL HAVE ISSUES - See above.')
