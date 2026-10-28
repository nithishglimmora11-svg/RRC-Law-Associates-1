import urllib.request
import urllib.error

urls = [
    'http://localhost:5502/nri-power-of-attorney.html',
    'http://localhost:5502/nri-property-disputes.html',
    'http://localhost:5502/cheque-bounce-lawyer.html',
    'http://localhost:5502/litigation-dispute-resolution.html',
    'http://localhost:5502/property-law.html'
]

for u in urls:
    try:
        req = urllib.request.urlopen(u)
        print(f"{u:60} -> Status: {req.status}, Length: {len(req.read())}")
    except urllib.error.HTTPError as e:
        print(f"{u:60} -> HTTP ERROR: {e.code}")
    except Exception as e:
        print(f"{u:60} -> ERROR: {e}")

