(() => {
 'use strict';
 window.PacaMotion.mount(signal=>{
  const M=window.PacaMotion,story=document.querySelector('.paca-story'),copy=story.querySelector('.paca-story-copy');
  const image=story.querySelector('.paca-story-image'),wordmark=story.querySelector('.footer-wordmark'),shade=story.querySelector('.paca-story-shade'),layers=[...wordmark.querySelectorAll('svg')];
  let progress=0,desired=0,phase=0,top=0,height=1,clock;
  function update(){desired=Math.max(0,Math.min(1,(innerHeight+scrollY-top)/(innerHeight+height)));clock?.request();}
  function measure(){top=story.getBoundingClientRect().top+scrollY;height=story.offsetHeight;update();}
  clock=M.section(story,(now,dt,reduced)=>{
   progress=reduced?desired:progress+(desired-progress)*(1-Math.exp(-dt/200));phase+=dt/1000;
   const left=1-progress;
   copy.style.transform=reduced?'none':`translateY(${left*26}px)`;
   image.style.transform=reduced?'none':`translateY(${(.5-progress)*60}px) rotate(${left*2}deg)`;
   wordmark.style.transform=reduced?'none':`translateY(${left*30}px)`;
   shade.style.opacity=String(reduced?0:.3*(1-Math.min(1,progress*2)));
   const fan=reduced?0:Math.min(1,progress*1.5)*(.94+Math.sin(phase*.8)*.06);
   layers.forEach((layer,index)=>{const back=5-index;layer.style.visibility=reduced&&index<5?'hidden':'visible';layer.style.transform=`translate(${back*-7*fan}px,${back*-13*fan}px) rotate(${back*-2.5*fan}deg) scale(${.88+back*.019*fan})`;});
   story.dataset.progress=progress.toFixed(3);return !reduced;
  },signal);
  addEventListener('scroll',update,{passive:true,signal});addEventListener('resize',measure,{passive:true,signal});
  const resize=new ResizeObserver(measure);resize.observe(story);measure();
  return ()=>{resize.disconnect();for(const node of [copy,image,wordmark,...layers])node.style.transform='';shade.style.opacity='';};
 });
})();
