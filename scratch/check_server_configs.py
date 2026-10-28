import os

for f in ['.htaccess', 'dev-server.js', 'vercel.json']:
    if os.path.exists(f):
        print(f"=== {f} ===")
        with open(f, encoding='utf-8') as fp:
            print(fp.read()[:500])

