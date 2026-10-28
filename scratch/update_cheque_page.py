import re

with open('cheque-bounce-lawyer.html', encoding='utf-8') as f:
    html = f.read()

# 1. Update Head section (Title, Meta Description, Keywords, Canonical, JSON-LD Schema)
old_head_meta = """        <title>Cheque Bounce Case Lawyers | NI Act Legal Services</title>

        <meta
            name="description"
            content="Professional legal services for cheque bounce cases under the Negotiable Instruments Act including notice, filing, and court representation.">

        <meta
            name="keywords"
            content="cheque bounce lawyer, 138 NI Act lawyer, dishonour of cheque legal notice, cheque bounce case filing, cheque bounce advocate">

        <link
            rel="canonical"
            href="https://rrclawassociates.com/cheque-bounce-lawyer.html">"""

new_head_meta = """        <title>Cheque Bounce Lawyers in Tamil Nadu | Section 138 NI Act Notice &amp; Criminal Trial | RRC Law Associates</title>

        <meta
            name="description"
            content="Experienced Section 138 NI Act cheque bounce lawyers in Tamil Nadu. Expert statutory demand notice drafting, 15-day timeline compliance, Magistrate court complaint filing, and debt recovery representation.">

        <meta
            name="keywords"
            content="cheque bounce lawyer Tamil Nadu, Section 138 NI Act lawyer Thanjavur, cheque dishonour demand notice, cheque bounce statutory timeline, Section 143A interim compensation, cheque bounce complaint procedure India, NRI cheque bounce lawyer">

        <link
            rel="canonical"
            href="https://rrclawassociates.com/cheque-bounce-lawyer">

        <!-- Structured Data: LegalService, BreadcrumbList, and FAQPage -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LegalService",
              "@id": "https://rrclawassociates.com/cheque-bounce-lawyer#service",
              "name": "Cheque Bounce (Section 138 NI Act) Legal Services",
              "url": "https://rrclawassociates.com/cheque-bounce-lawyer",
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
              "description": "Comprehensive legal advocacy under Section 138 of the Negotiable Instruments Act, 1881: statutory demand notices, Judicial Magistrate court complaint proceedings, interim compensation under Section 143A, and commercial debt recovery in Tamil Nadu."
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
                  "name": "Core Practice Areas",
                  "item": "https://rrclawassociates.com/core-practice-areas.html"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Cheque Bounce",
                  "item": "https://rrclawassociates.com/cheque-bounce-lawyer"
                }
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What happens if the 30-day statutory notice deadline is missed after a cheque bounces?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Under Section 138(b) of the Negotiable Instruments Act, 1881, issuing a formal demand notice within 30 days of receiving the Cheque Return Memo is a mandatory statutory condition precedent. If this 30-day limitation is missed, a criminal complaint under Section 138 cannot be maintained unless the cheque can still be re-presented within its 3-month validity period. However, the creditor still retains the right to file an ordinary civil money recovery suit or an Order 37 summary suit within the 3-year limitation period."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can an NRI file and pursue a Section 138 cheque bounce case in India without traveling for every hearing?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. An overseas NRI complainant can institute and manage Section 138 criminal complaint proceedings in India through an authorized Power of Attorney (POA) holder or legal counsel. The POA must be properly executed, attested/apostilled abroad, and adjudicated in India. While the complainant's evidence may require initial verification, physical presence is not required for routine procedural hearings, and courts in Tamil Nadu increasingly accommodate virtual attendance where permitted."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can the court order the accused to pay interim compensation while the cheque bounce trial is ongoing?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Under Section 143A of the Negotiable Instruments Act (inserted by the 2018 Amendment), the trial court has the power to direct the drawer of the dishonoured cheque to pay interim compensation to the complainant. This amount cannot exceed 20% of the cheque face value and must typically be deposited within 60 days of the court's order."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does a Section 138 criminal complaint differ from a civil money recovery suit?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Section 138 of the NI Act is a quasi-criminal proceeding filed before a Judicial Magistrate, focusing on penalizing the drawer with imprisonment up to 2 years, a fine up to twice the cheque amount, or both. A civil money recovery suit (such as an Order 37 CPC summary suit) is filed in a civil court to obtain a decree for the recovery of the debt along with contractual interest. Both remedies can be pursued concurrently under Indian law."
                  }
                }
              ]
            }
          ]
        }
        </script>"""

