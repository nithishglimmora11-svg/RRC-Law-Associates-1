import os, shutil
from PIL import Image

sources = {
    r"C:\Users\nithi\.gemini\antigravity\brain\5811d5e0-b138-4b58-8903-80777aff37b5\nri_rera_builder_hero_1793099505214.jpg": "nri-rera-builder-hero",
    r"C:\Users\nithi\.gemini\antigravity\brain\5811d5e0-b138-4b58-8903-80777aff37b5\rera_project_delay_1793099527715.jpg": "rera-project-delay",
    r"C:\Users\nithi\.gemini\antigravity\brain\5811d5e0-b138-4b58-8903-80777aff37b5\builder_agreement_review_1793099553316.jpg": "builder-agreement-review",
    r"C:\Users\nithi\.gemini\antigravity\brain\5811d5e0-b138-4b58-8903-80777aff37b5\nri_real_estate_legal_consultation_1793099578525.jpg": "nri-real-estate-legal-consultation"
}

dest_dir = "assets/images"
os.makedirs(dest_dir, exist_ok=True)

for src_path, base_name in sources.items():
    if not os.path.exists(src_path):
        print(f"ERROR: Source does not exist: {src_path}")
        continue
    
    # 1. Copy JPG
    target_jpg = os.path.join(dest_dir, f"{base_name}.jpg")
    shutil.copy2(src_path, target_jpg)
    
    # 2. Convert to WebP
    target_webp = os.path.join(dest_dir, f"{base_name}.webp")
    with Image.open(src_path) as img:
        img_rgb = img.convert("RGB")
        img_rgb.save(target_webp, "WEBP", quality=85, method=6)
        w, h = img.size
    
    jpg_size = os.path.getsize(target_jpg)
    webp_size = os.path.getsize(target_webp)
    print(f"Processed {base_name}: Dimensions={w}x{h}, JPG={jpg_size} bytes, WebP={webp_size} bytes")

print("\nImage processing completed successfully!")

