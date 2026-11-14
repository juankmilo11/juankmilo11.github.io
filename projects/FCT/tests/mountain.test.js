import test from 'node:test';
import assert from 'node:assert/strict';
import { createMountainGeometry, createTileGeometry } from '../src/mountain.js';
import { tileElevation } from '../src/terrain.js';

test('mountain seams have finite vertices, upward faces and remain below piece surfaces', () => {
  const geometry = createMountainGeometry();
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  for (let i = 0; i < positions.count; i++) {
    assert.ok(Number.isFinite(positions.getX(i)) && Number.isFinite(positions.getY(i)) && Number.isFinite(positions.getZ(i)));
    assert.ok(normals.getY(i) > 0, `inverted or degenerate face at ${i}`);
    assert.ok(positions.getY(i) < tileElevation(3, 3));
    assert.ok(Math.hypot(positions.getX(i), positions.getZ(i)) < 6.52);
  }
  // Every inter-square vertex uses a single height, preventing cracks.
  const seams = new Map();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), z = positions.getZ(i), y = positions.getY(i);
    if (!Number.isInteger(x) || !Number.isInteger(z)) continue;
    const key = `${x},${z}`;
    if (seams.has(key)) assert.equal(y, seams.get(key));
    seams.set(key, y);
  }
  assert.equal(seams.size, 81);
  geometry.dispose();
});

test('organic turf patches have flat landing surfaces and upward normals', () => {
  for (let row = 0; row < 8; row++) for (let file = 0; file < 8; file++) {
    const geometry = createTileGeometry(row, file);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      assert.equal(positions.getY(i), 0);
      assert.ok(geometry.attributes.normal.getY(i) > 0.99);
      assert.ok(Math.abs(positions.getX(i)) < 0.49 && Math.abs(positions.getZ(i)) < 0.49);
    }
    geometry.dispose();
  }
});
