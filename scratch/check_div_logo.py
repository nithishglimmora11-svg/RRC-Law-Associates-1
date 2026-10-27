import glob
import re

found = []
for fn in sorted(glob.glob("*.html")):
    c = open(fn, encoding="utf-8").read()
    if re.search(r'class=["\']logo["\']\s*>\s*<a[^>]*>\s*<img[^>]*rrclogo', c, re.DOTALL):
        found.append(fn)

print("Files with class='logo' around rrclogo:")
for f in found:
    print(" -", f)
