# Generate realistic detailed world map SVG path
# Standard simplified equirectangular paths for world map
world_svg = '''
<svg class="lp-map-svg" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interactive World Map showing RRC Legal Partner Network Desks">
    <defs>
        <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#c9a24d" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#c9a24d" stop-opacity="0"/>
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
        </filter>
    </defs>

    <!-- World Continents (Accurate Simplified Silhouette) -->
    <g fill="#d8e1eb" stroke="#c5d1df" stroke-width="0.75" filter="url(#shadow)">
        <!-- North America -->
        <path d="M 170,60 L 190,55 L 220,60 L 250,55 L 280,65 L 300,85 L 295,105 L 270,110 L 250,115 L 245,135 L 275,145 L 290,165 L 285,185 L 265,195 L 250,210 L 235,230 L 220,250 L 210,240 L 190,215 L 180,185 L 155,175 L 135,160 L 120,135 L 110,105 L 130,85 Z" />
        <!-- Greenland -->
        <path d="M 330,40 L 375,35 L 390,65 L 360,95 L 340,90 L 330,65 Z" />
        <!-- Central America & Caribbean -->
        <path d="M 210,240 L 230,255 L 245,280 L 265,295 L 260,305 L 245,300 L 230,285 L 210,260 Z" />
        <!-- South America -->
        <path d="M 265,295 L 300,290 L 335,310 L 370,335 L 385,365 L 370,405 L 340,445 L 320,480 L 305,485 L 295,455 L 290,410 L 275,370 L 265,335 L 260,305 Z" />
        <!-- Europe -->
        <path d="M 470,95 L 505,80 L 530,90 L 545,115 L 530,135 L 540,150 L 525,165 L 500,160 L 485,175 L 465,170 L 450,150 L 460,125 L 470,110 Z" />
        <!-- Scandinavia & Baltic -->
        <path d="M 505,80 L 525,55 L 540,50 L 550,75 L 540,110 L 525,110 Z" />
        <!-- United Kingdom & Ireland -->
        <path d="M 445,115 L 460,110 L 465,130 L 450,140 Z M 435,125 L 445,120 L 445,135 L 435,135 Z" />
        <!-- Africa -->
        <path d="M 465,175 L 525,170 L 565,195 L 600,230 L 610,270 L 585,320 L 560,370 L 540,420 L 515,445 L 490,430 L 480,380 L 460,330 L 440,280 L 435,230 L 445,200 Z" />
        <!-- Madagascar -->
        <path d="M 610,360 L 625,370 L 615,415 L 600,405 Z" />
        <!-- Asia (Northern & Central) -->
        <path d="M 550,75 L 620,60 L 710,55 L 810,65 L 890,85 L 880,120 L 830,135 L 780,130 L 740,145 L 700,155 L 650,160 L 600,165 L 565,150 L 545,115 Z" />
        <!-- Middle East -->
        <path d="M 565,195 L 605,190 L 635,215 L 640,255 L 615,270 L 590,260 L 580,225 Z" />
        <!-- India Subcontinent -->
        <path d="M 655,195 L 705,190 L 730,225 L 735,260 L 715,300 L 690,325 L 675,290 L 665,245 Z" />
        <!-- East Asia / China -->
        <path d="M 740,145 L 810,140 L 855,175 L 840,225 L 805,250 L 765,245 L 730,225 L 715,185 Z" />
        <!-- Southeast Asia -->
        <path d="M 765,245 L 795,255 L 800,285 L 785,310 L 770,300 L 765,270 Z" />
        <!-- Malaysia, Indonesia & Archipelago -->
        <path d="M 760,295 L 780,295 L 790,305 L 775,315 Z M 785,325 L 830,320 L 845,340 L 810,350 Z M 835,285 L 860,295 L 850,325 L 830,315 Z" />
        <!-- Japan -->
        <path d="M 875,150 L 890,165 L 880,205 L 865,190 Z" />
        <!-- Australia -->
        <path d="M 790,370 L 850,350 L 895,375 L 905,420 L 870,455 L 825,450 L 785,425 L 775,390 Z" />
        <!-- New Zealand -->
        <path d="M 930,445 L 945,455 L 935,485 L 920,470 Z" />
    </g>

    <!-- Jurisdictions with Interactive Radar Pins -->
    <!-- 1. Malaysia Desk (Primary Partner Hub: KL, Seremban, Johor Bahru) -->
    <g class="map-pin" transform="translate(775, 305)" onclick="showPinInfo('Malaysia Hub', 'Kuala Lumpur HQ, Seremban & Johor Bahru', 'Chee & Partners & Guna & Chandrika Advocates: Active Cross-Border Liaison Desks')">
        <circle class="pin-pulse" cx="0" cy="0" r="12" fill="none" stroke="#c9a24d" />
        <circle cx="0" cy="0" r="7" fill="#c9a24d" filter="url(#shadow)" />
        <circle cx="0" cy="0" r="3" fill="#0b1c2d" />
        <text x="14" y="5" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0b1c2d">Malaysia (Active Hub)</text>
    </g>

    <!-- 2. India (HQ: Thanjavur, Chennai, New Delhi) -->
    <g class="map-pin" transform="translate(695, 260)" onclick="showPinInfo('India (National HQ)', 'New Delhi, Chennai & Thanjavur HQ', 'Full Litigation, Property Due Diligence, High Court Writs & Private Client Desks')">
        <circle class="pin-pulse" cx="0" cy="0" r="12" fill="none" stroke="#0b1c2d" />
        <circle cx="0" cy="0" r="7" fill="#0b1c2d" filter="url(#shadow)" />
        <circle cx="0" cy="0" r="3" fill="#c9a24d" />
        <text x="-65" y="-12" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0b1c2d">India (HQ)</text>
    </g>

    <!-- 3. Singapore Desk -->
    <g class="map-pin" transform="translate(785, 318)" onclick="showPinInfo('Singapore', 'Cross-Border Corporate Desk', 'M&A Advisory, Financial Services & Dispute Resolution Coordination')">
        <circle cx="0" cy="0" r="5" fill="#c9a24d" />
    </g>

    <!-- 4. United Kingdom (London Desk) -->
    <g class="map-pin" transform="translate(458, 128)" onclick="showPinInfo('United Kingdom', 'London Partner Desk', 'NRI Property Injunctions, Cross-Border Probate & Consular Attestation')">
        <circle class="pin-pulse" cx="0" cy="0" r="10" fill="none" stroke="#c9a24d" />
        <circle cx="0" cy="0" r="6" fill="#c9a24d" />
        <text x="-85" y="-6" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0b1c2d">United Kingdom</text>
    </g>

    <!-- 5. UAE (Dubai Middle East Desk) -->
    <g class="map-pin" transform="translate(620, 235)" onclick="showPinInfo('UAE', 'Middle East Liaison Desk', 'Gulf NRI Legal Advisory, POA Adjudication & Property Rights Protection')">
        <circle cx="0" cy="0" r="6" fill="#c9a24d" />
        <text x="-32" y="18" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#64748b">UAE</text>
    </g>

    <!-- 6. United States (North America Desk) -->
    <g class="map-pin" transform="translate(235, 175)" onclick="showPinInfo('USA', 'North America Desk', 'US NRI Matrimonial, Foreign Decree Validation & Ancestral Estate Coordination')">
        <circle cx="0" cy="0" r="6" fill="#c9a24d" />
        <text x="-30" y="18" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#64748b">USA</text>
    </g>
</svg>
'''

with open('scratch/world_map.svg', 'w', encoding='utf-8') as f:
    f.write(world_svg)

print("Saved scratch/world_map.svg")

