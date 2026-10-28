with open('nri-property-disputes.html', encoding='utf-8') as f:
    text = f.read()

print('Total lines in nri-property-disputes.html:', len(text.splitlines()))
for token in ['<title>', '<link rel="canonical"', 'Adverse Possession', 'Order 39', 'dispFaqHeadingFive', 'Hindu Succession Act']:
    print(token, 'found:', token.lower() in text.lower())
# Verify no POA FAQs remain
print("POA FAQ remains:", "mandatory timeline for adjudicating a foreign power of attorney" in text.lower())

