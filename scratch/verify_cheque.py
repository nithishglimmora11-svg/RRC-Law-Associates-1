with open('cheque-bounce-lawyer.html', encoding='utf-8') as f:
    text = f.read()

print('Total lines in cheque-bounce-lawyer.html:', len(text.splitlines()))
for token in ['<title>', '<link rel="canonical"', 'Section 143A', 'Cheque Return Memo', 'cbFaqHeadingFour', 'Order 37 CPC']:
    print(token, 'found:', token.lower() in text.lower())

