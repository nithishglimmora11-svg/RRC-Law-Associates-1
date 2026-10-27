const fs = require('fs');
const path = require('path');

const pages = [
  'oci-card-assistance.html',
  'oci-legal-guides.html',
  'oci-card-eligibility-legal-status.html',
  'oci-vs-nri-vs-indian-citizen.html',
  'oci-card-application-documents.html',
  'oci-card-indian-ancestry-assistance.html',
  'oci-foreign-spouse-eligibility.html',
  'oci-for-children-born-abroad.html',
  'oci-card-benefits-restrictions-india.html',
  'oci-cardholders-inherit-sell-ancestral-property-india.html',
  'nri-oci-property-due-diligence-india.html',
  'nri-oci-property-tax-india.html',
  'oci-card-renewal-passport-update.html',
  'oci-card-cancellation-grounds-remedies.html',
  'oci-card-cancellation-section-7d-legal-remedies.html'
];

const results = [];

for (const file of pages) {
  if (!fs.existsSync(file)) {
    results.push({ file, error: 'File does not exist' });
    continue;
  }
  const stat = fs.statSync(file);
  const html = fs.readFileSync(file, 'utf8');

  // Title
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';

  // Meta description
  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) ||
                        html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

  // Canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) ||
                         html.match(/<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';

  // Robots
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  const robots = robotsMatch ? robotsMatch[1].trim() : '';

  // OG tags
  const ogTitle = (html.match(/<meta\s+property=["']og:title["']\s+content=["']([\s\S]*?)["']/i) || [])[1] || '';
  const ogDesc = (html.match(/<meta\s+property=["']og:description["']\s+content=["']([\s\S]*?)["']/i) || [])[1] || '';
  const ogUrl = (html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i) || [])[1] || '';
  const ogImage = (html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i) || [])[1] || '';

  // Headings
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  const h3Count = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].length;

  // JSON-LD
  const jsonLdBlocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)].map(m => {
    try {
      return JSON.parse(m[1].trim());
    } catch (e) {
      return { parseError: e.message, raw: m[1].substring(0, 100) };
    }
  });

  // Images
  const images = [...html.matchAll(/<img\s+([^>]*?)>/gi)].map(m => {
    const attr = m[1];
    const src = (attr.match(/src=["']([^"']*)["']/i) || [])[1] || '';
    const alt = (attr.match(/alt=["']([^"']*)["']/i) || [])[1];
    const loading = (attr.match(/loading=["']([^"']*)["']/i) || [])[1] || '';
    return { src, alt, loading };
  });

  // Links
  const internalLinks = [...html.matchAll(/<a\s+[^>]*?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => {
    return {
      href: m[1].trim(),
      anchor: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    };
  }).filter(l => !l.href.startsWith('http://') && !l.href.startsWith('https://') && !l.href.startsWith('tel:') && !l.href.startsWith('mailto:') && !l.href.startsWith('javascript:') && !l.href.startsWith('#'));

  results.push({
    file,
    sizeKb: Math.round(stat.size / 1024),
    title,
    titleLen: title.length,
    metaDesc,
    metaDescLen: metaDesc.length,
    canonical,
    robots,
    ogTitle,
    ogDesc,
    ogUrl,
    ogImage,
    h1s,
    h2Count: h2s.length,
    h2s: h2s.slice(0, 5),
    h3Count,
    jsonLdTypes: jsonLdBlocks.map(j => j['@type'] || (j['@graph'] ? j['@graph'].map(g => g['@type']) : 'unknown')),
    hasParseError: jsonLdBlocks.some(j => j.parseError),
    totalImages: images.length,
    imagesWithoutAlt: images.filter(i => i.alt === undefined || i.alt === '').length,
    internalLinksCount: internalLinks.length,
    sampleInternalLinks: internalLinks.slice(0, 10)
  });
}

fs.writeFileSync('scratch/audit_results.json', JSON.stringify(results, null, 2), 'utf8');
console.log('Audit complete for', results.length, 'pages.');
