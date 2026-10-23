const botonColor = document.querySelector(".boton_color");
const botonTitulo = document.querySelector(".boton_titulo");
const botonAcc = document.querySelector(".boton_acc");
const titulo = document.querySelector(".titulo");
const reloj = document.querySelector("#reloj");

const velocidades = ["7s", "2s", "0.5s", "30s"];
let velocidadActual = 0;

function actualizarHora() {
  const ahora = new Date();
  reloj.textContent = new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(ahora);
}

botonColor.addEventListener("click", () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 20) + 70;
  const lightness = Math.floor(Math.random() * 20) + 15;
  document.documentElement.style.setProperty(
    "--page-bg",
    `hsl(${hue} ${saturation}% ${lightness}%)`
  );
});

botonTitulo.addEventListener("click", () => {
  titulo.animate(
    [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(1.18)", opacity: .75 },
      { transform: "scale(1)", opacity: 1 }
    ],
    { duration: 700, easing: "ease-in-out" }
  );
});

botonAcc.addEventListener("click", () => {
  const velocidad = velocidades[velocidadActual];
  document.documentElement.style.setProperty("--rotation-speed", velocidad);
  botonAcc.setAttribute("aria-label", `Velocidad de rotación: ${velocidad}`);
  velocidadActual = (velocidadActual + 1) % velocidades.length;
});

actualizarHora();
setInterval(actualizarHora, 1000);
