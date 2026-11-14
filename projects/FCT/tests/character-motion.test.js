import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { animateCharacter } from '../src/character-motion.js';

function rig() {
  return { userData:{rig:Object.fromEntries(['head','body','leftArm','rightArm','leftLeg','rightLeg'].map(name=>[name,{mesh:new THREE.Object3D(),pivot:[0,0.5,0]}]))} };
}
test('idle movement animates the upper body while both feet stay planted',()=>{
  const model=rig();
  animateCharacter(model,0.9);
  assert.notEqual(model.userData.rig.body.mesh.scale.y,1);
  assert.notEqual(model.userData.rig.head.mesh.rotation.y,0);
  for(const name of ['leftLeg','rightLeg']) {
    assert.equal(model.userData.rig[name].mesh.rotation.x,0);
    assert.equal(model.userData.rig[name].mesh.position.y,0.5);
  }
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
