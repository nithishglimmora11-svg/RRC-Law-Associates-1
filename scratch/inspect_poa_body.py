with open('nri-power-of-attorney.html', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(615, min(840, len(lines))):
    print(f"{i+1}: {lines[i]}", end='')

