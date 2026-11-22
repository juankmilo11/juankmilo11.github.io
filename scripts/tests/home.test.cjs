const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

// A small browser fixture keeps these interaction checks dependency-free.
// It deliberately does not emulate layout or replace visual browser QA.
function browser({ imageDelay = 0, imageFailure = false, reducedMotion = false } = {}) {
  let now = 0;
  let timerId = 0;
  let document;
  let window;
  const timers = new Map();
  const images = [];
  const schedule = (callback, delay = 0, repeat = false) => {
    const id = ++timerId;
    timers.set(id, { callback, at: now + Number(delay), repeat: repeat && Number(delay) });
    return id;
  };
  const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
  const advance = async (duration) => {
    const end = now + duration;
    await flush();
    for (let count = 0; count < 10000; count++) {
      const next = [...timers].filter(([, task]) => task.at <= end)
        .sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
      if (!next) { now = end; await flush(); return; }
      const [id, task] = next;
      now = task.at;
      if (task.repeat) task.at += task.repeat;
      else timers.delete(id);
      task.callback();
      await flush();
    }
    throw new Error('Unexpected runaway timers');
  };
  class Target {
    constructor() { this.listeners = new Map(); }
    addEventListener(type, handler) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(handler);
    }
    removeEventListener(type, handler) {
      this.listeners.set(type, (this.listeners.get(type) || []).filter(item => item !== handler));
    }
    dispatch(type, fields = {}) {
      const event = { type, target: this, preventDefault() { this.defaultPrevented = true; }, ...fields };
      for (const handler of this.listeners.get(type) || []) handler(event);
      return event;
    }
  }
  class Element extends Target {
    constructor(tag = 'div', className = '') {
      super();
      this.tagName = tag.toUpperCase();
      this.className = className;
      this.dataset = {};
      this.children = [];
      this.attributes = new Map();
      this.textContent = '';
      this.style = {
        setProperty(name, value) { this[name] = String(value); },
        removeProperty(name) { delete this[name]; },
        getPropertyValue(name) { return this[name] || ''; }
      };
      this.classList = {
        contains: name => this.className.split(/\s+/).includes(name),
        add: (...names) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...names])].join(' '); },
        remove: (...names) => { this.className = this.className.split(/\s+/).filter(name => !names.includes(name)).join(' '); },
        toggle: (name, force) => {
          const add = force === undefined ? !this.classList.contains(name) : force;
          this.classList[add ? 'add' : 'remove'](name);
          return add;
        }
      };
      if (tag === 'iframe') this.contentWindow = {};
    }
    append(...children) {
      for (const child of children) {
        child.parentElement?.children.splice(child.parentElement.children.indexOf(child), 1);
        child.parentElement = this;
        this.children.push(child);
      }
    }
    remove() {
      if (this.parentElement) this.parentElement.children.splice(this.parentElement.children.indexOf(this), 1);
      this.parentElement = null;
    }
    matches(selector) {
      return selector.split(',').some(part => {
        part = part.trim();
        if (part.startsWith(':')) return false;
        if (part.startsWith('.')) return this.classList.contains(part.slice(1));
        if (part.startsWith('#')) return this.id === part.slice(1);
        return this.tagName.toLowerCase() === part;
      });
    }
    querySelectorAll(selector) {
      return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) || null; }
    contains(child) { return this === child || this.children.some(item => item.contains(child)); }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    hasAttribute(name) { return this.attributes.has(name); }
    removeAttribute(name) { this.attributes.delete(name); }
    focus() { document.activeElement = this; }
    setPointerCapture() {}
    releasePointerCapture() {}
    get offsetWidth() { return this.classList.contains('ventana-paca') ? Math.min(1000, window.innerWidth - 24) : Math.min(600, window.innerWidth - 24); }
    get offsetHeight() { return this.classList.contains('ventana-paca') ? Math.min(740, window.innerHeight - 24) : Math.min(480, window.innerHeight - 24); }
    getBoundingClientRect() { return { left: parseFloat(this.style.left) || 0, top: parseFloat(this.style.top) || 0, width: this.offsetWidth, height: this.offsetHeight }; }
    animate() { return { cancel() {}, finished: Promise.resolve() }; }
    cloneNode() {
      const clone = new Element(this.tagName.toLowerCase(), this.className);
      for (const child of this.children) clone.append(child.cloneNode(true));
      return clone;
    }
  }
  document = new Target();
  document.body = new Element('body', 'fondo-oscurecido');
  document.documentElement = new Element('html');
  document.activeElement = document.body;
  document.hidden = false;
  document.visibilityState = 'visible';
  document.createElement = tag => new Element(tag);
  const controls = {
    '.boton_color': new Element('button', 'boton_color'),
    '.titulo': new Element('h1', 'titulo'),
    '#reloj': new Element(),
    '.escenario': new Element('button', 'escenario'),
    '.enlaces': new Element('nav', 'enlaces'),
    '.fondo-pantalla': new Element('div', 'fondo-pantalla')
  };
  const windowTemplate = new Element('section', 'ventana');
  const titlebar = new Element('header', 'barra-ventana');
  titlebar.append(new Element('h2'), new Element('a', 'abrir-pestana'), new Element('button', 'cerrar-ventana'));
  windowTemplate.append(titlebar, new Element('iframe'));
  controls['#plantilla-ventana'] = { content: { firstElementChild: windowTemplate } };
  const links = [
    ['pages/sura/index.html', 'LBDSEGUROS', '#8ecae6'],
    ['pages/paula/index.html', 'PACA | Paula Daniela · Beauty Studio', '#ed9ab5'],
    ['/FCT/', 'FCT: Fantasy Chess: Tactics', '#176b3a'],
    ['pages/admin/index.html', 'JK', '#d5af64']
  ].map(([href, name, color], index) => {
    const link = new Element('a', 'enlace');
    link.setAttribute('href', href);
    link.dataset = { windowTitle: name, barColor: color };
    link.textContent = name;

    return link;
  });
  document.querySelector = selector => controls[selector] || document.body.querySelector(selector);
  document.querySelectorAll = selector => selector === '.enlace' ? links : document.body.querySelectorAll(selector);
  window = new Target();
  Object.assign(window, { innerWidth: 1280, innerHeight: 900, matchMedia: () => ({ matches: reducedMotion, addEventListener() {} }) });
  const location = { origin: 'http://localhost:8000', reload() { throw new Error('Yin Yang must not reload the page'); } };
  window.location = location;
  class Image extends Target {
    constructor() { super(); this.complete = false; this.naturalWidth = 640; images.push(this); }
    set src(value) {
      this._src = value;
      schedule(() => {
        this.complete = !imageFailure;
        if (imageFailure) this.naturalWidth = 0;
        const type = imageFailure ? 'error' : 'load';
        this[`on${type}`]?.();
        this.dispatch(type);
      }, imageDelay);
    }
    get src() { return this._src; }
    decode() { return imageFailure ? Promise.reject(new Error('image unavailable')) : Promise.resolve(); }
  }
  const context = vm.createContext({
    document, window, location, Image, console, Intl, URL,
    Date: class extends Date { static now() { return now; } },
    performance: { now: () => now },
    setTimeout: (fn, delay) => schedule(fn, delay),
    clearTimeout: id => timers.delete(id),
    setInterval: (fn, delay) => schedule(fn, delay, true),
    clearInterval: id => timers.delete(id),
    requestAnimationFrame: fn => schedule(() => fn(now), 16),
    cancelAnimationFrame: id => timers.delete(id),
    matchMedia: window.matchMedia
  });
  vm.runInContext(source, context, { filename: 'script.js' });
  return {
    document, window, controls, links, images, context, advance,
    click: (selector) => controls[selector].dispatch('click'),
    windows: () => document.body.querySelectorAll('.ventana'),
    read: expression => vm.runInContext(expression, context)
  };
}

