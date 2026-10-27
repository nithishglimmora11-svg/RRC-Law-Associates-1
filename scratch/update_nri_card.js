const fs = require('fs');

let content = fs.readFileSync('nri-services.html', 'utf8');

const target = 'NRI Family &amp; Matrimonial';
const targetIdx = content.indexOf(target);

if (targetIdx !== -1) {
  // Find closing </div> of <div class="col-md-6 col-lg-4">
  const endCardIdx = content.indexOf('</div>', targetIdx);
  const endColIdx = content.indexOf('</div>', endCardIdx + 6);
  const endAnchorIdx = content.indexOf('</div>', endColIdx + 6);

  console.log('Target found at:', targetIdx);
  console.log('Context after target:', content.substring(targetIdx, endColIdx + 30));

  // Let's find </a>\r\n                </div>
  const searchStr = '</a>';
  const aIdx = content.indexOf(searchStr, targetIdx);
  const divIdx = content.indexOf('</div>', aIdx);
  const insertPos = divIdx + 6;

  const newCard = `\n                <div class="col-md-6 col-lg-4">\n                    <a href="/wills-probate-estate-administration" class="text-decoration-none text-black">\n                        <div class="service-card">\n                            <div class="service-icon"><i class="fas fa-file-signature"></i></div>\n                            <h3 class="service-card-text" style="font-family: 'Playfair Display', serif; font-weight: bold;">Wills, Probate &amp; Estate Administration</h3>\n                            <p>Testamentary planning, Madras High Court &amp; District Court probate petitions, Section 372 succession certificates, and post-demise Patta mutation.</p>\n                            <p class="fw-bold service-card-text">Read more <i class="fa-solid fa-angles-right"></i></p>\n                        </div>\n                    </a>\n                </div>`;

  content = content.substring(0, insertPos) + newCard + content.substring(insertPos);
  fs.writeFileSync('nri-services.html', content, 'utf8');
  console.log('Successfully inserted Wills card into nri-services.html!');
} else {
  console.log('Target NOT found in nri-services.html');
}
