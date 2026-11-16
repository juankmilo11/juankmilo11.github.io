# Fondos de la portada

Los cinco GIF vigentes se conservan en esta carpeta con sus nombres originales:

- `gif3.gif`
- `gif4.gif`
- `gif6.gif`
- `gif7.gif`
- `gif9.gif`

`gif1.gif`, `gif2.gif`, `gif5.gif` y `gif8.gif` fueron retirados. La lista de reproducción
es `fondosGif` en `script.js`; al añadir o quitar un fondo, actualizar esa lista
y este inventario. Ejecutar `node scripts/check-site.mjs` y
`node --test scripts/tests/home.test.cjs` desde la raíz para detectar diferencias.

Cada ciclo muestra los cinco archivos una vez en orden aleatorio, sin repetir
el último al comenzar el siguiente ciclo. Solo se prepara el próximo archivo;
no se descargan todos los GIF al iniciar. La rotación se pausa en segundo plano.
