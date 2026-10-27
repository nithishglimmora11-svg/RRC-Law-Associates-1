import http.server
import socketserver
import threading
import urllib.request
import re
import os

PORT = 8080

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass # suppress request spam in console

httpd = socketserver.TCPServer(('127.0.0.1', PORT), QuietHandler)
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()

print(f"Started Python http.server on port {PORT}")

FILES_TO_AUDIT = [
    'oci-card-assistance.html',
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

pattern = r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>'

tested_links = []
failed_links = []

for fname in FILES_TO_AUDIT:
    with open(fname, 'r', encoding='utf-8') as f:
        html = f.read()
    
    matches = re.finditer(pattern, html, re.DOTALL)
    print(f"\nTesting links in {fname}...")
    file_tested = 0
    file_failed = 0
    for m in matches:
        href = m.group(1)
        inner = re.sub(r'<[^>]+>', '', m.group(2)).strip()
        
        # Only test internal OCI guide links or links starting with /
        if href.startswith('/') and not href.startswith(('/#', '/assets/', '/style', '/topbar', '/script')):
            # Target URL on python http.server
            url = f"http://127.0.0.1:{PORT}{href}"
            file_tested += 1
            try:
                req = urllib.request.Request(url, method='HEAD')
                with urllib.request.urlopen(req) as resp:
                    if resp.status != 200:
                        failed_links.append((fname, href, inner, f"HTTP {resp.status}"))
                        file_failed += 1
            except Exception as e:
                failed_links.append((fname, href, inner, str(e)))
                file_failed += 1
                
    print(f"  Tested {file_tested} internal links, {file_failed} failures.")

httpd.shutdown()

print("\n" + "="*60)
print(f"TOTAL INTERNAL LINKS TESTED ACROSS ALL 15 FILES: {sum([1 for _ in tested_links]) + file_tested}")
print(f"TOTAL FAILURES: {len(failed_links)}")
if failed_links:
    print("FAILED LINKS:")
    for f, h, t, err in failed_links:
        print(f"  File: {f} | href: {h} | text: {t} | Error: {err}")
else:
    print("SUCCESS: ALL INTERNAL LINKS RESOLVED WITH HTTP 200 UNDER PYTHON'S HTTP.SERVER!")
