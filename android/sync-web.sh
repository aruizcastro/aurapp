#!/usr/bin/env bash
#
# Copies the web app into the Android project and makes the three changes the
# packaged build needs. Run it after every change to docs/ — the APK bundles a
# copy, it does not read docs/ at build time.
#
#   ./android/sync-web.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/docs"
DEST="$ROOT/android/app/src/main/assets/www"

rm -rf "$DEST"
mkdir -p "$DEST"

# Everything except the service worker. The files are already inside the APK,
# so a cache layer on top of them would only serve stale copies after an
# update — the exact bug we spent a week on in the web version.
# The launcher icons come from the APK's own res/mipmap folders, so the web
# ones are a megabyte of dead weight inside the package.
rsync -a --exclude 'sw.js' --exclude 'icons/' "$SRC/" "$DEST/"

cd "$DEST"

# 1. No videos. One flag, as documented in the README.
perl -0pi -e 's/^  videos: true,$/  videos: false,   \/\/ set by android\/sync-web.sh/m' app.js

# 2. No service worker registration, since there is no service worker.
perl -0pi -e "s/if \('serviceWorker' in navigator\) \{\n.*?\n\}\n/\/\/ No service worker in the packaged build: the files are already local.\n/s" app.js

# 3. No web manifest link: on Android the launcher icon and name come from the
#    APK, and a manifest here would only be dead weight.
perl -0pi -e 's{^<link rel="manifest".*\n}{}m' index.html
perl -0pi -e 's{^<link rel="apple-touch-icon".*\n}{}m' index.html
rm -f manifest.webmanifest

# --- checks, because a silent no-op here ships a broken APK ------------------
grep -q 'videos: false' app.js        || { echo "FALLÓ: no se apagó el flag de videos"; exit 1; }
grep -q "serviceWorker" app.js        && { echo "FALLÓ: quedó el registro del service worker"; exit 1; }
[ ! -f sw.js ]                        || { echo "FALLÓ: se copió sw.js"; exit 1; }
[ -f index.html ] && [ -f app.js ]    || { echo "FALLÓ: faltan archivos"; exit 1; }
grep -q 'rel="manifest"' index.html    && { echo "FALLÓ: quedó el manifest"; exit 1; }
[ ! -d icons ]                        || { echo "FALLÓ: se copiaron los iconos web"; exit 1; }

echo "Listo: $(find "$DEST" -type f | wc -l | tr -d ' ') archivos en assets/www, sin videos."
