# Fantasy Chess Tactics · reglas actuales

## Preparación

El tablero es 8×8 y cada ejército tiene 16 piezas: 8 peones, 2 torres, 2
caballos, 2 alfiles, reina y rey. Se colocan en las posiciones iniciales del
ajedrez: torres en las esquinas, reina en d, rey en e y peones en la segunda
fila de cada bando. No hay despliegue manual ni aleatorio. Se juega contra IA.

El ganador de la tirada elige jugar primero o segundo. El rey del primer
jugador comienza sin carga; el del segundo, con su definitiva disponible.
Ninguna otra pieza comienza cargada. La prioridad alterna en las rondas
posteriores; esta ventaja inicial no se reasigna al alternar la iniciativa.

## Rondas y órdenes

- Rondas 1–2: un solo movimiento por bando, sin ataques, bloqueo, focus ni
  definitivas. Si otra pieza ocupa el destino antes de ejecutar, la orden falla.
- Desde la ronda 3: tres acciones libres por bando, incluso con la misma pieza.
- Cada acción dispone de 15 segundos activos para prepararla. Si se agota ese
  hueco se convierte en espera. Preparar una acción reinicia el tiempo siguiente.
- Ambos preparan en secreto; se ejecutan A1, B1, A2, B2, A3, B3 según el cupo.
- Al completar la secuencia, el combate y la siguiente ronda son automáticos.

Las acciones son Mover, Atacar, Bloquear, Focus y Definitiva. Seleccionar una
pieza muestra casillas y botones translúcidos sobre el tablero. Elegir Mover
ya confirma la orden con la orientación anterior. Las cuatro flechas permiten
cambiarla opcionalmente; no elegir una nunca cancela el movimiento. En el último
hueco las flechas duran 2,5 segundos y luego empieza el combate automáticamente.
Los paneles de pieza y secuencia son informativos, sin botones de confirmación.

## Movimiento y ataque

Se conservan las geometrías del ajedrez, con estas reglas del peón: siempre
puede avanzar una o dos casillas si el camino está libre, o desplazarse a una
casilla diagonal delantera aunque esté vacía. El caballo salta; las demás
piezas no atraviesan cuerpos. No hay jaque, enroque, promoción ni captura al paso.

Atacar no mueve al atacante. Se elige una dirección y el primer cuerpo de esa
línea recibe el daño, aliado o enemigo. El caballo golpea los dos destinos en L
de un cuadrante. Desde la ronda 3, mover hacia un cuerpo se convierte en ataque.

## Vida y bloqueo

Todas las piezas tienen 6 de vida. El sector frontal de 90 grados recibe 2 de
daño por golpe; los flancos y la espalda, 4. La orientación se mantiene entre
acciones y solo cambia con un movimiento. No se exige evitar amenazas al rey.

Bloquear absorbe 2 en el próximo impacto, con mínimo recibido 1. Además, durante
el resto de esa misma ronda devuelve al atacante todo el daño realmente
recibido tras la reducción. La devolución no se encadena y también se aplica
si el defensor muere. Al pasar a otra ronda caducan protección y devolución.
Una devolución puede abatir simultáneamente ambos reyes y producir tablas.

## Definitivas

Focus carga; Definitiva consume la carga. Todas atacan sin desplazamiento y
con fuego aliado. Ninguna cura, crea obstáculos o destruye casillas.

| Pieza | Área completa de su definitiva |
| --- | --- |
| Peón | Una y dos casillas al frente y ambas diagonales delanteras; alcanza los cuatro cuerpos posibles. |
| Caballo | Las ocho casillas en L. |
| Alfil | Primer cuerpo de cada una de sus cuatro diagonales. |
| Torre | Primer cuerpo de cada una de sus cuatro líneas rectas. |
| Reina | Primer cuerpo de cada una de las ocho direcciones. |
| Rey | Las ocho casillas adyacentes. |

Los rayos no atraviesan cuerpos. Un obstáculo frontal impide al peón alcanzar
la segunda casilla frontal. Gana quien elimina al rey enemigo; se detiene la
secuencia en cuanto el motor determina el resultado.

## Revisión y rendimiento

La revisión guarda una posición por acción resuelta. Se puede recorrer desde
el inicio hasta el resultado con botones y deslizador. Conserva vida, carga,
orientación, bloqueos y bajas, sin modificar la partida; el reloj se pausa.

La IA calcula en un Worker sin leer órdenes contrarias. El HUD reutiliza las
casillas y las previsiones de órdenes. El escenario agrupa geometría estática;
las apariencias se descargan según se usan. El perfil automático reduce
resolución, sombras y animaciones según memoria/procesadores; Ligero fuerza
ese presupuesto. En ese perfil, el tablero táctico no se vuelve a dibujar en
reposo y se limita a 30 fps durante cambios. Vistas ocultas detienen su bucle.

## Validación

Las pruebas controladas cubren posición inicial, cupos, reloj, orientación
opcional, daño frontal/lateral, fuego aliado, áreas, devolución sin bucles,
resolución intercalada, revisión y muerte del rey. Las partidas automatizadas
sirven para detectar bloqueos y órdenes inválidas, no para afirmar equilibrio
competitivo ni sustituir pruebas con personas o equipos físicos modestos.

Reproducir: `node projects/FCT/scripts/simulate-tactics.mjs --games=16` desde
la raíz. La posición inicial es fija y la IA determinista; distintas semillas
de dado no equivalen a posiciones o estrategias independientes.

La regresión de esta revisión terminó 16/16 simulaciones sin órdenes inválidas
ni llegar al límite de rondas, con media de 9,5 rondas. En los dos patrones de
iniciativa repetidos por esta IA determinista ganó quien empezó primero; es una
señal de ventaja de apertura que requiere contraste humano y no una estimación
estadística de equilibrio. Se conservan las reglas de iniciativa solicitadas.
