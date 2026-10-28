import glob, os

images = glob.glob('assets/images/*.*')
for img in sorted(images):
    base = os.path.basename(img)
    if any(k in base.lower() for k in ['poa', 'dispute', 'cheque', 'debt', 'justice', 'court', 'contract', 'agreement', 'recovery', 'property']):
        print(f"  {base} ({os.path.getsize(img)} bytes)")

