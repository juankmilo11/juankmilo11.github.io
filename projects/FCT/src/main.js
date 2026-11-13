import { Chess } from 'chess.js';
import './style.css';

const game = new Chess();
const board2d = document.querySelector('#board-2d');
const board3dHost = document.querySelector('#board-3d');
const statusEl = document.querySelector('#game-status');
const turnPulse = document.querySelector('#turn-pulse');
const inspectorIcon = document.querySelector('#inspector-icon');
const inspectorName = document.querySelector('#inspector-name');
const inspectorDescription = document.querySelector('#inspector-description');
const pieceInspector = document.querySelector('.piece-inspector');
const promotionDialog = document.querySelector('#promotion-dialog');
const exitConfirmation = document.querySelector('#exit-confirmation');
const aiWorker = new Worker(new URL('./ai-worker.js', import.meta.url), { type: 'module' });
const backgroundMusic = document.querySelector('#background-music');
const audioToggle = document.querySelector('#audio-toggle');
const audioHide = document.querySelector('#audio-hide');
const audioReopen = document.querySelector('#audio-reopen');
const audioControl = document.querySelector('.audio-control');
let musicEnabledByCombat = false;

const classNames = { p: 'Squire', r: 'Knight', n: 'Dragoon', b: 'Mago', q: 'Agrias', k: 'Ramza' };
const pieceNames = { p: 'Peón', r: 'Torre', n: 'Caballo', b: 'Alfil', q: 'Reina', k: 'Rey' };
const pieceGlyphs = {
  w: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
  b: { p: '♙', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' },
};

const difficulty = 3;
let selectedSquare = null;
let dragTargets = new Set();
const idleDelaysBySquare = new Map();
let recentMoveAnimation = null;
let moveAnimationSequence = 0;
let requestedView = '2d';
let thinking = false;
let aiRequestId = 0;
let pendingPromotion = null;
let reviewMoves = [];
let reviewPosition = 0;
let isReviewing = false;
let threeBoard;
let threeBoardPromise;
const appShell = document.querySelector('.app-shell');

function requestAiMove() {
  aiRequestId += 1;
  aiWorker.postMessage({ type: 'choose-move', requestId: aiRequestId, fen: game.fen(), depth: difficulty });
}

function syncAudioControl() {
  const muted = backgroundMusic.muted;
  audioToggle.textContent = muted ? '♪̸' : '♫';
  audioToggle.setAttribute('aria-pressed', String(muted));
  audioToggle.setAttribute('aria-label', muted ? 'Activar música' : 'Silenciar música');
  audioToggle.title = muted ? 'Activar música' : 'Silenciar música';
}
function startBackgroundMusic() {
  if (!musicEnabledByCombat) return;
  backgroundMusic.play().then(syncAudioControl).catch(() => {});
}
audioToggle.addEventListener('click', () => {
  backgroundMusic.muted = !backgroundMusic.muted;
  if (!backgroundMusic.muted) startBackgroundMusic();
  syncAudioControl();
});
syncAudioControl();

function squareName(row, file) {
  return `${String.fromCharCode(97 + file)}${8 - row}`;
}

function idleDelayForSquare(square) {
  if (!idleDelaysBySquare.has(square)) idleDelaysBySquare.set(square, -(Math.random() * 3.8));
  return idleDelaysBySquare.get(square);
}

function characterClassName(piece) {
  if (piece.type === 'q') return piece.color === 'w' ? 'Agrias' : 'Teta';
  if (piece.type === 'k') return piece.color === 'w' ? 'Ramza' : 'Delita';
  return classNames[piece.type];
}

function describePiece(piece) {
  pieceInspector.hidden = !piece;
  if (!piece) {
    inspectorIcon.textContent = '✦';
    inspectorName.textContent = 'Elige una pieza';
    inspectorDescription.textContent = 'Selecciona una pieza para ver su clase en el campo.';
    return;
  }
  inspectorIcon.textContent = pieceGlyphs[piece.color][piece.type];
  inspectorName.textContent = `${pieceNames[piece.type]} · ${characterClassName(piece)}`;
  inspectorDescription.textContent = piece.color === 'w' ? 'Vanguardia · jugador' : 'Legión · estratega';
}

function render2D() {
  const board = game.board();
  const history = game.history({ verbose: true });
  const selectedPiece = selectedSquare ? game.get(selectedSquare) : null;
  const legalMoves = selectedPiece?.color === game.turn() && !thinking && !game.isGameOver()
    ? game.moves({ square: selectedSquare, verbose: true }) : [];
  const targets = new Set(legalMoves.map((move) => move.to));
  const lastMove = history.at(-1);
  const checkedKing = game.isCheck() ? findKing(game.turn()) : null;
  board2d.innerHTML = '';

  board.forEach((rank, row) => rank.forEach((piece, file) => {
    const square = squareName(row, file);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = `square ${(row + file) % 2 ? 'dark' : 'light'}`;
    cell.dataset.square = square;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `${square}${piece ? `, ${pieceNames[piece.type]} ${piece.color === 'w' ? 'blanca' : 'negra'}, clase ${characterClassName(piece)}` : ''}`);
    if (square === selectedSquare) cell.classList.add('selected');
    if (targets.has(square)) cell.classList.add(piece ? 'capture-target' : 'move-target');
    if (lastMove && (square === lastMove.from || square === lastMove.to)) cell.classList.add('last-move');
    if (square === checkedKing) cell.classList.add('in-check');
    if (piece) {
      const token = document.createElement('span');
      token.className = `piece-token ${piece.color === 'w' ? 'piece-white' : 'piece-black'}`;
      token.textContent = pieceGlyphs[piece.color][piece.type];
      token.draggable = false;
      token.dataset.from = square;
      token.title = `${pieceNames[piece.type]} · ${characterClassName(piece)}`;
      token.style.setProperty('--idle-delay', `${idleDelayForSquare(square)}s`);
      if (requestedView === '2d' && recentMoveAnimation?.to === square && !recentMoveAnimation.applied) {
        token.classList.add(recentMoveAnimation.reversed ? 'piece-rewind-arrival' : recentMoveAnimation.captured ? 'piece-capture-arrival' : 'piece-move-arrival');
        token.style.setProperty('--move-tilt', `${(Math.random() * 6 - 3).toFixed(1)}deg`);
        recentMoveAnimation.applied = true;
        if (recentMoveAnimation.captured) cell.classList.add('capture-impact');
      }
      cell.append(token);
    }
    board2d.append(cell);
  }));

  renderRemainingPieces(board);
  board2d.classList.toggle('board-locked', thinking || game.isGameOver());
  threeBoard?.update(game.board(), {
    selectedSquare,
    targets,
    lastMove,
    lastMoveIndex: history.length - 1,
    checkedKing,
    animationMove: recentMoveAnimation,
  });
}

