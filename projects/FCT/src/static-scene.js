import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Keep instanced foliage intact; merge only ordinary, immutable scenery meshes.
export function batchStaticScene(group){
  const batches=new Map(),retired=new Set();
  for(const mesh of [...group.children]){
    if(!mesh.isMesh||mesh.isInstancedMesh||mesh.children.length||Array.isArray(mesh.material))continue;
    const key=[mesh.material.uuid,mesh.castShadow,mesh.receiveShadow,Boolean(mesh.geometry.index),Object.keys(mesh.geometry.attributes).sort().join(',')].join(':');
    if(!batches.has(key))batches.set(key,[]);batches.get(key).push(mesh);
  }
  for(const meshes of batches.values()){
    if(meshes.length<2)continue;
    const copies=meshes.map(mesh=>{mesh.updateMatrix();return mesh.geometry.clone().applyMatrix4(mesh.matrix);});
    const geometry=mergeGeometries(copies,false);copies.forEach(copy=>copy.dispose());if(!geometry)continue;
    const merged=new THREE.Mesh(geometry,meshes[0].material);merged.castShadow=meshes[0].castShadow;merged.receiveShadow=meshes[0].receiveShadow;merged.name='static-scenery-batch';group.add(merged);
    for(const mesh of meshes){group.remove(mesh);retired.add(mesh.geometry);}
  }
  const retained=new Set();group.traverse(mesh=>{if(mesh.geometry)retained.add(mesh.geometry);});
  for(const geometry of retired)if(!retained.has(geometry))geometry.dispose();
}
