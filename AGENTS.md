# Repository workflow

- This repository is a Manifest V3 browser extension. Read README.md for installation and development commands.
- `extension/` is the tracked, directly loadable distribution. Users clone/pull and load this folder without installing dependencies or building.
- Edit `src/`, the root `manifest.json`, or `assets/`, then run `npm run build`. Include the updated `extension/` output in the same commit as the source changes; do not edit generated files alone or ignore this directory.
- Run `npm run check` and the relevant Playwright tests for behavior changes. In this cloud environment use `CHROMIUM_PATH=/workspace/.chrome-note-tools/chrome/opt/google/chrome/chrome npm test`; `scripts/setup-cloud.sh` prepares dependencies and the independent test browser when needed.
- Keep the managed system browser policies unchanged. Browser tests use a fresh, temporary profile and the independent test browser.
