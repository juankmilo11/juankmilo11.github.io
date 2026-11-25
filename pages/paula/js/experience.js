window.PacaMotion.mount(signal => {
  'use strict';
  const root = document.documentElement;
  const masthead = document.querySelector('.masthead');
  let frame = 0;
  let scrollRange = 0;
  let scrolled = false;
  const links = [...masthead.querySelectorAll('nav a')];
  const sections = links.map(link => document.querySelector(link.hash));
  function updateActive() {
    const edge = masthead.getBoundingClientRect().bottom + 100;
    let active = null;
    sections.forEach((section, index) => {
      const box = section.getBoundingClientRect();
      if (box.top <= edge && box.bottom > edge) active = links[index];
    });
    links.forEach(link => {
      if (link === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function updateScroll() {
    frame = 0;
    root.style.setProperty('--reading-progress', scrollRange > 0 ? Math.min(1, scrollY / scrollRange) : 0);
    updateActive();
    const next = scrollY > 12;
    if (next !== scrolled) {
      scrolled = next;
      masthead.classList.toggle('is-scrolled', next);
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(updateScroll);
  }
  function measure() {
    scrollRange = Math.max(0, root.scrollHeight - innerHeight);
    schedule();
  }
  // Measure when content changes; scrolling only updates a transform.
  const resize = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
  resize?.observe(document.body);
  addEventListener('scroll', schedule, { passive: true, signal });
  addEventListener('resize', measure, { signal });
  measure();

  const ticker=document.querySelector('.ticker');
  let tickerVisible=false;
  const syncTicker=()=>{ticker.querySelector('.ticker-track').style.animationPlayState=tickerVisible&&!document.hidden&&!window.PacaMotion.reduced.matches?'running':'paused';};
  const tickerObserver=new IntersectionObserver(entries=>{tickerVisible=entries[0].isIntersecting;syncTicker();});
  tickerObserver.observe(ticker);
  document.addEventListener('visibilitychange',syncTicker,{signal});
  window.PacaMotion.reduced.addEventListener('change',syncTicker,{signal});
  return ()=>{resize?.disconnect();tickerObserver.disconnect();cancelAnimationFrame(frame);ticker.querySelector('.ticker-track').style.animationPlayState='paused';};
});
