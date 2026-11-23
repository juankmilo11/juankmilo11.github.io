// Select the page controls once so each handler can stay small and focused.
const botonColor = document.querySelector(".boton_color");
const titulo = document.querySelector(".titulo");
const reloj = document.querySelector("#reloj");
const plantillaVentana = document.querySelector("#plantilla-ventana");
const escenario = document.querySelector(".escenario");
const enlaces = [...document.querySelectorAll(".enlace")];
const navegacion = document.querySelector(".enlaces");

const fondosGif = [
  "img/fondos/gif3.gif",
  "img/fondos/gif4.gif",
  "img/fondos/gif6.gif",
  "img/fondos/gif7.gif",
  "img/fondos/gif9.gif"
];
const velocidades = ["7s", "2s", "0.5s", "30s"];
let velocidadActual = 0;
let indiceGif = -1;
let zIndexVentana = 10;
const ventanasAbiertas = new Set();
const arrastres = new WeakMap();
const enlacesOrigen = new WeakMap();
const TIEMPOS_FONDO = { oscurecer: 1000, aclarar: 1000, mostrar: 5000, carga: 20000 };
const DURACION_GLITCH = 2400;
const DURACION_INICIO = 5000;
let inicioEnCurso = true;
let colaFondos = [];
let ultimoGifElegido = -1;
let fondoPreparado = null;
let temporizadorFondo;
let versionFondo = 0;
let temporizadorGlitch;
let finGlitch;
let temporizadorReloj;
const formatoHora = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

function actualizarHora() {
  clearTimeout(temporizadorReloj);
  if (document.hidden) return;
  reloj.textContent = formatoHora.format(new Date());
  // The display has no seconds; update only at the next minute boundary.
  temporizadorReloj = setTimeout(actualizarHora, 60000 - Date.now() % 60000);
}

const COLOR_RANGES = { hue: [0, 359], saturation: [70, 89], lightness: [15, 34] };
let ultimoColorFondo = "";

function numeroAleatorio([min, max]) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cambiarColorFondo() {
  // Manual color mode remains active until the Yin Yang resumes the slideshow.
  versionFondo++;
  clearTimeout(temporizadorFondo);
  botonColor.setAttribute("aria-pressed", "true");
  document.body.classList.remove("fondo-gif", "fondo-oscurecido");
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
  const halo = enlace.dataset.glowColor || acento;
  document.documentElement.style.setProperty("--yin-glow", `${halo}b3`);
  document.documentElement.style.setProperty("--yin-glow-soft", `${halo}59`);
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
  document.documentElement.style.removeProperty("--yin-glow");
  document.documentElement.style.removeProperty("--yin-glow-soft");
}

function elegirSiguienteGif() {
  if (!colaFondos.length) {
    colaFondos = fondosGif.map((_, indice) => indice);
    for (let i = colaFondos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colaFondos[i], colaFondos[j]] = [colaFondos[j], colaFondos[i]];
    }
    // Visit every background before reshuffling, without adjacent repeats.
    if (colaFondos.length > 1 && colaFondos[0] === ultimoGifElegido) {
      [colaFondos[0], colaFondos[1]] = [colaFondos[1], colaFondos[0]];
    }
  }
  ultimoGifElegido = colaFondos.shift();
  return ultimoGifElegido;
}

function prepararSiguienteGif() {
  const indice = elegirSiguienteGif();
  return new Promise((resolve) => {
    const imagen = new Image();
    let terminado = false;
    const finalizar = (resultado) => {
      if (terminado) return;
      terminado = true;
      clearTimeout(limite);
      imagen.onload = null;
      imagen.onerror = null;
      resolve(resultado);
    };
    const limite = setTimeout(() => finalizar(null), TIEMPOS_FONDO.carga);
    imagen.onload = async () => {
      try {
        if (imagen.decode) await imagen.decode();
        finalizar({ indice, imagen });
      } catch {
        finalizar(null);
      }
    };
    imagen.onerror = () => finalizar(null);
    imagen.src = fondosGif[indice];
  });
}

