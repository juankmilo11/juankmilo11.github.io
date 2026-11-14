import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { addFieldLife } from '../src/field-life.js';
import { tileDetail } from '../src/terrain.js';

test('only dark squares receive scattered stones, mud or moss',()=>{
  const kinds=new Set();
  for(let row=0;row<8;row++)for(let file=0;file<8;file++){
    const kind=tileDetail(row,file);
    if((row+file)%2===0)assert.equal(kind,'grass');else kinds.add(kind);
  }
  assert.ok(kinds.has('stones')&&kinds.has('mud')&&kinds.has('grass'));
});
test('birds cross occasionally and stay disabled for reduced-motion preferences',()=>{
  const world=new THREE.Group(),life=addFieldLife(world,false);
  const flock=world.children.at(-1);
  assert.equal(flock.visible,false);
  life.update(19);assert.equal(flock.visible,true);
  life.update(34);assert.equal(flock.visible,false);
  const quiet=new THREE.Group();const staticLife=addFieldLife(quiet,true);
  assert.equal(quiet.children.filter(child=>child.isGroup).length,0);
  assert.doesNotThrow(()=>staticLife.update(1000));
});
