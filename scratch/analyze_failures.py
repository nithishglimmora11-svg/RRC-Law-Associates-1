import json

with open('scratch/full_verification_results.json') as f:
    results = json.load(f)

for r in results:
    if not r['passed']:
        print(f"FAIL: {r['slug']} [{r['viewport']}]")
        if r['failedHttp']:
            print(f"  failedHttp: {r['failedHttp']}")
        if r['brokenImgs']:
            print(f"  brokenImgs ({len(r['brokenImgs'])}): {r['brokenImgs']}")
