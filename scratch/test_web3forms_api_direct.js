// Test direct Web3Forms API response for access_key 070a477f-e139-4bcf-838c-49abddcc0959
const https = require('https');

async function testWeb3FormsDirect() {
    console.log('[API TEST] Sending controlled test payload to https://api.web3forms.com/submit...');

    const payload = {
        access_key: '070a477f-e139-4bcf-838c-49abddcc0959',
        from_name: 'RRC Law Associates - Legal Partners Network',
        subject: 'New Legal Partner Application Submission [AUDIT TEST]',
        botcheck: '',
        'Name of Firm or Professional': '[AUDIT TEST] RRC Tech Verification Desk',
        'Applicant Category': 'Law Firm',
        'Professional Email': 'audit-test@rrclawassociates.com',
        'Professional Phone': '+91 97511 82452',
        'Country': 'India',
        'City': 'Thanjavur (Internal Test Scope)',
        'Year of Establishment': '2026',
        'Website': 'https://rrclawassociates.com',
        'Brief Overview': '[CONTROLLED AUDIT TEST] Technical verification of Web3Forms API endpoint connectivity, HTTP response code, and delivery pipeline.',
        'Practice Areas': 'NRI Property Protection; Commercial & Contract Law',
        'Bar Registration or Authority': 'TN/AUDIT/2026 (Internal Test)',
        'Years of Experience': '15+ Years',
        'Jurisdictions Served': 'Madras High Court & Supreme Court of India',
        'Credentials Reference Link': 'https://rrclawassociates.com/audit-test-reference',
        'Directory Publication Consent': 'No',
        'Consolidated Practice Areas': 'NRI Property Protection; Commercial & Contract Law'
    };

    const startTime = new Date().toISOString();

    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'https://rrclawassociates.com'
        },
        body: JSON.stringify(payload)
    });

    const status = response.status;
    const statusText = response.statusText;
    const headers = Object.fromEntries(response.headers.entries());
    const data = await response.json();

    console.log(`[API RESPONSE] Timestamp: ${startTime}`);
    console.log(`[API RESPONSE] HTTP Status: ${status} ${statusText}`);
    console.log(`[API RESPONSE] Headers:`, headers);
    console.log(`[API RESPONSE] Body:`, JSON.stringify(data, null, 2));

    const result = {
        timestamp: startTime,
        endpoint: 'https://api.web3forms.com/submit',
        httpStatus: status,
        statusText: statusText,
        responseHeaders: {
            'content-type': headers['content-type'],
            'cf-ray': headers['cf-ray'],
            'server': headers['server']
        },
        responseBody: data,
        keyAccepted: data.success === true
    };

    const fs = require('fs');
    fs.writeFileSync('scratch/direct_api_test_results.json', JSON.stringify(result, null, 2));
    console.log('[SAVED] scratch/direct_api_test_results.json');
}

testWeb3FormsDirect().catch(err => {
    console.error('Direct test error:', err);
});