function renderRemainingPieces(board) {
  const piecesByColor = { w: [], b: [] };
  const capturedByColor = { w: [], b: [] };
  board.flat().forEach((piece) => {
    if (piece) piecesByColor[piece.color].push(piece);
  });
  game.history({ verbose: true }).forEach((move) => {
    if (move.captured) capturedByColor[move.color === 'w' ? 'b' : 'w'].push(move.captured);
  });
  for (const color of ['b', 'w']) {
    const strip = document.querySelector(`#remaining-${color === 'w' ? 'white' : 'black'}`);
    const icons = strip.querySelector('.remaining-icons');
    const captured = strip.querySelector('.captured-icons');
    const count = strip.querySelector('.remaining-count');
    const pieces = piecesByColor[color].sort((a, b) => 'kqrbnp'.indexOf(a.type) - 'kqrbnp'.indexOf(b.type));
    count.textContent = String(pieces.length);
    icons.replaceChildren(...pieces.map((piece) => {
      const icon = document.createElement('span');
      icon.textContent = pieceGlyphs[color][piece.type];
      icon.title = `${pieceNames[piece.type]} en juego`;
      return icon;
    }));
    captured.replaceChildren(...capturedByColor[color].map((type) => {
      const icon = document.createElement('span');
      icon.textContent = pieceGlyphs[color][type];
      icon.title = `${pieceNames[type]} capturada`;
      return icon;
    }));
  }
}

function findKing(color) {
  const board = game.board();
  for (let row = 0; row < 8; row += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = board[row][file];
      if (piece?.type === 'k' && piece.color === color) return squareName(row, file);
    }
  }
  return null;
}

