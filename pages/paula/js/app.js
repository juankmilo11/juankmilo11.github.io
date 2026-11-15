(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
  const $ = selector => document.querySelector(selector);
  const I = window.PacaI18n, t = I.t, icons = window.PacaIcons;
  const labels = {};
  const syncLabels=()=>['nails','tattoo','pmu','makeup'].forEach(key=>{labels[key]=t(key);});
  syncLabels();
  window.initPacaBooking();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motion = $('#motion-toggle');
  let paused = reduced.matches;
  function syncMotion() {
    document.documentElement.classList.toggle('motion-paused', paused);
    motion.setAttribute('aria-pressed', String(paused));
    motion.setAttribute('aria-label', t(paused ? 'resume' : 'pause'));
    motion.title = motion.getAttribute('aria-label');
    motion.replaceChildren(icons.create(paused ? 'play' : 'pause'));
    document.dispatchEvent(new CustomEvent('paca:motion'));
  }
  syncMotion();
  motion.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reduced.addEventListener('change', event => { paused = event.matches; syncMotion(); });
  const hero = $('#hero-image');
  let heroKey='nails';
  hero.alt=t('hero.'+heroKey);
  let heroRequest = 0;
  document.querySelectorAll('[data-hero]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.hero, request = ++heroRequest;
    const image = new Image();
    image.onload = () => {
      if (request !== heroRequest) return;
      heroKey=key;
      const previous=hero.cloneNode();previous.removeAttribute('id');previous.alt='';previous.setAttribute('aria-hidden','true');previous.classList.add('hero-previous');
      hero.parentElement.querySelectorAll('.hero-previous').forEach(item=>item.remove());
      if(!paused&&!reduced.matches)hero.after(previous);
      hero.src=image.src;hero.alt=t('hero.'+key);
      if(previous.isConnected){const fade=previous.animate([{opacity:1},{opacity:0}],{duration:850,easing:'ease-in-out',fill:'forwards'});fade.finished.then(()=>previous.remove()).catch(()=>previous.remove());}
      document.querySelectorAll('[data-hero]').forEach(item => {
        item.classList.toggle('is-active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      if (!paused && !reduced.matches) hero.animate([{opacity:.2,transform:'scale(1.03)'},{opacity:1,transform:'scale(1)'}],{duration:600,easing:'ease-out'});
    };
    image.src = `assets/hero-${key}.webp`;
  }));
  document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('paca:book',{detail:{service:button.dataset.book}}));
  }));
  const floating = $('.floating-book');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.target.id === 'agendar') floating.classList.toggle('is-hidden', entry.isIntersecting);
    }), {threshold:0});
    observer.observe($('#agendar'));
  }
  const dialog = $('#work-dialog'), media = $('#work-media');
  const grid = $('#catalog-grid'), search = $('#catalog-search'), more = $('#catalog-more');
  let entries = [], filtered = [], limit = 9, category = 'all', activeIndex = 0, opener = null, loadFailed = false, pendingBooking = null;
  const reveals = 'IntersectionObserver' in window ? new IntersectionObserver(records => records.forEach(record => {
    if(record.isIntersecting){record.target.classList.add('is-revealed');reveals.unobserve(record.target);}
  }),{threshold:.08}) : null;
  function reveal(element){if(reveals){element.classList.add('reveal');reveals.observe(element);}}
  document.querySelectorAll('.section-heading,.artist-portrait,.artist-copy,.faq>div:first-child').forEach(reveal);
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function curatedOrder(all) {
    const buckets = Object.fromEntries(Object.keys(labels).map(key => [key, all.filter(item => item.category === key)]));
    const result = [], pattern = ['nails','tattoo','pmu','nails','makeup','tattoo','nails','makeup','nails'];
    while (Object.values(buckets).some(bucket => bucket.length)) for (const key of pattern) if(buckets[key].length) result.push(buckets[key].shift());
    return result;
  }
  function render() {
    const query = normalize(search.value.trim());
    filtered = entries.filter(entry => (category === 'all' || entry.category === category || (category === 'beauty' && entry.category==='makeup')) && normalize(`${entry.title} ${entry.alt} ${entry.translations.es.title} ${entry.translations.es.alt} ${t(entry.category,{},'en')} ${t(entry.category,{},'es')}`).includes(query)).map(entry=>I.entry(entry));
    const visible = filtered.slice(0,limit);
    grid.replaceChildren(...visible.map((entry,index) => {
      const article = document.createElement('article'); article.className='work-card';article.style.setProperty('--reveal-order',index%3);
      const button = document.createElement('button'); button.type='button';button.className='work-open';button.setAttribute('aria-label',t('view',{title:entry.title,category:labels[entry.category]}));
      const frame=document.createElement('div');frame.className='work-image';
      const img=document.createElement('img');img.src=entry.src;img.alt=entry.alt;img.width=entry.width;img.height=entry.height;img.loading='lazy';img.decoding='async';
      frame.append(img);
      const overlay=document.createElement('span');overlay.className='work-overlay';overlay.setAttribute('aria-hidden','true');const overlayText=document.createElement('span');icons.label(overlayText,t('viewWork'),'arrow-up-right');overlay.append(overlayText);frame.append(overlay);
      if(entry.video){const badge=document.createElement('span');badge.className='work-badge';icons.label(badge,t('videoBadge'),'play');frame.append(badge);}
      const meta=document.createElement('div');meta.className='work-meta';
      const copy=document.createElement('div'),title=document.createElement('h3'),tag=document.createElement('p');title.textContent=entry.title;tag.textContent=labels[entry.category];copy.append(title,tag);
      const arrow=document.createElement('span');arrow.className='work-arrow';arrow.append(icons.create('arrow-up-right'));arrow.setAttribute('aria-hidden','true');meta.append(copy,arrow);
      button.append(frame,meta);article.append(button);button.addEventListener('click',()=>openWork(index,button));return article;
    }));
    grid.querySelectorAll('.work-card').forEach(reveal);
    $('#catalog-status').textContent = filtered.length ? t('workCount',{visible:visible.length,total:filtered.length})+(category!=='all'?' · '+t(category):'') : t('noResults');
    $('#catalog-empty').hidden = filtered.length !== 0;
    more.hidden = filtered.length <= limit;
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',()=>{
    category=button.dataset.filter;limit=9;
    document.querySelectorAll('[data-filter]').forEach(item=>{item.classList.toggle('is-active',item===button);item.setAttribute('aria-pressed',String(item===button));});
    render();
  }));
  search.addEventListener('input',()=>{limit=9;render();});
  more.addEventListener('click',()=>{const old=limit;limit+=9;render();grid.children[old]?.querySelector('button').focus({preventScroll:true});});
  $('#catalog-reset').addEventListener('click',()=>{
    if(loadFailed){loadCatalog();return;}
    search.value='';category='all';limit=9;
    document.querySelectorAll('[data-filter]').forEach(item=>{item.classList.toggle('is-active',item.dataset.filter==='all');item.setAttribute('aria-pressed',String(item.dataset.filter==='all'));});render();
  });
  function stopMedia() { media.querySelector('video')?.pause();media.replaceChildren(); }
  function displayWork() {
    const entry=filtered[activeIndex];if(!entry)return;
    stopMedia();
    const img=document.createElement('img');img.src=entry.src;img.alt=entry.alt;img.width=entry.width;img.height=entry.height;media.append(img);
    $('#work-category').textContent=labels[entry.category];$('#work-title').textContent=entry.title;$('#work-description').textContent=entry.alt;
    $('#work-count').textContent=`${activeIndex+1} / ${filtered.length}`;
    const old=$('#work-video');if(old)old.remove();
    if(entry.video){
      const videoButton=document.createElement('button');videoButton.id='work-video';videoButton.className='text-button';videoButton.type='button';icons.label(videoButton,t('watchVideo'),'play');
      $('#work-description').after(videoButton);
      videoButton.addEventListener('click',()=>{
        if(media.querySelector('video')){displayWork();return;}
        stopMedia();const video=document.createElement('video');video.src=entry.video;video.poster=entry.src;video.controls=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',t('videoLabel',{title:entry.title}));media.append(video);icons.label(videoButton,t('backPhoto'),'arrow-up-right');
      });
    }
  }
  function openWork(index,button){activeIndex=index;opener=button;displayWork();dialog.showModal();document.body.classList.add('dialog-open');$('#work-close').focus();}
  $('#work-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{
    stopMedia();document.body.classList.remove('dialog-open');
    if(pendingBooking){const detail=pendingBooking;pendingBooking=null;document.dispatchEvent(new CustomEvent('paca:book',{detail}));}
    else opener?.focus({preventScroll:true});
  });
  function navigate(delta){activeIndex=(activeIndex+delta+filtered.length)%filtered.length;displayWork();}
  $('#work-previous').addEventListener('click',()=>navigate(-1));$('#work-next').addEventListener('click',()=>navigate(1));
  dialog.addEventListener('keydown',event=>{if(event.target.closest('video'))return;if(event.key==='ArrowRight'){event.preventDefault();navigate(1);}if(event.key==='ArrowLeft'){event.preventDefault();navigate(-1);}});
  $('#work-book').addEventListener('click',()=>{
    const entry=filtered[activeIndex];
    const source=entries.find(item=>item.id===entry.id);
    pendingBooking={service:entry.category==='makeup'?'beauty':entry.category,reference:{en:source.title,es:source.translations.es.title}};dialog.close();
  });
  async function loadCatalog(){
    try{
      const response=await fetch('assets/catalog.json');if(!response.ok)throw new Error('catalog');
      const data=await response.json();entries=curatedOrder(data.entries);loadFailed=false;
      syncEmpty();
      $('#total-count').textContent=String(entries.length).padStart(2,'0');render();
    }catch(error){loadFailed=true;syncEmpty();$('#catalog-empty').hidden=false;}
  }
  function syncEmpty(){
    $('#catalog-empty h3').textContent=t(loadFailed?'retryTitle':'emptyTitle');
    $('#catalog-empty p').textContent=t(loadFailed?'retryText':'emptyText');
    icons.label($('#catalog-reset'),t(loadFailed?'retry':'resetCatalog'),'arrow-up-right');
    if(loadFailed)$('#catalog-status').textContent=t('catalogError');
  }
  document.addEventListener('paca:language',()=>{
    const activeId=dialog.open?filtered[activeIndex]?.id:null;
    syncLabels();syncMotion();hero.alt=t('hero.'+heroKey);syncEmpty();
    if(entries.length&&!loadFailed)render();
    if(activeId){activeIndex=Math.max(0,filtered.findIndex(item=>item.id===activeId));displayWork();}
  });
  loadCatalog();
})();
