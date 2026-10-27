const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runResponsiveAudit() {
    const tempProfile = path.resolve(__dirname, 'edge-temp-nav-' + Date.now());
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const browser = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9305',
        '--user-data-dir=' + tempProfile
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targetUrl = 'http://localhost:8080/oci-card-assistance.html';
        const newTabRes = await fetch('http://127.0.0.1:9305/json/new?' + targetUrl, { method: 'PUT' });
        const tab = await newTabRes.json();
        const ws = new WebSocket(tab.webSocketDebuggerUrl);

        let id = 1;
        const send = (method, params = {}) => new Promise((resolve) => {
            const curId = id++;
            const handler = (msg) => {
                const data = JSON.parse(msg.data);
                if (data.id === curId) {
                    ws.removeEventListener('message', handler);
                    resolve(data.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: curId, method, params }));
        });

        await new Promise((res) => ws.addEventListener('open', res));
        await send('Page.enable');
        await send('Runtime.enable');

        const viewports = [
            { width: 320, height: 600, label: '320px' },
            { width: 360, height: 640, label: '360px' },
            { width: 375, height: 667, label: '375px' },
            { width: 390, height: 844, label: '390px' },
            { width: 400, height: 800, label: '400px' },
            { width: 430, height: 932, label: '430px' },
            { width: 768, height: 1024, label: '768px' },
            { width: 1024, height: 768, label: '1024px' },
            { width: 1280, height: 800, label: '1280px-desktop' }
        ];

        const auditResults = {};

        // Detailed check on 375px
        console.log('--- Checking 375px Detailed Mobile Navigation ---');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            mobile: true
        });
        await send('Page.navigate', { url: targetUrl });
        await new Promise(r => setTimeout(r, 2500));

        // 1. Initial Closed State
        const closedCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                const menu = document.getElementById('mobileMenu');
                const backdrop = document.getElementById('mobileMenuBackdrop');
                const menuStyle = window.getComputedStyle(menu);
                const backdropStyle = backdrop ? window.getComputedStyle(backdrop) : null;
                const toggle = document.getElementById('menuToggle');
                return {
                    menuOpen: menu.classList.contains('open'),
                    menuRight: menuStyle.right,
                    backdropVisible: backdropStyle ? backdropStyle.visibility : null,
                    backdropOpacity: backdropStyle ? backdropStyle.opacity : null,
                    bodyOpenClass: document.body.classList.contains('mobile-nav-open'),
                    bodyOverflow: window.getComputedStyle(document.body).overflow,
                    toggleVisible: toggle && window.getComputedStyle(toggle).display !== 'none'
                };
            })()`,
            returnByValue: true
        });
        console.log('Closed State:', closedCheck.result.value);

        // 2. Open Menu
        await send('Runtime.evaluate', {
            expression: `document.getElementById('menuToggle').click()`
        });
        await new Promise(r => setTimeout(r, 450));

        // 3. Open State Evaluation & Link Styles
        const openCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                const menu = document.getElementById('mobileMenu');
                const backdrop = document.getElementById('mobileMenuBackdrop');
                const menuStyle = window.getComputedStyle(menu);
                const backdropStyle = backdrop ? window.getComputedStyle(backdrop) : null;
                const firstLink = menu.querySelector('.m-link');
                const linkStyle = window.getComputedStyle(firstLink);
                const closeBtn = document.getElementById('closeMenu');
                const closeStyle = window.getComputedStyle(closeBtn);
                const closeRect = closeBtn.getBoundingClientRect();
                const menuRect = menu.getBoundingClientRect();
                const ctaBtn = menu.querySelector('.btn-gold');
                const ctaStyle = ctaBtn ? window.getComputedStyle(ctaBtn) : null;

                return {
                    menuOpen: menu.classList.contains('open'),
                    menuRight: menuStyle.right,
                    menuRect: { left: menuRect.left, right: menuRect.right, width: menuRect.width, height: menuRect.height },
                    backdropVisible: backdropStyle ? backdropStyle.visibility : null,
                    backdropOpacity: backdropStyle ? backdropStyle.opacity : null,
                    bodyOpenClass: document.body.classList.contains('mobile-nav-open'),
                    bodyOverflow: window.getComputedStyle(document.body).overflow,
                    firstLinkText: firstLink.textContent.trim(),
                    firstLinkColor: linkStyle.color,
                    firstLinkTextDecoration: linkStyle.textDecorationLine,
                    firstLinkDisplay: linkStyle.display,
                    firstLinkHeight: firstLink.offsetHeight,
                    firstLinkBorderBottom: linkStyle.borderBottom,
                    closeBtnDimensions: { width: closeRect.width, height: closeRect.height, top: closeRect.top, right: window.innerWidth - closeRect.right },
                    ctaBtnColor: ctaStyle ? ctaStyle.color : null,
                    ctaBtnBg: ctaStyle ? ctaStyle.backgroundColor : null,
                    ctaBtnText: ctaBtn ? ctaBtn.textContent.trim() : null
                };
            })()`,
            returnByValue: true
        });
        console.log('Open State:', openCheck.result.value);

        // Screenshot 375px open
        const shot375 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve(__dirname, 'mobile_menu_open_375px.png'), Buffer.from(shot375.data, 'base64'));
        console.log('Saved scratch/mobile_menu_open_375px.png');

        // 4. Test Submenu Toggle (Accordion)
        const submenuToggle = await send('Runtime.evaluate', {
            expression: `(() => {
                const trigger = document.querySelector('.m-trigger');
                const submenu = trigger ? trigger.nextElementSibling : null;
                trigger.click();
                const icon = trigger.querySelector('i');
                return {
                    submenuActive: submenu ? submenu.classList.contains('active') : false,
                    submenuDisplay: submenu ? window.getComputedStyle(submenu).display : null,
                    iconTransform: icon ? icon.style.transform : null,
                    subItemCount: submenu ? submenu.querySelectorAll('.m-sub-item').length : 0,
                    firstSubItemColor: submenu ? window.getComputedStyle(submenu.querySelector('.m-sub-item')).color : null
                };
            })()`,
            returnByValue: true
        });
        console.log('Submenu Toggle (Open):', submenuToggle.result.value);

        // Screenshot with submenu open
        const shotSub = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.resolve(__dirname, 'mobile_submenu_open_375px.png'), Buffer.from(shotSub.data, 'base64'));

        // Toggle Submenu again (Collapse)
        const submenuCollapse = await send('Runtime.evaluate', {
            expression: `(() => {
                const trigger = document.querySelector('.m-trigger');
                const submenu = trigger ? trigger.nextElementSibling : null;
                trigger.click();
                const icon = trigger.querySelector('i');
                return {
                    submenuActive: submenu ? submenu.classList.contains('active') : false,
                    submenuDisplay: submenu ? window.getComputedStyle(submenu).display : null,
                    iconTransform: icon ? icon.style.transform : null
                };
            })()`,
            returnByValue: true
        });
        console.log('Submenu Toggle (Collapse):', submenuCollapse.result.value);

        // 5. Test Backdrop Click Close
        await send('Runtime.evaluate', {
            expression: `document.getElementById('mobileMenuBackdrop').click()`
        });
        await new Promise(r => setTimeout(r, 450));
        const afterBackdropClose = await send('Runtime.evaluate', {
            expression: `(() => {
                const menu = document.getElementById('mobileMenu');
                return {
                    menuOpen: menu.classList.contains('open'),
                    bodyOpenClass: document.body.classList.contains('mobile-nav-open')
                };
            })()`,
            returnByValue: true
        });
        console.log('After Backdrop Click Close:', afterBackdropClose.result.value);

        // 6. Test Close Button Click
        await send('Runtime.evaluate', {
            expression: `document.getElementById('menuToggle').click()`
        });
        await new Promise(r => setTimeout(r, 450));
        await send('Runtime.evaluate', {
            expression: `document.getElementById('closeMenu').click()`
        });
        await new Promise(r => setTimeout(r, 450));
        const afterCloseBtn = await send('Runtime.evaluate', {
            expression: `(() => {
                const menu = document.getElementById('mobileMenu');
                return {
                    menuOpen: menu.classList.contains('open'),
                    bodyOpenClass: document.body.classList.contains('mobile-nav-open')
                };
            })()`,
            returnByValue: true
        });
        console.log('After Close Button Click:', afterCloseBtn.result.value);

        // 7. Test Escape Key Close
        await send('Runtime.evaluate', {
            expression: `document.getElementById('menuToggle').click()`
        });
        await new Promise(r => setTimeout(r, 450));
        await send('Runtime.evaluate', {
            expression: `(() => {
                const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
                document.dispatchEvent(event);
            })()`
        });
        await new Promise(r => setTimeout(r, 450));
        const afterEscape = await send('Runtime.evaluate', {
            expression: `(() => {
                const menu = document.getElementById('mobileMenu');
                return {
                    menuOpen: menu.classList.contains('open'),
                    bodyOpenClass: document.body.classList.contains('mobile-nav-open')
                };
            })()`,
            returnByValue: true
        });
        console.log('After Escape Key:', afterEscape.result.value);

        // 8. Run All Viewports Audit
        console.log('\n--- Running Multi-Viewport Audit ---');
        for (const vp of viewports) {
            await send('Emulation.setDeviceMetricsOverride', {
                width: vp.width,
                height: vp.height,
                deviceScaleFactor: 1,
                mobile: vp.width < 992
            });
            await send('Page.navigate', { url: targetUrl });
            await new Promise(r => setTimeout(r, 1500));

            const vpCheck = await send('Runtime.evaluate', {
                expression: `(() => {
                    const scrollWidth = document.documentElement.scrollWidth;
                    const clientWidth = document.documentElement.clientWidth;
                    const toggle = document.getElementById('menuToggle');
                    const toggleStyle = toggle ? window.getComputedStyle(toggle) : null;
                    const desktopNav = document.querySelector('.header nav');

                    return {
                        hasHorizontalOverflow: scrollWidth > clientWidth,
                        scrollWidth,
                        clientWidth,
                        toggleVisible: toggleStyle ? toggleStyle.display !== 'none' : false,
                        desktopNavVisible: desktopNav ? window.getComputedStyle(desktopNav).display !== 'none' : false
                    };
                })()`,
                returnByValue: true
            });

            auditResults[vp.label] = vpCheck.result.value;
            console.log(`Viewport ${vp.label}:`, vpCheck.result.value);

            // If mobile viewport, test menu open on that viewport
            if (vp.width < 992) {
                await send('Runtime.evaluate', {
                    expression: `document.getElementById('menuToggle').click()`
                });
                await new Promise(r => setTimeout(r, 400));
                const drawerRect = await send('Runtime.evaluate', {
                    expression: `(() => {
                        const menu = document.getElementById('mobileMenu');
                        const r = menu.getBoundingClientRect();
                        return {
                            fitsWithinViewport: r.right <= window.innerWidth && r.left >= 0,
                            menuWidth: r.width,
                            viewportWidth: window.innerWidth
                        };
                    })()`,
                    returnByValue: true
                });
                auditResults[vp.label].drawerOpenTest = drawerRect.result.value;

                // Close again
                await send('Runtime.evaluate', {
                    expression: `document.getElementById('closeMenu').click()`
                });
                await new Promise(r => setTimeout(r, 300));
            }
        }

        fs.writeFileSync(path.resolve(__dirname, 'responsive_nav_results.json'), JSON.stringify(auditResults, null, 2));
        console.log('\nAudit Results saved to scratch/responsive_nav_results.json');

        ws.close();
    } catch (e) {
        console.error('Error during audit:', e);
    } finally {
        browser.kill();
        process.exit(0);
    }
}

runResponsiveAudit();
