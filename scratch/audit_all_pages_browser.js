const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootPages = [
  'index.html',
  'booking.html',
  'partners.html',
  'sectors.html',
  'opportunities.html',
  'lawfirm-blog.html',
  'core-practice-areas.html',
  'family-law.html',
  'property-law.html',
  'employment-law.html',
  'white-collar-crime.html',
  'intellectual-property.html',
  'litigation-dispute-resolution.html',
  'cyber-law.html',
  'cheque-bounce-lawyer.html',
  'nri-services.html',
  'nri-property-disputes.html',
  'nri-power-of-attorney.html',
  'nri-family-matrimonial.html',
  'nri-criminal-case.html',
  'passport-travel-restrictions.html',
  'oci-card-assistance.html',
  'oci-legal-guides.html',
  'oci-card-indian-ancestry-assistance.html',
  'oci-card-eligibility-legal-status.html',
  'oci-vs-nri-vs-indian-citizen.html',
  'oci-card-application-documents.html',
  'oci-foreign-spouse-eligibility.html',
  'oci-for-children-born-abroad.html',
  'oci-card-benefits-restrictions-india.html',
  'oci-cardholders-inherit-sell-ancestral-property-india.html',
  'nri-oci-property-due-diligence-india.html',
  'nri-oci-property-tax-india.html',
  'oci-card-renewal-passport-update.html',
  'oci-card-cancellation-grounds-remedies.html',
  'oci-card-cancellation-section-7d-legal-remedies.html',
  'blog-cross-border-child-custody-india.html',
  'blog-nri-child-custody-in-india.html',
  'blog-brother-claim-ancestral-property-long-possession.html',
  'blog-deepfake-legal-remedies.html',
  'blog-evolution-of-digital-evidence-india.html',
  'blog-nri-property-remedies.html',
  'enforce-foreign-divorce-decree-property-india.html',
  'enforce-foreign-divorce-decree-property-india-part2.html',
  'enforce-foreign-divorce-decree-property-india-part3.html'
];

async function runBrowserAudit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9230'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const pageResults = [];
  const globalIssues = [];

  try {
    const newTabRes = await fetch('http://127.0.0.1:9230/json/new?about:blank', { method: 'PUT' });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const msgId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    await send('Runtime.enable');

    console.log(`Auditing ${rootPages.length} pages in headless Edge...`);

    for (let i = 0; i < rootPages.length; i++) {
      const page = rootPages[i];
      process.stdout.write(`[${i+1}/${rootPages.length}] Auditing ${page}... `);

      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false
      });

      await send('Page.navigate', { url: `http://localhost:8080/${page}` });
      await new Promise(r => setTimeout(r, 1000));

      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (async () => {
            const results = {
              title: document.title,
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth,
              hasHScroll: document.documentElement.scrollWidth > window.innerWidth + 1,
              links: [],
              header: {
                hasLogo: false,
                logoHref: null,
                hasHome: false,
                homeHref: null,
                hasNriDropdown: false,
                nriItems: [],
                hasCoreDropdown: false,
                coreItems: [],
                hasPartners: false,
                partnersHref: null,
                hasBlog: false,
                blogHref: null,
                hasContact: false,
                contactHref: null,
                hasBookBtn: false,
                bookHref: null
              },
              mobileMenu: {
                hasToggle: false,
                hasMenu: false,
                isOpenable: false,
                linksCount: 0
              },
              footer: {
                hasFooter: false,
                links: []
              }
            };

            // Header inspect
            const logo = document.querySelector('.header a img, header a img, nav a img, .navbar-brand img, .logo-img');
            if (logo && logo.closest('a')) {
              results.header.hasLogo = true;
              results.header.logoHref = logo.closest('a').getAttribute('href');
            }

            const headerLinks = Array.from(document.querySelectorAll('header a, nav a, .header a, .rrc-navbar a'));
            headerLinks.forEach(a => {
              const text = (a.textContent || '').trim().toLowerCase();
              const href = a.getAttribute('href');
              if (text === 'home') {
                results.header.hasHome = true;
                results.header.homeHref = href;
              } else if (text === 'partners') {
                results.header.hasPartners = true;
                results.header.partnersHref = href;
              } else if (text === 'blog') {
                results.header.hasBlog = true;
                results.header.blogHref = href;
              } else if (text === 'contact') {
                results.header.hasContact = true;
                results.header.contactHref = href;
              } else if (text.includes('consult') || text.includes('book')) {
                results.header.hasBookBtn = true;
                results.header.bookHref = href;
              }
            });

            // NRI Dropdown
            const nriToggle = headerLinks.find(a => (a.textContent || '').trim().toLowerCase().includes('nri services'));
            if (nriToggle) {
              results.header.hasNriDropdown = true;
              const parent = nriToggle.closest('.dropdown, li');
              if (parent) {
                const sublinks = Array.from(parent.querySelectorAll('.dropdown-menu a, ul a'));
                results.header.nriItems = sublinks.map(sl => ({ text: sl.textContent.trim(), href: sl.getAttribute('href') }));
              }
            }

            // Core Practice Dropdown
            const coreToggle = headerLinks.find(a => {
              const t = (a.textContent || '').trim().toLowerCase();
              return t.includes('core practice') || t.includes('practice areas');
            });
            if (coreToggle) {
              results.header.hasCoreDropdown = true;
              const parent = coreToggle.closest('.dropdown, li');
              if (parent) {
                const sublinks = Array.from(parent.querySelectorAll('.dropdown-menu a, ul a'));
                results.header.coreItems = sublinks.map(sl => ({ text: sl.textContent.trim(), href: sl.getAttribute('href') }));
              }
            }

            // Mobile menu
            const menuToggle = document.querySelector('#menuToggle, .menu-toggle, [data-bs-toggle="collapse"]');
            const mobileMenu = document.querySelector('#mobileMenu, .mobile-menu, #navbarNav');
            results.mobileMenu.hasToggle = !!menuToggle;
            results.mobileMenu.hasMenu = !!mobileMenu;
            if (mobileMenu) {
              results.mobileMenu.linksCount = mobileMenu.querySelectorAll('a').length;
            }

            // Footer inspect
            const footer = document.querySelector('footer, .footer');
            if (footer) {
              results.footer.hasFooter = true;
              const fLinks = Array.from(footer.querySelectorAll('a'));
              results.footer.links = fLinks.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
            }

            // All links on page
            const allAnchors = Array.from(document.querySelectorAll('a[href]'));
            results.totalAnchors = allAnchors.length;
            
            // Check sample / key links
            for (const a of allAnchors) {
              const href = a.getAttribute('href');
              const text = a.textContent.trim().replace(/\\s+/g, ' ');
              results.links.push({
                text: text.slice(0, 50),
                href,
                isHash: href.startsWith('#'),
                isEmpty: href === '' || href === '#',
                isExternal: href.startsWith('http://') || href.startsWith('https://'),
                isTelOrMail: href.startsWith('tel:') || href.startsWith('mailto:')
              });
            }

            return results;
          })()
        `,
        awaitPromise: true,
        returnByValue: true
      });

      const res = evalRes.result.value;
      pageResults.push({ page, ...res });
      console.log(`Done. Total links: ${res.totalAnchors}, HScroll: ${res.hasHScroll}`);
    }

    ws.close();
  } catch (err) {
    console.error('Browser audit error:', err);
  } finally {
    browser.kill();
  }

  fs.writeFileSync(
    path.join(__dirname, 'browser_audit_results.json'),
    JSON.stringify(pageResults, null, 2)
  );

  console.log('\nAudit complete! Saved to scratch/browser_audit_results.json');
}

runBrowserAudit();
