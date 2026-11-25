# PACA · Paula Daniela

Catálogo y solicitud de citas en `/pages/paula/`, integrado en la burbuja PACA.
Esta carpeta contiene el cliente publicado; el servicio en línea y la base de
datos están documentados en el proyecto de servidor. El catálogo no requiere
compilación. El agendamiento requiere el servicio configurado en
`shared/api-config.js`; nunca guarda solicitudes en localStorage como sustituto
del servidor.

## Flujo de citas

- Nombre y número de WhatsApp son obligatorios. El selector admite solo EE. UU.
  (+1), predeterminado, y Colombia (+57); la persona escribe los 10 dígitos
  nacionales. Instagram es opcional y se valida como usuario, no como correo ni URL.
- El botón «Elegir fecha y hora» abre una segunda subventana encima del borrador.
  «Usar este horario» aplica la elección. Cancelar, cerrar o Escape conserva la
  elección anterior y devuelve el foco al botón; Escape no cierra el formulario.
- Las condiciones de la cita se muestran cerradas inicialmente. Los acuerdos
  siguen siendo obligatorios antes del envío.
- Solo se permite cancelar o reagendar con al menos 1 día de anticipación,
  nunca el mismo día. Cuando Paula Daniela contacte por WhatsApp, el cliente
  debe realizar un depósito mínimo de $20 USD para confirmar. El formulario,
  las preguntas frecuentes y el resumen explican estas condiciones en ambos idiomas.
- La persona revisa el resumen y pulsa «Enviar solicitud». Solo se muestra un
  número de solicitud cuando el servidor confirma la escritura. El estado
  inicial es pendiente; recibir la solicitud no equivale a confirmar la cita.
- El diseño de inspiración es obligatorio para todos los servicios antes de enviar,
  también si se eligió una referencia del catálogo. La foto actual es opcional.
  El contacto y las fotos se envían con consentimiento. Las fotos
  JPEG, PNG o WebP admiten hasta 8 MB cada una; se mandan como archivos privados,
  no como nombres de archivo que aparenten haber sido guardados.
- Los fallos conservan el borrador y permiten reintentar con la misma clave de
  idempotencia. El botón se bloquea durante el envío para evitar doble clic.
  La clave y los datos del borrador viven únicamente mientras la ventana PACA
  permanece abierta. La persistencia de solicitudes aceptadas está en el servidor.
- No hay paso de copiar ni enviar por Instagram. El administrador gestiona las
  solicitudes desde JK; las correcciones posteriores se coordinan con Paula.

Cerrar y reabrir la subventana conserva un borrador sin enviar durante esa
visita. Tras guardar, «Salir» cierra la subventana; cualquier cierre de un
comprobante limpia el formulario, archivos, horario y clave de envío para la
siguiente solicitud. No se ponen datos de clientes
ni credenciales en URLs. Sin JavaScript se explica que hay que activarlo para
solicitar una cita; el formulario no envía datos por GET.

## Archivos

- `index.html`, `css/styles.css`: catálogo, servicios, artista y preguntas frecuentes.
- `assets/catalog.json`: los 35 trabajos reales y sus medios originales.
- `js/app.js`: filtros, lista de respaldo y selección visual de trabajos.
  Clic y Enter no abren el visor ni la reserva; la reserva se abre con sus
  controles específicos y desde los servicios. Se conservan los medios y
  el código del visor anterior, sin conectarlo a la navegación de la galería.
- `js/booking.js`: validación, subventana de calendario, revisión, archivos,
  envío seguro y comprobante del servidor.
- `js/booking-window.js`, `css/booking-window.css`: ventanas de citas y calendario.
- `js/agenda.js`: disponibilidad pública del servicio, calendario y franjas.
- `js/schedule.js`: reglas de horario de New Jersey compartidas con las pruebas.
- `js/locales.js`, `js/i18n.js`: inglés/español, incluidos mensajes y etiquetas
  accesibles. Cambiar el idioma conserva datos escritos y selecciones.
- `js/theme.js`, `css/theme.css`: contraste claro/oscuro de ambas subventanas.
- `js/experience.js`, `css/experience.css`: progreso de lectura, sección activa,
  entradas que se repiten al volver a pantalla y tipografía original. Los grupos
  de títulos/copy esperan 120 ms, un 18% visible y 64 px dentro del viewport;
  solo se reinician tras salir por completo (margen de 48 px), evitando parpadeo.
  El foco de teclado y el movimiento reducido muestran el contenido directamente. La reserva
  flotante se oculta en el hero y el cierre para evitar duplicar sus llamadas.
