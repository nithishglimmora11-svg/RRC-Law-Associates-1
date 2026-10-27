const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/i);
if (footerMatch) {
    console.log(footerMatch[0]);
} else {
    console.log('No footer tag found, searching for class="footer"');
    const footerClassMatch = content.match(/<div[^>]*class=["'][^"']*footer[^"']*["'][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i);
    if (footerClassMatch) console.log(footerClassMatch[0].slice(0, 1000));
}

