import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { animateCharacter } from '../src/character-motion.js';

function rig() {
  return { userData:{rig:Object.fromEntries(['head','body','leftArm','rightArm','leftLeg','rightLeg'].map(name=>[name,{mesh:new THREE.Object3D(),pivot:[0,0.5,0]}]))} };
}
test('idle marching alternates feet gently without shifting the board position',()=>{
  const model=rig();
  animateCharacter(model,0.9);
  assert.notEqual(model.userData.rig.body.mesh.scale.y,1);
  assert.notEqual(model.userData.rig.head.mesh.rotation.y,0);
  const left=model.userData.rig.leftLeg.mesh,right=model.userData.rig.rightLeg.mesh;
  assert.notEqual(left.rotation.x,0);
  assert.equal(left.rotation.x,-right.rotation.x);
  for(const leg of [left,right]){assert.ok(leg.position.y>=.5&&leg.position.y<=.509);assert.equal(leg.position.z,0);}
});
test('walking swings arms and legs, and reduced motion restores a still pose',()=>{
  const model=rig();
  animateCharacter(model,0.9,{moving:true});
  assert.notEqual(model.userData.rig.leftLeg.mesh.rotation.x,0);
  assert.equal(model.userData.rig.leftLeg.mesh.rotation.x,-model.userData.rig.rightLeg.mesh.rotation.x);
  animateCharacter(model,1,{moving:true,reducedMotion:true});
  for(const {mesh} of Object.values(model.userData.rig)) {
    assert.equal(mesh.rotation.x,0); assert.equal(mesh.rotation.y,0); assert.equal(mesh.scale.y,1);
  }
});

test('captured characters raise both arms while cheering and return to their normal pose',()=>{
  const model=rig();
  animateCharacter(model,1,{cheer:1});
  assert.equal(model.userData.rig.leftArm.mesh.rotation.z,.65);
  assert.equal(model.userData.rig.rightArm.mesh.rotation.z,-.65);
  animateCharacter(model,1);
  assert.equal(model.userData.rig.leftArm.mesh.rotation.z,0);
  animateCharacter(model,1,{cheer:1,reducedMotion:true});
  assert.equal(model.userData.rig.rightArm.mesh.rotation.z,0);
});
