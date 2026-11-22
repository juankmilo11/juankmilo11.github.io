import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { renderQuality } from '../src/render-quality.js';
import { batchStaticScene } from '../src/static-scene.js';

test('limited devices reduce resolution, shadows and frame rate without depending on screen density',()=>{
  for(const profile of [{memory:2,cores:8},{memory:16,cores:2},{lite:true}]){
    const quality=renderQuality(profile);assert.equal(quality.shadows,false);assert.equal(quality.idle,false);assert.equal(quality.fps,30);assert.equal(quality.pixelRatio,1);
  }
  assert.equal(renderQuality({memory:16,cores:8}).shadows,true);assert.equal(renderQuality({coarse:true}).shadowSize,512);
});

test('static batching preserves bounds and instanced decorations while reducing draw calls',()=>{
  const scene=new THREE.Group(),material=new THREE.MeshBasicMaterial(),geometry=new THREE.BoxGeometry();
  for(let i=0;i<10;i++){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(i,i%2,-i);scene.add(mesh);}
  const instanced=new THREE.InstancedMesh(geometry,material,2);scene.add(instanced);
  const before=new THREE.Box3().setFromObject(scene);batchStaticScene(scene);const after=new THREE.Box3().setFromObject(scene);
  assert.ok(before.min.distanceTo(after.min)<1e-6);assert.ok(before.max.distanceTo(after.max)<1e-6);assert.equal(scene.children.length,2);assert.ok(scene.children.includes(instanced));
});
