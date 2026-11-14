const statusText = document.querySelector("#game-status");
const statusBadge = document.querySelector(".game-status-badge");
const checkmateOverlay = document.querySelector("#checkmate-overlay");
const resultTitle = document.querySelector("#checkmate-title");
const winnerMessage = document.querySelector("#checkmate-message");
const newGameButton = document.querySelector("#play-again");
const reviewMatchButton = document.querySelector("#review-match");
const reviewControls = document.querySelector("#review-controls");
const reviewPosition = document.querySelector("#review-position");
const reviewReturnButton = document.querySelector("#review-return");
const reviewPauseNote = document.querySelector("#review-pause-note");
const appShell = document.querySelector(".app-shell");
const gameToolbar = document.querySelector(".game-toolbar");
// Audio controls follow the actual HUD height, including wrapped mobile text.
new ResizeObserver(([entry]) => {
  appShell.style.setProperty("--hud-height", `${entry.target.getBoundingClientRect().height}px`);
}).observe(gameToolbar);

let isReviewing = false;
let currentMove = 0;
let totalMoves = 0;



function updatePositionControls() {
  reviewPauseNote.hidden = !isReviewing;
  reviewPosition.textContent = currentMove === 0
    ? `Inicio · 0/${totalMoves}`
    : `Jugada ${currentMove} de ${totalMoves}`;
  document.querySelector("#review-first").disabled = currentMove === 0;
  document.querySelector("#review-previous").disabled = currentMove === 0;
  document.querySelector("#review-next").disabled = currentMove === totalMoves;
  document.querySelector("#review-last").disabled = currentMove === totalMoves;
}

function updateGameStatus() {
  reviewPauseNote.hidden = !isReviewing;
  const message = statusText.textContent.trim();
  const isCheckmate = /^(Checkmate|Jaque mate)\b/i.test(message);
  const isDraw = /^Tablas\b/i.test(message);
  const isCheck = /^(Check|Jaque)\b/i.test(message) && !isCheckmate;
  const hasResult = isCheckmate || isDraw;

  statusBadge.classList.toggle("is-check", isCheck);
  statusBadge.classList.toggle("is-checkmate", isCheckmate);
  checkmateOverlay.hidden = isReviewing || !hasResult;
  reviewControls.hidden = !isReviewing && !appShell.classList.contains("is-playing");
  reviewReturnButton.textContent = hasResult ? "Resultado" : "Volver";

  if (isDraw) {
    resultTitle.textContent = "Tablas";
    winnerMessage.textContent = "Partida empatada";
  } else if (isCheckmate) {
    resultTitle.textContent = "Checkmate";
    winnerMessage.textContent = /(?:Tú ganas|Tú gana)/i.test(message) ? "Tú ganas" : "Tú pierdes";
  }

  if (!isReviewing && window.fctReview) {
    const state = window.fctReview.refresh();
    currentMove = state.total;
    totalMoves = state.total;
    updatePositionControls();
  }
}

function goToMove(index) {
  const state = window.fctReview.goTo(index);
  currentMove = state.index;
  totalMoves = state.total;
  updatePositionControls();
}

function startReview() {
  if (isReviewing || !window.fctReview) return;
  totalMoves = window.fctReview.begin();
  currentMove = totalMoves;
  isReviewing = true;
  window.fctReview.setReviewing(true);
  appShell.classList.add("is-reviewing");
  checkmateOverlay.hidden = true;
  reviewControls.hidden = false;
  updatePositionControls();
}

reviewMatchButton.addEventListener("click", () => {
  startReview();
  goToMove(totalMoves);
  document.querySelector("#review-previous").focus({ preventScroll: true });
});

document.querySelector("#review-first").addEventListener("click", () => {
  startReview();
  goToMove(0);
});
document.querySelector("#review-previous").addEventListener("click", () => {
  startReview();
  goToMove(currentMove - 1);
});
document.querySelector("#review-next").addEventListener("click", () => {
  startReview();
  goToMove(currentMove + 1);
});
document.querySelector("#review-last").addEventListener("click", () => {
  startReview();
  goToMove(totalMoves);
});

document.querySelector("#review-return").addEventListener("click", () => {
  window.playFctSound?.("sound1");
  if (!window.fctReview) return;
  goToMove(totalMoves);
  window.fctReview.setReviewing(false);
  isReviewing = false;
  appShell.classList.remove("is-reviewing");
  checkmateOverlay.hidden = !/^(?:Checkmate|Jaque mate|Tablas)\b/i.test(statusText.textContent.trim());
  updateGameStatus();
});

newGameButton.addEventListener("click", () => {
  isReviewing = false;
  reviewPauseNote.hidden = true;
  appShell.classList.remove("is-reviewing");
  reviewControls.hidden = true;
  checkmateOverlay.hidden = true;
  window.fctReview?.reset();
  document.querySelector("#new-game").click();
});

window.addEventListener("fct:new-game", () => {
  isReviewing = false;
  currentMove = totalMoves = 0;
  reviewPauseNote.hidden = true;
  appShell.classList.remove("is-reviewing");
  checkmateOverlay.hidden = true;
  window.fctReview?.reset();
  updatePositionControls();
});
document.querySelectorAll("#review-first, #review-previous, #review-next, #review-last, #review-match").forEach(button => {
  button.addEventListener("click", () => window.playFctSound?.("sound1"));
});

new MutationObserver(updateGameStatus).observe(appShell, { attributes: true, attributeFilter: ["class"] });

new MutationObserver(updateGameStatus).observe(statusText, {
  childList: true,
  characterData: true,
  subtree: true
});

updateGameStatus();
