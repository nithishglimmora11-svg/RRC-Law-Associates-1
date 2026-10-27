for fn in ['oci-card-cancellation-grounds-remedies.html', 'oci-foreign-spouse-eligibility.html', 'nri-services.html']:
    c = open(fn, encoding='utf-8').read()
    idx = c.find('accordion-body')
    print(f"=== {fn} ===")
    while idx != -1:
        snippet = c[idx:idx+180].replace('\n', ' ')
        print("  Snippet:", snippet)
        idx = c.find('accordion-body', idx + 180)
        break
