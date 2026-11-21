#!/usr/bin/env bash
set -euo pipefail

# Deploy the static export of this portfolio to the `gh-pages` branch, which is
# the branch GitHub Pages serves for https://madunagu.github.io.
#
# Usage: npm run deploy   (or: ./scripts/deploy.sh)
# Override the git remote with DEPLOY_REMOTE=<name|url> if needed.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

BRANCH="gh-pages"
BUILD_DIR="out"
REMOTE="${DEPLOY_REMOTE:-origin}"

echo "==> Building static export"
npm run build

if [[ ! -f "$BUILD_DIR/index.html" ]]; then
  echo "Error: $BUILD_DIR/index.html not found after build." >&2
  exit 1
fi

echo "==> Resolving remote URL for '$REMOTE'"
REMOTE_URL="$(git remote get-url "$REMOTE")"

echo "==> Staging static files in a temporary directory"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT
cp -R "$BUILD_DIR"/. "$TMP_DIR"/
# Prevent Jekyll from ignoring Next.js' underscore-prefixed `_next` assets.
touch "$TMP_DIR/.nojekyll"

echo "==> Committing and force-pushing to $BRANCH"
cd "$TMP_DIR"
git init -q
git add -A
git -c user.name="Ekene Madunagu" -c user.email="ekenemadunagu@gmail.com" \
  commit -qm "Deploy portfolio $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push --force "$REMOTE_URL" "HEAD:refs/heads/$BRANCH"

echo "==> Done. Site will be live at https://madunagu.github.io shortly."
