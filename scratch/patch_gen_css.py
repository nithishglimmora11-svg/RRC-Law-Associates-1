# -*- coding: utf-8 -*-
import re

new_css = """
        :root {
            --lp-navy: #0b1c2d;
            --lp-navy-dark: #071320;
            --lp-navy-light: #122b46;
            --lp-gold: #c9a24d;
            --lp-gold-hover: #b38d38;
            --lp-gold-light: #fcf9ee;
            --lp-gold-border: rgba(201, 162, 77, 0.3);
            --lp-cream: #f9f7f3;
            --lp-text-dark: #1a2530;
            --lp-text-muted: #5a6675;
            --lp-border-light: #e6ebf1;
            --lp-white: #ffffff;
        }

        body {
            font-family: 'Inter', sans-serif;
            color: var(--lp-text-dark);
            background-color: var(--lp-white);
            line-height: 1.65;
        }

        /* --- GLOBAL HEADER PRESERVATION ASSURANCES --- */
        .header {
            background: #000000 !important;
            padding: 5px 0;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1100;
            min-height: 80px;
            display: flex;
            align-items: center;
        }
        .logo-img { height: 60px; width: auto; }
        .nav-link-custom {
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 500;
            margin: 0 15px;
            white-space: nowrap !important;
            transition: 0.3s;
            cursor: pointer;
        }
        .nav-link-custom:hover { color: var(--lp-gold) !important; }
        .dropdown-menu { background-color: #000000 !important; border: 1px solid #c9a24d !important; margin-top: 10px !important; }
        .dropdown-item { color: #ffffff !important; padding: 10px 20px; }
        .dropdown-item:hover { background-color: #1a1a1a !important; color: var(--lp-gold) !important; }

        /* Intermediate Desktop Breakpoint for Single-Line Nav */
        @media (min-width: 992px) and (max-width: 1240px) {
            .nav-link-custom {
                margin: 0 8px !important;
                font-size: 0.92rem !important;
                white-space: nowrap !important;
            }
            .header .btn-gold {
                padding: 8px 14px !important;
                font-size: 0.85rem !important;
                white-space: nowrap !important;
            }
        }

        /* --- SECTION 1: LEGAL PARTNERS HERO SECTION --- */
        .lp-hero {
            position: relative;
            background: linear-gradient(135deg, rgba(7, 19, 32, 0.92) 0%, rgba(11, 28, 45, 0.88) 100%), url('assets/images/legal-partners-hero.jpg') center/cover no-repeat;
            padding-top: 135px;
            padding-bottom: 50px;
            color: #ffffff;
            overflow: hidden;
            border-bottom: 1px solid rgba(201, 162, 77, 0.25);
        }
        .lp-hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 85% 30%, rgba(201, 162, 77, 0.12) 0%, transparent 60%);
            pointer-events: none;
        }
        .lp-eyebrow {
            color: var(--lp-gold);
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 700;
            font-size: 0.82rem;
            display: inline-block;
            margin-bottom: 10px;
        }
        .lp-hero-title {
            font-family: 'Playfair Display', serif;
            font-size: 3.2rem;
            font-weight: 700;
            line-height: 1.15;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .lp-hero-subtitle {
            font-family: 'Playfair Display', serif;
            font-size: 1.55rem;
            color: #f1f5f9;
            font-weight: 400;
            margin-bottom: 16px;
            line-height: 1.3;
        }
        .lp-hero-lead {
            font-size: 1.05rem;
            color: #cbd5e1;
            max-width: 650px;
            line-height: 1.65;
            margin-bottom: 24px;
        }
        .lp-btn-primary {
            background: var(--lp-gold);
            color: var(--lp-navy) !important;
            font-weight: 700;
            padding: 10px 26px;
            border-radius: 30px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: 1px solid var(--lp-gold);
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(201, 162, 77, 0.25);
            font-size: 0.95rem;
        }
        .lp-btn-primary:hover {
            background: var(--lp-gold-hover);
            border-color: var(--lp-gold-hover);
            color: #000000 !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(201, 162, 77, 0.35);
        }
        .lp-btn-secondary {
            background: rgba(11, 28, 45, 0.6);
            color: #ffffff !important;
            font-weight: 600;
            padding: 10px 24px;
            border-radius: 30px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            transition: all 0.3s ease;
            backdrop-filter: blur(4px);
            font-size: 0.95rem;
        }
        .lp-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: var(--lp-gold);
            color: var(--lp-gold) !important;
            transform: translateY(-2px);
        }

        /* --- SECTION 2: THREE BENEFIT BLOCKS --- */
        .lp-benefits {
            background: #ffffff;
            padding: 38px 0 42px;
            position: relative;
        }
        .lp-benefit-card {
            text-align: center;
            padding: 24px 20px;
            border-radius: 14px;
            background: #ffffff;
            border: 1px solid var(--lp-border-light);
            transition: all 0.3s ease;
            height: 100%;
            position: relative;
        }
        .lp-benefit-card:hover {
            transform: translateY(-5px);
            border-color: var(--lp-gold);
            box-shadow: 0 12px 28px rgba(11, 28, 45, 0.07);
        }
        .lp-benefit-icon {
            width: 56px;
            height: 56px;
            margin: 0 auto 14px;
            border-radius: 50%;
            background: var(--lp-gold-light);
            border: 1px solid var(--lp-gold-border);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--lp-gold);
            font-size: 1.35rem;
            transition: all 0.3s ease;
        }
        .lp-benefit-card:hover .lp-benefit-icon {
            background: var(--lp-gold);
            color: #ffffff;
            transform: scale(1.06);
        }
        .lp-benefit-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--lp-navy);
            margin-bottom: 8px;
        }
        .lp-benefit-text {
            color: var(--lp-text-muted);
            font-size: 0.92rem;
            line-height: 1.55;
            margin-bottom: 0;
        }

        /* --- SECTION 3: OUR LEGAL PARTNER NETWORK --- */
        .lp-network-section {
            background-color: #fbfbfd;
            padding: 42px 0 48px;
            border-top: 1px solid #f0f3f6;
            border-bottom: 1px solid #f0f3f6;
        }
        .lp-section-header {
            margin-bottom: 22px;
        }
        .lp-section-title {
            font-family: 'Playfair Display', serif;
            font-size: 2.1rem;
            font-weight: 700;
            color: var(--lp-navy);
            margin-bottom: 6px;
        }
        .lp-section-subtitle {
            color: var(--lp-text-muted);
            font-size: 0.98rem;
            max-width: 650px;
        }
        .lp-view-all-link {
            color: var(--lp-navy);
            font-weight: 700;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.92rem;
            transition: 0.3s;
        }
        .lp-view-all-link i {
            color: var(--lp-gold);
            transition: transform 0.3s ease;
        }
        .lp-view-all-link:hover {
            color: var(--lp-gold);
        }
        .lp-view-all-link:hover i {
            transform: translateX(4px);
        }

        /* Interactive World Map */
        .lp-map-container {
            background: #ffffff;
            border: 1px solid var(--lp-border-light);
            border-radius: 16px;
            padding: 18px 16px 12px;
            box-shadow: 0 4px 16px rgba(11, 28, 45, 0.03);
            margin-bottom: 24px;
            position: relative;
        }
        .lp-map-svg {
            width: 100%;
            height: auto;
            max-height: 290px;
        }
        .map-continent {
            fill: #dce3eb;
            transition: fill 0.3s;
        }
        .map-pin {
            cursor: pointer;
            transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .map-pin:hover {
            transform: scale(1.35);
        }
        .pin-pulse {
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            transform-origin: center;
        }
        @keyframes pulse-ring {
            0% { r: 6; opacity: 0.8; stroke-width: 2; }
            80%, 100% { r: 20; opacity: 0; stroke-width: 0.5; }
        }

        /* Statistics Strip */
        .lp-stats-row {
            margin-bottom: 28px;
        }
        .lp-stat-box {
            background: #ffffff;
            border: 1px solid var(--lp-border-light);
            border-radius: 12px;
            padding: 16px 14px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 3px 12px rgba(0,0,0,0.02);
            height: 100%;
        }
        .lp-stat-box:hover {
            border-color: var(--lp-gold);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(201, 162, 77, 0.08);
        }
        .lp-stat-num {
            font-family: 'Playfair Display', serif;
            font-size: 2.2rem;
            font-weight: 700;
            color: var(--lp-gold);
            line-height: 1;
            margin-bottom: 4px;
        }
        .lp-stat-label {
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: var(--lp-navy);
            font-weight: 700;
            margin: 0;
        }

        /* Filter Pills */
        .lp-filter-btn {
            background: #ffffff;
            border: 1px solid rgba(11, 28, 45, 0.15);
            color: var(--lp-text-muted);
            padding: 5px 16px;
            border-radius: 20px;
            font-size: 0.84rem;
            font-weight: 600;
            transition: all 0.25s ease;
            margin-right: 6px;
            margin-bottom: 8px;
        }
        .lp-filter-btn:hover, .lp-filter-btn.active {
            background: var(--lp-navy);
            color: #ffffff;
            border-color: var(--lp-navy);
        }
        .lp-filter-btn.active {
            background: var(--lp-gold);
            color: var(--lp-navy);
            border-color: var(--lp-gold);
        }

        /* Partner Directory Cards */
        .lp-partner-card {
            background: #ffffff;
            border: 1px solid var(--lp-border-light);
            border-radius: 14px;
            overflow: hidden;
            transition: all 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            box-shadow: 0 3px 15px rgba(0,0,0,0.02);
        }
        .lp-partner-card:hover {
            transform: translateY(-5px);
            border-color: var(--lp-gold);
            box-shadow: 0 12px 28px rgba(11, 28, 45, 0.08);
        }
        .lp-card-thumb-wrap {
            position: relative;
            height: 155px;
            overflow: hidden;
            background-color: var(--lp-navy);
        }
        .lp-card-thumb {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        .lp-partner-card:hover .lp-card-thumb {
            transform: scale(1.05);
        }
        .lp-country-badge {
            position: absolute;
            bottom: 10px;
            left: 12px;
            background: #ffffff;
            color: var(--lp-navy);
            font-size: 0.74rem;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            border-left: 3px solid var(--lp-gold);
        }
        .lp-card-body {
            padding: 18px 18px 14px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        .lp-partner-name {
            font-family: 'Playfair Display', serif;
            font-size: 1.22rem;
            font-weight: 700;
            color: var(--lp-navy);
            margin-bottom: 3px;
            line-height: 1.25;
        }
        .lp-partner-location {
            color: var(--lp-text-muted);
            font-size: 0.84rem;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .lp-partner-location i {
            color: var(--lp-gold);
            font-size: 0.8rem;
        }
        .lp-partner-desc {
            color: #4b5563;
            font-size: 0.86rem;
            line-height: 1.5;
            margin-bottom: 12px;
            flex-grow: 1;
        }
        .lp-card-action {
            margin-top: auto;
            padding-top: 10px;
            border-top: 1px solid #f1f5f9;
        }
        .lp-view-profile-btn {
            color: var(--lp-navy);
            font-weight: 700;
            font-size: 0.86rem;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: 0.25s;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
        }
        .lp-view-profile-btn i {
            color: var(--lp-gold);
            transition: transform 0.25s;
        }
        .lp-view-profile-btn:hover {
            color: var(--lp-gold);
        }
        .lp-view-profile-btn:hover i {
            transform: translateX(4px);
        }

        /* --- SECTION 4: BECOME A LEGAL PARTNER CTA --- */
        .lp-cta-banner {
            background: linear-gradient(135deg, #071320 0%, #0b1c2d 60%, #122b46 100%);
            padding: 44px 0 48px;
            color: #ffffff;
            position: relative;
            overflow: hidden;
            border-top: 2px solid var(--lp-gold);
            border-bottom: 2px solid var(--lp-gold);
        }
        .lp-cta-banner::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 450px;
            height: 450px;
            background: radial-gradient(circle, rgba(201, 162, 77, 0.1) 0%, transparent 70%);
            pointer-events: none;
        }
        .lp-cta-title {
            font-family: 'Playfair Display', serif;
            font-size: 2.2rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
        }
        .lp-cta-subtitle {
            color: #cbd5e1;
            font-size: 1.02rem;
            margin-bottom: 24px;
        }
        .lp-prop-item {
            text-align: center;
            padding: 8px 6px;
        }
        .lp-prop-icon {
            width: 50px;
            height: 50px;
            margin: 0 auto 10px;
            border-radius: 50%;
            background: rgba(201, 162, 77, 0.12);
            border: 1px solid rgba(201, 162, 77, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--lp-gold);
            font-size: 1.25rem;
            transition: transform 0.3s;
        }
        .lp-prop-item:hover .lp-prop-icon {
            transform: translateY(-3px);
            background: var(--lp-gold);
            color: var(--lp-navy);
        }
        .lp-prop-title {
            font-weight: 700;
            font-size: 0.98rem;
            color: #ffffff;
            margin-bottom: 4px;
        }
        .lp-prop-text {
            font-size: 0.84rem;
            color: #94a3b8;
            line-height: 1.45;
            margin: 0;
        }

        /* --- SECTION 5: PARTNER TESTIMONIALS --- */
        .lp-testimonials {
            background: #ffffff;
            padding: 42px 0 46px;
        }
        .lp-testim-card {
            background: #ffffff;
            border: 1px solid var(--lp-border-light);
            border-radius: 14px;
            padding: 22px 20px;
            height: 100%;
            display: flex;
            align-items: flex-start;
            gap: 16px;
            box-shadow: 0 4px 18px rgba(11, 28, 45, 0.03);
            transition: all 0.3s ease;
        }
        .lp-testim-card:hover {
            transform: translateY(-4px);
            border-color: var(--lp-gold);
            box-shadow: 0 10px 24px rgba(11, 28, 45, 0.07);
        }
        .lp-testim-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--lp-gold);
            flex-shrink: 0;
        }
        .lp-testim-quote {
            font-size: 0.92rem;
            color: #334155;
            line-height: 1.55;
            font-style: italic;
            margin-bottom: 10px;
            position: relative;
        }
        .lp-testim-author {
            font-weight: 700;
            font-size: 0.88rem;
            color: var(--lp-navy);
            margin-bottom: 2px;
        }
        .lp-testim-role {
            font-size: 0.78rem;
            color: var(--lp-text-muted);
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* --- SECTION 6: 4-STEP APPLICATION WORKFLOW --- */
        .lp-app-section {
            background: #fbfbfd;
            padding: 42px 0 48px;
            border-top: 1px solid #f0f3f6;
        }
        .lp-breadcrumb {
            font-size: 0.82rem;
            color: var(--lp-text-muted);
            margin-bottom: 8px;
        }
        .lp-breadcrumb a {
            color: var(--lp-text-muted);
            text-decoration: none;
        }
        .lp-breadcrumb a:hover {
            color: var(--lp-gold);
        }
        .lp-form-box {
            background: #ffffff;
            border: 1px solid var(--lp-border-light);
            border-radius: 16px;
            padding: 28px 24px;
            box-shadow: 0 6px 24px rgba(11, 28, 45, 0.04);
            margin-bottom: 28px;
        }
        /* Stepper */
        .lp-stepper {
            display: flex;
            justify-content: space-between;
            position: relative;
            margin-bottom: 24px;
        }
        .lp-stepper::before {
            content: '';
            position: absolute;
            top: 18px;
            left: 5%;
            right: 5%;
            height: 2px;
            background: #e2e8f0;
            z-index: 1;
        }
        .lp-step-item {
            position: relative;
            z-index: 2;
            text-align: center;
            flex: 1;
        }
        .lp-step-circle {
            width: 36px;
            height: 36px;
            margin: 0 auto 6px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid #cbd5e1;
            color: #64748b;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.88rem;
            transition: all 0.3s;
        }
        .lp-step-item.active .lp-step-circle {
            background: var(--lp-gold);
            border-color: var(--lp-gold);
            color: var(--lp-navy);
            box-shadow: 0 0 0 3px rgba(201, 162, 77, 0.25);
        }
        .lp-step-item.completed .lp-step-circle {
            background: var(--lp-navy);
            border-color: var(--lp-navy);
            color: #ffffff;
        }
        .lp-step-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: #64748b;
            margin: 0;
        }
        .lp-step-item.active .lp-step-label {
            color: var(--lp-navy);
            font-weight: 700;
        }

        /* Form Inputs */
        .lp-form-label {
            font-weight: 600;
            font-size: 0.88rem;
            color: #334155;
            margin-bottom: 5px;
        }
        .lp-form-control {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 0.92rem;
            color: #1e293b;
            transition: all 0.2s ease;
            width: 100%;
        }
        .lp-form-control:focus {
            border-color: var(--lp-gold);
            box-shadow: 0 0 0 3px rgba(201, 162, 77, 0.2);
            outline: none;
        }
        .lp-practice-badge-check {
            display: none;
        }
        .lp-practice-badge-label {
            display: inline-block;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            color: #475569;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.25s;
            user-select: none;
        }
        .lp-practice-badge-check:checked + .lp-practice-badge-label {
            background: var(--lp-navy);
            border-color: var(--lp-navy);
            color: #ffffff;
        }

        /* Workflow Visual */
        .lp-workflow-box {
            background: #ffffff;
            border: 1px solid var(--lp-border-light);
            border-radius: 14px;
            padding: 22px 18px;
            box-shadow: 0 3px 12px rgba(0,0,0,0.02);
            margin-top: 24px;
        }
        .lp-wf-step {
            text-align: center;
            position: relative;
        }
        .lp-wf-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 8px;
            border-radius: 50%;
            background: var(--lp-gold-light);
            border: 1px solid var(--lp-gold-border);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--lp-gold);
            font-size: 1.2rem;
        }
        .lp-wf-title {
            font-weight: 700;
            font-size: 0.86rem;
            color: var(--lp-navy);
            margin-bottom: 2px;
        }
        .lp-wf-sub {
            font-size: 0.75rem;
            color: var(--lp-text-muted);
            margin: 0;
        }

        /* Success Screen */
        .lp-success-box {
            display: none;
            background: #ffffff;
            border: 1px solid var(--lp-border-light);
            border-radius: 16px;
            padding: 45px 24px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(11, 28, 45, 0.05);
            margin-bottom: 30px;
        }
        .lp-success-icon {
            width: 72px;
            height: 72px;
            margin: 0 auto 18px;
            border-radius: 50%;
            background: #ecfdf5;
            border: 2px solid #10b981;
            color: #10b981;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.2rem;
        }

        /* --- SECTION 7: PRESERVED DESKS & FAQS --- */
        .lp-preserved-section {
            background: #ffffff;
            padding: 38px 0 44px;
            border-top: 1px solid #f0f3f6;
        }
        .lp-desk-card {
            background: #ffffff;
            border: 1px solid var(--lp-border-light);
            border-radius: 12px;
            padding: 18px 16px;
            transition: all 0.3s;
            height: 100%;
            border-left: 4px solid var(--lp-gold);
        }
        .lp-desk-card:hover {
            box-shadow: 0 6px 20px rgba(11, 28, 45, 0.05);
            transform: translateY(-2px);
        }

        /* Responsive Breakpoints */
        @media (max-width: 991px) {
            .lp-hero { padding-top: 120px; padding-bottom: 45px; }
            .lp-hero-title { font-size: 2.4rem; }
            .lp-hero-subtitle { font-size: 1.3rem; }
            .lp-testim-card { margin-bottom: 16px; }
            .lp-stat-box { margin-bottom: 12px; }
            .lp-form-box { padding: 22px 16px; }
        }
        @media (max-width: 575px) {
            .lp-hero-title { font-size: 2rem; }
            .lp-hero-subtitle { font-size: 1.1rem; }
            .lp-btn-primary, .lp-btn-secondary { width: 100%; justify-content: center; }
            .lp-step-label { font-size: 0.72rem; }
            .lp-stepper { margin-bottom: 20px; }
            .lp-step-circle { width: 32px; height: 32px; font-size: 0.82rem; }
        }
"""

with open('scratch/generate_partners_html.py', 'r', encoding='utf-8') as f:
    orig_code = f.read()

# Replace CSS block between <style> and </style>
s_tag = '    <style>\n'
e_tag = '\n    </style>'

s_idx = orig_code.find(s_tag)
e_idx = orig_code.find(e_tag)

if s_idx != -1 and e_idx != -1:
    # Notice in generate_partners_html.py, curly braces are doubled: {{ and }} because it's inside an f-string
    doubled_css = new_css.replace('{', '{{').replace('}', '}}')
    new_code = orig_code[:s_idx + len(s_tag)] + doubled_css + orig_code[e_idx:]
    with open('scratch/generate_partners_html.py', 'w', encoding='utf-8') as f:
        f.write(new_code)
    print("Successfully updated scratch/generate_partners_html.py CSS block")
else:
    print("Could not find style tags in generate_partners_html.py")

