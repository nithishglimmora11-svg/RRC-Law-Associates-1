const fs = require('fs');

const articlesConfig = [
  {
    file: 'oci-card-eligibility-legal-status.html',
    num: 1,
    title: 'OCI Card Eligibility in India: Status & Law | RRC Law Firm',
    desc: 'Comprehensive legal guide on OCI card eligibility under Section 7A, Indian ancestry requirements, legal rights, limitations, and essential documentation.',
    heroImg: { src: '/assets/images/oci-blog-eligibility.jpg', width: 1200, height: 896 }
  },
  {
    file: 'oci-vs-nri-vs-indian-citizen.html',
    num: 2,
    title: 'OCI vs NRI vs Indian Citizen: Legal Differences | RRC Law',
    desc: 'Understand the legal differences between OCI cardholders, NRIs, and Indian citizens regarding citizenship, passport rights, property ownership, and taxation.',
    heroImg: { src: '/assets/images/nri-law-1.jpg', width: 626, height: 417 }
  },
  {
    file: 'oci-card-application-documents.html',
    num: 3,
    title: 'OCI Card Application Documents & Steps | RRC Law Associates',
    desc: 'Step-by-step legal guide on OCI application documents, official portal submission, document verification at Indian Missions/FRRO, and common mistakes to avoid.',
    heroImg: { src: '/assets/images/law-office-meeting.jpg', width: 800, height: 1024 }
  },
  {
    file: 'oci-card-indian-ancestry-assistance.html',
    num: 4,
    title: 'OCI Through Indian Ancestry: How to Prove Origin | RRC Law',
    desc: 'Learn how to prove Indian ancestry for an OCI card through parents, grandparents, or great-grandparents. Archival research, missing birth records, and NABC.',
    heroImg: { src: '/assets/images/oci-hero-bg.jpg', width: 1376, height: 768 },
    isGuide4Special: true
  },
  {
    file: 'oci-foreign-spouse-eligibility.html',
    num: 5,
    title: 'OCI Card for Foreign Spouse: Eligibility & Rules | RRC Law',
    desc: 'Complete legal guide on OCI for foreign spouses: the 2-year registered marriage requirement, security clearance, required documents, and cancellation on divorce.',
    heroImg: { src: '/assets/images/oci-foreign-spouse-eligibility.jpg', width: 1376, height: 768 }
  },
  {
    file: 'oci-for-children-born-abroad.html',
    num: 6,
    title: 'OCI Card for Child Born Abroad: Rules & Rights | RRC Law',
    desc: 'Understand OCI card eligibility for children born abroad to Indian parents. Citizenship Act Section 4 vs Section 7A, passport rules, and custody documents.',
    heroImg: { src: '/assets/images/oci-for-children-born-abroad.jpg', width: 1376, height: 768 }
  },
  {
    file: 'oci-card-benefits-restrictions-india.html',
    num: 7,
    title: 'OCI Card Benefits and Restrictions in India | RRC Law Firm',
    desc: 'Comprehensive guide to OCI card benefits and restrictions: lifelong multi-entry visa, employment, property rights, parity with NRIs, and MHA restricted activities.',
    heroImg: { src: '/assets/images/oci-card-benefits-restrictions.jpg', width: 1376, height: 768 }
  },
  {
    file: 'oci-cardholders-inherit-sell-ancestral-property-india.html',
    num: 8,
    title: 'OCI Inheritance of Property in India: FEMA Rules | RRC Law',
    desc: 'Legal analysis of OCI ancestral property inheritance, sale of agricultural land under FEMA, succession certificates, PoA execution, and funds repatriation.',
    heroImg: { src: '/assets/images/oci-ancestral-property-india.jpg', width: 1376, height: 768 }
  },
  {
    file: 'nri-oci-property-due-diligence-india.html',
    num: 10,
    title: 'NRI OCI Property Due Diligence in India | RRC Law Firm',
    desc: 'Essential due diligence checklist for NRIs and OCIs buying property in India: 30-year title search, Encumbrance Certificates, Patta, and litigation checks.',
    heroImg: { src: '/assets/images/nri-oci-property-due-diligence.jpg', width: 1376, height: 768 }
  },
  {
    file: 'nri-oci-property-tax-india.html',
    num: 11,
    title: 'NRI & OCI Property Tax in India: TDS & Rules | RRC Law Firm',
    desc: 'Selling or inheriting property in India as an NRI or OCI cardholder? Understand TDS, capital gains, inherited property taxation and repatriation rules.',
    heroImg: { src: '/assets/images/nri-oci-property-tax-india.jpg', width: 1376, height: 768 }
  },
  {
    file: 'oci-card-renewal-passport-update.html',
    num: 12,
    title: 'OCI Passport Update Rules: Renewal Guidelines | RRC Law',
    desc: 'Complete legal breakdown of OCI renewal rules: mandatory re-issuance at 20 years, online e-OCI portal updates after new foreign passport, and lost OCI cards.',
    heroImg: { src: '/assets/images/oci-card-renewal-passport-update.jpg', width: 1376, height: 768 }
  },
  {
    file: 'oci-card-cancellation-grounds-remedies.html',
    num: 13,
    title: 'OCI Card Cancellation Rules & Legal Remedies | RRC Law Firm',
    desc: 'Understand statutory grounds for OCI card cancellation under Section 7D, show-cause notices, natural justice rights, and legal remedies before authorities.',
    heroImg: { src: '/assets/images/oci-card-cancellation-grounds-remedies.jpg', width: 1376, height: 768 }
  },
  {
    file: 'oci-card-cancellation-section-7d-legal-remedies.html',
    num: 14,
    title: 'OCI Cancellation Under Section 7D: Legal Defense | RRC Law',
    desc: 'Legal remedies for OCI cardholders facing Section 7D cancellation, FIRs, charge-sheets, blacklisting, or LOCs. High Court writ review under Article 226.',
    heroImg: { src: '/assets/images/oci-card-cancellation-section-7d-legal-remedies.jpg', width: 1376, height: 768 }
  }
];

