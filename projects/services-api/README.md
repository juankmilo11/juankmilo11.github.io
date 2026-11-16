# Servicios persistentes de juankmilo

Worker Cloudflare para PACA y el panel ADMIN del sitio GitHub Pages. Los datos
operativos viven en D1 y las fotografías privadas en R2, no en Git, memoria del
servidor, `localStorage` ni archivos de la computadora del visitante. Reiniciar
un navegador, cambiar de equipo o publicar código no elimina esos registros.

## Despliegue

La identidad de Sites está en `.openai/hosting.json`. Los bindings lógicos son
`DB` (D1) y `BUCKET` (R2). Sites provisiona los recursos y aplica las migraciones
versionadas de `drizzle/` al publicar. No ejecutar DDL durante una petición.
Una migración aplicada es inmutable; posteriores cambios requieren otra
migración y otra entrada en `drizzle/meta/_journal.json`.

```powershell
node --test tests/worker.test.mjs
node build.mjs
```

La salida es `dist/server/index.js`. El helper de empaquetado Sites incluye el
manifiesto y las migraciones. El propietario del proyecto gestiona publicación,
acceso público al servicio de solicitudes y secretos de producción mediante
Sites. El repositorio contiene únicamente nombres de variables y configuración
no secreta.

Variables de entorno:

- `ALLOWED_ORIGINS`: lista exacta separada por comas de orígenes admitidos. En
  producción incluye `https://juankmilo11.github.io` y el origen del servicio.
  Agregar un origen local solo para pruebas, nunca un comodín.
- `ADMIN_SETUP_TOKEN_HASH`: SHA-256 hexadecimal del token aleatorio de activación
  de un solo uso. El token original no se incorpora al código ni al repositorio.
- `ADMIN_SETUP_EXPIRES_AT`: fecha ISO de caducidad de la activación. El servidor
  rechaza activaciones vencidas o si ya existe el administrador.
- `RATE_LIMIT_SECRET`: valor aleatorio privado para derivar claves de limitación
  de intentos sin conservar IP ni WhatsApp en la tabla de contadores.
- `ADMIN_PASSWORD_HASH`: alternativa para una instalación preconfigurada; formato
  `pbkdf2-sha256$100000$sal-base64$hash-base64`. En la instalación normal se usa
  la activación y el hash se conserva en D1. Nunca configurar una contraseña en
  texto plano como variable del proyecto o código del cliente.

La contraseña la elige el propietario en la pantalla de activación. Hasta
completarla no se aceptan solicitudes laborales: el servidor devuelve
`503 setup_required`. No existe contraseña pública, contraseña predeterminada
ni ruta de lectura anónima de solicitudes o fotografías.

## Modelo de operación

- Una solicitud nueva tiene estado `pending`: pide atención y no confirma una
  cita. ADMIN revisa el trabajo, fija su duración real y la confirma. Una
  duración toma inicialmente el máximo del rango estimado para ofrecer espacios suficientes.
  Paula puede ajustar la duración real al confirmar.
- Las confirmaciones bloquean su intervalo. Triggers de SQLite rechazan de
  forma atómica confirmaciones solapadas, incluso con dos operaciones simultáneas.
- El calendario público recibe únicamente fechas y franjas ocupadas, nunca
  nombres, contactos, notas o imágenes.
- La hora de referencia es `America/New_York`, con sus cambios estacionales;
  las fechas y horas ingresadas son locales a New Jersey.
- El cliente envía una clave aleatoria de idempotencia. Reintentar un envío
  exitoso devuelve el mismo identificador. Reutilizar la clave con otro contenido
  se rechaza. Una huella sin datos personales se retiene tras borrar una
  solicitud para impedir que un reintento tardío vuelva a crearla.
- Editar o eliminar requiere la versión vista por ADMIN. Otra edición concurrente
  produce `409 version_conflict`, evitando sobrescribir trabajo más reciente.
- La eliminación retira los datos de contacto, solicitud y referencias. El
  registro de auditoría conserva solo UUID, acción, versión y fecha. Un buzón
  persistente de eliminación reintenta borrar los objetos de R2 que no pudieran
  eliminarse por un fallo temporal; se procesa en las siguientes peticiones
  autenticadas de ADMIN. Las fotos retiradas dejan de tener ruta de lectura.

