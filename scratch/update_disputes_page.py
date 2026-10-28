import re

with open('nri-property-disputes.html', encoding='utf-8') as f:
    html = f.read()

# 1. Update Head section (Title, Meta Description, Keywords, Canonical, JSON-LD Schema)
old_head_meta = """    <title>NRI Property Dispute Lawyer Thanjavur, Tamil Nadu | Encroachment &amp; Title Suits | RRC Law Associates</title>
    <meta name="description" content="Expert NRI property dispute advocates in Thanjavur, Tamil Nadu. Specializing in land encroachment recovery, ancestral partition suits, canceling fraudulent deeds, and Patta transfers in Thanjavur, Tamilnadu.">

    <meta name="keywords" content="NRI property dispute lawyer Thanjavur, land grab legal remedy Tamil Nadu, property lawyers in Thanjavur, ancestral property partition lawyer, advocates Thanjavur, cancel sale deed India">"""

new_head_meta = """    <title>NRI Property Dispute Lawyers in Tamil Nadu | Encroachment, Title &amp; Adverse Possession Defence | RRC Law Associates</title>
    <meta name="description" content="Experienced NRI property dispute lawyers in Tamil Nadu. Legal counsel for land encroachment recovery, adverse possession defence, title suits, ancestral property partition, and fraudulent deed cancellations.">

    <meta name="keywords" content="NRI property dispute lawyer Tamil Nadu, adverse possession defense NRI property, NRI land encroachment lawyer Thanjavur, ancestral property partition suit Tamil Nadu, title declaration suit NRI, cancel fraudulent sale deed Tamil Nadu">

    <link rel="canonical" href="https://rrclawassociates.com/nri-property-disputes">

    <!-- Structured Data: LegalService, BreadcrumbList, and FAQPage -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LegalService",
          "@id": "https://rrclawassociates.com/nri-property-disputes#service",
          "name": "NRI Property Dispute & Title Litigation Legal Services",
          "url": "https://rrclawassociates.com/nri-property-disputes",
          "provider": {
            "@type": "LawFirm",
            "name": "RRC Law Associates",
            "url": "https://rrclawassociates.com/",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Thanjavur",
              "addressRegion": "Tamil Nadu",
              "addressCountry": "IN"
            }
          },
          "areaServed": {
            "@type": "State",
            "name": "Tamil Nadu"
          },
          "description": "Specialized litigation advocacy for Non-Resident Indians protecting real estate in Tamil Nadu against land encroachment, adverse possession claims, illegal occupation, fraudulent transfers, and ancestral property partition disputes."
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://rrclawassociates.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "NRI Services",
              "item": "https://rrclawassociates.com/nri-services"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Property Disputes",
              "item": "https://rrclawassociates.com/nri-property-disputes"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How can an NRI owner protect vacant ancestral land against adverse possession claims in Tamil Nadu?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Under Article 65 of the Limitation Act, 1963, a claimant asserting adverse possession must prove continuous, uninterrupted, and hostile possession against the true owner for at least 12 years with clear animus possidendi. An NRI property owner can defeat such claims by maintaining an unbroken title chain, paying annual land kist/property taxes, securing physical boundaries with fencing and signboards, asserting permissive occupancy through registered caretaker/license agreements, and issuing immediate legal notices followed by an ejectment suit upon discovering any unauthorized entry."
              }
            },
            {
              "@type": "Question",
              "name": "What immediate legal remedies are available if a caretaker or tenant refuses to vacate an NRI property?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "When a caretaker or tenant unlawfully retains possession, the NRI owner can issue a formal statutory demand notice to quit. If the occupant fails to surrender vacant possession, legal remedies include filing a suit for recovery of possession and ejectment under the Code of Civil Procedure along with an application for ad-interim temporary injunction under Order 39 Rules 1 and 2 to restrain third-party transfers, as well as claiming mesne profits under Section 2(12) CPC for wrongful occupation."
              }
            },
            {
              "@type": "Question",
              "name": "Can an NRI file a property title suit or partition suit in Tamil Nadu without traveling to India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. An NRI plaintiff can institute and pursue civil suits in Tamil Nadu through a properly authenticated and adjudicated Special Power of Attorney (SPA). The SPA must be executed before an Indian Consular officer abroad or Apostilled, adjudicated before the District Registrar in Tamil Nadu, and presented by the authorized representative to sign plaints and affidavits under Order 6 Rule 14 and Order 3 Rule 2 of the CPC. Video conferencing rules approved by the Madras High Court also permit remote witness examination where permitted by the trial court."
              }
            },
            {
              "@type": "Question",
              "name": "How do civil courts in Tamil Nadu distinguish between a registered Sale Deed and a Patta document?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A registered Sale Deed or Title Deed is a substantive document of ownership under the Transfer of Property Act, 1882 and the Registration Act, 1908. In contrast, a Patta or revenue record is primarily a fiscal record maintained by the Tamil Nadu Revenue Department for tax assessment purposes. Settled law establishes that a Patta neither creates nor extinguishes title. Where title is disputed, civil courts examine the 30-year registered parent deed chain rather than revenue entries alone."
              }
            },
            {
              "@type": "Question",
              "name": "What legal steps should be taken if a forged sale deed or fraudulent Power of Attorney has been registered over NRI land?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Upon discovering a fraudulent deed or fabricated POA, the NRI owner should file a civil suit for Declaration of Title and Cancellation of the Void Deed under Section 31 and Section 34 of the Specific Relief Act, 1963. Simultaneously, an application for temporary injunction should be moved to restrain further encumbrance, and a petition may be submitted before the District Registrar under Section 77A of the Registration Act (as applicable) or before the Economic Offences Wing / jurisdictional police for criminal forgery."
              }
            }
          ]
        }
      ]
    }
    </script>"""

