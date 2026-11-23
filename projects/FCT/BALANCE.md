# FCT principal: decisiones de balance e IA

## Reglas y consecuencias

El objetivo es capturar al rey; no hay puntos de vida ni disparos. Las órdenes
se preparan sin conocer las del rival y se resuelven usuario/IA intercaladamente.
Las rondas ofrecen 1, 2 y después 3 acciones por bando, con 20 segundos por orden.
Una misma ficha no repite movimiento en una ronda. Un escudo cuesta una acción,
se puede activar una sola vez por ejército, rebota una captura y caduca al cerrar
la ronda. Ajedrez960 usa una formación inicial compartida para ambos bandos.

Son decisiones de diseño, no conclusiones estadísticas de equilibrio:

- El crecimiento 1/2/3 evita una secuencia extensa en el primer contacto.
- El límite por ficha exige coordinar varias piezas y evita que una sola reina
  recorra tres veces el tablero antes de que el rival pueda preparar otra ronda.
- El escudo protege del primer intento de captura, pero cuesta una de las acciones
  limitadas y consume un recurso de toda la partida. No devuelve daño ni captura.
- Una casilla aliada puede ser un destino previsto; si sigue ocupada al ejecutarse,
  se pierde la acción. Lo mismo ocurre con una diagonal de peón que sigue vacía.
- El usuario siempre empieza. Esto elimina la tirada y facilita el aprendizaje,
  pero concede una ventaja de iniciativa que no se debe confundir con equilibrio.
  La IA compensa mediante búsqueda, no con información oculta ni ventajas de reglas.

## Investigación utilizada

