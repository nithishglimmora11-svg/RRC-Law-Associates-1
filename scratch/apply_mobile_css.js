const fs = require('fs');

let content = fs.readFileSync('wills-probate-estate-administration.html', 'utf8');

// 1. Update body / html overflow
content = content.replace(
  'body {\n            font-family: \'Inter\', sans-serif;\n            background-color: #fbfcfd;\n            color: var(--text-body);\n            font-size: 17px;\n            line-height: 1.75;\n            margin: 0;\n            padding: 0;\n        }',
  'html, body {\n            overflow-x: hidden;\n            width: 100%;\n        }\n\n        body {\n            font-family: \'Inter\', sans-serif;\n            background-color: #fbfcfd;\n            color: var(--text-body);\n            font-size: 17px;\n            line-height: 1.75;\n            margin: 0;\n            padding: 0;\n        }'
);

// 2. Update table wrapper overflow to allow horizontal touch scrolling on mobile
content = content.replace(
  '.table-custom-wrapper {\n            background: #ffffff;\n            border: 1px solid #e2e8f0;\n            border-radius: 12px;\n            overflow: hidden;\n            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);\n            margin: 28px 0;\n        }',
  '.table-custom-wrapper {\n            background: #ffffff;\n            border: 1px solid #e2e8f0;\n            border-radius: 12px;\n            overflow-x: auto;\n            -webkit-overflow-scrolling: touch;\n            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);\n            margin: 28px 0;\n        }'
);

// 3. Add mobile responsive media queries before </style>
const mobileCss = `
        /* Mobile Viewport Optimizations (320px, 375px, 430px) */
        @media (max-width: 768px) {
            .header {
                min-height: 70px;
            }
            .logo-img {
                height: 48px;
            }
            .wills-hero-section {
                padding: 140px 0 50px;
            }
            .hero-h1 {
                font-size: 1.85rem;
            }
            .content-section {
                padding: 45px 0;
            }
            .cta-banner {
                padding: 35px 20px;
            }
            .highlights-strip .col-md-3 {
                border-bottom: 1px solid #edf2f7;
            }
            .highlights-strip .col-md-3:last-child {
                border-bottom: none;
            }
        }

        @media (max-width: 480px) {
            .hero-h1 {
                font-size: 1.6rem;
            }
            .hero-actions .btn {
                width: 100%;
                justify-content: center;
                text-align: center;
            }
            .table-custom {
                min-width: 540px;
            }
            .table-custom th, .table-custom td {
                padding: 12px 14px;
                font-size: 0.88rem;
            }
        }
    </style>`;

content = content.replace('    </style>', mobileCss);

fs.writeFileSync('wills-probate-estate-administration.html', content, 'utf8');
console.log('Mobile responsiveness styles applied.');
