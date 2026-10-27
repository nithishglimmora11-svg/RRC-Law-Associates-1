const fs = require('fs');
const f1 = fs.readFileSync('oci-card-eligibility-legal-status.html', 'utf8');
const f2 = fs.readFileSync('oci-card-benefits-restrictions-india.html', 'utf8');

console.log('f1 html css:', f1.match(/html\s*\{[^}]+\}/i)?.[0]);
console.log('f2 html css:', f2.match(/html\s*\{[^}]+\}/i)?.[0]);

// Let's search for "overflow-x" in f1 and f2
console.log('f1 overflow-x occurrences:', f1.match(/[^{}]+overflow-x[^{}]+;/gi));
console.log('f2 overflow-x occurrences:', f2.match(/[^{}]+overflow-x[^{}]+;/gi));
