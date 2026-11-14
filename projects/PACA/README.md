# PACA · archivo y selección de Paula Daniela

La página publicada vive únicamente en `pages/paula/`. Esta carpeta contiene
la selección y herramientas de preparación del material, sin una segunda web.

## Material organizado

Se inventariaron 732 archivos: 326 imágenes, 232 videos, 173 textos y un
identificador. Se conservaron los originales en `paulaadaniiela/` y se revisaron
las imágenes en siete hojas de contacto. El inventario y la clasificación
orientativa de todo el archivo están en `work/`; los videos no seleccionados
pueden requerir revisión adicional.

La selección web contiene 37 trabajos: 22 uñas, 8 tatuajes, 3 maquillaje
permanente, 2 maquillaje y 2 cabello. Incluye 38 WebP (con retrato de Paula)
y tres videos cortos, unos 5.74 MiB en total. Se corrigió orientación y tamaño;
no se retocaron piel, diseños ni resultados. Se descartaron duplicados,
promociones antiguas, precios históricos, certificados y fotos familiares.

`selection.json` conserva los nombres de origen y metadatos mínimos de la
selección. Los captions completos y las hojas de contacto se conservan solo
en `work/`. `paulaadaniiela/` y `work/` están excluidos de Git: se publican los
recursos preparados de `pages/paula/assets/`.

## Preparar recursos

Desde la raíz, con Python y Pillow disponibles:

```powershell
python projects/PACA/tools/prepare-assets.py
node scripts/check-paca.mjs
```

La selección usa rutas de origen estables. Para añadir un trabajo, incluirlo
en `selection.json` con categoría `nails`, `tattoo`, `pmu`, `makeup` o `hair`,
título y descripción visual, y volver a preparar. El retrato tiene categoría
`null` porque no es una tarjeta del catálogo. Una alternativa es editar
`pages/paula/assets/catalog.json` y añadir directamente un recurso optimizado.
No borrar el archivo original al retirar un trabajo del catálogo.

## Datos y límites

Instagram verificado: `@paulaadaniiela`. Ubicación comunicada: New Jersey.
No se inventan tarifas, horarios, direcciones, testimonios o certificaciones.
Los trabajos provienen del archivo y no implican disponibilidad actual.
Las citas se solicitan con el formulario y se confirman por Instagram.

Diseño editorial inspirado en la referencia solicitada, RCA Records:
fotografía protagonista, tipografía de gran escala, contraste, movimiento
continuo pausable y exploración visual. No se reutilizaron sus recursos.

El inglés es el idioma original de `title` y `alt`; cada selección incluye
`translations.es` con sus equivalentes en español. Al añadir trabajos, completar
ambos idiomas para que el selector EN / ES cubra también el catálogo.
