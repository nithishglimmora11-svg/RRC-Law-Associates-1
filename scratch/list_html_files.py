import glob

files = sorted(glob.glob("*.html"))
print(f"Total HTML files in root: {len(files)}")
for f in files:
    print(" ", f)

