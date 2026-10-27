const fs = require('fs');

const pages = [
  {
    name: 'OCI Service Page',
    file: 'oci-card-assistance.html',
    type: 'service',
    expectedCanonical: 'https://rrclawassociates.com/oci-card-assistance',
    expectedTitle: 'OCI Card Assistance in Thanjavur & Tamil Nadu | RRC Law Associates',
    expectedH1Prefix: 'OCI Card & Indian Ancestry Assistance'
  },
  {
    name: 'OCI Legal Guides Hub',
    file: 'oci-legal-guides.html',
    type: 'hub',
    expectedCanonical: 'https://rrclawassociates.com/oci-legal-guides/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 1',
    file: 'oci-card-eligibility-legal-status.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-card-eligibility-legal-status/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 2',
    file: 'oci-vs-nri-vs-indian-citizen.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-vs-nri-vs-indian-citizen/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 3',
    file: 'oci-card-application-documents.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-card-application-documents/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 4',
    file: 'oci-card-indian-ancestry-assistance.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-card-indian-ancestry-assistance/',
    maxTitleLen: 60,
    expectedH1: 'OCI Through Indian Ancestry: How to Prove Your Indian-Origin Family Connection'
  },
  {
    name: 'Guide 5',
    file: 'oci-foreign-spouse-eligibility.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-foreign-spouse-eligibility/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 6',
    file: 'oci-for-children-born-abroad.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-for-children-born-abroad/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 7',
    file: 'oci-card-benefits-restrictions-india.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-card-benefits-restrictions-india/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 8',
    file: 'oci-cardholders-inherit-sell-ancestral-property-india.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-cardholders-inherit-sell-ancestral-property-india/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 10',
    file: 'nri-oci-property-due-diligence-india.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/nri-oci-property-due-diligence-india/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 11',
    file: 'nri-oci-property-tax-india.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/nri-oci-property-tax-india/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 12',
    file: 'oci-card-renewal-passport-update.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-card-renewal-passport-update/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 13',
    file: 'oci-card-cancellation-grounds-remedies.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-card-cancellation-grounds-remedies/',
    maxTitleLen: 60
  },
  {
    name: 'Guide 14',
    file: 'oci-card-cancellation-section-7d-legal-remedies.html',
    type: 'article',
    expectedCanonical: 'https://rrclawassociates.com/oci-card-cancellation-section-7d-legal-remedies/',
    maxTitleLen: 60
  }
];

const results = [];
let totalErrors = 0;
let totalWarnings = 0;

