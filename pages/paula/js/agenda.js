(() => {
  'use strict';
  window.createPacaAgenda = (container, form, details) => {
    const S=window.PacaSchedule,I=window.PacaI18n,t=I.t;
    const date=form.elements.namedItem('date'),time=form.elements.namedItem('time');
    const month=container.querySelector('#agenda-month'),days=container.querySelector('.calendar-days'),weekdays=container.querySelector('.calendar-weekdays'),times=container.querySelector('.time-slots'),status=container.querySelector('#agenda-status');
    const previous=container.querySelector('#agenda-previous'),next=container.querySelector('#agenda-next'),retry=container.querySelector('#agenda-retry');
    let config=null,cursor=S.studioNow().date.slice(0,7),request=0,pendingLoad=null;
    const locale=()=>I.language==='es'?'es-CO':'en-US';
    const formatDate=value=>new Intl.DateTimeFormat(locale(),{timeZone:'UTC',dateStyle:'full'}).format(new Date(`${value}T12:00:00Z`));
    const labelTime=value=>new Intl.DateTimeFormat(locale(),{timeZone:'UTC',hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(`2000-01-01T${value}:00Z`));
    const changed=()=>form.dispatchEvent(new Event('input',{bubbles:true}));
    function renderTimes() {
      times.replaceChildren();
      const apply=document.getElementById('calendar-apply');
      if(apply)apply.disabled=true;
      if(!config){status.textContent=t('agendaLoading');return;}
      if(!date.value){status.textContent=t('agendaPickDate');return;}
      const list=S.slots(date.value,config,details());
      if(time.value&&!list.some(slot=>slot.available&&slot.time===time.value)){time.value='';changed();}
      if(apply)apply.disabled=!list.some(slot=>slot.available&&slot.time===time.value);
      status.textContent=!list.some(slot=>slot.available)?t('agendaNoTimes'):t(S.serviceDuration(config,details())?'agendaKnownDuration':'agendaVariableDuration',{date:formatDate(date.value),minutes:S.serviceDuration(config,details())});
      for(const slot of list){
        const button=document.createElement('button');button.type='button';button.className='time-slot';button.textContent=labelTime(slot.time);button.disabled=!slot.available;button.setAttribute('aria-pressed',String(slot.time===time.value));
        button.setAttribute('aria-label',`${formatDate(date.value)}, ${labelTime(slot.time)}${!slot.available?' · '+t('agendaBusy'):''}`);
        button.addEventListener('click',()=>{time.value=slot.time;renderTimes();times.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});changed();});times.append(button);
      }
    }
    function render() {
      const today=S.studioNow().date;
      month.textContent=new Intl.DateTimeFormat(locale(),{timeZone:'UTC',month:'long',year:'numeric'}).format(new Date(`${cursor}-01T12:00:00Z`));
      weekdays.replaceChildren();days.replaceChildren();
      for(let day=0;day<7;day++){
        const label=document.createElement('span');label.textContent=new Intl.DateTimeFormat(locale(),{timeZone:'UTC',weekday:'narrow'}).format(new Date(Date.UTC(2026,0,5+day,12)));weekdays.append(label);
      }
      previous.disabled=!config||cursor<=today.slice(0,7);
      next.disabled=!config||cursor>=S.addDays(today,config.horizonDays).slice(0,7);
      const start=new Date(`${cursor}-01T12:00:00Z`),offset=(start.getUTCDay()+6)%7,count=new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth()+1,0)).getUTCDate();
      for(let i=0;i<offset;i++){const blank=document.createElement('span');blank.setAttribute('aria-hidden','true');days.append(blank);}
      for(let day=1;day<=count;day++){
        const value=`${cursor}-${String(day).padStart(2,'0')}`,button=document.createElement('button');button.type='button';button.textContent=String(day);button.disabled=!config||!S.dayOpen(value,config);button.setAttribute('aria-label',formatDate(value));button.setAttribute('aria-pressed',String(date.value===value));
        if(value===today)button.setAttribute('aria-current','date');
        button.addEventListener('click',()=>{date.value=value;time.value='';render();days.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});changed();});days.append(button);
      }
      renderTimes();
    }
    function move(delta){const day=new Date(`${cursor}-01T12:00:00Z`);day.setUTCMonth(day.getUTCMonth()+delta);cursor=day.toISOString().slice(0,7);render();}
    previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
    async function load(){
      const token=++request;retry.hidden=true;container.setAttribute('aria-busy','true');
      config=null;render();
      pendingLoad?.abort();
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
      pendingLoad=controller;
      try{
        const data=S.validateConfig(await window.ProjectAPI.availability({signal:controller.signal}));if(token!==request)return;config=data;render();document.dispatchEvent(new CustomEvent('paca:availability',{detail:{config:data}}));
      }catch(_){if(token!==request)return;config=null;date.value='';time.value='';render();status.textContent=t('agendaError');retry.hidden=false;}
      finally{clearTimeout(timeout);if(token===request){pendingLoad=null;container.setAttribute('aria-busy','false');}}
    }
    retry.addEventListener('click',load);
    document.addEventListener('paca:language',()=>{render();if(!config&&request&&!pendingLoad){status.textContent=t('agendaError');retry.hidden=false;}});
    form.addEventListener('change',event=>{if(['service','nailType','removal'].includes(event.target.name)){time.value='';renderTimes();}});
    // Recheck the clock on tab return so elapsed times cannot be requested.
    const active=()=>!document.hidden&&(container.closest('dialog')?.open??true);
    document.addEventListener('visibilitychange',()=>{if(active())load();});
    document.addEventListener('paca:calendar-open',load);
    const timer=setInterval(()=>{if(active())renderTimes();},60000);
    addEventListener('pagehide',()=>clearInterval(timer),{once:true});
    render();if(!container.closest('dialog'))load();
    return {
      refresh:render,
      recheck:load,
      valid:()=>Boolean(config&&S.slots(date.value,config,details()).some(slot=>slot.available&&slot.time===time.value)),
      duration:()=>config?S.serviceDuration(config,details()):null,
      focus:()=>container.querySelector('.calendar-days button:not(:disabled)')?.focus(),
      clear:()=>{date.value='';time.value='';cursor=S.studioNow().date.slice(0,7);render();}
    };
  };
})();
