const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".service-card");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.toggle("active", item === button));
    const selected = button.dataset.filter;
    cards.forEach((card) => {
      const visible = selected === "all" || card.dataset.category === selected;
      card.hidden = !visible;
      if (visible) {
        card.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], {
          duration: 360,
          easing: "ease-out",
        });
      }
    });
  });
});

const ticker = document.querySelector(".ticker-track");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  ticker.style.animation = "none";
}
