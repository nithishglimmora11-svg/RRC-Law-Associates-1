with open('nri-property-disputes.html', encoding='utf-8') as f:
    html = f.read()

import re

target = re.search(r'<section class="article-hero text-center">.*?</section>', html, re.S)
if target:
    print("Found hero section:\n", target.group(0))
    new_hero = """<section class="article-hero text-center">
        <div class="container px-4">
            <span class="meta-text">Cross-Border Title Protection &amp; Trial Advocacy Desk</span>
            <h1 class="article-title mt-3 mb-2">NRI Property Disputes &amp; Title Litigation in Tamil Nadu</h1>
            <h2 class="article-subtitle mt-1 mb-4">Legal Protection Against Land Encroachment, Adverse Possession Claims, Illegal Occupation &amp; Ancestral Partition Disputes</h2>
            <p class="lead text-muted mx-auto" style="max-width: 880px;">
                Vacant residential plots, agricultural holdings, and ancestral family estates in Tamil Nadu are frequently exposed to illegal encroachment, adverse possession claims, unauthorized caretaker possession, and fraudulent power of attorney transfers while owners reside abroad. RRC Law Associates delivers strategic trial court advocacy: securing emergency ad-interim injunctions under Order 39 CPC, defending title against hostile possession claims, instituting declaration and partition suits, and recovering vacant physical possession across Thanjavur and all Tamil Nadu districts.
            </p>
        </div>
    </section>"""
    html = html[:target.start()] + new_hero + html[target.end():]
    with open('nri-property-disputes.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Hero updated in nri-property-disputes.html!")
else:
    print("Hero not found!")

