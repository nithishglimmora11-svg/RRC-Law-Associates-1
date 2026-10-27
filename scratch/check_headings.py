with open('scratch/blog3_content.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f if line.strip()]

for i, line in enumerate(lines):
    if line.startswith('[Heading'):
        print(f"Line {i}: {line}")
