# Sitio personal · juankmilo11.github.io

Sitio estático para GitHub Pages con una portada interactiva, un juego de
ajedrez (FCT) y una página de servicios de belleza (PACA). No hay servidor
de aplicación ni base de datos en este repositorio.

## Estructura y fuentes de verdad

| Ruta | Responsabilidad | Cómo editar |
| --- | --- | --- |
| `index.html`, `styles.css`, `script.js` | Portada, reloj, fondos y ventanas con iframe | Directamente |
| `img/` | Iconos y fondos de la portada | Recursos estáticos |
| `pages/paula/` | PACA: página, estilos y filtros | Directamente; única fuente de PACA |
| `pages/sura/` | Página informativa inicial de SURA | Directamente |
| `pages/construccion/` | Sección en construcción | Directamente |
| `pages/fct/` | Redirección de la ruta antigua del juego | Conservar compatibilidad |
| `projects/FCT/` | Fuentes, dependencias y recursos del juego | Editar y compilar |
| `FCT/` | Salida de producción del juego en `/FCT/` | Generar con Vite |
| `scripts/` | Comprobaciones del repositorio | Herramientas de desarrollo |
| `docs/architecture.md` | Mapa técnico y decisiones de organización | Actualizar con cambios estructurales |

## Desarrollo local

Para las páginas estáticas, servir **la raíz del repositorio** con Python 3:

```powershell
python -m http.server 8000
```

Abrir `http://localhost:8000/`. Así funcionan las rutas absolutas de FCT.
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

```powershell
node scripts/check-site.mjs
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
La portada reutiliza su icono publicado.

Subir los commits al `origin` configurado:
[juankmilo11.github.io](https://github.com/juankmilo11/juankmilo11.github.io).
La activación de GitHub Pages depende de la configuración del repositorio remoto.
