import * as THREE from 'three';
import { tileElevation, tileDetail } from './terrain.js';

export function addFieldLife(world, reducedMotion) {
  const stones = [];
  const mud = new THREE.MeshStandardMaterial({ color: 0x59613f, roughness: 0.45, transparent: true, opacity: 0.36, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 });
  for (let row=0;row<8;row++) for(let file=0;file<8;file++) {
    const kind=tileDetail(row,file);
    const x=file-3.5,z=row-3.5,y=tileElevation(row,file);
    if(kind==='stones') for(let i=0;i<4;i++) {
      const sign=(row+file+i)%3===0?-1:1;
      stones.push({x:x+sign*(0.27+i*0.035),y:y+0.014,z:z+0.30-Math.sin(row*3+file+i)*0.085,size:0.018+(i%3)*0.007});
    }
    if(kind==='mud'||kind==='moss') {
      const shape=new THREE.Shape();
      for(let i=0;i<9;i++) {
        const angle=i/8*Math.PI*2,radius=0.12+Math.sin(i*4+row+file)*0.027;
        const px=Math.cos(angle)*radius,pz=Math.sin(angle)*radius*0.65;
        if(i===0)shape.moveTo(px,pz);else shape.lineTo(px,pz);
      }
      const patch=new THREE.Mesh(new THREE.ShapeGeometry(shape),kind==='mud'?mud:new THREE.MeshStandardMaterial({color:0x8c9562,transparent:true,opacity:0.27,depthWrite:false}));
      patch.rotation.x=-Math.PI/2; patch.position.set(x+(file%2?-.27:.27),y+0.001,z+(row%2?.27:-.27));
      world.add(patch);
    }
  }
  const pebble = new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshStandardMaterial({color:0x8f977c,roughness:1}),stones.length);
  const transform=new THREE.Object3D();
  stones.forEach((stone,i)=>{
    transform.position.set(stone.x,stone.y,stone.z);transform.scale.set(stone.size*1.4,stone.size*.7,stone.size);
    transform.rotation.set(0,i*1.7,0);transform.updateMatrix();pebble.setMatrixAt(i,transform.matrix);
  });
  pebble.castShadow=pebble.receiveShadow=true;world.add(pebble);
  if(reducedMotion)return {update(){}};
  const flock = new THREE.Group(); world.add(flock); flock.visible=false;
  const wingGeometry=new THREE.BufferGeometry();
  wingGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,.28,.035,.05,.14,0,-.06],3));
  wingGeometry.computeVertexNormals();
  const birdMaterial=new THREE.MeshBasicMaterial({color:0x424b40,side:THREE.DoubleSide});
  const birds=[];
  for(let i=0;i<3;i++) {
    const bird=new THREE.Group();
    const left=new THREE.Mesh(wingGeometry,birdMaterial),right=new THREE.Mesh(wingGeometry,birdMaterial);
    right.scale.x=-1;
    bird.add(left,right);bird.position.set(-i*.85,i*.12,-i*.28);flock.add(bird);birds.push({left,right});
  }
  let nextAt=8,startAt=null;
  return { update(time) {
    if(startAt===null&&time>=nextAt)startAt=time;
    if(startAt===null)return;
    const progress=(time-startAt)/13;
    if(progress>=1){flock.visible=false;startAt=null;nextAt=time+14+Math.random()*12;return;}
    flock.visible=true;
    flock.position.set(-10+progress*20,3.5+Math.sin(progress*Math.PI)*.65,-7+Math.sin(progress*Math.PI)*.6);
    birds.forEach(({left,right},i)=>{const flap=Math.sin(time*7+i)*.5;left.rotation.z=flap;right.rotation.z=-flap;});
  } };
}
