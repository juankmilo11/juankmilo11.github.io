(() => {
  'use strict';
  const M=window.PacaMotion,I=window.PacaI18n;
  M.mount(signal=>{
    const artist=document.querySelector('#paula'),title=document.querySelector('#artist-title');
    const live=document.createElement('span');live.className='artist-name-live';live.append(...title.childNodes);title.append(live);
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
    svg.classList.add('artist-name-drawing');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');title.append(svg);
    const portrait=artist.querySelector('.artist-portrait');
    const light=document.createElement('span');light.className='portrait-light';light.setAttribute('aria-hidden','true');portrait.append(light);
    let elapsed=0,clock,ready=false,portraitVisible=false,reveal=0,phase=0,px=0,py=0,x=0,y=0;
    const metric=document.createElement('canvas').getContext('2d');
    const clamp=value=>Math.max(0,Math.min(1,value));
    function sample(){
      if(signal.aborted||!metric)return;
      const box=title.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);svg.replaceChildren();
      const walker=document.createTreeWalker(live,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()){
        const node=walker.currentNode,style=getComputedStyle(node.parentElement);
        metric.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        for(let i=0;i<node.length;i++){
          if(!node.data[i].trim())continue;
          const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);const rect=range.getBoundingClientRect();
          const text=document.createElementNS(ns,'text');text.textContent=node.data[i];
          text.setAttribute('x',rect.left-box.left);text.setAttribute('y',rect.top-box.top+(metric.measureText(node.data[i]).fontBoundingBoxAscent||parseFloat(style.fontSize)*.8));
          text.style.font=metric.font;text.style.color=style.color;svg.append(text);
        }
      }
      ready=true;clock?.request();
    }
    clock=M.section(artist,(now,dt,reduced)=>{

      title.classList.toggle('is-name-playing',!reduced&&ready);
      if(reduced){portrait.style.transform='none';portrait.style.clipPath='none';light.style.opacity='0';return false;}
      if(!ready)return false;
      phase+=dt/1000;
      x+=(px-x)*(1-Math.exp(-dt/180));y+=(py-y)*(1-Math.exp(-dt/180));
      if(portraitVisible)reveal=Math.min(1,reveal+dt/1100);
      const eased=1-Math.pow(1-reveal,3);
      portrait.style.clipPath=eased>=1?'none':`circle(${eased*76}% at 50% 50%)`;
      portrait.style.transform=`perspective(900px) rotateX(${-y*7+Math.sin(phase*.7)*1.5}deg) rotateY(${x*8+Math.cos(phase*.65)*2}deg) translateY(${Math.sin(phase*.9)*5}px) scale(${.96+eased*.04})`;
      light.style.background=`radial-gradient(ellipse at ${50+x*35}% ${45+y*35}%,#fff8,transparent 65%)`;
      light.style.opacity=String(.25+Math.sin(phase*.8)*.13);
      artist.querySelector('.artist-seal').style.rotate=`${12+Math.sin(phase*.8)*12}deg`;
      elapsed=(elapsed+dt)%5600;
      const draw=clamp(elapsed/1900),fill=clamp((elapsed-1900)/800),fade=clamp((elapsed-4800)/800);
      svg.style.setProperty('--name-dash',String(600*(1-draw)));
      svg.style.setProperty('--name-fill',String(fill));
      svg.style.setProperty('--name-stroke',String(1-fill));
      svg.style.opacity=String(1-fade);
      artist.dataset.namePhase=elapsed<1900?'draw':elapsed<2700?'fill':elapsed<4800?'hold':'fade';
      return true;
    },signal,.1);
    const portraitObserver=new IntersectionObserver(entries=>{
      const visible=entries[0].isIntersecting;if(visible&&!portraitVisible)reveal=0;portraitVisible=visible;clock.request();
    },{threshold:.15});portraitObserver.observe(portrait);
    portrait.addEventListener('pointermove',event=>{const r=portrait.getBoundingClientRect();px=(event.clientX-r.left)/r.width*2-1;py=(event.clientY-r.top)/r.height*2-1;},{passive:true,signal});
    portrait.addEventListener('pointerleave',()=>{px=py=0;},{passive:true,signal});
    document.addEventListener('paca:language',sample,{signal});
    const resize=new ResizeObserver(sample);resize.observe(title);
    const theme=new MutationObserver(sample);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    document.fonts.ready.then(()=>{if(!signal.aborted)sample();});
    sample();
    return ()=>{resize.disconnect();theme.disconnect();title.classList.remove('is-name-playing');svg.remove();light.remove();portraitObserver.disconnect();portrait.style.transform='';portrait.style.clipPath='';live.replaceWith(...live.childNodes);delete artist.dataset.namePhase;};
  });
})();
