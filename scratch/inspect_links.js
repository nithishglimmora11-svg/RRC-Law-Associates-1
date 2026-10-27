const fs = require('fs');
const path = require('path');

function getLinks(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /href=["']([^"']+)["']/g;
    const links = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        const href = match[1];
        if (!href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:') && !href.startsWith('#') && !href.startsWith('//')) {
            links.push(href);
        }
    }
    return [...new Set(links)];
}

const files = ['index.html', 'nri-services.html', 'wills-probate-estate-administration.html', 'booking.html', 'oci-card-assistance.html'];
for (const f of files) {
    if (fs.existsSync(f)) {
        console.log(`=== ${f} ===`);
        console.log(getLinks(f));
    }
}

