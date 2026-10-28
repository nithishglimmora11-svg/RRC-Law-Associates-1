import os

for root, dirs, files in os.walk('.'):
    # Skip scratch, node_modules, .git, etc.
    if any(skip in root for skip in ['scratch', '.git', 'node_modules', '.gemini']):
        continue
    for f in files:
        if f.endswith('.html'):
            rel_path = os.path.relpath(os.path.join(root, f), '.')
            if os.path.dirname(rel_path):
                print("Subdir HTML file:", rel_path)

