import glob
import re

print("=== SEARCHING FOR WEB3FORMS & ACCESS KEYS ACROSS CODEBASE ===")
for fpath in sorted(glob.glob('*.html') + glob.glob('*.js') + glob.glob('scratch/*.py') + glob.glob('scratch/*.js')):
    try:
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
        keys = re.findall(r'web3forms\.com[^\'"\s<]*', text, re.I)
        access = re.findall(r'name=["\']access_key["\'][^>]*value=["\']([^"\']+)["\']', text, re.I)
        access += re.findall(r'value=["\']([^"\']+)["\'][^>]*name=["\']access_key["\']', text, re.I)
        access += re.findall(r'access_key["\']?\s*[:=]\s*["\']([a-zA-Z0-9-]+)["\']', text, re.I)
        access = list(dict.fromkeys(access))
        if keys or access:
            redacted_keys = [k[:4] + "-****-****-****-********" + k[-4:] if len(k) > 8 else "***" for k in access]
            print(f"{fpath}:")
            if keys:
                print(f"  Endpoints: {list(dict.fromkeys(keys))}")
            if redacted_keys:
                print(f"  Access Keys: {redacted_keys}")
    except Exception as e:
        pass

