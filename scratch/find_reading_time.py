import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Searching for reading-time patterns:")
print("=" * 60)

for fn in sorted(glob.glob("*.html")):
    c = open(fn, encoding="utf-8").read()
    # Search for variations: \d+\s*min\s*read, etc.
    matches = re.finditer(r'(<[^>]+>[^<]*?\b\d+\s*min(?:\s*read)?[^<]*?<[^>]+>|[^>\n]*\b\d+\s*min\s*read\b[^<\n]*)', c, re.IGNORECASE)
    found = list(matches)
    if found:
        print(f"=== {fn} ===")
        for m in found:
            idx = m.start()
            start = max(0, idx - 100)
            end = min(len(c), idx + len(m.group(0)) + 100)
            snippet = c[start:end].replace('\n', ' ')
            print("  FOUND:", repr(snippet))
        print()
