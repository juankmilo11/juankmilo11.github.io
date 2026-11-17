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
- `assets/catalog.json`: trabajos reales y sus medios. Las fotos se cargan de
  forma diferida y los videos se piden al elegirlos en el visor.
- `js/app.js`: filtros, carga progresiva que conserva tarjetas existentes,
  visor de trabajos y preselección de servicio/referencia.
- `js/booking.js`: validación, subventana de calendario, revisión, archivos,
  envío seguro y comprobante del servidor.
- `js/booking-window.js`, `css/booking-window.css`: ventanas de citas y calendario.
- `js/agenda.js`: disponibilidad pública del servicio, calendario y franjas.
- `js/schedule.js`: reglas de horario de New Jersey compartidas con las pruebas.
- `js/locales.js`, `js/i18n.js`: inglés/español, incluidos mensajes y etiquetas
  accesibles. Cambiar el idioma conserva datos escritos y selecciones.
- `js/theme.js`, `css/theme.css`: contraste claro/oscuro de ambas subventanas.
- `js/experience.js`, `css/experience.css`: efectos de opacidad y transformación,
  progreso de lectura y entradas. El retrato de THE ARTIST tiene una flotación
  suave y el sello una oscilación: usan solo transformaciones CSS y se pausan
  fuera de pantalla, al ocultar la pestaña o con movimiento reducido.

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

Las dos últimas pruebas requieren Playwright y Edge (o `PLAYWRIGHT_MODULE_PATH`
y `PACA_BROWSER_CHANNEL`). `qa-paca.cjs` usa un servicio simulado explícito para
comprobar el contrato del navegador sin crear solicitudes reales y guarda
capturas en la carpeta temporal `paca-qa` (configurable con `PACA_QA_OUTPUT`).
`qa-online.mjs` conecta el navegador con el Worker real y los adaptadores locales
de SQLite y R2: comprueba escritura multipart, persistencia tras reabrir la base,
acceso ADMIN, fotos privadas, edición, conflictos de versión, bloqueo del horario,
eliminación y cierre de sesión. Usa únicamente datos y contraseñas de prueba.
