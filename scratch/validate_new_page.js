const fs = require('fs');

const content = fs.readFileSync('wills-probate-estate-administration.html', 'utf8');

// Title check
const tm = content.match(/<title>([\s\S]*?)<\/title>/i);
console.log('Title (' + tm[1].length + ' chars):', tm[1]);

// Meta check
const dm = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
console.log('Meta (' + dm[1].length + ' chars):', dm[1]);

// JSON-LD check
const sm = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
if (sm) {
  try {
    const json = JSON.parse(sm[1]);
    console.log('JSON-LD valid. Types:', json['@graph'].map(x => x['@type']));
  } catch(e) {
    console.error('JSON-LD ERROR:', e.message);
  }
} else {
  console.log('No JSON-LD found');
}

// Check images for dimensions and alt
const imgRegex = /<img\s+([^>]*?)>/gi;
let im;
let count = 0;
while ((im = imgRegex.exec(content)) !== null) {
  count++;
  const tag = im[1];
  const hasW = /width=/i.test(tag);
  const hasH = /height=/i.test(tag);
  const hasAlt = /alt=/i.test(tag);
  if (!hasW || !hasH || !hasAlt) {
    console.warn('Image missing attrs:', tag);
  }
}
console.log('Total images validated:', count);
