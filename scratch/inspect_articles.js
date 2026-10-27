const fs = require('fs');

const articles = [
  { file: 'oci-card-eligibility-legal-status.html', num: 1 },
  { file: 'oci-vs-nri-vs-indian-citizen.html', num: 2 },
  { file: 'oci-card-application-documents.html', num: 3 },
  { file: 'oci-card-indian-ancestry-assistance.html', num: 4 },
  { file: 'oci-foreign-spouse-eligibility.html', num: 5 },
  { file: 'oci-for-children-born-abroad.html', num: 6 },
  { file: 'oci-card-benefits-restrictions-india.html', num: 7 },
  { file: 'oci-cardholders-inherit-sell-ancestral-property-india.html', num: 8 },
  { file: 'nri-oci-property-due-diligence-india.html', num: 10 },
  { file: 'nri-oci-property-tax-india.html', num: 11 },
  { file: 'oci-card-renewal-passport-update.html', num: 12 },
  { file: 'oci-card-cancellation-grounds-remedies.html', num: 13 },
  { file: 'oci-card-cancellation-section-7d-legal-remedies.html', num: 14 }
];

const results = [];

for (const a of articles) {
  const content = fs.readFileSync(a.file, 'utf8');
  
  const titleM = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleM ? titleM[1].trim() : '';
  
  const descM = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const desc = descM ? descM[1].trim() : '';

  const robotsM = content.match(/<meta\s+name=["']robots["']\s+content=["']([\s\S]*?)["']/i);
  const robots = robotsM ? robotsM[1].trim() : 'NONE';

  const canonM = content.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i);
  const canonical = canonM ? canonM[1].trim() : '';

  const h1M = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1M ? h1M[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') : '';

  // count .html hrefs
  const htmlLinks = [];
  const linkRegex = /href=["']([^"']*\.html[^"']*)["']/g;
  let lm;
  while ((lm = linkRegex.exec(content)) !== null) {
    htmlLinks.push(lm[1]);
  }

  // Schema
  const schemaRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let sm;
  let schemaTypes = [];
  while ((sm = schemaRegex.exec(content)) !== null) {
    try {
      const parsed = JSON.parse(sm[1]);
      if (parsed['@graph']) {
        schemaTypes.push(...parsed['@graph'].map(x => x['@type']));
      } else {
        schemaTypes.push(parsed['@type']);
      }
    } catch(e) {
      schemaTypes.push('ERR: ' + e.message);
    }
  }

  // Images without dimensions
  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let im;
  let imgsMissingDims = [];
  while ((im = imgRegex.exec(content)) !== null) {
    const tag = im[0];
    if (!/width=/i.test(tag) || !/height=/i.test(tag)) {
      imgsMissingDims.push(im[1]);
    }
  }

  results.push({
    file: a.file,
    num: a.num,
    title,
    titleLen: title.length,
    desc,
    descLen: desc.length,
    robots,
    canonical,
    h1,
    htmlLinksCount: htmlLinks.length,
    schemaTypes,
    imgsMissingDims
  });
}

fs.writeFileSync('scratch/articles_inspection.json', JSON.stringify(results, null, 2), 'utf8');
console.log('Inspected', results.length, 'articles.');
results.forEach(r => {
  console.log(`Guide ${r.num} (${r.file}): Title (${r.titleLen}): "${r.title.substring(0, 40)}..." | Desc (${r.descLen}) | Robots: ${r.robots} | Schema: [${r.schemaTypes.join(', ')}] | .html links: ${r.htmlLinksCount} | missing img dims: ${r.imgsMissingDims.length}`);
});
