import * as THREE from 'three';

function glowTexture(color) {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,1,64,64,64);
  gradient.addColorStop(0,color);gradient.addColorStop(.12,color);gradient.addColorStop(1,'#00000000');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
function planetTexture() {
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
  const ctx=canvas.getContext('2d'),data=ctx.createImageData(512,256);
  for(let y=0;y<256;y++)for(let x=0;x<512;x++){
    const band=Math.sin(y*.12+Math.sin(x*.025)*1.7)*.5+Math.sin(y*.35)*.15;
    const light=.45+.55*Math.max(0,Math.cos((x/512-.38)*Math.PI*2));
    const i=(y*512+x)*4;data.data[i]=(83+band*30)*light;data.data[i+1]=(122+band*26)*light;data.data[i+2]=(139+band*23)*light;data.data[i+3]=255;
  }
  ctx.putImageData(data,0,0);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
function galaxyTexture() {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const ctx=canvas.getContext('2d');
  for(let i=0;i<3300;i++){
    const random=Math.sin(i*127.1+3)*43758.5453,noise=random-Math.floor(random);
    const radius=Math.sqrt(i/3300)*210,angle=radius*.047+(i%3)*Math.PI*2/3+noise*.55;
    const x=256+Math.cos(angle)*radius,y=256+Math.sin(angle)*radius*.62;
    ctx.fillStyle=i%4?'#acbfe260':'#d5b5ee80';ctx.fillRect(x,y,1+noise*2,1+noise*2);
  }
  const center=ctx.createRadialGradient(256,256,0,256,256,110);
  center.addColorStop(0,'#fff0d9dd');center.addColorStop(.16,'#e5cce977');center.addColorStop(1,'#a9b1de00');ctx.fillStyle=center;ctx.fillRect(0,0,512,512);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export function createCosmos(scene,reducedMotion) {
  const sky=new THREE.Group();scene.add(sky);
  const positions=[],colors=[];
  for(let i=0;i<650;i++){
    const a=i*2.399963,r=44,y=-23+((i*73)%100)/100*47,horizontal=Math.sqrt(r*r-y*y);
    positions.push(Math.cos(a)*horizontal,y,Math.sin(a)*horizontal);
    const tint=i%3===0?.8:1;colors.push(tint,.86+.14*tint,1);
  }
  const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));starGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  const stars=new THREE.Points(starGeometry,new THREE.PointsMaterial({size:.13,map:glowTexture('#f6efde'),transparent:true,opacity:.8,vertexColors:true,depthWrite:false,fog:false}));
  stars.renderOrder=-30;sky.add(stars);
  const planet=new THREE.Mesh(new THREE.SphereGeometry(3.4,40,28),new THREE.MeshBasicMaterial({map:planetTexture(),fog:false,depthWrite:false}));
  planet.position.set(-18,-10,-39);planet.renderOrder=-25;sky.add(planet);
  const aura=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('#93b2d950'),depthWrite:false,fog:false}));aura.position.copy(planet.position);aura.scale.set(12,12,1);aura.renderOrder=-26;sky.add(aura);
  const moon=new THREE.Mesh(new THREE.SphereGeometry(1.65,28,20),new THREE.MeshStandardMaterial({color:0x777569,roughness:1,fog:false,depthWrite:false}));moon.position.set(20,-13,-38);moon.renderOrder=-25;sky.add(moon);
  const rings=new THREE.Mesh(new THREE.RingGeometry(2.2,3.4,96),new THREE.MeshBasicMaterial({color:0xc7b791,side:THREE.DoubleSide,transparent:true,opacity:.42,depthWrite:false,fog:false}));
  rings.position.copy(moon.position);rings.rotation.set(1.08,.12,-.35);rings.renderOrder=-24;sky.add(rings);
  const galaxy=new THREE.Sprite(new THREE.SpriteMaterial({map:galaxyTexture(),transparent:true,depthWrite:false,fog:false,rotation:.3}));galaxy.position.set(-23,-15,35);galaxy.scale.set(19,13,1);galaxy.renderOrder=-27;sky.add(galaxy);
  const hole=new THREE.Group();hole.position.set(25,-12,30);sky.add(hole);
  const disk=new THREE.Mesh(new THREE.TorusGeometry(2.1,.13,10,96),new THREE.MeshBasicMaterial({color:0xd6a56a,transparent:true,opacity:.7,depthWrite:false,fog:false}));disk.rotation.x=1.14;disk.rotation.z=.3;disk.renderOrder=-23;hole.add(disk);
  const core=new THREE.Mesh(new THREE.SphereGeometry(1.15,32,24),new THREE.MeshBasicMaterial({color:0x090d16,depthWrite:false,fog:false}));core.renderOrder=-22;hole.add(core);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('#e3b27360'),depthWrite:false,fog:false}));halo.scale.set(9,6,1);halo.renderOrder=-26;hole.add(halo);
  const meteorGeometry=new THREE.BufferGeometry();meteorGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,1,0,0],3));
  const meteor=new THREE.Line(meteorGeometry,new THREE.LineBasicMaterial({color:0xe5e5e3,transparent:true,opacity:.7,depthWrite:false,fog:false}));meteor.visible=false;meteor.renderOrder=-21;sky.add(meteor);
  let meteorStart=null,nextMeteor=12;
  return { update(time,camera) {
    sky.position.copy(camera.position);
    if(reducedMotion)return;
    planet.rotation.y=time*.015;galaxy.material.opacity=.75+Math.sin(time*.13)*.08;disk.rotation.z=.3+time*.025;
    stars.material.opacity=.73+Math.sin(time*.4)*.07;
    if(meteorStart===null&&time>=nextMeteor)meteorStart=time;
    if(meteorStart!==null){const t=(time-meteorStart)/1.5;
      if(t>=1){meteor.visible=false;meteorStart=null;nextMeteor=time+28+Math.random()*35;}
      else{meteor.visible=true;meteor.position.set(-13+t*25,-8-t*9,-40);meteor.rotation.z=-.4;meteor.scale.set(1.8,1,1);meteor.material.opacity=Math.sin(t*Math.PI)*.8;}
    }
  } };
}
