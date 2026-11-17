# Arquitectura y mantenimiento

## Portada y secciones

`index.html` carga `styles.css` y `script.js`. El script administra el reloj,
fondos GIF, colores, rotación del yin yang y ventanas arrastrables con iframe.
Los enlaces con `data-open-tab` abren otra pestaña (FCT); el resto abre ventanas.
Al iniciar no se abre ninguna ventana. El título tiene glitch durante cinco
segundos y las burbujas permanecen bloqueadas durante ese mismo plazo.
El HTML inicial declara `inert`, `aria-busy` y enlaces fuera del orden de
tabulación; el script restablece la navegación a los 5000 ms, incluso con GIFs
lentos o fallidos. El Yin Yang también permanece deshabilitado al iniciar,
para que no reinicie el efecto. Después cambia su velocidad y anima el título; si btn_1 activó el color
manual, retoma los GIF. Las ventanas se abren únicamente desde las burbujas. Las ventanas
se reutilizan por sección y se centran al abrirse o restaurarse, conservando el
arrastre manual. PACA utiliza un marco rosa con el mismo estilo XP. Los cinco GIF se precargan y decodifican de uno en
uno, con una cola aleatoria sin repeticiones por ciclo y una transición oscura
de un segundo, un segundo de aclarado y cinco segundos de visualización.
El botón btn_1 mantiene el color manual hasta que el Yin Yang reactive los GIF.
La rotación se detiene al ocultar la pestaña y conserva la siguiente imagen
preparada; al volver, respeta el color manual si estaba activo. El reloj usa
un único `Intl.DateTimeFormat` y programa la siguiente actualización al inicio
del minuto, suspendiendo el temporizador mientras la pestaña está oculta.
`img/fondos/README.md` registra los archivos vigentes sin renumerar sus nombres.

Cada sección bajo `pages/` es independiente. PACA carga su propio CSS y JS,
con catálogo JSON de trabajos reales, filtros sin contadores ni buscador y visor
de fotos/videos. La agenda y el formulario de solicitudes se encuentran en un
diálogo independiente (`js/booking-window.js`, `css/booking-window.css`) con
revisión y envío al servidor persistente. Los accesos de cita conservan la selección
y las referencias del catálogo, y cerrar el diálogo preserva el borrador.
Los encabezados de secciones y servicios no incluyen números.
Las animaciones usan CSS con opacidad y transformaciones; no hay control de
pausa manual ni cálculos de inclinación en cada movimiento del puntero.
`schedule.js` valida horarios y `agenda.js` consulta la disponibilidad pública
del servidor. El calendario tiene su propio diálogo. La configuración inicial
`assets/availability.json` y su editor antiguo se conservan como referencias,
pero no constituyen la agenda en vivo. La gestión de solicitudes y horarios
se hace en ADMIN. Las solicitudes pendientes no bloquean espacios; una
confirmación guarda su duración y bloquea el intervalo atómicamente. Su ventana
es más amplia y tiene tamaño fijo adaptable al viewport; el iframe conserva su diseño adaptable.
`projects/PACA/` documenta la selección y prepara recursos; el archivo original
y los informes completos se conservan locales y se excluyen de Git. LBDSEGUROS
conserva la ruta `pages/sura/` y contiene únicamente el GIF de construcción,
ajustado al ancho y al borde inferior. La antigua ruta de construcción se
conserva por compatibilidad y ya no tiene burbuja. `pages/fct/index.html` preserva la ruta
antigua con una redirección.

## Servidor persistente y ADMIN

`projects/services-api/` contiene un Worker ESM, migraciones versionadas y pruebas.
Sites publica ese servidor y provisiona D1 (`DB`) y R2 (`BUCKET`) según su propio
`.openai/hosting.json`. GitHub Pages solo sirve los clientes. `shared/api.js`
conecta ambos por HTTPS; `shared/api-config.js` contiene únicamente el origen
público. Las operaciones públicas no devuelven registros personales ni fotos.

PACA también tiene una publicación independiente en el proyecto Cloudflare
Pages `paca-paula-daniela`. El flujo previsto es Local → GitHub → Cloudflare
Pages, con `main` conectado en el panel de Cloudflare. GitHub Actions ejecuta
`npm run validate:paca` para los cambios relevantes y pull requests.
Cloudflare debe ejecutar el mismo comando antes de publicar exclusivamente
`dist/paca`, para que una prueba fallida impida el despliegue incluso si ambos
servicios compilan en paralelo. La conexión requiere autorización de GitHub;
ver `docs/paca-hosting.md` para su estado y configuración. No publica la API ni modifica D1/R2; el servidor de Sites
conserva su despliegue independiente. La portada y FCT siguen en GitHub Pages.

`pages/admin/` valida el acceso en el servidor, conserva la sesión solo en
memoria y pide contraseña al abrirse. La portada amplía la ventana únicamente
con mensajes del iframe ADMIN validando origen y emisor. La base de datos
almacena hashes de contraseña y sesión, solicitudes y configuración; R2 conserva
los adjuntos privados. Las ediciones usan versiones; la idempotencia evita
duplicados incluso tras respuestas de red inciertas. Un registro sin datos
personales impide recrear solicitudes eliminadas mediante un reintento tardío.

La activación inicial expira y solo funciona una vez. Cada operación ADMIN
comprueba autorización y la contraseña se elige fuera del código. Hasta
activar el acceso, el servidor rechaza nuevos envíos. Los datos persistentes
no se publican en Git ni dependen de la memoria de la aplicación. La operación
profesional requiere conservar la cuenta y mantener copias independientes;
ver `projects/services-api/README.md` para límites y procedimientos.

## FCT

