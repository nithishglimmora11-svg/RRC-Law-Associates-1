const fs = require('fs');

const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wills, Probate &amp; Estate Lawyers in Tamil Nadu | RRC Law</title>
    <meta name="description" content="Expert legal assistance for Will drafting, probate petitions, succession certificates, and estate administration in Thanjavur, Chennai, and across Tamil Nadu.">
    <meta name="keywords" content="wills and probate lawyers tamil nadu, will drafting advocate thanjavur, probate of will chennai, succession certificate advocate trichy, estate administration lawyers tamil nadu, letters of administration madras high court, nri inheritance legal assistance">

    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://rrclawassociates.com/wills-probate-estate-administration">

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LegalService",
          "@id": "https://rrclawassociates.com/wills-probate-estate-administration#service",
          "name": "RRC Law Associates - Wills, Probate & Estate Administration",
          "url": "https://rrclawassociates.com/wills-probate-estate-administration",
          "logo": "https://rrclawassociates.com/assets/images/logo.png",
          "image": "https://rrclawassociates.com/assets/images/succession-graphic.png",
          "telephone": "+91-9751182452",
          "email": "dr.kumar@rrclawassociates.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "No 82/6B, Deen Complex, Mary's Corner, Parisutham Nagar",
            "addressLocality": "Thanjavur",
            "addressRegion": "Tamil Nadu",
            "postalCode": "613001",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 10.7870,
            "longitude": 79.1378
          },
          "areaServed": [
            { "@type": "City", "name": "Thanjavur" },
            { "@type": "City", "name": "Chennai" },
            { "@type": "City", "name": "Tiruchirappalli" },
            { "@type": "AdministrativeArea", "name": "Tamil Nadu" },
            { "@type": "Country", "name": "India" }
          ],
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "10:00",
            "closes": "22:00"
          },
          "priceRange": "$$",
          "description": "Comprehensive legal assistance for Will drafting, probate petitions, letters of administration, succession certificates, and inherited property administration across Tamil Nadu and for overseas NRIs/OCIs.",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Wills, Probate & Estate Legal Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Will Drafting, Codicils & SRO Registration"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Probate & Letters of Administration Court Petitions"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Succession Certificate Applications (Section 372)"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Post-Death Revenue Mutation & Patta Transfer"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "NRI & OCI Inherited Property Repatriation (FEMA)"
                }
              }
            ]
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://rrclawassociates.com/wills-probate-estate-administration#breadcrumb",
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
              "name": "Wills, Probate & Estate Administration",
              "item": "https://rrclawassociates.com/wills-probate-estate-administration"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://rrclawassociates.com/wills-probate-estate-administration#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is probate of a Will mandatory throughout Tamil Nadu?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Under Sections 57 and 213 of the Indian Succession Act, 1925, probate is mandatory for Wills executed by Hindus, Buddhists, Sikhs, or Jains within the ordinary original civil jurisdiction of the Madras High Court (Chennai municipal limits), or where immovable property situated within Chennai is bequeathed. Outside Chennai presidency limits (such as in Thanjavur, Trichy, Madurai, or Coimbatore), probate is generally not mandatory for Hindu wills under state law, but may become essential if the Will is contested, or if financial institutions and revenue registries require judicial validation."
              }
            },
            {
              "@type": "Question",
              "name": "What is the difference between a Legal Heir Certificate and a Succession Certificate?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A Legal Heir Certificate (Varisu Certificate) is an administrative document issued by the local Tahsildar to identify living relatives for immediate revenue mutations, family pensions, or utility transfers. In contrast, a Succession Certificate is a judicial order granted by a Civil Court under Section 372 of the Indian Succession Act, 1925, specifically authorizing legal heirs to claim movable assets, debts, bank balances, fixed deposits, and securities of a deceased person."
              }
            },
            {
              "@type": "Question",
              "name": "Can an NRI or OCI inherit property in Tamil Nadu without traveling to India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Non-Resident Indians (NRIs) and Overseas Citizens of India (OCIs) can manage inheritance, probate proceedings, and property mutation remotely by executing a Special Power of Attorney (PoA). The PoA must be signed and attested at the nearest Indian Embassy or Consulate abroad, sent to India, and duly adjudicated before the competent District Registrar in Tamil Nadu."
              }
            },
            {
              "@type": "Question",
              "name": "Can an OCI or NRI inherit agricultural land in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Under Section 6(5) of the Foreign Exchange Management Act (FEMA), NRIs and OCIs have general permission to inherit any immovable property in India, including agricultural land, plantation property, and farmhouses, from a person resident in India. However, if the NRI or OCI decides to sell the inherited agricultural property, it can only be sold or transferred to a resident citizen of India."
              }
            },
            {
              "@type": "Question",
              "name": "How is inherited property transferred in revenue records (Patta transfer) after death?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Upon the death of a property owner, legal heirs must submit an application for transfer of Patta (revenue mutation) before the jurisdictional Tahsildar or Zonal Deputy Tahsildar, supported by the death certificate, legal heir certificate or registered will, parent title deeds, and no-objection declarations from co-heirs. Once revenue inquiries are completed, the Patta is transferred into the names of the rightful heirs."
              }
            },
            {
              "@type": "Question",
              "name": "What legal remedy exists if legal heirs disagree on dividing ancestral property?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "If heirs agree on terms, the most effective solution is a registered Family Settlement Deed, which redistributes shares consensually and avoids court litigation. If there is deadlock, fraud, or hostile exclusion, an heir can file a Civil Partition Suit before the competent civil court to claim their legitimate coparcenary or legal share, coupled with an interim injunction to prevent alienation."
              }
            }
          ]
        }
      ]
    }
    </script>

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://rrclawassociates.com/wills-probate-estate-administration">
    <meta property="og:title" content="Wills, Probate &amp; Estate Lawyers in Tamil Nadu | RRC Law">
    <meta property="og:description" content="Expert legal assistance for Will drafting, probate petitions, succession certificates, and estate administration in Thanjavur, Chennai, and across Tamil Nadu.">
    <meta property="og:image" content="https://rrclawassociates.com/assets/images/succession-graphic.png">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Wills, Probate &amp; Estate Lawyers in Tamil Nadu | RRC Law">
    <meta name="twitter:description" content="Expert legal assistance for Will drafting, probate petitions, succession certificates, and estate administration in Thanjavur, Chennai, and across Tamil Nadu.">
    <meta name="twitter:image" content="https://rrclawassociates.com/assets/images/succession-graphic.png">

    <!-- Icons -->
    <link rel="icon" type="image/png" href="/assets/images/logo.png">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">

    <!-- Typography & Vendor CSS -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Existing Site Shared Stylesheets -->
    <link rel="stylesheet" href="/style2.css?v=20261008-1">
    <link rel="stylesheet" href="/style.css?v=20261008-1">
    <link rel="stylesheet" href="/topbar.css?v=20261008-1">

    <style>
        :root {
            --primary: #3c3819;
            --gold: #c9a24d;
            --gold-hover: #b38f40;
            --gold-light: #fdfaf3;
            --gold-border: rgba(201, 162, 77, 0.35);
            --cream: #f9f7f3;
            --white: #ffffff;
            --dark-navy: #0b1c2d;
            --navy-mid: #102a45;
            --navy-accent: #164e87;
            --text-heading: #0b1c2d;
            --text-body: #1e293b;
            --text-muted: #64748b;
        }

        html {
            scroll-behavior: smooth;
            scroll-padding-top: 140px;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: #fbfcfd;
            color: var(--text-body);
            font-size: 17px;
            line-height: 1.75;
            margin: 0;
            padding: 0;
        }

        /* Fixed Header Alignment */
        .header {
            position: fixed;
            top: 42px;
            left: 0;
            width: 100%;
            z-index: 1190;
            background: #000000 !important;
            padding: 5px 0;
            min-height: 80px;
            display: flex;
            align-items: center;
        }

        .logo-img {
            height: 60px;
            width: auto;
        }

        .nav-link-custom {
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 500;
            margin: 0 15px;
            transition: 0.3s;
            cursor: pointer;
        }

        .nav-link-custom:hover {
            color: var(--gold) !important;
        }

        .dropdown-menu {
            background-color: #000000 !important;
            border: 1px solid #c9a24d !important;
            margin-top: 10px !important;
        }

        .dropdown-item {
            color: #ffffff !important;
            padding: 10px 20px;
            font-size: 14px;
        }

        .dropdown-item:hover {
            background-color: #1a1a1a !important;
            color: var(--gold) !important;
        }

        @media (min-width: 992px) {
            .header .dropdown:hover > .dropdown-menu,
            .header .dropdown:focus-within > .dropdown-menu {
                display: block !important;
                margin-top: 0 !important;
            }
        }

        .btn-gold {
            background-color: var(--gold);
            color: #000000;
            font-weight: 700;
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.25s ease;
        }

        .btn-gold:hover {
            background-color: #b38f40;
            color: #000000;
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(201, 162, 77, 0.3);
        }

        /* Hero Section */
        .wills-hero-section {
            padding-top: 155px;
            padding-bottom: 70px;
            background: linear-gradient(135deg, #091726 0%, #0d2238 50%, #133352 100%);
            color: #ffffff;
            position: relative;
            overflow: hidden;
        }

        .wills-hero-section::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 45%;
            background: radial-gradient(circle at 75% 35%, rgba(201, 162, 77, 0.12) 0%, transparent 65%);
            pointer-events: none;
        }

        .breadcrumbs-bar {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 0.88rem;
            color: #94a3b8;
            margin-bottom: 20px;
        }

        .breadcrumbs-bar a {
            color: #cbd5e1;
            text-decoration: none;
            transition: color 0.2s;
        }

        .breadcrumbs-bar a:hover {
            color: var(--gold);
            text-decoration: underline;
        }

        .breadcrumbs-bar .sep {
            color: #64748b;
        }

        .breadcrumbs-bar .cur {
            color: #ffffff;
            font-weight: 500;
        }

        .hero-badge {
            display: inline-block;
            background: rgba(201, 162, 77, 0.15);
            border: 1px solid var(--gold);
            color: var(--gold);
            padding: 5px 14px;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            border-radius: 50px;
            margin-bottom: 16px;
        }

        .hero-h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(2.1rem, 3.2vw, 3.2rem);
            font-weight: 700;
            line-height: 1.25;
            color: #ffffff;
            margin-bottom: 18px;
        }

        .hero-lead {
            font-size: 1.12rem;
            line-height: 1.7;
            color: #e2e8f0;
            margin-bottom: 28px;
            max-width: 680px;
        }

        .hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
        }

        .btn-outline-gold {
            background: transparent;
            color: #ffffff;
            border: 1.5px solid var(--gold);
            padding: 12px 22px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.25s ease;
        }

        .btn-outline-gold:hover {
            background: rgba(201, 162, 77, 0.15);
            color: var(--gold);
            border-color: var(--gold);
        }

        /* 4 Highlights Bar */
        .highlights-strip {
            background: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            padding: 24px 0;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }

        .highlight-item {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 10px 14px;
        }

        .highlight-icon {
            width: 44px;
            height: 44px;
            background: var(--gold-light);
            border: 1px solid var(--gold-border);
            color: var(--gold);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            flex-shrink: 0;
        }

        .highlight-title {
            font-size: 0.98rem;
            font-weight: 700;
            color: var(--dark-navy);
            margin-bottom: 3px;
        }

        .highlight-desc {
            font-size: 0.82rem;
            color: var(--text-muted);
            margin: 0;
            line-height: 1.4;
        }

        /* Content Sections */
        .content-section {
            padding: 65px 0;
        }

        .content-section.bg-cream {
            background-color: var(--cream);
        }

        .section-eyebrow {
            color: var(--gold);
            font-weight: 700;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 8px;
            display: block;
        }

        .section-heading {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(1.8rem, 2.5vw, 2.4rem);
            color: var(--dark-navy);
            font-weight: 700;
            line-height: 1.3;
            margin-bottom: 20px;
        }

        .section-lead {
            font-size: 1.08rem;
            color: var(--text-body);
            line-height: 1.8;
            margin-bottom: 24px;
        }

        .legal-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 30px;
            height: 100%;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .legal-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
            border-color: var(--gold-border);
        }

        .legal-card-icon {
            font-size: 2rem;
            color: var(--gold);
            margin-bottom: 16px;
        }

        .legal-card-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 1.3rem;
            color: var(--dark-navy);
            font-weight: 700;
            margin-bottom: 12px;
        }

        /* Comparative Table */
        .table-custom-wrapper {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
            margin: 28px 0;
        }

        .table-custom {
            margin: 0;
            width: 100%;
            border-collapse: collapse;
        }

        .table-custom th {
            background: #0b1c2d;
            color: #ffffff;
            padding: 16px 20px;
            font-weight: 600;
            font-size: 0.95rem;
            border-bottom: 2px solid var(--gold);
        }

        .table-custom td {
            padding: 15px 20px;
            font-size: 0.94rem;
            border-bottom: 1px solid #edf2f7;
            vertical-align: top;
        }

        .table-custom tr:last-child td {
            border-bottom: none;
        }

        .table-custom tr:nth-child(even) td {
            background-color: #f8fafc;
        }

        /* Process Steps */
        .process-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .process-step-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            position: relative;
        }

        .step-num {
            position: absolute;
            top: 14px;
            right: 18px;
            font-size: 2rem;
            font-weight: 800;
            color: rgba(201, 162, 77, 0.25);
            font-family: 'Playfair Display', serif;
        }

        .step-title {
            font-size: 1.12rem;
            font-weight: 700;
            color: var(--dark-navy);
            margin-bottom: 8px;
        }

        /* Notice / Callout */
        .alert-callout {
            background: #fdfaf3;
            border-left: 4px solid var(--gold);
            padding: 18px 22px;
            border-radius: 0 8px 8px 0;
            margin: 24px 0;
            font-size: 0.98rem;
            line-height: 1.65;
        }

        /* Checklist */
        .checklist-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 16px;
            margin: 24px 0;
        }

        .check-item {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 14px 18px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .check-item i {
            color: var(--gold);
            font-size: 1.2rem;
            margin-top: 2px;
            flex-shrink: 0;
        }

        /* Accordion */
        .faq-accordion .accordion-item {
            border: 1px solid #e2e8f0;
            border-radius: 10px !important;
            margin-bottom: 14px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .faq-accordion .accordion-button {
            background-color: #ffffff;
            color: var(--dark-navy);
            font-weight: 600;
            font-size: 1.05rem;
            padding: 18px 22px;
        }

        .faq-accordion .accordion-button:not(.collapsed) {
            background-color: #fdfaf3;
            color: var(--dark-navy);
            box-shadow: none;
            border-bottom: 1px solid #e2e8f0;
        }

        .faq-accordion .accordion-body {
            padding: 20px 24px;
            font-size: 0.98rem;
            line-height: 1.75;
            color: #334155;
            background-color: #ffffff;
        }

        /* CTA Banner */
        .cta-banner {
            background: linear-gradient(135deg, #091726 0%, #0d2238 60%, #164e87 100%);
            color: #ffffff;
            border-radius: 18px;
            padding: 50px 40px;
            text-align: center;
            box-shadow: 0 15px 35px rgba(11, 28, 45, 0.2);
            position: relative;
            overflow: hidden;
        }

        .cta-banner::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gold);
        }

        /* Footer */
        .site-footer {
            background: #000000;
            color: #ffffff;
            padding: 60px 0 30px;
            font-size: 0.95rem;
        }

        .site-footer a {
            color: #cbd5e1;
            text-decoration: none;
            transition: color 0.2s;
        }

        .site-footer a:hover {
            color: var(--gold);
        }

        .site-footer h5 {
            color: #ffffff;
            font-family: 'Playfair Display', serif;
            font-size: 1.15rem;
            margin-bottom: 20px;
            position: relative;
            padding-bottom: 8px;
        }

        .site-footer h5::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 32px;
            height: 2px;
            background: var(--gold);
        }

        /* Mobile Menu */
        .mobile-menu-drawer {
            position: fixed;
            top: 0;
            right: -100%;
            width: 300px;
            max-width: 85%;
            height: 100vh;
            background: #000000;
            z-index: 2000;
            transition: right 0.3s ease;
            padding: 24px;
            overflow-y: auto;
        }

        .mobile-menu-drawer.active {
            right: 0;
        }

        .m-sub-item {
            color: #cbd5e1 !important;
            display: block;
            padding: 8px 12px;
            font-size: 0.92rem;
            text-decoration: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .m-sub-item:hover {
            color: var(--gold) !important;
        }
    </style>
</head>
<body>

    <!-- TOPBAR -->
    <div class="rrc-topbar">
        <div class="rrc-topbar-container">
            <div class="rrc-topbar-left">
                <a href="tel:+919751182452">
                    <i class="bi bi-telephone-fill"></i>
                    +91 97511 82452
                </a>
                <span class="rrc-topbar-divider"></span>
                <a href="mailto:dr.kumar@rrclawassociates.com">
                    <i class="bi bi-envelope-fill"></i>
                    dr.kumar@rrclawassociates.com
                </a>
            </div>
            <div class="rrc-topbar-right">
                <span>
                    <i class="bi bi-clock"></i>
                    Mon – Sat: 10:00 AM – 10:00 PM
                </span>
            </div>
        </div>
    </div>

    <!-- MAIN HEADER -->
    <header class="header">
        <div class="container d-flex align-items-center justify-content-between">
            <a href="/">
                <img src="/assets/images/rrclogo.png" alt="RRC Law Associates" class="logo-img" width="666" height="182">
            </a>

            <!-- Desktop Nav -->
            <nav class="d-none d-lg-flex align-items-center ms-auto">
                <a href="/" class="nav-link-custom text-uppercase">Home</a>

                <!-- NRI Services Dropdown -->
                <div class="dropdown">
                    <a class="nav-link-custom dropdown-toggle text-uppercase" href="/nri-services" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        NRI Services
                    </a>
                    <ul class="dropdown-menu shadow-lg">
                        <li><a class="dropdown-item text-uppercase" href="/oci-card-assistance">OCI Card &amp; Ancestry Assistance</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/nri-property-disputes">Property Dispute</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/nri-power-of-attorney">Power of Attorney</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/nri-criminal-case">Criminal Cases</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/nri-family-matrimonial">Family &amp; Matrimonial</a></li>
                    </ul>
                </div>

                <!-- Core Practice Areas Dropdown -->
                <div class="dropdown">
                    <a class="nav-link-custom dropdown-toggle text-uppercase" href="/core-practice-areas" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Core Practice Areas
                    </a>
                    <ul class="dropdown-menu shadow-lg">
                        <li><a class="dropdown-item text-uppercase" href="/family-law">Family Law Workspace</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/intellectual-property">Intellectual Property Advisory</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/employment-law">Labour &amp; Employment Protection</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/white-collar-crime">White Collar Crime Defense</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/property-law">Due Diligence Frameworks</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/cyber-law">Cyber Law Desk</a></li>
                        <li><a class="dropdown-item text-uppercase" href="/litigation-dispute-resolution">Litigation &amp; Dispute Resolution</a></li>
                    </ul>
                </div>

                <a href="/partners.html" class="nav-link-custom text-uppercase">Partners</a>
                <a href="/lawfirm-blog.html" class="nav-link-custom text-uppercase">Blog</a>
                <a href="/#contact" class="nav-link-custom text-uppercase">Contact</a>
                <a href="/booking.html" class="btn btn-gold ms-3">Book Consultation</a>
            </nav>

            <!-- Mobile Menu Toggle Button -->
            <button class="btn btn-dark d-lg-none" type="button" id="mobileMenuToggle" aria-label="Toggle navigation">
                <i class="fas fa-bars text-white fs-4"></i>
            </button>
        </div>
    </header>

    <!-- MOBILE MENU DRAWER -->
    <div class="mobile-menu-drawer" id="mobileMenuDrawer">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <img src="/assets/images/logo.png" alt="RRC Law" width="50" height="50">
            <button class="btn text-white fs-4 p-0" id="mobileMenuClose" aria-label="Close menu">&times;</button>
        </div>
        <div class="mobile-nav-links">
            <a href="/" class="m-sub-item">Home</a>
            <div class="text-gold fw-bold px-2 pt-2 small text-uppercase">NRI Services</div>
            <a href="/oci-card-assistance" class="m-sub-item">OCI Card &amp; Ancestry Assistance</a>
            <a href="/wills-probate-estate-administration" class="m-sub-item text-gold fw-semibold">Wills, Probate &amp; Estate Administration</a>
            <a href="/nri-property-disputes" class="m-sub-item">Property Dispute</a>
            <a href="/nri-power-of-attorney" class="m-sub-item">Power of Attorney</a>
            <a href="/nri-criminal-case" class="m-sub-item">Criminal Cases</a>
            <a href="/nri-family-matrimonial" class="m-sub-item">Family &amp; Matrimonial</a>

            <div class="text-gold fw-bold px-2 pt-3 small text-uppercase">Core Practice Areas</div>
            <a href="/family-law" class="m-sub-item">Family Law Workspace</a>
            <a href="/property-law" class="m-sub-item">Due Diligence Frameworks</a>
            <a href="/litigation-dispute-resolution" class="m-sub-item">Litigation &amp; Dispute Resolution</a>
            <a href="/partners.html" class="m-sub-item mt-2">Partners</a>
            <a href="/lawfirm-blog.html" class="m-sub-item">Blog</a>
            <a href="/booking.html" class="btn btn-gold w-100 mt-4">Book Consultation</a>
        </div>
    </div>

    <main id="main-content">

        <!-- =========================================================
             HERO SECTION & BREADCRUMBS
             ========================================================== -->
        <section class="wills-hero-section">
            <div class="container">
                <nav class="breadcrumbs-bar" aria-label="Breadcrumb">
                    <a href="/">Home</a>
                    <span class="sep">&gt;</span>
                    <a href="/nri-services">NRI Services</a>
                    <span class="sep">&gt;</span>
                    <span class="cur">Wills, Probate &amp; Estate Administration</span>
                </nav>

                <div class="row align-items-center">
                    <div class="col-lg-8">
                        <span class="hero-badge">Testamentary Law &amp; Estate Succession Desk</span>
                        <h1 class="hero-h1">Wills, Probate &amp; Estate Administration in Tamil Nadu</h1>
                        <p class="hero-lead">
                            Comprehensive legal guidance for Will drafting, probate petitions before the Madras High Court and District Courts, succession certificates, estate administration, and cross-border inherited property transfers for residents, NRIs, and OCIs.
                        </p>
                        <div class="hero-actions">
                            <a href="/booking.html" class="btn btn-gold">
                                Schedule a Consultation <i class="bi bi-arrow-right"></i>
                            </a>
                            <a href="https://wa.me/919751182452?text=Hello%20RRC%20Law%20Associates,%20I%20would%20like%20to%20consult%20regarding%20a%20Will,%20Probate,%20or%20Estate%20Succession%20matter." class="btn-outline-gold" target="_blank" rel="noopener">
                                <i class="bi bi-whatsapp"></i> Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================================
             KEY PILLARS STRIP
             ========================================================== -->
        <section class="highlights-strip">
            <div class="container">
                <div class="row g-3">
                    <div class="col-lg-3 col-sm-6">
                        <div class="highlight-item">
                            <div class="highlight-icon"><i class="bi bi-file-earmark-ruled"></i></div>
                            <div>
                                <div class="highlight-title">Will Drafting &amp; SRO</div>
                                <p class="highlight-desc">Custom wills, codicils, and Sub-Registrar registration</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="highlight-item">
                            <div class="highlight-icon"><i class="bi bi-building-check"></i></div>
                            <div>
                                <div class="highlight-title">Probate of Wills</div>
                                <p class="highlight-desc">Madras High Court &amp; District Court petitions</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="highlight-item">
                            <div class="highlight-icon"><i class="bi bi-award"></i></div>
                            <div>
                                <div class="highlight-title">Succession Certificates</div>
                                <p class="highlight-desc">Section 372 petitions for bank deposits &amp; shares</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="highlight-item">
                            <div class="highlight-icon"><i class="bi bi-globe2"></i></div>
                            <div>
                                <div class="highlight-title">NRI Estate Desk</div>
                                <p class="highlight-desc">Zero-travel PoA, Patta mutation &amp; FEMA 15CA/15CB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================================
             SECTION 1: WILL DRAFTING & TESTAMENTARY PLANNING
             ========================================================== -->
        <section class="content-section" id="will-drafting">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-7">
                        <span class="section-eyebrow">Preventative Succession Planning</span>
                        <h2 class="section-heading">Custom Will Drafting &amp; Testamentary Protection</h2>
                        <p class="section-lead">
                            A carefully structured Will is the primary instrument to safeguard your generational wealth, real estate holdings, and financial investments, ensuring your assets pass to your intended beneficiaries without protracted civil litigation.
                        </p>
                        <p>
                            Under the <strong>Indian Succession Act, 1925</strong>, a valid Will requires a testator of sound disposing mind executing the instrument in the presence of at least two independent attesting witnesses. At RRC Law Associates, we guide clients through comprehensive testamentary structuring:
                        </p>
                        <ul class="mb-4">
                            <li class="mb-2"><strong>Custom Will Drafting &amp; Codicils:</strong> Explicit allocation of self-acquired movable and immovable properties, testamentary guardianship for minor children, creation of life estates, and residual beneficiary clauses.</li>
                            <li class="mb-2"><strong>Preventing Common Will Contests:</strong> Drafting proactive provisions that address potential claims of undue influence, coercion, or lack of capacity, backed by contemporaneous medical fitness certifications when necessary.</li>
                            <li class="mb-2"><strong>Sub-Registrar Office (SRO) Registration:</strong> While will registration is not strictly mandatory under Indian law, formally registering the instrument before the jurisdictional Sub-Registrar in Tamil Nadu establishes an undeniable public record and creates a strong legal presumption of genuine execution under Section 51 of the Registration Act, 1908.</li>
                        </ul>
                        <div class="alert-callout">
                            <strong>Did you know?</strong> An unregistered Will is legally valid in India if properly attested, but registering the Will before the Sub-Registrar significantly elevates its evidential standing if disgruntled legal heirs challenge it in civil court.
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <div class="p-3 bg-white border rounded-4 shadow-sm">
                            <img src="/assets/images/deed-drafting.png" alt="Will Drafting and Registration in Tamil Nadu" class="img-fluid rounded-3 mb-3" width="1408" height="768" loading="lazy">
                            <h4 class="h5 fw-bold text-dark mb-2">Key Testamentary Instruments</h4>
                            <p class="small text-muted mb-0">We assist in preparing Single Wills, Joint Testamentary Instruments, Codicils (Will amendments), Family Settlement Deeds, and Living Testamentary structures.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================================
             SECTION 2: PROBATE & LETTERS OF ADMINISTRATION
             ========================================================== -->
        <section class="content-section bg-cream" id="probate">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-5 order-lg-1 order-2">
                        <div class="p-3 bg-white border rounded-4 shadow-sm">
                            <img src="/assets/images/succession-graphic.png" alt="Probate and Letters of Administration Court Petitions" class="img-fluid rounded-3 mb-3" width="1408" height="768" loading="lazy">
                            <h4 class="h5 fw-bold text-dark mb-2">Court Jurisdiction in Tamil Nadu</h4>
                            <p class="small text-muted mb-0">Original Side of the Madras High Court exercises jurisdiction for properties situated in Chennai, while Principal District Courts have testamentary jurisdiction across Thanjavur, Trichy, Madurai, and other districts.</p>
                        </div>
                    </div>
                    <div class="col-lg-7 order-lg-2 order-1">
                        <span class="section-eyebrow">Judicial Validation of Wills</span>
                        <h2 class="section-heading">Probate Petitions &amp; Letters of Administration</h2>
                        <p class="section-lead">
                            A <strong>Probate</strong> is a formal decree granted under the seal of a competent civil court certifying the validity of a Will and confirming the executor's legal authority to administer the testator's estate.
                        </p>
                        <h4 class="h6 fw-bold text-dark mb-2">When is Probate Mandatory in Tamil Nadu?</h4>
                        <p>
                            Under Sections 57 and 213 of the Indian Succession Act, 1925, probate is mandatory for Wills executed by Hindus, Buddhists, Sikhs, or Jains within the historical Presidency Town limits of the <strong>Madras High Court (Chennai)</strong>, or where immovable property situated within Chennai municipal limits is bequeathed under the Will.
                        </p>
                        <p>
                            For properties situated in <strong>Thanjavur, Tiruchirappalli, Kumbakonam, Madurai, Coimbatore, and other districts outside Chennai</strong>, probate is generally not mandatory under state law. However, obtaining probate or court-issued Letters of Administration is highly recommended or required when:
                        </p>
                        <ul>
                            <li class="mb-2">Other legal heirs threaten to challenge the Will on grounds of forgery, fraud, or mental incapacity.</li>
                            <li class="mb-2">Banks, asset management companies, or cooperative housing societies require a court order before releasing high-value assets.</li>
                            <li class="mb-2">No executor was named in the Will (requiring a petition for <strong>Letters of Administration with Will Annexed</strong>).</li>
                            <li class="mb-2">The deceased passed away without leaving a Will (requiring <strong>Letters of Administration upon Intestacy</strong>).</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================================
             SECTION 3: SUCCESSION CERTIFICATES VS LEGAL HEIR
             ========================================================== -->
        <section class="content-section" id="succession-certificate">
            <div class="container">
                <div class="text-center max-w-750 mx-auto mb-5">
                    <span class="section-eyebrow">Understanding Legal Instruments</span>
                    <h2 class="section-heading">Succession Certificate vs. Legal Heir Certificate</h2>
                    <p class="section-lead">
                        Many families and NRI heirs encounter roadblocks when financial institutions reject revenue certificates. Understanding the statutory distinction between a Tahsildar-issued certificate and a judicial decree is vital.
                    </p>
                </div>

                <div class="table-custom-wrapper">
                    <table class="table-custom" aria-label="Comparison between Succession Certificate and Legal Heir Certificate">
                        <thead>
                            <tr>
                                <th>Criteria</th>
                                <th>Legal Heir Certificate (Varisu)</th>
                                <th>Succession Certificate</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Issuing Authority</strong></td>
                                <td>Local Tahsildar / Revenue Department</td>
                                <td>Competent Civil Court (District Judge or Senior Civil Judge)</td>
                            </tr>
                            <tr>
                                <td><strong>Governing Law</strong></td>
                                <td>State Revenue Guidelines / Tamil Nadu e-Sevai</td>
                                <td>Section 372, Indian Succession Act, 1925</td>
                            </tr>
                            <tr>
                                <td><strong>Scope of Assets</strong></td>
                                <td>Limited: Basic revenue mutation, family pension, service dues, electricity transfer.</td>
                                <td><strong>Comprehensive Movable Assets:</strong> Bank accounts, fixed deposits, mutual funds, shares, and debts.</td>
                            </tr>
                            <tr>
                                <td><strong>Conclusive Legal Title</strong></td>
                                <td>No. It only establishes family relationship; does not confer conclusive title to disputed assets.</td>
                                <td><strong>Yes.</strong> Protects third parties (banks/companies) paying debts to the certificate holder.</td>
                            </tr>
                            <tr>
                                <td><strong>Court Fee &amp; Timeline</strong></td>
                                <td>Nominal revenue fee; issued in 15–30 days.</td>
                                <td>Ad valorem court fee under TN Court Fees Act; 4–8 months with mandatory newspaper citation.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="alert-callout mt-4">
                    <strong>Legal Advisory:</strong> If a bank refuses to release a deceased parent's fixed deposit, locker, or shareholding exceeding statutory bank indemnity limits, filing a Section 372 Succession Certificate petition before the local civil court is the definitive statutory remedy.
                </div>
            </div>
        </section>

        <!-- =========================================================
             SECTION 4: ESTATE ADMINISTRATION & PROPERTY MUTATION
             ========================================================== -->
        <section class="content-section bg-cream" id="estate-administration">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-7">
                        <span class="section-eyebrow">Post-Demise Asset Transmission</span>
                        <h2 class="section-heading">Estate Administration &amp; Revenue Record Mutation</h2>
                        <p class="section-lead">
                            Acquiring legal rights under a Will or through intestate inheritance is only the first step. To exercise full ownership rights and marketability, the property title must be formally mutated in local government land registries.
                        </p>
                        <p>
                            RRC Law Associates provides end-to-end estate administration services across Thanjavur and all Tamil Nadu districts:
                        </p>
                        <div class="row g-3 mt-2">
                            <div class="col-md-6">
                                <div class="legal-card p-4">
                                    <h4 class="h6 fw-bold text-dark mb-2"><i class="bi bi-geo-alt-fill text-gold me-2"></i> Patta Transfer (Tamil Nilam)</h4>
                                    <p class="small text-muted mb-0">Filing revenue mutation applications before the Tahsildar to transfer agricultural and town survey land pattas into the names of the rightful legal heirs.</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="legal-card p-4">
                                    <h4 class="h6 fw-bold text-dark mb-2"><i class="bi bi-buildings-fill text-gold me-2"></i> Municipal Tax Assessment</h4>
                                    <p class="small text-muted mb-0">Updating property tax assessments, water supply records, and electricity meter connections with municipal corporations and town panchayats.</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="legal-card p-4">
                                    <h4 class="h6 fw-bold text-dark mb-2"><i class="bi bi-file-earmark-check-fill text-gold me-2"></i> Family Settlement Deeds</h4>
                                    <p class="small text-muted mb-0">Drafting and registering consensual Family Settlement Deeds under the Registration Act to allocate shares amicably and prevent future partition lawsuits.</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="legal-card p-4">
                                    <h4 class="h6 fw-bold text-dark mb-2"><i class="bi bi-shield-lock-fill text-gold me-2"></i> Encumbrance Verification</h4>
                                    <p class="small text-muted mb-0">Conducting 30-year Encumbrance Certificate (EC) audits to ensure inherited titles are free from undisclosed mortgages, court attachments, or liens.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <img src="/assets/images/revenue-mutation.png" alt="Revenue Mutation and Patta Transfer in Tamil Nadu" class="img-fluid rounded-4 shadow-sm" width="1408" height="768" loading="lazy">
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================================
             SECTION 5: NRI & OCI INHERITANCE DESK
             ========================================================== -->
        <section class="content-section" id="nri-inheritance">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-5">
                        <img src="/assets/images/poa-adjudication.png" alt="NRI Power of Attorney and FEMA Compliance" class="img-fluid rounded-4 shadow-sm" width="1408" height="768" loading="lazy">
                    </div>
                    <div class="col-lg-7">
                        <span class="section-eyebrow">Cross-Border Representation</span>
                        <h2 class="section-heading">NRI &amp; OCI Inheritance Legal Assistance</h2>
                        <p class="section-lead">
                            Managing inherited estates in India from the USA, UK, Singapore, Malaysia, Canada, or Australia involves navigating complex cross-border documentation, Power of Attorney attestation, and strict foreign exchange regulations.
                        </p>
                        <p>
                            Our dedicated NRI Private Client Desk provides seamless, zero-travel estate resolution:
                        </p>
                        <ul>
                            <li class="mb-3"><strong>Zero-Travel Power of Attorney (PoA):</strong> Drafting tailored Special Powers of Attorney for overseas heirs. We guide you through consular attestation at the Indian Embassy or Consulate abroad and manage mandatory adjudication before the District Registrar in Tamil Nadu.</li>
                            <li class="mb-3"><strong>FEMA Section 6(5) Compliance:</strong> Advising foreign citizens and OCIs on general permission rules governing inherited immovable assets, including the specific statutory restrictions governing the sale of inherited agricultural land.</li>
                            <li class="mb-3"><strong>Fund Repatriation (Form 15CA &amp; 15CB):</strong> Assisting overseas heirs in remitting inherited funds abroad up to USD 1,000,000 per financial year in full compliance with RBI regulations and tax certification requirements.</li>
                        </ul>
                        <div class="mt-4">
                            <a href="/nri-property-disputes" class="btn btn-outline-secondary me-2">Explore NRI Property Dispute Desk</a>
                            <a href="/nri-power-of-attorney" class="btn btn-outline-secondary">Learn About NRI Power of Attorney</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================================
             SECTION 6: CONTESTED WILLS & HEIR DISPUTES
             ========================================================== -->
        <section class="content-section bg-cream" id="contested-wills">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-7">
                        <span class="section-eyebrow">Dispute Resolution &amp; Defense</span>
                        <h2 class="section-heading">Contested Wills &amp; Legal Heir Litigation</h2>
                        <p class="section-lead">
                            When inheritance disputes arise—whether due to suspicious deathbed wills, unauthorized property transfers by co-heirs, or exclusion of rightful legal heirs—decisive legal intervention before civil courts is essential.
                        </p>
                        <h4 class="h6 fw-bold text-dark mb-2">Grounds for Challenging a Will in India:</h4>
                        <ul class="mb-4">
                            <li><strong>Lack of Testamentary Capacity:</strong> The testator was physically or mentally incapable of understanding the disposition due to illness, dementia, or coercion.</li>
                            <li><strong>Suspicious Circumstances:</strong> Unnatural disposition excluding natural heirs, propounder playing an active part in execution, or signature discrepancies.</li>
                            <li><strong>Fraud, Forgery or Impersonation:</strong> Fabricated signatures or fraudulent execution before unregistered witnesses.</li>
                        </ul>
                        <p>
                            We represent clients in lodging <strong>Caveat Petitions</strong> under Section 148A CPC to prevent ex-parte probate orders, instituting <strong>Testamentary Civil Suits</strong>, and defending coparcenary partition rights under the <strong>Hindu Succession (Amendment) Act, 2005</strong>.
                        </p>
                        <a href="/blog-brother-claim-ancestral-property-long-possession.html" class="text-decoration-underline fw-semibold text-dark">
                            Read our legal guide: Can a Brother Claim Ownership of Ancestral Property After Long Possession? &rarr;
                        </a>
                    </div>
                    <div class="col-lg-5">
                        <img src="/assets/images/settlement-banner.png" alt="Resolving Contested Inheritance and Family Settlements" class="img-fluid rounded-4 shadow-sm" width="1408" height="768" loading="lazy">
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================================
             SECTION 7: STEP-BY-STEP ENGAGEMENT WORKFLOW
             ========================================================== -->
        <section class="content-section" id="process">
            <div class="container">
                <div class="text-center max-w-750 mx-auto mb-5">
                    <span class="section-eyebrow">Our Professional Methodology</span>
                    <h2 class="section-heading">Step-by-Step Estate Resolution Process</h2>
                    <p class="section-lead">A structured, transparent legal approach designed to protect family harmony and establish unassailable legal title.</p>
                </div>

                <div class="process-grid">
                    <div class="process-step-card">
                        <span class="step-num">01</span>
                        <h4 class="step-title">Initial Document Review</h4>
                        <p class="small text-muted mb-0">We inspect available title deeds, wills, encumbrance records, and death certificates to map legal heirs and identify statutory gaps.</p>
                    </div>
                    <div class="process-step-card">
                        <span class="step-num">02</span>
                        <h4 class="step-title">Strategic Roadmap</h4>
                        <p class="small text-muted mb-0">We identify whether probate, letters of administration, succession certificates, or consensual family settlement deeds represent the optimal path.</p>
                    </div>
                    <div class="process-step-card">
                        <span class="step-num">03</span>
                        <h4 class="step-title">Court / SRO Petitions</h4>
                        <p class="small text-muted mb-0">Our advocates prepare, file, and represent your case before competent civil courts or oversee registration at the Sub-Registrar Office.</p>
                    </div>
                    <div class="process-step-card">
                        <span class="step-num">04</span>
                        <h4 class="step-title">Revenue Mutation</h4>
                        <p class="small text-muted mb-0">We liaise with revenue authorities to execute Patta transfers, municipal tax updates, and coordinate cross-border fund remittances.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================================
             SECTION 8: DOCUMENT CHECKLIST
             ========================================================== -->
        <section class="content-section bg-cream" id="checklist">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-12">
                        <span class="section-eyebrow">Preparation Checklist</span>
                        <h2 class="section-heading">Documents Required for Estate Administration</h2>
                        <p class="section-lead">While specific documentation depends on whether succession is testamentary (with a Will) or intestate (without a Will), the following primary documents are typically required:</p>

                        <div class="checklist-grid">
                            <div class="check-item">
                                <i class="bi bi-check-circle-fill"></i>
                                <div>
                                    <strong>Original Death Certificate:</strong> Issued by the Municipal Corporation, Town Panchayat, or Registrar of Births and Deaths.
                                </div>
                            </div>
                            <div class="check-item">
                                <i class="bi bi-check-circle-fill"></i>
                                <div>
                                    <strong>Original Will &amp; Codicils:</strong> Original signed and attested testamentary instrument (if available).
                                </div>
                            </div>
                            <div class="check-item">
                                <i class="bi bi-check-circle-fill"></i>
                                <div>
                                    <strong>Parent Title Deeds:</strong> Registered Sale Deeds, Partition Deeds, Settlement Deeds, or Gift Deeds in the deceased's name.
                                </div>
                            </div>
                            <div class="check-item">
                                <i class="bi bi-check-circle-fill"></i>
                                <div>
                                    <strong>Revenue Records (Patta / Chitta):</strong> Current extract of Patta and Adangal establishing revenue standing.
                                </div>
                            </div>
                            <div class="check-item">
                                <i class="bi bi-check-circle-fill"></i>
                                <div>
                                    <strong>Legal Heir Certificate:</strong> Tahsildar-issued certificate or genealogical family tree affidavit.
                                </div>
                            </div>
                            <div class="check-item">
                                <i class="bi bi-check-circle-fill"></i>
                                <div>
                                    <strong>Movable Asset Schedules:</strong> Passbooks, fixed deposit receipts, demat account statements, and share certificates.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- =========================================================
             SECTION 9: FREQUENTLY ASKED QUESTIONS
             ========================================================== -->
        <section class="content-section" id="faq">
            <div class="container">
                <div class="text-center max-w-750 mx-auto mb-5">
                    <span class="section-eyebrow">Client Inquiries</span>
                    <h2 class="section-heading">Frequently Asked Legal Questions</h2>
                    <p class="section-lead">Clear, straightforward answers to key questions concerning Wills, Probate, and Estate Administration in Tamil Nadu.</p>
                </div>

                <div class="accordion faq-accordion max-w-850 mx-auto" id="willsFaqAccordion">

                    <div class="accordion-item">
                        <h3 class="accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                1. Is probate of a Will mandatory throughout Tamil Nadu?
                            </button>
                        </h3>
                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#willsFaqAccordion">
                            <div class="accordion-body">
                                Under Sections 57 and 213 of the Indian Succession Act, 1925, probate is mandatory for Wills executed by Hindus, Buddhists, Sikhs, or Jains within the ordinary original civil jurisdiction of the <strong>Madras High Court (Chennai municipal limits)</strong>, or where immovable property situated within Chennai is bequeathed under the Will. Outside Chennai presidency limits (such as in Thanjavur, Trichy, Madurai, or Coimbatore), probate is generally <strong>not mandatory</strong> for Hindu wills under state law, but may become essential if the Will is contested, or if financial institutions and revenue registries require judicial validation.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h3 class="accordion-header" id="headingTwo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                2. What is the difference between a Legal Heir Certificate and a Succession Certificate?
                            </button>
                        </h3>
                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#willsFaqAccordion">
                            <div class="accordion-body">
                                A <strong>Legal Heir Certificate</strong> (Varisu Certificate) is an administrative document issued by the local Tahsildar to identify living relatives for immediate revenue mutations, family pensions, or utility transfers. In contrast, a <strong>Succession Certificate</strong> is a judicial order granted by a Civil Court under Section 372 of the Indian Succession Act, 1925, specifically authorizing legal heirs to claim movable assets, debts, bank balances, fixed deposits, and securities of a deceased person.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h3 class="accordion-header" id="headingThree">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                3. Can an NRI or OCI inherit property in Tamil Nadu without traveling to India?
                            </button>
                        </h3>
                        <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#willsFaqAccordion">
                            <div class="accordion-body">
                                Yes. Non-Resident Indians (NRIs) and Overseas Citizens of India (OCIs) can manage inheritance, probate proceedings, and property mutation remotely by executing a Special Power of Attorney (PoA). The PoA must be signed and attested at the nearest Indian Embassy or Consulate abroad, sent to India, and duly adjudicated before the competent District Registrar in Tamil Nadu.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h3 class="accordion-header" id="headingFour">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                4. Can an OCI or NRI inherit agricultural land in India?
                            </button>
                        </h3>
                        <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#willsFaqAccordion">
                            <div class="accordion-body">
                                Yes. Under Section 6(5) of the Foreign Exchange Management Act (FEMA), NRIs and OCIs have general permission to inherit any immovable property in India, including agricultural land, plantation property, and farmhouses, from a person resident in India. However, if the NRI or OCI decides to sell the inherited agricultural property, it can only be sold or transferred to a resident citizen of India.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h3 class="accordion-header" id="headingFive">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                5. How is inherited property transferred in revenue records (Patta transfer) after death?
                            </button>
                        </h3>
                        <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#willsFaqAccordion">
                            <div class="accordion-body">
                                Upon the death of a property owner, legal heirs must submit an application for transfer of Patta (revenue mutation) before the jurisdictional Tahsildar or Zonal Deputy Tahsildar, supported by the death certificate, legal heir certificate or registered will, parent title deeds, and no-objection declarations from co-heirs. Once revenue inquiries are completed, the Patta is transferred into the names of the rightful heirs.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h3 class="accordion-header" id="headingSix">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                6. What legal remedy exists if legal heirs disagree on dividing ancestral property?
                            </button>
                        </h3>
                        <div id="collapseSix" class="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#willsFaqAccordion">
                            <div class="accordion-body">
                                If heirs agree on terms, the most effective solution is a registered Family Settlement Deed, which redistributes shares consensually and avoids court litigation. If there is deadlock, fraud, or hostile exclusion, an heir can file a Civil Partition Suit before the competent civil court to claim their legitimate coparcenary or legal share, coupled with an interim injunction to prevent alienation.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- =========================================================
             STATEWIDE SERVICE CALLOUT & FINAL CTA
             ========================================================== -->
        <section class="content-section bg-cream">
            <div class="container">
                <div class="cta-banner">
                    <span class="hero-badge mb-3">CONFIDENTIAL LEGAL CONSULTATION</span>
                    <h3 class="h2 fw-bold text-white mb-3">Protect Your Family's Generational Legacy</h3>
                    <p class="max-w-680 mx-auto text-light mb-4">
                        Whether you are planning your estate with a registered Will, navigating probate court proceedings, petitioning for a succession certificate, or resolving an inherited property dispute from overseas, our advocates are prepared to assist.
                    </p>
                    <div class="d-flex justify-content-center gap-3 flex-wrap">
                        <a href="/booking.html" class="btn btn-gold py-3 px-4">
                            Book a Consultation Online <i class="bi bi-arrow-right"></i>
                        </a>
                        <a href="tel:+919751182452" class="btn btn-outline-gold py-3 px-4">
                            <i class="bi bi-telephone-fill"></i> Call +91 97511 82452
                        </a>
                    </div>
                    <p class="small text-white-50 mt-4 mb-0">Headquartered in Mary's Corner, Thanjavur. Serving clients across Cauvery Delta districts, Chennai, and overseas diaspora.</p>
                </div>
            </div>
        </section>

    </main>

    <!-- =========================================================
         SITE FOOTER
         ========================================================== -->
    <footer class="site-footer">
        <div class="container">
            <div class="row g-4 mb-5">
                <div class="col-lg-4 col-md-6">
                    <img src="/assets/images/logo.png" alt="RRC Law Logo" class="mb-3" width="70" height="70">
                    <h5 class="text-white">RRC Law Associates</h5>
                    <p class="text-muted small">
                        Premier full-service law firm based in Thanjavur, Tamil Nadu. Providing dedicated legal representation in NRI property disputes, real estate due diligence, estate planning, wills and probate, criminal defense, and family law.
                    </p>
                    <div class="text-muted small">
                        <i class="bi bi-geo-alt-fill text-gold me-2"></i> Mary's Corner, Parisutham Nagar, Thanjavur, Tamil Nadu 613001
                    </div>
                </div>

                <div class="col-lg-2 col-md-6">
                    <h5>NRI Services</h5>
                    <ul class="list-unstyled small">
                        <li class="mb-2"><a href="/oci-card-assistance">OCI Assistance</a></li>
                        <li class="mb-2"><a href="/wills-probate-estate-administration" class="text-gold">Wills &amp; Probate</a></li>
                        <li class="mb-2"><a href="/nri-property-disputes">Property Disputes</a></li>
                        <li class="mb-2"><a href="/nri-power-of-attorney">Power of Attorney</a></li>
                        <li class="mb-2"><a href="/nri-criminal-case">Criminal Cases</a></li>
                        <li class="mb-2"><a href="/nri-family-matrimonial">Family &amp; Matrimonial</a></li>
                    </ul>
                </div>

                <div class="col-lg-3 col-md-6">
                    <h5>Practice Areas</h5>
                    <ul class="list-unstyled small">
                        <li class="mb-2"><a href="/family-law">Family Law Workspace</a></li>
                        <li class="mb-2"><a href="/property-law">Due Diligence Frameworks</a></li>
                        <li class="mb-2"><a href="/litigation-dispute-resolution">Litigation &amp; Disputes</a></li>
                        <li class="mb-2"><a href="/cyber-law">Cyber Law Desk</a></li>
                        <li class="mb-2"><a href="/white-collar-crime">White Collar Crimes</a></li>
                        <li class="mb-2"><a href="/employment-law">Employment Relations</a></li>
                    </ul>
                </div>

                <div class="col-lg-3 col-md-6">
                    <h5>Contact Us</h5>
                    <p class="text-muted small mb-2"><i class="bi bi-telephone-fill text-gold me-2"></i> +91 97511 82452</p>
                    <p class="text-muted small mb-2"><i class="bi bi-envelope-fill text-gold me-2"></i> dr.kumar@rrclawassociates.com</p>
                    <p class="text-muted small"><i class="bi bi-clock-fill text-gold me-2"></i> Mon – Sat: 10:00 AM – 10:00 PM</p>
                    <a href="/booking.html" class="btn btn-gold btn-sm mt-2">Book Consultation</a>
                </div>
            </div>

            <div class="border-top border-secondary pt-4 text-center small text-muted">
                &copy; 2026 RRC Law Associates. All rights reserved. | <a href="/privacy-policy" class="text-muted">Privacy Policy</a> | <a href="/disclaimer" class="text-muted">Legal Disclaimer</a>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Simple mobile menu toggle script
        const toggleBtn = document.getElementById('mobileMenuToggle');
        const closeBtn = document.getElementById('mobileMenuClose');
        const drawer = document.getElementById('mobileMenuDrawer');

        if (toggleBtn && drawer) {
            toggleBtn.addEventListener('click', () => {
                drawer.classList.add('active');
            });
        }
        if (closeBtn && drawer) {
            closeBtn.addEventListener('click', () => {
                drawer.classList.remove('active');
            });
        }
    </script>
</body>
</html>`;

fs.writeFileSync('wills-probate-estate-administration.html', pageHtml, 'utf8');
console.log('Successfully created wills-probate-estate-administration.html');
