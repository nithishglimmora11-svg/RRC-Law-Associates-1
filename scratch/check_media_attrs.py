import re

with open('oci-card-assistance.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Any src attributes
srcs = re.findall(r'\bsrc=["\']([^"\']+)["\']', c)
for s in srcs:
    print("src:", s)

# Any data- attributes with urls
data_urls = re.findall(r'\bdata-[a-z0-9_-]+=["\']([^"\']+\.(?:png|jpg|jpeg|webp|svg|gif|mp4|css|js))["\']', c)
print("data urls:", data_urls)

# Any background / poster attributes
posters = re.findall(r'\bposter=["\']([^"\']+)["\']', c)
print("posters:", posters)

# Any background attributes
bgs = re.findall(r'\bbackground=["\']([^"\']+)["\']', c)
print("backgrounds:", bgs)
