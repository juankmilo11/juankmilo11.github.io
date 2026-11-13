// Historical filenames were reversed in applyMove: the human heard AI_piece_move.
// Preserve the sounds the player actually heard, independent of the moving side.
export function moveSound(captured) {
  return captured ? 'user_piece_move' : 'AI_piece_move';
}
