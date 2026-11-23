# FCT principal · predicción, capturas y mate

## Reglas evaluadas

Formación normal de ajedrez, sin escudos. Una acción por bando en la ronda 1 y
dos desde la ronda 2, pudiendo mover la misma pieza dos veces. La iniciativa
cambia cada dos rondas: usuario 1–2, IA 3–4, usuario 5–6, etc. Se conservan los
20 segundos para confirmar cada orden.
Las secuencias se preparan en secreto. La resolución intercala los bandos y
termina inmediatamente por captura del rey o mate. Un obstáculo puede acortar
un desplazamiento o producir una captura anterior al destino declarado.

## Modelo de la IA

La búsqueda compara parejas de planes mediante el motor real. El Worker recibe
una copia pública del tablero antes de que el usuario termine de preparar sus
órdenes. El plan contrario, el generador de azar de la partida, la preparación
del rival y sus registros privados no participan en la elección.

El planificador combina:

- Un haz inicial de secuencias, con diversidad de primeras jugadas.
- Permutaciones para explorar el orden de capturas y desplazamientos, incluidas
  dos jugadas consecutivas de la misma pieza entre las acciones rivales.
- Respuestas adversarias iterativas que sustituyen una orden de la secuencia y
  se prueban contra planes contrarios completos.
- Planes explícitos de presión al rey, recapturas en casillas actualmente
  aliadas y alternativas defensivas con el rey al principio o al final.
- Resolución real de intercepciones, promociones, captura al paso y enroque.
- Prioridad terminal para captura del rey y jaque mate, y rechazo de posiciones
  que entregan el rey al primer movimiento rival de la siguiente ronda.
- Control del centro, desarrollo de piezas menores, avance de peones, piezas
  expuestas, cobertura de peones y casillas amenazadas alrededor del rey.

Los valores materiales compartidos son peón 1, caballo 3,1, alfil 3,35, torre 5,
reina 9,5 y rey 1000. El rey es un objetivo terminal, no una pieza intercambiable
por ese material. Son prioridades heurísticas de esta variante; no una tabla
de balance demostrada ni cambios en el valor de la partida clásica.

Una caché evita repetir simulaciones y el presupuesto normal limita la búsqueda
a 1400 parejas. La semilla del Worker solo desempata planes con puntuación y
peor resultado casi iguales. La media se acota para que una captura especulativa
del rey no compense un mal resultado contra una defensa sensata. No accede a
decisiones secretas ni altera reglas. El cálculo ocurre fuera del hilo de
dibujo; su coste depende del dispositivo y
de la complejidad del tablero. No es Stockfish ni una búsqueda exhaustiva.

## Investigación e inferencias

Los movimientos y el mate se contrastan con las [reglas de FIDE](https://handbook.fide.com/chapter/E012023).
El motor también se compara con chess.js en posiciones de mate, escapes y
ahogado. La muestra reproducible de 80 partidas legales generadas recorrió
13.535 posiciones, 710 con jaque y 10 con mate, sin diferencias:
`node projects/FCT/scripts/check-mate-oracle.mjs`.
La comprobación de mate ignora los presupuestos de órdenes: agotar las
acciones de una ronda no convierte por sí solo un jaque en mate.

La investigación sobre juegos simultáneos motiva las mejores respuestas sobre
un conjunto restringido de estrategias: [Using Double-Oracle Method and
Serialized Alpha-Beta Search for Pruning in Simultaneous Move Games, IJCAI
2013](https://ijcai.org/proceedings/2013/19). La inferencia aplicada
es incorporar respuestas concretas que refuten un candidato. FCT no implementa
literalmente ese algoritmo ni sus garantías de equilibrio.

La selección final sigue siendo conservadora. La aleatoriedad solo varía entre
planes casi equivalentes; no se promete impredecibilidad completa, fuerza Elo
ni equilibrio perfecto en este juego de órdenes secretas.

## Comparación y mediciones históricas

```sh
node projects/FCT/scripts/benchmark-tactics.mjs --previous --seeds=2141,3137 --rounds=30
```

La referencia congelada en scripts/reference-tactics-ai.mjs es el planificador
de la publicación anterior, ejecutado con las reglas actuales de captura,
intercepción y mate. Nunca se importa en producción. Las semillas varían los
desempates de planes, no la formación inicial, que siempre es clásica. Cada
semilla intercambia los dos bandos para separar fuerza e iniciativa.

Las mediciones de la publicación anterior correspondían a 1/2/3 acciones y al
usuario empezando siempre. No se presentan como resultados de estas reglas:
la iniciativa por parejas y la posibilidad de mover dos veces una pieza cambian
las respuestas válidas y la estrategia. La IA genera ahora esas continuaciones
y evalúa la seguridad del rey según quién empieza realmente la siguiente ronda.

En aquella muestra pequeña, la versión previa ganó 2/4, ambas como primer bando;
las derrotas como segundo llegaron en las rondas 19 y 20, frente a la ronda 6
antes de corregir las retiradas del rey. No establecía superioridad general ni
Elo. El coste medio orientativo fue de 3430 ms por plan en escritorio. Las
mediciones actuales requieren volver a ejecutar el comando con estas reglas.

Las pruebas cubren privacidad de órdenes, presupuestos, planes legales, mate
durante un intercambio, escapes, intercepciones, enroque, promoción y captura
al paso. La interfaz se comprueba en escritorio y móvil emulado; el balance
humano y el rendimiento en teléfonos físicos requieren partidas reales.
