import re

with open('litigation-dispute-resolution.html', encoding='utf-8') as f:
    html = f.read()

# 1. Update Head section (Title, Meta Description, Keywords, Canonical, JSON-LD Schema)
old_head_meta = """        <title>Litigation &amp; Dispute Resolution | Best Lawyers in Thanjavur | RRC Law Associates</title>

        <meta name="description" content="Expert legal representation for civil litigation, commercial disputes, constitutional remedies, debt recovery, and injunction matters before High Courts and appellate tribunals.Contact RRC Law Associates Thanjavur, Tamilnadu.">

        <meta name="keywords" content="litigation lawyer Thanjavur, dispute resolution advocate thanjavur, corporate law lawyer Tamil Nadu">

        <link rel="canonical" href="https://rrclawassociates.com/litigation-dispute-resolution.html">"""

new_head_meta = """        <title>Litigation &amp; Dispute Resolution Lawyers in Tamil Nadu | Civil, Commercial &amp; Money Recovery | RRC Law Associates</title>

        <meta name="description" content="Trial and appellate litigation lawyers in Tamil Nadu. Expert representation in civil suits, commercial debt recovery, Order 37 summary suits, stay injunctions, and writ petitions.">

        <meta name="keywords" content="litigation lawyer Tamil Nadu, money recovery lawyer Thanjavur, commercial debt recovery Tamil Nadu, Order 37 CPC summary suit, civil dispute lawyer Thanjavur, stay order advocate Madras High Court, cheque bounce recovery">

        <link rel="canonical" href="https://rrclawassociates.com/litigation-dispute-resolution">

        <!-- Structured Data: LegalService, BreadcrumbList, and FAQPage -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LegalService",
              "@id": "https://rrclawassociates.com/litigation-dispute-resolution#service",
              "name": "Litigation & Dispute Resolution Legal Services",
              "url": "https://rrclawassociates.com/litigation-dispute-resolution",
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
              "description": "Comprehensive trial and appellate litigation legal services across Tamil Nadu: civil suits, commercial litigation, money recovery, Order 37 CPC summary suits, temporary injunctions, arbitration, and High Court writ petitions."
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
                  "name": "Litigation & Dispute Resolution",
                  "item": "https://rrclawassociates.com/litigation-dispute-resolution"
                }
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What requirements must be satisfied to secure an emergency temporary injunction (Stay Order) under Order 39 of the CPC?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Under Order 39 Rules 1 and 2 of the Code of Civil Procedure (CPC), the applicant must satisfy three mandatory legal tests: (1) a strong prima facie case demonstrating clear legal rights; (2) balance of convenience tilting in the applicant's favor; and (3) demonstrable irreparable injury or loss that cannot be adequately compensated with monetary damages if interim protection is refused."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can a party approach a civil court if their commercial contract contains a standard arbitration clause?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Generally, if a contract contains a valid arbitration agreement, Section 8 of the Arbitration and Conciliation Act, 1996 mandates that the civil court refer the parties to arbitration upon application by a party before submitting their first statement on the substance of the dispute. However, parties may still approach civil or commercial courts for urgent interim measures of protection under Section 9 of the Act."
                  }
                },
                {
                  "@type": "Question",
                  "name": "When is it appropriate to file an extraordinary Writ Petition under Article 226 before the High Court?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A Writ Petition under Article 226 of the Constitution of India is filed before the High Court when there is an arbitrary, unconstitutional, or illegal state action, an administrative overreach, a violation of fundamental rights, or a breach of natural justice by a government entity or statutory authority where no effective alternate statutory remedy exists."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the mandate for Pre-Institution Mediation in commercial disputes under the Commercial Courts Act?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Under Section 12A of the Commercial Courts Act, 2015, pre-institution mediation is mandatory for commercial disputes of Specified Value before filing a suit, unless the plaintiff seeks urgent interim relief (such as a temporary injunction or asset attachment). The process must be completed within three months (extendable by two months with mutual consent) through the District Legal Services Authority."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does an Order 37 summary suit expedite commercial money recovery compared to an ordinary civil suit?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An Order 37 CPC summary suit is a specialized fast-track civil remedy for recovering liquidated debts arising from written contracts, bills of exchange, hundis, or promissory notes. Unlike ordinary suits where a defendant can file a written statement as of right, an Order 37 defendant must enter an appearance within 10 days and obtain 'leave to defend' from the court by demonstrating a substantial defense. If leave is refused or no appearance is entered, the plaintiff is entitled to an immediate decree for the sum claimed with interest."
                  }
                }
              ]
            }
          ]
        }
        </script>"""

if old_head_meta in html:
    html = html.replace(old_head_meta, new_head_meta)
    print("Litigation head meta updated successfully.")
else:
    print("ERROR: old_head_meta not found in litigation!")

# 2. Update Debt Recovery Grid Card
old_debt_card = """                    <div class="col-6 col-md-3">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-passport"></i>
                            </div>
                            <h3>Debt Recovery</h3>
                            <p>Managing high-value summary recovery suits, check bounce filings, and strategic actions before Debt Recovery Tribunals (DRT).</p>
                        </div>
                    </div>"""

