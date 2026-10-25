// Select the page controls once so each handler can stay small and focused.
const botonColor = document.querySelector(".boton_color");
const botonGif = document.querySelector(".boton_gif");
const botonTitulo = document.querySelector(".boton_titulo");
const botonAcc = document.querySelector(".boton_acc");
const titulo = document.querySelector(".titulo");
const reloj = document.querySelector("#reloj");
const plantillaVentana = document.querySelector("#plantilla-ventana");
const enlaces = [...document.querySelectorAll(".enlace")];

const fondosGif = [
  "img/fondos/fondo1.gif",
  "img/fondos/fondo2.gif",
  "img/fondos/fondo3.gif",
  "img/fondos/fondo4.gif"
];
const velocidades = ["7s", "2s", "0.5s", "30s"];
let velocidadActual = 0;
let indiceGif = -1;
let zIndexVentana = 10;
const ventanasAbiertas = new Set();
const arrastres = new WeakMap();

function actualizarHora() {
  reloj.textContent = new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

function cambiarColorFondo() {
  document.body.classList.remove("fondo-gif");
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 20) + 70;
  const lightness = Math.floor(Math.random() * 20) + 15;
  document.documentElement.style.setProperty(
    "--page-bg",
    `hsl(${hue} ${saturation}% ${lightness}%)`
  );
}

function cambiarFondoGif() {
  indiceGif = (indiceGif + 1) % fondosGif.length;
  document.body.classList.add("fondo-gif");
  document.body.style.setProperty("--gif-fondo", `url("${fondosGif[indiceGif]}")`);
  botonGif.setAttribute("aria-label", `Fondo GIF ${indiceGif + 1} de ${fondosGif.length}`);
}

function enfocarVentana(ventana) {
  ventana.style.zIndex = String(++zIndexVentana);
}

function cerrarVentana(ventana) {
  ventana.querySelector("iframe").src = "about:blank";
  ventana.remove();
  ventanasAbiertas.delete(ventana);
}

function cerrarTodasLasVentanas() {
  [...ventanasAbiertas].forEach(cerrarVentana);
}

function colocarVentanaAleatoriamente(ventana) {
  const maxLeft = Math.max(0, window.innerWidth - ventana.offsetWidth);
  const maxTop = Math.max(0, window.innerHeight - ventana.offsetHeight);
  ventana.style.left = `${Math.round(Math.random() * maxLeft)}px`;
  ventana.style.top = `${Math.round(Math.random() * maxTop)}px`;
  ventana.style.transform = "none";
}

function habilitarArrastre(ventana, encabezado) {
  encabezado.addEventListener("pointerdown", (evento) => {
    if (evento.target.closest("button")) return;

    enfocarVentana(ventana);
    const rect = ventana.getBoundingClientRect();
    arrastres.set(ventana, {
      pointerId: evento.pointerId,
      x: evento.clientX - rect.left,
      y: evento.clientY - rect.top
    });
    ventana.style.left = `${rect.left}px`;
    ventana.style.top = `${rect.top}px`;
    ventana.style.transform = "none";
    encabezado.setPointerCapture(evento.pointerId);
  });

  encabezado.addEventListener("pointermove", (evento) => {
    const arrastre = arrastres.get(ventana);
    if (!arrastre || evento.pointerId !== arrastre.pointerId) return;

    const maxLeft = Math.max(0, window.innerWidth - ventana.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - ventana.offsetHeight);
    ventana.style.left = `${Math.min(maxLeft, Math.max(0, evento.clientX - arrastre.x))}px`;
    ventana.style.top = `${Math.min(maxTop, Math.max(0, evento.clientY - arrastre.y))}px`;
  });

  const detenerArrastre = (evento) => {
    const arrastre = arrastres.get(ventana);
    if (arrastre && evento.pointerId === arrastre.pointerId) arrastres.delete(ventana);
  };
  encabezado.addEventListener("pointerup", detenerArrastre);
  encabezado.addEventListener("pointercancel", detenerArrastre);
}

function crearVentana(enlace) {
  const ventana = plantillaVentana.content.firstElementChild.cloneNode(true);
  const encabezado = ventana.querySelector(".barra-ventana");
  const iframe = ventana.querySelector("iframe");

  ventana.querySelector("h2").textContent =
    enlace.dataset.windowTitle || enlace.textContent.trim().replace(/\s+/g, " ");
  encabezado.style.backgroundColor = enlace.dataset.barColor || "#333";
  iframe.src = enlace.getAttribute("href");
  document.body.append(ventana);
  ventanasAbiertas.add(ventana);
  enfocarVentana(ventana);

  // Give each window a different position within the visible screen.
  colocarVentanaAleatoriamente(ventana);

  ventana.addEventListener("pointerdown", () => enfocarVentana(ventana));
  ventana.querySelector(".cerrar-ventana").addEventListener("click", () => cerrarVentana(ventana));
  habilitarArrastre(ventana, encabezado);
  return ventana;
}

botonColor.addEventListener("click", cambiarColorFondo);
botonGif.addEventListener("click", cambiarFondoGif);

botonTitulo.addEventListener("click", () => {
  titulo.animate(
    [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(1.18)", opacity: 0.75 },
      { transform: "scale(1)", opacity: 1 }
    ],
    { duration: 700, easing: "ease-in-out" }
  );
  cerrarTodasLasVentanas();
});

botonAcc.addEventListener("click", () => {
  const velocidad = velocidades[velocidadActual];
  document.documentElement.style.setProperty("--rotation-speed", velocidad);
  botonAcc.setAttribute("aria-label", `Velocidad de rotación: ${velocidad}`);
  velocidadActual = (velocidadActual + 1) % velocidades.length;
});

enlaces.forEach((enlace) => {
  enlace.addEventListener("click", (evento) => {
    evento.preventDefault();
    crearVentana(enlace);
  });
});

document.addEventListener("keydown", (evento) => {
  if (evento.key !== "Escape") return;
  const superior = [...ventanasAbiertas].sort(
    (a, b) => Number(b.style.zIndex) - Number(a.style.zIndex)
  )[0];
  if (superior) cerrarVentana(superior);
});

// Keep every open window inside the visible screen after resizing.
window.addEventListener("resize", () => {
  ventanasAbiertas.forEach((ventana) => {
    const rect = ventana.getBoundingClientRect();
    ventana.style.left = `${Math.min(rect.left, Math.max(0, window.innerWidth - ventana.offsetWidth))}px`;
    ventana.style.top = `${Math.min(rect.top, Math.max(0, window.innerHeight - ventana.offsetHeight))}px`;
  });
});

actualizarHora();
setInterval(actualizarHora, 1000);

// Stagger the welcome windows so they do not all open at the same instant.
enlaces.forEach((enlace, indice) => {
  setTimeout(() => crearVentana(enlace), 900 + indice * 1800);
});


