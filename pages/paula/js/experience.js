(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const desktop = document.documentElement;
  const masthead = document.querySelector('.masthead');
  let frame = 0;
  const motionAllowed = () => !reduced.matches && !desktop.classList.contains('motion-paused');
  function updateScroll() {
    frame = 0;
    const total = desktop.scrollHeight - innerHeight;
    desktop.style.setProperty('--reading-progress', total > 0 ? Math.min(1, scrollY / total) : 0);
    masthead.classList.toggle('is-scrolled', scrollY > 12);
  }
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateScroll); }, { passive: true });
  addEventListener('resize', updateScroll);
  updateScroll();
  const grid = document.querySelector('#catalog-grid');
  let activeCard = null;
  function resetCard() {
    activeCard?.style.removeProperty('transform');
    activeCard = null;
  }
  grid.addEventListener('pointermove', event => {
    if (!finePointer.matches || !motionAllowed()) { resetCard(); return; }
    const card = event.target.closest('.work-open');
    if (card !== activeCard) { resetCard(); activeCard = card; }
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(1000px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-3px)`;
  });
  grid.addEventListener('pointerleave', resetCard);
  grid.addEventListener('focusin', resetCard);
  document.addEventListener('paca:motion', () => {
    resetCard();
    if (!motionAllowed()) document.getAnimations().forEach(animation => {
      const target=animation.effect?.target;
      if (target?.classList.contains('hero-previous') || target?.id==='hero-image') animation.finish();
    });
  });
})();
