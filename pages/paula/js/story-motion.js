(() => {
  'use strict';
  const M=window.PacaMotion;
  M.mount(signal=>{
    const story=document.querySelector('.paca-story'),copy=story.querySelector('.paca-story-copy');
    const image=story.querySelector('.paca-story-image'),wordmark=story.querySelector('.footer-wordmark'),shade=story.querySelector('.paca-story-shade');
    let progress=0,initialized=false;
    const clock=M.section(story,(now,dt,reduced)=>{
      const box=story.getBoundingClientRect();
      const target=reduced?1:Math.max(0,Math.min(1,(innerHeight-box.top)/(innerHeight+box.height)));
      if(!initialized||reduced){progress=target;initialized=true;}
      else progress+=(target-progress)*(1-Math.exp(-dt/200));
      const remaining=1-progress;
      copy.style.transform=reduced?'none':`translateY(${remaining*38}px) rotate(${remaining*-1.5}deg) scale(${.98+progress*.02})`;
      image.style.transform=reduced?'none':`translateY(${(.5-progress)*90}px) rotate(${remaining*4}deg) scale(${1.06-progress*.06})`;
      wordmark.style.transform=reduced?'none':`translateY(${remaining*55}px) rotate(${remaining*-1.5}deg) scale(${.94+progress*.06})`;
      shade.style.opacity=String(reduced?0:.42*(1-Math.min(1,progress*2)));
      story.dataset.progress=progress.toFixed(3);
      return Math.abs(progress-target)>.0004;
    },signal);
    addEventListener('scroll',clock.request,{passive:true,signal});
    addEventListener('resize',clock.request,{passive:true,signal});
    return ()=>{for(const layer of [copy,image,wordmark])layer.style.transform='';shade.style.opacity='';delete story.dataset.progress;};
  });
})();
