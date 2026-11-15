import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../pages/paula/',import.meta.url));
const {entries}=JSON.parse(readFileSync(path.join(root,'assets/catalog.json'),'utf8'));
const ids=new Set(),categories=new Set(['nails','tattoo','pmu','makeup']);
let videos=0;
for(const entry of entries){
  assert.ok(!/braids|hair-color|trenzas|coloración/i.test(JSON.stringify(entry)),`Servicio retirado: ${entry.id}`);
  assert.ok(entry.id&&!ids.has(entry.id),`Identificador duplicado: ${entry.id}`);ids.add(entry.id);
  assert.ok(categories.has(entry.category),`Categoría desconocida: ${entry.id}`);
  assert.ok(entry.title&&entry.alt&&entry.width>0&&entry.height>0,`Metadatos incompletos: ${entry.id}`);
  assert.ok(entry.translations?.es?.title && entry.translations.es.alt,`Traducción incompleta: ${entry.id}`);
  for(const resource of [entry.src,entry.video].filter(Boolean)){
    assert.match(resource,/^assets\/[a-z\d-]+\.(webp|mp4)$/);
    assert.ok(existsSync(path.join(root,resource)),`Recurso ausente: ${resource}`);
    assert.ok(statSync(path.join(root,resource)).size<4*1024*1024,`Recurso demasiado pesado: ${resource}`);
  }
  if(entry.video)videos++;
}
for(const category of categories)assert.ok(entries.some(e=>e.category===category),`Categoría sin trabajos: ${category}`);
const html=readFileSync(path.join(root,'index.html'),'utf8');
const sprite=readFileSync(path.join(root,'assets/icons.svg'),'utf8');
const iconIds=new Set([...sprite.matchAll(/<symbol id="([^"]+)"/g)].map(match=>match[1]));
for(const match of html.matchAll(/assets\/icons\.svg#([\w-]+)/g))assert.ok(iconIds.has(match[1]),`Icono ausente: ${match[1]}`);
for(const filename of ['js/app.js','js/booking.js','js/locales.js','index.html']){
  const content=readFileSync(path.join(root,filename),'utf8');
  assert.doesNotMatch(content,/✳|↗|↘|↙|↑|↓|←|→/,`Icono Unicode sin sustituir: ${filename}`);
  assert.doesNotMatch(content,/hair|braids|trenzas|coloración/i,`Servicio retirado en ${filename}`);
}
assert.match(html,/<html lang="en"/,'El idioma original debe ser inglés');
const targetIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(targetIds).size,targetIds.length,'IDs de HTML duplicados');
for(const match of html.matchAll(/href="#([^"]+)"/g))assert.ok(targetIds.includes(match[1]),`Ancla ausente: ${match[1]}`);
assert.match(html,/<form id="booking-form" method="dialog">/);
assert.match(html,/<button id="booking-submit"[^>]*disabled/);
console.log(`PACA OK: ${entries.length} trabajos, ${videos} videos, recursos locales y anclas válidas; formulario seguro sin JavaScript.`);
