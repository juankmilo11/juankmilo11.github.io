import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildLandscape, earthMaterial } from './environment.js';
import { createMountainGeometry, createTileGeometry } from './mountain.js';
import { tileElevation, terrainPalette } from './terrain.js';
import { createCharacter, animateCharacter, releaseCharacter } from './character-model.js';
import { appearanceFor, appearanceKey } from './appearance.js';

const FILES='abcdefgh', angles={N:Math.PI,E:Math.PI/2,S:0,W:-Math.PI/2};
const location=s=>{const row=8-Number(s[1]),file=FILES.indexOf(s[0]);return new THREE.Vector3(file-3.5,tileElevation(row,file)+.015,row-3.5);};
export async function createTacticsBoard3D(host,onSquare){
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x786653);scene.fog=new THREE.Fog(0x786653,19,40);
  const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  renderer.domElement.setAttribute('aria-label','Campo táctico 3D. Selecciona una casilla; arrastra el fondo para girar.');host.append(renderer.domElement);
  const camera=new THREE.PerspectiveCamera(39,1,.1,100);camera.position.set(0,9.5,12.5);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.3,0);controls.enableDamping=true;controls.minDistance=9;controls.maxDistance=24;controls.maxPolarAngle=Math.PI/2.15;controls.update();controls.saveState();
  scene.add(new THREE.HemisphereLight(0xf0edd6,0x5e6651,2.2));const sun=new THREE.DirectionalLight(0xffebce,3);sun.position.set(-5,11,6);sun.castShadow=true;sun.shadow.intensity=.5;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=sun.shadow.camera.bottom=-11;sun.shadow.camera.right=sun.shadow.camera.top=11;sun.shadow.normalBias=.035;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xb1c4c0,1.2);fill.position.set(7,5,-8);scene.add(fill);
  const world=new THREE.Group();scene.add(world);buildLandscape(world);
  const mountain=new THREE.Mesh(createMountainGeometry(),earthMaterial({vertexColors:true}));mountain.receiveShadow=true;world.add(mountain);
  const tiles=new Map(),highlights=new Map(),units=new Map(),terrain=new THREE.Group(),effects=new THREE.Group();world.add(terrain,effects);
  for(let row=0;row<8;row++)for(let file=0;file<8;file++){
    const square=FILES[file]+(8-row),tile=new THREE.Mesh(createTileGeometry(row,file),new THREE.MeshStandardMaterial({color:(row+file)%2?terrainPalette.dark:terrainPalette.light,roughness:1}));
    tile.position.copy(location(square));tile.position.y-=.015;tile.receiveShadow=true;tile.userData.square=square;world.add(tile);tiles.set(square,tile);
    const mark=new THREE.Mesh(new THREE.PlaneGeometry(.87,.87),new THREE.MeshBasicMaterial({color:0x7ce4c0,transparent:true,opacity:.25,depthWrite:false,side:THREE.DoubleSide}));mark.rotation.x=-Math.PI/2;mark.position.copy(location(square));mark.position.y+=.006;mark.visible=false;world.add(mark);highlights.set(square,mark);
  }
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let active=true,frame=0,disposed=false,terrainKey='',snapshot=null,busy=false;
  function pieceLook(unit){const look=appearanceFor(unit.type,unit.color);return snapshot?.opponent==='local'&&unit.color==='b'&&unit.type==='k'?{...look,character:'delita'}:look;}
  function badge(){const canvas=document.createElement('canvas');canvas.width=128;canvas.height=40;const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));sprite.scale.set(.82,.26,1);sprite.position.y=1.35;sprite.userData.canvas=canvas;return sprite;}
  function updateBadge(entry,unit){const canvas=entry.badge.userData.canvas,ctx=canvas.getContext('2d');ctx.clearRect(0,0,128,40);ctx.fillStyle='#14251de8';ctx.fillRect(0,0,128,40);ctx.fillStyle=unit.color==='w'?'#a6d8e9':'#edc47f';ctx.fillStyle='#314037';ctx.fillRect(5,5,118,8);ctx.fillStyle=unit.hp<=2?'#f28d77':'#b6d9a0';ctx.fillRect(5,5,118*Math.max(0,unit.hp)/6,8);ctx.fillStyle='#efe5ca';ctx.font='bold 17px sans-serif';ctx.textAlign='center';ctx.fillText(`${unit.hp}/6${unit.charged?'  ◆':''}${unit.guard?'  ◇':''}${unit.armor?'  ▣':''}`,64,32);entry.badge.material.map.needsUpdate=true;}
  function addUnit(unit){const look=pieceLook(unit),group=new THREE.Group(),visual=createCharacter(look,angles[unit.facing]??0,unit.type);group.add(visual);
    const arrow=new THREE.Mesh(new THREE.ConeGeometry(.08,.22,3),new THREE.MeshBasicMaterial({color:unit.color==='w'?0xa8e3ef:0xf1c16c,transparent:true,opacity:.85}));arrow.rotation.x=-Math.PI/2;
    const bearing=new THREE.Group();bearing.add(arrow);arrow.position.z=-.39;group.add(bearing);const hp=badge();group.add(hp);world.add(group);
    const entry={group,visual,bearing,badge:hp,key:appearanceKey(look),unit:{...unit}};units.set(unit.id,entry);visual.userData.ready.catch(()=>{});return entry;}
  function removeUnit(id){const e=units.get(id);if(!e)return;world.remove(e.group);releaseCharacter(e.visual);e.badge.material.map.dispose();e.badge.material.dispose();e.bearing.children.forEach(m=>{m.geometry.dispose();m.material.dispose();});units.delete(id);}
  function clearGroup(group){for(const child of [...group.children]){child.traverse(m=>{m.geometry?.dispose();if(m.material)for(const mat of Array.isArray(m.material)?m.material:[m.material])mat.dispose();});group.remove(child);}}
  function drawTerrain(state){const data=state.tiles||{},key=JSON.stringify(data);if(key===terrainKey)return;terrainKey=key;clearGroup(terrain);
    for(const [square,t]of Object.entries(data)){if(!FILES.includes(square[0])||!/[1-8]/.test(square[1]))continue;let mesh;
      if(t.kind==='obstacle'){mesh=new THREE.Mesh(new THREE.DodecahedronGeometry(.39,1),new THREE.MeshStandardMaterial({color:0x9b9778,roughness:1}));mesh.scale.y=1.4;mesh.position.copy(location(square));mesh.position.y+=.35;mesh.castShadow=true;}
      else if(t.kind==='void'){mesh=new THREE.Mesh(new THREE.CircleGeometry(.49,8),new THREE.MeshBasicMaterial({color:0x28241d,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.copy(location(square));mesh.position.y+=.008;}
      else if(t.kind==='trap'){mesh=new THREE.Mesh(new THREE.RingGeometry(.20,.34,4),new THREE.MeshBasicMaterial({color:0xdc9362,transparent:true,opacity:.8,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.copy(location(square));mesh.position.y+=.01;}
      if(mesh)terrain.add(mesh);
    }
  }
  function render(state,{selectedSquare=null,targets=[],lastEvent=null}={}){snapshot=state;drawTerrain(state);const retained=new Set();
    for(const unit of state.units||[]){const corpse=unit.type==='k'&&unit.hp<=0&&state.phase==='finished';if(!unit.square||(unit.hp<=0&&!corpse))continue;retained.add(unit.id);let e=units.get(unit.id);const key=appearanceKey(pieceLook(unit));if(e&&e.key!==key){removeUnit(unit.id);e=null;}e??=addUnit(unit);e.unit={...unit};if(!busy)e.group.position.copy(location(unit.square));e.visual.rotation.y=angles[unit.facing]??0;e.bearing.rotation.y=(angles[unit.facing]??0)-Math.PI;updateBadge(e,unit);e.badge.visible=!corpse;e.bearing.visible=!corpse;if(corpse)animateCharacter(e.visual,0,{kingPose:'defeated',reducedMotion:true});}
    for(const id of units.keys())if(!retained.has(id)&&!busy)removeUnit(id);
    const targetSet=new Set(targets);for(const [square,mark]of highlights){mark.visible=square===selectedSquare||targetSet.has(square)||square===lastEvent?.to;mark.material.color.setHex(square===selectedSquare?0x75d9ef:targetSet.has(square)?0x82d3a6:0xe3bf66);mark.material.opacity=square===selectedSquare?.4:.24;}
  }
  function ring(point,color,size=.38){const m=new THREE.Mesh(new THREE.RingGeometry(size*.75,size,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));m.position.copy(point);m.position.y+=.04;m.rotation.x=-Math.PI/2;effects.add(m);return m;}
  async function play(event,nextState){if(disposed||!event)return;busy=true;const actor=units.get(event.unitId),from=event.from?location(event.from):actor?.group.position.clone(),to=event.to?location(event.to):from;
    const victimEntries=(event.targets||[]).map(t=>({target:t,entry:units.get(t.id)})).filter(t=>t.entry);const aim=event.kind==='move'?to:victimEntries[0]?.entry.group.position;const direction=aim&&from?aim.clone().sub(from).setY(0).normalize():new THREE.Vector3(0,0,-1);
    const palette={attack:0xf0b878,ultimate:0xe9c765,focus:0x9dc6f2,block:0x83d4c7,move:0xa5c8a0};const color=palette[event.kind]??0xa9cfb0;
    if(from)ring(from,color);if(from&&['focus','block','ultimate'].includes(event.kind)){const shield=new THREE.Mesh(new THREE.SphereGeometry(.52,12,8),new THREE.MeshBasicMaterial({color,wireframe:true,transparent:true,opacity:.3,depthWrite:false}));shield.position.copy(from);shield.position.y+=.48;effects.add(shield);}for(const {target}of victimEntries)if(target.square)ring(location(target.square),target.damage?0xf09677:0x9be3b8,.45);
    if(from&&victimEntries.length&&event.kind!=='move')for(const {entry}of victimEntries){const end=entry.group.position.clone().add(new THREE.Vector3(0,.45,0)),start=from.clone().add(new THREE.Vector3(0,.5,0));effects.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([start,end]),new THREE.LineBasicMaterial({color,transparent:true,opacity:.7})));}
    const duration=reduced?100:event.kind==='move'?520:680,start=performance.now();
    await new Promise(resolve=>{function step(now){if(disposed){resolve();return;}const p=Math.min(1,(now-start)/duration),pulse=Math.sin(Math.PI*p);
      if(actor&&from){if(event.kind==='move'&&to){actor.group.position.lerpVectors(from,to,p*p*(3-2*p));if(!reduced)actor.group.position.y+=pulse*.62;}else if(!reduced){actor.group.position.copy(from).addScaledVector(direction,pulse*.13);actor.group.rotation.x=event.kind==='block'?-.08*pulse:.05*pulse;}}
      if(actor){animateCharacter(actor.visual,now/1000,{moving:event.kind==='move',reducedMotion:reduced});if(!reduced&&event.kind!=='move'){
        if(['attack','ultimate'].includes(event.kind)&&direction.lengthSq())actor.visual.rotation.y=Math.atan2(direction.x,direction.z);
        const rig=actor.visual.userData.rig;
        for(const name of ['leftArm','rightArm'])if(rig?.[name]){rig[name].mesh.rotation.x=-pulse*(event.kind==='block'?1.1:event.kind==='focus'?.5:1.35);rig[name].mesh.rotation.z=pulse*(name==='leftArm'?.28:-.28);}
        if(rig?.body)rig.body.mesh.rotation.x=pulse*.12;
      }}
      for(const {entry,target}of victimEntries){if(target.dead){animateCharacter(entry.visual,now/1000,{kingPose:'defeated',reducedMotion:true});entry.group.position.y=(entry.unit.square?location(entry.unit.square).y:0);entry.badge.visible=false;}else if(!reduced&&target.damage)entry.group.rotation.z=Math.sin(p*Math.PI*4)*.07*(1-p);}
      effects.children.forEach(m=>{if(m.material?.transparent)m.material.opacity=(1-p)*.8;if(m.geometry?.type==='RingGeometry')m.scale.setScalar(1+p*.8);});
      if(p<1)requestAnimationFrame(step);else resolve();}requestAnimationFrame(step);});
    busy=false;for(const e of units.values()){e.group.rotation.set(0,0,0);e.badge.visible=true;}clearGroup(effects);if(nextState)render(nextState);else if(snapshot)render(snapshot);
  }
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
  function hit(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const all=[...tiles.values(),...Array.from(units.values(),v=>v.group)];const intersections=ray.intersectObjects(all,true);for(const h of intersections){let o=h.object;while(o&&!o.userData.square&&!Array.from(units.values()).some(u=>u.group===o))o=o.parent;const unit=Array.from(units.values()).find(u=>u.group===o);if(unit)return unit.unit.square;if(o?.userData.square)return o.userData.square;}return null;}
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});renderer.domElement.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6)onSquare(hit(e));down=null;});renderer.domElement.addEventListener('pointercancel',()=>{down=null;});renderer.domElement.style.cursor='grab';
  function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=h>w?49:39;camera.updateProjectionMatrix();}
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  function loop(now){if(disposed)return;frame=requestAnimationFrame(loop);if(!active||document.hidden||!host.clientWidth||!host.clientHeight)return;if(!busy)for(const e of units.values())animateCharacter(e.visual,now/1000,{reducedMotion:reduced,phase:e.group.id,selected:false,kingPose:e.unit.hp<=0?'defeated':'standing'});controls.update();renderer.render(scene,camera);}frame=requestAnimationFrame(loop);
  return {render,play,resize,resetCamera(){controls.reset();},setActive(value){active=value;if(value)resize();},dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();for(const id of units.keys())removeUnit(id);clearGroup(effects);clearGroup(terrain);scene.traverse(m=>{m.geometry?.dispose();if(m.material)for(const mat of Array.isArray(m.material)?m.material:[m.material])mat.dispose();});renderer.dispose();renderer.domElement.remove();}};
}
