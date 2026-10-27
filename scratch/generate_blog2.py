# generator for oci-vs-nri-vs-indian-citizen.html
import html

page_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCI vs NRI vs Indian Citizen: Key Legal Differences | RRC Law Associates</title>
    <meta name="description" content="Understand the difference between OCI cardholders, NRIs and Indian citizens, including citizenship, travel, voting, property and tax considerations.">
    <meta name="keywords" content="OCI vs NRI, OCI vs Indian citizen, NRI vs OCI cardholder, OCI legal status, Indian citizenship for overseas Indians">
    <link rel="canonical" href="https://rrclawassociates.com/oci-vs-nri-vs-indian-citizen/">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://rrclawassociates.com/oci-vs-nri-vs-indian-citizen/">
    <meta property="og:title" content="OCI vs NRI vs Indian Citizen: Key Legal Differences | RRC Law Associates">
    <meta property="og:description" content="Understand the difference between OCI cardholders, NRIs and Indian citizens, including citizenship, travel, voting, property and tax considerations.">
    <meta property="og:image" content="https://rrclawassociates.com/assets/images/nri-law-1.jpg">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://rrclawassociates.com/oci-vs-nri-vs-indian-citizen/">
    <meta property="twitter:title" content="OCI vs NRI vs Indian Citizen: Key Legal Differences | RRC Law Associates">
    <meta property="twitter:description" content="Understand the difference between OCI cardholders, NRIs and Indian citizens, including citizenship, travel, voting, property and tax considerations.">
    <meta property="twitter:image" content="https://rrclawassociates.com/assets/images/nri-law-1.jpg">

    <link rel="icon" type="image/png" href="assets/images/logo.png">

    <!-- CSS Dependencies -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css?v=20261008-1">
    <link rel="stylesheet" href="style2.css?v=20261008-1">
    <link rel="stylesheet" href="topbar.css?v=20261008-1">

    <style>
        :root {
            --primary: #0b1c2d;
            --secondary: #1a365d;
            --gold: #c9a24d;
            --gold-hover: #b38f40;
            --gold-light: rgba(201, 162, 77, 0.12);
            --gold-border: rgba(201, 162, 77, 0.35);
            --cream: #fbf9f4;
            --text-heading: #0b1c2d;
            --text-body: #333333;
            --text-muted: #64748b;
            --border-light: #e2e8f0;
            --bg-card: #ffffff;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: var(--text-body);
            background-color: #ffffff;
            line-height: 1.75;
            overflow-x: hidden;
            font-size: 17.5px;
        }

        /* Topbar & Header Navigation (Preserved) */
        .rrc-topbar {
            background-color: #0b1c2d;
            color: #ffffff;
            font-size: 0.8rem;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1200;
            height: 42px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .rrc-topbar-container {
            max-width: 1280px;
            width: 100%;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .rrc-topbar-left, .rrc-topbar-right {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .rrc-topbar a {
            color: #ffffff;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: color 0.2s ease;
        }

        .rrc-topbar a:hover {
            color: var(--gold);
        }

        .rrc-topbar-divider {
            width: 1px;
            height: 12px;
            background-color: rgba(255, 255, 255, 0.2);
            display: inline-block;
        }

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
            box-shadow: none;
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

        /* Hero Section */
        .article-hero {
            position: relative;
            z-index: 1;
            padding-top: 155px;
            padding-bottom: 50px;
            background-color: var(--cream);
            border-bottom: 1px solid rgba(60, 56, 25, 0.08);
        }

        .breadcrumbs-bar {
            margin-bottom: 1rem;
        }

        .breadcrumbs-bar a {
            color: var(--text-muted);
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

        .meta-text {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 700;
            color: var(--gold);
            display: inline-block;
        }

        .article-title {
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            color: #000000;
            font-size: clamp(2.1rem, 2.8vw, 3.2rem);
            line-height: 1.25;
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
        }

        .article-meta-row {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            color: #64748b;
            font-size: 0.9rem;
            flex-wrap: wrap;
            margin-top: 1rem;
        }

        /* Article Visual */
        .article-visual {
            margin: 0 0 2.5rem;
            border-radius: 14px;
            overflow: hidden;
            background: #f4f1ea;
            border: 1px solid rgba(60, 56, 25, 0.08);
            box-shadow: 0 12px 30px rgba(12, 17, 24, 0.06);
        }

        .article-visual img {
            display: block;
            width: 100%;
            height: auto;
            max-height: 480px;
            object-fit: cover;
        }

        /* Reading Area Layout */
        .article-shell {
            max-width: 1280px;
        }

        .content-body {
            max-width: 100%;
        }

        .content-body h2 {
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            margin-top: 52px;
            margin-bottom: 22px;
            color: #0b1c2d;
            position: relative;
            padding-bottom: 12px;
            font-size: clamp(1.85rem, 2.2vw, 2.25rem);
            line-height: 1.3;
            scroll-margin-top: 140px;
        }

        .content-body h2::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 48px;
            height: 3px;
            background-color: var(--gold);
            border-radius: 2px;
        }

        .content-body h3 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.25rem, 1.45vw, 1.45rem);
            line-height: 1.4;
            font-weight: 700;
            margin-top: 34px;
            margin-bottom: 14px;
            color: var(--primary);
            scroll-margin-top: 140px;
        }

        .content-body p {
            margin-top: 0;
            margin-bottom: 20px;
            color: #333333;
            font-size: 17.5px;
            line-height: 1.78;
        }

        .content-body ul,
        .content-body ol {
            margin-top: 8px;
            margin-bottom: 24px;
            padding-left: 26px;
        }

        .content-body li {
            margin-bottom: 10px;
            color: #333333;
            font-size: 17.5px;
            line-height: 1.75;
            padding-left: 4px;
        }

        .content-body li::marker {
            color: var(--gold);
        }

        /* Callouts */
        .legal-callout {
            border-left: 4px solid var(--gold);
            background-color: var(--cream);
            padding: 22px 26px;
            border-radius: 0 10px 10px 0;
            margin: 28px 0;
            border-top: 1px solid rgba(201, 162, 77, 0.15);
            border-right: 1px solid rgba(201, 162, 77, 0.15);
            border-bottom: 1px solid rgba(201, 162, 77, 0.15);
        }

        .legal-callout p {
            margin-bottom: 0;
            color: #333333;
            font-size: 17px;
            line-height: 1.75;
        }

        /* Comparison Table Styling */
        .table-responsive-wrapper {
            overflow-x: auto;
            margin: 28px 0 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 16px rgba(11, 28, 45, 0.04);
            background: #ffffff;
            -webkit-overflow-scrolling: touch;
        }

        .comparison-table {
            width: 100%;
            margin-bottom: 0;
            border-collapse: collapse;
            font-size: 16px;
            min-width: 720px;
        }

        .comparison-table th {
            background-color: var(--primary);
            color: #ffffff;
            padding: 16px 18px;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            font-size: 1.05rem;
            text-align: left;
            border-right: 1px solid rgba(255, 255, 255, 0.12);
            white-space: nowrap;
        }

        .comparison-table th:last-child {
            border-right: none;
        }

        .comparison-table td {
            padding: 14px 18px;
            border-bottom: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
            vertical-align: top;
            line-height: 1.6;
            color: #333333;
        }

        .comparison-table td:first-child {
            font-weight: 700;
            color: var(--primary);
            background-color: #fdfaf5;
            width: 22%;
            min-width: 160px;
        }

        .comparison-table td:last-child {
            border-right: none;
        }

        .comparison-table tr:nth-child(even) td:not(:first-child) {
            background-color: #f8fafc;
        }

        .comparison-table tr:hover td {
            background-color: #f1f5f9;
        }

        /* Misunderstanding Card Styling */
        .misunderstanding-card {
            background: #ffffff;
            border: 1px solid #e8edf2;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 22px;
            box-shadow: 0 4px 14px rgba(11, 28, 45, 0.03);
            border-top: 3px solid #dc3545;
        }

        .misunderstanding-card h3 {
            margin-top: 0;
            margin-bottom: 12px;
            color: #991b1b;
            font-size: 1.22rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .misunderstanding-card p {
            font-size: 17px;
            margin-bottom: 0;
            color: #27272a;
            line-height: 1.7;
        }

        /* Assistance Service Cards Grid */
        .service-assist-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 26px 0;
        }

        .service-assist-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .service-assist-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(11, 28, 45, 0.05);
            border-color: var(--gold);
        }

        .service-assist-card h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 1.15rem;
            color: var(--primary);
        }

        .service-assist-card p {
            margin-bottom: 0;
            font-size: 16.5px;
            line-height: 1.65;
            color: #4b5563;
        }

        /* FAQ Accordion Styling */
        .article-faq {
            margin: 28px 0;
        }

        .article-faq .accordion-item {
            border: none;
            border-bottom: 1px solid rgba(60, 56, 25, 0.12);
            background: transparent;
        }

        .article-faq .accordion-button {
            background: transparent !important;
            color: var(--primary);
            font-family: 'Playfair Display', serif;
            font-weight: 600;
            font-size: 1.12rem;
            line-height: 1.45;
            padding: 18px 0;
            box-shadow: none !important;
        }

        .article-faq .accordion-button:not(.collapsed) {
            color: var(--gold) !important;
        }

        .article-faq .accordion-body {
            padding: 0 0 18px 0;
            color: #444444;
            font-size: 17px;
            line-height: 1.75;
        }

        .article-faq .accordion-body p {
            margin-bottom: 0;
            font-size: 17px;
            line-height: 1.75;
            color: #444444;
        }

        /* Official Resources Box */
        .official-resources-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 24px;
            margin: 28px 0;
        }

        .official-resources-box h3 {
            margin-top: 0;
            margin-bottom: 12px;
            color: var(--primary);
        }

        .official-resource-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }

        .official-resource-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .official-resource-item a {
            color: #1d4ed8;
            font-weight: 600;
            text-decoration: underline;
            word-break: break-all;
            transition: color 0.2s;
        }

        .official-resource-item a:hover {
            color: var(--gold);
        }

        /* Enquiry CTA Block */
        .enquiry-cta-block {
            background: linear-gradient(135deg, #0b1c2d 0%, #1a365d 100%);
            color: #ffffff;
            border-radius: 14px;
            padding: 36px 32px;
            margin: 36px 0;
        }

        .enquiry-cta-block h2 {
            color: #ffffff !important;
            margin-top: 0 !important;
            margin-bottom: 18px !important;
        }

        .enquiry-cta-block h2::after {
            display: none;
        }

        .enquiry-cta-block p {
            color: #e2e8f0 !important;
            font-size: 17.5px;
        }

        .enquiry-checklist {
            list-style: none;
            padding-left: 0;
            margin: 20px 0;
        }

        .enquiry-checklist li {
            position: relative;
            padding-left: 28px;
            margin-bottom: 10px;
            color: #f1f5f9 !important;
            font-size: 17px;
        }

        .enquiry-checklist li::before {
            content: "\\F26E";
            font-family: "bootstrap-icons";
            position: absolute;
            left: 0;
            top: 2px;
            color: var(--gold);
            font-weight: 700;
        }

        /* Buttons */
        .btn-gold {
            background-color: var(--gold);
            color: #000000 !important;
            font-weight: 700;
            padding: 12px 22px;
            border-radius: 10px;
            border: none;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.25s ease;
        }

        .btn-gold:hover {
            background-color: var(--gold-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(201, 162, 77, 0.3);
        }

        .btn-outline-gold {
            background: transparent;
            color: var(--gold) !important;
            border: 2px solid var(--gold);
            font-weight: 700;
            padding: 10px 20px;
            border-radius: 10px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.25s ease;
        }

        .btn-outline-gold:hover {
            background: var(--gold);
            color: #000000 !important;
            transform: translateY(-2px);
        }

        /* Sticky Sidebar */
        .sidebar-sticky-wrapper {
            position: sticky;
            top: 135px;
        }

        .sidebar-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 24px;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
            margin-bottom: 24px;
        }

        .sidebar-card-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 16px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--gold-light);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .toc-list {
            list-style: none;
            padding-left: 0;
            margin-bottom: 0;
        }

        .toc-list li {
            margin-bottom: 8px;
            padding-left: 0;
        }

        .toc-list a {
            color: #475569;
            text-decoration: none;
            font-size: 0.92rem;
            line-height: 1.4;
            display: block;
            padding: 5px 8px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }

        .toc-list a:hover {
            color: var(--gold);
            background-color: #fdfaf5;
            padding-left: 12px;
        }

        .sidebar-feature-box {
            background: #f8fafc;
            border-radius: 10px;
            padding: 14px;
            margin-bottom: 14px;
        }

        .sidebar-feature-box .feature-title {
            font-weight: 700;
            font-size: 0.95rem;
            color: var(--primary);
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .sidebar-feature-box p {
            margin-bottom: 0;
            font-size: 0.88rem;
            line-height: 1.5;
            color: #64748b;
        }

        /* Footer */
        .footer {
            background: linear-gradient(135deg, #081521, #0b1c2d);
            color: white;
            padding: 80px 0 30px;
            margin-top: 60px;
        }

        .footer a {
            color: #cbd5e1;
            text-decoration: none;
            transition: color 0.2s;
        }

        .footer a:hover {
            color: var(--gold);
        }

        .mobile-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 350px;
            height: 100vh;
            background: #000000;
            z-index: 2000;
            transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 30px 20px;
            overflow-y: auto;
        }

        .mobile-menu.active {
            right: 0;
        }

        .close-menu {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            position: absolute;
            top: 20px;
            right: 20px;
            cursor: pointer;
        }

        .m-link {
            display: block;
            color: white;
            padding: 12px 0;
            text-decoration: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 1.05rem;
        }

        .m-submenu {
            display: none;
            padding-left: 15px;
            background: #111111;
        }

        .m-sub-item {
            display: block;
            color: #cbd5e1;
            padding: 10px 0;
            text-decoration: none;
            font-size: 0.95rem;
        }

        .m-sub-item:hover {
            color: var(--gold);
        }

        /* Floating WhatsApp Button */
        .floating-whatsapp {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #25d366;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            transition: all 0.3s;
            text-decoration: none;
        }

        .floating-whatsapp:hover {
            transform: scale(1.1);
            color: white;
        }

        /* Responsive Breakpoints */
        @media (max-width: 991px) {
            .article-hero {
                padding-top: 135px;
                padding-bottom: 40px;
            }

            .service-assist-grid {
                grid-template-columns: 1fr;
            }

            .sidebar-sticky-wrapper {
                position: static;
                margin-top: 40px;
            }
        }

        @media (max-width: 575px) {
            body {
                font-size: 16.5px;
            }

            .article-hero {
                padding-top: 125px;
                padding-bottom: 30px;
            }

            .article-title {
                font-size: 1.85rem;
            }

            .content-body p,
            .content-body li {
                font-size: 16.5px;
                line-height: 1.7;
            }

            .content-body h2 {
                font-size: 1.65rem;
                margin-top: 40px;
            }

            .content-body h3 {
                font-size: 1.25rem;
            }

            .legal-callout, .misunderstanding-card, .enquiry-cta-block {
                padding: 18px 20px;
            }

            .comparison-table {
                font-size: 14.5px;
            }

            .comparison-table th, .comparison-table td {
                padding: 12px 14px;
            }

            .floating-whatsapp {
                bottom: 20px;
                right: 20px;
                width: 52px;
                height: 52px;
                font-size: 26px;
            }
        }
    </style>

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": "https://rrclawassociates.com/oci-vs-nri-vs-indian-citizen/#article",
          "headline": "OCI vs NRI vs Indian Citizen: What Is the Difference?",
          "alternativeHeadline": "OCI vs NRI vs Indian Citizen: Key Legal Differences",
          "description": "Understand the difference between OCI cardholders, NRIs and Indian citizens, including citizenship, travel, voting, property and tax considerations.",
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
          "dateModified": "2026-10-13",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://rrclawassociates.com/oci-vs-nri-vs-indian-citizen/"
          },
          "image": "https://rrclawassociates.com/assets/images/nri-law-1.jpg"
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://rrclawassociates.com/oci-vs-nri-vs-indian-citizen/#breadcrumb",
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
              "item": "https://rrclawassociates.com/nri-services.html"
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
              "name": "OCI vs NRI vs Indian Citizen",
              "item": "https://rrclawassociates.com/oci-vs-nri-vs-indian-citizen/"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://rrclawassociates.com/oci-vs-nri-vs-indian-citizen/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is an NRI an Indian citizen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "In general usage, an NRI is an Indian citizen residing outside India. However, the precise definition and legal consequences depend on the law or regulatory framework involved."
              }
            },
            {
              "@type": "Question",
              "name": "Is an OCI cardholder an Indian citizen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. An OCI cardholder is a foreign national who holds OCI registration under the applicable legal framework."
              }
            },
            {
              "@type": "Question",
              "name": "Can an NRI apply for an OCI card?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "An Indian citizen living abroad ordinarily does not need OCI registration. OCI is intended for qualifying foreign nationals."
              }
            },
            {
              "@type": "Question",
              "name": "Can an OCI cardholder hold an Indian passport?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "OCI registration does not entitle a foreign citizen to an ordinary Indian passport. Indian passports are issued to Indian citizens, subject to applicable requirements."
              }
            },
            {
              "@type": "Question",
              "name": "Can an OCI cardholder vote in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. OCI status does not confer the right to vote in Indian elections."
              }
            },
            {
              "@type": "Question",
              "name": "Can an OCI cardholder buy residential property in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Certain transactions may be permitted, subject to the applicable laws and restrictions. The proposed transaction should be assessed before proceeding."
              }
            },
            {
              "@type": "Question",
              "name": "Is an OCI cardholder automatically an NRI for tax purposes?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. Tax residence is determined under the applicable tax law and the person's circumstances, not solely by the possession of an OCI card."
              }
            },
            {
              "@type": "Question",
              "name": "Can a former Indian citizen apply for OCI after acquiring foreign citizenship?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Potentially, yes, if the person satisfies the applicable eligibility requirements and is not subject to a relevant exclusion."
              }
            },
            {
              "@type": "Question",
              "name": "Can an OCI cardholder later become an Indian citizen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "An OCI cardholder may apply under the applicable citizenship provisions if the statutory conditions are satisfied. Registration as an OCI cardholder does not automatically confer citizenship."
              }
            }
          ]
        }
      ]
    }
    </script>
