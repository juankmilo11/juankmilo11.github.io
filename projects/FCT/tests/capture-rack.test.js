import test from 'node:test';
import assert from 'node:assert/strict';
import {captureRackPose,orderedCaptures} from '../src/capture-rack.js';
test('capture stands use mirrored orientations and fill eight ordered slots before the second row',()=>{for(let i=0;i<16;i++){const w=captureRackPose('w',i),b=captureRackPose('b',i);assert.equal(w.x,-b.x);assert.equal(w.z,b.z);assert.equal(w.y,b.y);assert.equal(w.yaw,-b.yaw);if(i)assert.notDeepEqual(w,captureRackPose('w',i-1));}assert.ok(captureRackPose('w',8).x>captureRackPose('w',7).x);});
test('captured pieces sort by capture order rather than type or initial army order',()=>{const units=[{id:'b-q',captured:true,color:'b',captureOrder:9},{id:'b-p',captured:true,color:'b',captureOrder:2},{id:'w-p',captured:true,color:'w',captureOrder:1},{id:'b-r',color:'b'}];assert.deepEqual(orderedCaptures(units,'b').map(u=>u.id),['b-p','b-q']);assert.equal(units[0].id,'b-q');});
