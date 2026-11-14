import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, defaultLoadout, sanitizeLoadout, contrastingAppearance, readLoadout, appearanceKey } from '../src/appearance-core.js';

test('every character and original palette has a different opposing appearance', () => {
  assert.equal(catalog.length,16);
  assert.equal(catalog.reduce((sum,c) => sum+c.variants.length,0),70);
  for (const character of catalog) for (const variant of character.variants) {
    const look = { character: character.id, palette: variant.id };
    assert.notEqual(appearanceKey(contrastingAppearance(look)), appearanceKey(look));
    assert.ok(catalog.some(c => c.id === contrastingAppearance(look).character));
  }
});
test('stored appearance cannot inject invalid characters or palettes into a game', () => {
  assert.deepEqual(sanitizeLoadout({ r:{character:'missing',palette:5}, b:{character:'knight-male',palette:-1} }),defaultLoadout);
  assert.deepEqual(readLoadout({getItem:()=>'{bad json'}),defaultLoadout);
  assert.deepEqual(readLoadout({getItem:()=>{throw new Error('storage blocked');}}),defaultLoadout);
});