if old_head_meta in html:
    html = html.replace(old_head_meta, new_head_meta)
    print("Cheque head meta updated successfully.")
else:
    print("ERROR: old_head_meta not found in cheque!")

# 2. Add Row Card & FAQ CSS before </style>
css_to_add = """
            /* --- IN-DEPTH PRACTICE FOCUS & LITIGATION ROW CARDS --- */
            .litigation-row-card {
                background-color: #ffffff;
                border: 1px solid rgba(0, 0, 0, 0.06);
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
                transition: transform 0.25s ease, border-color 0.25s ease;
            }

            .litigation-row-card:hover {
                transform: translateY(-3px);
                border-color: #c9a24d;
            }

            .pub-headline {
                font-family: 'Playfair Display', serif;
                font-weight: 700;
                color: #1a1e21;
                font-size: 1.45rem;
                line-height: 1.35;
                margin-bottom: 15px;
            }

            .pub-description {
                color: #555555;
                font-size: 1rem;
                line-height: 1.7;
                font-weight: 400;
                margin-bottom: 0px;
            }

            .visual-token-box {
                border-radius: 12px;
                height: 220px;
                width: 100%;
                overflow: hidden;
                background-color: #f9f7f3;
                border: 1px solid rgba(60, 56, 25, 0.05);
            }

            .sticky-sidebar {
                position: sticky;
                top: 110px;
                background-color: #ffffff;
                border: 1px solid rgba(0, 0, 0, 0.06);
                border-radius: 16px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
            }

            .text-gold {
                color: #c9a24d !important;
            }

            .whatsapp-float-btn {
                background-color: #25d366;
                color: #ffffff !important;
                padding: 12px;
                border-radius: 10px;
                text-decoration: none !important;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-size: 0.88rem;
            }

            .whatsapp-float-btn:hover {
                background-color: #128c7e;
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
            }

            /* --- CUSTOM FAQ ACCORDION --- */
            .faq-eyebrow {
                color: #c9a24d;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-weight: 700;
                font-size: 0.85rem;
                display: block;
            }
            .faq-title {
                font-family: 'Playfair Display', serif;
                font-weight: 700;
                color: #000000;
                font-size: 2.25rem;
            }
            .faq-title-line {
                width: 50px;
                height: 3px;
                background-color: #c9a24d;
                margin: 15px auto 0;
                border-radius: 2px;
            }

            .custom-faq-accordion .accordion-item {
                border: none;
                border-bottom: 1px solid rgba(60, 56, 25, 0.12) !important;
                background: transparent;
                border-radius: 0px !important;
            }

            .custom-faq-accordion .accordion-button {
                background: transparent !important;
                color: #3c3819;
                font-weight: 600;
                font-size: 1.1rem;
                padding: 22px 0px;
                box-shadow: none !important;
                border: none;
                text-align: left;
                transition: color 0.25s ease;
            }

            .custom-faq-accordion .accordion-button:not(.collapsed) {
                color: #c9a24d !important;
            }

            .custom-faq-accordion .accordion-body {
                padding: 0px 0px 24px 0px;
                color: #555555;
                font-size: 1rem;
                line-height: 1.75;
            }

            @media (max-width: 991px) {
                .sticky-sidebar {
                    position: relative;
                    top: 0;
                    margin-top: 30px;
                }
                .litigation-row-card {
                    padding: 30px 20px;
                }
                .visual-token-box {
                    height: 160px;
                    margin-bottom: 15px;
                }
                .pub-headline {
                    font-size: 1.3rem;
                }
            }
"""

