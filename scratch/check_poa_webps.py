import os

for base in ['deed-drafting', 'sro-registration', 'title-due-diligence', 'poa-drafting', 'poa-attestation', 'poa-revocation', 'poa-adjudication']:
    png = f"assets/images/{base}.png"
    webp = f"assets/images/{base}.webp"
    jpg = f"assets/images/{base}.jpg"
    print(f"{base:25}: png={os.path.exists(png)}, webp={os.path.exists(webp)}, jpg={os.path.exists(jpg)}")

