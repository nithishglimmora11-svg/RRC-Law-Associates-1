with open('litigation-dispute-resolution.html', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'(/\* --- IN-DEPTH PRACTICE FOCUS --- \*/.*?</style>)', text, re.S)
if m:
    print(m.group(0)[:1500])

