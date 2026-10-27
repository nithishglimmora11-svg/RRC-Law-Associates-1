const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const withNewLink = [];
const withHtmlLink = [];
for (const f of files) {
    const c = fs.readFileSync(f, 'utf8');
    if (c.includes('/wills-probate-estate-administration')) {
        withNewLink.push(f);
    }
    if (c.includes('wills-probate-estate-administration.html')) {
        withHtmlLink.push(f);
    }
}
console.log('Files with /wills-probate-estate-administration:', withNewLink.length);
console.log('Files with wills-probate-estate-administration.html:', withHtmlLink.length);