function programarFondo(demora) {
  clearTimeout(temporizadorFondo);
  temporizadorFondo = setTimeout(cambiarFondoGif, demora);
}

async function cambiarFondoGif() {
  if (document.hidden) return;
  const version = ++versionFondo;
  document.body.classList.add("fondo-oscurecido");
  // Load only the next image, behind the blackout, then reveal a decoded GIF.
  fondoPreparado ||= prepararSiguienteGif();
  const [siguiente] = await Promise.all([
    fondoPreparado,
    new Promise((resolve) => setTimeout(resolve, TIEMPOS_FONDO.oscurecer))
  ]);
  if (version !== versionFondo) return;
  fondoPreparado = null;
  if (siguiente) {
    indiceGif = siguiente.indice;
    document.body.style.setProperty("--gif-fondo", `url("${fondosGif[indiceGif]}")`);
    document.body.classList.add("fondo-gif");
  }
  // On failure, keep the current background and try the next file next cycle.
  document.body.classList.remove("fondo-oscurecido");
  fondoPreparado = prepararSiguienteGif();
  programarFondo(TIEMPOS_FONDO.aclarar + TIEMPOS_FONDO.mostrar);
}

function enfocarVentana(ventana) {
  ventana.style.zIndex = String(++zIndexVentana);
  actualizarActividadFct();
}
function actualizarActividadFct(){const superior=[...ventanasAbiertas].sort((a,b)=>Number(b.style.zIndex)-Number(a.style.zIndex))[0];for(const ventana of ventanasAbiertas)if(ventana.classList.contains('ventana-fct'))ventana.querySelector('iframe').contentWindow?.postMessage?.({type:'fct:visibility',active:ventana===superior&&!document.hidden},location.origin);}
document.addEventListener('visibilitychange',actualizarActividadFct);

function cerrarVentana(ventana) {
  const devolverFoco = document.activeElement === ventana.querySelector('iframe') || ventana.contains(document.activeElement);
  ventana.querySelector("iframe").src = "about:blank";
  ventana.remove();
  ventanasAbiertas.delete(ventana);
  actualizarActividadFct();
  if (devolverFoco) enlacesOrigen.get(ventana)?.focus({ preventScroll: true });
}

function idiomaVentanaPaca(ventana, idioma) {
  const espanol = idioma === 'es';
  ventana.dataset.pacaLanguage = espanol ? 'es' : 'en';
  const nombre = espanol ? 'PACA | Paula Daniela · Estudio de belleza' : 'PACA | Paula Daniela · Beauty Studio';
  ventana.querySelector('h2').textContent = nombre;
  ventana.setAttribute('aria-label', nombre);
  ventana.querySelector('iframe').title = nombre;
  ventana.querySelector('.cerrar-ventana').setAttribute('aria-label', espanol ? 'Cerrar ventana PACA' : 'Close PACA window');
}

window.addEventListener('message', evento => {
  if (evento.origin !== location.origin || evento.data?.type !== 'paca:language' || !['en','es'].includes(evento.data.language)) return;
  const ventana = [...ventanasAbiertas].find(item => item.classList.contains('ventana-paca') && item.querySelector('iframe').contentWindow === evento.source);
  if (ventana) idiomaVentanaPaca(ventana, evento.data.language);
});

function centrarVentana(ventana) {
  const maxLeft = Math.max(0, window.innerWidth - ventana.offsetWidth);
  const maxTop = Math.max(0, window.innerHeight - ventana.offsetHeight);
  ventana.style.left = `${maxLeft / 2}px`;
  ventana.style.top = `${maxTop / 2}px`;
  ventana.style.transform = "none";
}

