const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\nithi\\RRC-Law-Associates-1';

// Discover all HTML files
function getHtmlFiles(dir, baseDir = '') {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'scratch' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(baseDir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath, relPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(relPath);
    }
  }
  return files;
}

const allHtmlFiles = getHtmlFiles(rootDir);
console.log(`Discovered ${allHtmlFiles.length} HTML files.`);

const rootPages = allHtmlFiles.filter(f => !f.includes('/'));
const nestedPages = allHtmlFiles.filter(f => f.includes('/'));

console.log(`Root pages: ${rootPages.length}, Nested pages: ${nestedPages.length}`);

// Analysis data structures
const pageAudits = {};
const allLinks = [];
const brokenFileLinks = [];
const brokenFragmentLinks = [];
const emptyOrHashLinks = [];

for (const relFile of allHtmlFiles) {
  const filePath = path.join(rootDir, relFile);
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileDir = path.dirname(filePath);

  // Collect all IDs in this file for fragment validation
  const idRegex = /\sid=["']([^"']+)["']/gi;
  const ids = new Set();
  let idMatch;
  while ((idMatch = idRegex.exec(content)) !== null) {
    ids.add(idMatch[1]);
  }

  // Extract all <a> tags
  const aRegex = /<a\s+([^>]*?)href=["']([^"']*)["']([^>]*?)>([\s\S]*?)<\/a>/gi;
  let aMatch;
  const linksInFile = [];

  while ((aMatch = aRegex.exec(content)) !== null) {
    const rawAttrs = aMatch[1] + ' ' + aMatch[3];
    const rawHref = aMatch[2].trim();
    const rawText = aMatch[4].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    
    // Class or id if available
    const classMatch = rawAttrs.match(/class=["']([^"']+)["']/i);
    const idAttrMatch = rawAttrs.match(/id=["']([^"']+)["']/i);
    const className = classMatch ? classMatch[1] : '';
    const elemId = idAttrMatch ? idAttrMatch[1] : '';

    const linkInfo = {
      sourceFile: relFile,
      text: rawText || '[No visible text / Icon]',
      href: rawHref,
      className,
      elemId,
      status: 'OK',
      error: null
    };

    // Analyze href type
    if (rawHref === '' || rawHref === '#') {
      linkInfo.type = 'empty_or_hash';
      linkInfo.status = 'EMPTY_OR_HASH';
      emptyOrHashLinks.push(linkInfo);
    } else if (rawHref.startsWith('javascript:')) {
      linkInfo.type = 'javascript';
    } else if (rawHref.startsWith('tel:') || rawHref.startsWith('mailto:')) {
      linkInfo.type = 'protocol';
    } else if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
      if (rawHref.includes('wa.me') || rawHref.includes('whatsapp.com')) {
        linkInfo.type = 'whatsapp';
      } else if (rawHref.includes('rrclawassociates.com')) {
        linkInfo.type = 'canonical_internal';
      } else {
        linkInfo.type = 'external';
      }
    } else if (rawHref.startsWith('#')) {
      linkInfo.type = 'same_page_fragment';
      const targetId = rawHref.substring(1);
      if (!ids.has(targetId)) {
        linkInfo.status = 'BROKEN_FRAGMENT';
        linkInfo.error = `Target fragment id "${targetId}" not found in ${relFile}`;
        brokenFragmentLinks.push(linkInfo);
      }
    } else {
      // Relative internal link (may include #fragment)
      linkInfo.type = 'relative_internal';
      const [pathPart, fragmentPart] = rawHref.split('#');
      
      // Resolve path
      let resolvedPath;
      if (pathPart.startsWith('/')) {
        resolvedPath = path.join(rootDir, pathPart.substring(1));
      } else {
        resolvedPath = path.resolve(fileDir, pathPart);
      }

      // Check if file exists
      // Could be directory with index.html or exact file or .html omitted
      let fileExists = false;
      let actualTargetFile = null;

      if (fs.existsSync(resolvedPath)) {
        const stat = fs.statSync(resolvedPath);
        if (stat.isFile()) {
          fileExists = true;
          actualTargetFile = resolvedPath;
        } else if (stat.isDirectory()) {
          const indexHtml = path.join(resolvedPath, 'index.html');
          if (fs.existsSync(indexHtml)) {
            fileExists = true;
            actualTargetFile = indexHtml;
          }
        }
      } else if (fs.existsSync(resolvedPath + '.html')) {
        fileExists = true;
        actualTargetFile = resolvedPath + '.html';
      }

      if (!fileExists) {
        linkInfo.status = 'BROKEN_FILE';
        linkInfo.error = `File not found: ${pathPart} (resolved to ${resolvedPath})`;
        brokenFileLinks.push(linkInfo);
      } else {
        // If fragment present, check if fragment exists in target file
        if (fragmentPart) {
          const targetContent = fs.readFileSync(actualTargetFile, 'utf-8');
          const targetIdRegex = new RegExp(`\\sid=["']${fragmentPart}["']`, 'i');
          if (!targetIdRegex.test(targetContent)) {
            linkInfo.status = 'BROKEN_FRAGMENT';
            linkInfo.error = `Fragment id "${fragmentPart}" not found in target file ${pathPart}`;
            brokenFragmentLinks.push(linkInfo);
          }
        }
      }
    }

    linksInFile.push(linkInfo);
    allLinks.push(linkInfo);
  }

  pageAudits[relFile] = {
    totalLinks: linksInFile.length,
    links: linksInFile
  };
}

console.log(`\n================ AUDIT SUMMARY ================`);
console.log(`Total links audited across all pages: ${allLinks.length}`);
console.log(`Broken internal file links: ${brokenFileLinks.length}`);
console.log(`Broken fragment links: ${brokenFragmentLinks.length}`);
console.log(`Empty or "#" placeholder links: ${emptyOrHashLinks.length}`);

if (brokenFileLinks.length > 0) {
  console.log(`\n--- BROKEN FILE LINKS ---`);
  brokenFileLinks.forEach(l => console.log(`[${l.sourceFile}] "${l.text}" -> ${l.href} (${l.error})`));
}

if (brokenFragmentLinks.length > 0) {
  console.log(`\n--- BROKEN FRAGMENT LINKS ---`);
  brokenFragmentLinks.forEach(l => console.log(`[${l.sourceFile}] "${l.text}" -> ${l.href} (${l.error})`));
}

if (emptyOrHashLinks.length > 0) {
  console.log(`\n--- EMPTY OR HASH LINKS (Summary by file) ---`);
  const hashCountByFile = {};
  emptyOrHashLinks.forEach(l => {
    hashCountByFile[l.sourceFile] = (hashCountByFile[l.sourceFile] || 0) + 1;
  });
  console.log(JSON.stringify(hashCountByFile, null, 2));
}

// Write full audit result to JSON for detailed processing
fs.writeFileSync(
  path.join(rootDir, 'scratch', 'static_audit_results.json'),
  JSON.stringify({
    summary: {
      totalFiles: allHtmlFiles.length,
      rootFiles: rootPages.length,
      nestedFiles: nestedPages.length,
      totalLinks: allLinks.length,
      brokenFileLinksCount: brokenFileLinks.length,
      brokenFragmentLinksCount: brokenFragmentLinks.length,
      emptyOrHashLinksCount: emptyOrHashLinks.length
    },
    brokenFileLinks,
    brokenFragmentLinks,
    emptyOrHashLinks
  }, null, 2)
);

console.log('\nAudit written to scratch/static_audit_results.json');
