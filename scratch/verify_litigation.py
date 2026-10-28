with open('litigation-dispute-resolution.html', encoding='utf-8') as f:
    text = f.read()

print('Total lines in litigation-dispute-resolution.html:', len(text.splitlines()))
for token in ['<title>', '<link rel="canonical"', 'Order 37', 'litFaqHeadingFive', 'Commercial Courts Act', 'cheque-bounce-lawyer.html']:
    print(token, 'found:', token.lower() in text.lower())

