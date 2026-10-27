import re

c = open("oci-legal-guides.html", encoding="utf-8").read()

lines = c.splitlines()
print(f"Total lines in oci-legal-guides.html: {len(lines)}")
print("Matches for '14' or '15' or guide counts:")
print("=" * 60)

for i, line in enumerate(lines, 1):
    if re.search(r'\b14\b|\b15\b|in-depth guide|guide[s]?\s+across', line, re.IGNORECASE):
        print(f"L{i}: {line.strip()[:140]}")