if old_head_meta in html:
    html = html.replace(old_head_meta, new_head_meta)
    print("Disputes head meta updated successfully.")
else:
    print("ERROR: old_head_meta not found in disputes!")

# 2. Update Hero & Intro
old_hero = """    <section class="article-hero text-center">
        <div class="container px-4">
            <span class="meta-text">Cross-Border Title Protection Desk</span>
            <h1 class="article-title mt-3 mb-2">NRI Property Disputes &amp; Land Encroachment Recovery</h1>
            <h2 class="article-subtitle mt-1 mb-4">Aggressive Trial Court Advocacy and Title Protection for the Global Indian Diaspora</h2>
            <p class="lead text-muted mx-auto" style="max-width: 850px;">
                Vacant land plots, inherited agricultural tracts, and ancestral homes in Tamil Nadu are chronically vulnerable to illegal encroachment, fraudulent land grabs, and forged title transfers when the rightful owner resides thousands of miles away. RRC Law Associates delivers uncompromising trial advocacy, securing swift high-court injunctions, invalidating fraudulent deeds, and restoring rightful possession.
            </p>
        </div>
    </section>"""

new_hero = """    <section class="article-hero text-center">
        <div class="container px-4">
            <span class="meta-text">Cross-Border Title Protection &amp; Trial Advocacy Desk</span>
            <h1 class="article-title mt-3 mb-2">NRI Property Disputes &amp; Title Litigation in Tamil Nadu</h1>
            <h2 class="article-subtitle mt-1 mb-4">Legal Protection Against Land Encroachment, Adverse Possession Claims, Illegal Occupation &amp; Ancestral Partition Disputes</h2>
            <p class="lead text-muted mx-auto" style="max-width: 880px;">
                Vacant residential plots, agricultural holdings, and ancestral family estates in Tamil Nadu are frequently exposed to illegal encroachment, adverse possession claims, unauthorized caretaker possession, and fraudulent power of attorney transfers while owners reside abroad. RRC Law Associates delivers strategic trial court advocacy: securing emergency ad-interim injunctions under Order 39 CPC, defending title against hostile possession claims, instituting declaration and partition suits, and recovering vacant physical possession across Thanjavur and all Tamil Nadu districts.
            </p>
        </div>
    </section>"""