// Universal internal link replacements
const universalLinkReplacements = [
  ['href="/oci-card-assistance.html"', 'href="/oci-card-assistance"'],
  ['href="/oci-legal-guides.html"', 'href="/oci-legal-guides/"'],
  ['href="/oci-card-eligibility-legal-status.html"', 'href="/oci-card-eligibility-legal-status/"'],
  ['href="/oci-vs-nri-vs-indian-citizen.html"', 'href="/oci-vs-nri-vs-indian-citizen/"'],
  ['href="/oci-card-application-documents.html"', 'href="/oci-card-application-documents/"'],
  ['href="/oci-card-indian-ancestry-assistance.html"', 'href="/oci-card-indian-ancestry-assistance/"'],
  ['href="/oci-foreign-spouse-eligibility.html"', 'href="/oci-foreign-spouse-eligibility/"'],
  ['href="/oci-for-children-born-abroad.html"', 'href="/oci-for-children-born-abroad/"'],
  ['href="/oci-card-benefits-restrictions-india.html"', 'href="/oci-card-benefits-restrictions-india/"'],
  ['href="/oci-cardholders-inherit-sell-ancestral-property-india.html"', 'href="/oci-cardholders-inherit-sell-ancestral-property-india/"'],
  ['href="/nri-oci-property-due-diligence-india.html"', 'href="/nri-oci-property-due-diligence-india/"'],
  ['href="/nri-oci-property-tax-india.html"', 'href="/nri-oci-property-tax-india/"'],
  ['href="/oci-card-renewal-passport-update.html"', 'href="/oci-card-renewal-passport-update/"'],
  ['href="/oci-card-cancellation-grounds-remedies.html"', 'href="/oci-card-cancellation-grounds-remedies/"'],
  ['href="/oci-card-cancellation-section-7d-legal-remedies.html"', 'href="/oci-card-cancellation-section-7d-legal-remedies/"'],
  ['<a href="/nri-services.html">NRI Legal Services</a>', '<a href="/nri-services">NRI Legal Services</a>'],
  // Schema item URL fixes
  ['"https://rrclawassociates.com/nri-services.html"', '"https://rrclawassociates.com/nri-services"'],
  ['"https://rrclawassociates.com/oci-legal-guides.html"', '"https://rrclawassociates.com/oci-legal-guides/"'],
  ['"https://rrclawassociates.com/oci-card-assistance.html"', '"https://rrclawassociates.com/oci-card-assistance"']
];

