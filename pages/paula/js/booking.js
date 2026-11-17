(function(root,factory){
  const api=factory(root?root.PacaLocales:require('./locales.js'));
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.initPacaBooking=api.initPacaBooking;
})(typeof window!=='undefined'?window:null,function(locales){
  'use strict';
  const translate=(key,language='en',values={})=>locales[language][key].replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??''));
  const normalizeWhatsApp=value=>String(value??'').trim().replace(/[\s().-]/g,'');
  const validWhatsApp=value=>/^\+[1-9]\d{7,14}$/.test(normalizeWhatsApp(value));
  const nationalWhatsApp=value=>String(value??'').trim().replace(/[\s().-]/g,'');
  const validNationalWhatsApp=(value,countryCode)=>['+1','+57'].includes(countryCode)&&/^\d{10}$/.test(nationalWhatsApp(value));
  const composeWhatsApp=(value,countryCode)=>validNationalWhatsApp(value,countryCode)?countryCode+nationalWhatsApp(value):'';
  const validInstagram=value=>!String(value??'').trim()||/^@?[A-Za-z0-9_](?:[A-Za-z0-9._]{0,28}[A-Za-z0-9_])?$/.test(String(value).trim());
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
  function makeSummary(data,title,language='en'){
    const t=key=>translate(key,language);
    const formatted=new Intl.DateTimeFormat(language==='es'?'es-CO':'en-US',{timeZone:'UTC',dateStyle:'full'}).format(new Date(`${data.date}T12:00:00Z`));
    return [`${t('summaryName')}: ${data.name.trim()}`,`${t('summaryWhatsApp')}: ${normalizeWhatsApp(data.whatsapp)}`,
      ...(data.instagram?.trim()?[`Instagram: ${data.instagram.trim()}`]:[]),`${t('summaryService')}: ${title}`,`${t('summaryDate')}: ${formatted}`,`${t('summaryTime')}: ${data.time} · New Jersey (New York)`,
      ...(data.service==='nails'?[`${t('summaryNailType')}: ${t('nail.'+data.nailType)}`,`${t('summaryRemoval')}: ${t('removal.'+data.removal)}`]:[]),
      ...(data.duration?[`${t('summaryDuration')}: ${data.duration} min`]:[]),
      ...(data.estimate?[data.estimate]:[]),
      ...(data.service==='nails'&&data.removalConsent?[t('summaryRemovalConsent')]:[]),
      ...(data.punctuality&&data.cancellation&&data.policy?[t('summaryPolicy')]:[]),
      ...(data.currentPhoto?[`${t('summaryCurrentPhoto')}: ${data.currentPhoto}`]:[]),...(data.inspirationPhoto?[`${t('summaryInspirationPhoto')}: ${data.inspirationPhoto}`]:[]),
      ...(data.message.trim()?[`${t('summaryIdea')}: ${data.message.trim()}`]:[]),'',t('pending')].join('\n');
  }
  function withCatalogReference(message,reference,previousAutomatic='',language='en'){
    if(typeof reference!=='string'||!reference.trim())return {message,automatic:previousAutomatic,added:false};
    let text=message;
    if(previousAutomatic){
      const at=text.indexOf(previousAutomatic),end=at+previousAutomatic.length;
      if(at>=0&&(at===0||text[at-1]==='\n')&&(end===text.length||text[end]==='\n')){
        let start=at;if(text.slice(Math.max(0,at-2),at)==='\n\n')start-=2;else if(at>0&&text[at-1]==='\n')start-=1;
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
    const $=id=>document.getElementById(id),I=window.PacaI18n,t=I.t;
    const fields=$('booking-fields'),review=$('booking-review'),summary=$('booking-summary'),send=$('booking-send'),edit=$('booking-edit'),status=$('booking-status'),success=$('booking-success');
    const names=['name','countryCode','whatsapp','instagram','service','date','time','nailType','removal','removalConsent','punctuality','cancellation','policy','currentPhoto','inspirationPhoto','message','consent'];
    const controls=Object.fromEntries(names.map(name=>[name,form.elements.namedItem(name)]));
    if(![fields,review,summary,send,edit,status,success,...Object.values(controls)].every(Boolean))return;
    const serviceIds=new Set([...controls.service.options].map(option=>option.value).filter(Boolean));
    form.noValidate=true;
    let currentSummary='',automaticReference='',selectedReference=null,statusKey='',saving=false,savedReceipt=null,pendingPayload=null,idempotencyKey=null,requestSignature='';
    const announce=(key,values={})=>{statusKey=key;status.textContent=key?t(key,values):'';};
    const details=()=>({service:controls.service.value,nailType:controls.nailType.value,removal:controls.removal.value});
    const agenda=window.createPacaAgenda($('booking-agenda'),form,details);
    let estimateConfig=null;
    const estimate=()=>window.PacaSchedule.formatEstimate(estimateConfig,details(),I.language);
    function syncEstimate(){$('booking-estimate').textContent=estimate();$('booking-estimate').hidden=!estimate();}
    document.addEventListener('paca:availability',event=>{estimateConfig=event.detail.config;syncEstimate();});
    document.addEventListener('paca:language',syncEstimate);
    const values=()=>({...Object.fromEntries(Object.entries(controls).map(([name,control])=>[name,control.type==='checkbox'?control.checked:control.value])),whatsapp:composeWhatsApp(controls.whatsapp.value,controls.countryCode.value),duration:agenda.duration(),currentPhoto:controls.currentPhoto.files?.[0]?.name||'',inspirationPhoto:controls.inspirationPhoto.files?.[0]?.name||''});
    const calendar=$('calendar-dialog'),openCalendar=$('calendar-open');
    let calendarPrevious=null,calendarApplied=false;
    function syncSlot(){
      $('calendar-selection').textContent=controls.date.value&&controls.time.value?new Intl.DateTimeFormat(I.language==='es'?'es-CO':'en-US',{timeZone:'UTC',dateStyle:'full'}).format(new Date(`${controls.date.value}T12:00:00Z`))+` · ${controls.time.value} · New Jersey`:t('noSlot');
    }
    function showCalendar(){
      if(calendar.open)return;
      calendarPrevious={date:controls.date.value,time:controls.time.value};calendarApplied=false;
      calendar.showModal();calendar.scrollTop=0;
      document.dispatchEvent(new CustomEvent('paca:calendar-open'));
    }
    openCalendar.addEventListener('click',showCalendar);
    for(const id of ['calendar-window-close','calendar-cancel'])$(id).addEventListener('click',()=>calendar.close());
    calendar.addEventListener('cancel',event=>event.stopPropagation());
    calendar.addEventListener('close',()=>{
      if(!calendarApplied&&calendarPrevious){controls.date.value=calendarPrevious.date;controls.time.value=calendarPrevious.time;agenda.refresh();}
      syncSlot();openCalendar.focus({preventScroll:true});
    });
    $('calendar-apply').addEventListener('click',()=>{
      if(!agenda.valid()){agenda.focus();return;}
      calendarApplied=true;calendar.close();form.dispatchEvent(new Event('input',{bubbles:true}));syncSlot();
    });
    function syncNails(){
      const nails=controls.service.value==='nails';$('nail-plan').hidden=!nails;
      controls.nailType.required=nails;controls.removal.required=nails;
      if(controls.nailType.value==='removalOnly'){controls.removal.value='yes';controls.removal.disabled=true;}else controls.removal.disabled=false;
      const extra=nails&&['yes','unsure'].includes(controls.removal.value);
      $('removal-ack').hidden=!extra;controls.removalConsent.required=extra;
      if(!extra)controls.removalConsent.checked=false;
      syncEstimate();
    }
    form.addEventListener('change',event=>{if(['service','nailType','removal'].includes(event.target.name)){syncNails();syncSlot();}});
    const previews=new Map();
    for(const [name,id] of [['currentPhoto','current-photo-preview'],['inspirationPhoto','inspiration-photo-preview']]){
      const input=controls[name],preview=$(id);
      input.addEventListener('change',()=>{
        if(previews.has(name)){URL.revokeObjectURL(previews.get(name));previews.delete(name);}
        preview.hidden=true;preview.removeAttribute('src');input.setCustomValidity('');const file=input.files?.[0];if(!file)return;
        if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){input.setCustomValidity(t('invalidPhoto'));input.reportValidity();return;}
        const url=URL.createObjectURL(file);previews.set(name,url);preview.src=url;preview.hidden=false;
      });
    }
    addEventListener('pagehide',()=>previews.forEach(url=>URL.revokeObjectURL(url)),{once:true});
    function refreshSummary(){currentSummary=makeSummary({...values(),estimate:estimate()},t(controls.service.value),I.language);summary.textContent=currentSummary;}
    function resetReview({focus=false}={}){
      if(saving)return;
      review.hidden=true;fields.hidden=false;success.hidden=true;currentSummary='';summary.textContent='';announce('');
      if(focus)controls.name.focus();
    }
    function validate(){
      Object.values(controls).forEach(control=>control.setCustomValidity(''));
      if(controls.name.value.trim().length<2||controls.name.value.length>80)controls.name.setCustomValidity(t('invalidName'));
      if(!validNationalWhatsApp(controls.whatsapp.value,controls.countryCode.value))controls.whatsapp.setCustomValidity(t('invalidWhatsApp'));
      if(!validInstagram(controls.instagram.value))controls.instagram.setCustomValidity(t('invalidInstagram'));
      if(!serviceIds.has(controls.service.value))controls.service.setCustomValidity(t('invalidService'));
      if(controls.service.value==='nails'){
        if(!['fullSet','fill','removalOnly','nails'].includes(controls.nailType.value))controls.nailType.setCustomValidity(t('invalidNailType'));
        if(!['yes','no','unsure'].includes(controls.removal.value))controls.removal.setCustomValidity(t('invalidRemoval'));
        if(controls.removalConsent.required&&!controls.removalConsent.checked)controls.removalConsent.setCustomValidity(t('invalidRemovalConsent'));
      }
      for(const key of ['punctuality','cancellation','policy'])if(!controls[key].checked)controls[key].setCustomValidity(t('invalidPolicy'));
      for(const key of ['currentPhoto','inspirationPhoto']){const file=controls[key].files?.[0];if(file&&(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024))controls[key].setCustomValidity(t('invalidPhoto'));}
      if(!controls.inspirationPhoto.files?.length)controls.inspirationPhoto.setCustomValidity(t('inspirationRequired'));
      if(controls.message.value.length>700)controls.message.setCustomValidity(t('invalidMessage'));
      if(!controls.consent.checked)controls.consent.setCustomValidity(t('invalidConsent'));
      if(!form.reportValidity())return false;
      if(!validDate(controls.date.value)||!agenda.valid()){announce('invalidSlot');showCalendar();return false;}
      return true;
    }
    function requestPayload(){
      const data=values();delete data.currentPhoto;delete data.inspirationPhoto;delete data.duration;delete data.countryCode;
      data.whatsapp=normalizeWhatsApp(data.whatsapp);data.instagram=data.instagram.trim()?('@'+data.instagram.trim().replace(/^@/,'')):'';
      data.name=data.name.trim();data.message=data.message.trim();data.language=I.language;data.reference=selectedReference;
      if(data.service!=='nails'){data.nailType='';data.removal='';data.removalConsent=false;}
      return data;
    }
    form.addEventListener('submit',async event=>{
      event.preventDefault();const submit=$('booking-submit');if(submit.disabled||saving)return;submit.disabled=true;
      try{
        await agenda.recheck();if(!validate())return;
        const payload=requestPayload();
        const files=['currentPhoto','inspirationPhoto'].map(name=>{const file=controls[name].files?.[0];return file?{name:file.name,size:file.size,type:file.type,lastModified:file.lastModified}:null;});
        const serialized=JSON.stringify({payload,files});
        if(!pendingPayload||requestSignature!==serialized){pendingPayload=payload;requestSignature=serialized;idempotencyKey=crypto.randomUUID();}
        refreshSummary();fields.hidden=true;review.hidden=false;success.hidden=true;announce('prepared');
        $('booking-review-title').focus();review.scrollIntoView({behavior:'auto',block:'start'});
      }finally{submit.disabled=false;}
    });
    function changed(event){event.target.setCustomValidity?.('');if(currentSummary&&!saving)resetReview();}
    form.addEventListener('input',changed);form.addEventListener('change',changed);
    edit.addEventListener('click',()=>resetReview({focus:true}));
    function syncReceipt(){
      $('booking-receipt').textContent=savedReceipt?t('requestReceipt',{id:savedReceipt.id}):'';
    }
    send.addEventListener('click',async()=>{
      if(!pendingPayload||!idempotencyKey||saving)return;
      saving=true;send.disabled=true;edit.disabled=true;send.textContent=t('saving');announce('saving');
      try{
        const receipt=await window.ProjectAPI.createAppointment(pendingPayload,{idempotencyKey,files:{currentPhoto:controls.currentPhoto.files?.[0]||null,inspirationPhoto:controls.inspirationPhoto.files?.[0]||null}});
        if(!receipt||typeof receipt.id!=='string'||!receipt.id)throw new Error('Invalid receipt');
        savedReceipt=receipt;review.hidden=true;fields.hidden=true;success.hidden=false;syncReceipt();announce('saved');
        $('booking-success-title').focus();success.scrollIntoView({behavior:'auto',block:'start'});
      }catch(error){announce(error?.status===409?'slotConflict':'saveFailed');}
      finally{saving=false;send.disabled=false;edit.disabled=false;send.textContent=t('sendRequest');}
    });
    $('booking-exit').addEventListener('click',()=>$('booking-dialog').close());
    $('booking-dialog').addEventListener('close',()=>{
      if(!savedReceipt)return;
      savedReceipt=null;pendingPayload=null;idempotencyKey=null;requestSignature='';form.reset();
    });
    document.addEventListener('paca:book',event=>{
      if(saving)return;
      if(savedReceipt){success.hidden=false;fields.hidden=true;review.hidden=true;syncReceipt();return;}
      if(currentSummary&&pendingPayload&&!event.detail?.service&&!event.detail?.reference){review.hidden=false;fields.hidden=true;return;}
      resetReview();const id=event.detail?.service;
      if(serviceIds.has(id)){controls.service.value=id;controls.service.setCustomValidity('');syncNails();agenda.refresh();syncSlot();}
      const reference=event.detail?.reference;
      if(reference){
        selectedReference=typeof reference==='string'?{en:reference,es:reference}:reference;
        const result=withCatalogReference(controls.message.value,selectedReference[I.language],automaticReference,I.language);
        controls.message.value=result.message;automaticReference=result.automatic;announce(result.added?'referenceAdded':'referencePreserved');
      }
      controls.name.focus();
    });
    document.addEventListener('paca:language',()=>{
      Object.values(controls).forEach(control=>control.setCustomValidity(''));
      if(selectedReference&&automaticReference&&controls.message.value.split('\n').includes(automaticReference)){
        const result=withCatalogReference(controls.message.value,selectedReference[I.language],automaticReference,I.language);controls.message.value=result.message;automaticReference=result.automatic;
      }
      if(currentSummary)refreshSummary();
      send.textContent=t(saving?'saving':'sendRequest');syncSlot();syncReceipt();if(statusKey)announce(statusKey);
    });
    form.addEventListener('reset',()=>{
      resetReview();automaticReference='';selectedReference=null;pendingPayload=null;idempotencyKey=null;requestSignature='';
      Object.values(controls).forEach(control=>control.setCustomValidity(''));
      queueMicrotask(()=>{calendarPrevious=null;calendarApplied=false;agenda.clear();syncNails();syncSlot();previews.forEach(url=>URL.revokeObjectURL(url));previews.clear();document.querySelectorAll('.reference-preview').forEach(img=>{img.hidden=true;img.removeAttribute('src');});});
    });
    syncNails();syncSlot();form.dataset.bookingReady='true';$('booking-submit').disabled=false;
    return {reset:resetReview};
  }
  return {initPacaBooking,studioToday,validDate,validWhatsApp,validNationalWhatsApp,composeWhatsApp,validInstagram,normalizeWhatsApp,makeSummary,withCatalogReference};
});
