const statusText = document.querySelector("#game-status");
const statusBadge = document.querySelector(".game-status-badge");
const checkmateOverlay = document.querySelector("#checkmate-overlay");
const winnerMessage = document.querySelector("#checkmate-message");
const newGameButton = document.querySelector("#play-again");
const reviewMatchButton = document.querySelector("#review-match");
const reviewControls = document.querySelector("#review-controls");
const reviewPosition = document.querySelector("#review-position");
const appShell = document.querySelector(".app-shell");
const backgroundMusic = document.querySelector("#background-music");
let isReviewing = false;
let currentMove = 0;
let totalMoves = 0;

if (backgroundMusic) backgroundMusic.volume = 0.5;

function updateGameStatus() {
  const message = statusText.textContent.trim();
  const isCheckmate = /^Jaque mate/i.test(message);
  const isCheck = /^Jaque\b/i.test(message) && !isCheckmate;

  statusBadge.classList.toggle("is-check", isCheck);
  statusBadge.classList.toggle("is-checkmate", isCheckmate);
  checkmateOverlay.hidden = isReviewing || !isCheckmate;

  if (isCheckmate) {
    winnerMessage.textContent = /Tú gana/i.test(message) ? "Tú ganas" : "Tú pierdes";
  }
}

function goToMove(index) {
  const state = window.fctReview.goTo(index);
  currentMove = state.index;
  totalMoves = state.total;
  reviewPosition.textContent = currentMove === 0
    ? `Posición inicial · 0/${totalMoves}`
    : `Movimiento ${currentMove} de ${totalMoves}`;
  document.querySelector("#review-first").disabled = currentMove === 0;
  document.querySelector("#review-previous").disabled = currentMove === 0;
  document.querySelector("#review-next").disabled = currentMove === totalMoves;
  document.querySelector("#review-last").disabled = currentMove === totalMoves;
  statusText.textContent = currentMove === 0
    ? "Revisión · posición inicial"
    : `Revisión · movimiento ${currentMove} de ${totalMoves}`;
}

reviewMatchButton.addEventListener("click", () => {
  if (!window.fctReview) return;
  totalMoves = window.fctReview.begin();
  currentMove = totalMoves;
  isReviewing = true;
  appShell.classList.add("is-reviewing");
  checkmateOverlay.hidden = true;
  reviewControls.hidden = false;
  goToMove(totalMoves);
  document.querySelector("#review-previous").focus({ preventScroll: true });
});

document.querySelector("#review-first").addEventListener("click", () => goToMove(0));
document.querySelector("#review-previous").addEventListener("click", () => goToMove(currentMove - 1));
document.querySelector("#review-next").addEventListener("click", () => goToMove(currentMove + 1));
document.querySelector("#review-last").addEventListener("click", () => goToMove(totalMoves));

document.querySelector("#review-return").addEventListener("click", () => {
  isReviewing = false;
  appShell.classList.remove("is-reviewing");
  reviewControls.hidden = true;
  window.fctReview.goTo(totalMoves);
  updateGameStatus();
});

newGameButton.addEventListener("click", () => {
  isReviewing = false;
  appShell.classList.remove("is-reviewing");
  reviewControls.hidden = true;
  checkmateOverlay.hidden = true;
  document.querySelector("#new-game").click();
});

new MutationObserver(updateGameStatus).observe(statusText, {
  childList: true,
  characterData: true,
  subtree: true
});

updateGameStatus();
