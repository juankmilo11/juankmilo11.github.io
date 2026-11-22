# Fantasy Chess Tactics · reglas y balance inicial

Modo independiente del ajedrez clásico, accesible desde el menú de FCT.
Referencia de estructura: [Kombat Fighters – KotK, Newgrounds](https://www.newgrounds.com/portal/view/456055).
La programación de órdenes y su resolución encadenada se adaptan a las piezas,
los personajes y el campo 8×8 de FCT. No hay mazo, robo ni cartas consumibles.

## Preparación

Cada bando tiene 3 peones y un caballo, alfil, torre, reina y rey: 8 unidades.
Ambos ejércitos se colocan automáticamente y al azar en las filas 1–2 y 7–8.
Las posiciones son visibles desde el inicio. Se juega contra la IA; no hay
selección de adversario, despliegue manual ni modo local de dos jugadores.

Cada bando lanza un dado de seis caras. Los empates se repiten. El ganador
elige ejecutar primero o cargar una definitiva de peón, caballo, alfil o torre;
en este último caso el adversario ejecuta primero. La reina queda excluida de
esta ventaja y ambos reyes comienzan cargados. La prioridad se alterna entre
bandos en cada ronda posterior.

## Rondas

1. Preparar órdenes secretas sobre la previsión de tus propias acciones.
2. Confirmar el plan o esperar a que termine el tiempo.
3. Ejecutar A1, B1, A2, B2 y, desde la tercera ronda, A3, B3.

Cada orden tiene **10 segundos activos**, en todas las rondas. Añadir una orden
abre el tiempo de la siguiente. Si se agota, ese hueco se convierte en una espera.
Las rondas 1–2 mantienen hasta un movimiento y una acción distinta; desde la
ronda 3 hay **3 acciones libres**, incluso con la misma pieza. Al llenar la cola
comienza automáticamente la pelea y, al terminar, la siguiente ronda.
No hay pantallas de «Listo». Las animaciones no consumen tiempo de planificación.
Editar o borrar una orden anterior no concede nuevos reinicios para el mismo
hueco. Una orden cuya pieza haya muerto o cuyo destino ya no sea accesible falla
y consume su hueco. El adversario puede alterar el resultado de tu previsión.

Mover, atacar, bloquear, Focus y ejecutar una definitiva cuestan una acción.
Focus carga una definitiva; utilizarla consume la carga. Bloqueo protege el
siguiente impacto, sin acumulación, y caduca tras la siguiente ronda.
Se puede elegir orientación N/E/S/O al preparar el movimiento.

## Movimiento y ataques

Las piezas conservan sus patrones geométricos de ajedrez. El caballo salta;
las demás piezas respetan las obstrucciones. El peón avanza, con doble paso
inicial desde su fila habitual si el camino está libre. En este modo no hay
jaque, enroque, captura al paso ni promoción: los peones conservan su función
de apoyo. No se exige que el rey evite una casilla amenazada.

El ataque no desplaza al atacante. Se elige una dirección y se alcanza al
primer cuerpo de esa línea, aliado o enemigo. El caballo elige un cuadrante y
ataca sus dos destinos en L. Intentar un movimiento sobre una pieza lo
convierte en ataque básico. Las definitivas de área también causan fuego amigo.

## Vida, orientación y protección

| Recurso | Valor inicial / efecto |
| --- | --- |
| Vida de todas las clases | 6 |
| Ataque frontal | 2 |
| Ataque lateral o trasero | 4 |
| Bloqueo | absorbe 2 en un impacto; mínimo recibido 1 |
| Armadura | absorbe 1 por carga y por impacto |
| Reflejo | devuelve 1 por carga, sin cadena de reflejos |
| Potenciación | +1 en el siguiente ataque; no se acumula |
| Curación de apoyo | hasta 3; nunca supera 6 ni resucita |
| Trampa | 2 al entrar; desaparece tras activarse |

El frente es el sector de 90 grados centrado en la orientación de la unidad.
Las barras de vida y flechas de los pies son invisibles; estos valores y la orientación
siguen activos en el motor. La mitigación es determinista: tres golpes frontales o un frontal y un lateral
eliminan una unidad sin protección. Se reserva el azar para la iniciativa y el
despliegue automático, para que el resultado de un golpe pueda anticiparse.
La partida acaba inmediatamente al morir un rey; la muerte simultánea de ambos
por reflejo produce tablas.

## Definitivas y contrajuego

| Clase | Definitiva y variante | Límite / respuesta |
| --- | --- | --- |
| Peón | Auxilio: cura a un aliado cercano o a sí mismo. Trampa: coloca una mina adyacente. | Hasta dos trampas activas por bando; también dañan aliados. |
| Caballo | Tormenta ecuestre: ataca las ocho casillas en L. | Alcanza aliados; ocupar casillas no incluidas en la L evita el golpe. |
| Alfil | Cruz astral: primer cuerpo de cada diagonal. Sanación: cura al primer aliado de una diagonal. | Sin atravesar cuerpos ni terreno cerrado. |
| Torre | Bastión: 2 cargas de armadura y 2 de reflejo. Barricada: obstáculo adyacente. | Las cargas no se apilan; la barricada dura dos rondas. |
| Reina | Corona: primer cuerpo de las ocho direcciones. Fractura: elimina una casilla vacía visible, hasta distancia 3. | Máximo dos fracturas en toda la partida; no puede eliminar directamente una pieza. |
| Rey | Estandarte: recupera 2 de vida y concede armadura y potenciación a aliados adyacentes. | Consume su carga inicial; recargar y volver a usar cuesta dos acciones. |

Las fracturas son permanentes y no admiten ocupantes. Los obstáculos y las
fracturas bloquean las líneas; el caballo puede saltarlos, pero no aterrizar
en ellos. El terreno funciona como un recurso posicional, no como eliminación
instantánea. El objetivo inicial es que cada clase aporte una herramienta
distinta y que las grandes áreas exijan colocación por el riesgo de fuego amigo.

## Validación y ajuste

Los números anteriores son una primera versión jugable, no una afirmación de
equilibrio competitivo. El motor puro se prueba con posiciones controladas:
ocultación, iniciativa, cuotas, daño direccional, aliados interpuestos,
definitivas, terreno, ejecución intercalada y muerte del rey. La IA prepara
planes desde la misma posición pública sin consultar las órdenes contrarias.
Las simulaciones automatizadas ayudan a detectar bloqueos y sesgos; siguen
siendo necesarias partidas humanas para ajustar tiempos y ventajas de apertura.

La muestra reproducible inicial de 64 semillas, con IA en ambos bandos y límite
de 40 rondas, terminó las 64 partidas sin planes inválidos: media de 4,97 rondas.
El bando que ejecutó primero en la ronda 1 ganó 32/64; el ganador del dado,
42/64. En una versión previa con prioridad fija y una IA más pasiva en finales,
el primer bando ganó 51/64. Se modificaron ambas cosas, por lo que esta
comparación no aísla una única causa. Esta muestra detecta problemas gruesos;
no sustituye pruebas humanas ni estima porcentajes competitivos fiables.

Reproducir: `node projects/FCT/scripts/simulate-tactics.mjs --games=64` desde
la raíz del repositorio. La salida JSON puede guardarse en `dist/`.

Fuentes: `src/tactics-engine.js`, `src/tactics-ai.js`, `src/tactics-ui.js` y
`src/tactics-board3d.js`. Los valores se mantienen en el motor, no en el dibujo.
