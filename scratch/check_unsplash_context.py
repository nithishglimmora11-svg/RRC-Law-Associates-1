for f in ['litigation-dispute-resolution.html', 'property-law.html']:
    with open(f, encoding='utf-8') as fp:
        c = fp.read()
    pos = c.find('images.unsplash.com')
    print(f"=== {f} ===")
    print(c[pos-100:pos+250])

