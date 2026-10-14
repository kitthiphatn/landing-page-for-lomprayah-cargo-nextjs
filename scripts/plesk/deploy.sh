#!/usr/bin/env bash
# Installs the latest release build into a Plesk site folder and restarts only this site.
#
#   bash deploy.sh /var/www/vhosts/lptable.com/lomprayahcargo.com          # latest build
#   bash deploy.sh /var/www/vhosts/lptable.com/lomprayahcargo.com build-12 # a specific build (roll back)
#
# Folder layout it keeps:
#   app/       the running site (replaced on every deploy; Plesk "Application root")
#   data/      SQLite database (never replaced)
#   media/     uploaded images (never replaced)
#   backups/   database copy taken before each deploy (last 10 kept)
#   releases/  previous app folders (last 3 kept, for rolling back)
set -euo pipefail

REPO="kitthiphatn/landing-page-for-lomprayah-cargo-nextjs"
BASE="${1:?usage: deploy.sh <site folder> [release tag]}"
TAG="${2:-}"
BASE="$(cd "$BASE" && pwd)"

if [ -n "${RELEASE_URL:-}" ]; then
  URL="$RELEASE_URL"
elif [ -n "$TAG" ]; then
  URL="https://github.com/$REPO/releases/download/$TAG/lp-cargo-web.tar.gz"
else
  URL="https://github.com/$REPO/releases/latest/download/lp-cargo-web.tar.gz"
fi

stamp="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BASE/data" "$BASE/media" "$BASE/backups" "$BASE/releases"

echo "Downloading $URL"
new="$BASE/releases/$stamp"
mkdir -p "$new"
trap 'rm -rf "$new"' ERR

curl -fsSL "$URL" | tar -xz -C "$new"
echo "Build $(cat "$new/RELEASE" 2>/dev/null || echo '?')"

if [ -f "$BASE/data/lp-cargo.db" ]; then
  cp "$BASE/data/lp-cargo.db" "$BASE/backups/lp-cargo-$stamp.db"
  echo "Database backed up to backups/lp-cargo-$stamp.db"
fi

# Swap folders: the running process keeps the old files until the restart below
if [ -d "$BASE/app" ]; then
  mv "$BASE/app" "$BASE/releases/previous-$stamp"
fi
mv "$new" "$BASE/app"

# Files must belong to the site's own Plesk user, not root, so the site can write its database
owner="$(stat -c '%u:%g' "$BASE")"
if [ "${owner%%:*}" = 0 ]; then owner="$(stat -c '%u:%g' "$(dirname "$BASE")")"; fi
chown -R "$owner" "$BASE/app" "$BASE/data" "$BASE/media" "$BASE/backups"

# Passenger (Plesk's Node.js runner) restarts this one site when this file changes
mkdir -p "$BASE/app/tmp"
touch "$BASE/app/tmp/restart.txt"

# Housekeeping
ls -1dt "$BASE"/releases/previous-* 2>/dev/null | tail -n +4 | xargs -r rm -rf || true
ls -1t "$BASE"/backups/lp-cargo-*.db 2>/dev/null | tail -n +11 | xargs -r rm -f || true

echo "Deployed. Open the site once to start it; database migrations run on that first start."
