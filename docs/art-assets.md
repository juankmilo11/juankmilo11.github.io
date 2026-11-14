# Recursos visuales y tipografía de FCT

## Fondo del menú

Archivo fuente de publicación: `projects/FCT/public/menu-keyart.webp`.
Vite lo copia a `FCT/menu-keyart.webp`. Se generó con la herramienta integrada
**image_gen**, usando la habilidad `imagegen`,
y se empaquetó como WebP para la web. La imagen original se conserva en la
carpeta de imágenes generadas de Codex. El fondo es una ilustración nueva
inspirada en la composición de la portada de FFT para PS1.

Prompt final:

> Use case: stylized-concept. Asset: wide 16:9 background illustration for a browser fantasy chess game's main menu, inspired by the pale original 1997 PlayStation Final Fantasy Tactics cover, not a logo or replica game box. Original ink-and-watercolor illustration on ivory aged parchment: a solemn small party of five medieval fantasy warriors with capes, light armor and spears crossing shallow reflective water beneath a weathered stone arch, delicate expressive pen outlines and muted sepia, dusty sage, faded teal washes, lots of luminous white paper and airy mist, beautiful 1990s Japanese tactical RPG key art atmosphere. Composition: all characters, the arch and the reflection occupy the right 60 percent and lower-right portion; left 40 percent is quiet lightly textured parchment negative space reserved for live UI. Overall subdued and elegant, not dark, not photorealistic, no 3D render, no anime neon, no words or lettering, no logos, no decorative frames, no game UI, no watermark. Landscape wide format.

## Fuentes

Se sirven desde `projects/FCT/public/fonts/`, sin peticiones a Google Fonts al jugar:

- **Cinzel**: títulos; [fuente oficial y licencia](https://github.com/google/fonts/tree/main/ofl/cinzel).
- **Crimson Pro**: menús y textos; [fuente oficial y licencia](https://github.com/google/fonts/tree/main/ofl/crimsonpro).

Las licencias OFL están incluidas junto a los TTF. Los símbolos de ajedrez
conservan el respaldo tipográfico de símbolos del sistema.

## Planeta Tierra

`projects/FCT/src/assets/earth-blue-marble.jpg` es el mapa de julio de 2004 de
[Blue Marble: Next Generation con topografía](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/).
Crédito: Reto Stöckli, NASA Earth Observatory. Se conserva el JPEG original
de 5400 × 2700 y se reduce en memoria a 1024 × 512 al cargarlo en la esfera.
El recurso se sirve localmente; el juego no hace peticiones a NASA.
[Archivo original](https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography/july/world.topo.200407.3x5400x2700.jpg).

## Sprites y audio

Las hojas originales se conservan en `projects/FCT/sprites/` con sus créditos.
Las miniaturas derivadas se centran por su contenido opaco; los atlas mantienen
la misma base para reconstruir el volumen 3D.

Los cuatro WAV `menu1`–`menu4` aportados por el usuario se conservan en
`projects/FCT/public/audio/`, su fuente de publicación. Uso exclusivo: selector
de piezas. No añadir recursos nuevos directamente a `FCT/` sin trasladarlos
también a las fuentes antes de compilar.