for (const p of pages) {
  const content = fs.readFileSync(p.file, 'utf8');
  const pageResult = {
    name: p.name,
    file: p.file,
    errors: [],
    warnings: [],
    metrics: {}
  };

  // 1. Title Check
  const titleM = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleM) {
    pageResult.errors.push('Missing <title> tag');
  } else {
    const rawTitle = titleM[1].trim();
    const cleanTitle = rawTitle.replace(/&amp;/g, '&');
    pageResult.metrics.title = cleanTitle;
    pageResult.metrics.titleLen = cleanTitle.length;

    if (p.expectedTitle) {
      if (cleanTitle !== p.expectedTitle) {
        pageResult.errors.push(`Critical title mismatch! Expected "${p.expectedTitle}", got "${cleanTitle}"`);
      }
    } else if (p.maxTitleLen && cleanTitle.length > p.maxTitleLen) {
      pageResult.warnings.push(`Title length (${cleanTitle.length}) exceeds max ${p.maxTitleLen}`);
    }
  }

  // 2. Meta Description Check
  const descM = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  if (!descM) {
    pageResult.errors.push('Missing meta description');
  } else {
    const desc = descM[1].trim();
    pageResult.metrics.desc = desc;
    pageResult.metrics.descLen = desc.length;
    if (desc.length < 130) {
      pageResult.warnings.push(`Meta description short (${desc.length} chars)`);
    } else if (desc.length > 165) {
      pageResult.warnings.push(`Meta description long (${desc.length} chars)`);
    }
  }

  // 3. Robots Tag Check
  const robotsM = content.match(/<meta\s+name=["']robots["']\s+content=["']([\s\S]*?)["']/i);
  if (!robotsM) {
    pageResult.errors.push('Missing <meta name="robots">');
  } else {
    const rVal = robotsM[1].toLowerCase();
    if (!rVal.includes('index') || !rVal.includes('follow')) {
      pageResult.errors.push(`Robots directive unexpected: "${robotsM[1]}"`);
    } else {
      pageResult.metrics.robots = robotsM[1];
    }
  }

  // 4. Canonical URL Check
  const canonM = content.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i);
  if (!canonM) {
    pageResult.errors.push('Missing canonical tag');
  } else {
    const cVal = canonM[1].trim();
    pageResult.metrics.canonical = cVal;
    if (cVal !== p.expectedCanonical) {
      pageResult.errors.push(`Canonical URL mismatch! Expected "${p.expectedCanonical}", got "${cVal}"`);
    }
  }

  // 5. OpenGraph & Twitter Tags
  const ogTitleM = content.match(/<meta\s+property=["']og:title["']\s+content=["']([\s\S]*?)["']/i);
  const ogDescM = content.match(/<meta\s+property=["']og:description["']\s+content=["']([\s\S]*?)["']/i);
  if (!ogTitleM) pageResult.warnings.push('Missing og:title');
  if (!ogDescM) pageResult.warnings.push('Missing og:description');

  // 6. Viewport Tag
  if (!content.includes('name="viewport"')) {
    pageResult.errors.push('Missing viewport tag for mobile responsiveness');
  }

  // 7. H1 Tag
  const h1M = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1M) {
    pageResult.errors.push('Missing <h1> tag');
  } else {
    const cleanH1 = h1M[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim().replace(/\s+/g, ' ');
    pageResult.metrics.h1 = cleanH1;
    if (p.expectedH1 && cleanH1 !== p.expectedH1) {
      pageResult.errors.push(`H1 mismatch! Expected "${p.expectedH1}", got "${cleanH1}"`);
    }
  }

  // 8. Structured Data JSON-LD
  const schemaRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let sm;
  let schemasFound = 0;
  const typesFound = [];
  while ((sm = schemaRegex.exec(content)) !== null) {
    schemasFound++;
    try {
      const parsed = JSON.parse(sm[1]);
      if (parsed['@graph']) {
        parsed['@graph'].forEach(n => {
          typesFound.push(n['@type']);
          // Check for .html in BreadcrumbList items
          if (n['@type'] === 'BreadcrumbList' && n.itemListElement) {
            n.itemListElement.forEach(item => {
              if (item.item && (item.item.includes('.html') && !item.item.includes('eservices.tn.gov.in'))) {
                pageResult.errors.push(`JSON-LD BreadcrumbList contains .html: ${item.item}`);
              }
            });
          }
        });
      } else {
        typesFound.push(parsed['@type']);
      }
    } catch(e) {
      pageResult.errors.push(`JSON-LD parse error: ${e.message}`);
    }
  }
  if (schemasFound === 0) {
    pageResult.errors.push('No JSON-LD schema found');
  }
  pageResult.metrics.schemaTypes = typesFound;

  // 9. Internal Links to OCI Ecosystem (must not have .html)
  const ociHtmlRegex = /href=["']([^"']*(?:oci-card|oci-legal|oci-vs|oci-for|nri-oci)[^"']*\.html[^"']*)["']/gi;
  let lm;
  while ((lm = ociHtmlRegex.exec(content)) !== null) {
    pageResult.errors.push(`Found internal link with .html to OCI page: ${lm[1]}`);
  }

  // 10. Image Dimensions and Alt Text
  const imgRegex = /<img\s+([^>]*?)>/gi;
  let im;
  let totalImgs = 0;
  let missingDims = 0;
  let missingAlts = 0;
  while ((im = imgRegex.exec(content)) !== null) {
    totalImgs++;
    const attrs = im[1];
    const hasWidth = /width=["']?\d+/i.test(attrs);
    const hasHeight = /height=["']?\d+/i.test(attrs);
    const hasAlt = /alt=["'][^"']+["']/i.test(attrs);

    if (!hasWidth || !hasHeight) {
      missingDims++;
      const srcM = attrs.match(/src=["']([^"']+)["']/i);
      pageResult.warnings.push(`Image missing dimensions: ${srcM ? srcM[1] : 'unknown'}`);
    }
    if (!hasAlt) {
      missingAlts++;
      const srcM = attrs.match(/src=["']([^"']+)["']/i);
      pageResult.warnings.push(`Image missing alt text: ${srcM ? srcM[1] : 'unknown'}`);
    }
  }
  pageResult.metrics.images = { total: totalImgs, missingDims, missingAlts };

  totalErrors += pageResult.errors.length;
  totalWarnings += pageResult.warnings.length;
  results.push(pageResult);
}

fs.writeFileSync('scratch/full_verification_report.json', JSON.stringify(results, null, 2), 'utf8');

console.log('====================================================');
console.log('   RRC LAW ASSOCIATES - OCI ECOSYSTEM SEO AUDIT     ');
console.log('====================================================');
console.log(`Total Pages Inspected: ${results.length}`);
console.log(`Total Critical Errors: ${totalErrors}`);
console.log(`Total Warnings: ${totalWarnings}`);
console.log('----------------------------------------------------');

results.forEach(r => {
  const status = r.errors.length === 0 ? (r.warnings.length === 0 ? '✓ PASS' : '! PASS (with warnings)') : '✗ FAIL';
  console.log(`[${status}] ${r.name.padEnd(22)} | Title (${String(r.metrics.titleLen).padStart(2)} chars) | Meta (${String(r.metrics.descLen).padStart(3)} chars) | Schema: [${r.metrics.schemaTypes.join(', ')}]`);
  if (r.errors.length > 0) {
    r.errors.forEach(e => console.log(`       ERROR: ${e}`));
  }
  if (r.warnings.length > 0) {
    r.warnings.forEach(w => console.log(`       WARN:  ${w}`));
  }
});
