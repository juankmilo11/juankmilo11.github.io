(() => {
  'use strict';
  function create(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('paca-icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `assets/icons.svg#${name}`);
    svg.append(use);
    return svg;
  }
  function label(element, text, name) {
    element.replaceChildren(document.createTextNode(text), create(name));
  }
  window.PacaIcons = { create, label };
})();
