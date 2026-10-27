const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const problematicFiles = [];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf-8');
  const hasToggle = c.includes('id="menuToggle"');
  if (!hasToggle) return;

  // Check if it loads script.js with data-rrc-ai-only
  const isAiOnly = c.includes('data-rrc-ai-only');
  
  // Check if it has an inline script for menuToggle
  const hasInlineToggleScript = c.includes("getElementById('menuToggle')") || 
                                c.includes('getElementById("menuToggle")') ||
                                c.includes("querySelector('#menuToggle')") ||
                                c.includes('querySelector("#menuToggle")');

  // Check if it loads main script.js without data-rrc-ai-only
  const loadsFullScriptJs = /<script[^>]*src=["'](?:(?!\bdata-rrc-ai-only\b)[^"'])*script\.js[^"']*["'][^>]*>/i.test(c);

  if (isAiOnly && !hasInlineToggleScript) {
    problematicFiles.push({ file: f, reason: 'Loads script.js as data-rrc-ai-only and has NO inline menuToggle handler!' });
  } else if (!hasInlineToggleScript && !loadsFullScriptJs) {
    problematicFiles.push({ file: f, reason: 'Has no inline handler and does not load full script.js!' });
  }
});

console.log(`Files with BROKEN mobile hamburger menuToggle: ${problematicFiles.length}`);
console.log(JSON.stringify(problematicFiles, null, 2));
