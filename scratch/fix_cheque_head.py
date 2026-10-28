with open('cheque-bounce-lawyer.html', encoding='utf-8') as f:
    html = f.read()

import re

old_chunk = """        <title>Cheque Bounce Case Lawyers | NI Act Legal Services</title>

        <meta name="description" content="Professional legal services for cheque bounce cases under the Negotiable Instruments Act including notice, filing, and court representation.">

        <meta name="keywords" content="cheque bounce lawyer, NI Act advocate, cheque case legal services">

        <link rel="canonical" href="https://rrclawassociates.com/cheque-bounce-lawyer.html">"""

new_chunk = """        <title>Cheque Bounce Lawyers in Tamil Nadu | Section 138 NI Act Notice &amp; Criminal Trial | RRC Law Associates</title>

        <meta name="description" content="Experienced Section 138 NI Act cheque bounce lawyers in Tamil Nadu. Expert statutory demand notice drafting, 15-day timeline compliance, Magistrate court complaint filing, and debt recovery representation.">

        <meta name="keywords" content="cheque bounce lawyer Tamil Nadu, Section 138 NI Act lawyer Thanjavur, cheque dishonour demand notice, cheque bounce statutory timeline, Section 143A interim compensation, cheque bounce complaint procedure India, NRI cheque bounce lawyer">

        <link rel="canonical" href="https://rrclawassociates.com/cheque-bounce-lawyer">

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
                    "text": "Yes. An overseas NRI complainant can institute and manage Section 138 criminal complaint proceedings in India through an authorized Special Power of Attorney (SPA) holder or legal counsel. The POA must be properly executed, attested/apostilled abroad, and adjudicated in India. While the complainant's evidence may require initial verification, physical presence is not required for routine procedural hearings, and courts in Tamil Nadu increasingly accommodate virtual attendance where permitted."
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

if old_chunk in html:
    html = html.replace(old_chunk, new_chunk)
    with open('cheque-bounce-lawyer.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed cheque head meta successfully!")
else:
    print("old_chunk not found in cheque!")

