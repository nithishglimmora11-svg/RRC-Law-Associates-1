#!/bin/bash
# ====================================================================
# RRC Law Associates — Standalone Production Deployment Script
# Can be run manually via cPanel Terminal or SSH:
#   cd /home/rrcltdbn/repositories/RRC-Law-Associates-1 && bash tools/deploy-manual.sh
# ====================================================================

set -e

DEPLOYPATH="/home/rrcltdbn/public_html"

echo "[DEPLOY] Starting RRC Law Associates production deployment..."
echo "[DEPLOY] Target destination: $DEPLOYPATH"

# 1. Ensure required subdirectories exist
/bin/mkdir -p "$DEPLOYPATH/assets" "$DEPLOYPATH/nri-landlord-tenant-eviction"

# 2. Deploy core HTML pages (homepage, practice areas, NRI services, OCI guides)
echo "[DEPLOY] Deploying HTML files..."
/bin/cp *.html "$DEPLOYPATH/"

# 3. Deploy stylesheets and JavaScript
echo "[DEPLOY] Deploying CSS & JavaScript..."
/bin/cp *.css "$DEPLOYPATH/"
/bin/cp script.js script2.js "$DEPLOYPATH/"

# 4. Deploy metadata, SEO, and cache-busting identifiers
echo "[DEPLOY] Deploying SEO and metadata..."
/bin/cp sitemap.xml robots.txt site.webmanifest asset-version.txt llms.txt favicon.ico "$DEPLOYPATH/"

# 5. Deploy assets (images, typography, stylesheets)
echo "[DEPLOY] Deploying assets..."
/bin/cp -R assets/* "$DEPLOYPATH/assets/"

# 6. Deploy multi-level directories
/bin/cp -R nri-landlord-tenant-eviction/* "$DEPLOYPATH/nri-landlord-tenant-eviction/"

# 7. Deploy production .htaccess configuration
echo "[DEPLOY] Deploying .htaccess..."
/bin/cp .htaccess "$DEPLOYPATH/"

# 8. Enforce standard secure hosting permissions
echo "[DEPLOY] Setting permissions (755 for dirs, 644 for files)..."
/bin/chmod 755 "$DEPLOYPATH"
/bin/chmod 755 "$DEPLOYPATH/assets" "$DEPLOYPATH/nri-landlord-tenant-eviction"
/bin/find "$DEPLOYPATH/assets" -type d -exec /bin/chmod 755 {} +
/bin/find "$DEPLOYPATH/assets" -type f -exec /bin/chmod 644 {} +
/bin/chmod 644 "$DEPLOYPATH"/*.html "$DEPLOYPATH"/*.css "$DEPLOYPATH"/*.js "$DEPLOYPATH"/.htaccess

echo "[DEPLOY] Production deployment completed successfully!"
