(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
  const $ = selector => document.querySelector(selector);
  const I = window.PacaI18n, t = I.t, icons = window.PacaIcons;
  const labels = {};
  let estimateConfig=null;
  function updateEstimates(){document.querySelectorAll('[data-service-estimate]').forEach(node=>{node.textContent=window.PacaSchedule.formatEstimate(estimateConfig,{service:node.dataset.serviceEstimate},I.language);node.hidden=!node.textContent;});}
  document.querySelectorAll('.service [data-book]').forEach(button=>{const node=document.createElement('p');node.className='service-estimate';node.dataset.serviceEstimate=button.dataset.book;button.before(node);});
  document.addEventListener('paca:availability',event=>{estimateConfig=event.detail.config;updateEstimates();});
  window.ProjectAPI.availability().then(config=>document.dispatchEvent(new CustomEvent('paca:availability',{detail:{config}}))).catch(()=>{});
  const syncLabels=()=>['nails','tattoo','pmu','makeup'].forEach(key=>{labels[key]=t(key);});
  syncLabels();
  window.initPacaBooking();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = $('#hero-image');
  let heroKey='nails';
  hero.alt=t('hero.'+heroKey);
  let heroRequest = 0;
  document.querySelectorAll('[data-hero]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.hero === heroKey) { heroRequest++; return; }
    const key = button.dataset.hero, request = ++heroRequest;
    const image = new Image();
    image.onerror = () => window.PacaMotion?.reportAsset(image.src);
    image.onload = () => {
      if (request !== heroRequest) return;
      heroKey=key;
      const previous=hero.cloneNode();previous.removeAttribute('id');previous.alt='';previous.setAttribute('aria-hidden','true');previous.classList.add('hero-previous');
      hero.parentElement.querySelectorAll('.hero-previous').forEach(item=>item.remove());
      if(!reduced.matches)hero.after(previous);
      hero.src=image.src;hero.alt=t('hero.'+key);
      if(previous.isConnected){const fade=previous.animate([{opacity:1},{opacity:0}],{duration:400,easing:'ease-out',fill:'forwards'});fade.finished.then(()=>previous.remove()).catch(()=>previous.remove());}
      document.querySelectorAll('[data-hero]').forEach(item => {
        item.classList.toggle('is-active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
    };
    image.src = `assets/hero-${key}.webp`;
  }));
  document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('paca:book',{detail:{service:button.dataset.book}}));
  }));
  const dialog = $('#work-dialog'), media = $('#work-media');
  const grid = $('#catalog-grid'), more = $('#catalog-more');
  let entries = [], filtered = [], limit = 9, category = 'all', activeIndex = 0, opener = null, loadFailed = false, pendingBooking = null;
  const reveals = 'IntersectionObserver' in window ? (()=>{
    const targets=new Map();
    const cancel=state=>{clearTimeout(state.timer);state.timer=0;};
    function enter(node,state){
      if(state.shown||state.timer||document.hidden)return;
      state.timer=setTimeout(()=>{
        state.timer=0;const box=node.getBoundingClientRect();
        const visible=Math.max(0,Math.min(box.bottom,innerHeight-64)-Math.max(0,box.top));
        if(node.isConnected&&!document.hidden&&visible/Math.max(1,box.height)>=.16){state.shown=true;node.classList.add('is-revealed');}
      },120);
    }
    const entrance=new IntersectionObserver(records=>records.forEach(record=>{
      const state=targets.get(record.target);if(!state)return;
      if(record.isIntersecting&&record.intersectionRatio>=.18)enter(record.target,state);
      else if(!state.shown)cancel(state);
    }),{threshold:[0,.18],rootMargin:'0px 0px -64px 0px'});
    // Reset only after completely leaving an expanded viewport. The buffer is
    // larger than the 18px reveal transform, so the animation cannot retrigger itself.
    const exit=new IntersectionObserver(records=>records.forEach(record=>{
      const state=targets.get(record.target);if(!state||record.isIntersecting)return;
      cancel(state);state.shown=false;record.target.classList.remove('is-revealed');record.target.style.animation='';
    }),{rootMargin:'48px 0px 48px 0px'});
    document.addEventListener('focusin',event=>{
      const node=event.target.closest('.reveal'),state=targets.get(node);
      if(state){cancel(state);state.shown=true;node.style.animation='none';node.classList.add('is-revealed');}
    });
    document.addEventListener('visibilitychange',()=>targets.forEach((state,node)=>{
      if(document.hidden)cancel(state);else enter(node,state);
    }));
    addEventListener('pagehide',()=>{targets.forEach(cancel);entrance.disconnect();exit.disconnect();});
    addEventListener('pageshow',event=>{if(event.persisted)targets.forEach((state,node)=>{entrance.observe(node);exit.observe(node);});});
    return {
      observe(node){targets.set(node,{shown:node.classList.contains('is-revealed'),timer:0});entrance.observe(node);exit.observe(node);},
      unobserve(node){const state=targets.get(node);if(state)cancel(state);targets.delete(node);entrance.unobserve(node);exit.unobserve(node);}
    };
  })() : null;
  function reveal(element){if(reveals){element.classList.add('reveal');reveals.observe(element);}}
  document.querySelectorAll('.section-heading,.artist-copy,.faq>div:first-child').forEach(reveal);
  function curatedOrder(all) {
    const buckets = Object.fromEntries(Object.keys(labels).map(key => [key, all.filter(item => item.category === key)]));
    const result = [], pattern = ['nails','tattoo','pmu','nails','makeup','tattoo','nails','makeup','nails'];
    while (Object.values(buckets).some(bucket => bucket.length)) for (const key of pattern) if(buckets[key].length) result.push(buckets[key].shift());
    return result;
  }
  function render({append=false} = {}) {
    filtered = entries.filter(entry => category === 'all' || entry.category === category || (category === 'beauty' && entry.category==='makeup')).map(entry=>I.entry(entry));
    const visible = filtered.slice(0,limit);
    const offset = append ? grid.children.length : 0;
    if (!append) grid.querySelectorAll('.work-card').forEach(card => reveals?.unobserve(card));
    const cards = visible.slice(offset).map((entry,relativeIndex) => {
      const index = offset + relativeIndex;
      const article = document.createElement('article'); article.className='work-card';article.style.setProperty('--reveal-order',index%3);
      const button = document.createElement('button'); button.type='button';button.className='work-open';button.dataset.workId=entry.id;button.setAttribute('aria-label',t('gallerySelect',{title:entry.title}));button.setAttribute('aria-pressed','false');
      const frame=document.createElement('div');frame.className='work-image';
      const img=document.createElement('img');img.src=entry.src;img.alt=entry.alt;img.width=entry.width;img.height=entry.height;img.loading='lazy';img.decoding='async';
      frame.append(img);
      const overlay=document.createElement('span');overlay.className='work-overlay';overlay.setAttribute('aria-hidden','true');const overlayText=document.createElement('span');icons.label(overlayText,t('viewWork'),'arrow-up-right');overlay.append(overlayText);frame.append(overlay);
      if(entry.video){const badge=document.createElement('span');badge.className='work-badge';icons.label(badge,t('videoBadge'),'play');frame.append(badge);}
      const meta=document.createElement('div');meta.className='work-meta';
      const copy=document.createElement('div'),title=document.createElement('h3'),tag=document.createElement('p');title.textContent=entry.title;tag.textContent=labels[entry.category];copy.append(title,tag);
      const estimate=document.createElement('p');estimate.className='service-estimate';estimate.dataset.serviceEstimate=entry.category==='makeup'?'beauty':entry.category;copy.append(estimate);
      const arrow=document.createElement('span');arrow.className='work-arrow';arrow.append(icons.create('arrow-up-right'));arrow.setAttribute('aria-hidden','true');meta.append(copy,arrow);
      button.append(frame,meta);article.append(button);button.addEventListener('click',()=>{
        grid.querySelectorAll('.work-open').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
        document.dispatchEvent(new CustomEvent('paca:catalog-select',{detail:{id:entry.id}}));
      });return article;
    });
    if (append) grid.append(...cards);
    else grid.replaceChildren(...cards);
    cards.forEach(reveal);
    updateEstimates();
    $('#catalog-status').textContent = filtered.length ? t('workCount',{visible:visible.length,total:filtered.length})+(category!=='all'?' · '+t(category):'') : t('noResults');
    $('#catalog-empty').hidden = filtered.length !== 0;
    more.hidden = filtered.length <= limit;
    document.dispatchEvent(new CustomEvent('paca:catalog-render',{detail:{entries:filtered}}));
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',()=>{
    category=button.dataset.filter;limit=9;
    document.querySelectorAll('[data-filter]').forEach(item=>{item.classList.toggle('is-active',item===button);item.setAttribute('aria-pressed',String(item===button));});
    render();
  }));
  more.addEventListener('click',()=>{const old=limit;limit+=9;render({append:true});grid.children[old]?.querySelector('button').focus({preventScroll:true});});
  $('#catalog-reset').addEventListener('click',()=>{
    if(loadFailed){loadCatalog();return;}
    category='all';limit=9;
    document.querySelectorAll('[data-filter]').forEach(item=>{item.classList.toggle('is-active',item.dataset.filter==='all');item.setAttribute('aria-pressed',String(item.dataset.filter==='all'));});render();
  });
  function stopMedia() { media.querySelector('video')?.pause();media.replaceChildren(); }
  function displayWork() {
    const entry=filtered[activeIndex];if(!entry)return;
    stopMedia();
    const img=document.createElement('img');img.src=entry.src;img.alt=entry.alt;img.width=entry.width;img.height=entry.height;media.append(img);
    $('#work-category').textContent=labels[entry.category];$('#work-title').textContent=entry.title;$('#work-description').textContent=entry.alt;
    $('#work-estimate').dataset.serviceEstimate=entry.category==='makeup'?'beauty':entry.category;updateEstimates();
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
      render();
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
    syncLabels();hero.alt=t('hero.'+heroKey);syncEmpty();
    updateEstimates();
    if(entries.length&&!loadFailed)render();
    if(activeId){activeIndex=Math.max(0,filtered.findIndex(item=>item.id===activeId));displayWork();}
  });
  window.PacaCatalog={get entries(){return filtered;}};
  loadCatalog();
})();