test('loading the homepage starts GIFs without opening windows or choosing a random color', async () => {
  const page = browser();
  assert.equal(page.document.documentElement.style.getPropertyValue('--page-bg'), '');
  await page.advance(15000);
  assert.equal(page.windows().length, 0);
  assert.ok(page.images.length >= 2, 'GIF rotation should keep loading subsequent backgrounds');
  for (const image of page.images) assert.ok(fs.existsSync(path.join(root,image.src)), 'Only request available backgrounds');
});

test('the configured backgrounds exactly match the GIFs on disk', () => {
  const page = browser();
  const configured = Array.from(page.read('fondosGif')).sort();
  const actual = fs.readdirSync(path.join(root, 'img/fondos'))
    .filter(name => name.endsWith('.gif')).map(name => `img/fondos/${name}`).sort();
  assert.ok(configured.length > 0);
  assert.deepEqual(configured, actual);
});

test('startup glitches for five seconds and blocks all bubbles until the deadline', async () => {
  const page = browser();
  const title = page.controls['.titulo'];
  const nav = page.controls['.enlaces'];
  const assertLocked = () => {
    assert.equal(title.classList.contains('titulo-glitch'), true);
    assert.equal(nav.hasAttribute('inert'), true);
    assert.equal(nav.getAttribute('aria-busy'), 'true');
    assert.equal(page.controls['.escenario'].disabled, true);
    for (const link of page.links) {
      assert.equal(link.getAttribute('aria-disabled'), 'true');
      assert.equal(link.getAttribute('tabindex'), '-1');
      for (const event of ['click', 'auxclick']) {
        assert.equal(link.dispatch(event).defaultPrevented, true);
      }
    }
    page.click('.escenario');
    assert.equal(page.windows().length, 0);
  };
  assertLocked();
  await page.advance(4999);
  assertLocked();
  await page.advance(1);
  assert.equal(title.classList.contains('titulo-glitch'), false);
  assert.equal(nav.hasAttribute('inert'), false);
  assert.equal(nav.hasAttribute('aria-busy'), false);
  assert.equal(page.controls['.escenario'].disabled, false);
  for (const link of page.links) {
    assert.equal(link.hasAttribute('aria-disabled'), false);
    assert.equal(link.hasAttribute('tabindex'), false);
  }
  assert.equal(Boolean(page.links[2].dispatch('click').defaultPrevented), true);
  assert.equal(Boolean(page.links[2].dispatch('auxclick').defaultPrevented), false);
  page.links[0].dispatch('click');
  assert.equal(page.windows().length, 2);
});

