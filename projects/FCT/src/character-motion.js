import * as THREE from 'three';

// Each royal appearance shares an articulated rig, so threat poses preserve its
// own silhouette and colors rather than replacing it with a generic king.
function applyKingPose(character, pose) {
  if (!character.position || !character.rotation) return;
  const height=character.userData.height||1;
  character.position.set(0,0,0);character.rotation.x=character.rotation.z=0;
  if(pose==='standing')return;
  const rig=character.userData.rig;
  for(const [name,{mesh,pivot}]of Object.entries(rig)){
    mesh.position.fromArray(pivot);mesh.rotation.set(0,0,0);mesh.scale.set(1,1,1);
    if(pose==='check'){
      mesh.position.y-=height*.18;
      if(name==='body'){mesh.rotation.x=.32;mesh.position.z+=height*.035;}
      if(name==='head'){mesh.rotation.x=.25;mesh.position.y-=height*.025;mesh.position.z+=height*.09;}
      if(name.includes('Arm')){mesh.rotation.x=-.72;mesh.rotation.z=name==='leftArm'?.1:-.1;}
      if(name.includes('Leg')){mesh.rotation.x=name==='leftLeg'?-1.1:-.86;mesh.scale.y=.76;mesh.position.y+=height*.045;}
    }else{
      // Resting on one side, head bowed and limbs relaxed against the ground.
      if(name==='head')mesh.rotation.z=-.18;
      if(name.includes('Arm')){mesh.rotation.x=-.22;mesh.rotation.z=name==='leftArm'?.2:-.28;}
      if(name.includes('Leg'))mesh.rotation.x=name==='leftLeg'?.16:-.12;
    }
  }
  if(pose==='defeated')character.rotation.z=-Math.PI/2;
  // Fit the actual posed mesh to the square's ground plane. This is cached per
  // model/pose, not recomputed for every animation frame or board piece.
  const fitKey=`${pose}:${character.scale.x}:${character.rotation.y}`;
  character.userData.poseFits??=new Map();
  if(!character.userData.poseFits.has(fitKey)){
    const bounds=new THREE.Box3(),rotation=new THREE.Matrix4().makeRotationFromEuler(character.rotation);
    for(const {mesh}of Object.values(rig)){
      mesh.geometry?.computeBoundingBox();mesh.updateMatrix();
      if(mesh.geometry?.boundingBox)bounds.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrix).applyMatrix4(rotation));
    }
    if(!bounds.isEmpty()){
      const center=bounds.getCenter(new THREE.Vector3()),scale=character.scale;
      character.userData.poseFits.set(fitKey,[pose==='defeated'?-center.x*scale.x:0,-bounds.min.y*scale.y+.004,pose==='defeated'?-center.z*scale.z:0]);
    }else character.userData.poseFits.set(fitKey,[0,0,0]);
  }
  character.position.fromArray(character.userData.poseFits.get(fitKey));
}

export function animateCharacter(character, time, { moving = false, selected = false, reducedMotion = false, phase = 0, cheer = 0, kingPose = 'standing' } = {}) {
  const rig = character?.userData.rig;
  if (!rig) return;
  const breath = Math.sin(time * 1.8 + phase), sway = Math.sin(time * 1.1 + phase);
  const gait = Math.sin(time * (moving?11:3.7+Math.sin(phase)*.3) + phase);
  for (const [name, { mesh, pivot }] of Object.entries(rig)) {
    mesh.position.fromArray(pivot); mesh.rotation.set(0,0,0); mesh.scale.set(1,1,1);
    if (reducedMotion) continue;
    if (name === 'body') { mesh.scale.y = 1 + breath * 0.006; mesh.rotation.z = sway * 0.009; mesh.position.y+=Math.sin(time*7.4+phase)*.002; }
    if (name === 'head') { mesh.position.y += breath * 0.003; mesh.rotation.y = sway * (selected ? 0.065 : 0.025); }
    if (name.includes('Arm')) {
      mesh.rotation.x = gait * (moving?.28:.055) * (name === 'leftArm' ? 1 : -1);
      mesh.rotation.z = cheer*.65*(name==='leftArm'?1:-1);
    }
    if (name.includes('Leg')) {
      const step=gait*(name==='leftLeg'?-1:1);
      mesh.rotation.x=step*(moving?.30:.10);
      mesh.position.y+=Math.max(0,step)*(moving?.022:.008);
    }
  }
  const pose=['check','defeated'].includes(kingPose)?kingPose:'standing';
  applyKingPose(character,pose);
  character.userData.kingPose=pose;
}
