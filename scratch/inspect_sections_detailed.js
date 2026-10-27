const fs = require('fs');
const html = fs.readFileSync('wills-probate-estate-administration.html', 'utf8');

// Find all <section> or <div class="container">
const sections = [];
const regex = /<section[\s\S]*?<\/section>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
    const sectionHtml = match[0];
    const idMatch = sectionHtml.match(/id="([^"]+)"/);
    const classMatch = sectionHtml.match(/class="([^"]+)"/);
    const h1Match = sectionHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h2Match = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const h3Matches = [...sectionHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    
    sections.push({
        id: idMatch ? idMatch[1] : null,
        class: classMatch ? classMatch[1] : null,
        h1: h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null,
        h2: h2Match ? h2Match[1].replace(/<[^>]+>/g, '').trim() : null,
        h3s: h3Matches,
        length: sectionHtml.length
    });
}

console.log('Total sections found:', sections.length);
sections.forEach((s, idx) => {
    console.log(`[${idx}] ID: ${s.id || 'none'} | Class: ${s.class} | Heading: ${s.h1 || s.h2 || 'None'} | H3s: ${s.h3s.length}`);
});

