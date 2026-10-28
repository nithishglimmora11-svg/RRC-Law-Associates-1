from PIL import Image
import os

images_to_convert = [
    'deed-drafting',
    'sro-registration',
    'title-due-diligence',
    'poa-drafting',
    'poa-attestation',
    'poa-revocation',
    'encroachment',
    'partition',
    'deed-audit',
    'revenue'
]

for name in images_to_convert:
    png_path = f"assets/images/{name}.png"
    webp_path = f"assets/images/{name}.webp"
    if os.path.exists(png_path) and not os.path.exists(webp_path):
        im = Image.open(png_path)
        im.save(webp_path, 'WEBP', quality=85)
        print(f"Generated {webp_path}: {os.path.getsize(webp_path)} bytes (from {os.path.getsize(png_path)} bytes)")
    else:
        print(f"Skipping {name}: webp exists or png not found")

