with open('litigation-dispute-resolution.html', encoding='utf-8') as f:
    lines = f.readlines()

print("--- Debt Recovery Card (1328-1340) ---")
print("".join(lines[1328:1340]))

print("--- In-Depth Row Cards (1375-1440) ---")
for i in range(1374, min(1440, len(lines))):
    if '<h3 class="pub-headline"' in lines[i] or '<div class="litigation-row-card' in lines[i]:
        print(f"Line {i+1}: {lines[i].strip()}")

print("--- FAQs (1545-1610) ---")
for i in range(1545, min(1610, len(lines))):
    if '<h2 class="accordion-header"' in lines[i] or '<div class="accordion-body"' in lines[i]:
        print(f"Line {i+1}: {lines[i].strip()[:90]}")

