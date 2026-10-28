with open('property-law.html', encoding='utf-8') as f:
    html = f.read()

# Update Card 2 paragraph with contextual links
old_p2 = "The foundation of absolute ownership rests upon structural precision within your primary title instruments. Our property attorneys prepare custom, legally airtight **Sale Deeds, Gift Deeds, Release Deeds, and Family Settlement Agreements**. We configure exact boundary limits, specify restrictive covenants, and structure indemnity clauses that guard your financial layout against boundary deviations or hidden tenancy challenges under Indian property jurisprudence."

new_p2 = "The foundation of absolute ownership rests upon structural precision within your primary title instruments. Our property attorneys prepare custom, legally airtight <strong>Sale Deeds, Gift Deeds, Release Deeds, and Family Settlement Agreements</strong>. We configure exact boundary limits, specify restrictive covenants, and structure indemnity clauses that guard your financial layout against boundary deviations or hidden tenancy challenges. For overseas non-resident owners executing transfers through authorized representatives, our conveyancing desk coordinates drafting and registering <a href=\"nri-power-of-attorney.html\" class=\"text-gold fw-semibold text-decoration-none\">Special Powers of Attorney for property</a> and defending against potential <a href=\"nri-property-disputes.html\" class=\"text-gold fw-semibold text-decoration-none\">property and title disputes</a>."

if old_p2 in html:
    html = html.replace(old_p2, new_p2)
    print("Enriched card 2 text in property-law.html!")
else:
    print("old_p2 not found in property-law!")

# Update images in property-law.html to picture tags
for base, ext in [('title-due-diligence', 'png'), ('deed-drafting', 'png'), ('sro-registration', 'png'), ('revenue-mutation', 'png')]:
    old_img = f'<img src="assets/images/{base}.{ext}" class="w-100 h-100 object-fit-cover"'
    new_pic = f'<picture><source srcset="assets/images/{base}.webp" type="image/webp"><img src="assets/images/{base}.{ext}" class="w-100 h-100 object-fit-cover"'
    if old_img in html:
        # replace closing tag
        idx = html.find(old_img)
        end_idx = html.find('>', idx)
        full_old = html[idx:end_idx+1]
        full_new = f'<picture><source srcset="assets/images/{base}.webp" type="image/webp">{full_old}</picture>'
        html = html[:idx] + full_new + html[end_idx+1:]
        print(f"Updated {base} to picture tag")

with open('property-law.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("property-law.html saved successfully!")

