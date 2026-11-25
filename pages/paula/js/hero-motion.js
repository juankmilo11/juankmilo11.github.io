(() => {
  'use strict';
  window.PacaMotion.mount(signal => {
    const M=window.PacaMotion,hero=document.querySelector('#inicio'),scene=hero.querySelector('.hero-scene');
    const photo=hero.querySelector('.hero-photo'),textPath=hero.querySelector('textPath');
    let top=0,range=1,p=0,desired=0,clock;
    function measure(){top=hero.getBoundingClientRect().top+scrollY;range=Math.max(1,hero.offsetHeight-scene.offsetHeight);update();}
    function update(){desired=Math.max(0,Math.min(1,(scrollY-top)/range));clock?.request();}
    clock=M.section(hero,(now,dt,reduced)=>{
      p=reduced?desired:p+(desired-p)*(1-Math.exp(-Math.min(.1,dt/1000)/.14));
      if(Math.abs(p-desired)<.0001)p=desired;
      textPath.setAttribute('startOffset',`${28-22*p}%`);
      photo.style.transform=`translateY(${-18*p}px) scale(${1.12-.08*p})`;
      hero.dataset.progress=p.toFixed(5);return Math.abs(p-desired)>.0001;
    },signal);
    addEventListener('scroll',update,{passive:true,signal});addEventListener('resize',measure,{passive:true,signal});
    document.fonts.ready.then(()=>{if(!signal.aborted)measure();});
    const resize=new ResizeObserver(measure);resize.observe(scene);measure();
    return ()=>{resize.disconnect();photo.style.transform='';delete hero.dataset.progress;};
  });
})();
