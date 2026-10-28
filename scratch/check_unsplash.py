import re

for f in ['litigation-dispute-resolution.html', 'property-law.html', 'cheque-bounce-lawyer.html']:
    with open(f, encoding='utf-8') as fp:
        c = fp.read()
    unsplash = re.findall(r'https?://images\.unsplash\.com[^\s"\'<>]+', c)
    print(f"{f}: Unsplash matches: {len(unsplash)}")
    for u in unsplash:
        print("  ", u)

