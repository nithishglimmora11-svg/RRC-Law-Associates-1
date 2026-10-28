with open('cheque-bounce-lawyer.html', encoding='utf-8') as f:
    text = f.read()

import re
head = re.search(r'<head>.*?</head>', text, re.S)
if head:
    lines = head.group(0).splitlines()
    for l in lines[:25]:
        print(l)

