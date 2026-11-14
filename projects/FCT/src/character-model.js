import * as THREE from 'three';
import { sculptCharacter } from './character-volume.js';
import { appearanceKey, characterHeight } from './appearance.js';

const urls = import.meta.glob('../sprites/characters/*.png', { eager: true, query: '?url', import: 'default' });
const cache = new Map();
let usedAt = 0;
const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0 });
function readViews(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = 96; canvas.height = 40;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      resolve([0,32,64].map(x => context.getImageData(x, 0, 32, 40)));
    };
    image.onerror = () => reject(new Error(`No se pudo cargar el personaje: ${url}`));
    image.src = url;
  });
}
export function loadCharacter(look) {
  const key = appearanceKey(look);
  if (!cache.has(key)) {
    const entry = { references: 0, usedAt: ++usedAt };
    entry.promise = readViews(urls[`../sprites/characters/${key}.png`]).then(views => {
      entry.data = sculptCharacter(...views); return entry.data;
    });
    cache.set(key,entry);
  }
  cache.get(key).usedAt = ++usedAt;
  return cache.get(key).promise;
}
function trimCache() {
  const unused = [...cache.entries()].filter(([,entry]) => entry.references === 0 && entry.data).sort((a,b) => a[1].usedAt-b[1].usedAt);
  // Keep a small warm cache; browsing every palette must not accumulate GPU buffers.
  while (unused.length > 6) {
    const [key,entry] = unused.shift();
    entry.data.parts.forEach(part => part.geometry.dispose()); cache.delete(key);
  }
}
export function releaseCharacter(character) {
  if (!character || character.userData.released) return;
  character.userData.released = true;
  const entry = cache.get(character.userData.appearanceKey);
  if (entry) entry.references = Math.max(0,entry.references-1);
  character.userData.ready.finally(trimCache).catch(() => {});
  character.clear();
}
export function createCharacter(look, facing = 0, role = 'p') {
  const character = new THREE.Group();
  character.rotation.y = facing;
  character.userData.rig = {};
  character.userData.appearanceKey = appearanceKey(look);
  const loading = loadCharacter(look);
  cache.get(appearanceKey(look)).references++;
  character.userData.ready = loading.then(data => {
    if (character.userData.released) return character;
    character.scale.setScalar(characterHeight(role)/Math.max(data.height,0.1));
    for (const part of data.parts) {
      const joint = new THREE.Mesh(part.geometry, material);
      joint.position.fromArray(part.pivot);
      joint.castShadow = joint.receiveShadow = true;
      character.add(joint);
      character.userData.rig[part.name] = { mesh: joint, pivot: part.pivot };
    }
    character.userData.height = data.height;
    character.userData.voxelCount = data.voxelCount;
    return character;
  });
  return character;
}
export { animateCharacter } from './character-motion.js';