Los trabajos originales sobre juegos de movimientos simultáneos tratan cada
combinación de decisiones como un juego matricial. Una búsqueda secuencial común
puede producir un valor distinto del juego simultáneo; la elección de respuestas
puras y las aproximaciones de búsqueda intercambian optimalidad por velocidad.
Esto se describe en [Alpha-Beta Pruning for Games with Simultaneous Moves,
AAAI 2012](https://cdn.aaai.org/ojs/8148/8148-13-11675-1-2-20201228.pdf) y en
[Fast Heuristic Search for RTS Game Combat Scenarios, AAAI
2013](https://cdn.aaai.org/ojs/12527/12527-52-16049-1-2-20201228.pdf).

La inferencia aplicada a FCT es comparar planes completos contra respuestas
contrarias plausibles usando el motor real, en lugar de evaluar únicamente cómo
quedaría el ejército si el rival esperara. FCT no implementa esos artículos de
forma literal ni resuelve un equilibrio mixto de Nash.

## Modelo implementado

La IA genera secuencias con un haz limitado de siete ramas, con hasta 24
candidatos en la primera profundidad y 16 en las siguientes. Conserva diversidad
entre primeras órdenes para no llenar el haz con variaciones de una sola captura.
Para cada uno de hasta siete planes propios evalúa hasta siete planes contrarios,
una espera y hasta dos refutaciones adicionales construidas a partir de su propia
hipótesis. Cada pareja pasa por `submitPlan` y `resolveNext`: respeta el orden real,
los rebotes, las capturas fallidas, la promoción y la captura al paso.

La puntuación combina 90 % del peor resultado de esas respuestas con 10 % de la
media. Al terminar un intercambio tiene en cuenta quién actúa a continuación:
un rey negro ya capturable puede caer en la primera orden blanca antes de que
la IA responda. Ese caso recibe prioridad casi terminal, no una penalización de
material que una captura de reina pudiera compensar. Es una política conservadora aproximada: no garantiza óptimo ni considera
todas las órdenes posibles. Las refutaciones se generan desde hipótesis públicas;
no se consulta ninguna orden sellada real. Si una hipótesis captura al rey rival,
se siguen considerando escapes desde la posición anterior a esa captura. También se generan intentos diagonales condicionales
de captura al paso cuando un peón rival puede habilitarlos con un doble avance
desde su fila inicial; la búsqueda no supone conocer esa orden rival.

Los valores iniciales compartidos por IA/HUD son peón 1, caballo 3,2, alfil 3,3,
torre 5 y reina 9. Son prioridades materiales, no resultados de una calibración
empírica para FCT. El rey tiene prioridad terminal, por encima de toda la suma de
material. La evaluación añade exposición del rey, amenazas, defensores, movilidad,
control central, avance de peones, promoción y disponibilidad del escudo. El
recurso de escudo tiene un pequeño valor de reserva, de modo que no se gasta
solamente por estar disponible.

La búsqueda usa presupuestos deterministas de nodos y trabaja en un Worker.
No depende de una fecha límite variable para escoger jugadas; por eso la misma
observación pública produce el mismo plan. El tablero sigue respondiendo mientras
la IA calcula. No se ha atribuido un nivel Elo ni se ha integrado Stockfish: las
órdenes predictivas y el rey capturable requieren reglas distintas del clásico.

## Validación y límites

Las pruebas cubren presupuestos 1/2/3, movimientos distintos por ficha,
inmutabilidad de la partida, independencia de órdenes selladas/logs/RNG,
captura del rey, captura de material cuando la iniciativa permite realizarla,
rechazo de una captura de reina que abandona el rey, agotamiento del escudo,
promoción con captura y captura al paso antes de que expire.

La regresión del motor de cuatro partidas contra sí mismo (semillas 1103,
1240, 1377 y 1514; límite de 60 rondas), anterior a la corrección del horizonte de
iniciativa, terminó en rondas 10, 7, 6 y 9, sin planes inválidos ni límites.
Ganó el primer bando en las cuatro. Media de 8 rondas y unos 467 ms por plan en
el entorno de desarrollo. Esto señala una ventaja de iniciativa que merece
seguimiento, no una prueba estadística general.

Para contrastar la búsqueda de respuestas con una referencia reproducible:

```sh
node projects/FCT/scripts/benchmark-tactics.mjs --rounds=40
```

El script compara la IA nueva con una política sencilla que selecciona sus
propias órdenes por material, exposición del rey y desarrollo, sin simular planes
contrarios. No es la IA antigua ni Stockfish ni un jugador humano. Usa las cuatro
semillas anteriores y cambia de bando a la IA nueva: ocho partidas en total.
Ambas políticas usan las mismas reglas, valores y observaciones públicas. Los
planes se validan antes de ejecutarse.

| Resultado del contraste | Medición |
| --- | --- |
| Victorias de la búsqueda con respuestas | 5 de 8 |
| Jugando primero | 4 de 4 |
| Jugando segundo | 1 de 4 |
| Victorias de la referencia sencilla | 3 de 8 |
| Empates / límites / planes inválidos | 0 / 0 / 0 |
| Tiempo medio por plan, IA nueva | 458 ms |
| Tiempo medio por plan, referencia sencilla | 21 ms |

Estos ocho encuentros, realizados con la corrección de horizonte, prueban que
la búsqueda puede superar a esa referencia incluso jugando segunda, pero no
establecen fuerza Elo ni balance humano. El primer bando ganó siete de ocho
partidas: el cambio de IA no elimina la ventaja de actuar primero. Los tiempos
son del entorno de desarrollo, compartiendo CPU con otras verificaciones, no de
teléfonos físicos. Las órdenes frustradas son esperables en un sistema predictivo
y no indican por sí solas un error de validación.

Se probaron y descartaron dos variantes sobre esas mismas ocho partidas:

| Variante | Victorias totales | Victorias jugando segunda | Tiempo medio por plan |
| --- | --- | --- | --- |
| Configuración conservada: haz/planes/respuestas 7, candidatos 24/16, 2 refutaciones | 5/8 | 1/4 | 458 ms |
| Haz/planes/respuestas 10, candidatos 32/24, 3 refutaciones | 4/8 | 0/4 | 769 ms |
| Configuración pequeña con bonificación acotada a posiciones intermedias para favorecer capturas tempranas | 4/8 | 0/4 | 430 ms |

Se conserva la primera configuración: ampliar la búsqueda y adelantar capturas
por una bonificación heurística no mejoraron este contraste. Ajustar parámetros
para las mismas cuatro semillas también puede sobreajustar; por eso estos ensayos
no se presentan como una calibración general ni se continúa afinando hasta forzar
un resultado deseado. La corrección de seguridad del rey según la próxima acción
sí permanece: se deriva del orden de ejecución real y tiene una prueba táctica.

Conviene contrastar el modo con jugadores humanos antes de modificar la ventaja
de iniciativa o el recurso de escudo. Métricas útiles: victorias por bando y por
formación 960, rondas hasta captura del rey, utilización del escudo, porcentaje de
órdenes frustradas, resultados de promociones y tiempo de planificación en equipos
físicos modestos. No se altera en secreto ninguna regla para favorecer a la IA.
