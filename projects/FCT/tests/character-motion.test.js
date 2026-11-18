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

function royalRig(facing=0){
  const model=new THREE.Group();model.rotation.y=facing;model.userData.height=1;
  const specs={head:[[0,.84,0],[.24,.28,.22]],body:[[0,.49,0],[.3,.4,.23]],
    leftArm:[[-.23,.5,0],[.13,.4,.15]],rightArm:[[.23,.5,0],[.13,.4,.15]],
    leftLeg:[[-.09,.17,0],[.14,.34,.17]],rightLeg:[[.09,.17,0],[.14,.34,.17]]};
  model.userData.rig=Object.fromEntries(Object.entries(specs).map(([name,[pivot,size]])=>{
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size));mesh.position.fromArray(pivot);model.add(mesh);
    return [name,{mesh,pivot}];
  }));return model;
}

test('checked kings kneel on the square and defeated kings rest on the ground',()=>{
  for(const facing of [0,Math.PI]){
    const model=royalRig(facing),size=new THREE.Vector3();
    animateCharacter(model,0,{reducedMotion:true});
    const standing=new THREE.Box3().setFromObject(model).getSize(size).y;
    animateCharacter(model,1,{kingPose:'check',reducedMotion:true});
    const crouch=new THREE.Box3().setFromObject(model);
    assert.ok(crouch.min.y>=0&&crouch.min.y<.01,'kneeling feet remain on the ground');
    assert.ok(crouch.getSize(new THREE.Vector3()).y<standing*.95,'the king actually lowers its silhouette');
    assert.ok(model.userData.rig.body.mesh.rotation.x>.2);
    assert.ok(model.userData.rig.leftLeg.mesh.rotation.x<-.8);
    animateCharacter(model,2,{kingPose:'defeated',reducedMotion:true});
    const fallen=new THREE.Box3().setFromObject(model),extent=fallen.getSize(new THREE.Vector3()),center=fallen.getCenter(new THREE.Vector3());
    assert.ok(fallen.min.y>=0&&fallen.min.y<.01,'the defeated figure lies against the board');
    assert.ok(extent.x>extent.y*1.4,'defeat is a horizontal resting silhouette');
    assert.ok(Math.abs(center.x)<.001&&Math.abs(center.z)<.001,'both facing directions stay centered on the square');
    const snapshot=model.toJSON();
    animateCharacter(model,50,{kingPose:'defeated',reducedMotion:false});
    assert.deepEqual(model.toJSON(),snapshot,'defeated kings stay down despite idle animation');
    for(const {mesh}of Object.values(model.userData.rig))mesh.geometry.dispose();
  }
});

test('reviewing out of check or mate restores the original king rig',()=>{
  const model=royalRig(Math.PI);
  for(const kingPose of ['check','defeated','check','standing'])animateCharacter(model,3,{kingPose,reducedMotion:true});
  assert.equal(model.rotation.x,0);assert.equal(model.rotation.z,0);assert.equal(model.rotation.y,Math.PI);
  assert.deepEqual(model.position.toArray(),[0,0,0]);
  for(const {mesh,pivot}of Object.values(model.userData.rig)){
    assert.deepEqual(mesh.position.toArray(),pivot);assert.deepEqual(mesh.rotation.toArray().slice(0,3),[0,0,0]);
    assert.deepEqual(mesh.scale.toArray(),[1,1,1]);mesh.geometry.dispose();
  }
});
