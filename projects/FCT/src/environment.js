import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { terrainPalette, islandRadius } from './terrain.js';

// Seeded variation keeps the landscape stable between games and screenshots.
function randomSource(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
const textures = new Map();
function surfaceTexture(kind) {
  if (textures.has(kind)) return textures.get(kind);
  const random = randomSource(kind === 'grass' ? 72 : kind === 'earth' ? 91 : 38);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const i = (y * 256 + x) * 4;
      const grain = (random() - 0.5) * 36;
      const cloud = Math.sin(x * 0.047 + Math.sin(y * 0.035) * 2) * 9 + Math.cos(y * 0.061) * 6;
      const shade = 174 + grain + cloud;
      const tint = kind === 'grass' ? [0.94, 1, 0.88] : kind === 'earth' ? [1, 0.94, 0.81] : [1, 0.96, 0.87];
      for (let c = 0; c < 3; c++) image.data[i + c] = shade * tint[c];
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  // Fine fissures and mineral flecks give stone detail without noisy geometry.
  if (kind === 'stone') {
    for (let i = 0; i < 7; i++) {
      let x = random() * 256, y = random() * 256;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let j = 0; j < 5; j++) {
        x += (random() - 0.4) * 24; y += random() * 15;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#4a44372b'; ctx.lineWidth = 0.65; ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  textures.set(kind, texture);
  return texture;
}

export function stoneMaterial(options = {}) {
  return new THREE.MeshStandardMaterial({
    map: surfaceTexture('stone'), bumpMap: surfaceTexture('stone'),
    bumpScale: 0.025, roughness: 0.95, ...options,
  });
}

export function earthMaterial(options = {}) {
  return new THREE.MeshStandardMaterial({
    color: terrainPalette.earth, map: surfaceTexture('grass'),
    bumpMap: surfaceTexture('grass'), bumpScale: 0.018, roughness: 1, ...options,
  });
}

function mesh(world, geometry, material, x, y, z) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(x, y, z);
  object.castShadow = true;
  object.receiveShadow = true;
  world.add(object);
  return object;
}

function groundHeight(x, z) {
  const radius = Math.hypot(x, z);
  const edge = THREE.MathUtils.smoothstep(radius, 6.2, 8.7);
  // Keep the chessboard and the two capture galleries clear and level.
  return -0.055 - edge * 0.9 + edge * Math.sin(x * 2.2 + z * 1.6) * 0.09;
}

export function buildLandscape(world) {
  const random = randomSource(124);
  // A single closed cliff wall meets the turf boundary exactly; no stacked disks.
  const cliff = new THREE.BufferGeometry();
  const cliffPositions = [], cliffColors = [], cliffUvs = [], cliffIndices = [];
  const cliffSegments = 112, cliffBands = 8;
  for (let band = 0; band <= cliffBands; band++) {
    const t = band / cliffBands;
    for (let segment = 0; segment <= cliffSegments; segment++) {
      const angle = segment / cliffSegments * Math.PI * 2;
      const rim = islandRadius(angle) + 0.3;
      const radius = rim * (1 - t * 0.13) + Math.sin(angle * 13 + band * 0.8) * Math.sin(t * Math.PI) * 0.1;
      const x = Math.cos(angle), z = Math.sin(angle);
      cliffPositions.push(x * radius, groundHeight(x * rim, z * rim) - t * 1.8, z * radius);
      const shade = 0.72 + Math.sin(angle * 19 + band * 5) * 0.045 + (1 - t) * 0.2;
      cliffColors.push(shade, shade * 0.97, shade * 0.89);
      cliffUvs.push(segment / cliffSegments * 12, t * 2);
      if (band < cliffBands && segment < cliffSegments) {
        const a = band * (cliffSegments + 1) + segment, b = a + cliffSegments + 1;
        cliffIndices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
  }
  cliff.setAttribute('position', new THREE.Float32BufferAttribute(cliffPositions, 3));
  cliff.setAttribute('color', new THREE.Float32BufferAttribute(cliffColors, 3));
  cliff.setAttribute('uv', new THREE.Float32BufferAttribute(cliffUvs, 2));
  cliff.setIndex(cliffIndices);
  cliff.computeVertexNormals();
  mesh(world, cliff, stoneMaterial({ color: 0x827b63, bumpScale: 0.06, vertexColors: true }), 0, 0, 0);
  // Concentric rings avoid folded triangles around the circular perimeter.
  const surface = new THREE.BufferGeometry();
  const vertices = [0, groundHeight(0, 0), 0];
  const uvs = [0, 0];
  const indices = [];
  const segments = 112, rings = 32;
  for (let ring = 1; ring <= rings; ring++) {
    for (let segment = 0; segment < segments; segment++) {
      const angle = segment / segments * Math.PI * 2;
      const radius = ring / rings * (islandRadius(angle) + 0.3);
      const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
      vertices.push(x, groundHeight(x, z), z);
      uvs.push(x / 3, z / 3);
      const current = 1 + (ring - 1) * segments + segment;
      const next = 1 + (ring - 1) * segments + (segment + 1) % segments;
      if (ring === 1) indices.push(0, next, current);
      else {
        const inner = current - segments, innerNext = next - segments;
        indices.push(inner, next, current, inner, innerNext, next);
      }
    }
  }
  surface.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  surface.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  surface.setIndex(indices);
  const colors = [];
  for (let i = 0; i < vertices.length / 3; i++) {
    const variation = 0.86 + random() * 0.16;
    colors.push(variation, variation, variation * 0.96);
  }
  surface.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  surface.computeVertexNormals();
  mesh(world, surface, new THREE.MeshStandardMaterial({
    color: terrainPalette.earth, map: surfaceTexture('grass'), vertexColors: true,
    bumpMap: surfaceTexture('grass'), bumpScale: 0.045, roughness: 1,
  }), 0, 0, 0);

  const sandstone = stoneMaterial({ color: 0xb1a084 });
  const paleStone = stoneMaterial({ color: 0xc0b295 });
  const darkStone = stoneMaterial({ color: 0x7e8069 });
  // Grassy banks replace the two rigid stone rails, keeping capture slots clear.
  for (const side of [-1, 1]) {
    const bank = new THREE.PlaneGeometry(2.12, 8.8, 8, 32);
    bank.rotateX(-Math.PI / 2);
    const points = bank.attributes.position, uv = bank.attributes.uv;
    for (let i = 0; i < points.count; i++) {
      const x = points.getX(i), z = points.getZ(i);
      const edge = Math.max(Math.abs(x) / 1.06, Math.abs(z) / 4.4);
      const worldX = side * 5.15 + x + Math.sin(z * 2.1) * 0.055;
      const worldZ = z + Math.sin(x * 3.2) * 0.06;
      points.setXYZ(i, worldX, 0.105 - THREE.MathUtils.smoothstep(edge, 0.72, 1) * 0.15, worldZ);
      uv.setXY(i, worldX / 3, worldZ / 3);
    }
    bank.computeVertexNormals();
    mesh(world, bank, earthMaterial(), 0, 0, 0);
  }

  // Uneven flagstones leading to the old monastery, away from playable squares.
  const flag = new RoundedBoxGeometry(0.74, 0.11, 0.62, 2, 0.045);
  for (let i = 0; i < 24; i++) {
    const x = (i % 8 - 3.5) * 0.87;
    const z = -4.6 - Math.floor(i / 8) * 0.74;
    const stone = mesh(world, flag, i % 3 ? sandstone : darkStone, x, groundHeight(x, z) + 0.025, z);
    stone.rotation.y = (random() - 0.5) * 0.18;
  }

  // Worn masonry courses, buttresses and a rounded, open arch silhouette.
  const block = new RoundedBoxGeometry(0.66, 0.36, 0.5, 2, 0.055);
  for (const side of [-1, 1]) {
    for (let course = 0; course < 5; course++) {
      const count = course < 3 ? 3 : 2;
      for (let j = 0; j < count; j++) {
        const x = side * (1.4 + j * 0.68 + (course % 2) * 0.13);
        mesh(world, block, (course + j) % 3 ? sandstone : paleStone, x, 0.1 + course * 0.36, -6.15);
      }
    }
    mesh(world, new RoundedBoxGeometry(0.68, 0.65, 0.88, 3, 0.07), darkStone, side * 3.05, 0.18, -6.1);
    for (let course = 0; course < 4; course++) {
      mesh(world, new RoundedBoxGeometry(0.43, 0.35, 0.64, 2, 0.035), paleStone, side * 0.94, 0.12 + course * 0.35, -6.15);
    }
  }
  const arch = new THREE.Shape();
  arch.absarc(0, 0, 1.16, 0, Math.PI, false);
  arch.lineTo(-0.76, 0);
  arch.absarc(0, 0, 0.76, Math.PI, 0, true);
  arch.closePath();
  mesh(world, new THREE.ExtrudeGeometry(arch, {
    depth: 0.48, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.035,
    bevelSegments: 2, steps: 1, curveSegments: 24,
  }), sandstone, 0, 1.34, -6.4);

  // Smooth stones and scattered rubble share a single instanced draw call.
  const rocks = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), darkStone, 90);
  const transform = new THREE.Object3D();
  for (let i = 0; i < 90; i++) {
    const angle = random() * Math.PI * 2;
    const radius = 7.0 + random() * 1.25;
    const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
    const size = 0.07 + random() * 0.22;
    transform.position.set(x, groundHeight(x, z) + size * 0.28, z);
    transform.scale.set(size * 1.5, size * 0.7, size);
    transform.rotation.set(random(), random() * Math.PI, random() * 0.3);
    transform.updateMatrix(); rocks.setMatrixAt(i, transform.matrix);
  }
  rocks.castShadow = rocks.receiveShadow = true;
  world.add(rocks);

  // Grass grows around the perimeter; no foliage enters the capture galleries.
  const grass = new THREE.InstancedMesh(new THREE.ConeGeometry(0.055, 0.3, 5),
    new THREE.MeshStandardMaterial({ color: 0x697c42, roughness: 1 }), 260);
  for (let i = 0; i < 260; i++) {
    const angle = random() * Math.PI * 2, radius = 7.25 + random() * 1.0;
    const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
    transform.position.set(x, groundHeight(x, z) + 0.07, z);
    transform.scale.set(1, 0.5 + random(), 1);
    transform.rotation.set((random() - 0.5) * 0.35, random() * 6, 0.2);
    transform.updateMatrix(); grass.setMatrixAt(i, transform.matrix);
  }
  world.add(grass);

  const bark = stoneMaterial({ color: 0x61513a });
  const leafMaterials = [0x596e3d, 0x708049, 0x829058].map(color =>
    new THREE.MeshStandardMaterial({ color, map: surfaceTexture('grass'), roughness: 1 }));
  const canopy = new THREE.SphereGeometry(1, 18, 12);
  const foliage = canopy.attributes.position;
  for (let i = 0; i < foliage.count; i++) {
    const x = foliage.getX(i), y = foliage.getY(i), z = foliage.getZ(i);
    const scale = 1 + Math.sin(x * 9 + z * 7) * Math.cos(y * 8 - x * 3) * 0.09;
    foliage.setXYZ(i, x * scale, y * scale, z * scale);
  }
  canopy.computeVertexNormals();
  for (const [x, z] of [[-5.5, -5.1], [5.5, -5.2]]) {
    const y = groundHeight(x, z);
    mesh(world, new THREE.CylinderGeometry(0.11, 0.23, 1.8, 12), bark, x, y + 0.85, z);
    for (let i = 0; i < 5; i++) {
      const angle = i * 2.4;
      const crown = mesh(world, canopy, leafMaterials[i % 3], x + Math.cos(angle) * 0.4, y + 1.65 + random() * 0.65, z + Math.sin(angle) * 0.4);
      crown.scale.set(0.7, 0.62, 0.65);
    }
  }
}
