const liveServer = require('C:/Users/nithi/.vscode/extensions/ritwickdey.liveserver-5.7.10/node_modules/live-server');
const path = require('path');

const params = {
    port: 5598,
    host: '127.0.0.1',
    root: process.cwd(),
    open: false,
    mount: [
        ['/wills-probate-estate-administration', path.resolve(process.cwd(), './wills-probate-estate-administration.html')],
        ['/oci-card-assistance', path.resolve(process.cwd(), './oci-card-assistance.html')]
    ]
};

liveServer.start(params);
setTimeout(async () => {
    const urls = [
        '/',
        '/index.html',
        '/wills-probate-estate-administration',
        '/wills-probate-estate-administration.html',
        '/oci-card-assistance',
        '/booking.html'
    ];
    for (const u of urls) {
        try {
            const res = await fetch(`http://127.0.0.1:5598${u}`);
            console.log(`${u} -> ${res.status}`);
        } catch (e) {
            console.log(`${u} -> ERR ${e.message}`);
        }
    }
    process.exit(0);
}, 1000);

