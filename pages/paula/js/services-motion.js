(() => {
  'use strict';
  const M=window.PacaMotion;
  M.mount(signal=>{
    const section=document.querySelector('#servicios');
    const fan=document.createElement('div');fan.className='services-fan';fan.setAttribute('aria-hidden','true');
    const colors=['#f1b4bd','#e8a4b2','#dc90a3','#cd7e96','#bc6e88','var(--ink)'];
    const ns='http://www.w3.org/2000/svg';
    const layers=colors.map(color=>{
      const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1000 380');svg.setAttribute('focusable','false');
      const text=document.createElementNS(ns,'text');text.setAttribute('x','500');text.setAttribute('y','320');text.setAttribute('text-anchor','middle');text.setAttribute('fill',color);text.textContent='PACA';
      svg.append(text);fan.append(svg);return svg;
    });
    section.querySelector('.section-heading').after(fan);
    let progress=0,initialized=false;
    const clamp=value=>Math.max(0,Math.min(1,value));
    const clock=M.section(fan,(now,dt,reduced)=>{
      const box=fan.getBoundingClientRect();
      const target=reduced?1:clamp((innerHeight*.88-box.top)/(innerHeight*.74+box.height*.2));
      if(!initialized||reduced){progress=target;initialized=true;}
      else progress+=(target-progress)*(1-Math.exp(-dt/85));
      layers.forEach((layer,index)=>{
        const back=5-index;
        layer.style.transform=reduced?'none':`translate(${back*-7*progress}px,${back*-13*progress}px) rotate(${back*-2.5*progress}deg) scale(${.88+back*.019*progress})`;
        layer.style.visibility=reduced&&index<5?'hidden':'visible';
      });
      fan.dataset.progress=progress.toFixed(3);
      return Math.abs(progress-target)>.0005;
    },signal);
    addEventListener('scroll',clock.request,{passive:true,signal});
    addEventListener('resize',clock.request,{passive:true,signal});
    return ()=>fan.remove();
  });
})();