if old_hero in html:
    html = html.replace(old_hero, new_hero)
    print("Disputes hero updated successfully.")
else:
    print("ERROR: old_hero not found in disputes!")

# 3. Update the 4 Feature Cards
old_cards = """            <div class="d-flex flex-wrap justify-content-center gap-4">
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-gavel"></i></div>
                    <h4 class="card-service-title">Reclaiming Encroached Land &amp; Eviction Actions</h4>
                    <p class="card-service-text">Securing local stay orders, temporary restraining mandates, and handling aggressive summary execution lawsuits to recover physical land plots.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-sitemap"></i></div>
                    <h4 class="card-service-title">Ancestral Property Partition &amp; Legal Heir Claims</h4>
                    <p class="card-service-text">Managing inherited allocations, executing partition actions among descendants, and setting legal lineage barriers safely.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-file-invoice"></i></div>
                    <h4 class="card-service-title">Challenging Fraudulent Deeds &amp; SRO Compliance</h4>
                    <p class="card-service-text">Filing for absolute title nullification declarations and contesting fraudulent transactions or power of attorney abuse records directly.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-map-marked-alt"></i></div>
                    <h4 class="card-service-title">Revenue Record Rectification (Patta, Chitta &amp; Adangal Shifts)</h4>
                    <p class="card-service-text">Correcting unauthorized registry shifts, checking local boundary metrics, and processing revenue mutations flawlessly.</p>
                </div>
            </div>"""

new_cards = """            <div class="d-flex flex-wrap justify-content-center gap-4">
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-shield-halved"></i></div>
                    <h4 class="card-service-title">Adverse Possession Defence &amp; Title Recovery</h4>
                    <p class="card-service-text">Defending absentee owners against hostile possession claims under Article 65 of the Limitation Act and reclaiming encroached parcels.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-sitemap"></i></div>
                    <h4 class="card-service-title">Ancestral Property Partition &amp; Coparcenary Suits</h4>
                    <p class="card-service-text">Instituting civil partition suits under the Hindu Succession Act, securing metes-and-bounds division, and halting unauthorized sales.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-file-contract"></i></div>
                    <h4 class="card-service-title">Challenging Fraudulent Deeds &amp; POA Abuse</h4>
                    <p class="card-service-text">Filing title declaration suits under Section 34 Specific Relief Act to nullify forged deeds, sham sales, and revoked POA transfers.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-magnifying-glass-location"></i></div>
                    <h4 class="card-service-title">30-Year Title Chain Audit &amp; Revenue Rectification</h4>
                    <p class="card-service-text">Auditing historical parent deeds, correcting fraudulent Patta/Chitta revenue shifts, and rectifying survey boundary records.</p>
                </div>
            </div>"""

if old_cards in html:
    html = html.replace(old_cards, new_cards)
    print("Disputes cards updated successfully.")
else:
    print("ERROR: old_cards not found in disputes!")

