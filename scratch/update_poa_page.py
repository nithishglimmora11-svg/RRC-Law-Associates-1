import re

with open('nri-power-of-attorney.html', encoding='utf-8') as f:
    html = f.read()

# 1. Update Head section (Title, Meta Description, Keywords, Canonical, JSON-LD Schema)
old_head_meta = """    <title>Adjudication of Power of Attorney for NRI | Thanjavur, Tamil Nadu Law Firm for NRI's</title>

    <meta name="description" content="Expert legal support for NRI Power of Attorney (POA). Custom drafting, embassy attestation guidance, and mandatory District Registrar adjudication in Thanjavur, Tamil Nadu at RRC Law Associates.">

    <meta name="keywords" content="adjudication of power of attorney for nri thanjavur, register nri gpa tamil nadu, property lawyer thanjavur, embassy attested poa validation, advocates thanjavur, cancel power of attorney Thanjavur, Tamil nadu">"""

new_head_meta = """    <title>NRI Power of Attorney for Property in Tamil Nadu | Sale Deed, Gift Deed, SRO Registration | RRC Law Associates</title>

    <meta name="description" content="Expert legal support for NRI Power of Attorney in Tamil Nadu. Specialised drafting, Indian Embassy attestation, District Registrar adjudication, and SRO registration coordination for property sale deeds, gift deeds, and release deeds.">

    <meta name="keywords" content="NRI power of attorney for property in Tamil Nadu, NRI property sale deed POA, NRI gift deed Tamil Nadu, relinquishment deed NRI, adjudication of foreign POA Thanjavur, Sub-Registrar Office POA registration, cancel power of attorney Tamil Nadu">

    <link rel="canonical" href="https://rrclawassociates.com/nri-power-of-attorney">

    <!-- Structured Data: LegalService, BreadcrumbList, and FAQPage -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LegalService",
          "@id": "https://rrclawassociates.com/nri-power-of-attorney#service",
          "name": "NRI Power of Attorney & Property Conveyancing Legal Services",
          "url": "https://rrclawassociates.com/nri-power-of-attorney",
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
          "description": "Comprehensive legal assistance for Non-Resident Indians executing Power of Attorney for property sales, gift deeds, release deeds, consular attestation, District Registrar adjudication, and Sub-Registrar Office registration in Tamil Nadu."
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
              "name": "Power of Attorney",
              "item": "https://rrclawassociates.com/nri-power-of-attorney"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is the mandatory timeline for adjudicating a foreign Power of Attorney in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Under Section 18 of the Indian Stamp Act, 1899, any Power of Attorney executed outside Indian territory must be presented for mandatory adjudication before the competent District Registrar within three months from the exact date the physical document is received in India. Adequate stamp duty must be validated to render the instrument legally enforceable for Sub-Registrar Office registrations or court filings."
              }
            },
            {
              "@type": "Question",
              "name": "Should an NRI execute a General (GPA) or a Special Power of Attorney (SPA) for property sales?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To prevent unauthorized asset alienation and financial fraud, an NRI should execute a Special Power of Attorney (SPA) restricted strictly to a specific immovable property. The SPA should define the exact survey number, village, sub-registration district, and explicit covenants directing sale proceeds solely into the NRI's designated NRE or NRO bank account, rather than granting blanket powers."
              }
            },
            {
              "@type": "Question",
              "name": "Can an NRI execute property sale deeds, gift deeds, or release deeds in Tamil Nadu without traveling to India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, an NRI can delegate execution authority through a duly executed and adjudicated Special Power of Attorney. However, Indian property law requires rigorous formal compliance: the deed must be signed abroad before an Indian Consular officer or Apostilled, adjudicated by the District Registrar in Tamil Nadu, and presented by the attorney holder with mandatory biometric verification before the jurisdictional Sub-Registrar Office (SRO)."
              }
            },
            {
              "@type": "Question",
              "name": "What is the difference between Embassy Attestation and Apostille for a foreign deed?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "If the NRI resides in a Hague Apostille Convention signatory country (such as the United States or the United Kingdom), the document can be certified with a Hague Apostille certificate from the designated state authority. For non-signatory nations (such as the UAE), the document must be physically signed before and attested by the Consular Officer at the Indian Embassy or Consulate."
              }
            },
            {
              "@type": "Question",
              "name": "Can a registered Power of Attorney be canceled orally or via email?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. Under Indian property jurisprudence and registration laws, an oral statement or email cannot invalidate a registered or authenticated Power of Attorney. Revocation requires executing a formal Deed of Cancellation, registering it before the jurisdictional Sub-Registrar, issuing written notice to the agent, and publishing public notices in regional newspapers."
              }
            }
          ]
        }
      ]
    }
    </script>"""

