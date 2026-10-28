with open('nri-property-disputes.html', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<section class="article-hero' in line or '<section class="py-5 bg-white border-bottom' in line or '<div class="col-lg-8 content-body' in line or '<section class="py-5" style="background-color: #ffffff;' in line or '<footer class="footer' in line:
        print(f"Line {i+1}: {line.strip()[:80]}")