new_debt_card = """                    <div class="col-6 col-md-3">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-money-bill-transfer"></i>
                            </div>
                            <h3>Money &amp; Debt Recovery</h3>
                            <p>Managing commercial debt recovery, unpaid invoice claims, Order 37 CPC summary suits, and <a href="cheque-bounce-lawyer.html" class="text-gold fw-semibold text-decoration-none">Section 138 cheque bounce proceedings</a>.</p>
                        </div>
                    </div>"""

if old_debt_card in html:
    html = html.replace(old_debt_card, new_debt_card)
    print("Litigation debt card updated successfully.")
else:
    print("ERROR: old_debt_card not found in litigation!")

# 3. Add Commercial Money Recovery & Order 37 Row Card in the In-Depth Section
# Insert after Row 1 (Complex Civil suits)
row1_target = '            <div class="litigation-row-card mb-4">\n                <div class="row align-items-center g-4">\n                    <div class="col-md-4 order-md-1">\n                        <div class="visual-token-box">\n                            <img src="assets/images/interim-reliefs.png"'

money_recovery_row = """            <!-- Commercial Debt Recovery & Order 37 Summary Suits -->
            <div class="litigation-row-card mb-4">
                <div class="row align-items-center g-4">
                    <div class="col-md-4 order-md-1">
                        <div class="visual-token-box">
                            <picture>
                                <source srcset="assets/images/commercial-contract-review.webp" type="image/webp">
                                <img src="assets/images/commercial-contract-review.jpg" class="w-100 h-100 object-fit-cover" alt="Commercial debt recovery and Order 37 CPC summary suits in Tamil Nadu">
                            </picture>
                        </div>
                    </div>
                    <div class="col-md-8 order-md-2">
                        <h3 class="pub-headline">Commercial Money Recovery, Order 37 CPC &amp; Contractual Debts</h3>
                        <p class="pub-description">
                            Outstanding business receivables, unpaid vendor invoices, breached supply contracts, and defaulted loans threaten commercial liquidity. At RRC Law Associates, we enforce monetary recoveries through structured legal channels. For liquidated debts arising from written contracts, bills of exchange, or promissory notes, we deploy <strong>Summary Suits under Order 37 of the Code of Civil Procedure (CPC)</strong>—a fast-track mechanism where the defendant must demonstrate a genuine defense to secure leave to defend, preventing dilatory tactics. Under the <strong>Commercial Courts Act, 2015</strong>, we also navigate mandatory Pre-Institution Mediation and Settlement (PIMS) under Section 12A. Where payments were accompanied by dishonoured cheques, we concurrently initiate <a href="cheque-bounce-lawyer.html" class="text-gold fw-semibold text-decoration-none">Section 138 NI Act criminal complaints</a> to maximize recovery pressure.
                        </p>
                    </div>
                </div>
            </div>

"""

if row1_target in html:
    html = html.replace(row1_target, money_recovery_row + row1_target)
    print("Litigation money recovery row card inserted successfully.")
else:
    print("ERROR: row1_target not found in litigation!")

# 4. Add the 5th FAQ in the Accordion
faq_target = '        </div>\n    </div>\n</section>'
fifth_faq = """            <div class="accordion-item">
                <h2 class="accordion-header" id="litFaqHeadingFive">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#litFaqCollapseFive" aria-expanded="false" aria-controls="litFaqCollapseFive">
                        5. How does an Order 37 summary suit expedite commercial money recovery compared to an ordinary civil suit?
                    </button>
                </h2>
                <div id="litFaqCollapseFive" class="accordion-collapse collapse" aria-labelledby="litFaqHeadingFive" data-bs-parent="#litigationFaq">
                    <div class="accordion-body">
                        An Order 37 CPC summary suit is a specialized fast-track civil remedy for recovering liquidated debts arising from written contracts, bills of exchange, hundis, or promissory notes. Unlike ordinary suits where a defendant can file a written statement as of right, an Order 37 defendant must enter an appearance within 10 days and obtain 'leave to defend' from the court by demonstrating a substantial defense. If leave is refused or no appearance is entered, the plaintiff is entitled to an immediate decree for the sum claimed with interest. For cheque dishonour scenarios, concurrent prosecution under <a href="cheque-bounce-lawyer.html" class="text-gold fw-semibold text-decoration-none">Section 138 of the Negotiable Instruments Act</a> is also pursued.
                    </div>
                </div>
            </div>
"""

# Let's see the end of the accordion in litigation-dispute-resolution.html
acc_end = html.find('        </div>\n    </div>\n</section>\n\n        <section class="booking-section"')
if acc_end != -1:
    html = html[:acc_end] + fifth_faq + html[acc_end:]
    print("Litigation 5th FAQ added successfully.")
else:
    # let's find the closing of accordion id="litigationFaq"
    acc_id = html.find('id="litigationFaq"')
    if acc_id != -1:
        closing = html.find('</div>\n    </div>\n</section>', acc_id)
        if closing != -1:
            html = html[:closing] + fifth_faq + html[closing:]
            print("Litigation 5th FAQ added via closing anchor!")
        else:
            print("ERROR: closing not found in litigation FAQ!")
    else:
        print("ERROR: lit FAQ not found!")

with open('litigation-dispute-resolution.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("litigation-dispute-resolution.html written successfully!")

