(() => {
  'use strict';
  const factories = [], cleanups = [], failedAssets = new Set();
  let mounted = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function mount(factory) {
    factories.push(factory);
    if (mounted) start(factory);
  }
  function start(factory) {
    const controller = new AbortController();
    try {
      const dispose = factory(controller.signal);
      cleanups.push(() => { controller.abort(); dispose?.(); });
    } catch (error) { controller.abort(); console.error('PACA motion:', error); }
  }
  // One on-demand animation clock per section. No hidden-tab or offscreen loops.
  function section(node, paint, signal, threshold = 0) {
    let frame = 0, last = 0, visible = false;
    const cancel = () => { cancelAnimationFrame(frame); frame = 0; last = 0; node.dataset.motionRunning = 'false'; };
    function request() {
      if (signal.aborted || document.hidden || !visible || frame) return;
      frame = requestAnimationFrame(tick);
    }
    function tick(now) {
      frame = 0;
      const dt = last ? Math.min(50, now - last) : 16.67;
      last = now;
      node.dataset.motionRunning = 'true';
      const again = paint(now, dt, reduced.matches);
      if (again && !reduced.matches) request();
      else { last = 0; node.dataset.motionRunning = 'false'; }
    }
    function sync() {
      cancel();
      if (reduced.matches) paint(performance.now(), 0, true);
      request();
    }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting && entries[0].intersectionRatio >= threshold; sync(); }, {threshold});
    observer.observe(node);
    document.addEventListener('visibilitychange', sync, {signal});
    reduced.addEventListener('change', sync, {signal});
    signal.addEventListener('abort', () => { cancel(); observer.disconnect(); }, {once:true});
    return {request, get visible() { return visible; }};
  }
  function reportAsset(url) {
    if(failedAssets.has(url))return;
    failedAssets.add(url);
    console.error('PACA asset failed: ' + url);
    document.dispatchEvent(new CustomEvent('paca:asset-error', {detail:{url}}));
    const message = document.createElement('p');
    message.className = 'asset-error'; message.setAttribute('role','status');
    message.textContent = (document.documentElement.lang === 'es' ? 'No se pudo cargar: ' : 'Could not load: ') + url;
    document.querySelector('main').append(message);
  }
  addEventListener('pagehide', () => { mounted = false; cleanups.splice(0).reverse().forEach(dispose => dispose()); });
  addEventListener('pageshow', event => { if (event.persisted && !mounted) { mounted = true; factories.forEach(start); } });
  window.PacaMotion = {mount, section, reduced, reportAsset};
  mount(signal=>{
    document.addEventListener('error',event=>{
      if(event.target instanceof HTMLImageElement)reportAsset(event.target.currentSrc||event.target.src);
    },{capture:true,signal});
  });
})();
