(() => {
  'use strict';
  window.PacaMotion.mount(signal => {
    const M=window.PacaMotion,hero=document.querySelector('#inicio'),scene=hero.querySelector('.hero-scene');
    const photo=hero.querySelector('.hero-photo'),textPath=hero.querySelector('textPath'),title=hero.querySelector('h1');
    const live=document.createElement('span');live.className='hero-title-live';live.append(...title.childNodes);title.append(live);
    const canvas=document.createElement('canvas');canvas.className='hero-stipple';canvas.setAttribute('aria-hidden','true');title.append(canvas);
    const ctx=canvas.getContext('2d'),mask=document.createElement('canvas'),dots=document.createElement('canvas');
    const maskCtx=mask.getContext('2d',{willReadFrequently:true}),dotCtx=dots.getContext('2d');
    const simple=matchMedia('(pointer: coarse), (max-width: 768px)');
    let top=0,range=1,p=0,desired=0,ribbonTime=0,clock,ready=false,entered=false,started=false,done=false,elapsed=0,samples=[];
    function finishTitle(){
      done=true;title.classList.remove('is-stippling');canvas.hidden=true;live.style.clipPath='';
    }
    function sample(){
      if(signal.aborted||!ctx||!maskCtx||!dotCtx)return;
      const box=title.getBoundingClientRect();
      if(box.width<1||box.height<1){title.classList.remove('is-stippling');canvas.hidden=true;live.style.clipPath='';ready=false;return;}
      canvas.width=mask.width=dots.width=Math.ceil(box.width);canvas.height=mask.height=dots.height=Math.ceil(box.height);
      const walker=document.createTreeWalker(live,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()){
        const node=walker.currentNode,style=getComputedStyle(node.parentElement);
        maskCtx.font=style.fontStyle+' '+style.fontWeight+' '+style.fontSize+' '+style.fontFamily;maskCtx.fillStyle=style.color;
        for(let i=0;i<node.length;i++){
          if(!node.data[i].trim())continue;
          const glyph=document.createRange();glyph.setStart(node,i);glyph.setEnd(node,i+1);const r=glyph.getBoundingClientRect();
          const ascent=maskCtx.measureText(node.data[i]).fontBoundingBoxAscent||parseFloat(style.fontSize)*.8;
          maskCtx.fillText(node.data[i],r.left-box.left,r.top-box.top+ascent);
        }
      }
      samples=[];const data=maskCtx.getImageData(0,0,mask.width,mask.height).data;
      for(let y=1;y<mask.height;y+=4)for(let x=1;x<mask.width;x+=4)if(data[(y*mask.width+x)*4+3]>32)samples.push({x,y,seed:((x*17+y*31)%101)/101});
      ready=true;clock?.request();
    }
    function reveal(dt,reduced){
      if(reduced){finishTitle();return;}
      if(done)return;
      if(!entered||document.documentElement.classList.contains('paca-intro-active'))return;
      if(!ctx||!ready){if(!ctx)finishTitle();return;}
      started=true;elapsed+=dt;
      if(simple.matches||!samples.length){
        canvas.hidden=true;title.classList.remove('is-stippling');
        const a=Math.min(1,elapsed/700);live.style.clipPath=a>=1?'':`polygon(0 0,${a*140}% 0,${a*140-40}% 100%,0 100%)`;
        if(a>=1)finishTitle();return;
      }
      const a=Math.min(1,elapsed/1500);
      if(a>=1){finishTitle();return;}
      title.classList.add('is-stippling');canvas.hidden=false;
      ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(mask,0,0);
      dotCtx.clearRect(0,0,dots.width,dots.height);dotCtx.beginPath();dotCtx.fillStyle='#fff';
      for(const point of samples){const r=.25+Math.max(0,Math.min(1,a*1.6-point.seed*.6))*4.6;dotCtx.moveTo(point.x+r,point.y);dotCtx.arc(point.x,point.y,r,0,Math.PI*2);}
      dotCtx.fill();ctx.globalCompositeOperation='destination-in';ctx.drawImage(dots,0,0);ctx.globalCompositeOperation='source-over';
    }
    function measure(){top=hero.getBoundingClientRect().top+scrollY;range=Math.max(1,hero.offsetHeight-scene.offsetHeight);sample();update();}
    function update(){desired=Math.max(0,Math.min(1,(scrollY-top)/range));clock?.request();}
    clock=M.section(hero,(now,dt,reduced)=>{
      p=reduced?desired:p+(desired-p)*(1-Math.exp(-Math.min(.1,dt/1000)/.14));if(Math.abs(p-desired)<.0001)p=desired;
      if(!reduced)ribbonTime+=dt/1000;
      const offset=reduced?17:17+11*Math.cos(ribbonTime*.28);
      textPath.setAttribute('startOffset',offset+'%');hero.dataset.ribbonOffset=offset.toFixed(4);
      photo.style.transform=`translateY(${-18*p}px) scale(${1.12-.08*p})`;hero.dataset.progress=p.toFixed(5);
      reveal(dt,reduced);hero.dataset.titleReveal=done?'complete':started?'running':'waiting';
      return !reduced;
    },signal);
    const entrance=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting&&entries[0].intersectionRatio>=.15){entered=true;entrance.unobserve(title);clock.request();}
    },{threshold:.15});entrance.observe(title);
    addEventListener('scroll',update,{passive:true,signal});addEventListener('resize',measure,{passive:true,signal});
    document.addEventListener('paca:language',sample,{signal});simple.addEventListener('change',sample,{signal});
    const theme=new MutationObserver(sample);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    const resize=new ResizeObserver(measure);resize.observe(scene);resize.observe(title);
    document.fonts.ready.then(()=>{if(!signal.aborted)measure();});canvas.hidden=true;measure();
    return ()=>{entrance.disconnect();theme.disconnect();resize.disconnect();photo.style.transform='';title.classList.remove('is-stippling');live.style.clipPath='';canvas.remove();live.replaceWith(...live.childNodes);};
  });
})();
