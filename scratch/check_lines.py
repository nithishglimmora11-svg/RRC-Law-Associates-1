import re

with open('scratch/blog3_content.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f if line.strip()]

print(f"Total non-empty lines: {len(lines)}")
for i, line in enumerate(lines[:35]):
    print(f"{i}: {line[:70]}")
