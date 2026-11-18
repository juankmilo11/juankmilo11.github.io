import { appearanceKey } from './appearance-core.js';
export * from './appearance-core.js';
const thumbnails = import.meta.glob('../sprites/characters/*-thumb.png', { eager: true, query: '?url', import: 'default' });
const poses = import.meta.glob(['../sprites/characters/*-check.png','../sprites/characters/*-defeated.png'], { eager: true, query: '?url', import: 'default' });
export function thumbnailUrl(look, pose='standing') {
  return (pose!=='standing'&&poses[`../sprites/characters/${appearanceKey(look)}-${pose}.png`]) || thumbnails[`../sprites/characters/${appearanceKey(look)}-thumb.png`];
}
