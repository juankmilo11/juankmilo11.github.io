import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const errors = [];
const files = [];
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(filename);
    else if (/\.(html|css)$/.test(entry.name)) files.push(filename);
  }
}
files.push(path.join(root, 'index.html'), path.join(root, 'styles.css'));
collect(path.join(root, 'pages'));
collect(path.join(root, 'FCT'));

function checkReference(filename, reference) {
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) return;
  const pathname = decodeURIComponent(reference.split(/[?#]/)[0]);
  if (!pathname) return;
  let target = pathname.startsWith('/')
    ? path.join(root, pathname.slice(1))
    : path.resolve(path.dirname(filename), pathname);
  if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!existsSync(target)) errors.push(`${path.relative(root, filename)}: ${reference}`);
}
for (const filename of files) {
  const source = readFileSync(filename, 'utf8');
  if (filename.endsWith('.html')) {
    for (const match of source.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
      checkReference(filename, match[1]);
    }
  }
  for (const match of source.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/gi)) {
    checkReference(filename, match[1]);
  }
}
if (existsSync(path.join(root, 'projects/PACA/index.html'))) {
  errors.push('PACA tiene una segunda fuente en projects/PACA; usar pages/paula.');
}
// Backgrounds are assigned dynamically, so HTML/CSS checks cannot catch them.
const homepage = readFileSync(path.join(root, 'script.js'), 'utf8');
const backgroundList = /const fondosGif = (\[[\s\S]*?\]);/.exec(homepage);
if (!backgroundList) {
  errors.push('script.js: no se encontró el inventario fondosGif.');
} else {
  const backgrounds = JSON.parse(backgroundList[1]);
  const onDisk = readdirSync(path.join(root, 'img/fondos'))
    .filter(name => name.endsWith('.gif')).map(name => `img/fondos/${name}`);
  for (const background of backgrounds) checkReference(path.join(root, 'script.js'), background);
  if (backgrounds.length !== new Set(backgrounds).size) errors.push('fondosGif contiene duplicados.');
  for (const background of onDisk) {
    if (!backgrounds.includes(background)) errors.push(`Fondo sin registrar: ${background}`);
  }
}
if (errors.length) {
  console.error(`Referencias o estructura inválidas:\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${files.length} archivos HTML/CSS publicados; referencias locales y fondos válidos; PACA unificado.`);
}
