#!/usr/bin/env python3
"""
RRC Law Associates - Production Character Encoding & Mojibake Integrity Auditor

Audits all production HTML files, stylesheets, scripts, and server configuration
to ensure proper UTF-8 encoding without BOM, correct <meta charset="UTF-8"> declaration,
and zero character encoding corruption (mojibake).

Usage:
    python tools/audit_encoding.py
"""

import os
import sys
import glob
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MOJIBAKE_PATTERNS = [
    # Multi-level / Triple-encoded patterns (preserved)
    (r'Ã¢â‚¬â€œ', 'Triple-encoded en dash'),
    (r'Ã¢â‚¬â€”', 'Triple-encoded em dash'),
    (r'Ã¢â‚¬Å“', 'Triple-encoded left double quote'),
    (r'Ã¢â‚¬Â\x9d', 'Triple-encoded right double quote'),
    (r'Ã¢â‚¬â„¢', 'Triple-encoded apostrophe'),
    (r'Ã¢â‚¬Âº', 'Triple-encoded right angle quote'),
    (r'Ã¢Å“â€œ', 'Triple-encoded checkmark'),
    (r'Ã¢â‚¬â€\x9d', 'Triple-encoded em dash variation'),
    (r'Ã°Å¸', 'Triple-encoded emoji leading sequence'),

    # First-level UTF-8 / Windows-1252 mojibake
    # En dash and em dash
    (r'â€[\u2013\u201c\x93]', 'Mojibake en dash'),
    (r'â€[\u2014\u201d\x94]', 'Mojibake em dash'),

    # Single and double quotation marks
    (r'â€[\u02dc\u2018\x98]', 'Mojibake left single quote'),
    (r'â€[\u2122\u2019\x99]', 'Mojibake right single quote / apostrophe'),
    (r'â€[\u0153\u201c\x9c]', 'Mojibake left double quote'),
    (r'â€[\x9d\u201d]', 'Mojibake right double quote'),
    (r'â€[\u0161\u201a\x9a]', 'Mojibake single low-9 quote'),
    (r'â€[\u017e\u201e\x9e]', 'Mojibake double low-9 quote'),
    (r'â€\u2039', 'Mojibake single left angle quote'),
    (r'â€\u203a', 'Mojibake single right angle quote'),

    # Bullet characters
    (r'â€[\u00a2\u2022\xa2]', 'Mojibake bullet'),
    (r'â€[\u00a3\u2023\xa3]', 'Mojibake triangular bullet'),

    # Indian rupee symbol
    (r'â‚¹|â\x82\xb9', 'Mojibake Indian Rupee symbol'),

    # Section sign and copyright sign
    (r'Â§', 'Mojibake section sign'),
    (r'Â©', 'Mojibake copyright sign'),
    (r'Â®', 'Mojibake registered sign'),
    (r'Â°', 'Mojibake degree sign'),
    (r'Â±', 'Mojibake plus-minus sign'),
    (r'Â\s', 'Mojibake non-breaking space'),

    # Common corrupted emoji sequences
    (r'ðŸ|ð\x9f', 'Mojibake 4-byte emoji leading sequence'),
    (r'âœ[\u201c\u2713\x93]', 'Mojibake checkmark'),
    (r'âœ[\u2022\u2715\x95]', 'Mojibake multiplication/close cross'),
    (r'âœ[\u2030\u2709\x89]', 'Mojibake envelope symbol'),

    # Unicode replacement character
    (r'\ufffd', 'Unicode replacement character U+FFFD'),
]

