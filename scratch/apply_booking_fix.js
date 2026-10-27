const fs = require('fs');

let content = fs.readFileSync('booking.html', 'utf-8');

const oldNriBlock = `                    <div class="dropdown">
                        <a
                            class="nav-link-custom border-0 bg-transparent p-0"
                            href="nri-services.html"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            NRI Services
                        </a>
                    </div>`;

const newNriBlock = `                    <div class="dropdown">
                        <a
                            class="nav-link-custom dropdown-toggle border-0 bg-transparent p-0"
                            href="nri-services.html"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            NRI Services
                        </a>
                        <ul class="dropdown-menu shadow-lg">
                            <li>
                                <a class="dropdown-item text-uppercase" style="font-size: 14px;" href="oci-card-assistance.html">OCI Card &amp; Ancestry Assistance</a>
                            </li>
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="nri-property-disputes.html">Property Dispute</a></li>
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="nri-power-of-attorney.html">Power of Attorney</a></li>
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="nri-criminal-case.html">Criminal Cases</a></li>
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="nri-family-matrimonial.html">Family &amp; Matrimonial</a></li>
                        </ul>
                    </div>`;

const oldCoreBlock = `                    <div class="dropdown">
                        <a
                            class="nav-link-custom border-0 bg-transparent p-0"
                            href="core-practice-areas.html"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Core Practice Areas
                        </a>
                    </div>`;

const newCoreBlock = `                    <div class="dropdown">
                        <a
                            class="nav-link-custom dropdown-toggle border-0 bg-transparent p-0"
                            href="core-practice-areas.html"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Core Practice Areas
                        </a>
                        <ul class="dropdown-menu shadow-lg">
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="family-law.html">Family Law Workspace</a></li>
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="intellectual-property.html">Intellectual Property Advisory</a></li>
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="employment-law.html">Labour &amp; Employment Protection</a></li>
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="white-collar-crime.html">White Collar Crime Defense</a></li>
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="property-law.html">Due Diligence Frameworks</a></li>
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="cyber-law.html">Cyber Law Desk</a></li>
                            <li><a class="dropdown-item text-uppercase" style="font-size: 14px;" href="litigation-dispute-resolution.html">Litigation &amp; Dispute Resolution</a></li>
                        </ul>
                    </div>`;

// Normalize \r\n to \n for replacement
const hasCRLF = content.includes('\r\n');
if (hasCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

const nriReplaced = content.includes(oldNriBlock);
const coreReplaced = content.includes(oldCoreBlock);

console.log('NRI found:', nriReplaced);
console.log('Core found:', coreReplaced);

if (nriReplaced && coreReplaced) {
  content = content.replace(oldNriBlock, newNriBlock);
  content = content.replace(oldCoreBlock, newCoreBlock);
  if (hasCRLF) {
    content = content.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync('booking.html', content, 'utf-8');
  console.log('Successfully updated booking.html dropdowns!');
} else {
  console.error('Failed to locate target blocks in booking.html');
}
