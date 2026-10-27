pages = ['booking.html', 'nri-services.html', 'blog-deepfake-legal-remedies.html']
for p in pages:
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    import re
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', text)
    print(p, 'scripts:', scripts)
