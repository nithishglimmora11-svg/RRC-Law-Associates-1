import glob, os

files = glob.glob('*.html')
found_in = []
for f in files:
    with open(f, encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    if 'cheque-bounce-lawyer' in c:
        found_in.append(f)

print(f"cheque-bounce-lawyer linked in {len(found_in)} files:")
for f in found_in:
    print(" ", f)