if old_head_meta in html:
    html = html.replace(old_head_meta, new_head_meta)
    print("Head meta updated successfully.")
else:
    print("ERROR: old_head_meta not found!")

# 2. Update Hero & Intro
old_hero = """    <section class="article-hero text-center">
        <div class="container px-4">
            <span class="meta-text">Cross-Border Authentication Desk</span>
            <h1 class="article-title mt-3 mb-2">NRI Power of Attorney Drafting, Attestation &amp; Adjudication</h1>
            <h2 class="article-subtitle mt-1 mb-4">Secure, Zero-Travel Legal Delegation for Real Estate and Court Matters in Tamil Nadu</h2>
            <p class="lead text-muted mx-auto" style="max-width: 850px;">
                Executing property transactions, managing bank portfolios, or handling trial court litigations from abroad demands a structurally sound, legally validated delegation of authority. RRC Law Associates provides end-to-end legal support for the drafting, embassy attestation, and mandatory localized adjudication of Power of Attorney (POA) instruments for Non-Resident Indians (NRIs) globally—guaranteeing absolute safety against fraud.
            </p>
        </div>
    </section>"""

new_hero = """    <section class="article-hero text-center">
        <div class="container px-4">
            <span class="meta-text">Cross-Border Property &amp; Authentication Desk</span>
            <h1 class="article-title mt-3 mb-2">NRI Power of Attorney for Property in Tamil Nadu</h1>
            <h2 class="article-subtitle mt-1 mb-4">Secure, Legally Validated Delegation for Sale Deeds, Gift Deeds, Release Deeds &amp; SRO Registration</h2>
            <p class="lead text-muted mx-auto" style="max-width: 880px;">
                Executing property sales, gifting ancestral assets, partitioning family shares, or managing Sub-Registrar Office registrations from abroad requires rigorous statutory compliance. RRC Law Associates provides comprehensive legal guidance for drafting transaction-specific Powers of Attorney, coordinating Indian Embassy attestation and Hague Apostilles, managing mandatory District Registrar adjudication within 3 months, and guiding attorney holders through physical SRO registration across Thanjavur and all districts of Tamil Nadu.
            </p>
        </div>
    </section>"""

if old_hero in html:
    html = html.replace(old_hero, new_hero)
    print("Hero updated successfully.")
else:
    print("ERROR: old_hero not found!")

# 3. Update the 4 Feature Cards
old_cards = """            <div class="d-flex flex-wrap justify-content-center gap-4">
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-file-signature"></i></div>
                    <h4 class="card-service-title">Custom Drafting of Watertight General &amp; Special POAs</h4>
                    <p class="card-service-text">Structuring highly secure instruments that precisely bound representative transactions, preventing asset overreach.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-passport"></i></div>
                    <h4 class="card-service-title">Embassy Coordination &amp; Overseas Attestation Guidance</h4>
                    <p class="card-service-text">Guiding clients smoothly through localized consular markings, embassy registrations, and international validations.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-gavel"></i></div>
                    <h4 class="card-service-title">Mandatory Adjudication Before District Registrar Offices</h4>
                    <p class="card-service-text">Completing required domestic revenue tracking transformations and stamp alignments directly inside Tamil Nadu registries.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-shield-alt"></i></div>
                    <h4 class="card-service-title">Legal Audits, Enforcement Verification &amp; Formal POA Revocations</h4>
                    <p class="card-service-text">Terminating operational authority lines safely via absolute registered cancellation deeds and news announcements.</p>
                </div>
            </div>"""

new_cards = """            <div class="d-flex flex-wrap justify-content-center gap-4">
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-file-signature"></i></div>
                    <h4 class="card-service-title">Watertight Property Sale, Gift &amp; Release POAs</h4>
                    <p class="card-service-text">Custom drafting Special Powers of Attorney with strict restrictive covenants limiting authority strictly to identified survey parcels.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-passport"></i></div>
                    <h4 class="card-service-title">Embassy Attestation &amp; Hague Apostille Routing</h4>
                    <p class="card-service-text">Clear procedural workflows for consular attestation across USA, UK, UAE, Singapore, Malaysia, and Apostille signatory nations.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-stamp"></i></div>
                    <h4 class="card-service-title">District Registrar Adjudication (Sec 18 Stamp Act)</h4>
                    <p class="card-service-text">Managing mandatory domestic stamp duty validation within the statutory 3-month window before Tamil Nadu District Registrars.</p>
                </div>
                <div class="practice-service-card d-flex flex-column align-items-center">
                    <div class="card-icon-wrapper"><i class="fas fa-building-columns"></i></div>
                    <h4 class="card-service-title">SRO Registration Guidance &amp; Revocation Deeds</h4>
                    <p class="card-service-text">Assisting attorneys with biometric compliance at Sub-Registrar Offices and drafting formal registered deeds of cancellation.</p>
                </div>
            </div>"""

