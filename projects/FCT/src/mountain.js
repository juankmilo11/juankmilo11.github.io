import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { tileElevation, groundHeight } from './terrain.js';

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
    for (const p of [a, b, c]) {
      const variation = .98 + Math.sin(p[0]*1.7+p[2]*1.3)*.015;
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

    }
  }
  // One closed perimeter joins all four sides, including their corner wedges.
  const boundary=[];
  for(let edge=0;edge<4;edge++)for(let step=0;step<16;step++){
    const v=-4+step*.5;
    const [x,z]=edge===0?[-4,v]:edge===1?[v,4]:edge===2?[4,-v]:[-v,-4];
    const row=z+4,file=x+4;
    const r0=Math.floor(row),f0=Math.floor(file);
    const a=corner(r0,f0),b=corner(Math.ceil(row),Math.ceil(file));
    boundary.push([x,(a[1]+b[1])/2,z]);
  }
  const shoulder=(p,t)=>{
    const angle=Math.atan2(p[2],p[0]),start=Math.hypot(p[0],p[2]);
    const radius=start+(7.8-start)*t;
    const x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;
    const ground=groundHeight(x,z);
    return [x,Math.max(p[1]*(1-t)+ground*t,ground)+.002*t,z];
  };
  for(let i=0;i<boundary.length;i++)for(let band=0;band<16;band++){
    const a=shoulder(boundary[i],band/16),b=shoulder(boundary[(i+1)%boundary.length],band/16);
    const c=shoulder(boundary[i],(band+1)/16),d=shoulder(boundary[(i+1)%boundary.length],(band+1)/16);
    triangle(a,c,d);triangle(a,d,b);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  const smooth=mergeVertices(geometry);geometry.dispose();smooth.computeVertexNormals();
  return smooth;
}
