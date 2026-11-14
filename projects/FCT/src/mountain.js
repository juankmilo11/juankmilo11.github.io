import * as THREE from 'three';
import { tileElevation } from './terrain.js';

// Organic turf boundaries retain a flat, generously sized landing surface.
export function tileOutline(row, file) {
  const x = file - 3.5, z = row - 3.5;
  const inset = 0.478;
  return [[-inset, -inset], [-inset, 0], [-inset, inset], [0, inset],
    [inset, inset], [inset, 0], [inset, -inset], [0, -inset]].map(([dx, dz], i) => {
    const jitter = Math.sin(row * 31 + file * 17 + i * 4.7) * 0.012;
    return [x + dx * (1 + jitter), z + dz * (1 - jitter)];
  });
}

export function createTileGeometry(row, file) {
  const outline = tileOutline(row, file);
  const x = file - 3.5, z = row - 3.5;
  const vertices = [], uv = [];
  for (let i = 0; i < outline.length; i++) {
    for (const [px, pz] of [[x, z], outline[i], outline[(i + 1) % outline.length]]) {
      vertices.push(px - x, 0, pz - z); uv.push(px / 3, pz / 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.computeVertexNormals();
  return geometry;
}

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
      positions.push(...p); colors.push(variation, variation, variation);
      uvs.push(p[0] / 3, p[2] / 3);
    }
  }
  for (let row = 0; row < 8; row++) for (let file = 0; file < 8; file++) {
    const x = file - 3.5, z = row - 3.5, y = tileElevation(row, file) - 0.008;
    const inner = tileOutline(row, file).map(([px, pz]) => [px, y, pz]);
    const corners = [corner(row, file), corner(row + 1, file), corner(row + 1, file + 1), corner(row, file + 1)];
    const outer = corners.flatMap((a, i) => {
      const b = corners[(i + 1) % 4];
      return [a, a.map((v, c) => (v + b[c]) / 2)];
    });
    for (let edge = 0; edge < 8; edge++) {
      const next = (edge + 1) % 8;
      triangle([x, y, z], inner[edge], inner[next]);
      triangle(inner[edge], outer[edge], outer[next]);
      triangle(inner[edge], outer[next], inner[next]);
      if ((edge < 2 && file === 0) || (edge >= 2 && edge < 4 && row === 7) ||
          (edge >= 4 && edge < 6 && file === 7) || (edge >= 6 && row === 0)) {
        // Broad irregular shoulders dissolve the square footprint into the field.
        const shoulder = (p, t) => {
          const angle = Math.atan2(p[2], p[0]);
          const radius = Math.hypot(p[0], p[2]);
          const endRadius = 6.25 + Math.sin(angle * 5 + 0.7) * 0.18 + Math.sin(angle * 9) * 0.08;
          const r = radius + (endRadius - radius) * t;
          const y = p[1] * (1 - t) - 0.045 * t + Math.sin(angle * 11) * Math.sin(t * Math.PI) * 0.035;
          return [Math.cos(angle) * r, y, Math.sin(angle) * r];
        };
        for (let band = 0; band < 4; band++) {
          const a = shoulder(outer[edge], band / 4), b = shoulder(outer[next], band / 4);
          const c = shoulder(outer[edge], (band + 1) / 4), d = shoulder(outer[next], (band + 1) / 4);
          triangle(a, c, d); triangle(a, d, b);
        }
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
