const fs = require('fs');

function inspectPage(filename) {
    const content = fs.readFileSync(filename, 'utf8');
    console.log(`\n================== ${filename} ==================`);
    
    // Header CTA markup
    const headerMatch = content.match(/<header[\s\S]*?<\/header>/i);
    if (headerMatch) {
        console.log('--- HEADER CTAS ---');
        const ctaMatches = headerMatch[0].match(/<a[^>]*href=["'][^"']*booking[^"']*["'][^>]*>[\s\S]*?<\/a>/gi);
        console.log(ctaMatches);
    }

    // Hero section and styles
    const styleMatches = content.match(/<style[\s\S]*?<\/style>/gi);
    if (styleMatches) {
        for (const s of styleMatches) {
            const lines = s.split('\n');
            lines.forEach((l, idx) => {
                if (l.includes('article-hero') || l.includes('page-header') || l.includes('hero-section') || l.includes('site-footer') || l.includes('footer')) {
                    console.log(`Style line ${idx}: ${l.trim()}`);
                }
            });
        }
    }

    // Hero section markup
    const heroSectionMatch = content.match(/<section[^>]*class=["'][^"']*(hero|page-header|article-hero)[^"']*["'][\s\S]*?<\/section>/i);
    if (heroSectionMatch) {
        console.log('--- HERO SECTION PREVIEW ---');
        console.log(heroSectionMatch[0].slice(0, 500));
    }
}

inspectPage('nri-services.html');
inspectPage('nri-property-disputes.html');
inspectPage('nri-power-of-attorney.html');
inspectPage('family-law.html');

