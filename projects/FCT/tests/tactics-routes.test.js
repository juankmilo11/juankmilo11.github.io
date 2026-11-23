import test from 'node:test';
import assert from 'node:assert/strict';
import {groundArrowPatches} from '../src/tactics-routes.js';
import {tileElevation} from '../src/terrain.js';

test('ground arrows stay flat on each landing surface, including raised central tiles',()=>{
 for(const [from,to]of [['a1','a8'],['a1','h8'],['h1','a8'],['b1','c3'],['d4','e4']]){
  const patches=groundArrowPatches(from,to);assert.ok(patches.length>=2);
  for(const patch of patches){const file=patch.square.charCodeAt(0)-97,row=8-Number(patch.square[1]);assert.equal(patch.height,tileElevation(row,file)+.024);assert.ok(patch.polygon.length>=3);for(const point of patch.polygon){assert.ok(Math.abs(point.x-(file-3.5))<=.462001);assert.ok(Math.abs(point.z-(row-3.5))<=.462001);}}
 }
 assert.deepEqual(groundArrowPatches('a1','a1'),[]);assert.deepEqual(groundArrowPatches(null,'e4'),[]);assert.deepEqual(groundArrowPatches('i9','e4'),[]);
});
