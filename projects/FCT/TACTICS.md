# Fantasy Chess Tactics · modo principal

El objetivo es capturar al rey rival. El tablero es 8×8, con 16 piezas por bando
y primera fila simétrica sorteada como Ajedrez960. El usuario es Atacantes y
siempre ejecuta primero; la IA es Defensores. No hay dados, puntos de vida,
Focus, definitivas ni ataques a distancia.

## Secuencias y predicción

La primera ronda permite una acción por bando; la segunda, dos; desde la tercera,
tres. Cada orden dispone de 20 segundos activos. Se preparan en secreto y se
revelan juntas; la ejecución intercala A1, B1, A2, B2… Los escudos forman una fase de prioridad anterior a los movimientos. Después
se alternan las órdenes restantes empezando por el usuario. La prioridad es una
excepción al orden ordinario. Al completar los huecos comienza automáticamente el intercambio.
«Esperar» o agotar el reloj consume un hueco sin mover.

Una pieza puede moverse una sola vez en la misma ronda. Puede activar escudo y
moverse, consumiendo dos acciones. El enroque cuenta como movimiento de rey y
torre. Esta restricción conserva el reparto de acciones entre el ejército.

Seleccionar o arrastrar muestra destinos con el mismo color. Elegir la casilla
confirma la orden. Se permiten intentos sobre una casilla aliada y diagonales
vacías de peón: se está prediciendo lo que habrá allí, no capturando aliados.
Si sigue ocupada por un aliado al ejecutarse, o el peón no encuentra rival ni
captura al paso, se cancela y el hueco se pierde. El camino intermedio debe estar
libre. El motor vuelve a comprobar cada orden en su momento real de ejecución.
Los movimientos previstos siguen siendo predicciones: el rival puede cambiar
el resultado, incluso si una previsión mostraba una captura del rey.

## Capturas y movimientos especiales

Las piezas capturan desplazándose a la casilla enemiga y retirando a su ocupante.
No existe fuego aliado. Gana inmediatamente el bando que captura al rey; no se
exige evitar jaque ni resolverlo, porque el objetivo es capturarlo.

Los peones avanzan una casilla; pueden avanzar dos solo desde su fila inicial,
sin movimientos previos y con camino libre. Capturan una diagonal delantera.
Al llegar al fondo el jugador elige reina, torre, alfil o caballo en el propio
tablero. Agotar el reloj mientras se elige confirma promoción a reina.

La captura al paso se permite únicamente en la acción inmediatamente posterior
al avance doble rival, incluso si cruza el límite de ronda. Una espera, escudo
o cualquier otra orden consume esa oportunidad. El enroque conserva las reglas
960: ambas piezas sin mover, camino libre, rey sin amenaza al inicio, al pasar
y al llegar; termina en c/g y d/f. Para declararlo, selecciona rey y torre.
Los patrones y movimientos especiales se basan en las [reglas de FIDE](https://handbook.fide.com/chapter/e012023), adaptados aquí a órdenes intercaladas y captura del rey.

## Un escudo por bando

Cada ejército tiene un único escudo para toda la partida. Activarlo en cualquier
pieza consume una acción. Se activa antes de cualquier movimiento de ambos bandos, aunque se haya
seleccionado como segunda o tercera orden, y dura hasta el final de esa ronda. Si alguien intenta capturar esa ficha,
el atacante se aproxima y rebota al origen: ambas sobreviven y el escudo se
rompe. La captura al paso también puede rebotar. No causa daño ni devuelve golpes.
El recurso queda gastado incluso si nadie intenta capturar o si la ficha cambia
de casilla. El rey usa la misma regla que las demás piezas.

## Presentación y revisión

El modo principal ocupa la ventana, con anochecer y presentación giratoria. El banner superior reúne el reloj, el progreso de las acciones y los controles
2D/3D/cámara. El campo no tiene paneles de pieza, secuencia ni intercambio.
La promoción cambia la apariencia y conserva la identidad de la ficha. Salir
pide confirmación; cancelar permite continuar y conserva el tiempo restante.

Los escudos tienen contorno y envolvente visibles en 3D y 2D. Las capturas,
rebotes, promociones y movimientos se ejecutan en unos 160–600 ms, con movimiento
reducido y perfil Ligero disponibles. El arrastre sigue el puntero con una
ligera elevación, sombra cálida y aterrizaje suave.

La revisión solo muestra navegación y deslizador; no incluye repetición manual
ni información adicional debajo. Guarda cada posición y reproduce o revierte los movimientos,
capturas, rebotes, enroques y promociones sin volver a ejecutar reglas sobre
la partida real. El reloj se pausa mientras se revisa.

## IA, balance y comprobación

La IA usa un Worker y solo la información pública anterior al intercambio.
Compara planes propios con respuestas adversarias usando el mismo motor real,
incluidas capturas, escudos y cancelaciones. La búsqueda tiene límites de nodos
para mantener el tablero receptivo. Los detalles, fuentes y límites del balance
se documentan en [BALANCE.md](BALANCE.md).

Se prueban reglas puras, planes legales, jugadas tácticas, movimientos especiales,
revisión y renderizado en escritorio/móvil emulado. Las simulaciones comprueban
consistencia; no demuestran un equilibrio perfecto ni sustituyen partidas humanas.

Reproducir: `npm test` desde projects/FCT; desde la raíz,
`node scripts/qa-fct-tactics.cjs` y
`node projects/FCT/scripts/simulate-tactics.mjs --games=4 --rounds=60`.
