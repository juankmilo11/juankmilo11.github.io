import test from 'node:test';
import assert from 'node:assert/strict';
import {actionDuration,reverseBattleEvent} from '../src/tactics-animation.js';

test('capture replay restores its victim without mutating rules or snapshots',()=>{
 const before={units:[{id:'w-r',type:'r',square:'d4',captured:false},{id:'b-p',type:'p',square:'d6',captured:false}]};
 const event={kind:'move',from:'d4',to:'d6',unitId:'w-r',capture:{id:'b-p',square:'d6'},targets:[{id:'b-p',square:'d6',captured:true}]},copy=structuredClone({before,event});
 const reverse=reverseBattleEvent(event,before);assert.equal(reverse.from,'d6');assert.equal(reverse.to,'d4');assert.equal(reverse.targets[0].restored,true);assert.equal(reverse.targets[0].captured,false);assert.deepEqual({before,event},copy);
});
test('reverse capture preserves en passant location, castling and promotion paths',()=>{
 const before={units:[{id:'b-p',type:'p',square:'d5',captured:false}]},capture={kind:'move',from:'e5',to:'d6',capture:{id:'b-p',square:'d5',enPassant:true},targets:[{id:'b-p',square:'d5',captured:true}]};
 assert.equal(reverseBattleEvent(capture,before).targets[0].square,'d5');
 const event={kind:'move',from:'e1',to:'g1',castle:{rookId:'w-r',rookFrom:'h1',rookTo:'f1'},promotion:{from:'p',to:'n'},targets:[]},reverse=reverseBattleEvent(event,before);assert.equal(reverse.castle.rookFrom,'f1');assert.equal(reverse.castle.rookTo,'h1');assert.deepEqual(reverse.promotion,{from:'n',to:'p'});
});
test('failed attempts remain visible longer than an idle transition',()=>{assert.ok(actionDuration({kind:'fizzle'})>=600);assert.ok(actionDuration({kind:'pass'})>=400);});
