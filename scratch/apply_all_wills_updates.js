const fs = require('fs');

console.log('=== STARTING WILLS & PROBATE INTEGRATION ===\n');

// 1. Update NRI Services dropdown across all 45 other HTML files
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'wills-probate-estate-administration.html');

let desktopUpdated = 0;
let mobileUpdated = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Desktop dropdown
  const desktopRegex = /(<li>\s*<a\s+class=["']dropdown-item[^"']*["'][^>]*href=["'][^"']*oci-card-assistance[^"']*["'][^>]*>[\s\S]*?<\/a>\s*<\/li>)/i;
  if (desktopRegex.test(content) && !content.includes('/wills-probate-estate-administration')) {
    content = content.replace(desktopRegex, '$1\n                            <li>\n                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a>\n                            </li>');
    desktopUpdated++;
    changed = true;
  }

  // Mobile submenu
  const mobileRegex = /(<a\s+class=["']m-sub-item["'][^>]*href=["'][^"']*oci-card-assistance[^"']*["'][^>]*>[\s\S]*?<\/a>)/i;
  const willsCount = (content.match(/wills-probate-estate-administration/g) || []).length;
  // If desktop was added, willsCount will be 1, so mobile can add if willsCount < 2
  if (mobileRegex.test(content) && willsCount < 2) {
    content = content.replace(mobileRegex, '$1\n                        <a class="m-sub-item" href="/wills-probate-estate-administration">Wills, Probate &amp; Estate Administration</a>');
    mobileUpdated++;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log(`Updated Desktop Dropdown in ${desktopUpdated} files.`);
console.log(`Updated Mobile Submenu in ${mobileUpdated} files.`);

// 2. Update booking.html dropdown
let bookingContent = fs.readFileSync('booking.html', 'utf8');
if (!bookingContent.includes('<option>Wills, Probate &amp; Estate Administration</option>')) {
  bookingContent = bookingContent.replace(
    '<option>Others</option>',
    '<option>Wills, Probate &amp; Estate Administration</option>\n                                            <option>Others</option>'
  );
  fs.writeFileSync('booking.html', bookingContent, 'utf8');
  console.log('Updated booking.html category select.');
} else {
  console.log('booking.html already has Wills option.');
}

// 3. Update sitemap.xml
let sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
if (!sitemapContent.includes('/wills-probate-estate-administration')) {
  const target = `  <url>\n    <loc>https://rrclawassociates.com/oci-card-assistance</loc>\n    <priority>0.85</priority>\n  </url>`;
  const replacement = `  <url>\n    <loc>https://rrclawassociates.com/oci-card-assistance</loc>\n    <priority>0.85</priority>\n  </url>\n\n  <url>\n    <loc>https://rrclawassociates.com/wills-probate-estate-administration</loc>\n    <priority>0.85</priority>\n  </url>`;
  sitemapContent = sitemapContent.replace(target, replacement);
  fs.writeFileSync('sitemap.xml', sitemapContent, 'utf8');
  console.log('Updated sitemap.xml.');
} else {
  console.log('sitemap.xml already has wills-probate-estate-administration.');
}

// 4. Update .htaccess for clean routing of trailing slash
let htContent = fs.readFileSync('.htaccess', 'utf8');
if (!htContent.includes('wills-probate-estate-administration')) {
  const htTarget = `RewriteRule ^nri-legal-services/oci-card-assistance/?$ https://rrclawassociates.com/oci-card-assistance [R=301,L,NC]`;
  const htReplacement = `RewriteRule ^nri-legal-services/oci-card-assistance/?$ https://rrclawassociates.com/oci-card-assistance [R=301,L,NC]\nRewriteRule ^wills-probate-estate-administration/$ https://rrclawassociates.com/wills-probate-estate-administration [R=301,L,NC]`;
  htContent = htContent.replace(htTarget, htReplacement);
  fs.writeFileSync('.htaccess', htContent, 'utf8');
  console.log('Updated .htaccess clean URL routing.');
} else {
  console.log('.htaccess already has wills routing.');
}

// 5. Add contextual internal links in target pages

// A. nri-services.html
let nriContent = fs.readFileSync('nri-services.html', 'utf8');
if (!nriContent.includes('href="/wills-probate-estate-administration" class="text-decoration-none')) {
  const nriCardTarget = `                <div class="col-md-6 col-lg-4">\n                     <a href="./nri-family-matrimonial.html" class="text-decoration-none text-black">\n                        <div class="service-card">\n                            <div class="service-icon"><i class="fas fa-ring"></i></div>\n                            <h3 class="service-card-text" style="font-family: 'Playfair Display', serif; font-weight: bold;">NRI Family &amp; Matrimonial</h3>\n                            <p>Divorce matters involving NRI spouses, maintenance, and child custody disputes.</p>\n                            <p class="fw-bold service-card-text">Read more <i class="fa-solid fa-angles-right"></i></p>\n                        </div>\n                     </a>\n                </div>`;
  const nriCardReplacement = `${nriCardTarget}\n                <div class="col-md-6 col-lg-4">\n                    <a href="/wills-probate-estate-administration" class="text-decoration-none text-black">\n                        <div class="service-card">\n                            <div class="service-icon"><i class="fas fa-file-signature"></i></div>\n                            <h3 class="service-card-text" style="font-family: 'Playfair Display', serif; font-weight: bold;">Wills, Probate &amp; Estate Administration</h3>\n                            <p>Testamentary planning, Madras High Court &amp; District Court probate petitions, Section 372 succession certificates, and post-demise Patta mutation.</p>\n                            <p class="fw-bold service-card-text">Read more <i class="fa-solid fa-angles-right"></i></p>\n                        </div>\n                    </a>\n                </div>`;
  if (nriContent.includes(nriCardTarget)) {
    nriContent = nriContent.replace(nriCardTarget, nriCardReplacement);
    fs.writeFileSync('nri-services.html', nriContent, 'utf8');
    console.log('Added Wills service card to nri-services.html (6th card in grid).');
  } else {
    console.log('WARNING: Could not find exact nriCardTarget in nri-services.html');
  }
} else {
  console.log('nri-services.html already has Wills service card.');
}

// B. family-law.html
let famContent = fs.readFileSync('family-law.html', 'utf8');
if (!famContent.includes('/wills-probate-estate-administration')) {
  famContent = famContent.replace(
    'handling contested or uncontested Probate verification workflows across regional registries in Tamil Nadu.',
    'handling contested or uncontested Probate verification workflows across regional registries in Tamil Nadu. <a href="/wills-probate-estate-administration" class="text-gold fw-semibold d-inline-block mt-2">Explore our dedicated Wills, Probate &amp; Estate Administration Practice &rarr;</a>'
  );
  fs.writeFileSync('family-law.html', famContent, 'utf8');
  console.log('Added contextual link in family-law.html.');
} else {
  console.log('family-law.html already has contextual link.');
}

// C. core-practice-areas.html
let coreContent = fs.readFileSync('core-practice-areas.html', 'utf8');
if (!coreContent.includes('/wills-probate-estate-administration')) {
  coreContent = coreContent.replace(
    '<span class="feature-tag">Wills &amp; Estate Administration</span>',
    '<a href="/wills-probate-estate-administration" class="feature-tag text-decoration-none">Wills, Probate &amp; Estate Administration &rarr;</a>'
  );
  fs.writeFileSync('core-practice-areas.html', coreContent, 'utf8');
  console.log('Added contextual link in core-practice-areas.html.');
} else {
  console.log('core-practice-areas.html already has contextual link.');
}

// D. nri-property-disputes.html
let propContent = fs.readFileSync('nri-property-disputes.html', 'utf8');
if (!propContent.includes('/wills-probate-estate-administration')) {
  const propTarget = 'Our property lawyers ensure that legal heir certificates, release deeds, and family settlement frameworks are structurally watertight, avoiding future title challenges before civil courts';
  const propReplacement = 'Our property lawyers ensure that legal heir certificates, release deeds, and <a href="/wills-probate-estate-administration" class="text-gold fw-semibold">Wills, probate, and estate administration frameworks</a> are structurally watertight, avoiding future title challenges before civil courts';
  if (propContent.includes(propTarget)) {
    propContent = propContent.replace(propTarget, propReplacement);
    fs.writeFileSync('nri-property-disputes.html', propContent, 'utf8');
    console.log('Added contextual link in nri-property-disputes.html.');
  } else {
    console.log('WARNING: Could not find propTarget in nri-property-disputes.html');
  }
} else {
  console.log('nri-property-disputes.html already has contextual link.');
}

// E. oci-cardholders-inherit-sell-ancestral-property-india.html
let ociPropContent = fs.readFileSync('oci-cardholders-inherit-sell-ancestral-property-india.html', 'utf8');
if (!ociPropContent.includes('/wills-probate-estate-administration')) {
  const ociPropTarget = '<li>Probate, letters of administration or court orders, where applicable.</li>';
  const ociPropReplacement = '<li>Probate, letters of administration or court orders, where applicable. (See our dedicated <a href="/wills-probate-estate-administration" class="text-gold fw-semibold">Wills, Probate &amp; Estate Administration Practice</a> for court filing procedures in Tamil Nadu).</li>';
  if (ociPropContent.includes(ociPropTarget)) {
    ociPropContent = ociPropContent.replace(ociPropTarget, ociPropReplacement);
    fs.writeFileSync('oci-cardholders-inherit-sell-ancestral-property-india.html', ociPropContent, 'utf8');
    console.log('Added contextual link in oci-cardholders-inherit-sell-ancestral-property-india.html.');
  } else {
    console.log('WARNING: Could not find ociPropTarget in oci-cardholders-inherit-sell-ancestral-property-india.html');
  }
} else {
  console.log('oci-cardholders-inherit-sell-ancestral-property-india.html already has contextual link.');
}

console.log('\n=== INTEGRATION SCRIPT COMPLETED ===');
