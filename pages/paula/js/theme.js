(() => {
  'use strict';
  const button=document.querySelector('#theme-toggle');
  const root=document.documentElement;
  // Each new visit starts in day mode, regardless of the OS theme.
  let theme='light';
  function sync(){
    root.dataset.theme=theme;
    const label=window.PacaI18n.t(theme==='light'?'themeNight':'themeDay');
    button.setAttribute('aria-label',label);button.title=label;
    button.setAttribute('aria-pressed',String(theme==='dark'));
    button.replaceChildren(window.PacaIcons.create(theme==='light'?'moon':'sun'));
    if(window.parent!==window)window.parent.postMessage({type:'paca:theme',theme},location.origin);
  }
  button.addEventListener('click',()=>{theme=theme==='light'?'dark':'light';sync();});
  document.addEventListener('paca:language',sync);
  sync();
})();
