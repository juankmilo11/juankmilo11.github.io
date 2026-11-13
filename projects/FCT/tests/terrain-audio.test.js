import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { tileElevation } from '../src/terrain.js';
import { moveSound } from '../src/audio-cues.js';

test('all 64 squares form symmetric terraces with only four summit squares', () => {
  const summit = [];
  for (let row = 0; row < 8; row++) {
    for (let file = 0; file < 8; file++) {
      const height = tileElevation(row, file);
      assert.equal(height, tileElevation(7 - row, file));
      assert.equal(height, tileElevation(row, 7 - file));
      assert.equal(height, tileElevation(file, row));
      if (row === 0 || row === 7 || file === 0 || file === 7) assert.equal(height, 0.115);
      if (height === tileElevation(3, 3)) summit.push(`${file},${row}`);
    }
  }
  assert.deepEqual(summit, ['3,3', '4,3', '3,4', '4,4']);
  for (let ring = 1; ring < 4; ring++) {
    assert.ok(tileElevation(ring, ring) > tileElevation(ring - 1, ring - 1));
  }
  assert.ok(tileElevation(3, 3) - tileElevation(0, 0) < 0.5);
});

test('both sides share the previous human move cue and the previous AI capture cue', () => {
  const game = new Chess();
  for (const san of ['e4', 'd5']) {
    const move = game.move(san);
    assert.equal(moveSound(Boolean(move.captured)), 'AI_piece_move');
  }
  for (const san of ['exd5', 'Qxd5']) {
    const move = game.move(san);
    assert.ok(move.captured);
    assert.equal(moveSound(Boolean(move.captured)), 'user_piece_move');
  }
});

test('en passant also plays the capture cue', () => {
  const game = new Chess();
  for (const san of ['e4', 'a6', 'e5', 'd5']) game.move(san);
  const move = game.move('exd6');
  assert.ok(move.flags.includes('e'));
  assert.equal(moveSound(Boolean(move.captured)), 'user_piece_move');
});
