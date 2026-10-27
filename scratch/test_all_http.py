import urllib.request
import re
import os

endpoints = [
    'index.html',
    'lawfirm-blog.html',
    'oci-legal-guides.html',
    'oci-card-assistance.html',
    'oci-card-indian-ancestry-assistance.html',
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
    # clean url directory fallbacks
    'oci-card-eligibility-legal-status/',
    'oci-vs-nri-vs-indian-citizen/',
    'oci-card-application-documents/',
    'oci-foreign-spouse-eligibility/',
    'oci-for-children-born-abroad/',
    'oci-card-benefits-restrictions-india/',
    'oci-cardholders-inherit-sell-ancestral-property-india/',
    'nri-oci-property-due-diligence-india/',
    'nri-oci-property-tax-india/',
    'oci-card-renewal-passport-update/',
    'oci-card-cancellation-grounds-remedies/',
    'oci-card-cancellation-section-7d-legal-remedies/'
]

print("Testing HTTP 200 for all endpoints on http://localhost:8080/ ...")
print("=" * 70)

all_ok = True
for ep in endpoints:
    url = f"http://localhost:8080/{ep}"
    try:
        resp = urllib.request.urlopen(url, timeout=5)
        length = resp.headers.get('Content-Length', 'chunked')
        print(f"[HTTP 200] {ep} ({length} bytes)")
    except Exception as e:
        print(f"[FAIL] {ep} -> {e}")
        all_ok = False

print("=" * 70)
print("HTTP ENDPOINT RESULT:", "ALL PASSED (200 OK)!" if all_ok else "ERRORS DETECTED")