# 4. Update the Content Row Cards
col8_start = html.find('<div class="col-lg-8 content-body text-start">')
col8_end = html.find('</div>\n\n            <div class="col-lg-4 text-start">')
if col8_start != -1 and col8_end != -1:
    new_col8 = """<div class="col-lg-8 content-body text-start">

                <!-- Row 1: Encroachment & Illegal Occupation Recovery -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/encroachment.webp" type="image/webp">
                                    <img src="assets/images/encroachment.png" class="w-100 h-100 object-fit-cover" alt="Illegal land encroachment recovery and civil ejectment actions in Tamil Nadu">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h3 class="pub-headline">Illegal Occupation, Land Encroachment &amp; Possession Recovery</h3>
                            <p class="pub-description">
                                Vacant residential layouts, agricultural holdings, and inherited family homes left unattended by overseas owners frequently fall prey to unauthorized entry, boundary shifting, or land grabbing by neighbors or local cartels. At RRC Law Associates, we take swift courtroom action: obtaining certified field survey inspections through revenue authorities, filing for emergency temporary injunctions (Stay Orders) under Order 39 of the CPC to restrain unauthorized construction or alteration, and instituting regular civil ejectment suits to restore physical vacant possession. Where dispossession has occurred within the preceding six months, we evaluate summary recovery suits under Section 6 of the Specific Relief Act, 1963.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Adverse Possession Claims & Defense -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4 order-md-1">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/dispute-resolution-defense.webp" type="image/webp">
                                    <img src="assets/images/dispute-resolution-defense.jpg" class="w-100 h-100 object-fit-cover" alt="Legal defence against adverse possession claims on NRI land in Tamil Nadu">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8 order-md-2">
                            <h3 class="pub-headline">Defending Against Hostile Adverse Possession Claims</h3>
                            <p class="pub-description">
                                Under Article 65 of the Limitation Act, 1963, a party occupying private immovable property may attempt to claim absolute ownership if they can establish continuous, open, peaceful, and hostile possession for more than 12 years against the true owner. For non-resident Indians, long periods of overseas absence make property vulnerable to caretakers, relatives, or trespassers asserting hostile title. Our litigation advocates dismantle adverse possession claims by proving that occupation began permissively (as a license or tenancy), proving ongoing assertions of ownership through tax payments, kist receipts, and water cess, and instituting recovery plaints to legally disrupt the statutory limitation period before rights are extinguished under Section 27 of the Limitation Act.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 3: Ancestral Property Partition & Legal Heir Claims -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/partition.webp" type="image/webp">
                                    <img src="assets/images/partition.png" class="w-100 h-100 object-fit-cover" alt="Ancestral property partition suits and legal heir rights in Tamil Nadu">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h3 class="pub-headline">Ancestral Property Partition Suits &amp; Coparcenary Rights</h3>
                            <p class="pub-description">
                                Inherited multi-generational family estates often become contentious when resident co-heirs attempt to exclude overseas family members or secretly alienate high-value parcels. Under the Hindu Succession Act, 1956 (as amended), daughters and sons enjoy equal coparcenary rights by birth in ancestral property. We institute comprehensive civil partition suits before District and Subordinate Courts across Tamil Nadu, obtaining interim injunctions to freeze unilateral alienation, securing preliminary decrees determining exact percentage shares, and appointing court commissioners for fair division by metes and bounds. For seamless family transfers, we also draft and register <a href="nri-power-of-attorney.html" class="text-gold fw-semibold text-decoration-none">Special Powers of Attorney for release deeds</a>.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 4: Contesting Fraudulent Deeds & POA Abuse -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4 order-md-1">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/deed-audit.webp" type="image/webp">
                                    <img src="assets/images/deed-audit.png" class="w-100 h-100 object-fit-cover" alt="Contesting fraudulent sale deeds and Power of Attorney abuse in Tamil Nadu">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8 order-md-2">
                            <h3 class="pub-headline">Contesting Fraudulent Deeds &amp; Power of Attorney Abuse</h3>
                            <p class="pub-description">
                                A prevalent danger for absentee property owners is the fraudulent creation of forged sale deeds, settlement deeds, or unauthorized transfers executed through fabricated or revoked Powers of Attorney. Under Indian property jurisprudence and Section 31 &amp; 34 of the Specific Relief Act, a forged deed is null and void <em>ab initio</em> and conveys no legal title. Our trial attorneys institute declaratory suits to formally cancel fraudulent instruments, secure encumbrance entries at the jurisdictional Sub-Registrar Office (SRO), and coordinate criminal complaints before the Economic Offences Wing (EOW) or District Police for identity fraud, criminal breach of trust, and forgery.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 5: 30-Year Ownership Chain Review & Revenue Record Shifts -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/revenue.webp" type="image/webp">
                                    <img src="assets/images/revenue.png" class="w-100 h-100 object-fit-cover" alt="30-year link document review Patta Chitta and revenue record rectification Tamil Nadu">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h3 class="pub-headline">30-Year Title Chain Review &amp; Revenue Record Rectification</h3>
                            <p class="pub-description">
                                Resolving property title disputes requires establishing an unbroken registered ownership chain. In synergy with our <a href="property-law.html" class="text-gold fw-semibold text-decoration-none">property documentation and due diligence desk</a>, we conduct rigorous 30-to-40-year parent document audits, comparing registered instruments against revenue entries including Patta, Chitta, Adangal, Field Measurement Book (FMB) sketches, and Town Survey Land Register (TSLR) extracts. When local encroachers attempt to secure unauthorized Patta transfers through sub-taluk offices, we challenge irregular revenue mutations before the Revenue Divisional Officer (RDO) and District Revenue Officer (DRO), ensuring public administrative records reflect legitimate registered title.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 6: Legal Remedies, Injunctions & Dispute Resolution -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4 order-md-1">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/interim-reliefs.png" type="image/png">
                                    <img src="assets/images/interim-reliefs.png" class="w-100 h-100 object-fit-cover" alt="Civil court injunctions mesne profits and property dispute remedies in Tamil Nadu">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8 order-md-2">
                            <h3 class="pub-headline">Civil Remedies, Mesne Profits &amp; Structured Settlement Options</h3>
                            <p class="pub-description">
                                Every property dispute carries distinct facts and evidentiary nuances. We evaluate the full spectrum of legal remedies: ad-interim temporary injunctions to preserve status quo, permanent prohibitory injunctions, mandatory injunctions for removal of unauthorized structures, and claims for <strong>mesne profits under Section 2(12) CPC</strong> to recover financial damages for wrongful possession. Where appropriate and aligned with our client's commercial objectives, our senior counsel also facilitates structured court-assisted mediation and settlement conferences to resolve protracted family property disputes expeditiously without unnecessary litigation costs.
                            </p>
                        </div>
                    </div>
                </div>"""
    html = html[:col8_start] + new_col8 + html[col8_end:]
    print("Disputes col-8 rows updated successfully.")
