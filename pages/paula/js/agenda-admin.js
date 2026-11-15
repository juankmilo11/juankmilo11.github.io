(() => {
  'use strict';
  const S=window.PacaSchedule,$=id=>document.getElementById(id),status=$('admin-status');
  let config=null,dirty=false;
  const announce=text=>{status.textContent=text;};
  const labels={fullSet:'Set completo',fill:'Relleno',removalOnly:'Solo retiro',nails:'Uñas / asesoría',tattoo:'Tatuajes',pmu:'PMU',beauty:'Maquillaje',consultation:'Asesoría',removalMinutes:'Tiempo adicional de retiro'};
  function render(){
    $('busy-list').replaceChildren();$('duration-fields').replaceChildren();
    document.querySelectorAll('button[type=submit],#download-agenda').forEach(button=>{button.disabled=!config;});
    if(!config)return;
    const entries=[...config.blocked.map((item,index)=>({label:`${item.date} · ${item.start} – ${item.end}`,remove:()=>config.blocked.splice(index,1)})),...config.closedDates.map((date,index)=>({label:`${date} · Día cerrado`,remove:()=>config.closedDates.splice(index,1)}))];
    if(!entries.length){const row=document.createElement('li');row.textContent='No hay espacios bloqueados en este archivo.';$('busy-list').append(row);}
    for(const entry of entries){const row=document.createElement('li'),text=document.createElement('span'),button=document.createElement('button');text.textContent=entry.label;button.type='button';button.textContent='Quitar';button.setAttribute('aria-label',`Quitar ${entry.label}`);button.addEventListener('click',()=>{if(!applyDurations())return;entry.remove();dirty=true;render();announce('Borrador modificado. Descarga y publica el archivo para aplicar los cambios.');});row.append(text,button);$('busy-list').append(row);}
    for(const [key,label] of Object.entries(labels)){const field=document.createElement('label'),input=document.createElement('input');field.append(document.createTextNode(label));input.name=key;input.type='number';input.min='1';input.max='720';input.step='1';input.placeholder='Por confirmar';input.value=(key==='removalMinutes'?config.removalMinutes:config.durationMinutes[key])??'';field.append(input);$('duration-fields').append(field);}
  }
  async function load(){
    if(dirty&&!confirm('Se reemplazará el borrador sin publicar. ¿Quieres continuar?'))return;
    try{const response=await fetch('assets/availability.json',{cache:'no-store'});if(!response.ok)throw new Error();config=S.validateConfig(await response.json());dirty=false;render();announce('Agenda publicada cargada. Horario: lunes a viernes, de 7:00 a. m. a 7:00 p. m., New Jersey.');}
    catch(_){announce('No se pudo cargar la agenda. Importa availability.json o vuelve a intentarlo.');}
  }
  $('load-published').addEventListener('click',load);
  $('import-agenda').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>1024*1024)throw new Error();const imported=S.validateConfig(JSON.parse(await file.text()));if(dirty&&!confirm('¿Reemplazar el borrador actual por este archivo?'))return;config=imported;dirty=true;render();announce('Archivo importado al borrador. Aún no está publicado.');}catch(_){announce('Archivo de agenda inválido. No se modificó el borrador.');}
  });
  $('busy-form').addEventListener('submit',event=>{
    event.preventDefault();if(!applyDurations())return;const fields=event.target.elements,date=fields.namedItem('date').value,start=fields.namedItem('start').value,end=fields.namedItem('end').value;
    if(!S.validDate(date)||S.minutes(start)<420||S.minutes(end)>1140||S.minutes(end)<=S.minutes(start)){announce('Elige un intervalo válido entre las 7:00 a. m. y las 7:00 p. m.');return;}
    if(!config.blocked.some(item=>item.date===date&&item.start===start&&item.end===end))config.blocked.push({date,start,end});
    config.blocked.sort((a,b)=>`${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));dirty=true;render();announce('Espacio agregado al borrador. Descarga y publica la agenda para aplicarlo.');
  });
  $('closed-form').addEventListener('submit',event=>{event.preventDefault();if(!applyDurations())return;const date=event.target.elements.namedItem('date').value;if(!S.validDate(date))return;if(!config.closedDates.includes(date))config.closedDates.push(date);config.closedDates.sort();dirty=true;render();announce('Día cerrado en el borrador. Descarga y publica la agenda para aplicarlo.');});
  function applyDurations(){
    if(!config||!$('durations-form').reportValidity())return false;
    const draft=structuredClone(config);
    for(const key of Object.keys(labels)){const raw=$('durations-form').elements.namedItem(key).value,value=raw===''?null:Number(raw);if(key==='removalMinutes')draft.removalMinutes=value;else draft.durationMinutes[key]=value;}
    S.validateConfig(draft);config=draft;return true;
  }
  $('durations-form').addEventListener('input',()=>{dirty=true;});
  $('durations-form').addEventListener('submit',event=>{event.preventDefault();if(!applyDurations())return;dirty=true;announce('Duraciones aplicadas al borrador. Descarga y publica la agenda para aplicarlas.');});
  $('download-agenda').addEventListener('click',()=>{if(!applyDurations())return;config.updatedAt=S.studioNow().date;S.validateConfig(config);const url=URL.createObjectURL(new Blob([JSON.stringify(config,null,2)+'\n'],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='availability.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);dirty=false;announce('Archivo descargado. Publícalo como pages/paula/assets/availability.json para actualizar la web.');});
  addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  load();
})();
