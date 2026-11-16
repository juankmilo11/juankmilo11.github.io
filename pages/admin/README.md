# JK

La pantalla de acceso muestra ADMIN dentro de la ventana JK. Actualizar
confirma el éxito solo después de recibir los datos; Cancelar descarta el
borrador de edición sin enviar cambios. Los controles Estado y Duración se
alinean por su borde superior y tienen la misma altura.

Las fotos identificadas se muestran como Current e Inspiration. Las nuevas
solicitudes conservan el tipo de archivo; en las antiguas solo se recupera
cuando su huella original demuestra la correspondencia. Si no puede probarse,
se muestra Foto adjunta para evitar intercambiar fotografías por su orden.

Panel JK del sitio para gestionar los aplicativos. PACA incluye solicitudes,
edición, confirmación de horarios, eliminación, fotos privadas y disponibilidad.
LBDS muestra un espacio pendiente de integración; no inventa registros.

El HTML y JavaScript son públicos. La protección de los datos depende de las
comprobaciones de autenticación del servidor en cada ruta de administración.
No se guarda una contraseña, sesión ni copia de solicitudes en el almacenamiento
del navegador. Al recargar o terminar la sesión se debe volver a entrar.

## Acceso

La activación inicial usa un enlace privado con `#activate=…`. El fragmento se
retira del historial al leerlo y el token solo permanece en memoria hasta la
activación. La contraseña se introduce en el formulario y se envía al servidor
por HTTPS. El enlace solo sirve una vez. Las contraseñas deben tener al menos
14 caracteres. Un cambio de contraseña cierra todas las sesiones del servidor.

La burbuja de la portada recibe únicamente el estado de autenticación por
`postMessage`; nunca recibe contraseñas ni tokens. Las sesiones vencidas o
rechazadas con HTTP 401 cierran el panel y borran los datos mostrados.

## Gestión de PACA

- Las fechas y horas de las citas corresponden a `America/New_York`.
- Una solicitud pendiente no confirma una cita. Para confirmar hay que indicar
  su duración total; el servidor comprueba disponibilidad y solapamientos.
- La edición y la eliminación incluyen la versión del registro para detectar
  cambios de otra sesión. Si hay un conflicto, actualizar y volver a abrirlo.
- Eliminar exige una confirmación explícita y borra la solicitud y sus fotos.
- La disponibilidad permite duraciones, días cerrados y bloqueos sin datos
  personales; las citas confirmadas se incorporan desde el servidor.
- El respaldo JSON contiene los datos de las solicitudes y la configuración.
  Los archivos de fotos permanecen en el almacenamiento privado del servidor;
  el JSON no sustituye un respaldo de dichos archivos.

`../../shared/api-config.js` solo contiene la dirección pública del servicio.
`admin.js` usa `ProjectAPI.request`; el token se envía como autorización y nunca
se incluye en URLs. Las fotos se muestran mediante objetos Blob temporales que
se revocan al cerrar la vista o la sesión.