style_tag = '</style>'
if style_tag in html:
    html = html.replace(style_tag, css_to_add + "\n        " + style_tag, 1)
    print("Cheque CSS added successfully.")
else:
    print("ERROR: style tag not found in cheque!")

# 3. Update Hero Lead and Text
old_hero_text = """                    <p class="lead fw-bold">Recover Unpaid Money Through Effective Cheque Bounce Action</p>
                    <p>From issuing precise legal notices to handling rigorous court proceedings, we
                        manage the entire recovery process with efficiency and strategic authority.</p>
                    <p class="fw-bold mt-4">We ensure timely legal action and an effective recovery
                        process to safeguard your financial interests.</p>"""

new_hero_text = """                    <p class="lead fw-bold">Statutory Notice Drafting, Section 138 Criminal Complaints &amp; High-Value Debt Recovery in Tamil Nadu</p>
                    <p>Under Section 138 of the Negotiable Instruments Act, 1881, the dishonour of a cheque issued towards a legally enforceable debt is a punishable criminal offence. Enforcing your statutory rights demands strict adherence to mandatory timelines: issuing a formal Demand Notice within 30 days of receiving the bank memo and filing a criminal complaint before the Judicial Magistrate within 30 days of the drawer's default.</p>
                    <p class="fw-bold mt-3 text-gold">RRC Law Associates represents businesses, contractors, and individuals across Thanjavur and Tamil Nadu, securing swift trial proceedings, interim compensation under Section 143A, and strategic out-of-court settlements.</p>"""

if old_hero_text in html:
    html = html.replace(old_hero_text, new_hero_text)
    print("Cheque hero text updated successfully.")
else:
    print("ERROR: old_hero_text not found in cheque!")

# 4. Update the 4 Cards in Matters We Handle
old_matters = """                <div class="row g-3 justify-content-center">
                    <div class="col-6 col-md-3">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-file-invoice"></i>
                            </div>
                            <h3>Legal Notice Drafting</h3>
                            <p>Drafting precise legal notices to initiate the recovery process.</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-balance-scale-right"></i>
                            </div>
                            <h3>Section 138 Filing</h3>
                            <p>Formal filing of complaints under the Negotiable Instruments Act.</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-gavel"></i>
                            </div>
                            <h3>Court Representation</h3>
                            <p>Result-oriented advocacy during trial and court hearings.</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-handshake"></i>
                            </div>
                            <h3>Case Settlement</h3>
                            <p>Strategic negotiation for effective out-of-court settlements.</p>
                        </div>
                    </div>
                </div>"""

new_matters = """                <div class="row g-3 justify-content-center">
                    <div class="col-6 col-md-3">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-file-invoice"></i>
                            </div>
                            <h3>Statutory Notice (30 Days)</h3>
                            <p>Drafting precise statutory demand notices under Section 138(b) within 30 days of dishonour, granting the mandatory 15-day cure window.</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-gavel"></i>
                            </div>
                            <h3>Section 138 Filing (30 Days)</h3>
                            <p>Filing rigorous criminal complaints under Section 142 NI Act before the jurisdictional Judicial Magistrate upon expiry of the 15-day notice period.</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-scale-balanced"></i>
                            </div>
                            <h3>Interim Relief (Sec 143A)</h3>
                            <p>Securing court orders directing the drawer to deposit up to 20% of the cheque face value as interim compensation pending trial.</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-handshake"></i>
                            </div>
                            <h3>Compounding &amp; Settlement</h3>
                            <p>Facilitating structured out-of-court compounding under Section 147 NI Act or concurrent civil recovery under Order 37 CPC.</p>
                        </div>
                    </div>
                </div>"""

if old_matters in html:
    html = html.replace(old_matters, new_matters)
    print("Cheque matters grid updated successfully.")
else:
    print("ERROR: old_matters not found in cheque!")

