import * as THREE from 'three';

const PIXEL = 0.026;
const linear = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
function alpha(image, x, y) { return x >= 0 && x < 32 && y >= 0 && y < 40 && image.data[(y * 32 + x) * 4 + 3] > 96; }
function rowBounds(image, y) {
  const xs = [];
  for (let x = 0; x < 32; x++) if (alpha(image, x, y)) xs.push(x);
  return xs.length ? [xs[0], xs.at(-1)] : null;
}
function pixelColor(image, x, y) {
  if (!rowBounds(image,y)) {
    for (let d = 1; d < 40; d++) {
      if (y + d < 40 && rowBounds(image,y + d)) { y += d; break; }
      if (y - d >= 0 && rowBounds(image,y - d)) { y -= d; break; }
    }
  }
  if (!alpha(image, x, y)) {
    for (let d = 1; d < 32; d++) {
      if (alpha(image, x - d, y)) { x -= d; break; }
      if (alpha(image, x + d, y)) { x += d; break; }
    }
  }
  const i = (y * 32 + Math.max(0, Math.min(31, x))) * 4;
  return [linear(image.data[i]), linear(image.data[i + 1]), linear(image.data[i + 2])];
}

// A visual hull from three original projections. Solid adjoining voxels have no
// internal faces or gaps; actual back/profile colors replace extruded front edges.
export function sculptCharacter(front, back, side) {
  let top = 39;
  for (let y = 0; y < 40; y++) if (rowBounds(front, y) || rowBounds(back, y)) { top = y; break; }
  const height = (40 - top) * PIXEL;
  const pivots = {
    body: [0, height * 0.32, 0], head: [0, height * 0.69, 0],
    leftArm: [-0.14, height * 0.54, 0], rightArm: [0.14, height * 0.54, 0],
    leftLeg: [-0.07, height * 0.23, 0], rightLeg: [0.07, height * 0.23, 0],
  };
  const cells = new Map();
  for (let y = top; y < 40; y++) {
    const f = rowBounds(front, y), b = rowBounds(back, y);
    if (!f && !b) continue;
    const bounds = f ?? b;
    let profile = rowBounds(side, y);
    for (let d = 1; !profile && d < 4; d++) profile = rowBounds(side, Math.min(39, y + d)) ?? rowBounds(side, Math.max(top, y - d));
    if (!profile) continue;
    const cx = (bounds[0] + bounds[1]) / 2, halfX = (bounds[1] - bounds[0] + 1) / 2;
    const cz = (profile[0] + profile[1]) / 2, halfZ = (profile[1] - profile[0] + 1) / 2;
    for (let x = 0; x < 32; x++) {
      if (!alpha(front, x, y) && !alpha(back, 31 - x, y)) continue;
      const nx = (x - cx) / Math.max(1, halfX);
      const depth = halfZ * Math.sqrt(Math.max(0.12, 1 - nx * nx * 0.72));
      for (let z = Math.ceil(cz - depth); z <= Math.floor(cz + depth); z++) {
        if (z < 0 || z > 31) continue;
        const vertical = (39 - y) * PIXEL;
        const part = vertical > height * 0.69 ? 'head' : vertical < height * 0.23
          ? (x < cx ? 'leftLeg' : 'rightLeg') : vertical > height * 0.30 && Math.abs(nx) > 0.62
            ? (x < cx ? 'leftArm' : 'rightArm') : 'body';
        cells.set(`${x},${y},${z}`, { x, y, z, part, centerZ: cz });
      }
    }
  }
  const parts = Object.fromEntries(Object.keys(pivots).map(key => [key, { positions: [], normals: [], colors: [] }]));
  const faces = [
    { d: [1,0,0], n: [1,0,0], corners: [[1,0,1],[1,0,0],[1,1,0],[1,1,1]] },
    { d: [-1,0,0], n: [-1,0,0], corners: [[0,0,0],[0,0,1],[0,1,1],[0,1,0]] },
    { d: [0,-1,0], n: [0,1,0], corners: [[0,1,1],[1,1,1],[1,1,0],[0,1,0]] },
    { d: [0,1,0], n: [0,-1,0], corners: [[0,0,0],[1,0,0],[1,0,1],[0,0,1]] },
    { d: [0,0,1], n: [0,0,1], corners: [[0,0,1],[1,0,1],[1,1,1],[0,1,1]] },
    { d: [0,0,-1], n: [0,0,-1], corners: [[1,0,0],[0,0,0],[0,1,0],[1,1,0]] },
  ];
  for (const { x, y, z, part, centerZ } of cells.values()) {
    const data = parts[part], pivot = pivots[part];
    for (const face of faces) {
      const adjacent = cells.get(`${x + face.d[0]},${y + face.d[1]},${z + face.d[2]}`);
      if (adjacent?.part === part) continue;
      // The profile sprite faces LEFT: anterior colors belong at +Z on BOTH
      // sides. Never paint front eyes on rear-facing stairs or the back of a head.
      const color = z < centerZ || face.n[2] < 0 ? pixelColor(back, 31 - x, y)
        : face.n[2] > 0 ? pixelColor(front, x, y)
          : pixelColor(side, 31 - z, y);
      for (const index of [0,1,2,0,2,3]) {
        const p = face.corners[index];
        data.positions.push((x - 16 + p[0]) * PIXEL - pivot[0],
          (39 - y + p[1]) * PIXEL - pivot[1], (z - 16 + p[2]) * PIXEL - pivot[2]);
        data.normals.push(...face.n); data.colors.push(...color);
      }
    }
  }
  return { height, parts: Object.entries(parts).filter(([, data]) => data.positions.length).map(([name, data]) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(data.normals, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.colors, 3));
    geometry.computeBoundingSphere();
    return { name, geometry, pivot: pivots[name] };
  }), voxelCount: cells.size };
}
