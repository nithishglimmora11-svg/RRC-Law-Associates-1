const liveServer = require('C:/Users/nithi/.vscode/extensions/ritwickdey.liveserver-5.7.10/node_modules/live-server');
const path = require('path');

const params = {
    port: 5599,
    host: '127.0.0.1',
    root: process.cwd(),
    open: false,
    mount: [
        ['/wills-probate-estate-administration', path.resolve(process.cwd(), './wills-probate-estate-administration.html')]
    ]
};

liveServer.start(params);
console.log('Test server started on 5599');
setTimeout(() => {
    fetch('http://127.0.0.1:5599/wills-probate-estate-administration')
        .then(res => {
            console.log('Status for /wills-probate-estate-administration:', res.status, res.headers.get('content-type'));
            process.exit(0);
        })
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}, 1000);

