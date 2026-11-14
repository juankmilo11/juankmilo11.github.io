import test from 'node:test';
import assert from 'node:assert/strict';
import { ShuffleQueue } from '../src/shuffle-queue.js';
test('every cycle plays all tracks once, without an immediate boundary repeat',()=>{
  const queue=new ShuffleQueue([0,1,2,3,4,5,6,7]);let last=null;
  for(let cycle=0;cycle<30;cycle++){
    const themes=Array.from({length:8},()=>queue.next());
    assert.equal(new Set(themes).size,8);assert.notEqual(themes[0],last);last=themes.at(-1);
  }
});
test('previous and forward navigate real history, not a new random choice',()=>{
  const queue=new ShuffleQueue(['a','b','c'],()=>.3);
  const a=queue.next(),b=queue.next(),c=queue.next();
  assert.equal(queue.previous(),b);assert.equal(queue.previous(),a);
  assert.equal(queue.previous(),a);assert.equal(queue.next(),b);assert.equal(queue.next(),c);
  assert.notEqual(queue.next(),c);
});