function habilitarArrastre(ventana, encabezado) {
  encabezado.addEventListener("pointerdown", (evento) => {
    if (evento.button !== 0 || evento.target.closest("button, a")) return;

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
  encabezado.addEventListener("lostpointercapture", detenerArrastre);
}

function crearVentana(enlace) {
  const existente = [...ventanasAbiertas].find((ventana) => enlacesOrigen.get(ventana) === enlace);
  if (existente) {
    centrarVentana(existente);
    enfocarVentana(existente);
    return existente;
  }
  const ventana = plantillaVentana.content.firstElementChild.cloneNode(true);
  const encabezado = ventana.querySelector(".barra-ventana");
  const iframe = ventana.querySelector("iframe");

  ventana.querySelector("h2").textContent =
    enlace.dataset.windowTitle || enlace.textContent.trim().replace(/\s+/g, " ");
  const nombreVentana = ventana.querySelector('h2').textContent;
  ventana.setAttribute('aria-label', nombreVentana);
  iframe.title = nombreVentana;
  const abrirPestana = ventana.querySelector('.abrir-pestana');
  abrirPestana.href = enlace.getAttribute('href');
  abrirPestana.setAttribute('aria-label', `Abrir ${nombreVentana} en una pestaña nueva`);
  abrirPestana.addEventListener('click', () => {
    // Prefer the route currently open in the app; cross-origin frames use their entry URL.
    try { const actual = iframe.contentWindow.location.href; if (/^https?:\/\//.test(actual)) abrirPestana.href = actual; } catch { /* Cross-origin app. */ }
  });
  enlacesOrigen.set(ventana, enlace);
  if (enlace.getAttribute('href') === 'pages/sura/index.html') {
    ventana.classList.add('ventana-lbds');
  }
  if (enlace.getAttribute('href') === 'pages/paula/index.html') {
    ventana.classList.add('ventana-paca');
    idiomaVentanaPaca(ventana, 'en');
  }
  if (enlace.getAttribute('href') === 'pages/admin/index.html') ventana.classList.add('ventana-admin');
  if (enlace.getAttribute('href') === '/FCT/') ventana.classList.add('ventana-fct');
  iframe.src = enlace.getAttribute("href");
  iframe.addEventListener('load',actualizarActividadFct);
  document.body.append(ventana);
  ventanasAbiertas.add(ventana);
  enfocarVentana(ventana);

  centrarVentana(ventana);

  ventana.addEventListener("pointerdown", () => enfocarVentana(ventana));
  ventana.querySelector(".cerrar-ventana").addEventListener("click", () => cerrarVentana(ventana));
  habilitarArrastre(ventana, encabezado);
  return ventana;
}

botonColor.addEventListener("click", cambiarColorFondo);
escenario.addEventListener("click", activarYinYang);

enlaces.forEach((enlace) => {
  enlace.addEventListener("pointerenter", () => actualizarColorYinYang(enlace));
  enlace.addEventListener("pointerleave", restaurarColorYinYang);
  enlace.addEventListener("focus", () => actualizarColorYinYang(enlace));
  enlace.addEventListener("blur", restaurarColorYinYang);
  enlace.addEventListener("auxclick", (evento) => {
    if (inicioEnCurso) evento.preventDefault();
  });
  enlace.addEventListener("click", (evento) => {
    if (inicioEnCurso) {
      evento.preventDefault();
      return;
    }
    if (enlace.hasAttribute("data-open-tab")) return;
    evento.preventDefault();
    crearVentana(enlace);
  });
});

function cambiarVelocidad() {
  const velocidad = velocidades[velocidadActual];
  document.documentElement.style.setProperty("--rotation-speed", velocidad);
  escenario.title = "btn_2";
  escenario.setAttribute("aria-label", "btn_2");
  velocidadActual = (velocidadActual + 1) % velocidades.length;
}

function animarTitulo(duracion = DURACION_GLITCH) {
  clearInterval(temporizadorGlitch);
  clearTimeout(finGlitch);
  const fuentes = ['"MS Gothic", monospace', '"Yu Mincho", serif', '"Yu Gothic", sans-serif', 'Meiryo, sans-serif', '"MS Mincho", serif', '"Courier New", monospace'];
  const colores = ["#ffffff", "#78e8ff", "#ff93ed", "#ffe783", "#b6ffb0", "#c9b5ff"];
  const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let paso = 0;
  const actualizar = () => {
    titulo.style.setProperty("--glitch-font", fuentes[paso % fuentes.length]);
    titulo.style.setProperty("--glitch-color", colores[paso % colores.length]);
    paso++;
  };
  titulo.classList.add("titulo-glitch");
  actualizar();
  temporizadorGlitch = setInterval(actualizar, movimientoReducido ? 600 : 180);
  finGlitch = setTimeout(() => {
    clearInterval(temporizadorGlitch);
    titulo.classList.remove("titulo-glitch");
    titulo.style.removeProperty("--glitch-font");
    titulo.style.removeProperty("--glitch-color");
  }, duracion);
}

function activarYinYang() {
  if (inicioEnCurso) return;
  cambiarVelocidad();
  animarTitulo();
  if (botonColor.getAttribute('aria-pressed') === 'true') {
    botonColor.setAttribute('aria-pressed', 'false');
    cambiarFondoGif();
  }
}


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
    ventana.style.left = `${Math.max(0, Math.min(rect.left, window.innerWidth - ventana.offsetWidth))}px`;
    ventana.style.top = `${Math.max(0, Math.min(rect.top, window.innerHeight - ventana.offsetHeight))}px`;
  });
});

