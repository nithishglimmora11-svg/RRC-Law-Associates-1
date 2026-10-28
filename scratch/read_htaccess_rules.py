with open('.htaccess', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(min(120, len(lines))):
    print(f"{i+1}: {lines[i].strip()}")

