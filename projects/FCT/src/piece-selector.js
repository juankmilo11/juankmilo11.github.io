import { catalog, roles, defaultLoadout, getLoadout, setLoadout, appearanceFor, characterInfo, thumbnailUrl } from './appearance.js';
import './piece-selector.css';

export function initPieceSelector({ playSound, onApply }) {
  const dialog = document.querySelector('#piece-selector');
  const roleList = dialog.querySelector('#appearance-roles');
  const characterList = dialog.querySelector('#appearance-characters');
  const colors = dialog.querySelector('#appearance-colors');
  const status = dialog.querySelector('#appearance-status');
  const summary = document.querySelector('#appearance-summary');
  const saveButton = dialog.querySelector('#appearance-save');
  let draft = getLoadout(), role = 'r', preview, previewPromise, request = 0;
  dialog.querySelector('#preview-rotate').setAttribute('aria-pressed',String(!matchMedia('(prefers-reduced-motion: reduce)').matches));
  function updateSummary() {
    summary.textContent = ['r','n','b'].map(id => characterInfo(getLoadout()[id]).name).join(' · ');
  }
  function button(text, handler, className) {
    const item = document.createElement('button'); item.type = 'button'; item.className = className;
    item.textContent = text; item.addEventListener('click', () => { playSound('sound1'); handler(); }); return item;
  }
  async function updatePreview() {
    const current = ++request;
    const human = appearanceFor(role,'w',draft), rival = appearanceFor(role,'b',draft);
    const info = characterInfo(human), enemy = characterInfo(rival);
    const palette = info.variants.find(v => v.id === human.palette);
    dialog.querySelector('#preview-human-name').textContent = `${info.name} · ${palette.label}`;
    dialog.querySelector('#preview-rival-name').textContent = `${enemy.name} · ${enemy.variants.find(v => v.id === rival.palette).label}`;
    dialog.querySelector('#preview-human-fallback').src = thumbnailUrl(human);
    dialog.querySelector('#preview-rival-fallback').src = thumbnailUrl(rival);
    status.textContent = 'Preparando los modelos…'; status.dataset.state = 'loading';
    try {
      if (!previewPromise) previewPromise = import('./piece-preview.js').then(({ createPiecePreview }) => {
        preview = createPiecePreview(dialog.querySelector('#piece-preview')); return preview;
      });
      const viewer = await previewPromise;
      await viewer.setLooks(human,rival);
      if (current !== request || !dialog.open) return;
      viewer.setActive(true);
      dialog.querySelector('.preview-fallbacks').hidden = true;
      status.textContent = 'Arrastra para ver la espalda y los laterales.'; status.dataset.state = 'ready';
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
    characterList.replaceChildren(...catalog.map(info => {
      const chosen = draft[role].character === info.id;
      const entry = button(info.name, () => { draft[role] = { character: info.id, palette: 0 }; render(`[data-character="${info.id}"]`); }, 'character-choice');
      const image = document.createElement('img');
      image.src = thumbnailUrl({ character: info.id, palette: chosen ? draft[role].palette : 0 }); image.alt = ''; image.width = 48; image.height = 60;
      entry.prepend(image); entry.setAttribute('aria-pressed',String(chosen)); entry.dataset.character = info.id;
      return entry;
    }));
    colors.replaceChildren(...characterInfo(draft[role]).variants.map(variant => {
      const swatch = button(`${variant.label} ${variant.id + 1}`, () => { draft[role].palette = variant.id; render(`[data-palette="${variant.id}"]`); }, 'palette-choice');
      swatch.style.setProperty('--swatch',variant.swatch);
      swatch.setAttribute('aria-pressed',String(draft[role].palette === variant.id)); swatch.dataset.palette = variant.id;
      return swatch;
    }));
    dialog.querySelector('#appearance-role-title').textContent = `Aspecto de ${roles.find(item => item.id === role).name.toLowerCase()}`;
    updatePreview();
    if (focusSelector) dialog.querySelector(focusSelector)?.focus({ preventScroll: true });
  }
  document.querySelector('#select-pieces').addEventListener('click', () => {
    playSound('sound1'); draft = getLoadout(); dialog.showModal(); render();
  });
  dialog.querySelector('#appearance-close').addEventListener('click', () => { playSound('sound1'); dialog.close(); });
  dialog.querySelector('#appearance-reset').addEventListener('click', () => { playSound('sound1'); draft = structuredClone(defaultLoadout); render(); });
  saveButton.addEventListener('click', () => {
    playSound('sound1'); const persisted = setLoadout(draft); updateSummary(); onApply(); dialog.close();
    if (!persisted) summary.textContent += ' · Guardado para esta sesión';
  });
  dialog.addEventListener('cancel', () => playSound('sound1'));
  dialog.addEventListener('close', () => { request++; preview?.setActive(false); document.querySelector('#select-pieces').focus({ preventScroll: true }); });
  dialog.querySelector('#preview-rotate').addEventListener('click', event => {
    playSound('sound1'); if (preview) event.currentTarget.setAttribute('aria-pressed',String(preview.toggleRotation()));
  });
  dialog.querySelector('#appearance-preview').addEventListener('click', () => {
    playSound('sound1'); dialog.querySelector('.selector-preview').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  updateSummary();
}
