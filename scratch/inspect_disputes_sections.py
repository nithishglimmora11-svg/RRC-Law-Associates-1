with open('nri-property-disputes.html', encoding='utf-8') as f:
    lines = f.readlines()

print("--- Focus Cards (640-675) ---")
print("".join(lines[638:675]))
print("--- FAQ Section (760-828) ---")
print("".join(lines[760:828]))

