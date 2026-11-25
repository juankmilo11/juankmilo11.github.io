(() => {
  'use strict';
  const threeURL=new URL('vendor/three.module.js',document.currentScript.src).href;
  const M=window.PacaMotion,I=window.PacaI18n;
  M.mount(signal=>{
    const catalog=document.querySelector('#catalogo'),grid=catalog.querySelector('#catalog-grid');
    const stage=document.createElement('div');stage.className='catalog-stream';stage.tabIndex=0;stage.setAttribute('role','region');
    stage.setAttribute('aria-describedby','catalog-stream-help');stage.setAttribute('aria-keyshortcuts','ArrowUp ArrowDown Home End');
    const help=document.createElement('p');help.id='catalog-stream-help';help.className='sr-only';
    const status=catalog.querySelector('#catalog-status');
    const description=document.createElement('div');description.className='sr-only';description.setAttribute('role','img');
    const fallbackList=document.createElement('div');fallbackList.className='catalog-fallback';fallbackList.setAttribute('role','list');fallbackList.hidden=true;
    stage.append(help,status,description);grid.before(stage,fallbackList);
    const hint=catalog.querySelector('.catalog-more p'),originalHint=hint.textContent;
    catalog.classList.add('is-gallery');grid.setAttribute('aria-hidden','true');
    let T,renderer,scene,camera,track,geometry,clock,loading=false,failed=false,entries=[],phase=0,target=0,speed=0,previousSpeed=0;
    let width=1,height=1,snapTimer=0,drag=null,revision=0;
    const meshes=new Map(),textures=new Map(),pageWidth=4.492;
    let pivot,unpivot,rx,ry,rz,base,scale,rotation,placement,corner;
    const smooth=(lo,hi,x)=>{const t=Math.max(0,Math.min(1,(x-lo)/(hi-lo)));return t*t*(3-2*t);};
    const wrap=(value,n)=>((value+n/2)%n+n)%n-n/2;
    const indexOf=value=>entries.length?((Math.round(value)%entries.length)+entries.length)%entries.length:0;
    function labels(){stage.setAttribute('aria-label',I.t('galleryLabel'));help.textContent=I.t('galleryHelp');hint.textContent=I.t('galleryHint');announce();}
    function announce(){
      const index=indexOf(target),entry=entries[index];stage.dataset.index=String(index);
      if(entry){status.textContent=I.t('galleryCurrent',{index:index+1,total:entries.length,title:entry.title});description.setAttribute('aria-label',entry.alt);}
    }
    function disposeMeshes(){
      meshes.forEach(mesh=>{track?.remove(mesh);mesh.material.dispose();});meshes.clear();
      textures.forEach(record=>record.texture?.dispose());textures.clear();
    }
    function buildFallback(){
      fallbackList.replaceChildren(...entries.map(entry=>{
        const item=document.createElement('div');item.setAttribute('role','listitem');
        const image=document.createElement('img');image.src=entry.src;image.alt=entry.alt;image.width=entry.width;image.height=entry.height;image.loading='lazy';image.decoding='async';
        item.append(image);return item;
      }));
    }
    function fallback(){
      failed=true;revision++;disposeMeshes();geometry?.dispose();const old=renderer;renderer=null;
      old?.dispose();old?.forceContextLoss();old?.domElement.remove();
      stage.hidden=true;fallbackList.hidden=false;catalog.dataset.galleryState='fallback';buildFallback();
    }
    async function init(){
      if(renderer||loading||failed||signal.aborted)return;
      loading=true;
      try{
        T=await import(threeURL);if(signal.aborted)return;
        renderer=new T.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});
        renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);
        scene=new T.Scene();camera=new T.OrthographicCamera(-8,8,5.4,-5.4,.1,100);
        camera.position.set(20,12.1,16.6);camera.lookAt(-7,-2.1,1.3);camera.updateMatrixWorld();
        track=new T.Group();track.position.set(4.3,2.1,5.1);track.rotation.set(-.0215,2.2884,.2884,'XYZ');scene.add(track);track.updateMatrixWorld();
        geometry=new T.PlaneGeometry(1,1,12,32);
        pivot=new T.Matrix4().makeTranslation(pageWidth/2,0,0);unpivot=new T.Matrix4().makeTranslation(-pageWidth/2,0,0);
        rx=new T.Matrix4();ry=new T.Matrix4();rz=new T.Matrix4();base=new T.Matrix4();scale=new T.Matrix4();rotation=new T.Matrix4();placement=new T.Matrix4();corner=new T.Vector3();
        renderer.domElement.setAttribute('aria-hidden','true');stage.append(renderer.domElement);
        renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();if(!signal.aborted)fallback();},{signal});
        catalog.dataset.galleryState='ready';stage.setAttribute('aria-busy','false');stage.hidden=false;size();clock.request();
      }catch(error){console.warn('PACA: accessible catalog fallback.',error);fallback();}
      finally{loading=false;}
    }
    // Corrections are applied in track space, around the prescribed pivot.
    function cardMatrix(relative,aspect,weight){
      const d=Math.abs(relative),shift=relative+Math.sign(relative)*7*smooth(.1,.9,d);
      rx.makeRotationX(-.06681*weight);ry.makeRotationY(.36331*weight);rz.makeRotationZ(-.51318*weight);
      rotation.copy(rz).multiply(ry).multiply(rx);
      base.makeTranslation(shift,0,-pageWidth/2-1).multiply(placement.makeRotationY(Math.PI/2));
      scale.makeScale(pageWidth,pageWidth/aspect,1);
      return pivot.clone().multiply(rotation).multiply(unpivot).multiply(base).multiply(scale);
    }
    function fitCamera(){
      if(!renderer)return;
      const aspect=width/height,entry=entries[indexOf(target)];
      let frustum=width<=768?12.5:10.8;
      if(entry){
        const matrix=track.matrixWorld.clone().multiply(cardMatrix(0,entry.width/entry.height,1));
        for(const x of [-.5,.5])for(const y of [-.5,.5]){
          corner.set(x,y,0).applyMatrix4(matrix).applyMatrix4(camera.matrixWorldInverse);
          frustum=Math.max(frustum,Math.abs(corner.y)*2.18,Math.abs(corner.x)*2.18/aspect);
        }
      }
      camera.top=frustum/2;camera.bottom=-frustum/2;camera.left=-frustum*aspect/2;camera.right=frustum*aspect/2;camera.updateProjectionMatrix();
      stage.dataset.frustum=frustum.toFixed(3);
    }
    function size(){
      width=Math.max(1,stage.clientWidth);height=Math.max(1,stage.clientHeight);
      if(renderer){renderer.setSize(width,height,false);fitCamera();}clock?.request();
    }
    function syncMeshes(){
      if(!renderer||!entries.length)return;
      const wanted=new Set();
      entries.forEach((entry,index)=>{
        if(Math.abs(wrap(phase-index,entries.length))>Math.min(3.2,entries.length/2))return;
        wanted.add(entry.id);if(meshes.has(entry.id))return;
        const material=new T.ShaderMaterial({transparent:true,side:T.DoubleSide,depthWrite:true,uniforms:{photo:{value:null},speed:{value:0}},
          vertexShader:'varying vec2 vUv;uniform float speed;void main(){vUv=uv;vec3 p=position;p.z+=-sin(uv.y*2.)*.4*clamp(speed*2.,-2.,2.)*2.25;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',
          fragmentShader:'varying vec2 vUv;uniform sampler2D photo;void main(){gl_FragColor=texture2D(photo,vec2(1.-vUv.x,vUv.y));\\n#include <colorspace_fragment>\\n}'.replaceAll('\\n','\n')});
        const mesh=new T.Mesh(geometry,material);mesh.matrixAutoUpdate=false;mesh.visible=false;mesh.userData.index=index;track.add(mesh);meshes.set(entry.id,mesh);
        const marker=revision,record={texture:null};textures.set(entry.id,record);
        new T.TextureLoader().load(entry.src,texture=>{
          if(signal.aborted||marker!==revision||textures.get(entry.id)!==record||!renderer){texture.dispose();return;}
          texture.colorSpace=T.SRGBColorSpace;record.texture=texture;material.uniforms.photo.value=texture;mesh.visible=true;clock.request();
        },undefined,()=>{if(!signal.aborted&&marker===revision)M.reportAsset(entry.src);});
      });
      for(const [id,mesh]of meshes)if(!wanted.has(id)){track.remove(mesh);mesh.material.dispose();meshes.delete(id);textures.get(id)?.texture?.dispose();textures.delete(id);}
    }
    function snap(){target=Math.round(target);announce();fitCamera();clock.request();}
    function move(value,delayed=false){
      target=phase+Math.max(-2.5,Math.min(2.5,value-phase));clearTimeout(snapTimer);
      if(delayed)snapTimer=setTimeout(snap,160);else snap();
      clock.request();
    }
    clock=M.section(catalog,(now,ms,reduced)=>{
      if(!renderer&&!failed){if(clock?.visible)init();return false;}if(!renderer)return false;
      const dt=Math.min(.05,ms/1000),old=phase;
      phase=reduced?Math.round(target):phase+(target-phase)*(1-Math.pow(1-.047,dt*60));
      if(Math.abs(target-phase)<.0001)phase=target;
      // Actual phase change, normalized to a 60Hz frame, not wheel delta.
      speed=reduced||phase===target?0:(phase-old)/Math.max(.0001,dt*60);
      syncMeshes();
      meshes.forEach(mesh=>{
        const index=mesh.userData.index,relative=wrap(phase-index,entries.length),d=Math.abs(relative),entry=entries[index];
        const weight=smooth(0,1,1-smooth(0,.8,d));
        mesh.matrix.copy(cardMatrix(relative,entry.width/entry.height,weight));mesh.matrixWorldNeedsUpdate=true;
        mesh.material.uniforms.speed.value=speed;
      });
      renderer.render(scene,camera);
      stage.dataset.phase=phase.toFixed(5);stage.dataset.speed=speed.toFixed(6);
      const again=!reduced&&(phase!==target||Math.abs(previousSpeed)>.00001);previousSpeed=speed;return again;
    },signal);
    stage.addEventListener('wheel',event=>{
      if(!renderer||event.ctrlKey||entries.length<2||!event.deltaY)return;
      event.preventDefault();const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?height:1);
      move(target+(M.reduced.matches?Math.sign(delta):Math.max(-.65,Math.min(.65,delta*.0025))),true);
    },{passive:false,signal});
    stage.addEventListener('keydown',event=>{
      if(!renderer||!entries.length)return;
      if(event.key==='Home'||event.key==='End'){event.preventDefault();clearTimeout(snapTimer);phase=target=event.key==='Home'?0:entries.length-1;speed=previousSpeed=0;announce();fitCamera();clock.request();}
      else if(entries.length>1&&['ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();move(Math.round(target)+(event.key==='ArrowDown'?1:-1));}
      // Click and Enter deliberately have no gallery action.
    },{signal});
    stage.addEventListener('pointerdown',event=>{
      if(!renderer||event.button!==0||entries.length<2)return;
      drag={id:event.pointerId,y:event.clientY,target,moved:false};stage.setPointerCapture(event.pointerId);stage.focus({preventScroll:true});
    },{signal});
    stage.addEventListener('pointermove',event=>{
      if(drag?.id!==event.pointerId)return;const dy=drag.y-event.clientY;
      if(Math.abs(dy)>3)drag.moved=true;if(drag.moved)move(drag.target+dy/Math.max(130,height*.32),true);
    },{signal});
    const release=event=>{
      if(drag?.id!==event.pointerId)return;const moved=drag.moved;drag=null;
      if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);
      if(moved){clearTimeout(snapTimer);snapTimer=setTimeout(snap,160);}
    };
    for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,release,{signal});
    function render(nextEntries){
      clearTimeout(snapTimer);if(drag){const id=drag.id;drag=null;if(stage.hasPointerCapture(id))stage.releasePointerCapture(id);}
      const id=entries[indexOf(target)]?.id;revision++;disposeMeshes();entries=nextEntries;
      target=phase=Math.max(0,entries.findIndex(entry=>entry.id===id));speed=previousSpeed=0;labels();fitCamera();
      if(failed)buildFallback();clock.request();
    }
    document.addEventListener('paca:catalog-render',event=>render(event.detail.entries),{signal});
    document.addEventListener('paca:language',labels,{signal});
    const resize=new ResizeObserver(size);resize.observe(stage);
    stage.setAttribute('aria-busy','true');catalog.dataset.galleryState='pending';render(window.PacaCatalog?.entries||[]);
    return ()=>{
      clearTimeout(snapTimer);drag=null;resize.disconnect();revision++;disposeMeshes();geometry?.dispose();
      renderer?.dispose();renderer?.forceContextLoss();catalog.querySelector('.catalog-caption').append(status);stage.remove();fallbackList.remove();hint.textContent=originalHint;grid.removeAttribute('aria-hidden');catalog.classList.remove('is-gallery');delete catalog.dataset.galleryState;
    };
  });
})();
