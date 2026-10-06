#!/bin/bash
# ============================================================
# Publish the current working copy to the staging site:
#   https://staging.bloomchiro.co.za
#   (repo: github.com/cameronferreira/bloomchiropractic-staging)
#
# The live site is not touched. The staging copy is made safe:
#   - Google Tag Manager snippets removed (no GA4 / Google Ads data)
#   - Bookem widget tracking suppressed (no GTM load, no booking events)
#   - noindex meta + robots.txt (kept out of Google)
#   - "Staging preview" badge on every page
#   - CNAME set to staging.bloomchiro.co.za
#
# Usage (from the repo root):  scripts/deploy-staging.sh
# ============================================================
set -euo pipefail

STAGING_REPO="https://github.com/cameronferreira/bloomchiropractic-staging.git"
STAGING_DOMAIN="staging.bloomchiro.co.za"
BOOKEM_BUSINESS_ID="636059f8af864ef49518f4600b04a48d"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="$(mktemp -d)"
trap 'rm -rf "$BUILD"' EXIT

# Copy the site (everything except git data, scripts and the live CNAME)
rsync -a --exclude '.git' --exclude 'scripts' --exclude 'CNAME' "$ROOT/" "$BUILD/"

echo "$STAGING_DOMAIN" > "$BUILD/CNAME"
printf 'User-agent: *\nDisallow: /\n' > "$BUILD/robots.txt"

python3 - "$BUILD" "$BOOKEM_BUSINESS_ID" <<'EOF'
import pathlib, re, sys
build, business_id = pathlib.Path(sys.argv[1]), sys.argv[2]

head_extra = f'''  <meta name="robots" content="noindex, nofollow" />
  <!-- Staging: suppress Bookem widget tracking (Bookem honours its preview flag) -->
  <script>try{{sessionStorage.setItem('bookem-tracking-preview:{business_id}', String(Date.now() + 864e5 * 365));}}catch(e){{}}</script>
'''
badge = '''  <div style="position:fixed;top:calc(var(--nav-h) + 8px);right:12px;z-index:2000;background:#A8903A;color:#fff;font:600 12px/1 Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:6px 12px;border-radius:50px;box-shadow:0 2px 8px rgba(0,0,0,.2);pointer-events:none">Staging preview</div>
'''

for page in build.glob('*.html'):
    s = page.read_text()
    before = s
    s, n1 = re.subn(r'[ \t]*<!-- Google Tag Manager -->.*?<!-- End Google Tag Manager -->\n', '', s, flags=re.S)
    s, n2 = re.subn(r'[ \t]*<!-- Google Tag Manager \(noscript\) -->.*?<!-- End Google Tag Manager \(noscript\) -->\n', '', s, flags=re.S)
    if n1 > 1 or n2 > 1 or n1 != n2:
        sys.exit(f'{page.name}: expected at most one GTM snippet and matching noscript block, found {n1} and {n2}; staging not published')
    s = s.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n' + head_extra, 1)
    s = re.sub(r'(<body[^>]*>\n)', r'\1' + badge, s, count=1)
    if 'googletagmanager.com/gtm.js' in s or 'noindex' not in s or 'Staging preview' not in s:
        sys.exit(f'{page.name}: staging transform incomplete; staging not published')
    page.write_text(s)
    print(f'  {page.name}: ' + ('GTM removed, ' if n1 else 'no GTM, ') + 'noindex + badge added, Bookem tracking suppressed')
EOF

SOURCE_COMMIT="$(git -C "$ROOT" rev-parse --short HEAD)"
DIRTY=""; git -C "$ROOT" diff --quiet HEAD || DIRTY=" + uncommitted changes"

cd "$BUILD"
git init -q -b main
git add -A
git -c user.name="$(git -C "$ROOT" config user.name || echo staging)" \
    -c user.email="$(git -C "$ROOT" config user.email || echo staging@localhost)" \
    commit -q -m "Staging build from ${SOURCE_COMMIT}${DIRTY}"
git push -q --force "$STAGING_REPO" main
echo "Published to https://$STAGING_DOMAIN (from ${SOURCE_COMMIT}${DIRTY})"
