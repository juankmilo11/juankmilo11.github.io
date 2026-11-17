// Build an independent, static PACA deployment from the same maintained sources.
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, 'dist/paca');
if (output !== path.join(root, 'dist', 'paca')) throw new Error('Unexpected output directory');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const copy = async (from, to = from) => {
  const target = path.join(output, to);
  await mkdir(path.dirname(target), { recursive: true });
  await cp(path.join(root, from), target, { recursive: true });
};
for (const name of ['assets', 'css', 'js']) {
  await copy('pages/paula/' + name, name);
}
// The old local availability editor is not part of the online application.
await rm(path.join(output, 'js/agenda-admin.js'));
await rm(path.join(output, 'assets/availability.json'));
await copy('shared/api.js');
await copy('shared/api-config.js');
await copy('img/bubble-paca.png');
for (const font of ['Cinzel.ttf', 'CrimsonPro.ttf', 'Cinzel-OFL.txt', 'CrimsonPro-OFL.txt']) {
  await copy('projects/FCT/public/fonts/' + font, 'fonts/' + font);
}
let html = (await readFile(path.join(root, 'pages/paula/index.html'), 'utf8'))
  .replaceAll('../../img/', 'img/').replaceAll('../../shared/', 'shared/');
html = html.replace('<div class="footer-bottom">', '<div class="footer-bottom"><a href="admin/" aria-label="PACA administration">Administration</a>');
await writeFile(path.join(output, 'index.html'), html);
const localePath = path.join(output, 'js/locales.js');
await writeFile(localePath, (await readFile(localePath, 'utf8')).replace('  "staticText": {', '  "staticText": {\n    "Administration": "Administración",\n    "PACA administration": "Administración de PACA",'));
const cssPath = path.join(output, 'css/experience.css');
await writeFile(cssPath, (await readFile(cssPath, 'utf8')).replaceAll('../../../FCT/fonts/', '../fonts/'));
for (const name of ['admin.js', 'admin.css']) await copy('pages/admin/' + name, 'admin/' + name);
const admin = (await readFile(path.join(root, 'pages/admin/index.html'), 'utf8'))
  .replaceAll('../../shared/', '../shared/').replaceAll('../../img/bubble-jk.png', '../img/bubble-paca.png')
  .replaceAll('../paula/js/schedule.js', '../js/schedule.js')
  .replace('<title>JK · Juankmilo</title>', '<title>PACA · Administración</title>')
  .replace('<body>', '<body class="paca-standalone">')
  .replace('<p class="eyebrow">JUANKMILO</p>', '<p class="eyebrow">PACA · PAULA DANIELA</p>');
await writeFile(path.join(output, 'admin/index.html'), admin);
await writeFile(path.join(output, 'admin/admin.css'), (await readFile(path.join(output, 'admin/admin.css'), 'utf8')) + '\n.paca-standalone #app-lbds,.paca-standalone #lbds-panel{display:none!important}\n');
await writeFile(path.join(output, '404.html'), '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PACA · Página no encontrada</title><h1>PACA</h1><p>Esta página no existe.</p><a href="/">Volver a Paula Daniela</a></html>');
await writeFile(path.join(output, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/admin/*\n  Cache-Control: no-store\n  X-Robots-Tag: noindex, nofollow\n');

// Fail the build when the package depends on a local file outside this deployment.
let count = 0;
async function verify(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await verify(file); continue; }
    count++;
    if (!/\.(html|css)$/.test(entry.name)) continue;
    const text = await readFile(file, 'utf8');
    const refs = [...text.matchAll(/(?:src|href)="([^"]+)"|url\(["']?([^"')]+)["']?\)/g)];
    for (const match of refs) {
      const ref = match[1] || match[2];
      if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) continue;
      const pathname = ref.split(/[?#]/)[0];
      const target = pathname.startsWith('/') ? path.join(output, pathname) : path.resolve(path.dirname(file), pathname);
      if (target !== output && !target.startsWith(output + path.sep)) throw new Error('External local dependency: ' + ref);
      if ((await stat(target)).isDirectory()) await readFile(path.join(target, 'index.html'));
    }
  }
}
await verify(output);
console.log(`PACA independent build: ${count} files, verified local references. Output: ${output}`);
