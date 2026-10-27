const fs = require('fs');
const html = fs.readFileSync('wills-probate-estate-administration.html', 'utf8');
const classMatches = [...html.matchAll(/class=["']([^"']+)["']/g)];
const classSet = new Set();
classMatches.forEach(m => m[1].split(/\s+/).forEach(c => c && classSet.add(c)));

const style2Css = fs.readFileSync('style2.css', 'utf8');
const problematic = [];

for (const cls of classSet) {
    const regex = new RegExp(`\\.${cls}\\b[^{]*\\{[^}]*(opacity:\\s*0|display:\\s*none|visibility:\\s*hidden)[^}]*\\}`, 'gi');
    let m;
    while ((m = regex.exec(style2Css)) !== null) {
        problematic.push({ cls, rule: m[0] });
    }
}

console.log('Classes with opacity 0 / hidden in style2.css:');
console.log(problematic);

