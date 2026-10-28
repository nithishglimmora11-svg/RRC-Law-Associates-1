
// --- 1. MOBILE MENU TOGGLE ---
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.add('open');
        });
    }
    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    }

    // Mobile submenu toggle
    const triggers = document.querySelectorAll('.m-trigger');
    triggers.forEach(trig => {
        trig.addEventListener('click', function(e) {
            const submenu = this.nextElementSibling;
            if (submenu && !submenu.classList.contains('active')) {
                e.preventDefault();
                submenu.classList.add('active');
                const icon = this.querySelector('i');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
});

// --- 2. PARTNER DIRECTORY FILTERING ---
function filterPartners(category, btnElement) {
    const buttons = document.querySelectorAll('.lp-filter-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const items = document.querySelectorAll('.partner-item');
    let count = 0;
    items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (category === 'all' || cat === category || category === 'practice') {
            item.style.display = 'block';
            count++;
        } else {
            item.style.display = 'none';
        }
    });
    const countEl = document.getElementById('partnerCount');
    if (countEl) countEl.innerText = count;
}

// --- 3. MAP TOOLTIP INTERACTION ---
function showPinInfo(country, hub, desc) {
    const tip = document.getElementById('mapInfoTooltip');
    if (tip) {
        tip.innerHTML = `<strong class="text-dark">${country}</strong> &bull; <span class="text-gold fw-bold">${hub}</span> &mdash; ${desc}`;
    }
}

// --- 4. CHARACTER COUNTER ---
const overviewTextarea = document.getElementById('appOverview');
const charCounter = document.getElementById('charCounter');
if (overviewTextarea && charCounter) {
    overviewTextarea.addEventListener('input', function() {
        charCounter.textContent = this.value.length + '/500';
    });
}

// --- 5. MULTI-STEP FORM LOGIC ---
let currentStep = 1;

function goToStep(step) {
    if (step > currentStep) {
        // Validate current step before advancing
        if (!validateStep(currentStep)) {
            return;
        }
    }

    // Hide all panes
    for (let i = 1; i <= 4; i++) {
        const pane = document.getElementById('stepPane' + i);
        if (pane) pane.style.display = 'none';

        const ind = document.getElementById('stepIndicator' + i);
        if (ind) {
            ind.classList.remove('active');
            if (i < step) {
                ind.classList.add('completed');
            } else {
                ind.classList.remove('completed');
            }
        }
    }

    // Show target pane
    const targetPane = document.getElementById('stepPane' + step);
    if (targetPane) targetPane.style.display = 'block';

    const targetInd = document.getElementById('stepIndicator' + step);
    if (targetInd) targetInd.classList.add('active');

    currentStep = step;

    // If reaching step 4, compile review summary
    if (step === 4) {
        compileReviewSummary();
    }

    // Scroll smoothly to form top
    const wrapper = document.getElementById('partner-application');
    if (wrapper) {
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function validateStep(step) {
    let valid = true;
    if (step === 1) {
        const reqIds = ['appName', 'appCategory', 'appEmail', 'appPhone', 'appCountry', 'appCity', 'appOverview'];
        reqIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.value.trim()) {
                el.classList.add('is-invalid');
                valid = false;
            } else if (el) {
                el.classList.remove('is-invalid');
            }
        });
    } else if (step === 2) {
        const badges = document.querySelectorAll('#practiceAreaBadges input:checked');
        const badgeErr = document.getElementById('practiceAreaError');
        if (badges.length === 0) {
            if (badgeErr) badgeErr.classList.remove('d-none');
            valid = false;
        } else if (badgeErr) {
            badgeErr.classList.add('d-none');
        }

        const exp = document.getElementById('appExp');
        const jur = document.getElementById('appJurisdictions');
        if (exp && !exp.value) {
            exp.classList.add('is-invalid');
            valid = false;
        } else if (exp) {
            exp.classList.remove('is-invalid');
        }
        if (jur && !jur.value.trim()) {
            jur.classList.add('is-invalid');
            valid = false;
        } else if (jur) {
            jur.classList.remove('is-invalid');
        }
    } else if (step === 3) {
        const dec = document.getElementById('checkDeclaration');
        const priv = document.getElementById('checkPrivacy');
        if (dec && !dec.checked) {
            dec.classList.add('is-invalid');
            valid = false;
        } else if (dec) {
            dec.classList.remove('is-invalid');
        }
        if (priv && !priv.checked) {
            priv.classList.add('is-invalid');
            valid = false;
        } else if (priv) {
            priv.classList.remove('is-invalid');
        }
    }
    return valid;
}

function compileReviewSummary() {
    const card = document.getElementById('reviewSummaryCard');
    if (!card) return;

    const name = document.getElementById('appName')?.value || 'N/A';
    const category = document.getElementById('appCategory')?.value || 'N/A';
    const email = document.getElementById('appEmail')?.value || 'N/A';
    const phone = document.getElementById('appPhone')?.value || 'N/A';
    const country = document.getElementById('appCountry')?.value || 'N/A';
    const city = document.getElementById('appCity')?.value || 'N/A';
    const year = document.getElementById('appYear')?.value || 'Not specified';
    const website = document.getElementById('appWebsite')?.value || 'None';
    const overview = document.getElementById('appOverview')?.value || 'N/A';

    const selectedPAs = Array.from(document.querySelectorAll('#practiceAreaBadges input:checked'))
        .map(cb => cb.value)
        .join(', ') || 'None selected';
    const bar = document.getElementById('appBarNumber')?.value || 'None specified';
    const exp = document.getElementById('appExp')?.value || 'N/A';
    const jur = document.getElementById('appJurisdictions')?.value || 'N/A';
    const dirConsent = document.getElementById('checkDirectoryConsent')?.checked ? 'Granted' : 'Private';

    card.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <span class="text-muted small d-block">Firm / Professional Name:</span>
                <strong class="text-dark">${name}</strong> (${category})
            </div>
            <div class="col-md-6">
                <span class="text-muted small d-block">Location:</span>
                <strong class="text-dark">${city}, ${country}</strong>
            </div>
            <div class="col-md-6">
                <span class="text-muted small d-block">Direct Contact:</span>
                <span class="text-dark">${email} &bull; ${phone}</span>
            </div>
            <div class="col-md-6">
                <span class="text-muted small d-block">Experience & Bar Authority:</span>
                <span class="text-dark">${exp} &bull; ${bar}</span>
            </div>
            <div class="col-12">
                <span class="text-muted small d-block">Practice Areas:</span>
                <span class="badge bg-white text-dark border me-1">${selectedPAs}</span>
            </div>
            <div class="col-12">
                <span class="text-muted small d-block">Jurisdictions Served:</span>
                <span class="text-dark">${jur}</span>
            </div>
            <div class="col-12">
                <span class="text-muted small d-block">Directory Publication Consent:</span>
                <span class="badge ${dirConsent === 'Granted' ? 'bg-success' : 'bg-secondary'}">${dirConsent}</span>
            </div>
        </div>
    `;
}

// --- 6. REAL ASYNCHRONOUS WEB3FORMS SUBMISSION ---
const form = document.getElementById('partnerApplicationForm');
if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitAppBtn');
        const submitText = document.getElementById('submitBtnText');
        const submitIcon = document.getElementById('submitBtnIcon');
        const errorAlert = document.getElementById('submissionErrorAlert');
        const errorMsg = document.getElementById('submissionErrorMessage');

        // Final verification check
        if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
            if (errorAlert) {
                errorMsg.textContent = 'Please complete all required fields across steps 1, 2, and 3 before submitting.';
                errorAlert.classList.remove('d-none');
            }
            return;
        }

        // Set Loading State
        submitBtn.disabled = true;
        submitText.textContent = 'Submitting Application...';
        submitIcon.className = 'fa fa-spinner fa-spin';
        if (errorAlert) errorAlert.classList.add('d-none');

        // Compile Form Data
        const formData = new FormData(form);

        // Append explicit consolidated practice areas string
        const selectedPAs = Array.from(document.querySelectorAll('#practiceAreaBadges input:checked'))
            .map(cb => cb.value)
            .join('; ');
        formData.set('Consolidated Practice Areas', selectedPAs);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Submission actually succeeded! Display exact confirmation screen
                document.getElementById('formWrapper').style.display = 'none';
                document.getElementById('successBox').style.display = 'block';
                document.getElementById('partner-application').scrollIntoView({ behavior: 'smooth' });
            } else {
                // Handle provider error
                throw new Error(data.message || 'Submission was not accepted by the intake server.');
            }
        } catch (err) {
            // Display genuine error state without simulating success
            if (errorAlert) {
                errorMsg.textContent = err.message || 'Network error occurred. Please verify your connection or reach us via dr.kumar@rrclawassociates.com.';
                errorAlert.classList.remove('d-none');
            }
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.textContent = 'Submit Application for Review';
            submitIcon.className = 'fa fa-paper-plane';
        }
    });
}
