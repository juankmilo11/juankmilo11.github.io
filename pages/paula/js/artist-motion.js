(() => {
  'use strict';
  const M=window.PacaMotion,I=window.PacaI18n;
  M.mount(signal=>{
    const artist=document.querySelector('#paula'),title=document.querySelector('#artist-title');
    const live=document.createElement('span');live.className='artist-name-live';live.append(...title.childNodes);title.append(live);
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
    svg.classList.add('artist-name-drawing');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');title.append(svg);
    const controls=document.createElement('div');controls.className='artist-animation-controls';controls.setAttribute('role','group');
    const toggle=document.createElement('button'),replay=document.createElement('button');toggle.type=replay.type='button';
    controls.append(toggle,replay);title.after(controls);
    let elapsed=0,paused=false,clock,ready=false;
    const metric=document.createElement('canvas').getContext('2d');
    const clamp=value=>Math.max(0,Math.min(1,value));
    function labels(){
      controls.setAttribute('aria-label',I.t('artistAnimation'));toggle.textContent=I.t(paused?'animationPlay':'animationPause');
      toggle.setAttribute('aria-pressed',String(paused));replay.textContent=I.t('animationReplay');
    }
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
      controls.hidden=reduced;
      title.classList.toggle('is-name-playing',!reduced&&!paused&&ready);
      if(reduced||paused||!ready)return false;
      elapsed=(elapsed+dt)%5600;
      const draw=clamp(elapsed/1900),fill=clamp((elapsed-1900)/800),fade=clamp((elapsed-4800)/800);
      svg.style.setProperty('--name-dash',String(600*(1-draw)));
      svg.style.setProperty('--name-fill',String(fill));
      svg.style.setProperty('--name-stroke',String(1-fill));
      svg.style.opacity=String(1-fade);
      artist.dataset.namePhase=elapsed<1900?'draw':elapsed<2700?'fill':elapsed<4800?'hold':'fade';
      return true;
    },signal,.1);
    toggle.addEventListener('click',()=>{paused=!paused;labels();clock.request();},{signal});
    replay.addEventListener('click',()=>{elapsed=0;paused=false;labels();clock.request();},{signal});
    document.addEventListener('paca:language',()=>{labels();sample();},{signal});
    const resize=new ResizeObserver(sample);resize.observe(title);
    const theme=new MutationObserver(sample);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    document.fonts.ready.then(()=>{if(!signal.aborted)sample();});
    labels();sample();
    return ()=>{resize.disconnect();theme.disconnect();title.classList.remove('is-name-playing');svg.remove();controls.remove();live.replaceWith(...live.childNodes);delete artist.dataset.namePhase;};
  });
})();
