const fs = require('fs');

const content = fs.readFileSync('nri-property-disputes.html', 'utf8');
const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/i);
if (footerMatch) {
    console.log(footerMatch[0]);
}

