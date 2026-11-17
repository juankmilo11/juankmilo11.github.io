# PACA independiente

Publicación: <https://paca-paula-daniela.pages.dev/>.
Administración: <https://paca-paula-daniela.pages.dev/admin/>.
Proyecto Cloudflare Pages: `paca-paula-daniela` (carga directa, plan gratuito).

La fuente continúa siendo `pages/paula/`. El icono es el mismo PNG de la
burbuja rosa de la portada. No mantener otra copia manual de esta página.

`npm run build:paca` produce `dist/paca/` para Cloudflare Pages, con el catálogo,
videos, fuentes, cliente HTTP y acceso privado `/admin/`. La salida no contiene
FCT, LBD, credenciales, solicitudes ni fotos de clientes. Las fuentes locales
incluyen sus licencias. Cada compilación comprueba las referencias HTML/CSS.

El cliente utiliza el servicio existente definido en `shared/api-config.js`.
D1 y R2 siguen en el Site original: publicar el frontend no crea otra base de
datos ni duplica citas. Los administradores acceden con su contraseña habitual;
las sesiones permanecen solo en memoria. El nuevo origen debe figurar de forma
exacta en `ALLOWED_ORIGINS` del servidor, junto con los orígenes anteriores.
Después de cambiar esa variable hay que volver a desplegar la versión existente
del servidor para aplicar su nueva revisión de entorno.

Para actualizar la publicación de carga directa de Cloudflare Pages:

```powershell
npm run build:paca
Compress-Archive -Path 'dist/paca/*' -DestinationPath 'dist/paca-upload.zip' -Force
```

Subir el ZIP a una nueva implementación de producción del mismo proyecto Pages.
El archivo `index.html` queda en la raíz del ZIP. Conservar la cuenta y el
proyecto. Usar el plan gratuito, sin Workers de pago ni complementos. Los límites
y la disponibilidad corresponden al proveedor; el servidor de citas existente
tiene su propio ciclo de vida y necesita mantenerse activo y respaldado.

La integración local completa puede probar esta salida con:

```powershell
$env:PACA_QA_ROOT=(Resolve-Path 'dist/paca').Path
npm run qa:online
```

La prueba usa SQLite/R2 sintéticos; no envía solicitudes a producción.

`PACA_DEPLOYMENT_URL=https://paca-paula-daniela.pages.dev/` permite ejecutar
`node scripts/qa-paca-deployment.cjs` para la comprobación pública de solo
lectura: icono idéntico a la burbuja, catálogo, calendario/API, idiomas y acceso
protegido, en escritorio y móviles de 390/320 píxeles.

Para un dominio propio, asociarlo primero al proyecto en Custom domains y aplicar
los registros DNS indicados por Cloudflare. Añadir el origen HTTPS exacto a
`ALLOWED_ORIGINS`, desplegar el servidor y comprobar desde ese dominio el
calendario, solicitud con foto y administración. No sustituir la dirección del
servidor API por el dominio del frontend. El registro/renovación de un dominio
propio se paga aparte del alojamiento gratuito.