</head>
<body>
    <!-- Topbar (Preserved) -->
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
                <span class="rrc-topbar-divider"></span>
                <a href="https://www.linkedin.com/company/rrclawassociates/" aria-label="LinkedIn" target="_blank" rel="noopener">
                    <i class="bi bi-linkedin"></i>
                </a>
            </div>
        </div>
    </div>

    <!-- Header Navigation (Preserved) -->
    <header class="header">
        <nav class="container d-flex justify-content-between align-items-center">
            <div class="logo">
                <a href="index.html">
                    <img src="assets/images/logo.png" alt="RRC Law Associates" class="logo-img">
                </a>
            </div>

            <div class="nav-links d-none d-lg-flex align-items-center">
                <a class="nav-link-custom" href="index.html">Home</a>
                <div class="dropdown">
                    <a class="nav-link-custom dropdown-toggle" href="nri-services.html" id="nriDropdown" role="button" aria-expanded="false">
                        NRI Legal Services
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="nriDropdown">
                        <li><a class="dropdown-item" href="oci-card-assistance.html">OCI Card &amp; Ancestry Assistance</a></li>
                        <li><a class="dropdown-item" href="nri-property-disputes.html">Property Dispute</a></li>
                        <li><a class="dropdown-item" href="nri-power-of-attorney.html">Power of Attorney</a></li>
                        <li><a class="dropdown-item" href="nri-criminal-case.html">Criminal Case</a></li>
                        <li><a class="dropdown-item" href="nri-family-matrimonial.html">Family &amp; Matrimonial</a></li>
                    </ul>
                </div>
                <div class="dropdown">
                    <a class="nav-link-custom dropdown-toggle" href="core-practice-areas.html" id="practiceDropdown" role="button" aria-expanded="false">
                        Core Practice Areas
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="practiceDropdown">
                        <li><a class="dropdown-item" href="family-law.html">Family, Succession &amp; Private Client Practice</a></li>
                        <li><a class="dropdown-item" href="intellectual-property.html">Intellectual Property &amp; Innovation Protection</a></li>
                        <li><a class="dropdown-item" href="employment-law.html">Labour, Employment &amp; Industrial Relations</a></li>
                        <li><a class="dropdown-item" href="white-collar-crime.html">White Collar Crimes &amp; Financial Investigations</a></li>
                        <li><a class="dropdown-item" href="property-law.html">Documentation, Registration &amp; Due Diligence</a></li>
                        <li><a class="dropdown-item" href="cyber-law.html">Cyber Law, Data Protection &amp; Digital Evidence</a></li>
                        <li><a class="dropdown-item" href="litigation-dispute-resolution.html">Litigation &amp; Dispute Resolution</a></li>
                    </ul>
                </div>
                <a class="nav-link-custom" href="partners.html">Partners</a>
                <a class="nav-link-custom" href="lawfirm-blog.html">Blog</a>
                <a class="nav-link-custom" href="index.html#contact">Contact</a>
            </div>

            <div class="d-flex align-items-center gap-3">
                <div class="cta d-none d-sm-block">
                    <a href="./booking.html" class="btn btn-gold">Book Consultation</a>
                </div>
                <button class="btn text-white d-lg-none fs-3 p-0" id="menuToggle" aria-label="Toggle navigation">
                    <i class="fa fa-bars"></i>
                </button>
            </div>
        </nav>
    </header>

    <!-- Mobile Drawer Menu (Preserved) -->
    <div class="mobile-menu" id="mobileMenu">
        <button class="close-menu" id="closeMenu" aria-label="Close navigation">✕</button>
        <div class="mt-5">
            <a href="index.html" class="m-link">Home</a>
            <div class="m-dropdown">
                <a class="m-link m-trigger" href="nri-services.html">NRI Services <i class="fa fa-chevron-down ms-2"></i></a>
                <div class="m-submenu" id="mPracticeMenu">
                    <a class="m-sub-item" href="oci-card-assistance.html">OCI Card &amp; Ancestry Assistance</a>
                    <a class="m-sub-item" href="nri-property-disputes.html">Property Dispute</a>
                    <a class="m-sub-item" href="nri-power-of-attorney.html">Power of Attorney</a>
                    <a class="m-sub-item" href="nri-criminal-case.html">Criminal Case</a>
                    <a class="m-sub-item" href="nri-family-matrimonial.html">Family &amp; Matrimonial</a>
                </div>
            </div>
            <div class="m-dropdown">
                <a class="m-link m-trigger" href="core-practice-areas.html">Core Practice Areas <i class="fa fa-chevron-down ms-2"></i></a>
                <div class="m-submenu" id="mPracticeMenu2">
                    <a class="m-sub-item" href="family-law.html">Family, Succession &amp; Private Client Practice</a>
                    <a class="m-sub-item" href="intellectual-property.html">Intellectual Property &amp; Innovation Protection</a>
                    <a class="m-sub-item" href="employment-law.html">Labour, Employment &amp; Industrial Relations</a>
                    <a class="m-sub-item" href="white-collar-crime.html">White Collar Crimes &amp; Financial Investigations</a>
                    <a class="m-sub-item" href="property-law.html">Documentation, Registration &amp; Due Diligence</a>
                    <a class="m-sub-item" href="cyber-law.html">Cyber Law, Data Protection &amp; Digital Evidence</a>
                    <a class="m-sub-item" href="litigation-dispute-resolution.html">Litigation &amp; Dispute Resolution</a>
                </div>
            </div>
            <a href="partners.html" class="m-link">Partners</a>
            <a href="lawfirm-blog.html" class="m-link">Blog</a>
            <a href="index.html#contact">Contact</a>
            <div class="mt-4">
                <a href="./booking.html" class="btn btn-gold w-100 py-3 text-center">Book Consultation</a>
            </div>
        </div>
    </div>

    <!-- Hero Section -->
    <section class="article-hero">
        <div class="container">
            <div class="row justify-content-center text-center">
                <div class="col-lg-10">
                    <div class="breadcrumbs-bar">
                        <a href="index.html">Home</a> &nbsp;/&nbsp; 
                        <a href="nri-services.html">NRI Legal Services</a> &nbsp;/&nbsp; 
                        <a href="oci-legal-guides.html">OCI Legal Guides</a> &nbsp;/&nbsp; 
                        <span>Guide 2</span>
                    </div>
                    <span class="meta-text">OCI Legal Guides &bull; Article 2</span>
                    <h1 class="article-title mt-3 mb-4">OCI vs NRI vs Indian Citizen: What Is the Difference?</h1>
                    <div class="article-meta-row">
                        <span><i class="far fa-calendar-alt me-2"></i>Published: October 2026</span>
                        <span><i class="fas fa-gavel me-2"></i>Jurisdiction: India</span>
                        <span><i class="bi bi-clock-history me-2"></i>12 Min Read</span>
                        <span><i class="bi bi-shield-check me-2"></i>Comparative Legal Guide</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Main Content Area -->
    <main class="container article-shell my-5">
        <div class="row g-5">
            <!-- Left Main Column (Article Body) -->
            <article class="col-lg-8 content-body">
                <!-- Featured Image -->
                <figure class="article-visual">
                    <img src="assets/images/nri-law-1.jpg" alt="OCI vs NRI vs Indian Citizen: What Is the Difference?" loading="eager" fetchpriority="high">
                </figure>

                <!-- Introduction Section -->
                <div class="article-intro-block">
                    <p>People living outside India often use the terms NRI, OCI and Indian citizen interchangeably. Although these categories may overlap in everyday conversation, they have different legal meanings.</p>
                    
                    <p>An Indian citizen living in Australia may be an NRI for certain purposes. A former Indian citizen who has acquired Australian citizenship may qualify for Overseas Citizen of India (OCI) registration. An Indian citizen residing in India remains an Indian citizen, although their residence may affect their status under particular tax or regulatory rules.</p>
                    
                    <p>Understanding these distinctions is important when dealing with travel, citizenship, employment, property, inheritance and financial matters involving India.</p>
                    
                    <p>RRC Law Associates assists overseas clients with OCI documentation, Indian ancestry research and related Indian legal matters.</p>
                    
                    <p>This guide explains the principal differences between an OCI cardholder, an NRI and an Indian citizen, and identifies circumstances in which a more detailed legal assessment may be necessary.</p>
                </div>

                <!-- Section 1 -->
                <section id="section-1">
                    <h2>1. What Is an Indian Citizen?</h2>
                    <p>An Indian citizen is a person who holds Indian citizenship under the applicable provisions of Indian law.</p>
                    <p>Citizenship may arise through different legal routes, including birth, descent, registration, naturalisation or other provisions applicable to the person's circumstances.</p>
                    <p>Indian citizenship is a legal status. It is not determined simply by whether a person lives in India or abroad.</p>

                    <div id="indian-citizens-overseas">
                        <h3>Indian citizens living overseas</h3>
                        <p>An Indian citizen who resides outside India may be described as an Indian living abroad. Depending on the applicable definition and purpose, that person may also qualify as a Non-Resident Indian.</p>
                        <p>However, living overseas does not, by itself, terminate Indian citizenship.</p>
                        <p>An Indian citizen who intends to acquire the citizenship of another country must consider the applicable Indian citizenship law. India does not generally permit voluntary simultaneous Indian citizenship and foreign citizenship.</p>
                        <p>The consequences depend on the person's circumstances and the relevant legal provisions.</p>
                    </div>

                    <div id="principal-characteristics">
                        <h3>Principal characteristics of Indian citizenship</h3>
                        <p>Indian citizens generally have rights that are not conferred by OCI registration, including:</p>
                        <ul>
                            <li>The right to hold an Indian passport, subject to the applicable passport requirements.</li>
                            <li>The right to vote if the relevant electoral requirements are satisfied.</li>
                            <li>Eligibility to hold specified constitutional and public offices, subject to the applicable conditions.</li>
                            <li>The rights and obligations attached to Indian citizenship under the Constitution and relevant laws.</li>
                        </ul>
                        <p>The precise scope of a right may depend on additional legal requirements.</p>
                    </div>
                </section>

                <!-- Section 2 -->
                <section id="section-2">
                    <h2>2. What Is an NRI?</h2>
                    <p>NRI stands for Non-Resident Indian.</p>
                    <p>In general usage, the term refers to an Indian citizen who resides outside India. However, the precise definition and consequences of non-residence depend on the law or regulatory framework in which the term is used.</p>
                    <p>For example, the definition of a person resident outside India under foreign-exchange law is not necessarily identical to the test for residential status under Indian income-tax law.</p>
                    <p>This distinction is important.</p>

                    <div id="nri-foreign-citizenship">
                        <h3>NRI status does not mean foreign citizenship</h3>
                        <p>An NRI may continue to hold Indian citizenship and an Indian passport.</p>
                        <p>An NRI may live in another country for employment, education, business or family reasons without automatically losing Indian citizenship.</p>
                        <p>The person's tax residence and regulatory status must be assessed separately under the applicable law.</p>
                    </div>

                    <div id="every-citizen-nri">
                        <h3>Is every Indian citizen living abroad an NRI?</h3>
                        <p>Not necessarily for every legal purpose.</p>
                        <p>The applicable definition may depend on the particular statute, regulation or administrative context.</p>
                        <p>A person should not assume that a definition used for banking or foreign-exchange purposes automatically determines the person's tax status.</p>
                    </div>
                </section>

                <!-- Section 3 -->
                <section id="section-3">
                    <h2>3. What Is an OCI Cardholder?</h2>
                    <p>OCI stands for Overseas Citizen of India.</p>
                    <p>The OCI scheme is governed principally by the Citizenship Act, 1955, including Sections 7A and 7B, together with the applicable rules and government notifications.</p>
                    <p>OCI registration is available to qualifying foreign nationals who satisfy the relevant eligibility requirements.</p>
                    <p>An OCI cardholder is a foreign citizen. OCI registration does not confer Indian citizenship.</p>
                    <p>The scheme provides specified privileges, including multiple-entry, lifelong visa privileges for visiting India, subject to the applicable law and conditions.</p>

                    <div id="who-may-qualify">
                        <h3>Who may qualify for OCI registration?</h3>
                        <p>Depending on the statutory conditions, qualifying categories may include:</p>
                        <ul>
                            <li>Certain former Indian citizens.</li>
                            <li>Certain persons connected with territories that became part of India after 15 August 1947.</li>
                            <li>Qualifying children, grandchildren and great-grandchildren of persons within the relevant statutory categories.</li>
                            <li>Certain eligible minor children.</li>
                            <li>Certain foreign spouses of Indian citizens or registered OCI cardholders.</li>
                        </ul>
                        <p>Eligibility is subject to statutory conditions and exclusions.</p>
                        <p>An Indian family connection does not automatically establish eligibility in every case.</p>
                    </div>

                    <div id="dual-citizenship">
                        <h3>Does OCI mean dual citizenship?</h3>
                        <p>No.</p>
                        <p>OCI registration is not the same as Indian citizenship, and an OCI cardholder remains a foreign national.</p>
                        <p>A person who has acquired foreign citizenship cannot assume that an OCI card restores Indian citizenship or entitles the person to an Indian passport.</p>
                    </div>
                </section>

                <!-- Section 4 -->
                <section id="section-4">
                    <h2>4. OCI vs NRI vs Indian Citizen: Comparison Table</h2>
                    
                    <div class="table-responsive-wrapper">
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Issue</th>
                                    <th>Indian citizen</th>
                                    <th>NRI</th>
                                    <th>OCI cardholder</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Basic legal position</td>
                                    <td>Indian citizen</td>
                                    <td>Generally an Indian citizen residing abroad; exact definition depends on the relevant law</td>
                                    <td>Foreign citizen registered under the OCI scheme</td>
                                </tr>
                                <tr>
                                    <td>Citizenship</td>
                                    <td>Indian</td>
                                    <td>Generally Indian, when used in the usual citizenship context</td>
                                    <td>Foreign citizenship</td>
                                </tr>
                                <tr>
                                    <td>Indian passport</td>
                                    <td>Eligible, subject to applicable requirements</td>
                                    <td>Eligible if the person remains an Indian citizen</td>
                                    <td>Not entitled to an ordinary Indian passport merely by holding OCI status</td>
                                </tr>
                                <tr>
                                    <td>Foreign passport</td>
                                    <td>Depends on foreign citizenship and applicable law</td>
                                    <td>A person who voluntarily acquires foreign citizenship must consider the consequences for Indian citizenship</td>
                                    <td>Holds a foreign passport</td>
                                </tr>
                                <tr>
                                    <td>Right to vote in Indian elections</td>
                                    <td>Yes, if applicable electoral requirements are satisfied</td>
                                    <td>Yes, subject to applicable electoral requirements</td>
                                    <td>No, by virtue of OCI status</td>
                                </tr>
                                <tr>
                                    <td>Travel to India</td>
                                    <td>Indian citizens enter India as citizens</td>
                                    <td>Indian citizens generally travel using their valid Indian passports</td>
                                    <td>Enjoys specified visa privileges, subject to applicable rules</td>
                                </tr>
                                <tr>
                                    <td>Indian citizenship</td>
                                    <td>Already holds Indian citizenship</td>
                                    <td>Generally already holds Indian citizenship</td>
                                    <td>OCI registration does not confer Indian citizenship</td>
                                </tr>
                                <tr>
                                    <td>Indian property</td>
                                    <td>Governed by applicable property laws</td>
                                    <td>Governed by applicable property and foreign-exchange laws</td>
                                    <td>Governed by applicable property and foreign-exchange laws</td>
                                </tr>
                                <tr>
                                    <td>Agricultural land</td>
                                    <td>Subject to applicable property and other laws</td>
                                    <td>Restrictions may apply under the relevant legal framework</td>
                                    <td>Special restrictions apply to acquisition of agricultural land, plantation property and farmhouses</td>
                                </tr>
                                <tr>
                                    <td>Tax residence</td>
                                    <td>Determined by applicable tax rules</td>
                                    <td>Must be determined separately under tax law</td>
                                    <td>Must be determined separately under tax law</td>
                                </tr>
                                <tr>
                                    <td>Indian public employment</td>
                                    <td>Subject to the applicable recruitment and service rules</td>
                                    <td>Subject to the applicable rules for the position</td>
                                    <td>OCI status does not confer unrestricted access to Indian public services or posts</td>
                                </tr>
                                <tr>
                                    <td>Application process</td>
                                    <td>Citizenship arises or is acquired under applicable citizenship law</td>
                                    <td>NRI is not a separate citizenship application category</td>
                                    <td>Separate OCI registration application required</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="legal-callout">
                        <p><strong>Important:</strong> The table is a general comparison. Each legal consequence must be examined under the particular law governing the issue.</p>
                    </div>
                </section>

                <!-- Section 5 -->
                <section id="section-5">
                    <h2>5. What Happens When an Indian Citizen Acquires Foreign Citizenship?</h2>
                    <p>This question is particularly important for overseas Indians.</p>
                    <p>India does not generally permit a person to retain Indian citizenship after voluntarily acquiring foreign citizenship.</p>
                    <p>Section 9 of the Citizenship Act, 1955, addresses termination of Indian citizenship upon voluntary acquisition of another country's citizenship, subject to the applicable legal framework.</p>
                    <p>The consequences for a particular person depend on the relevant facts and law.</p>
                    <p>A person who has acquired foreign citizenship should not assume that an old Indian passport remains valid or that Indian citizenship continues merely because the person retains Indian identity documents.</p>

                    <div id="former-passport">
                        <h3>What about the former Indian passport?</h3>
                        <p>A former Indian citizen may need to address the surrender or other documentation requirements associated with the previous Indian passport.</p>
                        <p>The applicable procedure should be verified against current instructions issued by the competent Indian authorities or the relevant Indian Mission or Consulate.</p>
                    </div>

                    <div id="apply-oci-card">
                        <h3>Can the person apply for an OCI card?</h3>
                        <p>Potentially, yes, if the person satisfies the applicable OCI eligibility requirements and is not subject to a relevant exclusion.</p>
                        <p>The application must be assessed separately. Foreign citizenship does not automatically guarantee OCI registration.</p>
                        <p>For further information, see our guide on Indian Passport Surrender After Foreign Citizenship.</p>
                    </div>
                </section>

                <!-- Section 6 -->
                <section id="section-6">
                    <h2>6. Can an NRI Apply for an OCI Card?</h2>
                    <p>An NRI who remains an Indian citizen does not ordinarily need an OCI card.</p>
                    <p>OCI registration is intended for eligible foreign nationals.</p>
                    <p>If an Indian citizen living abroad later acquires foreign citizenship, the person's legal position changes and the person may need to consider the applicable passport-surrender and OCI requirements.</p>
                    <p>The correct sequence depends on the person's circumstances and the applicable official instructions.</p>
                    <p>Applicants should not submit an OCI application merely because they live outside India.</p>
                </section>

                <!-- Section 7 -->
                <section id="section-7">
                    <h2>7. Can an OCI Cardholder Apply for Indian Citizenship?</h2>
                    <p>OCI registration does not automatically convert into Indian citizenship.</p>
                    <p>The Citizenship Act provides a separate citizenship application route for qualifying OCI cardholders under Section 5(1)(g), subject to the statutory conditions.</p>
                    <p>The official OCI guidance identifies conditions including attainment of full age, registration as an OCI cardholder for five years and ordinary residence in India for twelve months immediately before the application, subject to the applicable statutory provisions and any permitted relaxation.</p>
                    <p>Meeting the conditions to apply does not guarantee citizenship.</p>
                    <p>The application must satisfy the applicable requirements and be decided by the competent authority.</p>
                    <p>Anyone considering this route should verify the current legal requirements before taking action.</p>
                </section>

                <!-- Section 8 -->
                <section id="section-8">
                    <h2>8. What Is the Difference Between NRI Status and Tax Residence?</h2>
                    <p>This distinction deserves particular attention.</p>
                    <p>The term NRI is frequently used in everyday conversation, but tax residence is determined under the applicable tax legislation.</p>
                    <p>Under Indian income-tax law, residential status is assessed using the relevant statutory tests, which may include the number of days a person is present in India and other applicable conditions.</p>
                    <p>A person should not assume that being described as an NRI for banking purposes automatically determines the person's tax residence.</p>
                    <p>Similarly, an OCI card does not automatically establish non-resident status for tax purposes.</p>

                    <div id="why-tax-matters">
                        <h3>Why this matters</h3>
                        <p>Tax residence can affect the taxation of income and the reporting obligations that apply to a person.</p>
                        <p>The correct assessment may depend on:</p>
                        <ul>
                            <li>The person's presence in India during the relevant period.</li>
                            <li>The applicable statutory tests.</li>
                            <li>The nature and source of the income.</li>
                            <li>Any relevant exceptions or special provisions.</li>
                            <li>The applicable tax treaty, where relevant.</li>
                        </ul>
                        <p>Tax and immigration questions should therefore be examined separately.</p>
                        <p>This article provides only a general distinction and is not a substitute for individual tax advice.</p>
                    </div>
                </section>

                <!-- Section 9 -->
                <section id="section-9">
                    <h2>9. Can OCI Cardholders Buy or Inherit Property in India?</h2>
                    <p>The legal position must be assessed under the applicable property, succession and foreign-exchange laws.</p>
                    <p>OCI status does not automatically prohibit every property transaction, but it also does not confer unrestricted property rights.</p>

                    <div id="purchasing-property">
                        <h3>Purchasing property</h3>
                        <p>The permitted transaction may depend on the nature of the property, the parties and the applicable legal restrictions.</p>
                        <p>Special restrictions apply to agricultural land, plantation property and farmhouses.</p>
                    </div>

                    <div id="inheriting-property">
                        <h3>Inheriting property</h3>
                        <p>Inheritance raises separate questions concerning ownership, succession, title documents and the applicable law.</p>
                        <p>A person may need to establish the deceased person's ownership, the family relationship, the applicable succession route and any relevant regulatory requirements.</p>
                        <p>The distinction between purchasing property and inheriting property should not be overlooked.</p>
                        <p>For further information, read our guides on buying property in India and inheriting Indian property as an OCI cardholder.</p>
                    </div>
                </section>

                <!-- Section 10 -->
                <section id="section-10">
                    <h2>10. What Legal Documents May Be Relevant to Overseas Indians?</h2>
                    <p>Depending on the circumstances, overseas clients may need assistance with documents relating to:</p>
                    <ul>
                        <li>Citizenship and passport history.</li>
                        <li>Birth, marriage and death registration.</li>
                        <li>Indian ancestry and family relationships.</li>
                        <li>Historical records.</li>
                        <li>Indian property and succession.</li>
                        <li>Powers of Attorney for use in India.</li>
                        <li>OCI applications or updates.</li>
                        <li>Notices or proceedings concerning OCI registration.</li>
                    </ul>
                    <p>The relevant documents depend on the purpose for which they are required.</p>
                    <p>A document that establishes one fact may not automatically establish another. For example, a historical property record may help establish a family association with a place but may not, by itself, prove citizenship or satisfy an OCI eligibility requirement.</p>
                </section>

                <!-- Section 11 -->
                <section id="section-11">
                    <h2>11. Common Misunderstandings</h2>

                    <div class="misunderstanding-card" id="misunderstanding-1">
                        <h3><i class="bi bi-exclamation-triangle-fill"></i> Misunderstanding 1: NRI and OCI mean the same thing</h3>
                        <p>They do not. An NRI generally remains an Indian citizen living abroad, whereas an OCI cardholder is a foreign citizen registered under the OCI scheme.</p>
                    </div>

                    <div class="misunderstanding-card" id="misunderstanding-2">
                        <h3><i class="bi bi-exclamation-triangle-fill"></i> Misunderstanding 2: An OCI card gives Indian citizenship</h3>
                        <p>It does not. OCI registration provides specified privileges without conferring Indian citizenship.</p>
                    </div>

                    <div class="misunderstanding-card" id="misunderstanding-3">
                        <h3><i class="bi bi-exclamation-triangle-fill"></i> Misunderstanding 3: Every person of Indian ancestry qualifies for OCI</h3>
                        <p>Eligibility depends on the statutory category, the relevant family relationship, supporting evidence and applicable exclusions.</p>
                    </div>

                    <div class="misunderstanding-card" id="misunderstanding-4">
                        <h3><i class="bi bi-exclamation-triangle-fill"></i> Misunderstanding 4: An OCI card determines tax residence</h3>
                        <p>It does not. Tax residence must be assessed under the applicable tax legislation.</p>
                    </div>

                    <div class="misunderstanding-card" id="misunderstanding-5">
                        <h3><i class="bi bi-exclamation-triangle-fill"></i> Misunderstanding 5: An OCI cardholder can freely buy every type of property</h3>
                        <p>No. Property transactions remain subject to the applicable laws, including special restrictions on agricultural land, plantation property and farmhouses.</p>
                    </div>

                    <div class="misunderstanding-card" id="misunderstanding-6">
                        <h3><i class="bi bi-exclamation-triangle-fill"></i> Misunderstanding 6: A former Indian citizen can continue using an Indian passport after acquiring foreign citizenship</h3>
                        <p>A person who has acquired foreign citizenship must examine the legal consequences for Indian citizenship and comply with the applicable passport-related requirements.</p>
                    </div>

                    <div class="misunderstanding-card" id="misunderstanding-7">
                        <h3><i class="bi bi-exclamation-triangle-fill"></i> Misunderstanding 7: OCI registration automatically leads to Indian citizenship</h3>
                        <p>No. Any citizenship application must satisfy the separate requirements of the applicable law.</p>
                    </div>
                </section>

                <!-- Section 12 -->
                <section id="section-12">
                    <h2>12. How RRC Law Associates Can Assist</h2>
                    <p>RRC Law Associates can consider enquiries from overseas clients who need help understanding OCI-related legal and documentation questions.</p>
                    <p>Depending on the circumstances and the agreed scope of work, assistance may include:</p>

                    <div class="service-assist-grid">
                        <div class="service-assist-card">
                            <h3>OCI eligibility assessment</h3>
                            <p>Reviewing the available information to identify the eligibility category that may be relevant.</p>
                        </div>
                        <div class="service-assist-card">
                            <h3>Indian ancestry research</h3>
                            <p>Assessing family history and identifying potential avenues for locating historical records.</p>
                        </div>
                        <div class="service-assist-card">
                            <h3>Documentation review</h3>
                            <p>Identifying missing records, inconsistent names or dates and gaps in the evidence connecting generations.</p>
                        </div>
                        <div class="service-assist-card">
                            <h3>Passport and OCI documentation</h3>
                            <p>Explaining documentary issues arising from foreign citizenship, previous Indian passports or OCI updates.</p>
                        </div>
                        <div class="service-assist-card">
                            <h3>Property and inheritance matters</h3>
                            <p>Considering relevant Indian property, succession and documentation issues.</p>
                        </div>
                        <div class="service-assist-card">
                            <h3>Power of Attorney</h3>
                            <p>Reviewing documentation requirements for legal matters that must be handled in India.</p>
                        </div>
                    </div>

                    <p>The services required will depend on the individual circumstances and the scope agreed with the client.</p>
                    <p>No guarantee is made that a particular record will be located, an official certificate will be issued or an OCI application will be approved.</p>
                </section>

                <!-- Section 13 -->
                <section id="section-13">
                    <h2>13. Frequently Asked Questions</h2>
                    <div class="accordion article-faq" id="ociFaqAccordion">
                        <!-- FAQ 1 -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingFaq1">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq1" aria-expanded="true" aria-controls="collapseFaq1">
                                    Is an NRI an Indian citizen?
                                </button>
                            </h3>
                            <div id="collapseFaq1" class="accordion-collapse collapse show" aria-labelledby="headingFaq1" data-bs-parent="#ociFaqAccordion">
                                <div class="accordion-body">
                                    <p>In general usage, an NRI is an Indian citizen residing outside India. However, the precise definition and legal consequences depend on the law or regulatory framework involved.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 2 -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingFaq2">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq2" aria-expanded="false" aria-controls="collapseFaq2">
                                    Is an OCI cardholder an Indian citizen?
                                </button>
                            </h3>
                            <div id="collapseFaq2" class="accordion-collapse collapse" aria-labelledby="headingFaq2" data-bs-parent="#ociFaqAccordion">
                                <div class="accordion-body">
                                    <p>No. An OCI cardholder is a foreign national who holds OCI registration under the applicable legal framework.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 3 -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingFaq3">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq3" aria-expanded="false" aria-controls="collapseFaq3">
                                    Can an NRI apply for an OCI card?
                                </button>
                            </h3>
                            <div id="collapseFaq3" class="accordion-collapse collapse" aria-labelledby="headingFaq3" data-bs-parent="#ociFaqAccordion">
                                <div class="accordion-body">
                                    <p>An Indian citizen living abroad ordinarily does not need OCI registration. OCI is intended for qualifying foreign nationals.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 4 -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingFaq4">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq4" aria-expanded="false" aria-controls="collapseFaq4">
                                    Can an OCI cardholder hold an Indian passport?
                                </button>
                            </h3>
                            <div id="collapseFaq4" class="accordion-collapse collapse" aria-labelledby="headingFaq4" data-bs-parent="#ociFaqAccordion">
                                <div class="accordion-body">
                                    <p>OCI registration does not entitle a foreign citizen to an ordinary Indian passport. Indian passports are issued to Indian citizens, subject to applicable requirements.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 5 -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingFaq5">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq5" aria-expanded="false" aria-controls="collapseFaq5">
                                    Can an OCI cardholder vote in India?
                                </button>
                            </h3>
                            <div id="collapseFaq5" class="accordion-collapse collapse" aria-labelledby="headingFaq5" data-bs-parent="#ociFaqAccordion">
                                <div class="accordion-body">
                                    <p>No. OCI status does not confer the right to vote in Indian elections.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 6 -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingFaq6">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq6" aria-expanded="false" aria-controls="collapseFaq6">
                                    Can an OCI cardholder buy residential property in India?
                                </button>
                            </h3>
                            <div id="collapseFaq6" class="accordion-collapse collapse" aria-labelledby="headingFaq6" data-bs-parent="#ociFaqAccordion">
                                <div class="accordion-body">
                                    <p>Certain transactions may be permitted, subject to the applicable laws and restrictions. The proposed transaction should be assessed before proceeding.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 7 -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingFaq7">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq7" aria-expanded="false" aria-controls="collapseFaq7">
                                    Is an OCI cardholder automatically an NRI for tax purposes?
                                </button>
                            </h3>
                            <div id="collapseFaq7" class="accordion-collapse collapse" aria-labelledby="headingFaq7" data-bs-parent="#ociFaqAccordion">
                                <div class="accordion-body">
                                    <p>No. Tax residence is determined under the applicable tax law and the person's circumstances, not solely by the possession of an OCI card.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 8 -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingFaq8">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq8" aria-expanded="false" aria-controls="collapseFaq8">
                                    Can a former Indian citizen apply for OCI after acquiring foreign citizenship?
                                </button>
                            </h3>
                            <div id="collapseFaq8" class="accordion-collapse collapse" aria-labelledby="headingFaq8" data-bs-parent="#ociFaqAccordion">
                                <div class="accordion-body">
                                    <p>Potentially, yes, if the person satisfies the applicable eligibility requirements and is not subject to a relevant exclusion.</p>
                                </div>
                            </div>
                        </div>

                        <!-- FAQ 9 -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingFaq9">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq9" aria-expanded="false" aria-controls="collapseFaq9">
                                    Can an OCI cardholder later become an Indian citizen?
                                </button>
                            </h3>
                            <div id="collapseFaq9" class="accordion-collapse collapse" aria-labelledby="headingFaq9" data-bs-parent="#ociFaqAccordion">
                                <div class="accordion-body">
                                    <p>An OCI cardholder may apply under the applicable citizenship provisions if the statutory conditions are satisfied. Registration as an OCI cardholder does not automatically confer citizenship.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Section 14: Need Guidance -->
                <section id="section-14">
                    <div class="enquiry-cta-block">
                        <h2>14. Need Guidance on OCI or Indian Legal Matters?</h2>
                        <p>If you are living overseas and need help understanding your OCI eligibility, ancestry documents, passport history or related Indian legal issues, RRC Law Associates can review your circumstances and discuss possible next steps.</p>
                        
                        <p>For an initial enquiry, please provide:</p>
                        <ul class="enquiry-checklist">
                            <li>Your country of citizenship and current country of residence.</li>
                            <li>Whether you currently hold Indian citizenship or foreign citizenship.</li>
                            <li>Whether you already have an OCI card.</li>
                            <li>The family connection or legal issue involved.</li>
                            <li>The documents currently available.</li>
                        </ul>

                        <p>After an initial assessment, the proposed scope of work and applicable professional fees can be discussed.</p>
                        <p>Contact RRC Law Associates for OCI documentation, Indian ancestry research and related Indian legal assistance.</p>

                        <div class="d-flex flex-wrap gap-3 mt-4">
                            <a href="./booking.html" class="btn btn-gold">
                                <i class="bi bi-calendar-check-fill"></i> Book Legal Consultation
                            </a>
                            <a href="https://wa.me/919751182452" class="btn btn-outline-gold" target="_blank" rel="noopener">
                                <i class="bi bi-whatsapp"></i> Chat on WhatsApp
                            </a>
                            <a href="mailto:dr.kumar@rrclawassociates.com" class="btn btn-outline-gold">
                                <i class="bi bi-envelope-fill"></i> Email Case Details
                            </a>
                        </div>
                    </div>
                </section>

                <!-- Official Resources -->
                <section id="official-resources">
                    <div class="official-resources-box">
                        <h3>Official Resources</h3>
                        <p>Consult the current official sources for the relevant legal requirements:</p>
                        <div class="official-resource-item">
                            <i class="bi bi-link-45deg fs-4 text-primary"></i>
                            <div>
                                <div><strong>OCI Services:</strong></div>
                                <a href="https://ociservices.gov.in/" target="_blank" rel="noopener noreferrer">https://ociservices.gov.in/</a>
                            </div>
                        </div>
                        <div class="official-resource-item">
                            <i class="bi bi-link-45deg fs-4 text-primary"></i>
                            <div>
                                <div><strong>OCI Frequently Asked Questions:</strong></div>
                                <a href="https://ociservices.gov.in/onlineOCI/onlineOCI/faq" target="_blank" rel="noopener noreferrer">https://ociservices.gov.in/onlineOCI/onlineOCI/faq</a>
                            </div>
                        </div>
                        <div class="official-resource-item">
                            <i class="bi bi-link-45deg fs-4 text-primary"></i>
                            <div>
                                <div><strong>Ministry of External Affairs &mdash; OCI FAQs:</strong></div>
                                <a href="https://www.mea.gov.in/faqs-on-oci-scheme.htm" target="_blank" rel="noopener noreferrer">https://www.mea.gov.in/faqs-on-oci-scheme.htm</a>
                            </div>
                        </div>
                        <div class="official-resource-item">
                            <i class="bi bi-link-45deg fs-4 text-primary"></i>
                            <div>
                                <div><strong>Citizenship Act, 1955:</strong></div>
                                <a href="https://www.indiacode.nic.in/handle/123456789/19760" target="_blank" rel="noopener noreferrer">https://www.indiacode.nic.in/handle/123456789/19760</a>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Legal Disclaimer -->
                <section id="legal-disclaimer">
                    <div class="legal-callout">
                        <h3>Legal Disclaimer</h3>
                        <p>This article provides general information and does not constitute individual legal advice. The meaning and consequences of NRI, OCI and citizenship status depend on the applicable law and the person's circumstances. Tax residence, property rights, citizenship and immigration status must be assessed separately where required. Government decisions remain with the competent authorities. No outcome is guaranteed.</p>
                    </div>
                </section>
            </article>

            <!-- Right Sidebar Column (Sticky) -->
            <aside class="col-lg-4">
                <div class="sidebar-sticky-wrapper">
                    <!-- Quick Navigator / TOC -->
                    <div class="sidebar-card">
                        <div class="sidebar-card-title">
                            <i class="bi bi-list-nested text-gold"></i> Guide Navigation
                        </div>
                        <ul class="toc-list">
                            <li><a href="#section-1"><i class="bi bi-chevron-right text-gold me-1"></i> 1. What Is an Indian Citizen?</a></li>
                            <li><a href="#section-2"><i class="bi bi-chevron-right text-gold me-1"></i> 2. What Is an NRI?</a></li>
                            <li><a href="#section-3"><i class="bi bi-chevron-right text-gold me-1"></i> 3. What Is an OCI Cardholder?</a></li>
                            <li><a href="#section-4"><i class="bi bi-chevron-right text-gold me-1"></i> 4. Comparison Table</a></li>
                            <li><a href="#section-5"><i class="bi bi-chevron-right text-gold me-1"></i> 5. Foreign Citizenship Acquired</a></li>
                            <li><a href="#section-6"><i class="bi bi-chevron-right text-gold me-1"></i> 6. Can NRIs Apply for OCI?</a></li>
                            <li><a href="#section-7"><i class="bi bi-chevron-right text-gold me-1"></i> 7. Applying for Citizenship</a></li>
                            <li><a href="#section-8"><i class="bi bi-chevron-right text-gold me-1"></i> 8. NRI vs Tax Residence</a></li>
                            <li><a href="#section-9"><i class="bi bi-chevron-right text-gold me-1"></i> 9. Buying or Inheriting Property</a></li>
                            <li><a href="#section-10"><i class="bi bi-chevron-right text-gold me-1"></i> 10. Relevant Legal Documents</a></li>
                            <li><a href="#section-11"><i class="bi bi-chevron-right text-gold me-1"></i> 11. Common Misunderstandings</a></li>
                            <li><a href="#section-12"><i class="bi bi-chevron-right text-gold me-1"></i> 12. How RRC Law Can Assist</a></li>
                            <li><a href="#section-13"><i class="bi bi-chevron-right text-gold me-1"></i> 13. Frequently Asked Questions</a></li>
                            <li><a href="#section-14"><i class="bi bi-chevron-right text-gold me-1"></i> 14. Initial Guidance &amp; Contact</a></li>
                            <li><a href="#official-resources"><i class="bi bi-chevron-right text-gold me-1"></i> Official Resources</a></li>
                        </ul>
                    </div>

                    <!-- Consultation Assistance Card -->
                    <div class="sidebar-card">
                        <div class="sidebar-card-title">
                            <i class="bi bi-shield-lock-fill text-gold"></i> Status &amp; OCI Review
                        </div>
                        <p class="small text-muted mb-3">Confused about your NRI vs OCI status, Indian passport surrender requirements, or cross-border property rights? We assist clients worldwide.</p>
                        
                        <div class="sidebar-feature-box">
                            <div class="feature-title"><i class="bi bi-airplane text-gold"></i> Zero-Travel Support</div>
                            <p>Complete statutory assessment, civil record search, and documentation verification conducted directly in India without requiring your travel.</p>
                        </div>

                        <div class="sidebar-feature-box">
                            <div class="feature-title"><i class="bi bi-file-earmark-check text-gold"></i> Status Pre-Screening</div>
                            <p>Distinguish immigration privileges from tax residence and banking classifications before taking action.</p>
                        </div>

                        <a href="./booking.html" class="btn btn-gold w-100 py-2 justify-content-center mt-2">
                            <i class="bi bi-calendar-event"></i> Request Case Review
                        </a>
                    </div>

                    <!-- Related Guides -->
                    <div class="sidebar-card">
                        <div class="sidebar-card-title">
                            <i class="bi bi-journal-bookmark-fill text-gold"></i> Related OCI Guides
                        </div>
                        <ul class="toc-list">
                            <li>
                                <a href="oci-legal-guides.html">
                                    <strong><i class="bi bi-collection text-gold me-1"></i> OCI Legal Guides Hub</strong>
                                    <div class="small text-muted">Master index of 15 comprehensive guides</div>
                                </a>
                            </li>
                            <li>
                                <a href="oci-card-eligibility-legal-status.html">
                                    <strong><i class="bi bi-shield-check text-gold me-1"></i> Guide 1: OCI Eligibility &amp; Status</strong>
                                    <div class="small text-muted">Legal meaning, benefits &amp; requirements</div>
                                </a>
                            </li>
                            <li>
                                <a href="oci-card-application-documents.html">
                                    <strong><i class="bi bi-file-earmark-text text-gold me-1"></i> Guide 3: Application &amp; Documents</strong>
                                    <div class="small text-muted">Procedure, document checklist &amp; mistakes</div>
                                </a>
                            </li>
                            <li>
                                <a href="oci-card-indian-ancestry-assistance.html">
                                    <strong><i class="bi bi-diagram-3 text-gold me-1"></i> Guide 4: Indian Ancestry</strong>
                                    <div class="small text-muted">Proving Indian origin &amp; record search</div>
                                </a>
                            </li>
                            <li>
                                <a href="oci-card-assistance.html">
                                    <strong><i class="bi bi-briefcase text-gold me-1"></i> OCI Legal Services</strong>
                                    <div class="small text-muted">Our complete scope of representation</div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
        </div>
    </main>

    <!-- Footer (Preserved) -->
    <footer class="footer">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-4 col-md-6">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <img src="assets/images/logo.png" alt="RRC Law Associates" class="logo-img">
                        <div class="text-white fw-bold">
                            <div>RRC</div>
                            <div>Law Associates</div>
                        </div>
                    </div>
                    <p class="small text-secondary">Providing trusted legal solutions with integrity since 2008. Your reliable partner for all legal matters in Tamil Nadu and cross-border Indian legal services.</p>
                </div>

                <div class="col-lg-2 col-md-6">
                    <h5 class="text-white mb-3" style="font-family: 'Playfair Display';">Practice Areas</h5>
                    <ul class="list-unstyled small text-secondary">
                        <li class="mb-2"><a href="family-law.html">Family Law</a></li>
                        <li class="mb-2"><a href="property-law.html">Property Law</a></li>
                        <li class="mb-2"><a href="employment-law.html">Employment Law</a></li>
                        <li class="mb-2"><a href="white-collar-crime.html">White Collar Crimes</a></li>
                        <li class="mb-2"><a href="intellectual-property.html">Intellectual Property</a></li>
                        <li class="mb-2"><a href="litigation-dispute-resolution.html">Litigation Dispute</a></li>
                    </ul>
                </div>

                <div class="col-lg-3 col-md-6">
                    <h5 class="text-white mb-3" style="font-family: 'Playfair Display';">Quick Links</h5>
                    <ul class="list-unstyled small text-secondary">
                        <li class="mb-2"><a href="index.html">Home</a></li>
                        <li class="mb-2"><a href="nri-services.html">NRI Services</a></li>
                        <li class="mb-2"><a href="oci-card-assistance.html">OCI Card &amp; Ancestry</a></li>
                        <li class="mb-2"><a href="oci-legal-guides.html">OCI Legal Guides Hub</a></li>
                        <li class="mb-2"><a href="core-practice-areas.html">Practice Areas</a></li>
                        <li class="mb-2"><a href="lawfirm-blog.html">Blog</a></li>
                        <li class="mb-2"><a href="index.html#contact">Contact</a></li>
                    </ul>
                </div>

                <div class="col-lg-3 col-md-6">
                    <h5 class="text-white mb-3" style="font-family: 'Playfair Display';">Contact Us</h5>
                    <ul class="list-unstyled small text-secondary">
                        <li class="mb-2">
                            <span class="text-gold d-block">Address</span>
                            No 82/6B, Deen Complex, Mary’s Corner, Parisutham Nagar, Thanjavur, Tamil Nadu-613001
                        </li>
                        <li class="mb-2">
                            <span class="text-gold d-block">Phone</span>
                            <a href="tel:+919751182452">+91 97511 82452</a>
                        </li>
                        <li class="mb-2">
                            <span class="text-gold d-block">Email</span>
                            <a href="mailto:dr.kumar@rrclawassociates.com">dr.kumar@rrclawassociates.com</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-top border-secondary mt-4 pt-4 text-center small text-secondary">
                &copy; 2026 RRC Law Associates. All Rights Reserved.
            </div>
        </div>
    </footer>

    <!-- Floating WhatsApp Widget -->
    <a href="https://wa.me/919751182452" class="floating-whatsapp" aria-label="Chat with RRC Law Associates on WhatsApp" target="_blank" rel="noopener">
        <i class="fab fa-whatsapp"></i>
    </a>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Mobile Drawer Menu Toggle
        const menuToggle = document.getElementById('menuToggle');
        const closeMenu = document.getElementById('closeMenu');
        const mobileMenu = document.getElementById('mobileMenu');

        if (menuToggle && closeMenu && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.add('active');
            });
            closeMenu.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        }

        // Submenu triggers in mobile menu
        document.querySelectorAll('.m-trigger').forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                if (submenu) {
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        });
    </script>
</body>
</html>
"""

with open('oci-vs-nri-vs-indian-citizen.html', 'w', encoding='utf-8') as f:
    f.write(page_html)

print("oci-vs-nri-vs-indian-citizen.html generated successfully!")
