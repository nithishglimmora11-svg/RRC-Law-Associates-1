with open('cheque-bounce-lawyer.html', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for i, line in enumerate(lines):
    if any(k in line.lower() for k in ['<main', '</main', 'page-header-section', 'matters we handle', 'advocates', 'contact', 'footer', '<head', '</head']):
        print(f"Line {i+1}: {line.strip()[:90]}")