articlesConfig.forEach(cfg => {
  let content = fs.readFileSync(cfg.file, 'utf8');

  // 1. Update Title
  content = content.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${cfg.title}</title>`
  );

  // 2. Update Meta Description
  content = content.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']/i,
    `<meta name="description" content="${cfg.desc}">`
  );

  // 3. Update Open Graph & Twitter Titles & Descriptions
  content = content.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']/i,
    `<meta property="og:title" content="${cfg.title}">`
  );
  content = content.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']/i,
    `<meta property="og:description" content="${cfg.desc}">`
  );
  content = content.replace(
    /<meta\s+(name|property)=["']twitter:title["']\s+content=["'][\s\S]*?["']/i,
    `<meta name="twitter:title" content="${cfg.title}">`
  );
  content = content.replace(
    /<meta\s+(name|property)=["']twitter:description["']\s+content=["'][\s\S]*?["']/i,
    `<meta name="twitter:description" content="${cfg.desc}">`
  );

  // 4. Ensure <meta name="robots" content="index, follow"> is present
  if (!/<meta\s+name=["']robots["']/i.test(content)) {
    // Insert after description
    content = content.replace(
      /(<meta\s+name=["']description["'][^>]*>)/i,
      `$1\n    <meta name="robots" content="index, follow">`
    );
  } else {
    content = content.replace(
      /<meta\s+name=["']robots["']\s+content=["'][\s\S]*?["']/i,
      `<meta name="robots" content="index, follow">`
    );
  }

  // 5. Image dimensions additions
  // rrclogo.png: 666x182
  content = content.replace(
    /<img([^>]*?)src=["']\/assets\/images\/rrclogo\.png["']([^>]*?)>/gi,
    (m, p1, p2) => {
      let tag = `<img${p1}src="/assets/images/rrclogo.png"${p2}>`;
      if (!/width=/i.test(tag)) tag = tag.replace('<img', '<img width="666" height="182"');
      return tag;
    }
  );
  // logo.png: 500x500
  content = content.replace(
    /<img([^>]*?)src=["']\/assets\/images\/logo\.png["']([^>]*?)>/gi,
    (m, p1, p2) => {
      let tag = `<img${p1}src="/assets/images/logo.png"${p2}>`;
      if (!/width=/i.test(tag)) tag = tag.replace('<img', '<img width="500" height="500"');
      return tag;
    }
  );
  // Hero image
  const heroRegex = new RegExp(`<img([^>]*?)src=["']${cfg.heroImg.src.replace('/', '\\/')}["']([^>]*?)>`, 'gi');
  content = content.replace(
    heroRegex,
    (m, p1, p2) => {
      let tag = `<img${p1}src="${cfg.heroImg.src}"${p2}>`;
      if (!/width=/i.test(tag)) tag = tag.replace('<img', `<img width="${cfg.heroImg.width}" height="${cfg.heroImg.height}"`);
      return tag;
    }
  );

  // 6. Universal link replacements
  for (const [target, repl] of universalLinkReplacements) {
    content = content.split(target).join(repl);
  }

  // 7. Special handling for Guide 4 (Cannibalization fix, breadcrumbs, schema upgrade)
  if (cfg.isGuide4Special) {
    // Update H1 and Subtitle
    content = content.replace(
      /<h1 class="article-title mt-3 mb-4">OCI Card &amp; Indian Ancestry Documentation Assistance<\/h1>/,
      '<h1 class="article-title mt-3 mb-4">OCI Through Indian Ancestry: How to Prove Your Indian-Origin Family Connection</h1>'
    );
    content = content.replace(
      '<p class="article-subtitle">Legal guidance and Indian document research for overseas Indians and foreign citizens of Indian origin.</p>',
      '<p class="article-subtitle">Legal guidance on proving Indian origin, tracing ancestral records, obtaining NABC, and establishing documentary lineage for OCI registration.</p>'
    );
    content = content.replace(
      '<span class="meta-text">OCI Legal Services</span>',
      '<div class="breadcrumbs-bar mb-3">\n                        <a href="/">Home</a> &nbsp;/&nbsp;\n                        <a href="/nri-services">NRI Legal Services</a> &nbsp;/&nbsp;\n                        <a href="/oci-legal-guides/">OCI Legal Guides</a> &nbsp;/&nbsp;\n                        <span>Guide 4</span>\n                    </div>\n                    <span class="meta-text">OCI Legal Guides &bull; Article 4</span>'
    );

    // Add CSS for breadcrumbs-bar
    if (!content.includes('.breadcrumbs-bar {')) {
      const breadcrumbsCss = `
        .breadcrumbs-bar {
            margin-bottom: 1rem;
        }

        .breadcrumbs-bar a {
            color: #64748b;
            text-decoration: none;
            font-size: 0.85rem;
            transition: color 0.2s;
        }

        .breadcrumbs-bar a:hover {
            color: var(--gold);
        }

        .breadcrumbs-bar span {
            color: var(--gold);
            font-size: 0.85rem;
            font-weight: 600;
        }
`;
      content = content.replace('.article-shell {', breadcrumbsCss + '        .article-shell {');
    }

    // Upgrade Schema to full @graph with Article, BreadcrumbList, and FAQPage
    const guide4Schema = `    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": "https://rrclawassociates.com/oci-card-indian-ancestry-assistance/#article",
          "headline": "OCI Through Indian Ancestry: How to Prove Your Indian-Origin Family Connection",
          "alternativeHeadline": "How to Prove Indian Ancestry for an OCI Card",
          "description": "Learn how to prove Indian ancestry for an OCI card through parents, grandparents, or great-grandparents. Archival research, missing birth records, and NABC.",
          "author": {
            "@type": "Organization",
            "name": "RRC Law Associates",
            "url": "https://rrclawassociates.com/"
          },
          "publisher": {
            "@type": "Organization",
            "name": "RRC Law Associates",
            "url": "https://rrclawassociates.com/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://rrclawassociates.com/assets/images/logo.png"
            }
          },
          "datePublished": "2026-10-13",
          "dateModified": "2026-10-26",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://rrclawassociates.com/oci-card-indian-ancestry-assistance/"
          },
          "image": "https://rrclawassociates.com/assets/images/oci-hero-bg.jpg"
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://rrclawassociates.com/oci-card-indian-ancestry-assistance/#breadcrumb",
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
              "name": "NRI Legal Services",
              "item": "https://rrclawassociates.com/nri-services"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "OCI Legal Guides",
              "item": "https://rrclawassociates.com/oci-legal-guides/"
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "OCI Through Indian Ancestry",
              "item": "https://rrclawassociates.com/oci-card-indian-ancestry-assistance/"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://rrclawassociates.com/oci-card-indian-ancestry-assistance/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Can a foreign citizen apply for an OCI card through Indian ancestry?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Foreign citizens whose parents, grandparents, or great-grandparents were citizens of India (or eligible to become citizens of India at the commencement of the Constitution) may qualify under Section 7A of the Citizenship Act, 1955, subject to official documentation and exclusions."
              }
            },
            {
              "@type": "Question",
              "name": "What if I do not have my grandfather's or great-grandfather's birth certificate?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "If a birth certificate was never registered or records were lost, applicants can seek a Non-Availability of Birth Certificate (NABC) from municipal or revenue authorities, corroborated by secondary ancestral records such as school leaving certificates, land deeds, or domicile certificates."
              }
            },
            {
              "@type": "Question",
              "name": "What is a Non-Availability of Birth Certificate (NABC)?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "An NABC is an official statement issued by the Registrar of Births and Deaths confirming that an individual's birth record was searched in the official archives and not found for the specified period and location."
              }
            },
            {
              "@type": "Question",
              "name": "Can RRC Law Associates assist clients who live outside India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. RRC Law Associates assists overseas clients worldwide with Indian ancestry documentation research, record retrieval across Tamil Nadu, and legal assessment for OCI applications."
              }
            }
          ]
        }
      ]
    }
    </script>`;

    content = content.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
      guide4Schema
    );

    // Also update alt text of hero visual
    content = content.replace(
      'alt="OCI Card &amp; Indian Ancestry Documentation Assistance"',
      'alt="OCI Through Indian Ancestry: How to Prove Your Indian-Origin Family Connection"'
    );
  }

  fs.writeFileSync(cfg.file, content, 'utf8');
  console.log(`Updated Guide ${cfg.num} (${cfg.file})`);
});