- `css/motion.css`: navbar flotante, capas de PACA y controles de al menos
  16 px/44 px. Mantiene las fuentes, fotografías y colores existentes.
- `js/motion-runtime.js`: un reloj por sección, suspendido fuera del viewport
  y con la pestaña oculta. Desmonta listeners/observers/GPU en `pagehide` y
  restaura una sola instancia al volver desde la caché de navegación.
- `index.html`: loader crítico con el logo real vectorizado en
  `assets/logo-paca.svg`, símbolo y wordmark separados, fondo muestreado
  `#e5c2ea`, trazado/relleno y salida en 2,6 s (límite 3 s). Se muestra en cada
  carga/recarga completa, incluso con anclas; no usa sessionStorage para omitirlo.
  Se omite sin JS, con movimiento reducido y al ocultar la pestaña.
  Tab/Escape lo descartan sin atrapar el foco; un cambio de ancla no lo reinicia.
- `js/hero-motion.js`: escena sticky de 100svh dentro de 260svh, texto SVG
  sobre el sendero especificado: la cinta se mueve automáticamente mientras
  está visible; solo el zoom/parallax de la foto responde al scroll. El H1
  revela sus glifos por puntos fijos que crecen hasta el sólido, una vez al
  entrar al 15% del viewport y después de retirarse el loader. En touch se usa
  recorte diagonal; con movimiento reducido el título aparece completo y la
  cinta queda fija. El texto real sigue siendo seleccionable y accesible.
- `js/catalog-motion.js`: Three.js local con licencia MIT, cámara ortográfica,
  flujo vertical y plano 12×32. Conserva N, orden, src y alt del catálogo.
  Cámara (20,12.1,16.6) hacia (-7,-2.1,1.3), frustum 10.8/12.5 ajustado a las
  proporciones reales; pista (4.3,2.1,5.1) con Euler XYZ (-.0215,2.2884,.2884).
  Se usa el pivote y las tres correcciones de rotación solicitadas, U volteada
  una vez y color sRGB. Cull 3.2, siete texturas como máximo, DPR máximo 1,5.
  Rueda/drag/touch vertical y flechas arriba/abajo; Home reinicia al primero.
  Damping .047 normalizado a 60Hz, dt máximo .05 s y snap a los 160 ms.
  La flexión usa la velocidad real y es exactamente cero en reposo.
  Sin botones, contadores, títulos visibles ni acciones de clic/Enter.
  Con movimiento reducido se conserva la navegación explícita instantánea;
  solo sin WebGL o al perder contexto se muestra la lista completa con sus alt.
- `js/services-motion.js`: cuatro pósteres con contenido real y transición
  local de tres fases de 600 ms. Anterior/Siguiente, puntos, teclado y swipe;
  sin autoplay. Un nuevo clic asienta el destino anterior antes de empezar.
  Los paneles inactivos son inert/aria-hidden. Sin JS quedan los details
  originales; con movimiento reducido el cambio es instantáneo. Makeup usa
  `makeup-social.webp`, procedente del archivo original de Paula.
- `js/artist-motion.js`: nombre real de Paula en las fuentes actuales,
  dibujado/relleno/espera/desvanecido en 5,6 s, continuo mientras es visible.
  El retrato tiene revelado circular, profundidad, inclinación por puntero,
  luz y movimiento suave. La entrada observa el contenedor estable, no el
  retrato recortado, para que no pueda quedar invisible en escritorio.
  Un solo reloj anima nombre y foto. No hay botones
  de pausa/reproducción; con movimiento reducido la foto y el nombre son fijos.
- `js/story-motion.js`: cierre PACA con fotografía real, copy existente,
  enlace de Instagram verificado y capas con respuesta suavizada de 200 ms.
  Las seis capas PACA del abanico reemplazan el wordmark minúsculo anterior.
- `css/fonts.css`, `assets/fonts/`: mismas Barlow Condensed y DM Sans, ahora
  WOFF2 locales con licencias OFL verificadas. No hay peticiones a Google Fonts.

Las URLs de imágenes fallidas se notifican en la página y en consola; no se
sustituyen por imágenes externas. Los nuevos efectos no requieren cuentas,
CDN de JavaScript ni fuentes adicionales. Con movimiento reducido quedan
visibles los textos finales; la galería sigue siendo navegable sin suavizado
ni flexión y solo inicializa Three.js al entrar en pantalla.

