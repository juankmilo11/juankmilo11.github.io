# Sitio personal · juankmilo11.github.io

Portada y aplicaciones en GitHub Pages, con FCT, PACA y un panel JK.
El agendamiento utiliza un servidor independiente en Sites con base de datos
Cloudflare D1 y fotografías privadas en R2. Los datos de clientes no se guardan
en GitHub ni en archivos del navegador.

## Estructura y fuentes de verdad

| Ruta | Responsabilidad | Cómo editar |
| --- | --- | --- |
| `index.html`, `styles.css`, `script.js` | Portada, reloj, fondos y ventanas con iframe | Directamente |
| `img/` | Iconos y fondos de la portada | Recursos estáticos |
| `pages/paula/` | PACA: página, estilos y filtros | Directamente; única fuente de PACA |
| `pages/admin/` | Acceso protegido y gestión de solicitudes y disponibilidad | Cliente del servidor; nunca incluir credenciales |
| `shared/` | Cliente HTTP y dirección pública del servicio | Configuración pública sin secretos |
| `projects/services-api/` | Servidor, migraciones D1, acceso ADMIN y fotos privadas | Probar y publicar con Sites |
| `projects/PACA/` | Selección del catálogo y preparación del material de Paula | Originales locales; recursos publicados en `pages/paula/assets/` |
| `pages/sura/` | LBDSEGUROS: GIF de construcción a todo el ancho | Directamente |
| `pages/construccion/` | Antigua sección en construcción, sin acceso desde la portada | Compatibilidad |
| `pages/fct/` | Redirección de la ruta antigua del juego | Conservar compatibilidad |
| `projects/FCT/` | Fuentes, dependencias y recursos del juego | Editar y compilar |
| `FCT/` | Salida de producción del juego en `/FCT/` | Generar con Vite |
| `scripts/` | Comprobaciones del repositorio | Herramientas de desarrollo |
| `docs/architecture.md` | Mapa técnico y decisiones de organización | Actualizar con cambios estructurales |

## Desarrollo local

Para las páginas estáticas, servir **la raíz del repositorio** con Node.js:

```powershell
node scripts/serve-static.cjs
```

Abrir `http://127.0.0.1:4173/`. Así funcionan las rutas absolutas de FCT.
PACA se edita en `pages/paula/`; ya no requiere sincronización manual.

Para el juego se necesita Node.js compatible con el Vite fijado en su lockfile:

```powershell
cd projects/FCT
npm ci
npm run dev
```

Abrir la URL que indique Vite bajo `/FCT/`. Ver [FCT](projects/FCT/README.md),
[PACA](pages/paula/README.md) y el [mapa técnico](docs/architecture.md).

## Validación y publicación

Desde la raíz:

`npm run validate` ejecuta las comprobaciones estáticas, las pruebas de la
portada/PACA/API/FCT y la compilación del Worker en orden, deteniéndose ante
el primer fallo. No instala dependencias ni publica. FCT requiere sus
dependencias locales (`npm --prefix projects/FCT ci`). Las pruebas de navegador
se ejecutan por separado con `npm run qa:online`, `npm run qa:paca` y
`npm run qa:fct`; requieren Playwright y Edge.

```powershell
node scripts/check-site.mjs
node --test scripts/tests/*.test.cjs
node scripts/check-paca.mjs
node scripts/test-paca-booking.cjs
node --test projects/services-api/tests/worker.test.mjs
npm --prefix projects/FCT run build
node scripts/check-site.mjs
git diff --check
```

La comprobación verifica referencias locales de HTML/CSS publicados y detecta
la reintroducción de la antigua copia de PACA. Antes de publicar, revisar también
la portada, sus ventanas, los filtros de PACA y una partida en las vistas 2D/3D,
incluyendo móvil.

