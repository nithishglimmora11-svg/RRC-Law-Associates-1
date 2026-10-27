import http.server
import socketserver
import threading
import urllib.request
import re

PORT = 8999

class Handler(http.server.SimpleHTTPRequestHandler):
    pass

httpd = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
t = threading.Thread(target=httpd.serve_forever, daemon=True)
t.start()

with open('oci-card-assistance.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract all src and href
assets = set()
for m in re.findall(r'(?:src|href)=["\'](/[^"\']+)["\']', html):
    path = m.split('?')[0].split('#')[0]
    if path.endswith(('.png', '.jpg', '.jpeg', '.webp', '.mp4', '.css', '.js', '.webmanifest')):
        assets.add(m)

print(f"Testing {len(assets)} unique media/code assets via HTTP...")
failed = []
passed = []
for a in sorted(assets):
    url = f"http://127.0.0.1:{PORT}{a}"
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req) as resp:
            print(f"HTTP {resp.status}: {a}")
            passed.append(a)
    except Exception as e:
        print(f"FAIL {a}: {e}")
        failed.append(a)

httpd.shutdown()
if failed:
    print(f"\nFailed assets ({len(failed)}):", failed)
else:
    print(f"\nALL {len(passed)} ASSETS LOADED SUCCESSFULLY (200 OK)!")
