import { appearanceKey } from './appearance-core.js';
export * from './appearance-core.js';
const thumbnails = import.meta.glob('../sprites/characters/*-thumb.png', { eager: true, query: '?url', import: 'default' });
export function thumbnailUrl(look) { return thumbnails[`../sprites/characters/${appearanceKey(look)}-thumb.png`]; }
