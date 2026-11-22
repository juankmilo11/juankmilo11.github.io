import * as THREE from 'three';
import { actionDuration } from './tactics-animation.js';
import { deviceRenderQuality } from './render-quality.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildLandscape, earthMaterial } from './environment.js';
import { createMountainGeometry, createTileGeometry } from './mountain.js';
import { tileElevation, terrainPalette } from './terrain.js';
import { createCharacter, animateCharacter, releaseCharacter } from './character-model.js';
import { appearanceFor, appearanceKey } from './appearance.js';

const FILES='abcdefgh';
const location=s=>{const row=8-Number(s[1]),file=FILES.indexOf(s[0]);return new THREE.Vector3(file-3.5,tileElevation(row,file)+.015,row-3.5);};
export async function createTacticsBoard3D(host,onSquare,{onDrag,onDragStart,onInspect,onProject}={}){
  let quality=deviceRenderQuality(),dirty=true,lastFrame=0;
  const scene=new THREE.Scene();scene.background=createDuskSky();scene.fog=new THREE.Fog(0x29354f,24,50);
  const renderer=new THREE.WebGLRenderer({antialias:quality.antialias,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,quality.pixelRatio));renderer.shadowMap.enabled=quality.shadows;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  renderer.domElement.setAttribute('aria-label','Campo táctico 3D. Selecciona una casilla; arrastra el fondo para girar.');host.append(renderer.domElement);
  const camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(0,8.8,11.5);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.3,0);controls.enableDamping=true;controls.minDistance=9;controls.maxDistance=24;controls.maxPolarAngle=Math.PI/2.15;controls.update();controls.saveState();
  scene.add(new THREE.HemisphereLight(0xbdcbed,0x394a46,1.85));const sun=new THREE.DirectionalLight(0xcbd9ff,2.25);sun.position.set(-5,11,6);sun.castShadow=true;sun.shadow.intensity=.5;sun.shadow.mapSize.set(quality.shadowSize,quality.shadowSize);sun.shadow.camera.left=sun.shadow.camera.bottom=-11;sun.shadow.camera.right=sun.shadow.camera.top=11;sun.shadow.normalBias=.035;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xa2a8d4,.85);fill.position.set(7,5,-8);scene.add(fill);
  const world=new THREE.Group();scene.add(world);buildLandscape(world);
  const mountain=new THREE.Mesh(createMountainGeometry(),earthMaterial({vertexColors:true}));mountain.receiveShadow=true;world.add(mountain);
  const tiles=new Map(),highlights=new Map(),units=new Map(),terrain=new THREE.Group(),effects=new THREE.Group();world.add(terrain,effects);
  for(let row=0;row<8;row++)for(let file=0;file<8;file++){
    const square=FILES[file]+(8-row),tile=new THREE.Mesh(createTileGeometry(row,file),new THREE.MeshStandardMaterial({color:(row+file)%2?terrainPalette.dark:terrainPalette.light,roughness:1}));
    tile.position.copy(location(square));tile.position.y-=.015;tile.receiveShadow=true;tile.userData.square=square;world.add(tile);tiles.set(square,tile);
    const mark=new THREE.Mesh(new THREE.PlaneGeometry(.87,.87),new THREE.MeshBasicMaterial({color:0x7ce4c0,transparent:true,opacity:.72,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-4}));mark.rotation.x=-Math.PI/2;mark.position.copy(location(square));mark.position.y+=.006;mark.visible=false;mark.renderOrder=4;const border=new THREE.LineSegments(new THREE.EdgesGeometry(mark.geometry),new THREE.LineBasicMaterial({color:0xf9fff4,transparent:true,opacity:.95,depthTest:false}));border.position.z=.005;border.renderOrder=5;mark.add(border);world.add(mark);highlights.set(square,mark);
  }
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let active=true,frame=0,disposed=false,terrainKey='',snapshot=null,busy=false,selectedCell=null,visibleTargets=new Set(),lastSquare=null,motionToken=0,introFrame=0,introToken=0,introResolve=null,presenting=false,portraitProfile=null;
  let cameraProfile={radius:11.5,height:8.8,fov:36};const numberTextures=new Map();
  const outline=new THREE.Shape();outline.moveTo(-.48,-.48);outline.lineTo(.48,-.48);outline.lineTo(.48,.48);outline.lineTo(-.48,.48);outline.closePath();const hole=new THREE.Path();hole.moveTo(-.425,-.425);hole.lineTo(-.425,.425);hole.lineTo(.425,.425);hole.lineTo(.425,-.425);hole.closePath();outline.holes.push(hole);
  const selectionMarker=new THREE.Mesh(new THREE.ShapeGeometry(outline),new THREE.MeshBasicMaterial({color:0x69d5ff,transparent:true,opacity:.96,depthTest:false,depthWrite:false,side:THREE.DoubleSide}));selectionMarker.name='selected-square-indicator';selectionMarker.rotation.x=-Math.PI/2;selectionMarker.renderOrder=12;selectionMarker.visible=false;world.add(selectionMarker);
  function setSelection(square){selectedCell=tiles.has(square)?square:null;selectionMarker.visible=Boolean(selectedCell);if(selectedCell){selectionMarker.position.copy(location(selectedCell));selectionMarker.position.y+=.035;}for(const [cell,mark]of highlights){mark.visible=cell===selectedCell||visibleTargets.has(cell)||cell===lastSquare;mark.material.color.setHex(cell===selectedCell?0x69d5ff:0xf3d665);mark.material.opacity=cell===selectedCell?.13:visibleTargets.has(cell)?.72:.25;}dirty=true;}
  function pieceLook(unit){const look=appearanceFor(unit.type,unit.color);return snapshot?.opponent==='local'&&unit.color==='b'&&unit.type==='k'?{...look,character:'delita'}:look;}
  function addUnit(unit){const look=pieceLook(unit),group=new THREE.Group(),visual=createCharacter(look,unit.color==='w'?Math.PI:0,unit.type);group.add(visual);
    world.add(group);const entry={group,visual,key:appearanceKey(look),unit:{...unit}};units.set(unit.id,entry);visual.userData.ready.then(()=>{dirty=true;renderer.shadowMap.needsUpdate=true;}).catch(()=>{});return entry;}
  function removeUnit(id){const e=units.get(id);if(!e)return;world.remove(e.group);releaseCharacter(e.visual);units.delete(id);}
  function clearGroup(group){for(const child of [...group.children]){child.traverse(m=>{m.geometry?.dispose();if(m.material)for(const mat of Array.isArray(m.material)?m.material:[m.material])mat.dispose();});group.remove(child);}}
  function drawTerrain(state){const data=state.tiles||{},key=JSON.stringify(data);if(key===terrainKey)return;terrainKey=key;clearGroup(terrain);
    for(const [square,t]of Object.entries(data)){if(!FILES.includes(square[0])||!/[1-8]/.test(square[1]))continue;let mesh;
      if(t.kind==='obstacle'){mesh=new THREE.Mesh(new THREE.DodecahedronGeometry(.39,1),new THREE.MeshStandardMaterial({color:0x9b9778,roughness:1}));mesh.scale.y=1.4;mesh.position.copy(location(square));mesh.position.y+=.35;mesh.castShadow=true;}
      else if(t.kind==='void'){mesh=new THREE.Mesh(new THREE.CircleGeometry(.49,8),new THREE.MeshBasicMaterial({color:0x28241d,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.copy(location(square));mesh.position.y+=.008;}
      else if(t.kind==='trap'){mesh=new THREE.Mesh(new THREE.RingGeometry(.20,.34,4),new THREE.MeshBasicMaterial({color:0xdc9362,transparent:true,opacity:.8,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.copy(location(square));mesh.position.y+=.01;}
      if(mesh)terrain.add(mesh);
    }
  }
  function render(state,{selectedSquare=null,targets=[],moveTargets=[],attackTargets=[],lastEvent=null,interactive=false}={}){snapshot={...state,interactive};dirty=true;renderer.shadowMap.needsUpdate=true;drawTerrain(state);const retained=new Set();
    for(const unit of state.units||[]){const corpse=unit.type==='k'&&unit.hp<=0&&state.phase==='finished';if(!unit.square||(unit.hp<=0&&!corpse))continue;retained.add(unit.id);let e=units.get(unit.id);const key=appearanceKey(pieceLook(unit));if(e&&e.key!==key){removeUnit(unit.id);e=null;}e??=addUnit(unit);e.unit={...unit};if(!busy)e.group.position.copy(location(unit.square));e.visual.rotation.y=unit.color==='w'?Math.PI:0;if(corpse)animateCharacter(e.visual,0,{kingPose:'defeated',reducedMotion:true});}
    for(const id of units.keys())if(!retained.has(id)&&!busy)removeUnit(id);
    visibleTargets=new Set(targets);lastSquare=lastEvent?.to??null;setSelection(selectedSquare);
  }
  function ring(point,color,size=.38){const m=new THREE.Mesh(new THREE.RingGeometry(size*.75,size,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));m.position.copy(point);m.position.y+=.04;m.rotation.x=-Math.PI/2;effects.add(m);return m;}
  function number(point,value,healing){
    const text=`${healing?'+':'−'}${value}`,key=text+healing;
    if(!numberTextures.has(key)){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=100;const c=canvas.getContext('2d');c.textAlign='center';c.font='bold 70px monospace';c.lineWidth=10;c.strokeStyle='#152433';c.strokeText(text,128,77);c.fillStyle=healing?'#a4f2d5':'#fff0be';c.fillText(text,128,77);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;numberTextures.set(key,texture);}
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:numberTextures.get(key),transparent:true,depthTest:false,depthWrite:false}));sprite.position.copy(point);sprite.position.y+=1.1;sprite.scale.set(.72,.28,1);sprite.renderOrder=20;sprite.userData.baseY=sprite.position.y;effects.add(sprite);return sprite;
  }
  function cancelPlayback(){motionToken++;busy=false;clearGroup(effects);for(const e of units.values()){e.group.rotation.set(0,0,0);e.group.scale.setScalar(1);}dirty=true;}
  async function play(event,nextState){
    if(disposed||!event)return;cancelPlayback();const token=motionToken;busy=true;
    const restored=new Set();if(event.reversed)for(const target of event.targets??[]){const unit=nextState?.units.find(u=>u.id===target.id);if(unit?.hp>0&&(!units.has(unit.id)||units.get(unit.id).unit.hp<=0)){const entry=units.get(unit.id)??addUnit(unit);entry.group.position.copy(location(unit.square));animateCharacter(entry.visual,0,{kingPose:'standing',reducedMotion:true});restored.add(unit.id);}}
    const actor=units.get(event.unitId),from=event.from?location(event.from):actor?.group.position.clone(),to=event.to?location(event.to):from;
    const victims=(event.targets??[]).map(target=>({target,entry:units.get(target.id)})).filter(t=>t.entry);
    await Promise.all([actor,...victims.map(v=>v.entry)].filter(Boolean).map(e=>e.visual.userData.ready.catch(()=>{})));if(token!==motionToken||disposed)return;
    const moving=[];if(actor&&from&&to&&event.kind==='move')moving.push({entry:actor,from,to});
    if(event.castle){const rook=units.get(event.castle.rookId);if(rook)moving.push({entry:rook,from:location(event.castle.rookFrom),to:location(event.castle.rookTo)});}
    const aim=event.kind==='move'?to:victims[0]?.entry.group.position,direction=aim&&from?aim.clone().sub(from).setY(0).normalize():new THREE.Vector3(0,0,-1);
    const palette={attack:0xe9ae8c,ultimate:0xe9d692,focus:0x9dc6f2,block:0x83d4c7,move:0xa5c8a0},color=event.reversed?0x8de1c8:palette[event.kind]??0xa9cfb0;
    if(from)ring(from,color);if(from&&['focus','block','ultimate'].includes(event.kind)){const shield=new THREE.Mesh(new THREE.SphereGeometry(.52,12,8),new THREE.MeshBasicMaterial({color,wireframe:true,transparent:true,opacity:.3,depthWrite:false}));shield.position.copy(from);shield.position.y+=.48;effects.add(shield);}
    const numbers=[];for(const {target}of victims)if(target.square){ring(location(target.square),target.heal?0x9be3b8:0xf0a486,.45);if(target.damage||target.heal)numbers.push(number(location(target.square),target.heal||target.damage,Boolean(target.heal)));}
    if(from&&victims.length&&event.kind!=='move')for(const {entry}of victims){const end=entry.group.position.clone().add(new THREE.Vector3(0,.45,0)),start=from.clone().add(new THREE.Vector3(0,.5,0));effects.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([start,end]),new THREE.LineBasicMaterial({color,transparent:true,opacity:.7})));}
    const duration=actionDuration(event,reduced),start=performance.now();
    await new Promise(resolve=>{function step(now){if(disposed||token!==motionToken){resolve();return;}const p=Math.min(1,(now-start)/duration),pulse=Math.sin(Math.PI*p);dirty=true;renderer.shadowMap.needsUpdate=true;
      for(const motion of moving){motion.entry.group.position.lerpVectors(motion.from,motion.to,p*p*(3-2*p));if(!reduced)motion.entry.group.position.y+=pulse*.42;animateCharacter(motion.entry.visual,now/1000,{moving:true,reducedMotion:reduced});}
      if(actor&&from&&event.kind!=='move'){actor.group.position.copy(from);if(!reduced)actor.group.position.addScaledVector(direction,pulse*.13);animateCharacter(actor.visual,now/1000,{reducedMotion:reduced});if(!reduced){if(['attack','ultimate'].includes(event.kind)&&direction.lengthSq())actor.visual.rotation.y=Math.atan2(direction.x,direction.z);const rig=actor.visual.userData.rig;for(const name of ['leftArm','rightArm'])if(rig?.[name]){rig[name].mesh.rotation.x=-pulse*(event.kind==='block'?1.1:event.kind==='focus'?.5:1.35);rig[name].mesh.rotation.z=pulse*(name==='leftArm'?.28:-.28);}if(rig?.body)rig.body.mesh.rotation.x=pulse*.12;}}
      for(const {entry,target}of victims){if(restored.has(target.id)){entry.group.rotation.z=reduced?0:-(1-p)*Math.PI/2;entry.group.scale.setScalar(reduced?1:.65+.35*p);}else if(target.dead&&p>.4){animateCharacter(entry.visual,now/1000,{kingPose:'defeated',reducedMotion:true});}else if(!reduced&&target.damage)entry.group.rotation.z=Math.sin(p*Math.PI*4)*.07*(1-p);}
      effects.children.forEach(m=>{if(m.material?.transparent)m.material.opacity=m.isSprite?Math.min(1,(1-p)*4):(1-p)*.8;if(m.geometry?.type==='RingGeometry')m.scale.setScalar(1+p*.8);});numbers.forEach(m=>m.position.y=m.userData.baseY+p*.55);
      if(p<1)requestAnimationFrame(step);else resolve();}requestAnimationFrame(step);});
    if(token!==motionToken||disposed)return;busy=false;for(const e of units.values()){e.group.rotation.set(0,0,0);e.group.scale.setScalar(1);}clearGroup(effects);if(nextState)render(nextState);else if(snapshot)render(snapshot);
  }
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null,lastInspect=0,inspectTimer=0;
  function hit(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const all=[...tiles.values(),...Array.from(units.values(),v=>v.visual)];const intersections=ray.intersectObjects(all,true);for(const h of intersections){let o=h.object;while(o&&!o.userData.square&&!Array.from(units.values()).some(u=>u.group===o))o=o.parent;const unit=Array.from(units.values()).find(u=>u.group===o);if(unit)return unit.unit.square;if(o?.userData.square)return o.userData.square;}return null;}
  function ground(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects([...tiles.values()],false)[0]?.object.userData.square??null;}
  function inspectHover(e){
    const point={clientX:e.clientX,clientY:e.clientY},elapsed=performance.now()-lastInspect;clearTimeout(inspectTimer);
    const inspect=()=>{lastInspect=performance.now();if(!disposed&&!down?.dragging)onInspect?.(hit(point));};
    if(elapsed>=80)inspect();else inspectTimer=setTimeout(inspect,80-elapsed);
  }
  renderer.domElement.addEventListener('pointerleave',()=>clearTimeout(inspectTimer));
  renderer.domElement.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;const square=hit(e);clearTimeout(inspectTimer);onInspect?.(square);const entry=[...units.values()].find(u=>u.unit.square===square&&u.unit.color==='w');
    down={x:e.clientX,y:e.clientY,square,entry:snapshot?.phase==='planning'&&snapshot.interactive&&onDrag?entry:null,dragging:false,origin:entry?.group.position.clone()};
    if(down.entry){controls.enabled=false;renderer.domElement.style.cursor='grabbing';renderer.domElement.setPointerCapture(e.pointerId);}
  },true);
  renderer.domElement.addEventListener('pointermove',e=>{if(!down?.entry){inspectHover(e);return;}if(!down.dragging&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>6){down.dragging=true;clearTimeout(inspectTimer);onDragStart?.(down.square);}if(!down.dragging)return;const square=ground(e);if(square){down.entry.group.position.copy(location(square));down.entry.group.position.y+=.14;dirty=true;renderer.shadowMap.needsUpdate=true;}});
  renderer.domElement.addEventListener('pointerup',e=>{if(!down)return;const gesture=down;down=null;if(gesture.entry){gesture.entry.group.position.copy(gesture.origin);controls.enabled=true;renderer.domElement.style.cursor='grab';dirty=true;renderer.shadowMap.needsUpdate=true;if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId);if(gesture.dragging)onDrag(gesture.square,ground(e));else onSquare(hit(e));}else if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)<6)onSquare(hit(e));},true);
  renderer.domElement.addEventListener('pointercancel',()=>{if(down?.entry)down.entry.group.position.copy(down.origin);down=null;controls.enabled=true;dirty=true;renderer.shadowMap.needsUpdate=true;renderer.domElement.style.cursor='grab';});renderer.domElement.style.cursor='grab';
  function projectSquare(square){const p=location(square).add(new THREE.Vector3(0,.5,0)).project(camera),r=renderer.domElement.getBoundingClientRect();return{x:(p.x+1)*r.width/2,y:(1-p.y)*r.height/2};}
  function cancelIntro(){introToken++;cancelAnimationFrame(introFrame);introFrame=0;presenting=false;controls.enabled=true;if(introResolve){introResolve();introResolve=null;}dirty=true;}
  function playIntro(){cancelIntro();if(reduced)return Promise.resolve();const token=++introToken;presenting=true;controls.enabled=false;const target=controls.target.clone(),start=performance.now(),duration=4600;
    return new Promise(resolve=>{introResolve=resolve;function step(now){if(disposed||token!==introToken){resolve();return;}const t=Math.min(1,(now-start)/duration),e=t*t*(3-2*t),angle=(1-e)*Math.PI*2,radius=cameraProfile.radius+1.1*(1-e);camera.position.set(target.x+Math.sin(angle)*radius,cameraProfile.height+2.4*(1-e),target.z+Math.cos(angle)*radius);camera.lookAt(target);camera.updateMatrixWorld(true);dirty=true;if(t<1)introFrame=requestAnimationFrame(step);else{presenting=false;controls.enabled=true;controls.update();controls.saveState();introFrame=0;introResolve=null;resolve();}}introFrame=requestAnimationFrame(step);});
  }
  function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;const portrait=h>w*1.1;
    if(portraitProfile!==portrait){cancelIntro();portraitProfile=portrait;cameraProfile=portrait?{radius:16.5,height:12.5,fov:58}:{radius:11.5,height:8.8,fov:36};camera.position.set(0,cameraProfile.height,cameraProfile.radius);controls.target.set(0,portrait?-.35:.35,0);controls.minDistance=portrait?14:9;controls.maxDistance=portrait?30:24;controls.update();controls.saveState();}
    camera.fov=cameraProfile.fov;camera.updateProjectionMatrix();dirty=true;
  }
  controls.addEventListener('change',()=>{dirty=true;onProject?.();});
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  function loop(now){
    if(disposed||!active||document.hidden)return;frame=requestAnimationFrame(loop);
    if(!host.clientWidth||!host.clientHeight||now-lastFrame<1000/quality.fps)return;lastFrame=now;
    if(!presenting)controls.update();if(!quality.idle&&!busy&&!dirty&&!presenting)return;
    if(!busy)for(const e of units.values())animateCharacter(e.visual,now/1000,{reducedMotion:reduced||!quality.idle,phase:e.group.id,selected:false,kingPose:e.unit.hp<=0?'defeated':'standing'});
    renderer.render(scene,camera);dirty=false;
  }
  function schedule(){cancelAnimationFrame(frame);if(active&&!document.hidden&&!disposed)frame=requestAnimationFrame(loop);}
  document.addEventListener('visibilitychange',schedule);schedule();
  function setQuality(lite){quality=deviceRenderQuality(lite);renderer.setPixelRatio(Math.min(devicePixelRatio,quality.pixelRatio));renderer.shadowMap.enabled=quality.shadows;renderer.shadowMap.needsUpdate=true;controls.enableDamping=quality.idle;dirty=true;resize();}
  setQuality(false);
  return {render,play,resize,projectSquare,setQuality,setSelection,playIntro,cancelIntro,cancelPlayback,resetCamera(){cancelIntro();controls.reset();},setActive(value){active=value;if(value)resize();schedule();},dispose(){disposed=true;cancelIntro();cancelPlayback();scene.background?.dispose?.();numberTextures.forEach(t=>t.dispose());clearTimeout(inspectTimer);cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',schedule);observer.disconnect();controls.dispose();for(const id of units.keys())removeUnit(id);clearGroup(effects);clearGroup(terrain);scene.traverse(m=>{m.geometry?.dispose();if(m.material)for(const mat of Array.isArray(m.material)?m.material:[m.material])mat.dispose();});renderer.dispose();renderer.domElement.remove();}};
}

function createDuskSky(){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const c=canvas.getContext('2d'),gradient=c.createLinearGradient(0,0,0,512);
  for(const [stop,color]of [[0,'#10182e'],[.35,'#273653'],[.56,'#65516f'],[.69,'#a47b83'],[.78,'#4e566d'],[1,'#283d46']])gradient.addColorStop(stop,color);c.fillStyle=gradient;c.fillRect(0,0,1024,512);
  const glow=c.createRadialGradient(740,180,3,740,180,64);glow.addColorStop(0,'#dce8ff70');glow.addColorStop(1,'#bdc9fa00');c.fillStyle=glow;c.fillRect(670,110,140,140);c.fillStyle='#dfebfb';c.beginPath();c.arc(740,180,12,0,Math.PI*2);c.fill();
  let seed=91;for(let i=0;i<42;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%1024;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed%150;c.fillStyle=i%3?'#e3eafa65':'#e3eafaaf';c.fillRect(x,y,1,1);}
  const texture=new THREE.CanvasTexture(canvas);texture.mapping=THREE.EquirectangularReflectionMapping;texture.colorSpace=THREE.SRGBColorSpace;texture.name='tactical-dusk-sky';return texture;
}
