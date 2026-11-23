# FCT principal · IA y prioridad de escudos

## Reglas de esta revisión

El usuario sigue jugando primero, con 1/2/3 acciones por ronda. Todos los escudos
seleccionados se activan antes que los movimientos; después se alternan las
órdenes restantes empezando por el usuario. Activar sigue consumiendo un hueco,
el recurso único del bando y caduca al cerrar la ronda. Si ambos declaran escudo,
se activan primero usuario e IA, sin capturas entre ambas activaciones.

La interfaz deja el tablero despejado: reloj y controles de vista en el banner,
sin piezas en foco, secuencia ni intercambio. Salir solicita confirmación. La
revisión mantiene solo navegación/deslizador. Estas decisiones no conceden a la
IA información privada ni reglas diferentes.

## Cambios en la búsqueda

La versión anterior generaba un pequeño haz por material propio y elegía la
secuencia por su peor respuesta aproximada. Sus límites podían omitir jugadas
que solo funcionan al intercalarse con el rival, especialmente casillas aliadas
que serían recapturadas y atacantes protegidos por escudo.

El modelo nuevo conserva ese arranque y añade:

- Simulación de parejas de planes con el mismo motor de prioridad y capturas.
- Permutaciones de órdenes para valorar cuándo capturar o escapar.
- Mejores respuestas iterativas por casilla de la secuencia: cada candidata se
  evalúa contra planes contrarios reales, no solo contra una previsión en solitario.
- Planes explícitos de presión al rey con atacante protegido, y dos capturas
  sucesivas por actores distintos para romper un escudo y recapturar.
- Previsiones de capturas en casillas aliadas amenazadas y captura al paso futura.
- Prioridad categórica a evitar una derrota inmediata, para que una media material
  favorable no compense dejar capturar al rey en alguna respuesta considerada.
- Valor de reserva del escudo de 120 centipeones, evitando gastarlo rutinariamente
  por un peón y conservando la posibilidad de proteger al rey o una pieza mayor.
- Caché de simulaciones y un máximo determinista de 1800 parejas por planificación.
  El cálculo sigue en un Worker y no bloquea el tablero.

El Worker aporta una semilla aleatoria nueva solo para variar entre planes con
puntuación y peor respuesta casi iguales. No aleatoriza sacrificios graves ni
abandona una captura ganadora para crear variedad. En pruebas puede pasarse una
semilla fija; el mismo estado público y semilla producen la misma secuencia.

Esto es búsqueda aproximada sobre un subconjunto de planes, no un solucionador
completo de ajedrez ni un equilibrio de Nash. No se asigna una fuerza Elo.

## Fuentes e inferencias

La investigación de juegos simultáneos describe el uso de respuestas adversarias
iterativas y juegos restringidos: [Using Double-Oracle Method and Serialized
Alpha-Beta Search for Pruning in Simultaneous Move Games, IJCAI
2013](https://www.ijcai.org/Proceedings/13/Papers/018.pdf). La inferencia aplicada
es ampliar el conjunto con respuestas concretas que refutan un plan candidato;
FCT no implementa literalmente ese algoritmo ni sus garantías.

También se contrastó una mezcla aproximada mediante juego ficticio en la matriz
restringida, motivada por la investigación sobre selección en juegos simultáneos
[NeurIPS 2013](https://proceedings.neurips.cc/paper/2013/file/1579779b98ce9edb98dd85606f2c119d-Paper.pdf).
No se mantuvo esa variante: en esta muestra obtuvo menos victorias que la
selección conservadora. El azar final solo desempata planes casi equivalentes.

## Comparaciones reproducibles

`node projects/FCT/scripts/benchmark-tactics.mjs --previous --rounds=35`

La referencia está congelada en `scripts/reference-tactics-ai.mjs`: es el
planificador de la versión anterior, ejecutado con el mismo motor actual y la
misma prioridad de escudos. No es un humano ni Stockfish. Cuatro semillas
(1103,1240,1377,1514), con bandos intercambiados: ocho partidas.

La configuración conservada ganó 5/8 (4/4 primero, 1/4 segundo); la referencia
3/8. No hubo planes inválidos, empates ni límite de rondas. Tiempo medio de la
nueva: unos 753 ms por plan; referencia: 411 ms en el equipo de desarrollo,
compartiendo CPU con otras comprobaciones. Son medidas orientativas de escritorio,
no de teléfonos físicos. La variante de mezcla y la de presión sin reserva ni
recaptura obtuvieron 4/8 y se descartaron.

La muestra sirve para detectar regresiones, no demuestra superioridad general.
La iniciativa sigue siendo una ventaja importante; no se alteran reglas para
ocultarla. La validación adicional, sin retocar la configuración, usó semillas 2141, 2663,
3137 y 4211 con bandos intercambiados (`--seeds=2141,2663,3137,4211`). Ganó 6/8:
4/4 primero y 2/4 segundo; referencia 2/8. Sin empates, límites ni planes inválidos.
Coste medio: 881 ms frente a 474 ms. Sumando ambas muestras: 11/16 para la nueva,
8/8 primero y 3/8 segundo. La muestra sigue siendo pequeña y no establece Elo.

Las pruebas automáticas cubren escudos prioritarios, seguridad del rey,
promoción segura, captura al paso, recurso único, intentos ocupados, presupuestos,
órdenes privadas y reproducibilidad con semilla. La interfaz se verifica en
escritorio y móvil emulado. El balance humano requiere partidas reales.
