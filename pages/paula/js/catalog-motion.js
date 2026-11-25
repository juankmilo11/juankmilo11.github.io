(() => {
  'use strict';
  const threeURL = new URL('vendor/three.module.js',document.currentScript.src).href;
  const M=window.PacaMotion,I=window.PacaI18n;
  M.mount(signal=>{
    const catalog=document.querySelector('#catalogo'),grid=document.querySelector('#catalog-grid');
    const stage=document.createElement('div');stage.className='catalog-stream';stage.tabIndex=0;stage.setAttribute('role','region');
    stage.setAttribute('aria-describedby','catalog-stream-help');
    const help=document.createElement('p');help.id='catalog-stream-help';help.className='sr-only';
    const controls=document.createElement('div');controls.className='stream-controls';
    const previous=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');
    const status=document.createElement('p');status.className='sr-only';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    previous.type=next.type='button';previous.textContent='↑';next.textContent='↓';count.setAttribute('aria-hidden','true');
    controls.append(previous,count,next);stage.append(help,status);grid.before(stage,controls);
    let renderer,scene,camera,T,geometry,clock,loading=false,failed=false,entries=[],meshes=new Map(),textures=new Map();
    let position=0,target=0,velocity=0,lastVelocity=0,snapTimer=0,announceTimer=0,drag=null,revision=0;
    let width=1,height=1;
    const clamp=value=>Math.max(0,Math.min(Math.max(0,entries.length-1),value));
    function labels(){
      stage.setAttribute('aria-label',I.t('galleryLabel'));help.textContent=I.t('galleryHelp');
      previous.setAttribute('aria-label',I.t('galleryPrevious'));next.setAttribute('aria-label',I.t('galleryNext'));
    }
    function announce(){
      const index=Math.round(target),entry=entries[index];
      count.textContent=entries.length?`${index+1} / ${entries.length}`:'0 / 0';
      previous.disabled=index<=0;next.disabled=index>=entries.length-1;
      if(entry)status.textContent=I.t('galleryCurrent',{index:index+1,total:entries.length,title:entry.title});
      stage.setAttribute('aria-keyshortcuts','ArrowUp ArrowDown ArrowLeft ArrowRight Home End');
      stage.dataset.index=String(index);
    }
    function disposeMeshes(){
      meshes.forEach(mesh=>{scene?.remove(mesh);mesh.material.dispose();});meshes.clear();
      textures.forEach(value=>value.texture?.dispose());textures.clear();
    }
    function fallback(){
      failed=true;revision++;disposeMeshes();geometry?.dispose();renderer?.dispose();renderer?.forceContextLoss();
      renderer?.domElement.remove();renderer=null;stage.hidden=true;controls.hidden=true;
      catalog.dataset.galleryState='fallback';grid.removeAttribute('aria-hidden');
    }
    async function init(){
      if(renderer||loading||failed||M.reduced.matches||signal.aborted)return;
      loading=true;
      try{
        T=await import(threeURL);if(signal.aborted)return;
        renderer=new T.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});
        renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);
        scene=new T.Scene();camera=new T.OrthographicCamera(-4,4,4.5,-4.5,.1,60);camera.position.z=12;
        geometry=new T.PlaneGeometry(1,1,12,24);
        renderer.domElement.setAttribute('aria-hidden','true');stage.append(renderer.domElement);
        renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();fallback();},{signal});
        catalog.dataset.galleryState='ready';stage.hidden=false;controls.hidden=false;grid.setAttribute('aria-hidden','true');
        size();syncMeshes();clock.request();
      }catch(error){console.warn('PACA: static catalog fallback.',error);fallback();}
      finally{loading=false;}
    }
    function syncMeshes(){
      if(!renderer||!entries.length)return;
      const center=Math.round(position),wanted=new Set();
      for(let index=Math.max(0,center-3);index<=Math.min(entries.length-1,center+3);index++){
        const entry=entries[index];wanted.add(entry.id);
        if(meshes.has(entry.id))continue;
        const material=new T.ShaderMaterial({
          transparent:true,side:T.DoubleSide,depthWrite:false,
          uniforms:{photo:{value:null},flex:{value:0},opacity:{value:1}},
          vertexShader:'varying vec2 vUv;uniform float flex;void main(){vUv=uv;vec3 p=position;p.z+=sin(uv.y*3.14159265)*flex;p.x+=sin(uv.y*6.2831853)*flex*.08;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',
          fragmentShader:'varying vec2 vUv;uniform sampler2D photo;uniform float opacity;void main(){gl_FragColor=texture2D(photo,vUv);gl_FragColor.a*=opacity;\n#include <colorspace_fragment>\n}'
        });
        const mesh=new T.Mesh(geometry,material);mesh.visible=false;mesh.userData.index=index;scene.add(mesh);meshes.set(entry.id,mesh);
        const marker=revision;
        const record={texture:null};textures.set(entry.id,record);
        new T.TextureLoader().load(entry.src,texture=>{
          if(signal.aborted||marker!==revision||textures.get(entry.id)!==record||!renderer){texture.dispose();return;}
          texture.colorSpace=T.SRGBColorSpace;record.texture=texture;material.uniforms.photo.value=texture;mesh.visible=true;clock.request();
        },undefined,()=>{if(!signal.aborted&&marker===revision)M.reportAsset(entry.src);});
      }
      for(const [id,mesh] of meshes)if(!wanted.has(id)){
        scene.remove(mesh);mesh.material.dispose();meshes.delete(id);textures.get(id)?.texture?.dispose();textures.delete(id);
      }
    }
    function size(){
      width=Math.max(1,stage.clientWidth);height=Math.max(1,stage.clientHeight);
      if(renderer){renderer.setSize(width,height,false);camera.left=-4.5*width/height;camera.right=-camera.left;camera.updateProjectionMatrix();}
      clock?.request();
    }
    function move(value,delayed=false){
      target=clamp(value);clearTimeout(snapTimer);clearTimeout(announceTimer);
      if(delayed)snapTimer=setTimeout(()=>{target=Math.round(target);announce();clock.request();},160);
      else {target=Math.round(target);announce();}
      clock.request();
    }
    clock=M.section(catalog,(now,dt,reduced)=>{
      if(reduced){position=target;stage.hidden=true;controls.hidden=true;catalog.dataset.galleryState='static';grid.removeAttribute('aria-hidden');return false;}
      if(!renderer&&!failed){init();return false;}
      if(!renderer)return false;
      stage.hidden=false;controls.hidden=false;catalog.dataset.galleryState='ready';grid.setAttribute('aria-hidden','true');
      const old=position;position+=(target-position)*(1-Math.exp(-dt/95));
      velocity=dt?(position-old)*1000/dt:0;
      if(Math.abs(target-position)<.0006)position=target;
      syncMeshes();
      const viewWidth=camera.right-camera.left;
      meshes.forEach(mesh=>{
        const index=mesh.userData.index,d=index-position,depth=Math.min(1,Math.abs(d));
        const entry=entries[index];if(!entry)return;
        const cardHeight=Math.min(5.65,(viewWidth*.78)/(entry.width/entry.height));
        const scale=1-depth*.16;
        mesh.scale.set(cardHeight*(entry.width/entry.height)*scale,cardHeight*scale,1);
        mesh.position.set(Math.sin(d*.55)*Math.min(.6,viewWidth*.05),-d*4.75,-Math.abs(d)*1.4);
        mesh.rotation.set(Math.sign(d)*depth*.48,Math.sign(d)*depth*.22,Math.sign(d)*depth*-.025);
        mesh.material.uniforms.flex.value=Math.max(-.65,Math.min(.65,velocity*.045));
        mesh.material.uniforms.opacity.value=Math.max(0,1-Math.max(0,Math.abs(d)-1.1)*.55);
        mesh.renderOrder=10-Math.round(Math.abs(d));
      });
      renderer.render(scene,camera);
      const active=Math.abs(target-position)>.0006||Math.abs(velocity)>.001||Math.abs(lastVelocity)>.001;
      lastVelocity=velocity;return active;
    },signal);
    stage.addEventListener('wheel',event=>{
      if(M.reduced.matches||!renderer||event.ctrlKey)return;
      const delta=(Math.abs(event.deltaY)>Math.abs(event.deltaX)?event.deltaY:event.deltaX)*(event.deltaMode===1?16:event.deltaMode===2?height:1);
      if(!delta||(target<=0&&delta<0)||(target>=entries.length-1&&delta>0))return;
      event.preventDefault();move(target+Math.max(-.85,Math.min(.85,delta*.003)),true);
    },{passive:false,signal});
    stage.addEventListener('keydown',event=>{
      if(['ArrowUp','ArrowLeft','ArrowDown','ArrowRight','Home','End'].includes(event.key)){
        event.preventDefault();move(event.key==='Home'?0:event.key==='End'?entries.length-1:Math.round(target)+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1));
      }
      // Enter and click intentionally never open a detail or booking dialog.
    },{signal});
    stage.addEventListener('pointerdown',event=>{
      if(!renderer||event.button!==0)return;drag={id:event.pointerId,y:event.clientY,target};stage.setPointerCapture(event.pointerId);stage.focus({preventScroll:true});
    },{signal});
    stage.addEventListener('pointermove',event=>{if(drag?.id===event.pointerId)move(drag.target+(drag.y-event.clientY)/Math.max(130,height*.32),true);},{signal});
    const release=()=>{if(drag){drag=null;clearTimeout(snapTimer);snapTimer=setTimeout(()=>move(target),160);}};
    for(const event of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(event,release,{signal});
    previous.addEventListener('click',()=>move(Math.round(target)-1),{signal});next.addEventListener('click',()=>move(Math.round(target)+1),{signal});
    function render(nextEntries){
      const id=entries[Math.round(target)]?.id;revision++;disposeMeshes();entries=nextEntries;
      target=position=Math.max(0,entries.findIndex(entry=>entry.id===id));labels();announce();syncMeshes();clock.request();
    }
    document.addEventListener('paca:catalog-render',event=>render(event.detail.entries),{signal});
    document.addEventListener('paca:catalog-select',event=>{const index=entries.findIndex(entry=>entry.id===event.detail.id);if(index>=0)move(index);},{signal});
    document.addEventListener('paca:language',labels,{signal});
    M.reduced.addEventListener('change',()=>{if(!M.reduced.matches)init();clock.request();},{signal});
    const observer=new ResizeObserver(size);observer.observe(stage);
    labels();render(window.PacaCatalog?.entries||[]);
    stage.hidden=true;controls.hidden=true;catalog.dataset.galleryState='static';
    return ()=>{clearTimeout(snapTimer);clearTimeout(announceTimer);observer.disconnect();fallback();stage.remove();controls.remove();delete catalog.dataset.galleryState;};
  });
})();
