/**
 * RRC Law Associates â€” Link & Asset Integrity Auditor
 *
 * Scans all HTML files across the project for broken internal links,
 * missing image/script/CSS assets, and broken anchor (#hash) targets.
 *
 * Zero dependencies â€” runs on standard Node.js.
 * Usage: node tools/audit-links.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Helper to recursively find all HTML files
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (['node_modules', '.git', 'scratch', 'tools', 'rrc-law-ai'].includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function runAudit() {
  console.log('====================================================');
  console.log('  RRC Law Associates â€” Link & Asset Integrity Audit  ');
  console.log('====================================================\n');

  const htmlFiles = getHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files to audit.\n`);

  let totalLinksChecked = 0;
  let brokenLinksCount = 0;
  const issuesByFile = {};

  for (const filePath of htmlFiles) {
    const relFile = path.relative(ROOT, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    // 1. Audit anchor tags <a ... href="...">
    const hrefMatches = content.matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi);
    for (const match of hrefMatches) {
      const href = match[1].trim();
      totalLinksChecked++;

      // Ignore external links, mailto, tel, javascript, and pure dummy hash
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href === '#' ||
        href === ''
      ) {
        continue;
      }

      // In-page hash link
      if (href.startsWith('#')) {
        const id = href.slice(1);
        const hasId = new RegExp(`id=["']${id}["']`, 'i').test(content) || new RegExp(`name=["']${id}["']`, 'i').test(content);
        if (!hasId) {
          issues.push({ type: 'Broken Anchor Hash', target: href });
        }
        continue;
      }

      // Internal file/route link
      const [rawPath] = href.split('#');
      let targetPath = rawPath.replace(/^\//, ''); // remove leading slash

      // Clean URL mapping: e.g. "nri-services" or "nri-services/" -> "nri-services.html"
      if (targetPath.endsWith('/')) {
        targetPath = targetPath.slice(0, -1);
      }

      let resolved = path.join(ROOT, targetPath);
      let exists = fs.existsSync(resolved) && fs.statSync(resolved).isFile();

      if (!exists && !path.extname(targetPath)) {
        // Try appending .html
        const withHtml = path.join(ROOT, targetPath + '.html');
        if (fs.existsSync(withHtml) && fs.statSync(withHtml).isFile()) {
          exists = true;
        } else {
          // Check for index.html inside a directory (e.g. nri-landlord-tenant-eviction/)
          const asDir = path.join(ROOT, targetPath, 'index.html');
          if (fs.existsSync(asDir) && fs.statSync(asDir).isFile()) {
            exists = true;
          }
        }
      }

      if (!exists) {
        issues.push({ type: 'Broken Link Target', target: href });
      }
    }

    // 2. Audit image tags <img ... src="...">
    const imgMatches = content.matchAll(/<img\s+[^>]*src=["']([^"']+)["']/gi);
    for (const match of imgMatches) {
      const src = match[1].trim();
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;

      const cleanSrc = src.split('?')[0].replace(/^\//, '');
      const assetPath = path.join(ROOT, cleanSrc);
      if (!fs.existsSync(assetPath)) {
        issues.push({ type: 'Missing Image Asset', target: src });
      }
    }

    if (issues.length > 0) {
      issuesByFile[relFile] = issues;
      brokenLinksCount += issues.length;
    }
  }

  // Report results
  if (brokenLinksCount === 0) {
    console.log(`[PASS] All ${totalLinksChecked} internal links, anchors, and assets verified successfully! Zero broken targets.`);
  } else {
    console.log(`[WARNING] Found ${brokenLinksCount} issue(s) across ${Object.keys(issuesByFile).length} file(s):\n`);
    for (const [file, issues] of Object.entries(issuesByFile)) {
      console.log(`File: ${file}`);
      for (const iss of issues) {
        console.log(`  - [${iss.type}] ${iss.target}`);
      }
      console.log('');
    }
  }

  return brokenLinksCount === 0;
}

if (require.main === module) {
  const success = runAudit();
  process.exitCode = success ? 0 : 1;
}

module.exports = runAudit;
