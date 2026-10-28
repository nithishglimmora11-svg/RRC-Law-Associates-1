import urllib.request
import urllib.error

urls = [
    'http://localhost:5502/nri-power-of-attorney',
    'http://localhost:5502/nri-property-disputes',
    'http://localhost:5502/cheque-bounce-lawyer',
    'http://localhost:5502/litigation-dispute-resolution',
    'http://localhost:5502/property-law',
    'http://localhost:5502/sitemap.xml'
]

for u in urls:
    try:
        req = urllib.request.urlopen(u)
        print(f"{u:55} -> Status: {req.status}, Length: {len(req.read())}")
    except urllib.error.HTTPError as e:
        print(f"{u:55} -> HTTP ERROR: {e.code}")
    except Exception as e:
        print(f"{u:55} -> ERROR: {e}")