## Disponibilidad

El horario usa `America/New_York`, de lunes a viernes de 07:00 a 19:00. La
consulta en línea se hace al abrir el calendario y antes de revisar la solicitud.
Si la disponibilidad falla, el cliente muestra un error y ofrece reintentar;
no presenta el antiguo JSON estático como si fuera disponibilidad en vivo.
Las citas guardadas y sus cambios se gestionan desde JK. Las comprobaciones
finales de disponibilidad y contenido corresponden al servidor.

El JSON `assets/availability.json` se conserva como configuración inicial y
recurso de pruebas, no como base de solicitudes. El antiguo `agenda.html` es
un editor de ese archivo y no administra los registros guardados en línea.

## Comprobación

Desde la raíz:

```powershell
node scripts/check-paca.mjs
node scripts/test-paca-booking.cjs
node scripts/test-paca-schedule.cjs
node scripts/test-paca-i18n.cjs
node scripts/test-paca-theme.cjs
node scripts/qa-paca.cjs
node scripts/qa-online.mjs
```

Con el servidor local activo, `node scripts/qa-paca-studio.cjs` (también
`qa-paca-motion.cjs`) comprueba 390/768/1440 px, extremos del hero, transiciones,
repetición rápida, reservas por servicio, retrato, EN/ES y tema nocturno.
`qa-paca-resilience.cjs` prueba recargas normales/con anclas, red lenta y límite
del loader, pestaña oculta, movimiento reducido, ausencia de JS/WebGL, swipe vertical y
desmontaje/restauración. Usan Playwright/Edge, aceptan `PLAYWRIGHT_MODULE_PATH`
y `PACA_DEPLOYMENT_URL` (por defecto el servidor en puerto 4250); las capturas
se guardan en `dist/qa-studio`. No envían citas reales.
`qa-paca-gallery.cjs` comprueba el retrato de PC desde una carga nueva,
rueda/drag, reposo sin flexión, no acción de clic/Enter, scroll fuera del canvas,
los 35 alt en su orden, navegación reducida y pérdida de contexto.
`qa-paca-headings.cjs` comprueba entrada retrasada, estabilidad en el borde,
repetición tras salir del viewport y accesibilidad de teclado/movimiento reducido.

`scripts/prepare-paca-logo.py` documenta el trazado del JPG suministrado con
Pillow/numpy/vtracer. `scripts/prepare-paca-fonts.mjs` documenta la obtención de
las fuentes oficiales y licencias. Los resultados están versionados; ninguno
de estos procesos ni sus dependencias se necesita para compilar/publicar.
`scripts/compress-paca-fonts.py` comprime sin cambiar los glifos las fuentes
editoriales Cinzel/Crimson Pro que ya se usaban en PACA; conserva sus OFL.

Verificación histórica del commit `74eaeab`, 25 de noviembre de 2026,
Lighthouse 13.6.0, perfil móvil
simulado y la misma máquina/servidor, comparando el build anterior con el nuevo:

| Métrica | Anterior | Nuevo |
| --- | ---: | ---: |
| Performance | 55 | 79 |
| LCP simulado | 5,29 s | 4,76 s |
| TBT | 1180 ms | 38 ms |
| CLS | 0 | 0 |

Son mediciones de laboratorio de una ejecución por versión, no una garantía
de métricas de campo. Informes locales: `dist/paca-lighthouse-before.json` y
`dist/paca-lighthouse-optimized.json`. La compresión WOFF2 de las fuentes de
Artista reduce 371 792 bytes a 133 864 sin cambiar sus glifos. La galería reserva
su espacio y evita descargar imágenes de respaldo mientras espera al viewport.

Las dos últimas pruebas requieren Playwright y Edge (o `PLAYWRIGHT_MODULE_PATH`
y `PACA_BROWSER_CHANNEL`). `qa-paca.cjs` usa un servicio simulado explícito para
comprobar el contrato del navegador sin crear solicitudes reales y guarda
capturas en la carpeta temporal `paca-qa` (configurable con `PACA_QA_OUTPUT`).
`qa-online.mjs` conecta el navegador con el Worker real y los adaptadores locales
de SQLite y R2: comprueba escritura multipart, persistencia tras reabrir la base,
acceso ADMIN, fotos privadas, edición, conflictos de versión, bloqueo del horario,
eliminación y cierre de sesión. Usa únicamente datos y contraseñas de prueba.
