with open('nri-power-of-attorney.html', encoding='utf-8') as f:
    text = f.read()

import re

# Find line of <head> and </head>
print("Head starts around line:", text[:text.find('<head>')].count('\n') + 1)
print("Head ends around line:", text[:text.find('</head>')].count('\n') + 1)
print("Main content starts around line:", text[:text.find('<section class="article-hero')].count('\n') + 1)
print("FAQ section starts around line:", text[:text.find('<section class="py-5" style="background-color: #ffffff;">\n    <div class="container" style="max-width: 850px;"')].count('\n') + 1)
print("Footer starts around line:", text[:text.find('<footer class="footer">')].count('\n') + 1)

