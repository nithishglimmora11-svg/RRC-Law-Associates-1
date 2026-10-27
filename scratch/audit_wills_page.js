const fs = require('fs');

const content = fs.readFileSync('wills-probate-estate-administration.html', 'utf8');

// 1. Headings
const headings = [];
const hRegex = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
let m;
while ((m = hRegex.exec(content)) !== null) {
    headings.push({ tag: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() });
}
console.log('=== HEADINGS ===');
console.log(headings);

// 2. Images
const images = [];
const imgRegex = /<img([^>]+)>/gi;
while ((m = imgRegex.exec(content)) !== null) {
    images.push(m[1].trim());
}
console.log('=== IMAGES ===');
console.log(images);

// 3. Sections
const sections = [];
const sRegex = /<section[^>]*id=["']([^"']*)["'][^>]*>/gi;
while ((m = sRegex.exec(content)) !== null) {
    sections.push(m[1]);
}
console.log('=== SECTIONS WITH IDS ===');
console.log(sections);

