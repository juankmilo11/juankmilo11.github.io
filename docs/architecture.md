# Arquitectura y mantenimiento

## Portada y secciones

`index.html` carga `styles.css` y `script.js`. El script administra el reloj,
fondos GIF, colores, rotación del yin yang y ventanas arrastrables con iframe.
Los enlaces con `data-open-tab` abren otra pestaña (FCT); el resto abre ventanas.
Al iniciar se abren las secciones estáticas de forma escalonada.

Cada sección bajo `pages/` es independiente. PACA carga su propio CSS y JS,
con filtros de servicios y animaciones. SURA y construcción contienen estilos
locales. `pages/fct/index.html` preserva la ruta antigua con una redirección.

## FCT

- `src/main.js`: partida con `chess.js`, tablero 2D, selección, arrastre,
  promoción, revisión de jugadas, audio y coordinación de vistas.
- `src/ai-worker.js`: IA local en un Web Worker; recibe FEN e identificador
  de solicitud y devuelve una jugada. Usa negamax, poda alfa-beta y evaluación.
- `src/board3d.js`: escena Three.js, cámara con OrbitControls, terreno,
  piezas, animaciones y entrada del tablero. Se carga de forma diferida.
- `src/style.css`: presentación principal del juego.
- `public/game-status.js` y `public/status.css`: comportamiento y estilos
  complementarios de estado, controles y revisión de partida.
- `public/audio/`: efectos de interacción. `audio/Incarnam.mp3`: música que
  Vite procesa desde el HTML.
- `public/fct-potion.png`: fuente del icono del juego y de su enlace en la portada.
- `sprites/`: hojas originales y recortes utilizados por las piezas.
  `scripts/crop-sprites.ps1` genera recortes con System.Drawing en Windows.
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
y CSS de producción. Omite enlaces externos, fragmentos y recursos dinámicos.
No ejecuta JavaScript del navegador, comprueba APIs externas ni evalúa la IA.
