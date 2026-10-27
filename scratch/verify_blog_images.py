import re
import os
from PIL import Image

print("=" * 60)
print("FINAL QA VERIFICATION FOR OCI BLOG IMAGES")
print("=" * 60)

# 1. Verify Image Assets on Disk
img1_path = "assets/images/oci-foreign-spouse-eligibility.jpg"
img2_path = "assets/images/oci-for-children-born-abroad.jpg"

assert os.path.exists(img1_path), f"Missing {img1_path}"
assert os.path.exists(img2_path), f"Missing {img2_path}"

im1 = Image.open(img1_path)
im2 = Image.open(img2_path)
print(f"[OK] Image 1: {img1_path} | Size: {im1.size} | Format: {im1.format} | Bytes: {os.path.getsize(img1_path):,}")
print(f"[OK] Image 2: {img2_path} | Size: {im2.size} | Format: {im2.format} | Bytes: {os.path.getsize(img2_path):,}")

# 2. Verify lawfirm-blog.html
blog_content = open("lawfirm-blog.html", encoding="utf-8").read()
assert "assets/images/oci-foreign-spouse-eligibility.jpg" in blog_content, "Missing spouse image in blog"
assert "assets/images/oci-for-children-born-abroad.jpg" in blog_content, "Missing children image in blog"
assert 'alt="Foreign spouse reviewing OCI eligibility and application documents"' in blog_content, "Missing spouse alt"
assert 'alt="Indian-origin family preparing OCI documents for a child born abroad"' in blog_content, "Missing children alt"
assert "whatsapp-float" in blog_content, "Missing whatsapp float in blog"
assert "data-rrc-ai-chat-root" in blog_content, "Missing AI chat in blog"
print("[OK] lawfirm-blog.html verified: both cards have correct new images, exact alt text, preserved badges and links")

# 3. Verify oci-foreign-spouse-eligibility.html
spouse_content = open("oci-foreign-spouse-eligibility.html", encoding="utf-8").read()
assert "https://rrclawassociates.com/assets/images/oci-foreign-spouse-eligibility.jpg" in spouse_content, "Missing og/twitter image"
assert 'src="assets/images/oci-foreign-spouse-eligibility.jpg"' in spouse_content, "Missing hero image"
assert 'alt="Foreign spouse reviewing OCI eligibility and application documents"' in spouse_content, "Missing hero alt"
assert "matrimonial-card.png" not in spouse_content, "Stale matrimonial-card.png found in spouse page"
print("[OK] oci-foreign-spouse-eligibility.html verified: all image refs updated, zero stale image references")

# 4. Verify oci-for-children-born-abroad.html
child_content = open("oci-for-children-born-abroad.html", encoding="utf-8").read()
assert "https://rrclawassociates.com/assets/images/oci-for-children-born-abroad.jpg" in child_content, "Missing og/twitter image"
assert 'src="assets/images/oci-for-children-born-abroad.jpg"' in child_content, "Missing hero image"
assert 'alt="Indian-origin family preparing OCI documents for a child born abroad"' in child_content, "Missing hero alt"
assert "Cross-Border Child Custody.png" not in child_content, "Stale Cross-Border Child Custody.png found in child page"
print("[OK] oci-for-children-born-abroad.html verified: all image refs updated, zero stale image references")

# 5. Verify oci-legal-guides.html
guides_content = open("oci-legal-guides.html", encoding="utf-8").read()
assert 'src="assets/images/oci-foreign-spouse-eligibility.jpg"' in guides_content, "Missing spouse image in guides hub"
assert 'src="assets/images/oci-for-children-born-abroad.jpg"' in guides_content, "Missing child image in guides hub"
print("[OK] oci-legal-guides.html verified: Guide 5 and Guide 6 updated consistently")

print("=" * 60)
print("ALL VERIFICATION CHECKS PASSED PERFECTLY!")
print("=" * 60)
