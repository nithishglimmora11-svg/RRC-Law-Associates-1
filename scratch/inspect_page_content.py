import os, re

def inspect(filename):
    print(f"\n==================================================")
    print(f"FILE: {filename}")
    print(f"==================================================")
    with open(filename, encoding='utf-8', errors='ignore') as f:
        c = f.read()
    
    sections = re.findall(r'<section[^>]*id=["\'](.*?)["\']', c)
    print("Section IDs:", sections)
    
    headings = re.findall(r'<(h[123])[^>]*>(.*?)</\1>', c, re.DOTALL)
    print(f"Total Headings: {len(headings)}")
    for tag, text in headings[:15]:
        clean = re.sub(r'<[^>]+>', '', text).strip()
        print(f"  [{tag}] {clean[:90]}")
        
inspect('nri-property-disputes.html')
inspect('nri-power-of-attorney.html')
inspect('cheque-bounce-lawyer.html')
inspect('litigation-dispute-resolution.html')

