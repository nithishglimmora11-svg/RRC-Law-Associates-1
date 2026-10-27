const fs = require('fs');
const html = fs.readFileSync('wills-probate-estate-administration.html', 'utf8');
const classMatches = [...html.matchAll(/class=["']([^"']+)["']/g)];
const classSet = new Set();
classMatches.forEach(m => m[1].split(/\s+/).forEach(c => c && classSet.add(c)));

console.log('Total unique classes:', classSet.size);

// Read style.css and find any of these classes that have opacity: 0 or display: none or visibility: hidden
const styleCss = fs.readFileSync('style.css', 'utf8');
const problematic = [];

for (const cls of classSet) {
    const regex = new RegExp(`\\.${cls}\\b[^{]*\\{[^}]*(opacity:\\s*0|display:\\s*none|visibility:\\s*hidden)[^}]*\\}`, 'gi');
    let m;
    while ((m = regex.exec(styleCss)) !== null) {
        problematic.push({ cls, rule: m[0] });
    }
}

console.log('Classes with opacity 0 / hidden in style.css:');
console.log(problematic);

