const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const copy=require('../pages/paula/js/locales.js');
test('all runtime messages and template placeholders exist in both languages',()=>{
 assert.deepEqual(Object.keys(copy.en).sort(),Object.keys(copy.es).sort());
 for(const key of Object.keys(copy.en)){
  assert.ok(copy.en[key].trim()&&copy.es[key].trim(),key);
  const placeholders=text=>[...text.matchAll(/\{(\w+)\}/g)].map(match=>match[1]).sort();
  assert.deepEqual(placeholders(copy.en[key]),placeholders(copy.es[key]),key);
 }
});
test('every catalog item retains English source copy and Spanish translations in its regeneration source',()=>{
 const catalog=JSON.parse(fs.readFileSync('pages/paula/assets/catalog.json','utf8')).entries;
 const selected=JSON.parse(fs.readFileSync('projects/PACA/selection.json','utf8'));
 for(const entry of catalog){
  const original=selected.find(item=>item.id===entry.id);
  assert.ok(original,entry.id);
  assert.equal(entry.title,original.title);assert.equal(entry.alt,original.alt);
  assert.deepEqual(entry.translations,original.translations);
  assert.ok(entry.translations.es.title&&entry.translations.es.alt,entry.id);
 }
});
