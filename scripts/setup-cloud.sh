#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."

npm ci --cache /tmp/chrome-note-npm --no-audit --no-fund
npm run check
npm run build

# A separate official Chrome is used for extension testing. Keep the managed
# system browser and its policies unchanged. TLS verification stays enabled.
browser_root=/workspace/.chrome-note-tools/chrome
if [[ ! -x "$browser_root/opt/google/chrome/chrome" ]]; then
  browser_package=$(mktemp /tmp/chrome-note-browser.XXXXXX.deb)
  trap 'rm -f -- "$browser_package"' EXIT
  curl --fail --location --retry 2 --max-time 180 \
    https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    --output "$browser_package"
  mkdir -p "$browser_root"
  dpkg-deb --extract "$browser_package" "$browser_root"
fi
"$browser_root/opt/google/chrome/chrome" --version
echo 'Browser tests: CHROMIUM_PATH=/workspace/.chrome-note-tools/chrome/opt/google/chrome/chrome npm test'