- `src/main.js`: partida con `chess.js`, tablero 2D, selección, arrastre,
  promoción, revisión de jugadas, audio y coordinación de vistas.
- `src/ai-worker.js`: IA local en un Web Worker; recibe FEN e identificador
  de solicitud y devuelve una jugada. Usa negamax, poda alfa-beta y evaluación.
- `src/board3d.js`: escena Three.js, cámara con OrbitControls, terreno,
  piezas, animaciones y entrada del tablero. Se carga de forma diferida.
- `src/environment.js`: materiales procedurales y paisaje de piedra, césped,
  ruinas y vegetación. Usa instancias para piedras pequeñas y hierba.
- `src/terrain.js`: alturas de una loma irregular; las cuatro casillas
  centrales son la cima. Las alturas se comparten con piezas y marcadores;
  también define la paleta compartida de tierra y casillas.
- `src/mountain.js`: parches de césped planos con bordes irregulares, uniones
  trianguladas y laderas amplias que deshacen el contorno cuadrado. Las casillas
  conservan superficies planas para las piezas.
- `src/audio-cues.js`: selección del sonido de movimiento o captura,
  independiente del bando; pruebas en `projects/FCT/tests/`.
- `src/appearance-core.js`: catálogo, validación y persistencia de elecciones,
  solo durante la página abierta, restricciones por rol y paletas contrastantes
  para la IA. `appearance.js` añade las miniaturas Vite.
- `src/piece-selector.js` y `piece-selector.css`: selección por rol, borrador,
  diálogo de tamaño estable con desplazamiento interno y tarjetas sin nombres
  visibles (conservados como etiquetas accesibles),
  guardado/cancelación y vista previa accesible desde el menú.
- `src/character-volume.js`: volumen de vóxeles contiguos a partir de frente,
  espalda y perfil, separado en seis partes articuladas.
- `src/character-model.js` y `character-motion.js`: modelos compartidos con
  referencias y caché limitada; marcha en el sitio y respiración. Alturas
  normalizadas por rol; reyes mayores que reinas y estas mayores que las demás.
- `src/piece-preview.js`: visor Three.js del personaje del jugador; carga diferida,
  rotación y pausa del render al cerrar el selector.
- `src/style.css`: presentación principal del juego.
- `src/menu-theme.css`: tipografía local, portada ilustrada, acabado del selector
  y centrado/arrastre de sprites en 2D.
- `src/field-life.js`: detalles de casillas oscuras y una bandada de dos aves,
  con pausas de 45–75 segundos; movimiento reducido desactiva aves y viento.
  El viento tiene cuatro partículas. El cielo cósmico, sus planetas, galaxia,
  meteoros y texturas se retiraron. El render limita la densidad a 1,25 y
  las sombras a 1024 × 1024.
- `src/piece-values.js`: puntos de material compartidos por la interfaz y la IA;
  las torres valen cuatro puntos.
- `src/piece-motion.js`: fases y alturas individuales de flotación y ráfagas
  aleatorias de saltos para las capturadas; los desplazamientos se aplican sobre
  anclas fijas para conservar las casillas y la colocación lateral.
- `src/audio-system.js` y `audio-system.css`: controles independientes de música
  y efectos, volumen, selección suave, intento de autoplay y desbloqueo por interacción.
- `src/shuffle-queue.js` y `music-tracks.json`: cola aleatoria sin repetición por
  ciclo y navegación por el historial real de música.
- `public/game-status.js` y `public/status.css`: comportamiento y estilos
  complementarios de estado, controles y revisión de partida.
- `public/audio/`: efectos de interacción. `public/assets/music/`: ocho temas
  originales conservados desde la carpeta de publicación aportada por el usuario.
  Se publican sin cambiar sus bytes en `/FCT/assets/music/`.
- `public/fct-potion.png`: fuente del icono del juego y de su enlace en la portada.
- `sprites/`: hojas originales y recortes utilizados por las piezas.
  `scripts/build-characters.py` extrae las 70 paletas y tres vistas por personaje
  con Pillow en `sprites/characters/`. Los recortes anteriores de `cropped/`
  y `crop-sprites.ps1` son recursos heredados.
- `DESIGN.md`: concepto y decisiones iniciales; contrastar con la implementación
  actual al planear nuevas funciones.

Las rutas anteriores son relativas a `projects/FCT/`. `vite.config.js` fija
la base `/FCT/` y la salida `../../FCT`. Vite vacía esa carpeta al compilar;
no guardar allí fuentes ni cambios manuales. Instalar con `npm ci` para respetar
las versiones fijadas en `package-lock.json`.

## Duplicados y organización

PACA tenía HTML equivalente y CSS/JS idénticos en `projects/PACA/` y
`pages/paula/`. Se conserva únicamente `pages/paula/` para evitar divergencias
y mantener su URL pública. El icono duplicado en `img/` también se eliminó;
la portada usa `FCT/fct-potion.png`.

Los recursos repetidos entre `projects/FCT/` y `FCT/` son fuente y salida de
publicación. Se conservan porque el repositorio incluye el sitio compilado.
Los sprites originales y sus recortes se conservan como insumos y derivados
del proceso artístico.

## Comprobación automática

`scripts/check-site.mjs` verifica archivos locales referenciados desde el HTML
y CSS de producción y el inventario de fondos definido en `script.js`.
Omite enlaces externos, fragmentos y otros recursos dinámicos.
No ejecuta JavaScript del navegador, comprueba APIs externas ni evalúa la IA.
`scripts/tests/home.test.cjs` comprueba el bloqueo inicial, el glitch,
los ciclos de seis fondos, la visibilidad, el reloj y las ventanas.
