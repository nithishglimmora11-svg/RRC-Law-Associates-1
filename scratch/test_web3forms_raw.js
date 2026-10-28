async function inspectRawResponse() {
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

    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Origin': 'https://rrclawassociates.com'
        },
        body: JSON.stringify(payload)
    });

    const status = response.status;
    const text = await response.text();
    console.log(`HTTP Status: ${status}`);
    console.log(`Response length: ${text.length}`);
    console.log(`Response preview:\n`, text.substring(0, 1000));
}

inspectRawResponse().catch(console.error);

