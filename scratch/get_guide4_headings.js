const fs = require('fs');
const content = fs.readFileSync('oci-card-indian-ancestry-assistance.html', 'utf8');
const hs = content.match(/<h[23][^>]*>[\s\S]*?<\/h[23]>/gi) || [];
hs.forEach(h => console.log(h.replace(/<[^>]+>/g, '').trim()));
