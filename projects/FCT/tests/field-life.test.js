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
test('four smaller flocks cross with independent wing phases and bounded instances',()=>{
  const world=new THREE.Group(),life=addFieldLife(world,false);
  const flocks=world.getObjectByName('bird-flocks').children;
  assert.equal(flocks.length,4);assert.ok(flocks.every(flock=>!flock.visible));
  life.update(100);assert.ok(flocks.every(flock=>!flock.visible),'late game entry still starts the staggered schedule');
  for(let time=101;time<=114;time++)life.update(time);
  assert.equal(flocks.filter(flock=>flock.visible).reduce((sum,flock)=>sum+flock.userData.birdCount,0),26);
  const first=flocks[0].children[0].instanceMatrix.array.slice();
  life.update(114.2);assert.notDeepEqual(flocks[0].children[0].instanceMatrix.array,first);
  for(let time=115;time<220;time++)life.update(time);
  assert.equal(flocks.reduce((sum,flock)=>sum+flock.children[1].count,0),26,'bird count stays bounded across repeated crossings');
  assert.ok(flocks.every(flock=>flock.children.every(mesh=>Array.from(mesh.instanceMatrix.array).every(Number.isFinite))));
});
test('bird flocks stay disabled for reduced-motion preferences',()=>{
  const quiet=new THREE.Group();const staticLife=addFieldLife(quiet,true);
  assert.equal(quiet.children.filter(child=>child.isGroup).length,0);
  assert.doesNotThrow(()=>staticLife.update(1000));
});
