(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const request = (...args) => window.ProjectAPI.request(...args);
  const statusLabels = { pending: 'Pendiente', confirmed: 'Confirmada', completed: 'Completada', cancelled: 'Cancelada' };
  const serviceLabels = { nails: 'Uñas', tattoo: 'Tatuaje', pmu: 'Maquillaje permanente', beauty: 'Maquillaje', consultation: 'Asesoría' };
  const durationLabels = { fullSet: 'Set completo', fill: 'Relleno / mantenimiento', removalOnly: 'Solo retiro', nails: 'Uñas / asesoría', tattoo: 'Tatuaje', pmu: 'Maquillaje permanente', beauty: 'Maquillaje', consultation: 'Asesoría' };
  const removalLabels = { yes: 'Sí', no: 'No', unsure: 'Por confirmar con foto' };
  let token = null, expirationTimer = null, epoch = 0;
  let items = [], nextCursor = null, selected = null, schedule = null;
  let listRequest = 0, scheduleRequest = 0, refreshRequest = 0, photoURL = null;
  let activationToken = new URLSearchParams(location.hash.slice(1)).get('activate');
  if (activationToken) history.replaceState(null, '', location.pathname + location.search);

  function announce(selector, message = '', kind = '') {
    const target = $(selector);
    target.textContent = message;
    target.dataset.kind = kind;
  }
  function notifyParent(authenticated) {
    if (window.parent !== window) window.parent.postMessage({ type: 'admin:authenticated', authenticated }, location.origin);
  }
  function describe(error) {
    const messages = {
      invalid_credentials: 'La contraseña no es correcta.',
      setup_required: 'El acceso todavía no está activado. Usa el enlace privado de activación.',
      SETUP_REQUIRED: 'El acceso todavía no está activado. Usa el enlace privado de activación.',
      already_initialized: 'El acceso ya fue activado. Entra con tu contraseña.',
      invalid_activation: 'El enlace de activación no es válido o ya fue utilizado.',
      rate_limited: 'Se han hecho demasiados intentos. Espera unos minutos antes de volver a intentarlo.',
      conflict: 'La solicitud cambió en otra sesión. Actualiza la lista y vuelve a abrirla.',
      version_conflict: 'Otro administrador cambió este registro. Actualiza la lista y revisa los datos antes de guardarlos.',
      slot_unavailable: 'Ese horario ya está ocupado o no está disponible. Revisa la fecha, hora y duración.',
      not_configured: 'El servicio aún no está configurado. No se puede entrar ni modificar datos.',
      network_error: 'No hay conexión con el servicio. Puedes reintentar; no se ha confirmado el cambio.'
    };
    if (error?.name === 'AbortError') return 'La operación tardó demasiado. Comprueba la conexión y vuelve a intentarlo.';
    if (error?.status === 409) return messages[error.code] || messages.version_conflict;
    if (error?.status === 429) return messages.rate_limited;
    return messages[error?.code] || error?.message || 'No se pudo completar la operación. Vuelve a intentarlo.';
  }
  function clearPhoto() {
    $('#private-photo').removeAttribute('src');
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = null;
  }
  function endSession(message = '') {
    token = null;
    epoch++;
    listRequest++;
    scheduleRequest++;
    refreshRequest++;
    clearTimeout(expirationTimer);
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    clearPhoto();
    items = [];
    selected = null;
    schedule = null;
    previewRequest++;previewConfig=null;previewDraft=null;for(const id of ['preview-days','preview-events','preview-times'])$('#'+id).replaceChildren();$('#preview-month-summary').textContent='';$('#preview-status').textContent='';
    nextCursor = null;
    $('#appointments').replaceChildren();
    $('#request-details').replaceChildren();
    $('#request-message').textContent = '';
    $('#attachments').replaceChildren();
    $('#list-info').textContent = '';
    $('#schedule-form').reset();
    $('#edit-form').reset();
    $('#password-form').reset();
    $('#dashboard').hidden = true;
    $('#access').hidden = false;
    $('#login-form').reset();
    announce('#access-status', message, message ? 'error' : '');
    announce('#dashboard-status');
    $('#refresh').disabled = false;
    $('#refresh').textContent = 'Actualizar';
    $('#refresh').removeAttribute('aria-busy');
    notifyParent(false);
    $('#login-password').focus({ preventScroll: true });
  }
  async function api(path, options = {}) {
    if (!token) throw Object.assign(new Error('Vuelve a entrar para continuar.'), { code: 'session_changed' });
    const current = token, currentEpoch = epoch;
    try {
      const result = await request(path, { ...options, token: current });
      if (token !== current || currentEpoch !== epoch) throw Object.assign(new Error('La sesión cambió.'), { code: 'session_changed' });
      return result;
    } catch (error) {
      if (error.status === 401 && currentEpoch === epoch) endSession('Tu sesión terminó. Introduce de nuevo la contraseña.');
      throw error;
    }
  }
  function report(selector, error) {
    if (error?.code === 'session_changed' || !token) return;
    announce(selector, describe(error), 'error');
  }
  async function withBusy(form, work) {
    const submit = form.querySelector('[type="submit"]');
    if (submit.disabled) return;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    try { await work(); }
    finally { submit.disabled = false; form.removeAttribute('aria-busy'); }
  }
  function textElement(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function formatDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return date || 'Sin fecha';
    return new Intl.DateTimeFormat('es-CO', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date + 'T12:00:00Z'));
  }
  function renderItems() {
    const cards = items.map(item => {
      const card = document.createElement('article');
      card.className = 'appointment';
      const content = document.createElement('div');
      const badge = textElement('span', statusLabels[item.status] || item.status, 'badge');
      badge.dataset.status = item.status;
      content.append(badge, textElement('h3', item.name));
      const meta = textElement('div', '', 'appointment-meta');
      meta.append(textElement('span', `${formatDate(item.date)} · ${item.time}`), textElement('span', serviceLabels[item.service] || item.service));
      if (item.durationMinutes) meta.append(textElement('span', `${item.durationMinutes} min`));
      content.append(meta, textElement('p', [item.whatsapp, item.instagram].filter(Boolean).join(' · '), 'appointment-contact'));
      const button = textElement('button', 'Ver', 'appointment-action');
      button.type = 'button';
      button.addEventListener('click', () => openItem(item));
      card.append(content, button);
      return card;
    });
    if (!cards.length) {
      const empty = textElement('div', '', 'empty-state');
      empty.append(textElement('h3', 'No hay solicitudes con estos filtros'), textElement('p', 'Las solicitudes recibidas aparecerán aquí después de guardarse en el servidor.'));
      cards.push(empty);
    }
    $('#appointments').replaceChildren(...cards);
    $('#list-info').textContent = items.length ? `${items.length} solicitud${items.length === 1 ? '' : 'es'} cargada${items.length === 1 ? '' : 's'}` : '';
    $('#load-more').hidden = !nextCursor;
  }
  async function loadItems({ append = false, successMessage = '' } = {}) {
    const marker = ++listRequest;
    const query = new URLSearchParams();
    const state = $('#filter-status').value, search = $('#filter-search').value.trim();
    if (state) query.set('status', state);
    if (search) query.set('q', search);
    if (append && nextCursor) query.set('cursor', nextCursor);
    $('#appointments').setAttribute('aria-busy', 'true');
    $('#load-more').disabled = true;
    announce('#dashboard-status', 'Cargando solicitudes…');
    try {
      const result = await api('/api/admin/appointments' + (query.size ? '?' + query : ''));
      if (marker !== listRequest) return false;
      if (!Array.isArray(result.items)) throw new Error('El servidor no devolvió una lista válida.');
      items = append ? [...items, ...result.items.filter(item => !items.some(old => old.id === item.id))] : result.items;
      nextCursor = result.nextCursor || null;
      renderItems();
      if (!$('#requests-panel').hidden && !$('#paca-panel').hidden) announce('#dashboard-status', successMessage, successMessage ? 'success' : '');
      return true;
    } catch (error) { if (marker === listRequest && !$('#requests-panel').hidden && !$('#paca-panel').hidden) report('#dashboard-status', error); return false; }
    finally {
      if (marker === listRequest) {
        $('#appointments').removeAttribute('aria-busy');
        $('#load-more').disabled = false;
      }
    }
  }
  function field(name) { return $('#edit-form').elements.namedItem(name); }
  function detail(label, value) {
    if (value == null || value === '') return;
    $('#request-details').append(textElement('dt', label), textElement('dd', String(value)));
  }
  function updateDurationRequirement() { field('durationMinutes').required = field('status').value === 'confirmed'; }
  function updateNailPlan() {
    const nails = field('service').value === 'nails';
    $('#edit-nail-plan').hidden = !nails;
    field('nailType').required = nails;
    field('removal').required = nails;
    if (nails && field('nailType').value === 'removalOnly') field('removal').value = 'yes';
    field('removal').disabled = nails && field('nailType').value === 'removalOnly';
    const extra = nails && ['yes', 'unsure'].includes(field('removal').value);
    $('#edit-removal-ack').hidden = !extra;
    field('removalConsent').required = extra;
  }
  let itemRequest = 0;
  async function openItem(item) {
    const marker = ++itemRequest;
    announce('#dashboard-status', 'Cargando solicitud…');
    try {
      const latest = await api('/api/admin/appointments/' + encodeURIComponent(item.id));
      if (marker !== itemRequest) return;
      if (latest?.id !== item.id) throw new Error('El servidor no devolvió la solicitud.');
      showItem(latest);
      announce('#dashboard-status');
    } catch (error) { if (marker === itemRequest) report('#dashboard-status', error); }
  }
  function showItem(item) {
    selected = item;
    for (const name of ['name', 'whatsapp', 'instagram', 'service', 'date', 'time', 'status', 'notes', 'durationMinutes']) field(name).value = item[name] ?? '';
    field('nailType').value = item.nailType || '';
    field('removal').value = item.removal || '';
    field('removalConsent').checked = Boolean(item.removalConsent);
    updateDurationRequirement();
    updateNailPlan();
    $('#edit-id').textContent = item.id;
    $('#request-details').replaceChildren();
    detail('Creada', item.createdAt ? new Date(item.createdAt).toLocaleString('es-CO') : '');
    detail('Idioma', item.language === 'es' ? 'Español' : 'Inglés');
    detail('Tipo de uñas', durationLabels[item.nailType]);
    detail('Retiro', removalLabels[item.removal]);
    detail('Referencia del catálogo', typeof item.reference === 'string' ? item.reference : item.reference?.es || item.reference?.en);
    detail('Condiciones aceptadas', item.punctuality && item.cancellation && item.policy && item.consent ? 'Sí' : 'Revisar solicitud original');
    $('#request-message').textContent = item.message || 'La clienta no añadió una idea o comentario.';
    const attachments = (item.attachments || []).map(attachment => {
      const label = attachment.field === 'currentPhoto' ? 'Current' : attachment.field === 'inspirationPhoto' ? 'Inspiration' : 'Foto adjunta';
      const button = textElement('button', label);
      button.type = 'button';
      button.addEventListener('click', () => viewPhoto(attachment, button));
      return button;
    });
    $('#attachments').replaceChildren(...attachments);
    announce('#edit-status');
    $('#edit-dialog').showModal();
  }
  async function viewPhoto(attachment, button) {
    const item = selected;
    button.disabled = true;
    try {
      const blob = await api('/api/admin/attachments/' + encodeURIComponent(attachment.id), { responseType: 'blob' });
      if (!$('#edit-dialog').open || selected !== item) return;
      if (!(blob instanceof Blob) || !['image/jpeg', 'image/png', 'image/webp'].includes(blob.type)) throw new Error('El archivo no es una imagen compatible.');
      clearPhoto();
      photoURL = URL.createObjectURL(blob);
      $('#private-photo').src = photoURL;
      $('#photo-dialog').showModal();
    } catch (error) { report('#edit-status', error); }
    finally { button.disabled = false; }
  }

  $('#login-form').addEventListener('submit', event => {
    event.preventDefault();
    withBusy(event.currentTarget, async () => {
      announce('#access-status', 'Verificando acceso…');
      try {
        const result = await request('/api/admin/login', { method: 'POST', body: { password: $('#login-password').value } });
        const expires = typeof result.expiresAt === 'number' ? (result.expiresAt < 1e12 ? result.expiresAt * 1000 : result.expiresAt) : Date.parse(result.expiresAt);
        if (typeof result.token !== 'string' || !result.token || !Number.isFinite(expires) || expires <= Date.now()) throw new Error('El servidor no devolvió una sesión válida.');
        token = result.token;
        epoch++;
        expirationTimer = setTimeout(() => endSession('Tu sesión terminó. Introduce de nuevo la contraseña.'), Math.min(expires - Date.now(), 2147483647));
        $('#login-form').reset();
        $('#access').hidden = true;
        $('#dashboard').hidden = false;
        notifyParent(true);
        $('#requests-tab').focus({ preventScroll: true });
        await loadItems();
      } catch (error) { announce('#access-status', describe(error), 'error'); }
      finally { $('#login-password').value = ''; }
    });
  });
  if (activationToken) {
    $('#login-form').hidden = true;
    $('#setup-form').hidden = false;
    $('#access-intro').textContent = 'Crea la contraseña para activar JK.';
  }
  $('#setup-form').addEventListener('submit', event => {
    event.preventDefault();
    const password = $('#setup-password'), confirmation = $('#setup-confirm');
    confirmation.setCustomValidity(password.value === confirmation.value ? '' : 'Las contraseñas no coinciden.');
    if (!event.currentTarget.reportValidity()) return;
    withBusy(event.currentTarget, async () => {
      announce('#access-status', 'Activando acceso…');
      try {
        await request('/api/admin/setup', { method: 'POST', body: { activationToken, password: password.value } });
        activationToken = null;
        $('#setup-form').reset();
        $('#setup-form').hidden = true;
        $('#login-form').hidden = false;
        $('#access-intro').textContent = 'Introduce la contraseña';
        announce('#access-status', 'Acceso activado. Ya puedes entrar con tu contraseña.', 'success');
        $('#login-password').focus();
      } catch (error) { announce('#access-status', describe(error), 'error'); }
      finally { password.value = ''; confirmation.value = ''; }
    });
  });
  $('#setup-confirm').addEventListener('input', event => event.target.setCustomValidity(''));
  $('#logout').addEventListener('click', async () => {
    const current = token;
    endSession();
    if (current) {
      try { await request('/api/admin/logout', { method: 'POST', token: current }); }
      catch { announce('#access-status', 'La sesión local se cerró. Si no hubo conexión, la sesión del servidor vencerá automáticamente.'); }
    }
  });
  $('#filters').addEventListener('submit', event => { event.preventDefault(); loadItems(); });
  $('#filter-status').addEventListener('change', () => loadItems());
  $('#refresh').addEventListener('click', async event => {
    const button = event.currentTarget;
    if (button.disabled) return;
    const marker = ++refreshRequest;
    button.disabled = true;
    button.textContent = 'Actualizando…';
    button.setAttribute('aria-busy', 'true');
    try {
      if ($('#schedule-panel').hidden) await loadItems({ successMessage: 'Solicitudes actualizadas.' });
      else await loadSchedule({ successMessage: 'Disponibilidad actualizada.' });
    } finally {
      if (marker === refreshRequest) {
        button.disabled = false;
        button.textContent = 'Actualizar';
        button.removeAttribute('aria-busy');
      }
    }
  });
  $('#load-more').addEventListener('click', () => loadItems({ append: true }));
  field('status').addEventListener('change', updateDurationRequirement);
  for (const name of ['service', 'nailType', 'removal']) field(name).addEventListener('change', updateNailPlan);
  $('#edit-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!selected) return;
    withBusy(event.currentTarget, async () => {
      const item = selected;
      const body = { version: item.version };
      for (const name of ['name', 'whatsapp', 'instagram', 'service', 'date', 'time', 'status', 'notes']) body[name] = field(name).value.trim();
      if (body.service === 'nails') {
        body.nailType = field('nailType').value;
        body.removal = field('removal').value;
        body.removalConsent = field('removalConsent').checked;
      }
      body.durationMinutes = field('durationMinutes').value ? Number(field('durationMinutes').value) : null;
      announce('#edit-status', 'Guardando cambios…');
      try {
        await api('/api/admin/appointments/' + encodeURIComponent(item.id), { method: 'PATCH', body });
        $('#edit-dialog').close();
        await loadItems();
        if (token) announce('#dashboard-status', 'Solicitud actualizada.', 'success');
      } catch (error) { report('#edit-status', error); }
    });
  });
  $('#delete-open').addEventListener('click', () => {
    if (!selected) return;
    $('#delete-description').textContent = `¿Eliminar la solicitud de ${selected.name} para el ${formatDate(selected.date)} a las ${selected.time}?`;
    announce('#delete-status');
    $('#delete-dialog').showModal();
  });
  $('#delete-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!selected) return;
    withBusy(event.currentTarget, async () => {
      const item = selected;
      try {
        announce('#delete-status', 'Eliminando solicitud…');
        await api(`/api/admin/appointments/${encodeURIComponent(item.id)}?version=${encodeURIComponent(item.version)}`, { method: 'DELETE' });
        $('#delete-dialog').close();
        $('#edit-dialog').close();
        await loadItems();
        if (token) announce('#dashboard-status', 'Solicitud eliminada.', 'success');
      } catch (error) { report('#delete-status', error); }
    });
  });
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
  $('#photo-dialog').addEventListener('close', clearPhoto);
  $('#edit-dialog').addEventListener('close', () => {
    selected = null;
    $('#edit-form').reset();
    for (const control of $('#edit-form').elements) control.setCustomValidity?.('');
    announce('#edit-status');
  });
  $('#password-dialog').addEventListener('close', () => $('#password-form').reset());

  async function loadSchedule({ successMessage = '' } = {}) {
    const marker = ++scheduleRequest;
    $('#schedule-form').setAttribute('aria-busy', 'true');
    $('#schedule-form [type="submit"]').disabled = true;
    announce('#dashboard-status', 'Cargando disponibilidad…');
    try {
      const result = await api('/api/admin/schedule');
      if (marker !== scheduleRequest) return false;
      if (!result.config || !Number.isInteger(result.version)) throw new Error('El servidor no devolvió la disponibilidad válida.');
      schedule = result;
      const config = result.config;
      $('#schedule-horizon').value = config.horizonDays;
      for (const key of Object.keys(estimateLabels)) for (const part of estimateParts) $(`[data-estimate="${key}"][data-part="${part.key}"]`).value = config.estimates?.[key]?.[part.key] ?? '';
      $('#schedule-closed').value = config.closedDates.join('\n');
      $('#schedule-blocked').value = config.blocked.map(block => `${block.date} ${block.start}-${block.end}`).join('\n');
      scheduleState(false);
      if (!$('#schedule-panel').hidden && !$('#paca-panel').hidden) announce('#dashboard-status', successMessage, successMessage ? 'success' : '');
      return true;
    } catch (error) { if (marker === scheduleRequest && !$('#schedule-panel').hidden && !$('#paca-panel').hidden) report('#dashboard-status', error); return false; }
    finally {
      if (marker === scheduleRequest) {
        $('#schedule-form').removeAttribute('aria-busy');
        $('#schedule-form [type="submit"]').disabled = !schedule;
      }
    }
  }
  const estimateLabels={...durationLabels,removalExtra:'Retiro adicional'};
  const estimateParts=[{key:'minMinutes',label:'Desde (min)',min:1,max:720,step:1},{key:'maxMinutes',label:'Hasta (min)',min:1,max:720,step:1},{key:'minPrice',label:'Desde (USD)',min:0,max:10000,step:0.01},{key:'maxPrice',label:'Hasta (USD)',min:0,max:10000,step:0.01}];
  for (const [key, name] of Object.entries(estimateLabels)) {
    const group=document.createElement('fieldset');group.className='estimate-row';group.append(textElement('legend',name));
    for(const part of estimateParts){const label=textElement('label',part.label),input=document.createElement('input');Object.assign(input,{type:'number',min:part.min,max:part.max,step:part.step,required:true});input.dataset.estimate=key;input.dataset.part=part.key;input.setAttribute('aria-label',`${name}: ${part.label}`);label.append(input);group.append(label);}
    $('#duration-fields').append(group);
    if(key!=='removalExtra'){const option=document.createElement('option');option.value=key;option.textContent=name;$('#preview-service').append(option);}
  }
  function scheduleState(dirty){
    $('#schedule-state').textContent=dirty?'Cambios sin guardar. Visualiza la agenda y guarda para aplicarlos.':`${schedule?.config.closedDates.length||0} días cerrados y ${schedule?.config.blocked.length||0} bloqueos manuales guardados.`;
  }
  $('#schedule-form').addEventListener('input',()=>scheduleState(true));
  const lines = value => value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const realDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T12:00:00Z')) && new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) === value;
  function draftConfig(){
    const config={...schedule.config,horizonDays:Number($('#schedule-horizon').value),durationMinutes:{},removalMinutes:null,estimates:{},currency:'USD'};
    for(const key of Object.keys(durationLabels))config.durationMinutes[key]=null;
    for(const key of Object.keys(estimateLabels)){
      const value={};for(const part of estimateParts)value[part.key]=Number($(`[data-estimate="${key}"][data-part="${part.key}"]`).value);
      if(value.minMinutes>value.maxMinutes||value.minPrice>value.maxPrice)throw new Error(`Revisa ${estimateLabels[key]}: el mínimo no puede superar al máximo.`);
      config.estimates[key]=value;
    }
    config.closedDates=[...new Set(lines($('#schedule-closed').value))];
    if(!config.closedDates.every(realDate))throw new Error('Revisa los días cerrados. Usa fechas reales con formato AAAA-MM-DD.');
    config.blocked=lines($('#schedule-blocked').value).map(line=>{
      const match=/^(\d{4}-\d{2}-\d{2})\s+((?:[01]\d|2[0-3]):[0-5]\d)-((?:[01]\d|2[0-3]):[0-5]\d)$/.exec(line);
      if(!match||!realDate(match[1])||match[2]>=match[3])throw new Error('Revisa los bloqueos: AAAA-MM-DD HH:mm-HH:mm, con la hora final después de la inicial.');
      return {date:match[1],start:match[2],end:match[3]};
    });return config;
  }
  $('#schedule-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!schedule) return;
    withBusy(event.currentTarget, async () => {
      try {
        const config = draftConfig();
        announce('#dashboard-status', 'Guardando disponibilidad…');
        schedule = await api('/api/admin/schedule', { method: 'PUT', body: { config, version: schedule.version } });
        scheduleState(false);
        announce('#dashboard-status', 'Disponibilidad guardada. Las nuevas visitas usarán estos horarios.', 'success');
      } catch (error) { report('#dashboard-status', error); }
    });
  });
  let previewConfig=null,previewDraft=null,previewCursor='',previewDate='',previewRequest=0;
  const eventNotes={pending:'No reserva horario',confirmed:'Horario reservado',completed:'Registro de cita completada',cancelled:'Cancelada · No bloquea horarios'};
  function previewDayReason(date,config){
    const S=window.PacaSchedule,today=S.studioNow().date;
    if(config.closedDates.includes(date))return 'Día cerrado';
    if(!config.weekdays.includes(new Date(date+'T12:00:00Z').getUTCDay()))return 'Día no laborable';
    if(date<today)return 'Fecha pasada';
    if(date>S.addDays(today,config.horizonDays))return 'Fuera del plazo de solicitudes';
    return '';
  }
  function renderPreview(){
    const S=window.PacaSchedule,config=previewConfig;if(!config)return;
    const key=$('#preview-service').value,details={service:Object.hasOwn(serviceLabels,key)?key:'nails',nailType:key,removal:'no'};
    const events=config.events||[],manual=previewDraft.blocked;
    const counts=Object.fromEntries(Object.keys(statusLabels).map(status=>[status,events.filter(e=>e.status===status).length]));
    $('#preview-month').textContent=new Intl.DateTimeFormat('es-CO',{timeZone:'UTC',month:'long',year:'numeric'}).format(new Date(previewCursor+'-01T12:00:00Z'));
    const monthBlocks=manual.filter(b=>b.date.startsWith(previewCursor)).length,monthClosed=config.closedDates.filter(date=>date.startsWith(previewCursor)).length;
    $('#preview-month-summary').textContent=[events.length?Object.entries(counts).filter(([,n])=>n).map(([status,n])=>n+' '+statusLabels[status].toLowerCase()+(n===1?'':'s')).join(' · '):'Sin citas registradas',monthBlocks+' bloqueos manuales',monthClosed+' días cerrados'].join(' · ');
    const legend=$('#preview-legend');legend.replaceChildren();
    for(const [status,label] of Object.entries(statusLabels)){const badge=textElement('span',label,'badge');badge.dataset.status=status;legend.append(badge);}
    legend.append(textElement('span','Bloqueo manual / día cerrado','preview-block-legend'));
    $('#preview-previous').disabled=previewCursor<='0001-01';$('#preview-next').disabled=previewCursor>='9999-12';
    const days=$('#preview-days');days.replaceChildren();const first=new Date(previewCursor+'-01T12:00:00Z'),offset=(first.getUTCDay()+6)%7,count=new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate();
    for(let i=0;i<offset;i++)days.append(document.createElement('span'));
    for(let i=1;i<=count;i++){
      const date=previewCursor+'-'+String(i).padStart(2,'0'),records=events.filter(e=>e.date===date),blocks=manual.filter(b=>b.date===date),reason=previewDayReason(date,config),button=document.createElement('button');
      button.type='button';button.className=reason?'is-unavailable':'';button.append(textElement('span',String(i),'preview-day-number'));
      const descriptions=[date,reason];
      if(records.length){
        button.append(textElement('span',records.length+' '+(records.length===1?'cita':'citas'),'preview-day-count'));
        const marks=textElement('span','','preview-day-marks');marks.setAttribute('aria-hidden','true');
        for(const status of Object.keys(statusLabels)){const n=records.filter(e=>e.status===status).length;if(!n)continue;const dot=textElement('span','','event-dot');dot.dataset.status=status;marks.append(dot);descriptions.push(n+' '+statusLabels[status].toLowerCase()+(n===1?'':'s'));}
        button.append(marks);
      }
      if(blocks.length||config.closedDates.includes(date))button.append(textElement('span',config.closedDates.includes(date)?'Cerrado':'Bloqueo','preview-day-block'));
      if(blocks.length)descriptions.push(blocks.length+' bloqueos manuales');
      button.setAttribute('aria-label',descriptions.filter(Boolean).join(' · '));button.title=button.getAttribute('aria-label');button.setAttribute('aria-pressed',String(date===previewDate));
      button.addEventListener('click',()=>{previewDate=date;renderPreview();$('#preview-days button[aria-pressed="true"]').focus({preventScroll:true});});days.append(button);
    }
    const eventList=$('#preview-events');eventList.replaceChildren();$('#preview-events-title').textContent=previewDate?'Eventos del '+formatDate(previewDate):'Eventos del día';
    if(!previewDate)eventList.append(textElement('p','Selecciona un día para consultar sus citas, estados y bloqueos.','hint'));
    else{
      const records=events.filter(e=>e.date===previewDate),blocks=manual.filter(b=>b.date===previewDate),reason=previewDayReason(previewDate,config);
      if(reason)eventList.append(textElement('p',reason,'preview-day-notice'));
      for(const item of records){const card=textElement('article','','preview-event'),heading=textElement('div','','preview-event-heading'),badge=textElement('span',statusLabels[item.status]||item.status,'badge');badge.dataset.status=item.status;heading.append(textElement('strong',item.time+' · '+item.name),badge);card.append(heading,textElement('p',(serviceLabels[item.service]||item.service)+(item.durationMinutes?' · '+item.durationMinutes+' min':'')),textElement('p',eventNotes[item.status]||'','hint'));eventList.append(card);}
      for(const block of blocks){const card=textElement('article','','preview-event manual-block');card.append(textElement('strong',block.start+'–'+block.end+' · Bloqueo manual'),textElement('p','No se ofrecen horarios que se crucen con este intervalo.','hint'));eventList.append(card);}
      if(!records.length&&!blocks.length)eventList.append(textElement('p','Sin citas ni bloqueos manuales registrados en este día.','hint'));
    }
    const times=$('#preview-times');times.replaceChildren();const slots=previewDate?S.slots(previewDate,config,details):[],reason=previewDate?previewDayReason(previewDate,config):'';
    $('#preview-status').textContent=!previewDate?'':reason?'No se ofrecen nuevas solicitudes: '+reason.toLowerCase()+'.':S.formatEstimate(config,details,'es')+' '+slots.filter(s=>s.available).length+' horas de inicio disponibles.';
    for(const slot of slots){const label=textElement('span',slot.time+(slot.available?'':' · Ocupado'));label.className=slot.available?'preview-slot':'preview-slot is-busy';times.append(label);}
  }
  async function loadPreview(month){
    const marker=++previewRequest;previewCursor=month;previewConfig=null;
    $('#schedule-preview-dialog').setAttribute('aria-busy','true');
    for(const id of ['preview-previous','preview-next','preview-refresh'])$('#'+id).disabled=true;
    for(const id of ['preview-days','preview-events','preview-times'])$('#'+id).replaceChildren();
    $('#preview-month-summary').textContent='';$('#preview-status').dataset.kind='';$('#preview-status').textContent='Cargando eventos y disponibilidad…';
    try{
      const config=await api('/api/admin/schedule/preview',{method:'POST',body:{config:previewDraft,month}});
      if(marker!==previewRequest)return;
      previewConfig=window.PacaSchedule.validateConfig(config);renderPreview();
    }catch(error){if(marker===previewRequest&&token)announce('#preview-status',describe(error),'error');}
    finally{if(marker===previewRequest){$('#schedule-preview-dialog').removeAttribute('aria-busy');$('#preview-refresh').disabled=false;}}
  }
  $('#schedule-preview').addEventListener('click',()=>{
    if(!schedule||!$('#schedule-form').reportValidity())return;
    try{previewDraft=draftConfig();previewDate='';$('#schedule-preview-dialog').showModal();loadPreview(window.PacaSchedule.studioNow().date.slice(0,7));}
    catch(error){report('#dashboard-status',error);}
  });
  $('#preview-service').addEventListener('change',renderPreview);
  $('#preview-refresh').addEventListener('click',()=>loadPreview(previewCursor));
  $('#schedule-preview-dialog').addEventListener('close',()=>{previewRequest++;previewConfig=null;previewDraft=null;for(const id of ['preview-days','preview-events','preview-times'])$('#'+id).replaceChildren();$('#preview-month-summary').textContent='';$('#preview-status').textContent='';});
  for(const [id,delta] of [['preview-previous',-1],['preview-next',1]])$('#'+id).addEventListener('click',()=>{const date=new Date(previewCursor+'-01T12:00:00Z');date.setUTCMonth(date.getUTCMonth()+delta);previewDate='';loadPreview(date.toISOString().slice(0,7));});
  async function chooseTab(name) {
    const requests = name === 'requests';
    $('#requests-panel').hidden = !requests;
    $('#schedule-panel').hidden = requests;
    for (const [key, active] of [['requests', requests], ['schedule', !requests]]) {
      $(`#${key}-tab`).setAttribute('aria-selected', String(active));
      $(`#${key}-tab`).tabIndex = active ? 0 : -1;
    }
    if (!requests && !schedule) await loadSchedule();
  }
  $('#requests-tab').addEventListener('click', () => chooseTab('requests'));
  $('#schedule-tab').addEventListener('click', () => chooseTab('schedule'));
  $('.tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const scheduleSelected = $('#schedule-tab').getAttribute('aria-selected') === 'true';
    const name = event.key === 'Home' ? 'requests' : event.key === 'End' ? 'schedule' : scheduleSelected ? 'requests' : 'schedule';
    chooseTab(name);
    $(`#${name}-tab`).focus();
  });
  function chooseApp(paca) {
    $('#paca-panel').hidden = !paca; $('#lbds-panel').hidden = paca;
    $('#app-paca').classList.toggle('is-active', paca); $('#app-lbds').classList.toggle('is-active', !paca);
    $('#app-paca').setAttribute('aria-pressed', String(paca)); $('#app-lbds').setAttribute('aria-pressed', String(!paca));
    announce('#dashboard-status');
  }
  $('#app-paca').addEventListener('click', () => chooseApp(true));
  $('#app-lbds').addEventListener('click', () => chooseApp(false));
  $('#export').addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    announce('#dashboard-status', 'Preparando respaldo…');
    try {
      const backup = await api('/api/admin/export');
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url; link.download = `paca-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce('#dashboard-status', 'Respaldo descargado. Contiene datos personales: guárdalo en un lugar privado. Las fotos se conservan por separado en el servidor.', 'success');
    } catch (error) { report('#dashboard-status', error); }
    finally { button.disabled = false; }
  });
  $('#password-open').addEventListener('click', () => {
    announce('#password-status');
    $('#password-dialog').showModal();
  });
  $('#password-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    form.elements.confirmPassword.setCustomValidity(form.elements.newPassword.value === form.elements.confirmPassword.value ? '' : 'Las contraseñas no coinciden.');
    if (!form.reportValidity()) return;
    withBusy(form, async () => {
      try {
        await api('/api/admin/password', { method: 'POST', body: { currentPassword: form.elements.currentPassword.value, newPassword: form.elements.newPassword.value } });
        endSession();
        announce('#access-status', 'Contraseña actualizada. Vuelve a entrar con la nueva contraseña.', 'success');
      } catch (error) { report('#password-status', error); }
    });
  });
  $('#password-form [name="confirmPassword"]').addEventListener('input', event => event.target.setCustomValidity(''));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && token && !document.querySelector('dialog[open]') && !$('#requests-panel').hidden) loadItems();
  });
  addEventListener('pagehide', () => { clearPhoto(); token = null; epoch++; clearTimeout(expirationTimer); });
  notifyParent(false);
})();