if old_cards in html:
    html = html.replace(old_cards, new_cards)
    print("Cards updated successfully.")
else:
    print("ERROR: old_cards not found!")

# 4. Update the Content Row Cards
# Find the content section in col-lg-8
col8_start = html.find('<div class="col-lg-8 content-body text-start">')
col8_end = html.find('</div>\n\n            <div class="col-lg-4 text-start">')
if col8_start != -1 and col8_end != -1:
    old_col8 = html[col8_start:col8_end]
    new_col8 = """<div class="col-lg-8 content-body text-start">

                <!-- Row 1: SPA vs GPA for Real Estate -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/poa-drafting.webp" type="image/webp">
                                    <img src="assets/images/poa-drafting.png" class="w-100 h-100 object-fit-cover" alt="Drafting watertight Special Power of Attorney for NRI property transactions in Tamil Nadu">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h3 class="pub-headline">Drafting Specific Power of Attorney (SPA) vs. Blanket GPA</h3>
                            <p class="pub-description">
                                Executing a generic General Power of Attorney (GPA) poses severe legal exposure for non-resident property owners. At RRC Law Associates, we structure custom <strong>Special Power of Attorney (SPA)</strong> instruments tailored exclusively to a single designated transaction. Our conveyancing lawyers insert explicit restrictive boundaries: precise property schedules (survey numbers, sub-division metrics, village and registration district), non-delegable authority clauses, and strict instructions governing consideration payments. This prevents representative overreach and protects your land assets across Thanjavur, Kumbakonam, Trichy, and neighboring districts.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 2: NRI Property Sale Deeds via POA -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4 order-md-1">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/deed-drafting.webp" type="image/webp">
                                    <img src="assets/images/deed-drafting.png" class="w-100 h-100 object-fit-cover" alt="NRI property sale deed execution and legal coordination in Tamil Nadu">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8 order-md-2">
                            <h3 class="pub-headline">NRI Property Sale Deeds &amp; Consideration Protection</h3>
                            <p class="pub-description">
                                When selling agricultural land, commercial plots, or residential properties while residing overseas, the Power of Attorney instrument must explicitly authorize deed execution before the competent Sub-Registrar Office (SRO). Crucially, the SPA should stipulate that all buyer consideration (advance and final purchase price) must be paid exclusively via direct banking channels into the NRI principal's designated <strong>NRE or NRO bank account</strong>, completely barring the attorney holder from receiving cash consideration or personal cheques. We also guide clients on mandatory tax deduction compliance under Section 195 of the Income Tax Act (TDS) and obtaining Nil/Lower Tax Deduction Certificates.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 3: Gift Deeds & Relinquishment / Release Deeds -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/property-possession-handover.webp" type="image/webp">
                                    <img src="assets/images/property-possession-handover.jpg" class="w-100 h-100 object-fit-cover" alt="Execution of Gift Deeds and Release Deeds for NRI family property transfers">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h3 class="pub-headline">Gift Deeds, Relinquishment &amp; Family Release Deeds</h3>
                            <p class="pub-description">
                                Transferring shares in ancestral or jointly owned family estates often requires executing a <strong>Settlement / Gift Deed</strong> or a <strong>Relinquishment (Release) Deed</strong>. If you reside abroad and wish to release your undivided hereditary rights in favor of parents, siblings, or co-heirs, an authenticated Special Power of Attorney allows your designated representative to appear before the SRO to execute the release. We review family lineage documents, ensure accurate description of undivided shares, and structure deeds to claim statutory concessions under Tamil Nadu stamp duty rules for transactions between specified family members.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 4: Document Verification & Title Due Diligence -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4 order-md-1">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/title-due-diligence.webp" type="image/webp">
                                    <img src="assets/images/title-due-diligence.png" class="w-100 h-100 object-fit-cover" alt="30-year property title verification and document due diligence before deed execution">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8 order-md-2">
                            <h3 class="pub-headline">Pre-Execution Document Verification &amp; Title Scrutiny</h3>
                            <p class="pub-description">
                                Delegating authority to buy, sell, or partition property carries substantial financial risk if the underlying title is compromised. Before issuing or acting on a Power of Attorney, our legal team conducts rigorous <a href="property-law.html" class="text-gold fw-semibold text-decoration-none">property document verification</a>: examining parent sale deeds spanning a minimum 30-year chain, obtaining continuous digital Encumbrance Certificates (EC), verifying Patta/Chitta revenue records, and checking for pending civil suits or <a href="nri-property-disputes.html" class="text-gold fw-semibold text-decoration-none">encroachment disputes</a>. This pre-transaction scrutiny ensures clear marketable title before any deed is registered.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 5: Embassy Attestation & Mandatory Adjudication -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/poa-attestation.webp" type="image/webp">
                                    <img src="assets/images/poa-attestation.png" class="w-100 h-100 object-fit-cover" alt="Indian Embassy attestation and mandatory adjudication under Section 18 Indian Stamp Act">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h3 class="pub-headline">Consular Attestation, Hague Apostille &amp; 3-Month Adjudication</h3>
                            <p class="pub-description">
                                For a Power of Attorney executed outside India to hold legal validity before Indian registration authorities or courts, strict statutory authentication is mandatory. For signatories in Hague Apostille Convention nations (e.g., USA, UK), the deed must be Apostilled by the competent foreign department. For non-signatory countries (e.g., UAE, Qatar), the principal must sign before an authorized Consular Officer at the Indian Embassy or Consulate. Once delivered to India, the original instrument must be presented for <strong>mandatory adjudication under Section 18 of the Indian Stamp Act, 1899</strong> before the District Registrar within exactly three months of its physical arrival.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 6: SRO Registration Formalities & Legal Limits -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4 order-md-1">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/sro-registration.webp" type="image/webp">
                                    <img src="assets/images/sro-registration.png" class="w-100 h-100 object-fit-cover" alt="Sub-Registrar Office SRO registration formalities and biometric compliance in Tamil Nadu">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8 order-md-2">
                            <h3 class="pub-headline">Sub-Registrar Office (SRO) Registration Guidance &amp; Boundaries</h3>
                            <p class="pub-description">
                                Under Section 32 and 34 of the Registration Act, 1908, the attorney holder must physically present the deed before the jurisdictional Sub-Registrar in Tamil Nadu for biometric authentication, photograph recording, and ID verification. In accordance with Tamil Nadu Registration Rules and Inspector General of Registration (IGR) circulars, the SRO verifies the principal's non-revocation status and may require a fresh Life Certificate or confirmation affidavit. Furthermore, as affirmed by the Supreme Court of India in <em>Suraj Lamp &amp; Industries</em>, a Power of Attorney does not confer ownership title upon the agent—it only delegates procedural authority. Formal registration remains compulsory to transfer title legally.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Row 7: POA Revocation & Cancellation Deeds -->
                <div class="litigation-row-card mb-4">
                    <div class="row align-items-center g-4">
                        <div class="col-md-4">
                            <div class="visual-token-box">
                                <picture>
                                    <source srcset="assets/images/poa-revocation.webp" type="image/webp">
                                    <img src="assets/images/poa-revocation.png" class="w-100 h-100 object-fit-cover" alt="Drafting registered cancellation deeds and public notices for formal Power of Attorney revocation">
                                </picture>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <h3 class="pub-headline">Formal POA Revocation, Cancellation Deeds &amp; Public Notices</h3>
                            <p class="pub-description">
                                If you suspect representative misuse, breach of fiduciary duty, or if the underlying property transaction has concluded, prompt legal revocation is critical. Under Indian property jurisprudence, an informal phone call, WhatsApp text, or email cannot terminate a registered or adjudicated Power of Attorney. Our advocates execute a watertight <strong>Deed of Cancellation</strong>, register it before the same Sub-Registrar Office, issue formal legal notices under registered post to the attorney holder, and publish public notices in leading regional and English daily newspapers to permanently extinguish the representative's authority.
                            </p>
                        </div>
                    </div>
                </div>"""
    html = html[:col8_start] + new_col8 + html[col8_end:]
    print("Content body rows updated successfully.")
