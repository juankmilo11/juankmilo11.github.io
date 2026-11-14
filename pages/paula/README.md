# PACA · Paula Daniela

Página estática de catálogo y solicitudes de cita en `/pages/paula/`, integrada
en la burbuja PACA del sitio principal. Esta carpeta es la única fuente publicada.
No requiere compilación ni backend.

- `index.html` y `css/styles.css`: diseño adaptable de portada, catálogo,
  servicios, artista, citas y preguntas frecuentes.
- `assets/catalog.json`: 37 trabajos, categorías y rutas de sus fotografías y
  tres clips. Las tarjetas cargan imágenes de forma diferida; los videos solo
  se cargan al elegirlos en el visor y no se reproducen automáticamente.
- `js/app.js`: búsqueda sin acentos, filtros, carga progresiva, visor modal con
  navegación por teclado, portada intercambiable y pausa de animaciones.
- `js/booking.js`: validación, fecha local de New Jersey, resumen editable y
  copia con alternativa para iframe. «Quiero algo así» preselecciona servicio
  e incorpora una referencia sin borrar la idea escrita.

## Solicitudes de cita

El usuario revisa y copia la solicitud, abre Instagram y la envía manualmente
a `@paulaadaniiela`. Abrir Instagram no envía mensajes. No hay reserva ni
confirmación automática, conexión a agenda o envío de formularios a servidores.
No se guardan datos personales en localStorage, cookies ni URLs.

Sin JavaScript, el formulario está deshabilitado y no puede enviar datos por
GET. Hay un enlace directo a Instagram. La página respeta movimiento reducido,
permite pausar animaciones y usa un diálogo nativo para el visor de trabajos.

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

Probar filtros, búsqueda vacía, Más inspiración, fotos/videos, Escape,
preselección, fechas pasadas, copia/edición y ampliación de ventana en escritorio
y móvil. Las fuentes Google Fonts tienen alternativas del sistema.

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