else:
    print("ERROR: could not find disputes col8 bounds!")

# 5. Replace the Mismatched FAQ Section
faq_start = html.find('<section class="py-5" style="background-color: #ffffff;">\n    <div class="container" style="max-width: 850px;">')
faq_end = html.find('</div>\n    </div>\n</section>\n\n    <footer class="footer">')
if faq_start != -1 and faq_end != -1:
    new_faqs_section = """<section class="py-5" style="background-color: #ffffff;">
    <div class="container" style="max-width: 850px;">

        <div class="text-center mb-5">
            <span class="faq-eyebrow">Support &amp; Guidance</span>
            <h2 class="faq-title mt-2">Frequently Asked Questions</h2>
            <div class="faq-title-line"></div>
        </div>

        <div class="accordion custom-faq-accordion" id="nriPropertyDisputesFaq">

            <div class="accordion-item">
                <h2 class="accordion-header" id="dispFaqHeadingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#dispFaqCollapseOne" aria-expanded="false" aria-controls="dispFaqCollapseOne">
                        1. How can an NRI owner protect vacant ancestral land against adverse possession claims in Tamil Nadu?
                    </button>
                </h2>
                <div id="dispFaqCollapseOne" class="accordion-collapse collapse" aria-labelledby="dispFaqHeadingOne" data-bs-parent="#nriPropertyDisputesFaq">
                    <div class="accordion-body">
                        Under Article 65 of the Limitation Act, 1963, a claimant asserting adverse possession must prove continuous, uninterrupted, and openly hostile possession against the true owner for at least 12 years with clear <em>animus possidendi</em>. An NRI owner can protect their title by maintaining complete 30-year parent deeds, paying annual land kist/property taxes, erecting boundary fencing with ownership signage, establishing permissive caretaker agreements in writing, and issuing immediate legal notices followed by an ejectment plaint upon noticing any unauthorized encroachment.
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="dispFaqHeadingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#dispFaqCollapseTwo" aria-expanded="false" aria-controls="dispFaqCollapseTwo">
                        2. What immediate legal steps should an NRI take if a caretaker or tenant refuses to vacate?
                    </button>
                </h2>
                <div id="dispFaqCollapseTwo" class="accordion-collapse collapse" aria-labelledby="dispFaqHeadingTwo" data-bs-parent="#nriPropertyDisputesFaq">
                    <div class="accordion-body">
                        When an authorized caretaker or tenant refuses to surrender vacant possession, the NRI owner should immediately issue a formal statutory notice to vacate. If the occupant persists in wrongful occupation, the owner can institute a civil suit for recovery of possession and ejectment, simultaneously moving an application for temporary injunction under Order 39 Rules 1 and 2 of the CPC to prevent any third-party creation of rights or unauthorized structural alteration, while claiming mesne profits under Section 2(12) CPC.
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="dispFaqHeadingThree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#dispFaqCollapseThree" aria-expanded="false" aria-controls="dispFaqCollapseThree">
                        3. Can an NRI file a property title suit or ancestral partition suit in Tamil Nadu without traveling to India?
                    </button>
                </h2>
                <div id="dispFaqCollapseThree" class="accordion-collapse collapse" aria-labelledby="dispFaqHeadingThree" data-bs-parent="#nriPropertyDisputesFaq">
                    <div class="accordion-body">
                        Yes. An NRI plaintiff can institute and manage civil court litigation in Tamil Nadu by delegating authority through an authenticated and adjudicated <a href="nri-power-of-attorney.html" class="text-gold fw-semibold text-decoration-none">Special Power of Attorney (SPA)</a>. The SPA must be executed before an Indian Consular officer abroad or Apostilled, adjudicated by the District Registrar in Tamil Nadu, and presented by your attorney holder to sign pleadings and affidavits under Order 3 and Order 6 of the CPC. Video conferencing rules of the Madras High Court also allow virtual witness testimony where permitted.
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="dispFaqHeadingFour">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#dispFaqCollapseFour" aria-expanded="false" aria-controls="dispFaqCollapseFour">
                        4. How do civil courts distinguish between a registered Sale Deed and a Patta document?
                    </button>
                </h2>
                <div id="dispFaqCollapseFour" class="accordion-collapse collapse" aria-labelledby="dispFaqHeadingFour" data-bs-parent="#nriPropertyDisputesFaq">
                    <div class="accordion-body">
                        A registered Sale Deed or Title Deed is a substantive document of ownership under the Transfer of Property Act, 1882 and the Registration Act, 1908. In contrast, a Patta is an administrative fiscal entry maintained by the Tamil Nadu Revenue Department for collecting land revenue. Settled jurisprudence affirms that a Patta does not confer or extinguish substantive ownership title. When title is contested, the civil court examines registered parent documents spanning an unbroken chain rather than revenue entries alone.
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="dispFaqHeadingFive">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#dispFaqCollapseFive" aria-expanded="false" aria-controls="dispFaqCollapseFive">
                        5. What legal remedies are available if a fraudulent sale deed has been registered over NRI land?
                    </button>
                </h2>
                <div id="dispFaqCollapseFive" class="accordion-collapse collapse" aria-labelledby="dispFaqHeadingFive" data-bs-parent="#nriPropertyDisputesFaq">
                    <div class="accordion-body">
                        Upon discovering a fraudulent deed or forged Power of Attorney, the true owner must promptly institute a civil suit for Declaration of Title and Cancellation of the Void Deed under Section 31 and 34 of the Specific Relief Act, 1963. The plaintiff should also file an application for an ad-interim injunction to prevent further alienations, notify the jurisdictional Sub-Registrar Office, and initiate criminal proceedings before the Economic Offences Wing (EOW) or District Crime Branch for forgery and fraud.
                    </div>
                </div>
            </div>

        </div>"""
    html = html[:faq_start] + new_faqs_section + html[faq_end:]
    print("Disputes FAQ section replaced successfully.")
else:
    print("ERROR: could not find disputes FAQ bounds!")

with open('nri-property-disputes.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("nri-property-disputes.html written successfully!")

