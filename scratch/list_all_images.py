import glob, os

images = glob.glob('assets/images/*.*')
for img in sorted(images):
    base = os.path.basename(img)
    print(f"  {base} ({os.path.getsize(img)} bytes)")