# 5. Insert In-Depth Practice Focus and FAQ section between Matters We Handle and Advocates Section
insert_target = '<section id="advocates" class="advocates-section">'
detailed_section_and_faqs = """        <!-- Detailed Cheque Bounce Practice Areas & Statutory Timelines -->
        <div class="container my-5">
            <div class="row g-5">

                <div class="col-lg-8 content-body text-start">

                    <!-- Row 1: Strict Statutory Timelines -->
                    <div class="litigation-row-card mb-4">
                        <div class="row align-items-center g-4">
                            <div class="col-md-4">
                                <div class="visual-token-box">
                                    <picture>
                                        <source srcset="assets/images/dispute-resolution-defense.webp" type="image/webp">
                                        <img src="assets/images/dispute-resolution-defense.jpg" class="w-100 h-100 object-fit-cover" alt="Section 138 NI Act statutory timelines and demand notice compliance">
                                    </picture>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h3 class="pub-headline">Strict Statutory Timelines under Section 138 NI Act</h3>
                                <p class="pub-description">
                                    A cheque bounce case is strictly timeline-bound. Under the Negotiable Instruments Act, 1881, four mandatory conditions precedent must be satisfied: (1) the cheque must be presented to the bank within its validity period (3 months); (2) upon dishonour, a formal <strong>Statutory Demand Notice must be issued within 30 days</strong> of receiving the Cheque Return Memo from the bank; (3) the drawer is granted a <strong>mandatory 15-day statutory payment window</strong> from the date of receipt of notice; and (4) if payment is not made, the criminal complaint must be filed before the competent Judicial Magistrate within <strong>30 days following the expiry of the 15-day period</strong>. Missing any statutory timeline can prove fatal to prosecution.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Row 2: Required Documentary Evidence Checklist -->
                    <div class="litigation-row-card mb-4">
                        <div class="row align-items-center g-4">
                            <div class="col-md-4 order-md-1">
                                <div class="visual-token-box">
                                    <picture>
                                        <source srcset="assets/images/commercial-contract-review.webp" type="image/webp">
                                        <img src="assets/images/commercial-contract-review.jpg" class="w-100 h-100 object-fit-cover" alt="Documentary evidence checklist for cheque bounce prosecution in Tamil Nadu">
                                    </picture>
                                </div>
                            </div>
                            <div class="col-md-8 order-md-2">
                                <h3 class="pub-headline">Essential Documentary Evidence Checklist</h3>
                                <p class="pub-description">
                                    Establishing a prima facie case under Section 138 requires meticulous evidentiary compilation. Our litigation team reviews and structures the entire proof portfolio: (1) the original dishonoured cheque; (2) the official <strong>Cheque Return Memo</strong> specifying bank remarks (such as "Funds Insufficient", "Account Closed", or "Stop Payment"); (3) office copy of the detailed statutory demand notice; (4) original postal receipts (Registered Post / Speed Post); (5) postal delivery tracking report or signed acknowledgment card proving effective service; and (6) primary documentation proving an underlying <strong>legally enforceable debt or liability</strong> (commercial invoices, loan agreements, promissory notes, or delivery challans).
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Row 3: Trial Proceedings, Interim Compensation & Corporate Liability -->
                    <div class="litigation-row-card mb-4">
                        <div class="row align-items-center g-4">
                            <div class="col-md-4">
                                <div class="visual-token-box">
                                    <picture>
                                        <source srcset="assets/images/civil-litigation.png" type="image/png">
                                        <img src="assets/images/civil-litigation.png" class="w-100 h-100 object-fit-cover" alt="Judicial Magistrate court trial advocacy and Section 143A interim compensation">
                                    </picture>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h3 class="pub-headline">Magistrate Trial, Sec 143A Relief &amp; Corporate Director Liability</h3>
                                <p class="pub-description">
                                    Following complaint institution under Section 142, we handle the complainant's sworn statement, ensure prompt issuance of summons or bailable warrants if the accused evades court, and immediately file an application for <strong>Interim Compensation under Section 143A</strong> (directing deposit of up to 20% of the cheque value). Where dishonoured cheques are issued by companies, LLPs, or partnership firms, we invoke <strong>Section 141 vicarious liability</strong>, prosecuting managing directors, partners, and authorized signatories directly responsible for business operations at the time of the offence.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Row 4: NRI Complainant Representation & Civil Recovery Synergy -->
                    <div class="litigation-row-card mb-4">
                        <div class="row align-items-center g-4">
                            <div class="col-md-4 order-md-1">
                                <div class="visual-token-box">
                                    <picture>
                                        <source srcset="assets/images/remote-nri-property-assistance.webp" type="image/webp">
                                        <img src="assets/images/remote-nri-property-assistance.jpg" class="w-100 h-100 object-fit-cover" alt="NRI cheque bounce legal representation and Order 37 summary debt recovery">
                                    </picture>
                                </div>
                            </div>
                            <div class="col-md-8 order-md-2">
                                <h3 class="pub-headline">NRI Complainant Assistance &amp; Civil Summary Recovery Synergy</h3>
                                <p class="pub-description">
                                    For Non-Resident Indians who receive bounced cheques during property sales, business investments, or personal debt settlements in India, our firm provides complete remote representation. Through a properly authenticated <a href="nri-power-of-attorney.html" class="text-gold fw-semibold text-decoration-none">Special Power of Attorney</a>, we institute and manage criminal proceedings without requiring personal travel for routine hearings. Furthermore, to maximize recovery speed, we deploy a dual strategy: instituting Section 138 quasi-criminal proceedings alongside an <strong>Order 37 CPC Summary Suit</strong> in civil courts, securing attachment of debtor assets before judgment.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="col-lg-4 text-start">
                    <div class="sticky-sidebar">
                        <h5 class="fw-bold mb-3 text-gold" style="font-family: 'Playfair Display';">Cheque Bounce Case Intake</h5>
                        <p class="small text-muted">Statutory notice periods run from the exact date of bank dishonour memo. Submit your cheque return details now for an urgent limitation audit by our trial advocates.</p>
                        <hr>

                        <a href="./booking.html" class="btn btn-gold py-2.5 mb-3 fw-bold text-uppercase small w-100 text-center">Request a Cheque Bounce Consultation</a>

                        <p class="text-muted mb-4" style="font-size: 0.82rem; line-height: 1.5; background-color: #fcfbfa; padding: 12px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.03);">
                            <i class="fas fa-clock text-gold me-1"></i> **Urgent 30-Day Window:** Please provide the date of the Cheque Return Memo to ensure your statutory demand notice is dispatched within legal limitation.
                        </p>

                        <a href="https://wa.me/919751182452?text=Hello%20RRC%20Law%20Associates,%20I%20have%20a%20dishonoured%20cheque%20in%20Tamil%20Nadu%20and%20require%20urgent%20legal%20assistance%20for%20a%20Section%20138%20statutory%20notice." class="whatsapp-float-btn" target="_blank">
                            <i class="fab fa-whatsapp fs-5"></i>
                            <span>Urgent Cheque Intake Chat</span>
                        </a>
                    </div>
                </div>

            </div>
        </div>

        <!-- Section 138 Cheque Bounce FAQ Section -->
        <section class="py-5" style="background-color: #ffffff;">
            <div class="container" style="max-width: 850px;">

                <div class="text-center mb-5">
                    <span class="faq-eyebrow">Support &amp; Guidance</span>
                    <h2 class="faq-title mt-2">Frequently Asked Questions</h2>
                    <div class="faq-title-line"></div>
                </div>

                <div class="accordion custom-faq-accordion" id="chequeBounceFaq">

                    <div class="accordion-item">
                        <h2 class="accordion-header" id="cbFaqHeadingOne">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cbFaqCollapseOne" aria-expanded="false" aria-controls="cbFaqCollapseOne">
                                1. What happens if the 30-day statutory notice deadline is missed after a cheque bounces?
                            </button>
                        </h2>
                        <div id="cbFaqCollapseOne" class="accordion-collapse collapse" aria-labelledby="cbFaqHeadingOne" data-bs-parent="#chequeBounceFaq">
                            <div class="accordion-body">
                                Under Section 138(b) of the Negotiable Instruments Act, 1881, issuing a formal demand notice within 30 days of receiving the Cheque Return Memo is a mandatory statutory condition precedent. If this 30-day limitation is missed, a criminal complaint under Section 138 cannot be maintained unless the cheque can still be re-presented within its 3-month validity period. However, the creditor still retains the right to file an ordinary civil money recovery suit or an <a href="litigation-dispute-resolution.html" class="text-gold fw-semibold text-decoration-none">Order 37 summary debt recovery suit</a> within the 3-year limitation period.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header" id="cbFaqHeadingTwo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cbFaqCollapseTwo" aria-expanded="false" aria-controls="cbFaqCollapseTwo">
                                2. Can an NRI file and pursue a Section 138 cheque bounce case in India without traveling for every hearing?
                            </button>
                        </h2>
                        <div id="cbFaqCollapseTwo" class="accordion-collapse collapse" aria-labelledby="cbFaqHeadingTwo" data-bs-parent="#chequeBounceFaq">
                            <div class="accordion-body">
                                Yes. An overseas NRI complainant can institute and manage Section 138 criminal complaint proceedings in India through an authorized <a href="nri-power-of-attorney.html" class="text-gold fw-semibold text-decoration-none">Special Power of Attorney (SPA)</a> holder or legal counsel. The POA must be properly executed, attested/apostilled abroad, and adjudicated in India. While the complainant's evidence may require initial verification, physical presence is not required for routine procedural hearings, and courts in Tamil Nadu increasingly accommodate virtual attendance where permitted.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header" id="cbFaqHeadingThree">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cbFaqCollapseThree" aria-expanded="false" aria-controls="cbFaqCollapseThree">
                                3. Can the court order the accused to pay interim compensation while the cheque bounce trial is ongoing?
                            </button>
                        </h2>
                        <div id="cbFaqCollapseThree" class="accordion-collapse collapse" aria-labelledby="cbFaqHeadingThree" data-bs-parent="#chequeBounceFaq">
                            <div class="accordion-body">
                                Yes. Under Section 143A of the Negotiable Instruments Act (inserted by the 2018 Amendment), the trial court has the power to direct the drawer of the dishonoured cheque to pay interim compensation to the complainant. This amount cannot exceed 20% of the cheque face value and must typically be deposited within 60 days of the court's order.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header" id="cbFaqHeadingFour">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cbFaqCollapseFour" aria-expanded="false" aria-controls="cbFaqCollapseFour">
                                4. How does a Section 138 criminal complaint differ from a civil money recovery suit?
                            </button>
                        </h2>
                        <div id="cbFaqCollapseFour" class="accordion-collapse collapse" aria-labelledby="cbFaqHeadingFour" data-bs-parent="#chequeBounceFaq">
                            <div class="accordion-body">
                                Section 138 of the NI Act is a quasi-criminal proceeding filed before a Judicial Magistrate, focusing on penalizing the drawer with imprisonment up to 2 years, a fine up to twice the cheque amount, or both. A civil money recovery suit (such as an Order 37 CPC summary suit) is filed in a civil court to obtain a decree for the recovery of the debt along with contractual interest. Both remedies can be pursued concurrently under Indian law.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        """

if insert_target in html:
    html = html.replace(insert_target, detailed_section_and_faqs + insert_target, 1)
    print("Cheque detailed sections and FAQ inserted successfully.")
else:
    print("ERROR: insert_target not found in cheque!")

with open('cheque-bounce-lawyer.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("cheque-bounce-lawyer.html written successfully!")

