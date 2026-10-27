for fn in ['oci-card-cancellation-grounds-remedies.html', 'oci-foreign-spouse-eligibility.html', 'oci-legal-guides.html']:
    c = open(fn, encoding='utf-8').read()
    idx = c.find('class="accordion-body"')
    print(f"=== {fn} HTML ===")
    if idx != -1:
        print(c[idx:idx+250].replace('\n', ' '))