function handleSquare(square) {
  if (!square) return;
  const piece = game.get(square);
  const canMove = !thinking && !isReviewing && !game.isGameOver() && game.turn() === 'w';
  if (selectedSquare && canMove) {
    const moves = game.moves({ square: selectedSquare, verbose: true }).filter((move) => move.to === square);
    if (moves.length) {
      if (moves.some((move) => move.promotion)) {
        pendingPromotion = { from: selectedSquare, to: square };
        promotionDialog.showModal();
      } else {
        commitMove({ from: selectedSquare, to: square });
      }
      return;
    }
  }
  if (piece?.color === 'w' && canMove) {
    selectedSquare = square;
    describePiece(piece);
  } else if (piece) {
    selectedSquare = null;
    describePiece(piece);
  } else {
    selectedSquare = null;
    describePiece(null);
  }
  renderAll();
}

function handleDragMove(from, to) {
  if (!from || !to || thinking || isReviewing || game.isGameOver() || game.turn() !== 'w') return false;
  const source = game.get(from);
  if (!source || source.color !== 'w') return false;
  const moves = game.moves({ square: from, verbose: true }).filter((move) => move.to === to);
  if (!moves.length) {
    handleSquare(from);
    return false;
  }
  if (moves.some((move) => move.promotion)) {
    pendingPromotion = { from, to };
    promotionDialog.showModal();
  } else {
    commitMove({ from, to });
  }
  return true;
}

function animateCapturedPiece(square) {
  if (requestedView !== '2d' || board2d.classList.contains('hidden')) return;
  const target = board2d.querySelector(`[data-square="${square}"] .piece-token`);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const ghost = target.cloneNode(true);
  ghost.classList.remove('piece-move-arrival', 'piece-capture-arrival');
  ghost.classList.add('piece-captured-ghost');
  ghost.removeAttribute('data-from');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  document.body.append(ghost);
  window.setTimeout(() => ghost.remove(), 460);
}

function applyMove(move, requestAiAfterMove) {
  if (isReviewing) return false;
  const captured = Boolean(game.get(move.to));
  if (captured) animateCapturedPiece(move.to);
  try {
    game.move(move);
  } catch {
    return false;
  }
  selectedSquare = null;
  describePiece(null);
  const animationId = ++moveAnimationSequence;
  recentMoveAnimation = {
    id: animationId,
    from: move.from,
    to: move.to,
    plyIndex: game.history().length - 1,
    captured,
    applied: false,
  };
  thinking = requestAiAfterMove && !game.isGameOver();
  renderAll();
  window.setTimeout(() => {
    if (recentMoveAnimation?.id === animationId) recentMoveAnimation = null;
    board2d.querySelector(`[data-square="${move.to}"]`)?.classList.remove('capture-impact');
  }, 620);
  if (thinking) requestAiMove();
  return true;
}

function reviewState() {
  return { index: reviewPosition, total: reviewMoves.length };
}

function beginReview() {
  reviewMoves = game.history({ verbose: true }).map(({ from, to, promotion, san }) => ({ from, to, promotion, san }));
  reviewPosition = reviewMoves.length;
  return reviewMoves.length;
}

function goToReviewPosition(requestedIndex) {
  const targetIndex = Math.max(0, Math.min(reviewMoves.length, requestedIndex));
  if (targetIndex === reviewPosition) return reviewState();
  thinking = false;
  aiRequestId += 1;
  selectedSquare = null;
  describePiece(null);
  const backwards = targetIndex < reviewPosition;
  let movement;
  const plyIndex = backwards ? reviewPosition - 1 : reviewPosition;
  if (backwards) {
    const move = game.undo();
    if (move) movement = { ...move, from: move.to, to: move.from, reversed: true };
    reviewPosition -= 1;
  } else {
    const move = reviewMoves[reviewPosition];
    const applied = game.move(move.san);
    movement = applied;
    reviewPosition += 1;
  }
  if (movement) {
    const animationId = ++moveAnimationSequence;
    recentMoveAnimation = {
      id: animationId,
      ...movement,
      plyIndex,
      captured: Boolean(movement.captured),
      applied: false,
    };
    renderAll();
    window.setTimeout(() => {
      if (recentMoveAnimation?.id === animationId) recentMoveAnimation = null;
    }, 620);
  }
  if (reviewPosition !== targetIndex) return goToReviewPosition(targetIndex);
  renderStatus();
  return reviewState();
}