La compilación reemplaza `FCT/`; incluir su salida junto con los cambios de
fuentes en el commit. Los recursos repetidos entre `projects/FCT/` y `FCT/`
son fuente y salida de publicación y se conservan para servir el juego.
La portada usa cuatro variantes transparentes del mismo símbolo circular en
`img/bubble-*.png`: azul claro, rosa, verde y naranja; JK continúa la fila.

La portada inicia con cinco segundos de glitch en el título y las burbujas
bloqueadas, incluido el Yin Yang. Después recuperan la interacción con ratón,
teclado y apertura de FCT en otra pestaña. El plazo comienza al ejecutar el
script diferido; no depende del evento `load` ni se prolonga si falla un GIF.

La portada inicia sin ventanas y alterna los cinco GIF en orden aleatorio sin
repeticiones por ciclo: un segundo de oscurecimiento (o hasta terminar la carga),
un segundo para aclarar y cinco segundos de imagen. El control btn_1 combina la bandera de Colombia y el símbolo de luz; el color
manual permanece activo hasta pulsar el Yin Yang. Este retoma los GIF, cambia
la velocidad y activa el glitch durante 2,4 segundos. Solo las burbujas abren
ventanas, que conservan su tamaño original adaptable a la pantalla.
Los fondos se preparan de uno en uno; la rotación se pausa al ocultar la pestaña.
El reloj reutiliza su formateador y solo se actualiza al cambiar de minuto,
con una actualización inmediata al volver a la pestaña.
El inventario de fondos vive en [img/fondos](img/fondos/README.md);
la comprobación detecta referencias a archivos eliminados o sin registrar.

Subir los commits al `origin` configurado:
[juankmilo11.github.io](https://github.com/juankmilo11/juankmilo11.github.io).
La activación de GitHub Pages depende de la configuración del repositorio remoto.

## Agendamiento en línea y JK

La burbuja JK pide la contraseña antes de cargar registros. La activación
inicial usa un enlace privado de un solo uso, con caducidad; la contraseña la
elige el propietario en esa pantalla. No se solicita por chat ni se incluye en
el repositorio. Hasta activar ADMIN el servidor no acepta solicitudes de citas.

PACA pide WhatsApp obligatorio e Instagram opcional. El calendario se abre en
otra subventana. Tras revisar y enviar, el comprobante solo aparece cuando el
servidor confirma que guardó la solicitud. JK permite editar, confirmar,
cancelar y eliminar, consultar fotos privadas y exportar un respaldo de datos.
Las solicitudes pendientes no reservan un horario; las citas confirmadas sí.
Las horas mostradas en JK incluyen AM/PM. PACA exige una imagen de inspiración;
la foto actual sigue siendo opcional. El cliente acepta cancelar o reagendar
con al menos un día de anticipación, nunca el mismo día, y realizar un depósito
mínimo de $20 USD cuando Paula Daniela le contacte por WhatsApp para confirmar.
JK incluye Plantillas con mensajes editables, copia al portapapeles y guardado
en el servidor. La publicación del Worker en Sites es independiente del push a
GitHub: ambos clientes y servidor deben actualizarse para habilitar este módulo.
LBDS aún no tiene registros ni un módulo de negocio que gestionar.

El servicio está en [Juankmilo Apps API](https://juankmilo-apps-api.camilo200181.chatgpt.site).
Mantener ese proyecto y sus bindings: publicar una nueva versión conserva D1/R2;
eliminar el servicio o su almacenamiento afecta los datos. La continuidad exige
mantener la cuenta y respaldos independientes. El JSON exporta registros y
configuración; respaldar las fotos por separado. Ver el [manual del servidor](projects/services-api/README.md)
y las [instrucciones de ADMIN](pages/admin/README.md).

Las pruebas completas con navegador están en `scripts/qa-online.mjs`: cliente
real, Worker, SQLite persistente de prueba y adaptador de R2; no usan datos ni
credenciales de producción. Requieren Playwright y Edge, como las pruebas PACA.
