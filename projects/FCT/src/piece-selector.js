import { roles, availableCharacters, getLoadout, setLoadout, appearanceFor, characterInfo, thumbnailUrl } from './appearance.js';
import './piece-selector.css';

export function initPieceSelector({ playSound, onApply }) {
  const dialog = document.querySelector('#piece-selector');
  const roleList = dialog.querySelector('#appearance-roles');
  const characterList = dialog.querySelector('#appearance-characters');
  const colors = dialog.querySelector('#appearance-colors');
  const status = dialog.querySelector('#appearance-status');
  const saveButton = dialog.querySelector('#appearance-save');
  let draft = getLoadout(), role = 'r', preview, previewPromise, request = 0;
  dialog.querySelector('#preview-rotate').setAttribute('aria-pressed',String(!matchMedia('(prefers-reduced-motion: reduce)').matches));
  function button(text, handler, className, sound = 'menu2') {
    const item = document.createElement('button'); item.type = 'button'; item.className = className;
    item.textContent = text; item.addEventListener('click', () => { playSound(sound); handler(); }); return item;
  }
  async function updatePreview() {
    const current = ++request;
    const human = appearanceFor(role,'w',draft);
    const info = characterInfo(human);
    const palette = info.variants.find(v => v.id === human.palette);
    dialog.querySelector('#piece-preview').setAttribute('aria-label',`Modelo 3D de ${info.name} · ${palette.label}`);
    dialog.querySelector('#preview-human-fallback').src = thumbnailUrl(human);
    status.textContent = 'Preparando los modelos…'; status.dataset.state = 'loading';
    try {
      if (!previewPromise) previewPromise = import('./piece-preview.js').then(({ createPiecePreview }) => {
        preview = createPiecePreview(dialog.querySelector('#piece-preview')); return preview;
      });
      const viewer = await previewPromise;
      await viewer.setLooks(human,role);
      if (current !== request || !dialog.open) return;
      viewer.setActive(true);
      dialog.querySelector('.preview-fallbacks').hidden = true;
      status.textContent = ''; status.dataset.state = 'ready';
    } catch (error) {
      if (current !== request) return;
      status.textContent = 'Vista 3D no disponible. Puedes elegir y guardar las apariencias.';
      status.dataset.state = 'fallback';
      dialog.querySelector('.preview-fallbacks').hidden = false;
      console.warn('Vista previa de piezas:', error);
    }
  }
  function render(focusSelector) {
    roleList.replaceChildren(...roles.map(item => {
      const tab = button(`${item.glyph} ${item.name}`, () => { role = item.id; render(`[data-role="${role}"]`); }, 'appearance-role');
      tab.setAttribute('aria-pressed',String(role === item.id)); tab.dataset.role = item.id; return tab;
    }));
    characterList.replaceChildren(...availableCharacters(role).map(info => {
      const chosen = draft[role].character === info.id;
      const entry = button('', () => { draft[role] = { character: info.id, palette: 0 }; render(`[data-character="${info.id}"]`); }, 'character-choice');
      entry.setAttribute('aria-label',info.name);
      const image = document.createElement('img');
      image.src = thumbnailUrl({ character: info.id, palette: chosen ? draft[role].palette : 0 }); image.alt = ''; image.width = 48; image.height = 60;
      entry.prepend(image); entry.setAttribute('aria-pressed',String(chosen)); entry.dataset.character = info.id;
      return entry;
    }));
    colors.replaceChildren(...characterInfo(draft[role]).variants.map(variant => {
      const swatch = button('', () => { draft[role].palette = variant.id; render(`[data-palette="${variant.id}"]`); }, 'palette-choice','menu3');
      swatch.setAttribute('aria-label',variant.label); swatch.title = variant.label;
      swatch.style.setProperty('--swatch',variant.swatch);
      swatch.setAttribute('aria-pressed',String(draft[role].palette === variant.id)); swatch.dataset.palette = variant.id;
      return swatch;
    }));
    updatePreview();
    if (focusSelector) dialog.querySelector(focusSelector)?.focus({ preventScroll: true });
  }
  document.querySelector('#select-pieces').addEventListener('click', () => {
    playSound('menu1'); draft = getLoadout(); dialog.showModal(); render();
  });
  dialog.querySelector('#appearance-close').addEventListener('click', () => { playSound('menu1'); dialog.close(); });
  saveButton.addEventListener('click', () => {
    playSound('menu4'); setLoadout(draft); onApply(); dialog.close();
  });
  dialog.addEventListener('cancel', () => playSound('menu1'));
  dialog.addEventListener('close', () => { request++; preview?.setActive(false); document.querySelector('#select-pieces').focus({ preventScroll: true }); });
  dialog.querySelector('#preview-rotate').addEventListener('click', event => {
    playSound('menu3'); if (preview) event.currentTarget.setAttribute('aria-pressed',String(preview.toggleRotation()));
  });
  dialog.querySelector('#appearance-preview').addEventListener('click', () => {
    playSound('menu2'); dialog.querySelector('.selector-preview').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
}
