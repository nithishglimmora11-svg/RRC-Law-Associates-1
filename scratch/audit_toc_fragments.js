const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\nithi\\RRC-Law-Associates-1';
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const tocIssues = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf-8');

  // Collect all element IDs in this page
  const idRegex = /\sid=["']([^"']+)["']/gi;
  const ids = new Set();
  let im;
  while ((im = idRegex.exec(content)) !== null) {
    ids.add(im[1]);
  }

  // Find TOC links
  // Usually in .toc-list, .table-of-contents, or aside
  const tocMatches = content.match(/<(ul|ol)[^>]*?class=["'][^"']*(toc-list|table-of-contents|toc)[^"']*["'][\s\S]*?<\/\1>/gi);
  if (tocMatches) {
    tocMatches.forEach(tocHtml => {
      const aRegex = /<a\s+[^>]*?href=["'](#\w[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let am;
      while ((am = aRegex.exec(tocHtml)) !== null) {
        const frag = am[1].substring(1);
        const text = am[2].replace(/<[^>]+>/g, '').trim();
        if (!ids.has(frag)) {
          tocIssues.push({
            file: f,
            fragment: am[1],
            text,
            issue: `Target id "${frag}" not found in ${f}`
          });
        }
      }
    });
  }
});

console.log(`TOC Fragment Audit across all files:`);
console.log(`Total broken TOC fragments: ${tocIssues.length}`);
if (tocIssues.length > 0) {
  console.log(JSON.stringify(tocIssues, null, 2));
} else {
  console.log('ALL Table of Contents links across all articles are 100% VALID!');
}