test('startup unlocks after five seconds even when GIFs are slow or unavailable, including reduced motion', async () => {
  for (const options of [{ imageDelay: 30000 }, { imageFailure: true }, { reducedMotion: true }]) {
    const page = browser(options);
    await page.advance(5000);
    assert.equal(page.controls['.titulo'].classList.contains('titulo-glitch'), false);
    assert.equal(page.controls['.enlaces'].hasAttribute('inert'), false);
    page.links[1].dispatch('click');
    assert.equal(page.windows().length, 1);
  }
});

function shownGif(page) {
  return page.document.body.style.getPropertyValue('--gif-fondo') || page.document.documentElement.style.getPropertyValue('--gif-fondo');
}

test('backgrounds are loaded before swapping and retain one second of blackout plus six seconds until the next blackout', async () => {
  const page = browser();
  await page.advance(999);
  assert.equal(shownGif(page), '', 'Initial GIF must wait for the blackout loading interval');
  assert.equal(page.document.body.classList.contains('fondo-oscurecido'), true);
  await page.advance(1);
  const first = shownGif(page);
  assert.match(first, /gif[1-9]\.gif/);
  assert.equal(page.document.body.classList.contains('fondo-oscurecido'), false, 'The reveal transition starts after the swap');
  await page.advance(5999);
  assert.equal(shownGif(page), first);
  assert.equal(page.document.body.classList.contains('fondo-oscurecido'), false);
  await page.advance(1);
  assert.equal(page.document.body.classList.contains('fondo-oscurecido'), true);
  assert.equal(shownGif(page), first, 'Keep the old image until the blackout finishes');
  await page.advance(1000);
  assert.notEqual(shownGif(page), first);
  assert.equal(page.document.body.classList.contains('fondo-oscurecido'), false);
});

test('one shuffled rotation visits every GIF and never immediately repeats across cycles', async () => {
  const page = browser();
  const count=page.read('fondosGif.length');
  await page.advance(1000);
  const shown = [shownGif(page)];
  for (let index = 1; index < count*2+1; index++) {
    await page.advance(7000);
    shown.push(shownGif(page));
  }
  assert.equal(new Set(shown.slice(0, count)).size, count);
  assert.equal(new Set(shown.slice(count, count*2)).size, count);
  for (let index = 1; index < shown.length; index++) assert.notEqual(shown[index], shown[index - 1]);
});

