import catalog from '../sprites/characters/catalog.json' with { type: 'json' };

export { catalog };
export const roles = [
  { id: 'p', name: 'Peones', glyph: '♙' }, { id: 'r', name: 'Torres', glyph: '♖' },
  { id: 'n', name: 'Caballos', glyph: '♘' }, { id: 'b', name: 'Alfiles', glyph: '♗' },
  { id: 'q', name: 'Reina', glyph: '♕' }, { id: 'k', name: 'Rey', glyph: '♔' },
];
export const defaultLoadout = {
  p: { character: 'squire-female', palette: 0 }, r: { character: 'knight-female', palette: 0 },
  n: { character: 'dragoon-female', palette: 0 }, b: { character: 'white-mage-female', palette: 0 },
  q: { character: 'agrias', palette: 0 }, k: { character: 'ramza', palette: 0 },
};
export const storageKey = 'fct.appearance.v1';
export function sanitizeLoadout(value) {
  return Object.fromEntries(roles.map(({ id }) => {
    const entry = value?.[id];
    const character = catalog.find(c => c.id === entry?.character);
    return [id, character && character.variants.some(v => v.id === entry.palette)
      ? { character: character.id, palette: entry.palette } : { ...defaultLoadout[id] }];
  }));
}
export function readLoadout(storage) {
  try { return sanitizeLoadout(JSON.parse((storage ?? globalThis.localStorage)?.getItem(storageKey))); }
  catch { return sanitizeLoadout(null); }
}
let loadout = readLoadout();
export function getLoadout() { return structuredClone(loadout); }
export function setLoadout(value) {
  loadout = sanitizeLoadout(value);
  try { localStorage.setItem(storageKey, JSON.stringify(loadout)); return true; }
  catch { return false; }
}
export function characterInfo(look) { return catalog.find(c => c.id === look.character); }
export function appearanceKey(look) { return `${look.character}-${look.palette}`; }
export function contrastingAppearance(look) {
  const character = characterInfo(look);
  const variant = character.variants.find(v => v.id === look.palette);
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const source = rgb(variant.swatch);
  const candidates = character.variants.length > 1 ? character.variants.filter(v => v.id !== look.palette).map(v => ({ ...look, palette: v.id }))
    : catalog.find(c => c.id === 'teta').variants.map(v => ({ character: 'teta', palette: v.id }));
  return candidates.reduce((best, candidate) => {
    const swatch = characterInfo(candidate).variants.find(v => v.id === candidate.palette).swatch;
    const score = rgb(swatch).reduce((sum, channel, i) => sum + (channel - source[i]) ** 2, 0);
    return !best || score > best.score ? { candidate, score } : best;
  }, null).candidate;
}
export function appearanceFor(type, color, source = loadout) {
  const look = source[type] ?? source.p;
  return color === 'b' ? contrastingAppearance(look) : look;
}
