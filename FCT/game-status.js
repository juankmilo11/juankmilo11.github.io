const statusText = document.querySelector("#game-status");
const statusBadge = document.querySelector(".game-status-badge");
const checkmateOverlay = document.querySelector("#checkmate-overlay");
const winnerMessage = document.querySelector("#checkmate-message");
const playAgainButton = document.querySelector("#play-again");

function updateGameStatus() {
  const message = statusText.textContent.trim();
  const wasHidden = checkmateOverlay.hidden;
  const isCheckmate = /^Jaque mate/i.test(message);
  const isCheck = /^Jaque\b/i.test(message) && !isCheckmate;

  statusBadge.classList.toggle("is-check", isCheck);
  statusBadge.classList.toggle("is-checkmate", isCheckmate);
  checkmateOverlay.hidden = !isCheckmate;

  if (isCheckmate) {
    winnerMessage.textContent = message.replace(/^Jaque mate\s*[·-]?\s*/i, "");
    if (wasHidden) playAgainButton.focus({ preventScroll: true });
  }
}

new MutationObserver(updateGameStatus).observe(statusText, {
  childList: true,
  characterData: true,
  subtree: true
});

playAgainButton.addEventListener("click", () => {
  document.querySelector("#new-game").click();
});

updateGameStatus();