window.fctReview = {
  begin: beginReview,
  goTo: goToReviewPosition,
  refresh() {
    if (!isReviewing) reviewMoves = game.history({ verbose: true }).map(({ from, to, promotion, san }) => ({ from, to, promotion, san }));
    return { total: reviewMoves.length };
  },
  setReviewing(value) { isReviewing = Boolean(value); },
  reset() { isReviewing = false; reviewMoves = []; reviewPosition = 0; },
};

function commitMove(move) {
  applyMove(move, true);
}

function renderStatus() {
  const winner = game.turn() === 'w' ? 'El estratega' : 'Tú';
  if (game.isCheckmate()) {
    statusEl.textContent = `Jaque mate · ${winner} gana`;
  } else if (game.isStalemate()) {
    statusEl.textContent = 'Tablas · rey ahogado';
  } else if (game.isDraw()) {
    statusEl.textContent = 'Tablas';
  } else if (thinking) {
    statusEl.textContent = 'Un momento, por favor...';
  } else if (game.isCheck()) {
    statusEl.textContent = game.turn() === 'w' ? 'Jaque · responde' : 'Jaque al rey blanco';
  } else {
    statusEl.textContent = game.turn() === 'w' ? 'Tu turno' : 'Turno del estratega';
  }
  turnPulse.classList.toggle('is-thinking', thinking);
  turnPulse.classList.toggle('is-dark-turn', game.turn() === 'b' && !thinking);
}

function renderAll() {
  render2D();
  renderStatus();
}

function paintDragTargets() {
  board2d.querySelectorAll('[data-square]').forEach((cell) => {
    const square = cell.dataset.square;
    cell.classList.remove('move-target', 'capture-target');
    cell.classList.toggle('selected', square === selectedSquare);
    if (!dragTargets.has(square)) return;
    cell.classList.add(game.get(square) ? 'capture-target' : 'move-target');
  });
}

function highlightDropSquare(square) {
  board2d.querySelectorAll('.drag-over-valid, .drag-over-invalid, .drag-shadow-target').forEach((cell) => {
    cell.classList.remove('drag-over-valid', 'drag-over-invalid', 'drag-shadow-target');
    cell.style.removeProperty('--drag-shadow-glyph');
  });
  if (!square) return;
  const cell = board2d.querySelector(`[data-square="${square}"]`);
  if (cell) {
    cell.classList.add(dragTargets.has(square) ? 'drag-over-valid' : 'drag-over-invalid');
    const piece = selectedSquare && game.get(selectedSquare);
    if (piece) {
      cell.classList.add('drag-shadow-target');
      cell.style.setProperty('--drag-shadow-glyph', JSON.stringify(pieceGlyphs[piece.color][piece.type]));
    }
  }
}

async function ensure3DBoard() {
  if (threeBoard) return threeBoard;
  if (!threeBoardPromise) {
    threeBoardPromise = import('./board3d.js').then(({ create3DBoard }) => {
      threeBoard = create3DBoard(board3dHost, handleSquare, handleDragMove,
        (piece) => piece.color === 'w' && !thinking && !isReviewing && !game.isGameOver() && game.turn() === 'w');
      render2D();
      return threeBoard;
    }).catch((error) => {
      document.querySelector('[data-view="3d"]').disabled = true;
      document.querySelector('#reset-camera').disabled = true;
      document.querySelector('#drag-help').textContent = 'Esta sesión del navegador no pudo iniciar WebGL.';
      console.error('No se pudo crear la vista 3D:', error);
      return null;
    });
  }
  return threeBoardPromise;
}

async function setView(view) {
  requestedView = view;
  if (view === '3d' && !await ensure3DBoard()) return;
  if (requestedView !== view) return;
  board2d.classList.toggle('hidden', view !== '2d');
  board3dHost.classList.toggle('hidden', view !== '3d');
  document.querySelectorAll('.view-button').forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('.board-frame').classList.toggle('is-3d', view === '3d');
  document.querySelector('#drag-help').classList.toggle('visible', view === '3d');
  if (view === '3d') threeBoard?.resize();
}

