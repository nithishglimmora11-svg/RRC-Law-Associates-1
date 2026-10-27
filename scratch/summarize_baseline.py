import json

with open('scratch/baseline_audit_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== VIEWPORT OVERFLOW SUMMARY ===')
for page, pdata in data.items():
    overflows = []
    for vp, vdata in pdata['viewports'].items():
        if vdata.get('hasOverflow'):
            overflows.append(f"{vp} (+{vdata.get('overflowAmount')}px)")
    if overflows:
        print(f"FAIL {page}: {overflows}")
    else:
        print(f"PASS {page}: all 12 viewports have 0 horizontal overflow")

print('\n=== CONSOLE LOGS SUMMARY ===')
for page, pdata in data.items():
    logs = pdata.get('consoleLogs', [])
    err_logs = [l for l in logs if l.get('type') == 'error']
    warn_logs = [l for l in logs if l.get('type') == 'warning']
    if logs:
        print(f"{page}: {len(logs)} logs ({len(err_logs)} errors, {len(warn_logs)} warnings)")
        for l in logs:
            print(f"   [{l.get('type')}] {l.get('text')}")

print('\n=== NETWORK FAILURES SUMMARY ===')
for page, pdata in data.items():
    nets = pdata.get('networkFailures', [])
    if nets:
        print(f"{page}: {len(nets)} failures: {nets}")
    else:
        print(f"{page}: 0 network failures")

print('\n=== NAV INTERACTION SUMMARY ===')
for page, pdata in data.items():
    nav = pdata.get('navInteraction')
    print(f"{page}: {nav}")

print('\n=== FLOATING WIDGETS SUMMARY ===')
for page, pdata in data.items():
    fw = pdata.get('floatingWidgets')
    print(f"{page}: {fw}")
