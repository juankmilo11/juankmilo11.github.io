// Select the page controls once so each handler can stay small and focused.
const botonColor = document.querySelector(".boton_color");
const botonGif = document.querySelector(".boton_gif");
const botonTitulo = document.querySelector(".boton_titulo");
const botonAcc = document.querySelector(".boton_acc");
const titulo = document.querySelector(".titulo");
const reloj = document.querySelector("#reloj");
const plantillaVentana = document.querySelector("#plantilla-ventana");
const escenario = document.querySelector(".escenario");
const enlaces = [...document.querySelectorAll(".enlace")];
const enlacesVentana = enlaces.filter((enlace) => !enlace.hasAttribute("data-manual-open"));

const fondosGif = [
  "img/fondos/gif1.gif",
  "img/fondos/gif2.gif",
  "img/fondos/gif3.gif",
  "img/fondos/gif4.gif",
  "img/fondos/gif5.gif",
  "img/fondos/gif6.gif",
  "img/fondos/gif7.gif",
  "img/fondos/gif8.gif",
  "img/fondos/gif9.gif",
  "img/fondos/gif10.gif",
  "img/fondos/gif11.gif",
  "img/fondos/gif12.gif",
  "img/fondos/gif13.gif",
  "img/fondos/gif14.gif"
];
const velocidades = ["7s", "2s", "0.5s", "30s"];
const etiquetasVelocidad = ["4×", "15×", "60×", "↺"];
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

const COLOR_RANGES = { hue: [0, 359], saturation: [70, 89], lightness: [15, 34] };
let ultimoColorFondo = "";

function numeroAleatorio([min, max]) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cambiarColorFondo() {
  document.body.classList.remove("fondo-gif");
  let color;
  do {
    color = `hsl(${numeroAleatorio(COLOR_RANGES.hue)} ${numeroAleatorio(COLOR_RANGES.saturation)}% ${numeroAleatorio(COLOR_RANGES.lightness)}%)`;
  } while (color === ultimoColorFondo);
  ultimoColorFondo = color;
  document.documentElement.style.setProperty("--page-bg", color);
}

function luminanciaColor(hex) {
  const rgb = hex.replace("#", "").match(/.{2}/g).map((channel) => parseInt(channel, 16) / 255);
  const linear = rgb.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function actualizarColorYinYang(enlace) {
  const acento = enlace.dataset.barColor || "#ffffff";
  const luminancia = luminanciaColor(acento);
  const acentoClaro = (luminancia + 0.05) / 0.05 >= 1.05 / (luminancia + 0.05);
  document.documentElement.style.setProperty("--yin-color", acentoClaro ? acento : "#ffffff");
  document.documentElement.style.setProperty("--yang-color", acentoClaro ? "#090909" : acento);
  document.documentElement.style.setProperty("--outline-color", "#ffffff");
}

function restaurarColorYinYang() {
  const activo = enlaces.find((enlace) => enlace.matches(":hover, :focus-visible"));
  if (activo) {
    actualizarColorYinYang(activo);
    return;
  }
  document.documentElement.style.removeProperty("--yin-color");
  document.documentElement.style.removeProperty("--yang-color");
  document.documentElement.style.removeProperty("--outline-color");
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
escenario.addEventListener("click", () => window.location.reload());

enlaces.forEach((enlace) => {
  enlace.addEventListener("pointerenter", () => actualizarColorYinYang(enlace));
  enlace.addEventListener("pointerleave", restaurarColorYinYang);
  enlace.addEventListener("focus", () => actualizarColorYinYang(enlace));
  enlace.addEventListener("blur", restaurarColorYinYang);
  enlace.addEventListener("click", (evento) => {
    evento.preventDefault();
    crearVentana(enlace);
  });
});

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
  const indice = velocidadActual;
  const velocidad = velocidades[indice];
  const etiqueta = etiquetasVelocidad[indice];
  document.documentElement.style.setProperty("--rotation-speed", velocidad);
  botonAcc.textContent = etiqueta;
  botonAcc.title = `Velocidad de rotación: ${etiqueta}`;
  botonAcc.setAttribute("aria-label", `Velocidad de rotación: ${etiqueta}`);
  velocidadActual = (velocidadActual + 1) % velocidades.length;
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

cambiarColorFondo();
actualizarHora();
setInterval(actualizarHora, 1000);

// Stagger the welcome windows so they do not all open at the same instant.
enlacesVentana.forEach((enlace, indice) => {
  setTimeout(() => crearVentana(enlace), 900 + indice * 1800);
});
