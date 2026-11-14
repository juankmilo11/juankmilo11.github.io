import test from 'node:test';
import assert from 'node:assert/strict';
import { createFloatMotion, floatOffset, createCheerMotion, cheerPose } from '../src/piece-motion.js';

test('floating remains subtle and independent, with no accumulation across frames',()=>{
  const first=createFloatMotion(()=>.2),second=createFloatMotion(()=>.8);
  assert.notEqual(first.phase,second.phase);assert.notEqual(first.speed,second.speed);
  for(let time=0;time<100;time+=.1){
    const offset=floatOffset(time,first);
    assert.ok(offset>=.008&&offset<=.048);
    assert.equal(floatOffset(time,first),offset,'sampling does not mutate the anchor or phase');
  }
  assert.notEqual(floatOffset(1,first),floatOffset(1,second));
});

test('cheering waits, makes a small two-hop burst, lands and schedules a new independent pause',()=>{
  const motion=createCheerMotion(0,()=>.8),other=createCheerMotion(0,()=>.2);
  assert.notEqual(motion.nextAt,other.nextAt);
  assert.equal(cheerPose(motion.nextAt-.01,motion).lift,0);
  const start=motion.nextAt;
  assert.equal(cheerPose(start,motion).lift,0);
  const peak=cheerPose(start+motion.duration/2,motion);
  assert.ok(Math.abs(peak.lift-motion.height)<1e-10&&peak.lift<=.18);
  assert.equal(cheerPose(start+motion.duration+.05,motion).lift,0,'rests between hops');
  const second=cheerPose(start+motion.duration+motion.gap+motion.duration/2,motion);
  assert.ok(Math.abs(second.lift-motion.height)<1e-10);
  const end=start+motion.hops*(motion.duration+motion.gap);
  assert.deepEqual(cheerPose(end,motion,()=>.3),{lift:0,tilt:0,strength:0});
  assert.equal(motion.startedAt,null);assert.ok(motion.nextAt>end);
});
