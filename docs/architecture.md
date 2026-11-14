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
- `src/field-life.js`: detalles de casillas oscuras y cuatro bandadas de 52 aves
  en total mediante mallas instanciadas, con vuelos escalonados; respeta
  movimiento reducido y no interviene en la selección de casillas.
- `src/cosmos.js`: cielo con paralaje aparente, planeta rojo, planeta con aro
  con oclusión 3D, Tierra con Luna en órbita, galaxia de giro lento y meteoros. Texturas procedurales
  salvo el mapa local Blue Marble de NASA en `src/assets/`.
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
y CSS de producción. Omite enlaces externos, fragmentos y recursos dinámicos.
No ejecuta JavaScript del navegador, comprueba APIs externas ni evalúa la IA.
