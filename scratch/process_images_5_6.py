import os
from PIL import Image

tasks = [
    {
        "src": r"C:\Users\nithi\.gemini\antigravity\brain\5811d5e0-b138-4b58-8903-80777aff37b5\inheritance_dispute_legal_consultation_1793082222226.jpg",
        "dest_base": r"assets\images\dispute-resolution-defense"
    },
    {
        "src": r"C:\Users\nithi\.gemini\antigravity\brain\5811d5e0-b138-4b58-8903-80777aff37b5\nri_legal_desk_workspace_1793082253650.jpg",
        "dest_base": r"assets\images\cross-border-legal-representation"
    }
]

for t in tasks:
    with Image.open(t["src"]) as im:
        w, h = im.size
        print(f"Loaded {t['src']}: {w}x{h}, mode={im.mode}")
        webp_path = t["dest_base"] + ".webp"
        im.save(webp_path, "WEBP", quality=85, method=6)
        print(f"Saved {webp_path}: {os.path.getsize(webp_path)/1024:.1f} KB")

        jpg_path = t["dest_base"] + ".jpg"
        im.convert("RGB").save(jpg_path, "JPEG", quality=88, optimize=True)
        print(f"Saved {jpg_path}: {os.path.getsize(jpg_path)/1024:.1f} KB")

