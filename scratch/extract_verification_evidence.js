const fs = require('fs');

const files = [
  'family-law.html',
  'core-practice-areas.html',
  'nri-property-disputes.html',
  'oci-cardholders-inherit-sell-ancestral-property-india.html',
  'blog-brother-claim-ancestral-property-long-possession.html',
  'nri-oci-property-tax-india.html',
  'nri-power-of-attorney.html',
  'index.html',
  'booking.html'
];

const results = {};

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Title
  const tm = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = tm ? tm[1].replace(/&amp;/g, '&').trim() : '';

  // Meta description
  const dm = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const desc = dm ? dm[1].replace(/&amp;/g, '&').trim() : '';

  // Canonical
  const cm = content.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i);
  const canonical = cm ? cm[1].trim() : '';

  // H1
  const h1m = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1m ? h1m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim().replace(/\s+/g, ' ') : '';

  // Headings with line numbers
  const lines = content.split('\n');
  const relevantHeadings = [];
  lines.forEach((l, idx) => {
    if (/<h[1-4]/i.test(l)) {
      const cleanH = l.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
      if (/will|probate|succession|estate|heir|inherit|ancestral|partition|settlement/i.test(cleanH)) {
        relevantHeadings.push({ line: idx + 1, text: cleanH });
      }
    }
  });

  // Extract specific verbatim sections
  const verbatimSnippets = [];
  lines.forEach((l, idx) => {
    if (/wills & estate|probate|succession certificate|legal heir certificate|codicil|testamentary/i.test(l)) {
      const text = l.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
      if (text.length > 15 && text.length < 350) {
        verbatimSnippets.push({ line: idx + 1, text });
      }
    }
  });

  // Internal links on this page
  const internalLinks = [];
  const linkRegex = /href=["']([^"']+)["']/gi;
  let lm;
  while ((lm = linkRegex.exec(content)) !== null) {
    const href = lm[1];
    if (href.startsWith('/') || href.includes('.html')) {
      internalLinks.push(href);
    }
  }

  // Enquiry / CTA buttons
  const ctas = [];
  lines.forEach((l, idx) => {
    if (/booking|consultation|enquire|whatsapp|wa\.me|call now|contact/i.test(l) && /<a /i.test(l)) {
      const text = l.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
      if (text.length > 5 && text.length < 100) {
        ctas.push({ line: idx + 1, text });
      }
    }
  });

  results[file] = {
    title,
    desc,
    canonical,
    h1,
    relevantHeadings,
    verbatimSnippets,
    totalLinks: internalLinks.length,
    sampleCtas: ctas.slice(0, 5)
  };
});

fs.writeFileSync('scratch/validation_raw_extract.json', JSON.stringify(results, null, 2), 'utf8');

console.log('Verification extraction complete for all 9 files.');
