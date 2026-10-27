const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const nestedLinks = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /href=["']([^"']+)["']/gi;
    let m;
    while ((m = regex.exec(content)) !== null) {
        const href = m[1];
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
            continue;
        }
        // Check if relative path has a slash inside it (i.e. nested path, excluding ./ )
        const clean = href.replace(/^\.\//, '');
        if (clean.includes('/') && !clean.startsWith('assets/')) {
            nestedLinks.push({ file, href, clean });
        }
    }
});

console.log('Total non-asset nested internal links found:', nestedLinks.length);
const uniqueLinks = [...new Set(nestedLinks.map(l => l.href))];
console.log('Unique nested links:', uniqueLinks);

// Also search for "nri-legal-services" specifically in all HTML files
const nriServiceOccurrences = [];
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('nri-legal-services')) {
        nriServiceOccurrences.push(file);
    }
});
console.log('Files mentioning nri-legal-services:', nriServiceOccurrences);
