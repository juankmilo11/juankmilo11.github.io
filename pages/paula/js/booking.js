(function(root,factory){
  const api=factory(root?root.PacaLocales:require('./locales.js'));
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.initPacaBooking=api.initPacaBooking;
})(typeof window!=='undefined'?window:null,function(locales){
  'use strict';
  const INSTAGRAM='https://www.instagram.com/paulaadaniiela/';
  const PERIODS={morning:'morning',afternoon:'afternoon',flexible:'flexible',manana:'morning',tarde:'afternoon'};
  const translate=(key,language='en',values={})=>locales[language][key].replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??''));
  function studioToday(now=new Date()){
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const value=type=>parts.find(part=>part.type===type).value;
    return `${value('year')}-${value('month')}-${value('day')}`;
  }
  function validDate(value,minimum=studioToday()){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
    const date=new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value&&value>=minimum;
  }
  function validContact(value){
    const contact=value.trim();
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact))return true;
    if(/^@[A-Za-z0-9._]{1,30}$/.test(contact))return true;
    return /^[+\d\s().-]+$/.test(contact)&&contact.replace(/\D/g,'').length>=7&&contact.replace(/\D/g,'').length<=15;
  }
  function makeSummary(data,title,language='en'){
    const t=key=>translate(key,language);
    const formatted=new Intl.DateTimeFormat(language==='es'?'es-CO':'en-US',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${data.date}T12:00:00Z`));
    return [t('hello'),'',`${t('summaryName')}: ${data.name.trim()}`,`${t('summaryContact')}: ${data.contact.trim()}`,`${t('summaryService')}: ${title}`,`${t('summaryDate')}: ${formatted}`,...(data.time?[`${t('summaryTime')}: ${data.time} · New Jersey (America/New_York)`]:[`${t('summaryPeriod')}: ${t(PERIODS[data.period])}`]),
      ...(data.service==='nails'?[`${t('summaryNailType')}: ${t('nail.'+data.nailType)}`,`${t('summaryRemoval')}: ${t('removal.'+data.removal)}`,...(data.removalConsent?[t('summaryRemovalConsent')]:[])]:[]),
      ...(data.duration?[`${t('summaryDuration')}: ${data.duration} min`]:[]),
      ...(data.punctuality&&data.cancellation&&data.policy?[t('summaryPolicy')]:[]),
      ...(data.currentPhoto?[`${t('summaryCurrentPhoto')}: ${data.currentPhoto}`]:[]),
      ...(data.inspirationPhoto?[`${t('summaryInspirationPhoto')}: ${data.inspirationPhoto}`]:[]),
      ...(data.currentPhoto||data.inspirationPhoto?[t('summaryAttachPhotos')]:[]),...(data.message.trim()?[`${t('summaryIdea')}: ${data.message.trim()}`]:[]),'',t('pending')].join('\n');
  }
  function withCatalogReference(message,reference,previousAutomatic='',language='en'){
    if(typeof reference!=='string'||!reference.trim())return {message,automatic:previousAutomatic,added:false};
    let text=message;
    if(previousAutomatic){
      const at=text.indexOf(previousAutomatic),end=at+previousAutomatic.length;
      if(at>=0&&(at===0||text[at-1]==='\n')&&(end===text.length||text[end]==='\n')){
        let start=at;
        if(text.slice(Math.max(0,at-2),at)==='\n\n')start-=2;
        else if(at>0&&text[at-1]==='\n')start-=1;
        text=text.slice(0,start)+text.slice(end);
      }
    }
    const line=translate('reference',language,{title:reference.trim().replace(/\s+/g,' ')});
    if(text.includes(line))return {message:text,automatic:'',added:false};
    const separator=text.length?'\n\n':'';
    if(text.length+separator.length+line.length>700)return {message:text,automatic:'',added:false};
    return {message:text+separator+line,automatic:line,added:true};
  }
  function initPacaBooking(){
    const form=document.getElementById('booking-form');if(!form||form.dataset.bookingReady)return;
    const fields=document.getElementById('booking-fields'),review=document.getElementById('booking-review'),summary=document.getElementById('booking-summary'),copy=document.getElementById('booking-copy'),edit=document.getElementById('booking-edit'),instagram=document.getElementById('booking-instagram'),status=document.getElementById('booking-status');
    if(![fields,review,summary,copy,edit,instagram,status].every(Boolean))return;
    const I=window.PacaI18n,t=I.t;
    const copyLabel=key=>window.PacaIcons.label(copy,t(key),'arrow-up-right');
    const controls=Object.fromEntries(['name','contact','service','date','time','nailType','removal','removalConsent','punctuality','cancellation','policy','currentPhoto','inspirationPhoto','message','consent'].map(name=>[name,form.elements.namedItem(name)]));
    if(!Object.values(controls).every(Boolean))return;
    const serviceIds=new Set([...controls.service.options].map(option=>option.value).filter(Boolean));
    ['name','contact','service','punctuality','cancellation','policy','consent'].forEach(name=>{controls[name].required=true;});
    controls.name.maxLength=80;controls.contact.maxLength=120;controls.message.maxLength=700;
    instagram.href=INSTAGRAM;instagram.target='_blank';instagram.rel='noopener noreferrer';
    // Run our localized validation before showing browser validity messages.
    form.noValidate=true;
    let currentSummary='',copied=false,automaticReference='',selectedReference=null,statusKey='';
    const announce=key=>{statusKey=key;status.textContent=key?t(key):'';};
    const details=()=>({service:controls.service.value,nailType:controls.nailType.value,removal:controls.removal.value});
    const agenda=window.createPacaAgenda(document.getElementById('booking-agenda'),form,details);
    const values=()=>({...Object.fromEntries(Object.entries(controls).map(([name,control])=>[name,control.type==='checkbox'?control.checked:control.value])),duration:agenda.duration(),currentPhoto:controls.currentPhoto.files?.[0]?.name||'',inspirationPhoto:controls.inspirationPhoto.files?.[0]?.name||''});
    function syncNails(){
      const nails=controls.service.value==='nails';document.getElementById('nail-plan').hidden=!nails;
      controls.nailType.required=nails;controls.removal.required=nails;
      if(controls.nailType.value==='removalOnly'){controls.removal.value='yes';controls.removal.disabled=true;}else controls.removal.disabled=false;
      const extra=nails&&['yes','unsure'].includes(controls.removal.value);
      document.getElementById('removal-ack').hidden=!extra;controls.removalConsent.required=extra;
      if(!extra)controls.removalConsent.checked=false;
    }
    form.addEventListener('change',event=>{if(['service','nailType','removal'].includes(event.target.name))syncNails();});
    const previews=new Map();
    for(const [name,id] of [['currentPhoto','current-photo-preview'],['inspirationPhoto','inspiration-photo-preview']]){
      const input=controls[name],preview=document.getElementById(id);
      input.addEventListener('change',()=>{
        if(previews.has(name)){URL.revokeObjectURL(previews.get(name));previews.delete(name);}
        preview.hidden=true;preview.removeAttribute('src');input.setCustomValidity('');
        const file=input.files?.[0];if(!file)return;
        if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){input.setCustomValidity(t('invalidPhoto'));input.reportValidity();return;}
        const url=URL.createObjectURL(file);previews.set(name,url);preview.src=url;preview.hidden=false;
      });
    }
    addEventListener('pagehide',()=>previews.forEach(url=>URL.revokeObjectURL(url)),{once:true});
    syncNails();
    function refreshSummary(){currentSummary=makeSummary(values(),t(controls.service.value),I.language);summary.textContent=currentSummary;}
    function resetReview({focus=false}={}){
      review.hidden=true;fields.hidden=false;currentSummary='';summary.textContent='';copied=false;copyLabel('copy');announce('');
      if(focus)controls.name.focus({preventScroll:true});
    }
    function validate(){
      const today=studioToday();
      Object.values(controls).forEach(control=>control.setCustomValidity(''));
      if(controls.name.value.trim().length<2||controls.name.value.length>80)controls.name.setCustomValidity(t('invalidName'));
      if(!validContact(controls.contact.value)||controls.contact.value.length>120)controls.contact.setCustomValidity(t('invalidContact'));
      if(!serviceIds.has(controls.service.value))controls.service.setCustomValidity(t('invalidService'));
      if(!validDate(controls.date.value,today)||!agenda.valid()){announce('invalidSlot');agenda.refresh();agenda.focus();return false;}
      if(controls.service.value==='nails'){
        if(!['fullSet','fill','removalOnly','nails'].includes(controls.nailType.value))controls.nailType.setCustomValidity(t('invalidNailType'));
        if(!['yes','no','unsure'].includes(controls.removal.value))controls.removal.setCustomValidity(t('invalidRemoval'));
        if(controls.removalConsent.required&&!controls.removalConsent.checked)controls.removalConsent.setCustomValidity(t('invalidRemovalConsent'));
      }
      for(const key of ['punctuality','cancellation','policy'])if(!controls[key].checked)controls[key].setCustomValidity(t('invalidPolicy'));
      for(const key of ['currentPhoto','inspirationPhoto']){const file=controls[key].files?.[0];if(file&&(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024))controls[key].setCustomValidity(t('invalidPhoto'));}
      if(controls.message.value.length>700)controls.message.setCustomValidity(t('invalidMessage'));
      if(!controls.consent.checked)controls.consent.setCustomValidity(t('invalidConsent'));
      return form.reportValidity();
    }
    form.addEventListener('submit',async event=>{
      event.preventDefault();const submit=document.getElementById('booking-submit');if(submit.disabled)return;
      submit.disabled=true;
      try{
        await agenda.recheck();if(!validate())return;
        refreshSummary();fields.hidden=true;review.hidden=false;announce('prepared');
        document.getElementById('booking-review-title')?.focus({preventScroll:true});review.scrollIntoView({behavior:'auto',block:'start'});
      }finally{submit.disabled=false;}
    });
    function changed(event){event.target.setCustomValidity?.('');if(currentSummary)resetReview();}
    form.addEventListener('input',changed);form.addEventListener('change',changed);
    edit.addEventListener('click',()=>resetReview({focus:true}));
    copy.addEventListener('click',async()=>{
      if(!currentSummary)return;const textToCopy=currentSummary;let ok=false;
      try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(textToCopy);ok=true;}}catch(_){/* Clipboard access may be denied in iframes. */}
      if(!ok){
        const buffer=document.createElement('textarea');buffer.value=textToCopy;buffer.style.cssText='position:fixed;left:-9999px;top:0';buffer.setAttribute('aria-hidden','true');document.body.appendChild(buffer);buffer.select();
        try{ok=document.execCommand('copy');}catch(_){}buffer.remove();copy.focus({preventScroll:true});
      }
      if(currentSummary!==textToCopy)return;
      copied=ok;copyLabel(ok?'copied':'copyRetry');announce(ok?'copySuccess':'copyFailure');
    });
    instagram.addEventListener('click',()=>announce(copied?'instagramCopied':'instagramUncopied'));
    document.addEventListener('paca:book',event=>{
      resetReview();const id=event.detail?.service;
      if(serviceIds.has(id)){controls.service.value=id;controls.service.setCustomValidity('');syncNails();agenda.refresh();}
      const reference=event.detail?.reference;
      if(reference){
        selectedReference=typeof reference==='string'?{en:reference,es:reference}:reference;
        const result=withCatalogReference(controls.message.value,selectedReference[I.language],automaticReference,I.language);
        controls.message.value=result.message;automaticReference=result.automatic;announce(result.added?'referenceAdded':'referencePreserved');
      }
      (document.getElementById('agendar')||form).scrollIntoView({behavior:'auto',block:'start'});controls.name.focus({preventScroll:true});
    });
    document.addEventListener('paca:language',()=>{
      Object.values(controls).forEach(control=>control.setCustomValidity(''));
      // Translate only the exact reference line inserted by the catalog.
      // User-written text, including any edits to that line, stays intact.
      if(selectedReference&&automaticReference&&controls.message.value.split('\n').includes(automaticReference)){
        const result=withCatalogReference(controls.message.value,selectedReference[I.language],automaticReference,I.language);
        controls.message.value=result.message;automaticReference=result.automatic;
      }
      if(currentSummary){refreshSummary();copied=false;copyLabel('copy');announce('prepared');}
      else {copyLabel('copy');if(statusKey)announce(statusKey);}
    });
    form.addEventListener('reset',()=>{
      resetReview();automaticReference='';selectedReference=null;
      Object.values(controls).forEach(control=>control.setCustomValidity(''));
      queueMicrotask(()=>{
        agenda.clear();syncNails();
        previews.forEach(url=>URL.revokeObjectURL(url));previews.clear();
        document.querySelectorAll('.reference-preview').forEach(img=>{img.hidden=true;img.removeAttribute('src');});
      });
    });
    form.dataset.bookingReady='true';document.getElementById('booking-submit').disabled=false;
    return {reset:resetReview};
  }
  return {initPacaBooking,studioToday,validDate,validContact,makeSummary,withCatalogReference};
});
