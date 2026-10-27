const fs = require('fs');

let html = fs.readFileSync('wills-probate-estate-administration.html', 'utf8');

// Replace poa-adjudication.png with picture tag
const oldPoa = '<img src="/assets/images/poa-adjudication.png" alt="NRI Power of Attorney and FEMA Compliance" class="img-fluid rounded-4 shadow-sm" width="1408" height="768" loading="lazy">';
const newPoa = `<picture>
                            <source srcset="/assets/images/poa-adjudication.webp" type="image/webp">
                            <img src="/assets/images/poa-adjudication.png" alt="NRI Power of Attorney and FEMA Compliance" class="img-fluid rounded-4 shadow-sm" width="1408" height="768" loading="lazy">
                        </picture>`;

// Replace settlement-banner.png with picture tag
const oldSettlement = '<img src="/assets/images/settlement-banner.png" alt="Resolving Contested Inheritance and Family Settlements" class="img-fluid rounded-4 shadow-sm" width="1408" height="768" loading="lazy">';
const newSettlement = `<picture>
                            <source srcset="/assets/images/settlement-banner.webp" type="image/webp">
                            <img src="/assets/images/settlement-banner.png" alt="Resolving Contested Inheritance and Family Settlements" class="img-fluid rounded-4 shadow-sm" width="1408" height="768" loading="lazy">
                        </picture>`;

if (html.includes(oldPoa)) {
    html = html.replace(oldPoa, newPoa);
    console.log('Replaced POA image with picture tag');
}

if (html.includes(oldSettlement)) {
    html = html.replace(oldSettlement, newSettlement);
    console.log('Replaced Settlement image with picture tag');
}

fs.writeFileSync('wills-probate-estate-administration.html', html, 'utf8');
console.log('Updated wills-probate-estate-administration.html with webp picture tags');

