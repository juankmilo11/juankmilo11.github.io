import * as THREE from 'three';
import { actionDuration } from './tactics-animation.js';
import { deviceRenderQuality } from './render-quality.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildLandscape, earthMaterial } from './environment.js';
import { createMountainGeometry, createTileGeometry } from './mountain.js';
import { tileElevation, terrainPalette } from './terrain.js';
import { createCharacter, animateCharacter, releaseCharacter } from './character-model.js';
import { appearanceFor, appearanceKey, thumbnailUrl } from './appearance.js';

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
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let active=true,frame=0,disposed=false,terrainKey='',snapshot=null,busy=false,selectedCell=null,visibleTargets=new Set(),castleCells=new Set(),lastSquare=null,motionToken=0,introFrame=0,introToken=0,introResolve=null,presenting=false,portraitProfile=null;
  let cameraProfile={radius:11.5,height:8.8,fov:36};
  const shadowTextures=new Map();
  const shadowMaterial=new THREE.MeshBasicMaterial({color:0x83784f,transparent:true,opacity:.24,alphaTest:.04,depthWrite:false,side:THREE.DoubleSide,toneMapped:false});
  const dropShadow=new THREE.Mesh(new THREE.PlaneGeometry(.74,.88),shadowMaterial);dropShadow.name='drag-contact-shadow';dropShadow.rotation.x=-Math.PI/2;dropShadow.renderOrder=4;dropShadow.visible=false;world.add(dropShadow);
  const dropMarker=new THREE.Mesh(new THREE.PlaneGeometry(.87,.87),new THREE.MeshBasicMaterial({color:0xf3d665,transparent:true,opacity:.25,side:THREE.DoubleSide,depthWrite:false}));dropMarker.name='drag-destination';dropMarker.rotation.x=-Math.PI/2;dropMarker.renderOrder=3;dropMarker.visible=false;world.add(dropMarker);
  const textureLoader=new THREE.TextureLoader();
  function dragShadow(entry,square){
    dropShadow.visible=Boolean(square);dropMarker.visible=Boolean(square);if(!square)return;
    const key=appearanceKey(pieceLook(entry.unit));if(!shadowTextures.has(key)){const texture=textureLoader.load(thumbnailUrl(pieceLook(entry.unit)),()=>dirty=true);texture.colorSpace=THREE.SRGBColorSpace;shadowTextures.set(key,texture);}shadowMaterial.map=shadowTextures.get(key);shadowMaterial.needsUpdate=true;
    dropShadow.position.copy(location(square));dropShadow.position.y+=.022;dropMarker.position.copy(location(square));dropMarker.position.y+=.017;dropMarker.material.color.setHex(visibleTargets.has(square)?0xf3d665:0xcb9d7c);
  }
  const outline=new THREE.Shape();outline.moveTo(-.48,-.48);outline.lineTo(.48,-.48);outline.lineTo(.48,.48);outline.lineTo(-.48,.48);outline.closePath();const hole=new THREE.Path();hole.moveTo(-.425,-.425);hole.lineTo(-.425,.425);hole.lineTo(.425,.425);hole.lineTo(.425,-.425);hole.closePath();outline.holes.push(hole);
  const selectionMarker=new THREE.Mesh(new THREE.ShapeGeometry(outline),new THREE.MeshBasicMaterial({color:0x69d5ff,transparent:true,opacity:.96,depthTest:false,depthWrite:false,side:THREE.DoubleSide}));selectionMarker.name='selected-square-indicator';selectionMarker.rotation.x=-Math.PI/2;selectionMarker.renderOrder=12;selectionMarker.visible=false;world.add(selectionMarker);
  function setSelection(square){selectedCell=tiles.has(square)?square:null;selectionMarker.visible=Boolean(selectedCell);if(selectedCell){selectionMarker.position.copy(location(selectedCell));selectionMarker.position.y+=.035;}for(const [cell,mark]of highlights){mark.visible=cell===selectedCell||visibleTargets.has(cell)||castleCells.has(cell)||cell===lastSquare;mark.material.color.setHex(cell===selectedCell?0x69d5ff:castleCells.has(cell)?0xb889ff:0xf3d665);mark.material.opacity=cell===selectedCell?.13:visibleTargets.has(cell)?.72:.25;}dirty=true;}
  function pieceLook(unit){const look=appearanceFor(unit.type,unit.color);return snapshot?.opponent==='local'&&unit.color==='b'&&unit.type==='k'?{...look,character:'delita'}:look;}
  function addUnit(unit){const look=pieceLook(unit),group=new THREE.Group(),visual=createCharacter(look,unit.color==='w'?Math.PI:0,unit.type);group.add(visual);
    world.add(group);const entry={group,visual,key:unit.type+':'+appearanceKey(look),unit:{...unit},drop:null};units.set(unit.id,entry);visual.userData.ready.then(()=>{dirty=true;renderer.shadowMap.needsUpdate=true;}).catch(()=>{});return entry;}
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
  function render(state,{selectedSquare=null,targets=[],moveTargets=[],attackTargets=[],lastEvent=null,castleTargets=[],interactive=false}={}){snapshot={...state,interactive};dirty=true;renderer.shadowMap.needsUpdate=true;drawTerrain(state);const retained=new Set();
    for(const unit of state.units||[]){const corpse=unit.type==='k'&&(unit.captured||state.matedSide===unit.color)&&state.phase==='finished';if(!unit.square||(unit.captured&&!corpse))continue;retained.add(unit.id);let e=units.get(unit.id);const key=unit.type+':'+appearanceKey(pieceLook(unit));if(e&&e.key!==key){removeUnit(unit.id);e=null;}e??=addUnit(unit);e.unit={...unit,mated:unit.type==='k'&&state.matedSide===unit.color&&state.phase==='finished'};if(!busy&&!e.drop){e.group.position.copy(location(unit.square));e.group.scale.setScalar(1);e.group.rotation.set(0,0,0);}e.visual.rotation.y=unit.color==='w'?Math.PI:0;if(corpse){e.group.position.x+=.32;e.group.position.z+=.22;e.group.scale.setScalar(.72);animateCharacter(e.visual,0,{kingPose:'defeated',reducedMotion:true});}}
    for(const id of units.keys())if(!retained.has(id)&&!busy)removeUnit(id);
    visibleTargets=new Set(targets);castleCells=new Set(castleTargets);lastSquare=lastEvent?.to??null;setSelection(selectedSquare);
  }
  function ring(point,color,size=.38){const m=new THREE.Mesh(new THREE.RingGeometry(size*.75,size,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));m.position.copy(point);m.position.y+=.04;m.rotation.x=-Math.PI/2;effects.add(m);return m;}
  function burst(point,color,count=10){
    const geometry=new THREE.BufferGeometry(),positions=new Float32Array(count*3),directions=[];
    for(let i=0;i<count;i++){const angle=i/count*Math.PI*2;directions.push(new THREE.Vector3(Math.cos(angle),.3+(i%3)*.25,Math.sin(angle)).normalize());}
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const points=new THREE.Points(geometry,new THREE.PointsMaterial({color,size:.055,transparent:true,opacity:.9,depthWrite:false}));points.position.copy(point);points.position.y+=.55;effects.add(points);points.userData.directions=directions;return points;
  }
  function resetEntry(e){e.group.rotation.set(0,0,0);e.group.scale.setScalar(1);e.visual.traverse(m=>{if(m.isMesh&&m.material?.userData?.captureClone){m.material.dispose();m.material=m.userData.originalMaterial;delete m.userData.originalMaterial;}});}
  function setFade(entry,opacity){entry.visual.traverse(mesh=>{if(!mesh.isMesh||!mesh.material)return;if(!mesh.material.userData.captureClone){mesh.userData.originalMaterial=mesh.material;mesh.material=mesh.material.clone();mesh.material.userData={...mesh.material.userData,captureClone:true};mesh.material.transparent=true;mesh.material.depthWrite=false;}mesh.material.opacity=opacity;});}
  function cancelPlayback(){motionToken++;busy=false;clearGroup(effects);for(const e of units.values()){e.drop=null;resetEntry(e);}dirty=true;}
  async function play(event,nextState){
    if(disposed||!event)return;cancelPlayback();const token=motionToken;busy=true;
    const restored=new Set();if(event.reversed)for(const target of event.targets??[]){const unit=nextState?.units.find(u=>u.id===target.id);if(target.restored&&unit&&!unit.captured){const entry=units.get(unit.id)??addUnit(unit);entry.group.position.copy(location(unit.square));animateCharacter(entry.visual,0,{kingPose:'standing',reducedMotion:true});restored.add(unit.id);}}
    const actor=units.get(event.unitId),from=event.from?location(event.from):actor?.group.position.clone(),to=event.to?location(event.to):from;
    const visualTargets=[...(event.targets??[])];if(event.checkmate){const king=nextState?.units.find(u=>u.type==='k'&&u.color===event.checkmate.side);if(king&&!visualTargets.some(t=>t.id===king.id)){visualTargets.push({id:king.id,square:king.square,mated:true,restored:Boolean(event.reversed)});if(event.reversed){const entry=units.get(king.id);if(entry){animateCharacter(entry.visual,0,{kingPose:'standing',reducedMotion:true});restored.add(king.id);}}}}
    const victims=visualTargets.map(target=>({target,entry:units.get(target.id)})).filter(t=>t.entry);
    await Promise.all([actor,...victims.map(v=>v.entry)].filter(Boolean).map(e=>e.visual.userData.ready.catch(()=>{})));if(token!==motionToken||disposed)return;
    const moving=[];if(actor&&from&&to&&event.kind==='move')moving.push({entry:actor,from,to});
    if(event.castle){const rook=units.get(event.castle.rookId);if(rook)moving.push({entry:rook,from:location(event.castle.rookFrom),to:location(event.castle.rookTo)});}
    const color=event.reversed?0xa8e0c4:0xf0d395,particles=[];
    for(const {target}of victims){ring(location(target.square),0xedd4a0,.43);if(!reduced)particles.push(burst(location(target.square),0xe6c897,9));}
    if(event.promotion&&to){ring(to,0xf9e0a1,.48);if(!reduced)particles.push(burst(to,0xf6e6ad,16));}
    const duration=actionDuration(event,reduced),start=performance.now();
    await new Promise(resolve=>{function step(now){if(disposed||token!==motionToken){resolve();return;}const p=Math.min(1,(now-start)/duration),eased=p*p*(3-2*p),pulse=Math.sin(Math.PI*p);dirty=true;renderer.shadowMap.needsUpdate=true;
      for(const motion of moving){
        motion.entry.group.position.lerpVectors(motion.from,motion.to,eased);
        if(!reduced)motion.entry.group.position.y+=pulse*.18;
        animateCharacter(motion.entry.visual,now/1000,{moving:true,reducedMotion:reduced});
      }
      for(const {entry,target}of victims){
        if(restored.has(target.id)){entry.group.rotation.z=reduced?0:-(1-p)*Math.PI/2;entry.group.scale.setScalar(reduced?1:.7+.3*p);setFade(entry,.3+.7*p);}
        else if((target.captured||target.mated)&&p>.58){const fall=(p-.58)/.42;entry.group.rotation.z=reduced?0:-fall*Math.PI*.45;entry.group.position.y=location(target.square).y-fall*.12;setFade(entry,1-fall*(target.mated?.4:1));}

      }
      for(const effect of effects.children){if(effect.material?.transparent)effect.material.opacity=(1-p)*.8;if(effect.geometry?.type==='RingGeometry')effect.scale.setScalar(1+p*.75);}
      for(const effect of particles){const positions=effect.geometry.attributes.position,q=event.reversed?1-p:p;effect.userData.directions.forEach((v,i)=>positions.setXYZ(i,v.x*q*.65,v.y*q*.55-.22*q*q,v.z*q*.65));positions.needsUpdate=true;}
      if(p<1)requestAnimationFrame(step);else resolve();}requestAnimationFrame(step);});
    if(token!==motionToken||disposed)return;busy=false;for(const e of units.values())resetEntry(e);
    clearGroup(effects);if(nextState)render(nextState);else if(snapshot)render(snapshot);
  }
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null,lastInspect=0,inspectTimer=0;
  function hit(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const all=[...tiles.values(),...Array.from(units.values()).filter(v=>!v.unit.captured).map(v=>v.visual)];const intersections=ray.intersectObjects(all,true);for(const h of intersections){let o=h.object;while(o&&!o.userData.square&&!Array.from(units.values()).some(u=>u.group===o))o=o.parent;const unit=Array.from(units.values()).find(u=>u.group===o);if(unit)return unit.unit.square;if(o?.userData.square)return o.userData.square;}return null;}
  function ground(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects([...tiles.values()],false)[0]?.object.userData.square??null;}
  function inspectHover(e){
    const point={clientX:e.clientX,clientY:e.clientY},elapsed=performance.now()-lastInspect;clearTimeout(inspectTimer);
    const inspect=()=>{lastInspect=performance.now();if(!disposed&&!down?.dragging)onInspect?.(hit(point));};
    if(elapsed>=80)inspect();else inspectTimer=setTimeout(inspect,80-elapsed);
  }
  function updateCursor(e){
    if(down?.entry){renderer.domElement.style.cursor='grabbing';return;}
    const square=hit(e),entry=[...units.values()].find(u=>u.unit.square===square&&!u.unit.captured);
    renderer.domElement.style.cursor=entry?snapshot?.interactive&&entry.unit.color==='w'&&!busy?'grab':'pointer':'default';
  }
  function settle(entry,from,to){if(!entry)return;entry.group.position.copy(from);entry.drop={from:from.clone(),to:to.clone(),started:performance.now(),duration:reduced?1:170};dirty=true;}
  renderer.domElement.addEventListener('pointerleave',()=>{clearTimeout(inspectTimer);if(!down)renderer.domElement.style.cursor='default';});
  renderer.domElement.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;const square=hit(e);clearTimeout(inspectTimer);onInspect?.(square);const entry=[...units.values()].find(u=>u.unit.square===square&&u.unit.color==='w'&&!u.unit.captured);
    down={x:e.clientX,y:e.clientY,square,entry:snapshot?.phase==='planning'&&snapshot.interactive&&!busy&&onDrag?entry:null,dragging:false,origin:entry?.group.position.clone(),plane:new THREE.Plane(new THREE.Vector3(0,1,0),-(entry?.group.position.y??0)-.14)};
    if(down.entry){down.entry.drop=null;controls.enabled=false;renderer.domElement.style.cursor='grabbing';renderer.domElement.setPointerCapture(e.pointerId);}
  },true);
  renderer.domElement.addEventListener('pointermove',e=>{
    if(!down?.entry){inspectHover(e);updateCursor(e);return;}
    if(!down.dragging&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>6){down.dragging=true;clearTimeout(inspectTimer);onDragStart?.(down.square);}
    if(!down.dragging)return;
    const square=ground(e),height=square?location(square).y:down.origin.y;down.plane.constant=-(height+.14);const point=new THREE.Vector3();
    if(ray.ray.intersectPlane(down.plane,point)){down.entry.group.position.set(THREE.MathUtils.clamp(point.x,-4.1,4.1),height+.14,THREE.MathUtils.clamp(point.z,-4.1,4.1));}
    dragShadow(down.entry,square);dirty=true;renderer.shadowMap.needsUpdate=true;
  });
  renderer.domElement.addEventListener('pointerup',e=>{
    if(!down)return;const gesture=down,release=gesture.entry?.group.position.clone(),target=gesture.dragging?ground(e):gesture.square;down=null;dropShadow.visible=dropMarker.visible=false;
    if(gesture.entry){
      gesture.entry.group.position.copy(gesture.origin);controls.enabled=true;dirty=true;renderer.shadowMap.needsUpdate=true;
      if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId);
      if(gesture.dragging){onDrag(gesture.square,target);const current=units.get(gesture.entry.unit.id);if(current&&!busy){const end=location(current.unit.square);settle(current,release,end);}}
      else onSquare(gesture.square);
    }else if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)<6)onSquare(hit(e));
    updateCursor(e);
  },true);
  renderer.domElement.addEventListener('pointercancel',()=>{if(down?.entry)settle(down.entry,down.entry.group.position,down.origin);down=null;dropShadow.visible=dropMarker.visible=false;controls.enabled=true;dirty=true;renderer.shadowMap.needsUpdate=true;renderer.domElement.style.cursor='default';});renderer.domElement.style.cursor='default';
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
    if(!presenting)controls.update();
    const dropping=[...units.values()].some(e=>e.drop);if(!quality.idle&&!busy&&!dirty&&!presenting&&!dropping)return;
    if(!busy)for(const e of units.values())if(e.drop){const motion=e.drop,p=Math.min(1,(now-motion.started)/motion.duration);e.group.position.lerpVectors(motion.from,motion.to,1-(1-p)**3);e.group.position.y=THREE.MathUtils.lerp(motion.from.y,motion.to.y,p*p);if(p>=1){e.group.position.copy(motion.to);e.drop=null;}renderer.shadowMap.needsUpdate=true;}
    if(!busy)for(const e of units.values())animateCharacter(e.visual,now/1000,{reducedMotion:reduced||!quality.idle,phase:e.group.id,selected:false,kingPose:e.unit.captured||e.unit.mated?'defeated':'standing'});
    renderer.render(scene,camera);dirty=false;
  }
  function schedule(){cancelAnimationFrame(frame);if(active&&!document.hidden&&!disposed)frame=requestAnimationFrame(loop);}
  document.addEventListener('visibilitychange',schedule);schedule();
  function setQuality(lite){quality=deviceRenderQuality(lite);renderer.setPixelRatio(Math.min(devicePixelRatio,quality.pixelRatio));renderer.shadowMap.enabled=quality.shadows;renderer.shadowMap.needsUpdate=true;controls.enableDamping=quality.idle;dirty=true;resize();}
  setQuality(false);
  return {render,play,resize,projectSquare,setQuality,setSelection,playIntro,cancelIntro,cancelPlayback,resetCamera(){cancelIntro();controls.reset();},setActive(value){active=value;if(value)resize();schedule();},dispose(){disposed=true;cancelIntro();cancelPlayback();scene.background?.dispose?.();shadowTextures.forEach(t=>t.dispose());clearTimeout(inspectTimer);cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',schedule);observer.disconnect();controls.dispose();for(const id of units.keys())removeUnit(id);clearGroup(effects);clearGroup(terrain);scene.traverse(m=>{m.geometry?.dispose();if(m.material)for(const mat of Array.isArray(m.material)?m.material:[m.material])mat.dispose();});renderer.dispose();renderer.domElement.remove();}};
}

function createDuskSky(){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const c=canvas.getContext('2d'),gradient=c.createLinearGradient(0,0,0,512);
  for(const [stop,color]of [[0,'#10182e'],[.35,'#273653'],[.56,'#65516f'],[.69,'#a47b83'],[.78,'#4e566d'],[1,'#283d46']])gradient.addColorStop(stop,color);c.fillStyle=gradient;c.fillRect(0,0,1024,512);
  const glow=c.createRadialGradient(740,180,3,740,180,64);glow.addColorStop(0,'#dce8ff70');glow.addColorStop(1,'#bdc9fa00');c.fillStyle=glow;c.fillRect(670,110,140,140);c.fillStyle='#dfebfb';c.beginPath();c.arc(740,180,12,0,Math.PI*2);c.fill();
  let seed=91;for(let i=0;i<42;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%1024;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed%150;c.fillStyle=i%3?'#e3eafa65':'#e3eafaaf';c.fillRect(x,y,1,1);}
  const texture=new THREE.CanvasTexture(canvas);texture.mapping=THREE.EquirectangularReflectionMapping;texture.colorSpace=THREE.SRGBColorSpace;texture.name='tactical-dusk-sky';return texture;
}
