import os
from PIL import Image

images = [
    {
        "src": r"C:\Users\nithi\.gemini\antigravity\brain\5811d5e0-b138-4b58-8903-80777aff37b5\wills_probate_hero_1793080327308.jpg",
        "dest_base": r"c:\Users\nithi\RRC-Law-Associates-1\assets\images\wills-probate-hero"
    },
    {
        "src": r"C:\Users\nithi\.gemini\antigravity\brain\5811d5e0-b138-4b58-8903-80777aff37b5\will_drafting_estate_planning_1793080369996.jpg",
        "dest_base": r"c:\Users\nithi\RRC-Law-Associates-1\assets\images\wills-drafting-estate-planning"
    },
    {
        "src": r"C:\Users\nithi\.gemini\antigravity\brain\5811d5e0-b138-4b58-8903-80777aff37b5\probate_estate_legal_review_clean_1793080397524.jpg",
        "dest_base": r"c:\Users\nithi\RRC-Law-Associates-1\assets\images\probate-court-procedures"
    },
    {
        "src": r"C:\Users\nithi\.gemini\antigravity\brain\5811d5e0-b138-4b58-8903-80777aff37b5\tamil_nadu_property_documentation_editorial_1793080405590.jpg",
        "dest_base": r"c:\Users\nithi\RRC-Law-Associates-1\assets\images\inherited-property-administration"
    }
]

for item in images:
    with Image.open(item["src"]) as im:
        w, h = im.size
        print(f"Original {item['src']}: {w}x{h}, mode={im.mode}")
        
        # Save as optimized WebP
        webp_path = item["dest_base"] + ".webp"
        im.save(webp_path, "WEBP", quality=85, method=6)
        webp_size = os.path.getsize(webp_path)
        print(f"Saved {webp_path}: {webp_size / 1024:.1f} KB")

        # Also save high quality jpg
        jpg_path = item["dest_base"] + ".jpg"
        im.convert("RGB").save(jpg_path, "JPEG", quality=88, optimize=True)
        jpg_size = os.path.getsize(jpg_path)
        print(f"Saved {jpg_path}: {jpg_size / 1024:.1f} KB")

