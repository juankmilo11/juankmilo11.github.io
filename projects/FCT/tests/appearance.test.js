import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, defaultLoadout, sanitizeLoadout, contrastingAppearance, appearanceKey, availableCharacters, setLoadout, getLoadout, appearanceFor } from '../src/appearance-core.js';

test('every character and original palette has a different opposing appearance', () => {
  assert.equal(catalog.length,16);
  assert.equal(catalog.reduce((sum,c) => sum+c.variants.length,0),70);
  for (const character of catalog) for (const variant of character.variants) {
    const look = { character: character.id, palette: variant.id };
    assert.notEqual(appearanceKey(contrastingAppearance(look)), appearanceKey(look));
    assert.ok(catalog.some(c => c.id === contrastingAppearance(look).character));
  }
});
test('each chess role only accepts its own character family', () => {
  assert.deepEqual(sanitizeLoadout({ r:{character:'missing',palette:5}, b:{character:'knight-male',palette:-1} }),defaultLoadout);
  assert.deepEqual(['p','r','n','b','q','k'].map(role=>availableCharacters(role).length),[2,2,2,6,1,1]);
  assert.deepEqual(sanitizeLoadout({r:{character:'summoner-female',palette:2}}),defaultLoadout);
  assert.equal(appearanceFor('k','b').character,'delita');
  assert.equal(appearanceFor('q','b').character,'teta');
});
test('saved choices last for this page and reset when the module reloads',async()=>{
  setLoadout({...defaultLoadout,r:{character:'knight-male',palette:2}});
  assert.equal(getLoadout().r.character,'knight-male');
  const fresh=await import('../src/appearance-core.js?new-page');
  assert.deepEqual(fresh.getLoadout(),defaultLoadout);
  setLoadout(defaultLoadout);
});
