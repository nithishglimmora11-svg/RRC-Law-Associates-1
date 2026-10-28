with open('cheque-bounce-lawyer.html', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'<style>(.*?)</style>', text, re.S)
if m:
    print(f"Style block length: {len(m.group(1))} characters")
    for line in m.group(1).splitlines()[:30]:
        print(line)

