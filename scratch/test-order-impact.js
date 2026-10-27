// Simulate Apache subrequest loops and rule ordering

function simulateOrderCurrent(url) {
    // Current Order: Section A (Clean URL) then Section B (HTTPS/WWW)
    let u = new URL(url);
    const trace = [u.href];
    
    for (let hop = 0; hop < 5; hop++) {
        let redirected = false;
        const isHttps = u.protocol === 'https:';
        const isWww = u.hostname.startsWith('www.');
        let pathname = u.pathname;
        let isOciHtml = /\/(oci-[a-z0-9-]+|nri-oci-[a-z0-9-]+)\.html$/i.test(pathname);
        let ociSlugMatch = pathname.match(/^\/(oci-[a-z0-9-]+|nri-oci-[a-z0-9-]+)$/i);
        let ociSlashMatch = pathname.match(/^\/(oci-[a-z0-9-]+|nri-oci-[a-z0-9-]+)\/$/i);
        
        // Section A:
        // Rule 1: OCI .html -> /slug/
        if (isOciHtml) {
            const slug = pathname.match(/\/(oci-[a-z0-9-]+|nri-oci-[a-z0-9-]+)\.html$/i)[1];
            u = new URL('https://rrclawassociates.com/' + slug + '/' + u.search);
            trace.push('Rule 1 301 -> ' + u.href);
            redirected = true;
            continue;
        }
        
        // Rule 2: OCI /slug -> /slug/
        if (ociSlugMatch) {
            const slug = ociSlugMatch[1];
            u = new URL('https://rrclawassociates.com/' + slug + '/' + u.search);
            trace.push('Rule 2 301 -> ' + u.href);
            redirected = true;
            continue;
        }

        // Rule 3: OCI /slug/ -> internal rewrite to slug.html
        if (ociSlashMatch) {
            const slug = ociSlashMatch[1];
            // In Apache, internal rewrite rewrites the file in memory to slug.html.
            // On internal rewrite, Apache restarts the rules (subrequest) with URI = /slug.html!
            // In subrequest:
            const subUri = '/' + slug + '.html';
            
            // In subrequest, does Section B run if HTTPS is off?
            if (!isHttps) {
                // Section B Rule 2 triggers on subrequest!
                u = new URL('https://rrclawassociates.com' + subUri + u.search);
                trace.push('Subrequest Section B Rule 2 (Force SSL) 301 -> ' + u.href);
                redirected = true;
                continue;
            }
            if (isWww) {
                // Section B Rule 1 triggers on subrequest!
                u = new URL('https://rrclawassociates.com' + subUri + u.search);
                trace.push('Subrequest Section B Rule 1 (Strip WWW) 301 -> ' + u.href);
                redirected = true;
                continue;
            }
            
            trace.push('200 OK (Serves ' + slug + '.html)');
            return { hops: trace.length - 1, trace };
        }
        
        // Rule 5: Generic .html -> clean URL
        if (pathname.endsWith('.html')) {
            const clean = pathname.replace(/\.html$/, '');
            u = new URL(u.protocol + '//' + u.host + clean + u.search);
            trace.push('Rule 5 301 -> ' + u.href);
            redirected = true;
            continue;
        }

        // Section B:
        if (isWww) {
            u = new URL('https://rrclawassociates.com' + pathname + u.search);
            trace.push('Section B Rule 1 (Strip WWW) 301 -> ' + u.href);
            redirected = true;
            continue;
        }
        if (!isHttps) {
            u = new URL('https://' + u.host + pathname + u.search);
            trace.push('Section B Rule 2 (Force SSL) 301 -> ' + u.href);
            redirected = true;
            continue;
        }

        trace.push('200 OK (Serves ' + pathname + '.html)');
        return { hops: trace.length - 1, trace };
    }
    return { hops: trace.length - 1, trace };
}

function simulateOrderFixed(url) {
    // Fixed Order: Section B (HTTPS/WWW) FIRST, then Section A (Clean URLs)
    let u = new URL(url);
    const trace = [u.href];
    
    for (let hop = 0; hop < 5; hop++) {
        let redirected = false;
        const isHttps = u.protocol === 'https:';
        const isWww = u.hostname.startsWith('www.');
        let pathname = u.pathname;

        // SECTION B FIRST:
        if (isWww || !isHttps) {
            u = new URL('https://rrclawassociates.com' + pathname + u.search);
            trace.push('HTTPS/Non-WWW 301 -> ' + u.href);
            redirected = true;
            continue;
        }

        // SECTION A SECOND (now guaranteed to be https://rrclawassociates.com):
        let isOciHtml = /\/(oci-[a-z0-9-]+|nri-oci-[a-z0-9-]+)\.html$/i.test(pathname);
        let ociSlugMatch = pathname.match(/^\/(oci-[a-z0-9-]+|nri-oci-[a-z0-9-]+)$/i);
        let ociSlashMatch = pathname.match(/^\/(oci-[a-z0-9-]+|nri-oci-[a-z0-9-]+)\/$/i);

        if (isOciHtml) {
            const slug = pathname.match(/\/(oci-[a-z0-9-]+|nri-oci-[a-z0-9-]+)\.html$/i)[1];
            u = new URL('https://rrclawassociates.com/' + slug + '/' + u.search);
            trace.push('Rule 1 301 -> ' + u.href);
            redirected = true;
            continue;
        }

        if (ociSlugMatch) {
            const slug = ociSlugMatch[1];
            u = new URL('https://rrclawassociates.com/' + slug + '/' + u.search);
            trace.push('Rule 2 301 -> ' + u.href);
            redirected = true;
            continue;
        }

        if (ociSlashMatch) {
            const slug = ociSlashMatch[1];
            trace.push('200 OK (Serves ' + slug + '.html)');
            return { hops: trace.length - 1, trace };
        }

        if (pathname.endsWith('.html')) {
            const clean = pathname.replace(/\.html$/, '');
            u = new URL('https://rrclawassociates.com' + clean + u.search);
            trace.push('Rule 5 301 -> ' + u.href);
            redirected = true;
            continue;
        }

        trace.push('200 OK (Serves ' + pathname + '.html)');
        return { hops: trace.length - 1, trace };
    }
    return { hops: trace.length - 1, trace };
}

console.log('--- TEST: http://www.rrclawassociates.com/oci-card-eligibility-legal-status/ ---');
console.log('CURRENT ORDER:');
console.log(simulateOrderCurrent('http://www.rrclawassociates.com/oci-card-eligibility-legal-status/').trace);
console.log('FIXED ORDER (HTTPS first):');
console.log(simulateOrderFixed('http://www.rrclawassociates.com/oci-card-eligibility-legal-status/').trace);

console.log('\n--- TEST: http://rrclawassociates.com/partners.html ---');
console.log('CURRENT ORDER:');
console.log(simulateOrderCurrent('http://rrclawassociates.com/partners.html').trace);
console.log('FIXED ORDER (HTTPS first):');
console.log(simulateOrderFixed('http://rrclawassociates.com/partners.html').trace);
