with open('nri-power-of-attorney.html', encoding='utf-8') as f:
    text = f.read()

print('Total lines:', len(text.splitlines()))
for token in ['<title>', '<link rel="canonical"', 'Special Power of Attorney', 'poa-revocation.webp', 'poaFaqCollapseFive', 'suraj lamp']:
    print(token, 'found:', token.lower() in text.lower())

