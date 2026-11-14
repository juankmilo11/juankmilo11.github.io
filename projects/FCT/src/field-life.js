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
  const aviary=new THREE.Group();aviary.name='bird-flocks';world.add(aviary);
  const wingGeometry=new THREE.BufferGeometry();
  wingGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,.28,.035,.05,.14,0,-.06],3));
  wingGeometry.computeVertexNormals();
  const bodyGeometry=new THREE.SphereGeometry(1,6,4);
  const birdMaterial=new THREE.MeshBasicMaterial({color:0x343d30,side:THREE.DoubleSide});
  const flocks=[6,8,5,7].map((count,index)=>{
    const group=new THREE.Group();group.name=`bird-flock-${index}`;group.visible=false;group.userData.birdCount=count;aviary.add(group);
    const wings=new THREE.InstancedMesh(wingGeometry,birdMaterial,count*2);
    const bodies=new THREE.InstancedMesh(bodyGeometry,birdMaterial,count);
    for(const mesh of [wings,bodies]){mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;group.add(mesh);}
    const birds=Array.from({length:count},(_,i)=>({
      x:(i%2?1:-1)*Math.ceil(i/2)*.38,z:-Math.ceil(i/2)*.42,
      phase:Math.random()*Math.PI*2,speed:6+Math.random()*3,size:.68+Math.random()*.35,
    }));
    return {group,wings,bodies,birds,nextAt:1+index*3,startAt:null,duration:18,lane:0,height:0};
  });
  let bornAt=null;
  return { update(now) {
    bornAt??=now;
    const time=now-bornAt;
    for(const flock of flocks){
      if(flock.startAt===null&&time>=flock.nextAt){
        flock.startAt=time;
        flock.duration=18+Math.random()*10;
        const angle=Math.random()*Math.PI*2;
        flock.dx=Math.cos(angle);flock.dz=Math.sin(angle);
        flock.lane=-5.5+Math.random()*3;
        flock.height=1.5+Math.random()*1.4;
        flock.curve=(Math.random()-.5)*3;
        const formation=Math.floor(Math.random()*3),spread=.3+Math.random()*.25;
        flock.birds.forEach((bird,i)=>{
          const rank=Math.ceil(i/2);
          if(formation===0){bird.x=(i%2?1:-1)*rank*spread;bird.z=-rank*spread;}
          else if(formation===1){bird.x=(i-(flock.birds.length-1)/2)*spread;bird.z=(Math.random()-.5)*.7;}
          else {bird.x=(Math.random()-.5)*3;bird.z=(Math.random()-.5)*2.5;}
        });
      }
      if(flock.startAt===null)continue;
      const progress=(time-flock.startAt)/flock.duration;
      if(progress>=1){flock.group.visible=false;flock.startAt=null;flock.nextAt=time+2+Math.random()*4;continue;}
      flock.group.visible=true;
      const travel=-12+progress*24,bend=Math.sin(progress*Math.PI)*flock.curve;
      flock.group.position.set(flock.dx*travel-flock.dz*bend,flock.height+Math.sin(progress*Math.PI)*.35,flock.lane+flock.dz*travel+flock.dx*bend);
      const bendSpeed=Math.cos(progress*Math.PI)*Math.PI*flock.curve;
      flock.group.rotation.y=Math.atan2(flock.dx*24-flock.dz*bendSpeed,flock.dz*24+flock.dx*bendSpeed);
      flock.birds.forEach((bird,i)=>{
        const y=Math.sin(time*1.3+bird.phase)*.055,flap=Math.sin(time*bird.speed+bird.phase)*.65;
        transform.position.set(bird.x,y,bird.z);transform.rotation.set(0,0,0);transform.scale.set(bird.size*.045,bird.size*.045,bird.size*.14);transform.updateMatrix();flock.bodies.setMatrixAt(i,transform.matrix);
        for(let side=0;side<2;side++){
          const sign=side?1:-1;transform.rotation.z=sign*flap;transform.scale.set(sign*bird.size,bird.size,bird.size);transform.updateMatrix();flock.wings.setMatrixAt(i*2+side,transform.matrix);
        }
      });
      flock.wings.instanceMatrix.needsUpdate=true;flock.bodies.instanceMatrix.needsUpdate=true;
    }
  } };
}
