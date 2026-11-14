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
    return [t('hello'),'',`${t('summaryName')}: ${data.name.trim()}`,`${t('summaryContact')}: ${data.contact.trim()}`,`${t('summaryService')}: ${title}`,`${t('summaryDate')}: ${formatted}`,`${t('summaryPeriod')}: ${t(PERIODS[data.period])}`,...(data.message.trim()?[`${t('summaryIdea')}: ${data.message.trim()}`]:[]),'',t('pending')].join('\n');
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
    const controls=Object.fromEntries(['name','contact','service','date','period','message','consent'].map(name=>[name,form.elements.namedItem(name)]));
    if(!Object.values(controls).every(Boolean))return;
    const serviceIds=new Set([...controls.service.options].map(option=>option.value).filter(Boolean));
    ['name','contact','service','date','period','consent'].forEach(name=>{controls[name].required=true;});
    controls.name.maxLength=80;controls.contact.maxLength=120;controls.message.maxLength=700;controls.date.min=studioToday();
    instagram.href=INSTAGRAM;instagram.target='_blank';instagram.rel='noopener noreferrer';
    // Run our localized validation before showing browser validity messages.
    form.noValidate=true;
    let currentSummary='',copied=false,automaticReference='',selectedReference=null,statusKey='';
    const announce=key=>{statusKey=key;status.textContent=key?t(key):'';};
    const values=()=>Object.fromEntries(Object.entries(controls).map(([name,control])=>[name,control.value]));
    function refreshSummary(){currentSummary=makeSummary(values(),t(controls.service.value),I.language);summary.textContent=currentSummary;}
    function resetReview({focus=false}={}){
      review.hidden=true;fields.hidden=false;currentSummary='';summary.textContent='';copied=false;copy.textContent=t('copy');announce('');
      if(focus)controls.name.focus({preventScroll:true});
    }
    function validate(){
      const today=studioToday();controls.date.min=today;
      Object.values(controls).forEach(control=>control.setCustomValidity(''));
      if(controls.name.value.trim().length<2||controls.name.value.length>80)controls.name.setCustomValidity(t('invalidName'));
      if(!validContact(controls.contact.value)||controls.contact.value.length>120)controls.contact.setCustomValidity(t('invalidContact'));
      if(!serviceIds.has(controls.service.value))controls.service.setCustomValidity(t('invalidService'));
      if(!validDate(controls.date.value,today))controls.date.setCustomValidity(t('invalidDate'));
      if(!PERIODS[controls.period.value])controls.period.setCustomValidity(t('invalidPeriod'));
      if(controls.message.value.length>700)controls.message.setCustomValidity(t('invalidMessage'));
      if(!controls.consent.checked)controls.consent.setCustomValidity(t('invalidConsent'));
      return form.reportValidity();
    }
    form.addEventListener('submit',event=>{
      event.preventDefault();if(!validate())return;
      refreshSummary();fields.hidden=true;review.hidden=false;announce('prepared');
      document.getElementById('booking-review-title')?.focus({preventScroll:true});review.scrollIntoView({behavior:'auto',block:'start'});
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
      copied=ok;copy.textContent=t(ok?'copied':'copyRetry');announce(ok?'copySuccess':'copyFailure');
    });
    instagram.addEventListener('click',()=>announce(copied?'instagramCopied':'instagramUncopied'));
    document.addEventListener('paca:book',event=>{
      resetReview();const id=event.detail?.service;
      if(serviceIds.has(id)){controls.service.value=id;controls.service.setCustomValidity('');}
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
      if(currentSummary){refreshSummary();copied=false;copy.textContent=t('copy');announce('prepared');}
      else {copy.textContent=t('copy');if(statusKey)announce(statusKey);}
    });
    form.addEventListener('reset',()=>{resetReview();automaticReference='';selectedReference=null;Object.values(controls).forEach(control=>control.setCustomValidity(''));controls.date.min=studioToday();});
    form.dataset.bookingReady='true';document.getElementById('booking-submit').disabled=false;
    return {reset:resetReview};
  }
  return {initPacaBooking,studioToday,validDate,validContact,makeSummary,withCatalogReference};
});
