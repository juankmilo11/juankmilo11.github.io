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

## Cielo simplificado

Se retiraron los planetas, la galaxia, los meteoros y el mapa Blue Marble de
NASA del código y de la salida publicada para reducir descarga y trabajo de GPU.
Se conserva el fondo de cielo estático, sin texturas astronómicas adicionales.

## Sprites y audio

Las hojas originales se conservan en `projects/FCT/sprites/` con sus créditos.
Las miniaturas derivadas se centran por su contenido opaco; los atlas mantienen
la misma base para reconstruir el volumen 3D.

Los cinco colores comunes de los bandos se definen en
`projects/FCT/scripts/army-palettes.json`. El generador de personajes recolorea
la ropa y conserva los tonos de piel y cabello. Las posturas de jaque y derrota
se derivan de esos sprites mediante `projects/FCT/scripts/build-king-poses.py`:
140 PNG transparentes para los 14 personajes reales y sus cinco colores. En 3D
las mismas posturas se aplican al modelo articulado y se ajustan al suelo.

Los cuatro WAV `menu1`–`menu4` aportados por el usuario se conservan en
`projects/FCT/public/audio/`, su fuente de publicación. Uso exclusivo: selector
de piezas. No añadir recursos nuevos directamente a `FCT/` sin trasladarlos
también a las fuentes antes de compilar.

## Corrección anatómica del fondo · noviembre de 2026

Archivo usado por el juego: `projects/FCT/public/menu-keyart-v2.webp`, copiado
por Vite a `FCT/menu-keyart-v2.webp`. Se editó la ilustración original con la
herramienta integrada **image_gen** y se convirtió a WebP. El archivo anterior
se conserva como referencia. Las piezas del juego se generan mediante el script
de extracción/recoloración de los sprites aportados por el usuario, y su malla
3D se reconstruye y suaviza en el código; no son imágenes generadas por IA.

Prompt de edición del fondo:

> Edit this existing wide parchment watercolor fantasy tactics game menu illustration. Preserve its composition, warm antique parchment, open empty left half for UI, stone ruined arch, distant castle, five adventurers on the right and reflected shallow water. Repair anatomical mistakes in the right-hand group: the young brown-haired green-cloaked adventurer in front of the blue-robed pointed-hat mage must have exactly two natural arms, hands with coherent fingers, no extra elbow/forearm. The mage should hold the long wooden staff naturally in one hand, with the hand and staff correctly connected; remove any floating arms or disconnected limbs between the ranger and mage. The white-robed healer's hands and staff should also be coherent. Refine faces/hands and clothing edges while keeping the same characters, aesthetic, light and composition. No text, no logos. Clean detailed watercolor illustration, landscape 16:9.
