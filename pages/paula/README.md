# PACA · Paula Daniela

Página estática de catálogo y solicitudes de cita en `/pages/paula/`, integrada
en la burbuja PACA del sitio principal. Esta carpeta es la única fuente publicada.
No requiere compilación ni backend.

- `index.html` y `css/styles.css`: diseño adaptable de portada, catálogo,
  servicios, artista y preguntas frecuentes. El agendamiento vive en un diálogo
  independiente, fuera del contenido principal.
- `assets/catalog.json`: 35 trabajos, categorías y rutas de sus fotografías y
  tres clips. Las tarjetas cargan imágenes de forma diferida; los videos solo
  se cargan al elegirlos en el visor y no se reproducen automáticamente.
- `js/app.js`: filtros sin contadores, carga progresiva sin reconstruir las
  tarjetas existentes, visor modal con teclado y portada intercambiable.
- `js/booking-window.js` y `css/booking-window.css`: subventana de citas con el
  mismo diseño, idioma y contraste. Todos los accesos de agendamiento la abren;
  cerrar con el botón o Escape conserva el borrador y devuelve el foco al acceso.
- `js/booking.js`: validación, agenda manual en hora local de New Jersey, resumen editable y
  copia con alternativa para iframe. «Quiero algo así» preselecciona servicio
  e incorpora una referencia sin borrar la idea escrita.

## Solicitudes de cita

El usuario revisa y copia la solicitud, abre Instagram y la envía manualmente
a `@paulaadaniiela`. Abrir Instagram no envía mensajes. No hay reserva ni
confirmación automática, conexión a agenda o envío de formularios a servidores.
No se guardan datos personales en localStorage, cookies ni URLs.

Sin JavaScript, el formulario está deshabilitado y no puede enviar datos por
GET. Los accesos de cita llevan directamente a Instagram si JavaScript no está
disponible. La página respeta movimiento reducido y usa diálogos nativos para
el visor de trabajos y el agendamiento.

## Desarrollo y comprobación

Desde la raíz:

```powershell
node scripts/serve-static.cjs
node scripts/check-site.mjs
node scripts/check-paca.mjs
node scripts/test-paca-booking.cjs
```

Abrir `http://127.0.0.1:4173/pages/paula/` o la raíz para comprobar la burbuja.
El puerto se puede cambiar con `PORT`. Servir por HTTP; abrir el HTML como
`file://` impide que algunos navegadores carguen el JSON del catálogo.

Probar filtros, Más inspiración, fotos/videos, Escape, devolución del foco,
todos los accesos de cita, borrador al cerrar y reabrir, preselección, fechas
pasadas y copia/edición en escritorio y móvil. Las fuentes Google Fonts tienen
alternativas del sistema. La comprobación real del navegador se ejecuta con
`node scripts/qa-paca.cjs`; requiere Playwright y Microsoft Edge, o indicar
`PLAYWRIGHT_MODULE_PATH` y `PACA_BROWSER_CHANNEL`. Las capturas se guardan en
la carpeta temporal `paca-qa` (configurable con `PACA_QA_OUTPUT`).

La selección, procedencia y regeneración se documentan en
`projects/PACA/README.md`. Originales e informes completos permanecen locales.

## Idiomas

El idioma original y predeterminado es inglés, incluso sin JavaScript. El
selector EN / ES cambia todos los textos de la interfaz, descripciones y títulos
del catálogo, textos accesibles, validaciones y resumen de cita. La elección se
recuerda en `localStorage` como `paca-language`; no se guardan datos personales.
El contenido que escriba el visitante se preserva al cambiar de idioma.

`js/locales.js` contiene el texto estático y los mensajes dinámicos en ambos
idiomas. `js/i18n.js` conserva los nodos y controles de la página durante la
traducción. Las entradas del catálogo usan `title` y `alt` en inglés, y
`translations.es` para español; la selección y su generador conservan esos datos.

## Identidad visual y selección actual

Paleta rosa claro y beige con texto ciruela. `assets/icons.svg` contiene una
flor propia y los iconos de línea; `js/icons.js` los conserva también en los
controles dinámicos. Las portadas ocupan todo el ancho y las tarjetas usan un
marco en arco con encuadre centrado. La pestaña de maquillaje permanente es PMU.

El catálogo y los servicios ya no incluyen trenzas ni coloración de cabello.
La selección de regeneración también los excluye; los originales se conservan
en el archivo local, sin publicar.

## Agenda y preparación de citas

`assets/availability.json` es la fuente pública de disponibilidad. El horario es
lunes a viernes, de 07:00 a 19:00, en `America/New_York`; el navegador adapta el
calendario al horario de verano de New Jersey. Se excluyen fines de semana,
fechas pasadas, días cerrados y bloques ocupados. La disponibilidad se vuelve
a consultar al abrir la subventana y antes de preparar la solicitud. Mientras
está cerrada no se actualizan los horarios cada minuto. Una solicitud no confirma ni
bloquea una cita. Paula debe confirmarla por Instagram y registrar el bloqueo.

Abrir `/pages/paula/agenda.html` para editar manualmente: agregar bloques o días
cerrados, indicar duraciones en minutos y descargar `availability.json`. Publicar
el archivo descargado en `pages/paula/assets/availability.json` para que todas
las visitas vean el cambio. El editor no tiene acceso de escritura al servidor;
no incluye credenciales ni registra nombres, contactos ni otros datos de clientes.
La agenda inicial no contiene citas ni días bloqueados: hay que registrar las
citas existentes antes de usarla como referencia de ocupación.

Las duraciones no proporcionadas permanecen en `null`: se muestran horas de
inicio para solicitar y Paula confirma el tiempo que necesita el diseño. Cuando
se configuraron duraciones, el calendario exige que el servicio y el retiro
caben antes de las 19:00 y no se superpongan con otros bloques. Si la clienta
no sabe si necesita retiro, se reserva el margen extra configurado.

El formulario distingue set completo, relleno y retiro. Exige indicar si hay
producto que retirar y aceptar el costo y tiempo extra cuando corresponda,
así como puntualidad, aviso de cancelación y lectura de las condiciones. No
se han establecido multas ni anticipos sin confirmación del negocio.
Las fotos opcionales se previsualizan en el dispositivo y deben adjuntarse
por separado en Instagram: no se suben ni se envían automáticamente.

`js/schedule.js` concentra reglas verificables sin navegador; `js/agenda.js`
construye calendario y franjas; `js/experience.js` añade progreso de lectura
con una actualización por fotograma y mide la altura solo al cambiar el contenido.
Las animaciones permanecen activas mientras PACA está abierto, respetando
movimiento reducido. Las tarjetas usan un desplazamiento CSS al pasar el cursor;
las entradas y fundidos animan opacidad y transformaciones, sin inclinación
calculada en cada movimiento, máscaras animadas ni desenfoque de los diálogos.
`css/experience.css` contiene la sección editorial de Paula y el nuevo formulario.

Comprobar también `node scripts/test-paca-schedule.cjs` y
`node scripts/test-paca-i18n.cjs`. Las traducciones incluyen textos alternativos
de imágenes y conservan los datos escritos al cambiar de idioma.

## Contraste

El selector de sol/luna de la cabecera cambia todo el catálogo, visor, agenda
y formulario entre día y noche. Cada nueva visita inicia en claro. El idioma
no altera el contraste elegido; el marco exterior recibe el cambio mediante
un mensaje validado por origen y por iframe. No hay control de ampliación.

Verificar con `node scripts/test-paca-theme.cjs`.
