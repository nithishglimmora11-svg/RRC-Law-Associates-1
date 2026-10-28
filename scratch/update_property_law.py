import re

with open('property-law.html', encoding='utf-8') as f:
    html = f.read()

# 1. Update Head section (Title, Meta Description, Keywords, Canonical)
old_head = """        <title>Due Diligence Lawyers in Thanjavur | Best Law Lawyers in Thanjavur | RRC Law Associates | Tamil nadu</title>

        <meta name="description" content="Professional legal support for due diligence services, property investigations, and corporate legal matters in Thanjavur, Tamil Nadu at RRC Law Associates.">

        <meta name="keywords" content="due diligence lawyer Thanjavur, property investigation advocate in thanjavur, corporate law lawyer Thanjavur, Tamil Nadu">

        <link rel="canonical" href="https://rrclawassociates.com/due-diligence.html">"""

new_head = """        <title>Property Law &amp; Due Diligence Lawyers in Tamil Nadu | 30-Year Title Search | RRC Law Associates</title>

        <meta name="description" content="Specialised property documentation, registration, and title due diligence lawyers in Tamil Nadu. 30-year link audits, SRO registration, deed drafting, and revenue record mutations.">

        <meta name="keywords" content="property due diligence lawyer Tamil Nadu, 30-year title verification Thanjavur, sale deed drafting advocate, SRO registration lawyer Tamil Nadu, patta transfer advocate, property lawyer Thanjavur">

        <link rel="canonical" href="https://rrclawassociates.com/property-law">"""

if old_head in html:
    html = html.replace(old_head, new_head)
    print("Property law head updated successfully.")
else:
    print("ERROR: old_head not found in property-law!")

# 2. Add contextual links to nri-power-of-attorney.html and nri-property-disputes.html
# Let's inspect where deed drafting and due diligence mentions are in property-law.html
old_deed_text = "Watertight Deed Drafting &amp; Land Conveyancing"
if old_deed_text in html:
    print("Found deed drafting section in property-law.html")

with open('property-law.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("property-law.html written successfully!")