test('the rotation remains valid if only one GIF is retained later',()=>{
  const page=browser();
  page.read('fondosGif.splice(1);colaFondos=[];ultimoGifElegido=0');
  for(let i=0;i<4;i++)assert.equal(page.read('elegirSiguienteGif()'),0);
});

test('color mode persists until Yin Yang resumes GIFs without opening windows', async () => {
  const page = browser({ imageDelay: 2000 });
  await page.advance(500);
  page.click('.boton_color');
  const color = page.document.documentElement.style.getPropertyValue('--page-bg');
  assert.match(color, /^hsl\(/);
  await page.advance(2000);
  assert.equal(page.document.body.classList.contains('fondo-gif'), false, 'A stale image load must not overwrite the selected color');
  assert.equal(page.document.documentElement.style.getPropertyValue('--page-bg'), color);
  await page.advance(7000);
  assert.equal(page.document.body.classList.contains('fondo-gif'), false);
  assert.equal(page.controls['.boton_color'].getAttribute('aria-pressed'),'true');
  page.click('.escenario');await page.advance(1000);
  assert.equal(page.document.body.classList.contains('fondo-gif'),true);
  assert.equal(page.controls['.boton_color'].getAttribute('aria-pressed'),'false');
  assert.equal(page.windows().length,0);
});

test('unavailable GIFs leave the page visible and retry without opening windows', async () => {
  const page = browser({ imageFailure: true });
  await page.advance(30000);
  assert.equal(page.windows().length, 0);
  assert.equal(page.document.body.classList.contains('fondo-oscurecido'), false, 'Failed backgrounds must not leave a black screen');
  assert.ok(page.images.length >= 2, 'Failures must not stop the rotation permanently');
});

test('hidden tabs pause background rotation and resume without skipping prepared images', async () => {
  const page = browser();
  await page.advance(5000);
  const first = shownGif(page);
  const prepared = page.images[1].src;
  const loaded = page.images.length;
  page.document.hidden = true;
  page.document.dispatch('visibilitychange');
  await page.advance(60000);
  assert.equal(shownGif(page), first);
  assert.equal(page.images.length, loaded, 'No new GIF downloads while hidden');
  page.document.hidden = false;
  page.document.dispatch('visibilitychange');
  await page.advance(6000);
  assert.equal(shownGif(page), `url("${prepared}")`);
});

test('hiding during initial image loading prevents stale swaps and allows resuming', async () => {
  const page = browser({ imageDelay: 3000 });
  await page.advance(500);
  page.document.hidden = true;
  page.document.dispatch('visibilitychange');
  await page.advance(10000);
  assert.equal(shownGif(page), '');
  assert.equal(page.images.length, 1);
  assert.equal(page.document.body.classList.contains('fondo-oscurecido'), false);
  page.document.hidden = false;
  page.document.dispatch('visibilitychange');
  await page.advance(1000);
  assert.ok(shownGif(page));
});

test('visibility changes preserve manual color mode', async () => {
  const page = browser();
  await page.advance(5000);
  page.click('.boton_color');
  const color = page.document.documentElement.style.getPropertyValue('--page-bg');
  const loaded = page.images.length;
  page.document.hidden = true;
  page.document.dispatch('visibilitychange');
  await page.advance(30000);
  page.document.hidden = false;
  page.document.dispatch('visibilitychange');
  await page.advance(30000);
  assert.equal(page.document.documentElement.style.getPropertyValue('--page-bg'), color);
  assert.equal(page.document.body.classList.contains('fondo-gif'), false);
  assert.equal(page.images.length, loaded);
});

test('the clock updates at minute boundaries, pauses while hidden and refreshes on return', async () => {
  const page = browser();
  let updates = 0;
  Object.defineProperty(page.controls['#reloj'], 'textContent', {
    set() { updates++; }
  });
  await page.advance(59999);
  assert.equal(updates, 0);
  await page.advance(1);
  assert.equal(updates, 1);
  page.document.hidden = true;
  page.document.dispatch('visibilitychange');
  await page.advance(300000);
  assert.equal(updates, 1);
  page.document.hidden = false;
  page.document.dispatch('visibilitychange');
  assert.equal(updates, 2);
});

test('Yin Yang changes speed without opening windows or disturbing an active GIF cycle', async () => {
  const page=browser();await page.advance(5000);const first=shownGif(page);
  page.click('.escenario');page.click('.escenario');page.click('.escenario');
  await page.advance(1000);assert.equal(page.windows().length,0);assert.equal(shownGif(page),first);
  assert.equal(page.document.documentElement.style.getPropertyValue('--rotation-speed'),'0.5s');
  assert.equal(Boolean(page.links[2].dispatch('click').defaultPrevented),true);
});

test('bubbles open windows after startup and reuse existing iframes', async () => {
  const page=browser();await page.advance(5000);page.links[1].dispatch('click');const frame=page.windows()[0].querySelector('iframe');
  page.links[1].dispatch('click');assert.equal(page.windows().length,1);assert.equal(page.windows()[0].querySelector('iframe'),frame);
});

test('the title glitch ends after a few seconds and can restart on another Yin Yang click', async () => {
  const page = browser();
  await page.advance(5000);
  const title = page.controls['.titulo'];
  page.click('.escenario');
  assert.equal(title.classList.contains('titulo-glitch'), true);
  await page.advance(1800);
  assert.equal(title.classList.contains('titulo-glitch'), true);
  page.click('.escenario');
  await page.advance(1800);
  assert.equal(title.classList.contains('titulo-glitch'), true, 'The earlier click must not stop a restarted glitch');
  await page.advance(1500);
  assert.equal(title.classList.contains('titulo-glitch'), false);
});

test('closing the top window with Escape preserves other windows and allows reopening', async () => {
  const page = browser();
  await page.advance(5000);
  page.links[0].dispatch('click');page.links[1].dispatch('click');
  const top = page.windows().sort((a, b) => Number(b.style.zIndex) - Number(a.style.zIndex))[0];
  const removedFrame = top.querySelector('iframe');
  page.document.activeElement = removedFrame;
  page.document.dispatch('keydown', { key: 'Escape' });
  assert.equal(page.windows().length, 1);
  assert.equal(removedFrame.src, 'about:blank');
  assert.ok(page.links.includes(page.document.activeElement), 'Focus returns to the section link');
  page.links[1].dispatch('click');
  assert.equal(page.windows().length, 2);
});

test('PACA language messages require the matching iframe and origin, and size controls are absent', async () => {
  const page = browser();
  await page.advance(5000);
  page.links[1].dispatch('click');
  const paca = page.windows()[0];
  const frame = paca.querySelector('iframe');
  const message = { origin: 'http://localhost:8000', source: frame.contentWindow, data: { type: 'paca:language', language: 'es' } };
  page.window.dispatch('message', { ...message, origin: 'https://other.example' });
  assert.match(paca.querySelector('h2').textContent, /Beauty Studio/);
  page.window.dispatch('message', { ...message, source: {} });
  assert.match(paca.querySelector('h2').textContent, /Beauty Studio/);
  page.window.dispatch('message', message);
  assert.match(paca.querySelector('h2').textContent, /Estudio de belleza/);
  assert.equal(paca.querySelector('.ampliar-ventana'),null);
  assert.equal(paca.classList.contains('ventana-ampliada'),false);
});

test('windows open and reopen centered on desktop and mobile', async () => {
  for (const [width, height] of [[1280, 900], [375, 667], [812, 375]]) {
    const page = browser();
    await page.advance(5000);
    page.window.innerWidth = width;
    page.window.innerHeight = height;
    const assertCentered = popup => {
      assert.equal(parseFloat(popup.style.left), (width - popup.offsetWidth) / 2);
      assert.equal(parseFloat(popup.style.top), (height - popup.offsetHeight) / 2);
      assert.equal(popup.style.transform, 'none');
    };
    for (const link of page.links.slice(0, 2)) {
      link.dispatch('click');
      const popup = page.windows().at(-1);
      assertCentered(popup);
      popup.style.left = '0px';
      popup.style.top = '0px';
      link.dispatch('click');
      assertCentered(popup);
    }
    assert.equal(page.windows().length, 2, 'Reopening must preserve the existing windows');
  }
});

test('Yin Yang halo follows the hovered or focused bubble and clears on exit', () => {
  const page=browser(),style=page.document.documentElement.style;
  page.links[2].dataset.glowColor='#a8e8b5';
  for(const link of page.links){
    const expected=link.dataset.glowColor||link.dataset.barColor;
    link.dispatch('pointerenter');
    assert.equal(style.getPropertyValue('--yin-glow'),expected+'b3');
    assert.equal(style.getPropertyValue('--yin-glow-soft'),expected+'59');
    link.dispatch('pointerleave');assert.equal(style.getPropertyValue('--yin-glow'),'');
    link.dispatch('focus');assert.equal(style.getPropertyValue('--yin-glow'),expected+'b3');
    link.dispatch('blur');assert.equal(style.getPropertyValue('--yin-glow-soft'),'');
  }
});

test('windows stay within the viewport after resize and titlebar dragging', async () => {
  const page = browser();
  await page.advance(5000);
  page.links[0].dispatch('click');
  const popup = page.windows()[0];
  popup.style.left = '1200px';
  popup.style.top = '850px';
  page.window.innerWidth = 375;
  page.window.innerHeight = 667;
  page.window.dispatch('resize');
  assert.ok(parseFloat(popup.style.left) >= 0 && parseFloat(popup.style.left) + popup.offsetWidth <= 375);
  assert.ok(parseFloat(popup.style.top) >= 0 && parseFloat(popup.style.top) + popup.offsetHeight <= 667);
  const bar = popup.querySelector('.barra-ventana');
  bar.dispatch('pointerdown', { button: 0, pointerId: 1, clientX: 20, clientY: 20 });
  bar.dispatch('pointermove', { pointerId: 1, clientX: -200, clientY: -200 });
  assert.equal(parseFloat(popup.style.left), 0);
  assert.equal(parseFloat(popup.style.top), 0);
  bar.dispatch('pointerup', { pointerId: 1 });
  bar.dispatch('pointermove', { pointerId: 1, clientX: 200, clientY: 200 });
  assert.equal(parseFloat(popup.style.left), 0, 'Released pointers must not keep dragging');
});

test('JK opens the password gate and only its own iframe can change the window state', async () => {
  const page = browser();
  await page.advance(5000);
  page.links[3].dispatch('click');
  const popup = page.windows()[0], frame = popup.querySelector('iframe');
  assert.ok(popup.classList.contains('ventana-admin'));
  assert.equal(popup.querySelector('h2').textContent, 'JK');
  assert.equal(popup.classList.contains('admin-abierto'), false);
  const message = { origin: 'http://localhost:8000', source: frame.contentWindow, data: { type: 'admin:authenticated', authenticated: true } };
  page.window.dispatch('message', { ...message, origin: 'https://other.example' });
  page.window.dispatch('message', { ...message, source: {} });
  assert.equal(popup.classList.contains('admin-abierto'), false);
  page.window.dispatch('message', message);
  assert.ok(popup.classList.contains('admin-abierto'));
  assert.equal(popup.querySelector('h2').textContent, 'JK');
  page.window.dispatch('message', { ...message, data: { type: 'admin:authenticated', authenticated: false } });
  assert.equal(popup.classList.contains('admin-abierto'), false);
  assert.equal(popup.querySelector('h2').textContent, 'JK');
});

test('all bubbles including FCT open embedded windows with a new-tab action', async()=>{
  const page=browser();await page.advance(5000);
  for(const link of page.links){link.dispatch('click');const win=page.windows().at(-1),button=win.querySelector('.abrir-pestana');assert.ok(button);assert.equal(button.href,link.getAttribute('href'));}
  assert.equal(page.windows().length,4);
  const fct=page.windows()[2];assert.ok(fct.classList.contains('ventana-fct'));
  fct.querySelector('iframe').contentWindow.location={href:'https://example.test/FCT/tactics.html'};
  fct.querySelector('.abrir-pestana').dispatch('click');assert.equal(fct.querySelector('.abrir-pestana').href,'https://example.test/FCT/tactics.html');
});
