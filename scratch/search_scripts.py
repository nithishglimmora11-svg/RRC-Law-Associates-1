import glob

for f in ['script.js', 'script2.js']:
    try:
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            lines = fp.readlines()
        for idx, line in enumerate(lines):
            if any(k in line.lower() for k in ['testimonial', 'slider']):
                print(f"{f}:{idx+1}: {line.strip()}")
    except Exception as e:
        print(f"Error {f}: {e}")