// Lock shortcuts before the first paint, including native new-tab navigation.
navegacion.setAttribute("inert", "");
navegacion.setAttribute("aria-busy", "true");
escenario.disabled = true;
enlaces.forEach((enlace) => {
  enlace.setAttribute("aria-disabled", "true");
  enlace.setAttribute("tabindex", "-1");
});
animarTitulo(DURACION_INICIO);
setTimeout(() => {
  inicioEnCurso = false;
  navegacion.removeAttribute("inert");
  navegacion.removeAttribute("aria-busy");
  escenario.disabled = false;
  enlaces.forEach((enlace) => {
    enlace.removeAttribute("aria-disabled");
    enlace.removeAttribute("tabindex");
  });
}, DURACION_INICIO);

document.addEventListener("visibilitychange", () => {
  actualizarHora();
  if (document.hidden) {
    // Invalidate any fade in progress, retaining the single prepared image.
    versionFondo++;
    clearTimeout(temporizadorFondo);
    document.body.classList.remove("fondo-oscurecido");
  } else if (botonColor.getAttribute("aria-pressed") !== "true") {
    if (indiceGif < 0) cambiarFondoGif();
    else programarFondo(TIEMPOS_FONDO.mostrar);
  }
});

cambiarFondoGif();
actualizarHora();

window.addEventListener('message', evento => {
  if (evento.origin !== location.origin || evento.data?.type !== 'paca:theme' || !['light','dark'].includes(evento.data.theme)) return;
  const ventana = [...ventanasAbiertas].find(item => item.classList.contains('ventana-paca') && item.querySelector('iframe').contentWindow === evento.source);
  if (ventana) ventana.dataset.theme = evento.data.theme;
});

window.addEventListener('message', evento => {
  if (evento.origin !== location.origin || evento.data?.type !== 'admin:authenticated' || typeof evento.data.authenticated !== 'boolean') return;
  const ventana = [...ventanasAbiertas].find(item => item.classList.contains('ventana-admin') && item.querySelector('iframe').contentWindow === evento.source);
  if (!ventana) return;
  ventana.classList.toggle('admin-abierto', evento.data.authenticated);
  ventana.querySelector('h2').textContent = 'JK';
  centrarVentana(ventana);
});
