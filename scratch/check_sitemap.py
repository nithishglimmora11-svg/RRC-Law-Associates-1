with open('sitemap.xml', encoding='utf-8') as f:
    text = f.read()

for p in ['nri-power-of-attorney', 'nri-property-disputes', 'cheque-bounce-lawyer', 'litigation-dispute-resolution', 'property-law']:
    if p in text:
        print(f"Found {p} in sitemap.xml")
    else:
        print(f"NOT FOUND: {p} in sitemap.xml")

