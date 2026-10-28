with open('nri-property-disputes.html', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(570, min(610, len(lines))):
    print(f"{i+1}: {lines[i]}", end='')