document.querySelectorAll('.view-button').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
document.querySelector('#reset-camera').addEventListener('click', () => threeBoard?.resetCamera());
async function startCombat() {
  musicEnabledByCombat = true;
  startBackgroundMusic();
  aiRequestId += 1;
  game.reset();
  selectedSquare = null;
  thinking = false;
  pendingPromotion = null;
  reviewMoves = [];
  reviewPosition = 0;
  isReviewing = false;
  describePiece(null);
  renderAll();
  appShell.classList.add('is-playing');
  await setView('3d');
  threeBoard?.playIntro();
}

document.querySelector('#new-game').addEventListener('click', startCombat);
document.querySelector('#return-to-menu').addEventListener('click', () => exitConfirmation.showModal());
exitConfirmation.addEventListener('close', () => {
  if (exitConfirmation.returnValue !== 'exit') return;
  aiRequestId += 1;
  thinking = false;
  threeBoard?.cancelIntro();
  appShell.classList.remove('is-playing');
});
audioHide.addEventListener('click', () => {
  audioControl.hidden = true;
  audioReopen.hidden = false;
});
audioReopen.addEventListener('click', () => {
  audioControl.hidden = false;
  audioReopen.hidden = true;
});

let boardPointerDrag = null;
let swallowBoardClick = false;
board2d.addEventListener('click', (event) => {
  if (swallowBoardClick) {
    swallowBoardClick = false;
    event.preventDefault();
    return;
  }
  const cell = event.target.closest('[data-square]');
  if (cell) handleSquare(cell.dataset.square);
});
board2d.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 || event.isPrimary === false || thinking || isReviewing || game.isGameOver() || game.turn() !== 'w') return;
  const token = event.target.closest('[data-from]');
  if (!token) return;
  const from = token.dataset.from;
  const piece = game.get(from);
  if (!piece || piece.color !== 'w') return;

  event.preventDefault();
  boardPointerDrag = {
    pointerId: event.pointerId,
    from,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
  };
  board2d.setPointerCapture(event.pointerId);
  selectedSquare = from;
  describePiece(piece);
  dragTargets = new Set(game.moves({ square: from, verbose: true }).map((move) => move.to));
  paintDragTargets();
});
board2d.addEventListener('pointermove', (event) => {
  const drag = boardPointerDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 7) return;
  drag.moved = true;
  const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-square]');
  highlightDropSquare(cell && board2d.contains(cell) ? cell.dataset.square : null);
});
board2d.addEventListener('pointerup', (event) => {
  const drag = boardPointerDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  boardPointerDrag = null;
  const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-square]');
  const destination = cell && board2d.contains(cell) ? cell.dataset.square : null;
  highlightDropSquare(null);
  dragTargets.clear();
  swallowBoardClick = true;
  window.setTimeout(() => { swallowBoardClick = false; }, 0);

  if (drag.moved && destination) handleDragMove(drag.from, destination);
  else handleSquare(drag.from);
});
board2d.addEventListener('pointercancel', () => {
  if (!boardPointerDrag) return;
  boardPointerDrag = null;
  highlightDropSquare(null);
  dragTargets.clear();
  renderAll();
});

promotionDialog.addEventListener('close', () => {
  const promotion = promotionDialog.returnValue;
  if (pendingPromotion && ['q', 'r', 'b', 'n'].includes(promotion)) {
    const move = { ...pendingPromotion, promotion };
    pendingPromotion = null;
    applyMove(move, true);
  }
  pendingPromotion = null;
});

aiWorker.onmessage = ({ data }) => {
  if (data?.type !== 'move' || !data.move || data.requestId !== aiRequestId || !appShell.classList.contains('is-playing')) return;
  const applied = applyMove({
    from: data.move.slice(0, 2),
    to: data.move.slice(2, 4),
    promotion: data.move[4] || 'q',
  }, false);
  if (!applied) {
    thinking = false;
    renderAll();
    console.error('La IA devolvió un movimiento inválido:', data.move);
  }
};

aiWorker.onerror = (error) => {
  thinking = false;
  statusEl.textContent = 'No se pudo iniciar la IA';
  console.error(error);
};

window.addEventListener('resize', () => threeBoard?.resize());
describePiece(null);
renderAll();
