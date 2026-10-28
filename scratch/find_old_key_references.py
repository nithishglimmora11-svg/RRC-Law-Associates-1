import os

old_key = "070a477f-e139-4bcf-838c-49abddcc0959"
exts = {".html", ".js", ".json", ".php", ".py", ".bak", ".txt", ".md", ".env", ".config"}

matches = []

for root, dirs, files in os.walk("."):
    if ".git" in root or "node_modules" in root or "chrome_" in root or "edge-" in root:
        continue
    for file in files:
        _, ext = os.path.splitext(file)
        if ext.lower() in exts:
            filepath = os.path.join(root, file)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    if old_key in content:
                        count = content.count(old_key)
                        matches.append((filepath, count))
            except Exception:
                pass

print("=== REPOSITORY AUDIT FOR OLD KEY ===")
for path, count in sorted(matches):
    print(f"File: {path} (Occurrences: {count})")

print(f"\nTotal files referencing old key: {len(matches)}")
