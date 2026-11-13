import { Chess } from 'chess.js';

const VALUE = { p: 100, n: 315, b: 330, r: 500, q: 900, k: 0 };

self.onmessage = ({ data }) => {
  if (data?.type !== 'choose-move') return;
  const game = new Chess(data.fen);
  const depth = Math.max(1, Math.min(3, Number(data.depth) || 2));
  const moves = game.moves({ verbose: true });
  if (!moves.length) return;
  moves.sort((a, b) => movePriority(game, b) - movePriority(game, a));
  let bestMove = moves[0];
  let bestScore = -Infinity;
  let alpha = -Infinity;
  for (const move of moves) {
    game.move(move);
    const score = -negamax(game, depth - 1, -Infinity, -alpha, 1);
    game.undo();
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    alpha = Math.max(alpha, score);
  }
  self.postMessage({ type: 'move', requestId: data.requestId, move: `${bestMove.from}${bestMove.to}${bestMove.promotion ?? ''}` });
};

function negamax(game, depth, alpha, beta, ply) {
  if (game.isCheckmate()) return -100000 + ply;
  if (game.isDraw()) return 0;
  if (depth <= 0) return quiescence(game, alpha, beta, ply, 1);

  const moves = game.moves({ verbose: true });
  moves.sort((a, b) => movePriority(game, b) - movePriority(game, a));
  let best = -Infinity;
  for (const move of moves) {
    game.move(move);
    const score = -negamax(game, depth - 1, -beta, -alpha, ply + 1);
    game.undo();
    best = Math.max(best, score);
    alpha = Math.max(alpha, score);
    if (alpha >= beta) break;
  }
  return best;
}

function quiescence(game, alpha, beta, ply, remaining) {
  if (game.isCheckmate()) return -100000 + ply;
  if (game.isDraw()) return 0;
  if (remaining <= 0) return evaluate(game);

  const inCheck = game.isCheck();
  const standPat = evaluate(game);
  if (!inCheck) {
    if (standPat >= beta) return standPat;
    alpha = Math.max(alpha, standPat);
  }

  let moves = game.moves({ verbose: true });
  if (!inCheck) moves = moves.filter((move) => move.captured || move.promotion);
  if (!moves.length) return inCheck ? standPat : alpha;
  moves.sort((a, b) => movePriority(game, b) - movePriority(game, a));

  let best = inCheck ? -Infinity : standPat;
  for (const move of moves) {
    game.move(move);
    const score = -quiescence(game, -beta, -alpha, ply + 1, remaining - 1);
    game.undo();
    best = Math.max(best, score);
    alpha = Math.max(alpha, score);
    if (alpha >= beta) break;
  }
  return best;
}

function movePriority(game, move) {
  let score = move.captured ? 10 * VALUE[move.captured] - VALUE[move.piece] : 0;
  if (move.promotion) score += VALUE[move.promotion] + 800;
  if (move.san?.includes('+') || move.san?.includes('#')) score += 50;
  return score;
}

function evaluate(game) {
  let whiteScore = 0;
  const board = game.board();
  for (let row = 0; row < 8; row += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = board[row][file];
      if (!piece) continue;
      const sign = piece.color === 'w' ? 1 : -1;
      const rank = 8 - row;
      const advancement = piece.color === 'w' ? rank - 2 : 7 - rank;
      const center = 7 - (Math.abs(file - 3.5) + Math.abs(rank - 4.5));
      let positional = 0;
      if (piece.type === 'p') positional = advancement * 8 + center * 2;
      if (piece.type === 'n' || piece.type === 'b') positional = center * 8;
      if (piece.type === 'q') positional = center * 2;
      whiteScore += sign * (VALUE[piece.type] + positional);
    }
  }
  return game.turn() === 'w' ? whiteScore : -whiteScore;
}
