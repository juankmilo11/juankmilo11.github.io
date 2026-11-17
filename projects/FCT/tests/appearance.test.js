import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, defaultLoadout, sanitizeLoadout, contrastingAppearance, appearanceKey, availableCharacters, setLoadout, getLoadout, appearanceFor, characterHeight } from '../src/appearance-core.js';

test('every character and original palette has a different opposing appearance', () => {
  assert.equal(catalog.length,38);
  assert.ok(catalog.every(c=>c.variants.length===5));
  assert.equal(catalog.reduce((sum,c) => sum+c.variants.length,0),190);
  for (const character of catalog) for (const variant of character.variants) {
    const look = { character: character.id, palette: variant.id };
    assert.notEqual(appearanceKey(contrastingAppearance(look)), appearanceKey(look));
    assert.ok(catalog.some(c => c.id === contrastingAppearance(look).character));
  }
});
test('each chess role only accepts its own character family', () => {
  assert.deepEqual(sanitizeLoadout({ r:{character:'missing',palette:5}, b:{character:'knight-male',palette:-1} }),defaultLoadout);
  assert.deepEqual(['p','r','n','b','q','k'].map(role=>availableCharacters(role).length),[6,6,6,6,6,6]);
  assert.deepEqual(sanitizeLoadout({r:{character:'summoner-female',palette:2}}),defaultLoadout);
  assert.ok(['dycedarg','gaff-gafgarion'].includes(appearanceFor('k','b').character));
  assert.equal(appearanceFor('q','b').character,'teta');
});
test('Teta and Delita can be chosen, with opposing royal characters and ordered heights',()=>{
  const choices={...defaultLoadout,q:{character:'teta',palette:2},k:{character:'delita',palette:1}};
  assert.deepEqual(sanitizeLoadout(choices),choices);
  assert.equal(appearanceFor('q','b',choices).character,'agrias');
  assert.ok(['dycedarg','gaff-gafgarion'].includes(appearanceFor('k','b',choices).character));
  assert.ok(characterHeight('k')>characterHeight('q'));
  for(const role of ['p','r','n','b'])assert.ok(characterHeight('q')>characterHeight(role));
});

test('enemy kings remain exclusive to the AI across every player king and color',()=>{
  const seen=new Set();
  for(const character of availableCharacters('k'))for(const variant of character.variants){
    const choices={...defaultLoadout,k:{character:character.id,palette:variant.id}};
    const enemy=appearanceFor('k','b',choices);seen.add(enemy.character);
    assert.ok(['dycedarg','gaff-gafgarion'].includes(enemy.character));
  }
  assert.equal(seen.size,2);
  for(const character of ['dycedarg','gaff-gafgarion']){
    for(const role of ['p','r','n','b','q','k'])assert.ok(!availableCharacters(role).some(c=>c.id===character));
    assert.deepEqual(sanitizeLoadout({k:{character,palette:0}}).k,defaultLoadout.k);
  }
});
test('saved choices last for this page and reset when the module reloads',async()=>{
  setLoadout({...defaultLoadout,r:{character:'knight-male',palette:2}});
  assert.equal(getLoadout().r.character,'knight-male');
  const fresh=await import('../src/appearance-core.js?new-page');
  assert.deepEqual(fresh.getLoadout(),defaultLoadout);
  setLoadout(defaultLoadout);
});
