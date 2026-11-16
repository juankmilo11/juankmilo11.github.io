(() => {
  'use strict';
  const root = document.documentElement;
  const masthead = document.querySelector('.masthead');
  let frame = 0;
  let scrollRange = 0;
  let scrolled = false;

  function updateScroll() {
    frame = 0;
    root.style.setProperty('--reading-progress', scrollRange > 0 ? Math.min(1, scrollY / scrollRange) : 0);
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
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure);
  measure();

  // Animate only the visible portrait; no per-frame JavaScript or layout reads.
  const portrait=document.querySelector('.artist-portrait');
  if(portrait && 'IntersectionObserver' in window){
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let visible=false;
    const sync=()=>portrait.classList.toggle('is-animated',visible&&!document.hidden&&!reduced.matches);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0.15});
    observer.observe(portrait);
    document.addEventListener('visibilitychange',sync);
    reduced.addEventListener('change',sync);
  }
})();
