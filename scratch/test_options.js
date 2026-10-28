async function testOptions() {
    const origins = ['https://rrclawassociates.com', 'http://localhost:5502', 'http://127.0.0.1:5502'];
    for (const org of origins) {
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'OPTIONS',
                headers: {
                    'Origin': org,
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'content-type'
                }
            });
            console.log(`\nOrigin: ${org}`);
            console.log(`Status: ${res.status} ${res.statusText}`);
            console.log('Allow-Origin:', res.headers.get('access-control-allow-origin'));
            console.log('Allow-Methods:', res.headers.get('access-control-allow-methods'));
            console.log('Allow-Headers:', res.headers.get('access-control-allow-headers'));
        } catch (e) {
            console.log(`Origin ${org} failed:`, e.message);
        }
    }
}

testOptions();

