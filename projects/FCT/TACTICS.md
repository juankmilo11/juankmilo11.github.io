# Fantasy Chess Tactics · modo principal

Tablero 8×8, con las 16 piezas de cada bando en la posición inicial del ajedrez
normal. La iniciativa cambia cada dos rondas. La partida termina inmediatamente
al capturar al rey rival o producir una posición de jaque mate, incluso en mitad
de un intercambio. Las órdenes restantes no se ejecutan. No hay escudos, vida,
ataques a distancia, definitivas ni dados.

## Preparar y confirmar

La primera ronda permite una acción por bando; desde la segunda son dos. Cada
orden tiene 20 segundos activos. Ambos preparan en secreto y alternan sus
acciones dentro de la ronda. El usuario empieza las rondas 1 y 2; la IA, 3 y 4;
el usuario, 5 y 6, y así sucesivamente. Al cambiar la iniciativa puede coincidir
el último bando de una ronda con el primero de la siguiente.
Esperar, agotar el reloj o un intento fallido también consume su hueco.

Seleccionar o arrastrar una pieza muestra sus destinos posibles. Elegir una
casilla dibuja una flecha plana sobre el suelo y muestra un **chulo** para
confirmar y una **X** para cambiar, justo encima de la casilla destino. Soltar
la pieza no confirma por sí solo. La promoción se elige antes de confirmar. Si vence el reloj sin confirmación, esa orden se convierte en
espera; no se ejecuta un movimiento pendiente.

Una pieza puede realizar ambos movimientos de la ronda. El segundo se declara
desde su posición prevista tras el primero; se revalida desde su posición real
al ejecutarse. Después de enrocar también se puede volver a mover rey o torre.
Los destinos normales comparten color; el enroque disponible usa violeta y la casilla seleccionada conserva su propio contorno.

## Predicción y obstáculos

Las declaraciones siguen la geometría de cada pieza. Se permite apuntar más
allá de piezas ocupantes, a una casilla aliada o a una diagonal vacía de peón:
el rival podría cambiar la posición antes de ejecutar la orden. La previsión de
tus órdenes no garantiza su resultado real. Cada intento se resuelve de nuevo
con la posición que encuentra en ese instante:

- Torres, alfiles, reinas y reyes capturan al primer enemigo de su recorrido y
  terminan en esa casilla, aunque el destino declarado estuviera más lejos.
- Ante un aliado, terminan en la casilla inmediatamente anterior. Si no queda
  espacio para avanzar, permanecen en el origen y consumen la acción.
- Los peones nunca capturan avanzando recto. Ante cualquier ocupante se detienen
  una casilla antes; solo capturan en sus diagonales delanteras.
- Los caballos saltan las piezas intermedias. Si al aterrizar encuentran un
  enemigo, lo capturan; si encuentran un aliado, permanecen en el origen.

No existe fuego aliado. Una diagonal vacía de peón falla si al ejecutarse no
contiene enemigo ni permite captura al paso. El tablero muestra una flecha del
intento, el punto real de llegada y el motivo de una detención o cancelación.
Las acciones sin desplazamiento conservan una pausa breve para poder leerlas.

## Jaque mate y movimientos especiales

El motor busca jaque mate después de cada acción. Se comprueba si el rey está
amenazado y existe alguna respuesta legal de ajedrez que quite la amenaza,
independientemente de los huecos o piezas ya usados en esa ronda. Un rey sin
amenaza y sin salida no constituye mate. En esta variante se sigue permitiendo
declarar movimientos que dejan el rey amenazado; capturarlo también gana.

Los peones avanzan una casilla, o dos desde su fila inicial si todavía no se han
movido. Capturan en diagonal y promocionan a reina, torre, alfil o caballo. La
captura al paso solo está disponible en la acción inmediatamente posterior al
avance doble enemigo, incluso al cruzar una ronda; una espera o intento fallido
también consume esa oportunidad.

El enroque usa la formación normal: rey y torre sin mover, camino libre y rey
sin amenaza al inicio, durante el trayecto ni al llegar. Se selecciona el rey y
su torre o el destino c/g. Si el recorrido cambia y deja de ser válido, se
cancela: no se transforma en captura. Los movimientos y la definición de mate
se contrastan con las [reglas de FIDE](https://handbook.fide.com/chapter/E012023),
adaptadas aquí a órdenes secretas intercaladas y captura del rey.

## Presentación y revisión

JUGAR usa el mismo sonido que Partida clásica y abre directamente el campo 3D,
sin mostrar antes el tablero 2D. El modo principal conserva el anochecer y la
presentación de media vuelta, reducida de 4,6 a 2,3 segundos. El banner reúne reloj, progreso y controles de vista.
Confirmación, promoción e intentos se muestran sobre el propio tablero.

Las piezas se elevan ligeramente al arrastrarlas, siguen el puntero y aterrizan
con una sombra cálida. Movimientos, capturas, enroques y promociones duran unos
420–600 ms; las esperas e intentos fallidos, 550–700 ms. Se respetan movimiento
reducido y perfil Ligero. El rey abatido también se representa al recibir mate.

Revisar conserva cada posición y reproduce o revierte movimientos, capturas,
enroques, promociones y mate sin modificar la partida real. Las flechas y el
detalle de cada intento también aparecen en revisión. El reloj se pausa.
Salir pide confirmación y cancelar conserva el tiempo restante.

## IA y comprobación

La IA calcula en un Worker desde la posición pública previa al intercambio.
Compara secuencias con respuestas enemigas plausibles usando el mismo motor,
incluidas intercepciones, cancelaciones, captura al paso, enroque y mate. No
consulta las órdenes secretas del usuario. La búsqueda conserva alternativas
defensivas para que una amenaza ofensiva no excluya todas las salidas del rey.
Valores, mediciones y límites están en [BALANCE.md](BALANCE.md).

Se prueban reglas, planes legales, táctica, privacidad, revisión y renderizado
en escritorio y móvil emulado. Reproducir desde la raíz:

```sh
npm --prefix projects/FCT test
node projects/FCT/scripts/check-mate-oracle.mjs
node scripts/qa-fct-tactics.cjs
node projects/FCT/scripts/benchmark-tactics.mjs --previous --seeds=2141,3137 --rounds=30
```
