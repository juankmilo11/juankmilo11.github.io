# Fantasy Chess Tactics · reglas actuales

## Preparación

El tablero es 8×8 y cada ejército tiene 16 piezas: 8 peones, 2 torres, 2
caballos, 2 alfiles, reina y rey. Se colocan en las posiciones iniciales del
ajedrez: torres en las esquinas, reina en d, rey en e y peones en la segunda
fila de cada bando. No hay despliegue manual ni aleatorio. Se juega contra IA.

El ganador de la tirada elige jugar primero o segundo. Todas las piezas,
incluidos ambos reyes, comienzan sin definitiva cargada. La alternancia es continua también entre rondas: A1, B1, A2, B2;
la siguiente vuelve a comenzar por A. Nunca actúa dos veces seguidas un bando.

## Rondas y órdenes

Todas las rondas permiten dos acciones por bando, con 15 segundos activos para
cada acción. Se preparan en secreto y se ejecutan A1, B1, A2, B2. Al completar
la secuencia, el combate y la siguiente ronda comienzan automáticamente.
Si el tiempo se agota, ese hueco se convierte en espera.

Una misma pieza no puede repetir el mismo tipo de acción en la misma ronda.
Puede Mover + Atacar, Bloquear + Atacar o Focus + Definitiva; dos piezas distintas
sí pueden realizar el mismo tipo. La validación se comparte entre el tablero,
el motor y la IA. Las esperas no se vinculan a una pieza.

Seleccionar o empezar a arrastrar una pieza muestra sus casillas disponibles,
todas del mismo color, con la casilla seleccionada en otro. Elegir una casilla
vacía guarda un movimiento; elegir una pieza aliada o enemiga al alcance guarda
un ataque. La confirmación es inmediata. La ficha se deselecciona después de
actuar y hay que volver a elegirla para otra acción. Un borde celeste distingue
la casilla seleccionada en ambas vistas, incluso al consultar una casilla vacía.
No hay elección de orientación al terminar un movimiento.

## Movimiento y ataque

Se conservan las geometrías del ajedrez, con estas reglas del peón: siempre
puede avanzar una o dos casillas si el camino está libre, o desplazarse a una
casilla diagonal delantera aunque esté vacía. El caballo salta; las demás
piezas no atraviesan cuerpos. No hay obligación general de evitar jaque,
promoción ni captura al paso. El enroque sí conserva las condiciones clásicas:
rey y torre sin movimientos previos, camino libre y rey sin amenaza al inicio,
en la casilla de paso ni en el destino. Las amenazas se comprueban con la
geometría clásica de ataque, incluidos peones y reyes. Mueve ambas piezas y
consume el movimiento de ambas durante esa ronda; cuesta una orden.

Atacar no mueve al atacante. Se elige una dirección y el primer cuerpo de esa
línea recibe el daño, aliado o enemigo. El caballo golpea los dos destinos en L
de un cuadrante. Declarar un ataque exige elegir un cuerpo. Una orden de movimiento cuyo destino
se ocupe antes de ejecutarse, o un ataque cuyo destino quede vacío, falla y
consume su hueco, sin cambiar de tipo automáticamente.

## Vida y bloqueo

Todas las piezas tienen 6 de vida. Todos los impactos hacen exactamente 2 de
daño, independientemente de la dirección. No existe elección de orientación.

Bloquear devuelve 2 al atacante por cada impacto recibido durante el resto de
esa ronda; el defensor también recibe 2. La devolución no se encadena y se aplica
incluso si el defensor muere. Al comenzar la siguiente ronda caduca el bloqueo.
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

## Consulta y revisión

Pieza en foco muestra datos de ambos bandos durante preparación, planificación,
combate y revisión. Se consulta al pasar el cursor o tocar una ficha sin otra
preparada para actuar. Con una ficha propia seleccionada, tocar un cuerpo al
alcance declara un ataque y también permite consultar sus datos.

El campo de batalla ocupa toda la ventana con HUD flotante. El mapa táctico usa
un anochecer azul y violeta, distinto del clásico. La presentación hace la misma
rotación de cámara del modo clásico; se omite si se solicita movimiento reducido.
Durante el intercambio se revelan las cuatro órdenes: bando por nombre/color,
pieza y origen, destino o dirección, objetivo, carga/bloqueo y enroque. Se destaca
la acción en curso y se detalla el daño. En móvil hay una tira de turnos; al
tocarla o pulsar HUD se abre el detalle completo.

La revisión sustituye al antiguo panel de crónica, debajo del inspector, y se
muestra solo al revisar. Guarda una posición por acción resuelta. Sus botones
y deslizador permiten recorrerla sin alterar la partida. El reloj se pausa.
Cada acción identifica al bando por nombre y color, con flechas de dirección.
Avanzar y «Repetir acción» usan los mismos desplazamientos, impactos, cifras,
bloqueos y cargas del combate. Retroceder revierte movimientos, incluidos ambos
trayectos de un enroque, y muestra la restauración de vida. No vuelve a ejecutar
reglas sobre la partida. Las acciones duran 0,65–1,35 s, además de pausas breves
entre ellas; movimiento reducido acorta el efecto y elimina los gestos intensos.

## Valores y modelo de IA

| Clase | Valor de combate |
| --- | --- |
| Peón | 2 |
| Caballo | 4 |
| Alfil | 4 |
| Torre | 5 |
| Reina | 8 |
| Rey | Objetivo de victoria; prioridad terminal |

La IA y el inspector comparten estos valores. La evaluación añade vida,
amenazas, carga y devolución de daño; todos los golpes se valoran a 2. La búsqueda compara las dos
acciones de cada secuencia y conserva ramas de preparación para poder valorar
Focus + Definitiva o Movimiento + Ataque. Evita el fuego aliado perjudicial y
considera el daño reflejado. No consulta las órdenes contrarias.

La búsqueda está limitada a cuatro ramas de preparación y a 96/48 candidatos
por profundidad. Se ejecuta en un Worker. El HUD reutiliza casillas y previsiones;
el escenario agrupa geometría estática. El perfil Ligero reduce resolución,
sombras y animación, y el tablero táctico no se redibuja en reposo. Vistas
ocultas detienen su bucle; las apariencias se descargan conforme se usan.

## Validación

Las pruebas cubren despliegue estándar, carga inicial, dos acciones desde la
primera ronda, restricción por pieza, objetivos ocupados obligatorios, arrastre,
deselección, colores, consulta del rival, alternancia continua, daño fijo,
enroques comparados con chess.js, revisión animada y finales de partida.

Reproducir la regresión: `node projects/FCT/scripts/simulate-tactics.mjs --games=4 --rounds=50`.
Las cuatro simulaciones de esta revisión terminaron sin planes inválidos ni límite
de rondas (media de 20 rondas; unos 161 ms por plan en el entorno de desarrollo).
Usaron bloqueo, focus y definitivas además de movimiento/ataque. Ganó el bando
negro en los dos patrones de iniciativa repetidos, dos veces comenzando y dos
jugando segundo. Esta muestra no establece balance contra humanos. Las semillas
de dado no representan posiciones o estrategias independientes. La emulación
móvil comprueba los presupuestos gráficos; quedan pendientes mediciones en
equipos físicos modestos.
