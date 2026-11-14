import * as THREE from 'three';
import { tileElevation } from './terrain.js';

// Flat playable patches joined by shared, jagged earth seams. Decorative only.
export function createMountainGeometry() {
  const positions = [], colors = [], uvs = [];
  function corner(row, file) {
    let sum = 0, count = 0;
    for (const r of [row - 1, row]) for (const f of [file - 1, file]) {
      if (r >= 0 && r < 8 && f >= 0 && f < 8) { sum += tileElevation(r, f); count++; }
    }
    return [file - 4, sum / count - 0.035 + Math.sin(row * 17 + file * 29) * 0.022, row - 4];
  }
  function triangle(a, b, c) {
    const variation = 0.86 + (Math.sin(a[0] * 27 + c[2] * 13) + 1) * 0.065;
    for (const p of [a, b, c]) {
      positions.push(...p); colors.push(variation, variation * 0.97, variation * 0.88);
      uvs.push(p[0] / 2, p[2] / 2);
    }
  }
  for (let row = 0; row < 8; row++) for (let file = 0; file < 8; file++) {
    const x = file - 3.5, z = row - 3.5, y = tileElevation(row, file) - 0.022;
    const inner = [[x - 0.45, y, z - 0.45], [x - 0.45, y, z + 0.45],
      [x + 0.45, y, z + 0.45], [x + 0.45, y, z - 0.45]];
    const outer = [corner(row, file), corner(row + 1, file), corner(row + 1, file + 1), corner(row, file + 1)];
    triangle(inner[0], inner[1], inner[2]); triangle(inner[0], inner[2], inner[3]);
    for (let edge = 0; edge < 4; edge++) {
      const next = (edge + 1) % 4;
      triangle(inner[edge], outer[edge], outer[next]);
      triangle(inner[edge], outer[next], inner[next]);
      if ((edge === 0 && file === 0) || (edge === 1 && row === 7) ||
          (edge === 2 && file === 7) || (edge === 3 && row === 0)) {
        const foot = p => [p[0] * 1.045, -0.052, p[2] * 1.045];
        triangle(outer[edge], foot(outer[edge]), foot(outer[next]));
        triangle(outer[edge], foot(outer[next]), outer[next]);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
}
