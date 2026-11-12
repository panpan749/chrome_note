import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('extension/', root);
await mkdir(new URL('icons/', output), { recursive: true });
const css = await readFile(new URL('src/styles.css', root), 'utf8');
const content = await readFile(new URL('src/content.js', root), 'utf8');
await writeFile(new URL('content.js', output), `(() => {\nconst DRAWER_STYLES = ${JSON.stringify(css)};\n${content}\n})();\n`);
await copyFile(new URL('src/background.js', root), new URL('background.js', output));
await copyFile(new URL('src/visits.js', root), new URL('visits.js', output));
await copyFile(new URL('manifest.json', root), new URL('manifest.json', output));
for (const size of [16, 48, 128]) {
  await copyFile(new URL(`assets/icon-${size}.png`, root), new URL(`icons/${size}.png`, output));
}
console.log('Built extension → extension/ (load this folder in chrome://extensions)');