else:
    print("ERROR: could not find col-lg-8 bounds!")

# 5. Update FAQ section
faq_start = html.find('<div class="accordion custom-faq-accordion" id="nriPoaFaq">')
faq_end = html.find('</div>\n    </div>\n</section>\n\n    <footer class="footer">')
if faq_start != -1 and faq_end != -1:
    new_faqs = """<div class="accordion custom-faq-accordion" id="nriPoaFaq">

            <div class="accordion-item">
                <h2 class="accordion-header" id="poaFaqHeadingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#poaFaqCollapseOne" aria-expanded="false" aria-controls="poaFaqCollapseOne">
                        1. What is the mandatory timeline for adjudicating a foreign Power of Attorney in India?
                    </button>
                </h2>
                <div id="poaFaqCollapseOne" class="accordion-collapse collapse" aria-labelledby="poaFaqHeadingOne" data-bs-parent="#nriPoaFaq">
                    <div class="accordion-body">
                        Under Section 18 of the Indian Stamp Act, 1899, any Power of Attorney executed outside Indian territory must be presented for <strong>mandatory adjudication before the competent District Registrar within three months</strong> from the exact date the physical document is received in India. Proper stamp duty must be validated and certified on the instrument to make it legally admissible for registrations at the Sub-Registrar Office or filings before civil courts in Tamil Nadu.
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="poaFaqHeadingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#poaFaqCollapseTwo" aria-expanded="false" aria-controls="poaFaqCollapseTwo">
                        2. Should an NRI execute a General (GPA) or a Special Power of Attorney (SPA) for property transactions?
                    </button>
                </h2>
                <div id="poaFaqCollapseTwo" class="accordion-collapse collapse" aria-labelledby="poaFaqHeadingTwo" data-bs-parent="#nriPoaFaq">
                    <div class="accordion-body">
                        To protect your real estate assets from unauthorized alienation or internal fraud, a <strong>Special Power of Attorney (SPA)</strong> is strongly recommended. Unlike a broad GPA that grants unrestricted powers, an SPA contains strict restrictive covenants limiting your agent's authority solely to an identified property parcel (with precise survey numbers and boundaries) and mandates that all sale proceeds be remitted directly to your designated NRE/NRO bank account.
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="poaFaqHeadingThree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#poaFaqCollapseThree" aria-expanded="false" aria-controls="poaFaqCollapseThree">
                        3. Can an NRI sell, gift, or release property in Tamil Nadu without traveling to India?
                    </button>
                </h2>
                <div id="poaFaqCollapseThree" class="accordion-collapse collapse" aria-labelledby="poaFaqHeadingThree" data-bs-parent="#nriPoaFaq">
                    <div class="accordion-body">
                        Yes, an NRI can delegate property execution through a legally executed and adjudicated Special Power of Attorney. However, statutory formalities cannot be bypassed: the POA must be signed abroad before an Indian Consular Officer or Apostilled, adjudicated by the District Registrar in Tamil Nadu, and presented by your attorney holder for mandatory biometric registration before the Sub-Registrar Office (SRO). Our firm coordinates document drafting, verification, adjudication, and SRO appointment scheduling.
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="poaFaqHeadingFour">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#poaFaqCollapseFour" aria-expanded="false" aria-controls="poaFaqCollapseFour">
                        4. What is the difference between Embassy Attestation and Apostille for a foreign deed?
                    </button>
                </h2>
                <div id="poaFaqCollapseFour" class="accordion-collapse collapse" aria-labelledby="poaFaqHeadingFour" data-bs-parent="#nriPoaFaq">
                    <div class="accordion-body">
                        If you reside in a Hague Apostille Convention signatory nation (such as the USA or UK), your document can be certified with a Hague Apostille certificate issued by the designated state authority in that country. For non-signatory nations (such as the UAE, Qatar, or Kuwait), the document must be executed in person before and attested by a Consular Officer at the local <strong>Indian Embassy or Consulate</strong>. Both methods ensure legal admissibility when adjudicated in India.
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="poaFaqHeadingFive">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#poaFaqCollapseFive" aria-expanded="false" aria-controls="poaFaqCollapseFive">
                        5. Can a registered Power of Attorney be canceled orally or via email?
                    </button>
                </h2>
                <div id="poaFaqCollapseFive" class="accordion-collapse collapse" aria-labelledby="poaFaqHeadingFive" data-bs-parent="#nriPoaFaq">
                    <div class="accordion-body">
                        No. Under Indian property jurisprudence and registration laws, an oral message, phone call, or email cannot terminate a registered or adjudicated Power of Attorney. Legally terminating representative authority requires executing a formal <strong>Deed of Cancellation</strong>, registering it before the same Sub-Registrar Office, serving statutory written notice on the attorney holder, and publishing public notices in regional Tamil and English newspapers.
                    </div>
                </div>
            </div>"""
    html = html[:faq_start] + new_faqs + html[faq_end:]
    print("FAQ section updated successfully.")
else:
    print(f"ERROR: could not find FAQ bounds: faq_start={faq_start}, faq_end={faq_end}")

with open('nri-power-of-attorney.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("nri-power-of-attorney.html written successfully!")

