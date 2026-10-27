const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const stats = {
    totalFiles: files.length,
    filesWithHtmlLinks: 0,
    filesWithCleanLinks: 0,
    examples: []
};

for (const f of files) {
    const c = fs.readFileSync(f, 'utf8');
    const hasHtml = /href="[^"]+\.html"/g.test(c);
    const hasClean = /href="\/(?!assets|style|favicon|site)[^".]+"/g.test(c);
    if (hasHtml) stats.filesWithHtmlLinks++;
    if (hasClean) stats.filesWithCleanLinks++;
}

console.log(JSON.stringify(stats, null, 2));

