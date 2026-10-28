with open('cheque-bounce-lawyer.html', encoding='utf-8') as f:
    text = f.read()

for c in ['.litigation-row-card', '.visual-token-box', '.custom-faq-accordion', '.sticky-sidebar']:
    print(c, c in text)

