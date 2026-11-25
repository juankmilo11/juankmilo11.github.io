(() => {
  'use strict';
  const M = window.PacaMotion;
  M.mount(signal => {
    const hero = document.querySelector('.hero'), photo = document.querySelector('.hero-photo');
    const image = document.querySelector('#hero-image'), title = document.querySelector('#hero-title');
    const live = document.createElement('span'); live.className = 'hero-title-live';
    live.append(...title.childNodes); title.append(live);
    const surface = document.createElement('canvas'), glyphs = document.createElement('canvas');
    surface.className = 'hero-liquid'; glyphs.className = 'hero-stipple';
    surface.setAttribute('aria-hidden','true'); glyphs.setAttribute('aria-hidden','true');
    photo.append(surface); title.append(glyphs);
    const ctx = glyphs.getContext('2d');
    const mask = document.createElement('canvas'), maskCtx = mask.getContext('2d', {willReadFrequently:true});
    const dots = document.createElement('canvas'), dotsCtx = dots.getContext('2d');
    const simple = matchMedia('(pointer: coarse), (max-width: 768px)');
    let gl, program, texture, buffer, uniforms, clock, started = false, elapsed = 0, ready = false, samples = [];
    let width = 1, height = 1, imageAspect = 1, time = 0, lastX = .5, lastY = .5;
    const pointer = {x:.5,y:.5,vx:0,vy:0,down:0,pressure:0,clickX:.5,clickY:.5,ripple:20};
    function stopGL(release=false) {
      surface.hidden = true;
      if (gl) { gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program); }
      const context=gl;gl = null;
      if(release)context?.getExtension('WEBGL_lose_context')?.loseContext();
    }
    function initGL() {
      if (gl || M.reduced.matches || signal.aborted) return;
      try {
        gl = surface.getContext('webgl', {alpha:true,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:false});
        if (!gl) { surface.hidden = true; return; }
        const shader = (type, source) => {
          const value = gl.createShader(type); gl.shaderSource(value, source); gl.compileShader(value);
          if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) { gl.deleteShader(value); throw new Error('Hero shader compilation'); }
          return value;
        };
        const vertex = shader(gl.VERTEX_SHADER, 'attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}');
        const fragment = shader(gl.FRAGMENT_SHADER, `precision mediump float;
          varying vec2 uv;uniform sampler2D photo;uniform float time,aspect,imageAspect,pressure,ripple;
          uniform vec2 pointer,velocity,click;
          void main(){
            vec2 p=uv; vec2 delta=(uv-pointer)*vec2(aspect,1.);
            float radius=length(delta); float influence=exp(-radius*radius*14.);
            vec2 silk=vec2(sin(p.y*8.+time*.34+sin(p.x*5.+time*.18)),cos(p.x*7.-time*.26+sin(p.y*6.)))*.0035;
            vec2 swirl=vec2(-delta.y,delta.x)*influence*(.045+pressure*.14);
            vec2 drag=velocity*influence*.12;
            float ring=sin(length((uv-click)*vec2(aspect,1.))*52.-ripple*9.)*exp(-ripple*2.2)*.006;
            p+=silk+swirl+drag+normalize(uv-click+vec2(.0001))*ring;
            vec2 cover=vec2(min(1.,aspect/imageAspect),min(1.,imageAspect/aspect));
            p=(p-.5)*cover+.5;
            gl_FragColor=texture2D(photo,clamp(p,.001,.999));
          }`);
        program = gl.createProgram(); gl.attachShader(program,vertex); gl.attachShader(program,fragment); gl.linkProgram(program);
        gl.deleteShader(vertex); gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error('Hero shader linking');
        gl.useProgram(program); buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
        const position=gl.getAttribLocation(program,'position'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
        uniforms=Object.fromEntries(['photo','time','aspect','imageAspect','pressure','ripple','pointer','velocity','click'].map(key=>[key,gl.getUniformLocation(program,key)]));
        texture=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,texture); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        upload(); resize();
      } catch (error) { console.warn('PACA: static hero fallback.',error); stopGL(); }
    }
    function upload() {
      if (!image.complete || !image.naturalWidth || !gl) return;
      try {
        gl.bindTexture(gl.TEXTURE_2D,texture); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
        imageAspect=image.naturalWidth/image.naturalHeight; surface.hidden=M.reduced.matches;
      } catch (error) { stopGL(); }
      clock?.request();
    }
    function sampleTitle() {
      if (signal.aborted || !ctx || !maskCtx) return;
      const box=title.getBoundingClientRect();
      glyphs.width=mask.width=dots.width=Math.ceil(box.width); glyphs.height=mask.height=dots.height=Math.ceil(box.height);
      maskCtx.clearRect(0,0,mask.width,mask.height);
      const walker=document.createTreeWalker(live,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()) {
        const node=walker.currentNode, style=getComputedStyle(node.parentElement);
        maskCtx.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        maskCtx.fillStyle=style.color; maskCtx.textBaseline='alphabetic';
        for(let i=0;i<node.length;i++) {
          if(!node.data[i].trim()) continue;
          const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);
          const rect=range.getBoundingClientRect(), metrics=maskCtx.measureText(node.data[i]);
          const ascent=metrics.fontBoundingBoxAscent||parseFloat(style.fontSize)*.8;
          maskCtx.fillText(node.data[i],rect.left-box.left,rect.top-box.top+ascent);
        }
      }
      const pixels=maskCtx.getImageData(0,0,mask.width,mask.height).data;
      samples=[];
      for(let y=1;y<mask.height;y+=4) for(let x=1;x<mask.width;x+=4) {
        if(pixels[(y*mask.width+x)*4+3]>32) samples.push({x,y,seed:((x*17+y*31)%101)/101});
      }
      ready=true; clock?.request();
    }
    function resize() {
      width=Math.max(1,Math.round(photo.clientWidth));height=Math.max(1,Math.round(photo.clientHeight));
      surface.width=width;surface.height=height;gl?.viewport(0,0,width,height);
      sampleTitle(); clock?.request();
    }
    function reveal(dt, reduced) {
      if(reduced) { elapsed=1600;title.classList.remove('is-stippling');live.style.clipPath='';glyphs.hidden=true;return; }
      if(!ctx || !maskCtx) {elapsed=1600;return;}
      if(!ready) return;
      if(!started) {started=true;elapsed=0;}
      elapsed+=dt;
      if(simple.matches || !ctx || !samples.length) {
        title.classList.remove('is-stippling');glyphs.hidden=true;
        const p=Math.min(1,elapsed/700);
        live.style.clipPath=p>=1?'':`polygon(0 0,${p*140}% 0,${p*140-40}% 100%,0 100%)`;
        return;
      }
      const p=Math.min(1,elapsed/1500);
      if(p>=1){title.classList.remove('is-stippling');glyphs.hidden=true;return;}
      title.classList.add('is-stippling');glyphs.hidden=false;
      ctx.clearRect(0,0,glyphs.width,glyphs.height);ctx.drawImage(mask,0,0);
      dotsCtx.clearRect(0,0,dots.width,dots.height);dotsCtx.fillStyle='#fff';dotsCtx.beginPath();
      for(const {x,y,seed} of samples) {
        const local=Math.max(0,Math.min(1,(p*1.6-seed*.6)));
        const r=.25+local*4.6;dotsCtx.moveTo(x+r,y);dotsCtx.arc(x,y,r,0,Math.PI*2);
      }
      dotsCtx.fill();ctx.globalCompositeOperation='destination-in';ctx.drawImage(dots,0,0);ctx.globalCompositeOperation='source-over';
    }
    clock=M.section(hero,(now,dt,reduced)=>{
      reveal(dt,reduced);
      surface.hidden=reduced||!gl;
      if(gl&&!reduced) {
        time+=dt/1000;pointer.ripple+=dt/1000;
        const k=1-Math.exp(-dt/100);pointer.pressure+=(pointer.down-pointer.pressure)*k;
        pointer.vx*=Math.exp(-dt/170);pointer.vy*=Math.exp(-dt/170);
        gl.uniform1f(uniforms.time,time);gl.uniform1f(uniforms.aspect,width/height);gl.uniform1f(uniforms.imageAspect,imageAspect);
        gl.uniform1f(uniforms.pressure,pointer.pressure);gl.uniform1f(uniforms.ripple,pointer.ripple);
        gl.uniform2f(uniforms.pointer,pointer.x,pointer.y);gl.uniform2f(uniforms.velocity,pointer.vx,pointer.vy);gl.uniform2f(uniforms.click,pointer.clickX,pointer.clickY);
        gl.drawArrays(gl.TRIANGLES,0,6);
      }
      return !!gl||elapsed<1600;
    },signal,.15);
    hero.addEventListener('pointermove',event=>{
      const box=hero.getBoundingClientRect();const x=(event.clientX-box.left)/box.width,y=1-(event.clientY-box.top)/box.height;
      pointer.vx=x-lastX;pointer.vy=y-lastY;pointer.x=x;pointer.y=y;lastX=x;lastY=y;clock.request();
    },{passive:true,signal});
    hero.addEventListener('pointerdown',event=>{
      if(event.target.closest('a,button'))return;
      const box=hero.getBoundingClientRect();pointer.clickX=(event.clientX-box.left)/box.width;pointer.clickY=1-(event.clientY-box.top)/box.height;
      pointer.down=event.pressure||.6;pointer.ripple=0;clock.request();
    },{passive:true,signal});
    for(const name of ['pointerup','pointercancel','pointerleave'])hero.addEventListener(name,()=>{pointer.down=0;},{passive:true,signal});
    surface.addEventListener('webglcontextlost',event=>{event.preventDefault();stopGL();},{signal});
    image.addEventListener('load',upload,{signal});
    M.reduced.addEventListener('change',()=>{if(!M.reduced.matches)initGL();clock.request();},{signal});
    simple.addEventListener('change',()=>{sampleTitle();},{signal});
    document.addEventListener('paca:language',()=>{sampleTitle();},{signal});
    const theme=new MutationObserver(sampleTitle);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(hero);resizeObserver.observe(title);
    document.fonts.ready.then(()=>{if(!signal.aborted)sampleTitle();});
    initGL();resize();
    return ()=>{stopGL(true);resizeObserver.disconnect();theme.disconnect();live.style.clipPath='';title.classList.remove('is-stippling');glyphs.remove();surface.remove();live.replaceWith(...live.childNodes);};
  });
})();
