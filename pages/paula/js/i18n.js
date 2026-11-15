(() => {
  'use strict';
  const locales = window.PacaLocales;
  let language = 'en';
  try { if (localStorage.getItem('paca-language') === 'es') language = 'es'; } catch (_) { /* Storage may be unavailable inside an iframe. */ }
  const bindings = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode, source = node.nodeValue.trim();
    if (node.parentElement.closest('script,style,noscript,textarea,pre') || !Object.hasOwn(locales.staticText, source)) continue;
    bindings.push({node,source,original:node.nodeValue});
  }
  const attributes = [];
  document.querySelectorAll('[aria-label],[title],[placeholder],[alt],meta[name="description"]').forEach(element => {
    for (const attribute of ['aria-label','title','placeholder','alt','content']) {
      const source=element.getAttribute(attribute);
      if(source && Object.hasOwn(locales.staticText,source))attributes.push({element,attribute,source});
    }
  });
  const languageButtons = document.querySelectorAll('[data-language]');
  function t(key, values = {}, lang = language) {
    const text = locales[lang]?.[key] ?? locales.en[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
  }
  function entry(item, lang = language) {
    return {...item,...(lang === 'es' ? item.translations?.es : {})};
  }
  function apply() {
    document.documentElement.lang = language;
    for(const {node,source,original} of bindings)node.nodeValue=original.replace(source,language==='es'?locales.staticText[source]:source);
    for(const {element,attribute,source} of attributes)element.setAttribute(attribute,language==='es'?locales.staticText[source]:source);
    languageButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
    document.dispatchEvent(new CustomEvent('paca:language',{detail:{language}}));
    if(window.parent!==window)window.parent.postMessage({type:'paca:language',language},location.origin);
  }
  window.PacaI18n={t,entry,get language(){return language;},setLanguage(value){
    if(!['en','es'].includes(value))return;
    language=value;
    try {localStorage.setItem('paca-language',language);}catch(_){}
    apply();
  }};
  languageButtons.forEach(button=>button.addEventListener('click',()=>window.PacaI18n.setLanguage(button.dataset.language)));
  apply();
})();
