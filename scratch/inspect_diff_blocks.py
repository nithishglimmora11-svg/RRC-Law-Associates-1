import subprocess
import re

files = [
    'nri-oci-property-due-diligence-india.html',
    'nri-oci-property-tax-india.html',
    'oci-card-application-documents.html',
    'oci-card-assistance.html',
    'oci-card-benefits-restrictions-india.html',
    'oci-card-cancellation-grounds-remedies.html',
    'oci-card-cancellation-section-7d-legal-remedies.html',
    'oci-card-eligibility-legal-status.html',
    'oci-card-indian-ancestry-assistance.html',
    'oci-card-renewal-passport-update.html',
    'oci-cardholders-inherit-sell-ancestral-property-india.html',
    'oci-for-children-born-abroad.html',
    'oci-foreign-spouse-eligibility.html',
    'oci-legal-guides.html',
    'oci-vs-nri-vs-indian-citizen.html'
]

print("=== INSPECTING DIFF BLOCKS PER FILE ===")
for f in files:
    out = subprocess.check_output(['git', 'diff', '-w', f], text=True)
    # Check lines of diff ignoring whitespace
    diff_lines = out.splitlines()
    additions = [l for l in diff_lines if l.startswith('+') and not l.startswith('+++')]
    deletions = [l for l in diff_lines if l.startswith('-') and not l.startswith('---')]
    print(f"{f:55}: +{len(additions)} -{len(deletions)} (ignore-space)")
