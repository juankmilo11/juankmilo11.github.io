(() => {
  'use strict';
  window.PacaMotion.mount(signal=>{
    const M=window.PacaMotion,I=window.PacaI18n,section=document.querySelector('#servicios'),stage=section.querySelector('.service-list');
    const slides=[...stage.querySelectorAll('.service')];
    const controls=document.createElement('div');controls.className='poster-controls';
    const previous=document.createElement('button'),next=document.createElement('button'),dots=document.createElement('div'),status=document.createElement('p');
    previous.type=next.type='button';dots.className='poster-dots';dots.setAttribute('role','group');
    status.className='sr-only';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const buttons=slides.map((slide,index)=>{
      const button=document.createElement('button');button.type='button';button.addEventListener('click',()=>go(index),{signal});dots.append(button);
      slide.open=true;slide.querySelector('summary').tabIndex=-1;
      slide.querySelector('summary').addEventListener('click',event=>event.preventDefault(),{signal});
      return button;
    });
    controls.append(previous,dots,next);stage.after(controls,status);section.classList.add('has-posters');
    let active=0,motion=null,clock,drag=null,measuring=false;
    const ease=value=>{
      // Invert x(t) for cubic-bezier(.86,0,.07,1).
      let lo=0,hi=1,t=value;
      for(let i=0;i<14;i++){t=(lo+hi)/2;const x=3*(1-t)*(1-t)*t*.86+3*(1-t)*t*t*.07+t*t*t;if(x<value)lo=t;else hi=t;}
      return 3*(1-t)*t*t+t*t*t;
    };
    function sync(){
      slides.forEach((slide,index)=>{slide.inert=index!==active||!!motion;slide.setAttribute('aria-hidden',String(index!==active));buttons[index].setAttribute('aria-current',String(index===active));buttons[index].setAttribute('aria-label',I.t('serviceGo',{index:index+1,title:slide.querySelector('h3').textContent}));});
      previous.textContent=I.t('servicePrevious');next.textContent=I.t('serviceNext');dots.setAttribute('aria-label',I.t('serviceChoose'));
      status.textContent=I.t('serviceCurrent',{index:active+1,total:slides.length,title:slides[active].querySelector('h3').textContent});
      section.dataset.serviceIndex=String(active);
    }
    function settle(){
      slides.forEach((slide,index)=>{slide.inert=index!==active;slide.style.transform='';slide.classList.toggle('is-active',index===active);slide.classList.remove('is-outgoing');});
      motion=null;section.dataset.transitioning='false';
    }
    function go(index){
      index=(index+slides.length)%slides.length;
      if(index===active)return;
      const direction=(index===((active+1)%slides.length))?1:-1;
      // An interrupted transition deliberately settles its target first.
      settle();const outgoing=active;active=index;sync();
      if(M.reduced.matches){settle();measure();return;}
      motion={outgoing,incoming:index,direction,elapsed:0};section.dataset.transitioning='true';
      slides[outgoing].classList.remove('is-active');slides[outgoing].classList.add('is-outgoing');slides[index].classList.add('is-active');
      slides[index].inert=true;slides[index].style.transform=`translateY(${direction*100}%) scale(.85)`;clock.request();
    }
    function measure(){
      if(measuring)return;measuring=true;
      slides.forEach(slide=>{slide.style.minHeight='';});
      const height=Math.ceil(Math.max(...slides.map(slide=>slide.scrollHeight)));
      if(height>0&&stage.style.height!==height+'px')stage.style.height=height+'px';
      if(height>0)slides.forEach(slide=>{slide.style.minHeight=height+'px';});
      measuring=false;
    }
    clock=M.section(section,(now,dt,reduced)=>{
      if(reduced){settle();return false;}
      if(!motion)return false;
      const m=motion;m.elapsed+=dt;
      const a=ease(Math.min(1,m.elapsed/600)),b=ease(Math.max(0,Math.min(1,(m.elapsed-600)/600))),c=ease(Math.max(0,Math.min(1,(m.elapsed-1200)/600)));
      slides[m.outgoing].style.transform=`translateY(${-m.direction*b*100}%) scale(${1-a*.15})`;
      slides[m.incoming].style.transform=`translateY(${m.direction*(1-b)*100}%) scale(${.85+c*.15})`;
      if(m.elapsed>=1800){settle();return false;}return true;
    },signal);
    previous.addEventListener('click',()=>go(active-1),{signal});next.addEventListener('click',()=>go(active+1),{signal});
    section.addEventListener('keydown',event=>{if(event.target.matches('input,textarea,select'))return;if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();go(active+(event.key==='ArrowRight'?1:-1));}},{signal});
    stage.addEventListener('pointerdown',event=>{if(!event.target.closest('button,a'))drag={x:event.clientX,y:event.clientY,id:event.pointerId};},{passive:true,signal});
    stage.addEventListener('pointerup',event=>{if(drag?.id===event.pointerId){const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))go(active+(dx<0?1:-1));drag=null;}},{passive:true,signal});
    stage.addEventListener('pointercancel',()=>{drag=null;},{passive:true,signal});
    document.addEventListener('paca:language',()=>{sync();measure();},{signal});
    const resize=new ResizeObserver(measure);slides.forEach(slide=>resize.observe(slide));
    document.fonts.ready.then(()=>{if(!signal.aborted)measure();});
    sync();settle();measure();
    return ()=>{resize.disconnect();controls.remove();status.remove();section.classList.remove('has-posters');stage.style.height='';slides.forEach(slide=>{slide.open=false;slide.inert=false;slide.removeAttribute('aria-hidden');slide.classList.remove('is-active','is-outgoing');slide.style.transform='';slide.style.minHeight='';slide.querySelector('summary').removeAttribute('tabindex');});};
  });
})();