def audit():
    os.chdir(ROOT)

    raw_html_files = sorted(glob.glob('*.html')) + sorted(glob.glob('nri-landlord-tenant-eviction/*.html'))
    raw_css_files = sorted(glob.glob('*.css')) + sorted(glob.glob('assets/**/*.css', recursive=True))
    raw_js_files = sorted(glob.glob('*.js')) + sorted(glob.glob('assets/**/*.js', recursive=True))
    raw_extra_files = ['.htaccess', 'sitemap.xml', 'site.webmanifest']

    def get_existing_unique(files):
        seen = set()
        result = []
        for fpath in files:
            if os.path.isfile(fpath) and fpath not in seen:
                seen.add(fpath)
                result.append(fpath)
        return result

    html_files = get_existing_unique(raw_html_files)
    css_files = get_existing_unique(raw_css_files)
    js_files = get_existing_unique(raw_js_files)
    extra_files = get_existing_unique(raw_extra_files)

    all_files = get_existing_unique(html_files + css_files + js_files + extra_files)

    print("=" * 80)
    print("  RRC Law Associates - Character Encoding & Mojibake Auditor")
    print("=" * 80)
    print(f"Total production HTML pages: {len(html_files)}")
    print(f"Total production files scanned: {len(all_files)}\n")

    errors_found = 0
    scanned_count = 0

    for fpath in all_files:
        if not os.path.isfile(fpath):
            continue
        scanned_count += 1

        with open(fpath, 'rb') as fp:
            raw = fp.read()

        file_errors = []

        # 1. Check BOM
        if raw.startswith(b'\xef\xbb\xbf'):
            file_errors.append("File contains UTF-8 BOM (Byte Order Mark 0xEF 0xBB 0xBF)")

        # 2. Check UTF-8 validity
        try:
            text = raw.decode('utf-8')
        except UnicodeDecodeError as e:
            file_errors.append(f"Invalid UTF-8 byte sequence: {e}")
            text = raw.decode('utf-8', errors='replace')

        # 3. HTML-specific checks
        if fpath.endswith('.html'):
            m = re.search(r'<head>(.*?)</head>', text, re.DOTALL | re.IGNORECASE)
            if not m:
                file_errors.append("Missing <head> element")
            else:
                head = m.group(1)
                charsets = re.findall(r'<meta[^>]*charset=["\']?([^"\'\s>]+)', head, re.I)
                http_equiv = re.findall(r'<meta[^>]*http-equiv=["\']?content-type[^>]*>', head, re.I)

                if not charsets:
                    file_errors.append("Missing <meta charset> declaration in <head>")
                elif len(charsets) > 1:
                    file_errors.append(f"Multiple charset declarations found: {charsets}")
                elif charsets[0].lower() != 'utf-8':
                    file_errors.append(f"Non-UTF-8 charset declared: {charsets[0]}")

                if http_equiv:
                    file_errors.append(f"Conflicting http-equiv charset found: {http_equiv}")

        # 4. Check mojibake patterns
        for pattern, desc in MOJIBAKE_PATTERNS:
            matches = list(re.finditer(pattern, text))
            if matches:
                file_errors.append(f"Found {len(matches)} instance(s) of {desc} ('{pattern}')")

        if file_errors:
            errors_found += 1
            print(f"[FAIL] {fpath}:")
            for err in file_errors:
                print(f"       - {err}")

    # 5. Check .htaccess configuration
    if os.path.isfile('.htaccess'):
        with open('.htaccess', 'r', encoding='utf-8', errors='replace') as fp:
            ht_content = fp.read()
        if 'AddDefaultCharset UTF-8' not in ht_content:
            errors_found += 1
            print("[FAIL] .htaccess: Missing 'AddDefaultCharset UTF-8' directive")
        else:
            print("[PASS] .htaccess: 'AddDefaultCharset UTF-8' correctly configured")

        required_exts = {'.html', '.css', '.js', '.xml', '.json'}
        configured_exts = set()
        for match in re.finditer(r'^\s*AddCharset\s+UTF-8\s+([^\r\n#]+)', ht_content, re.IGNORECASE | re.MULTILINE):
            configured_exts.update(match.group(1).split())

        missing_exts = required_exts - {ext.lower() for ext in configured_exts}
        if missing_exts:
            errors_found += 1
            print(f"[FAIL] .htaccess: Missing 'AddCharset UTF-8' configuration for: {', '.join(sorted(missing_exts))}")
        else:
            print("[PASS] .htaccess: 'AddCharset UTF-8' correctly configured for HTML, CSS, JavaScript, XML, and JSON")
    else:
        errors_found += 1
        print("[FAIL] .htaccess: File not found")

    print("\n" + "=" * 80)
    if errors_found == 0:
        print(f"[SUCCESS] All {scanned_count} files pass encoding integrity audit! 0 corruptions, 0 BOMs.")
        print("=" * 80)
        return 0
    else:
        print(f"[ERROR] Found {errors_found} file(s) with encoding issues.")
        print("=" * 80)
        return 1

if __name__ == '__main__':
    sys.exit(audit())
