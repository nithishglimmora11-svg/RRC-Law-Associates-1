# RRC Law Associates â€” Developer Tooling Suite

This directory contains standalone, zero-dependency developer utilities for maintaining, auditing, and deploying the RRC Law Associates website.

---

## Utilities Overview

| Script | Runtime | Purpose | Zero Dependencies? |
|---|---|---|---|
| `bump-asset-version.js` | Node.js | Cache-busting: updates `?v=` query strings across all HTML files | Yes (Standard Node.js) |
| `audit-links.js` | Node.js | Audits all internal links, clean URLs, anchor hashes, and image assets | Yes (Standard Node.js) |
| `verify-fixes.js` | Node.js | Headless browser regression suite for console errors & 404s | Yes (Chrome/Edge CDP) |
| `read-docx.ps1` | PowerShell | Extracts raw plain text from `.docx` documents | Yes (Standard Windows .NET) |

---

### 1. Asset Cache-Busting: `bump-asset-version.js`
Forces browsers to download updated stylesheets and scripts by updating query parameters across all HTML files.
```bash
# Generate timestamp version (default)
node tools/bump-asset-version.js

# Or provide explicit semantic version:
node tools/bump-asset-version.js 20261031-1
```
See [README-asset-versioning.md](./README-asset-versioning.md) for full architectural details.

---

### 2. Link & Asset Auditor: `audit-links.js`
Recursively scans all website HTML files and verifies that every relative link, clean URL route, anchor target (`#id`), and image file exists.
```bash
node tools/audit-links.js
```
Exits with code `0` if all links are valid, or code `1` if broken targets or missing assets are discovered.

---

### 3. Headless Browser Regression Suite: `verify-fixes.js`
Spawns a headless Microsoft Edge or Google Chrome instance via DevTools Protocol to verify:
- Zero JavaScript runtime console errors on core landing pages.
- Zero local 404 resource errors.
- Clean mobile drawer navigation.

**Prerequisite:** Run `node dev-server.js` first.
```bash
# Verify against local dev-server (default port 5502):
node tools/verify-fixes.js 5502
```

---

### 4. Offline Document Extractor: `read-docx.ps1`
Extracts text from Word documents (`.docx`) without requiring Office or python-docx.
```powershell
powershell -ExecutionPolicy Bypass -File tools/read-docx.ps1 -Path "assets/docs/brief.docx" -OutPath "assets/docs/brief.txt"
```

---

> [!NOTE]
> All scripts in `tools/` are **development-only** utilities and are excluded from the live production cPanel deployment.
