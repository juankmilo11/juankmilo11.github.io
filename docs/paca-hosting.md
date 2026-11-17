# PACA independiente

Publicación: <https://paca-paula-daniela.pages.dev/>.
Administración: <https://paca-paula-daniela.pages.dev/admin/>.
Proyecto Cloudflare Pages: `paca-paula-daniela` (integración Git conectada).

## Local → GitHub → Cloudflare

El flujo utiliza la integración Git del proyecto para compilar y subir
`dist/paca/` al recibir commits en `main`. La portada y FCT siguen en GitHub Pages.
La API mantiene su publicación independiente en Sites, con los mismos D1/R2.

Estado comprobado el 17 de noviembre de 2026: Cloudflare está conectado a
`juankmilo11/juankmilo11.github.io`, con rama de producción `main` y despliegues
automáticos habilitados. El propietario completó la autorización de la aplicación
oficial de Cloudflare en GitHub. La primera compilación desde Git se verifica
después de publicar esta configuración; conectar el repositorio por sí solo no
demuestra que el build haya terminado correctamente.

La conexión utiliza únicamente `juankmilo11/juankmilo11.github.io` y estos valores:

| Ajuste | Valor |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Root directory | Raíz del repositorio |
| Build command | `npm run validate:paca` |
| Build output directory | `dist/paca` |
| Node.js | `24`, fijado en `.node-version` |

El comando ejecuta 24 pruebas de cliente HTTP, reservas, agenda, idiomas y tema,
valida el catálogo y genera el paquete comprobando referencias HTML/CSS.
Si falla, Cloudflare debe detenerse antes de publicar. No necesita instalar ni
compilar FCT, y no publica la API, fuentes de desarrollo ni datos privados.

`.github/workflows/paca-cloudflare.yml` ejecuta la misma validación en pull
requests hacia `main`, pushes relevantes a `main` y ejecuciones manuales. Ese
workflow solo valida: la publicación corresponde a la integración de Cloudflare,
que también ejecuta las pruebas y no depende de que Actions termine primero.
No se necesitan tokens de Cloudflare en el repositorio para esta modalidad.

El proyecto se creó con carga directa y el panel permitió vincularlo mediante
**Settings → Build → Git repository → Connect**, conservando su dirección.
La integración Git es la única vía automática configurada. No habilitar además
otro workflow de publicación con Wrangler, para evitar despliegues duplicados.
Ver [integración Git](https://developers.cloudflare.com/pages/configuration/git-integration/).

Para cada actualización, desde la raíz del repositorio:

```powershell
npm run validate:paca
git add pages/paula/ pages/admin/ shared/
git commit -m "Update PACA"
git push origin main
```

Incluir también cualquier otro archivo modificado que necesite esa actualización.
Revisar **Actions → PACA · Validation** y **Cloudflare → Deployments** hasta ver
las ejecuciones exitosas y comprobar la URL pública, calendario y acceso ADMIN.
`dist/paca/` no se añade a Git: Cloudflare lo genera desde las fuentes.
El build local sigue disponible como
respaldo para carga manual.

## Paquete y servidor existente

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

Como alternativa manual, para actualizar la publicación de carga directa:

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