## Seguridad y mantenimiento

El acceso ADMIN valida la contraseña en el servidor, usa PBKDF2-SHA-256 con sal
aleatoria y sesiones aleatorias de una hora. D1 almacena únicamente el hash del
token de sesión. Cerrar sesión lo revoca; cambiar la contraseña revoca todas
las sesiones. El navegador mantiene el token en memoria durante la sesión.
Todas las operaciones privadas comprueban autorización; ocultar la burbuja o
su HTML no constituye la protección.

Se limitan los intentos de acceso y los envíos por ventanas temporales. Las
consultas SQL son parametrizadas, los cuerpos tienen límites y las fotos se
limitan a JPEG/PNG/WebP de hasta 8 MB, con revisión de firma de archivo y lectura
privada autenticada. No se publican las fotografías como enlaces compartidos.

La persistencia depende de conservar la cuenta, el proyecto y sus recursos del
proveedor. No equivale a una garantía de disponibilidad ilimitada ni a un
respaldo independiente. ADMIN permite exportar los registros y la configuración
para conservar una copia fuera del servicio. El JSON exportado incluye metadatos
de fotos, no sus bytes: las fotografías deben descargarse por separado desde
ADMIN para respaldarlas fuera de R2. Establecer una frecuencia de respaldos,
verificar periódicamente la recuperación y administrar acceso a las copias.
No borrar el Site ni sus bindings al publicar una actualización.

## API

Las respuestas fallidas son `{ "error": { "code": "...", "message": "..." } }`.
Las operaciones públicas son `GET /api/availability` y
`POST /api/appointments`; el envío acepta JSON o multipart (`payload` JSON,
`currentPhoto`, `inspirationPhoto`) y requiere `Idempotency-Key`.

ADMIN utiliza `POST /api/admin/setup`, `POST /api/admin/login`,
`POST /api/admin/logout`, `POST /api/admin/password`,
`GET /api/admin/appointments`, `GET/PATCH/DELETE /api/admin/appointments/:id`,
`GET /api/admin/attachments/:id`, `GET/PUT /api/admin/schedule`,
`POST /api/admin/schedule/preview` y
`GET /api/admin/export`. Las rutas privadas requieren `Authorization: Bearer`.
`GET /health` informa únicamente estado técnico del servicio, sin datos privados.

`tests/adapter.mjs` adapta `node:sqlite` a D1 y simula R2 para las pruebas; nunca
se importa en producción. Las pruebas incluyen conservación al reabrir SQLite,
activación y caducidad, autorización y límites, idempotencia, prevención de
solapamientos simultáneos, versiones, fotos privadas, reintento de borrado,
exportación sin secretos y revocación por cambio de contraseña.

## Rangos y vista previa de disponibilidad

Los nueve rangos iniciales están versionados en `worker/initial-estimates.json`.
Son sugerencias orientativas autorizadas para arrancar, no tarifas confirmadas
de Paula ni promedios de mercado. ADMIN permite editar mínimo y máximo de
minutos y precio USD por servicio, incluido el retiro adicional. Los valores
se validan en el servidor y se conservan con la configuración en D1.

Al leer una configuración anterior se añaden solo los rangos ausentes; se
conservan sus días cerrados, bloqueos y plazo. Al guardar desde la interfaz,
los rangos reemplazan las duraciones simples anteriores. El calendario y el
servidor usan el máximo del rango; el retiro se suma solo para uñas y una sola
vez. La duración real de una cita confirmada sigue siendo editable.

La vista previa privada valida el borrador y combina sus bloqueos con citas
confirmadas, sin guardar cambios. Su consulta mensual incluye todos los estados,
también canceladas e históricas, con nombre, servicio, hora y duración. Estos
registros requieren sesión ADMIN y no aparecen en la API pública. Las canceladas,
completadas y pendientes no bloquean horarios. No se cargan contactos, notas ni
fotografías en esta consulta. Los ejemplos grises de
los campos no son cierres guardados. El aviso indica qué está guardado y qué
es un cambio pendiente. La migración 0002 comprueba atómicamente la versión
de disponibilidad y las citas confirmadas al insertar una solicitud, para
rechazar cambios concurrentes durante la subida de fotos.
