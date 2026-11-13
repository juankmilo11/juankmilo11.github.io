# FCT: Fantasy Chess Tactics — diseño inicial

## Concepto

Una experiencia web de ajedrez clásico con ambientación inspirada en *Final Fantasy Tactics*. La identidad de FFT aparece en el escenario, las clases y la presentación de las piezas; no cambia las reglas ni concede ventajas.

## Objetivo del primer prototipo

Probar si un mapa con relieve sutil y piezas inspiradas en Ivalice hacen que una partida de ajedrez sea atractiva y fácil de leer. El prototipo será para computador, de una persona contra una IA local con niveles de dificultad.

## Decisiones confirmadas

- Tablero de 8×8 y reglas estándar completas: movimientos legales, jaque, enroque, captura al paso, promoción, tablas y fin de partida.
- Un mapa terminado en la primera versión.
- Se podrá comparar una presentación 2D y otra 3D interactiva, con cámara giratoria.
- El mapa inicial será un conjunto de ruinas sobre una colina.
- Las piezas se podrán mover por selección de casilla o por arrastre.
- El relieve y los efectos visuales serán decorativos; las casillas y movimientos siempre serán claros.
- Piezas inspiradas en clases y personajes de FFT, usando los sprites locales en la vista 3D y glifos de ajedrez legibles en 2D.
- Asignación inicial de clases:

  | Pieza | Clase |
  | --- | --- |
  | Peón | Squire |
  | Torre | Knight |
  | Caballo | Dragoon |
| Alfil | Mago (Black Mage / White Mage) |
| Reina | Agrias (blancas) / Teta (negras) |
| Rey | Ramza (blancas) / Delita (negras) |

- La IA anticipará varias jugadas y permitirá ajustar su dificultad.
- Maestría, cosméticos desbloqueables, cuentas, partidas online, invitaciones, espectadores y ranking quedan fuera del primer prototipo.

## Principios de experiencia

1. **Legibilidad primero:** cuadrícula, casilla seleccionada, movimientos posibles, piezas y estado de jaque se distinguen con claridad en ambas vistas.
2. **Mismas reglas para ambas vistas:** cambiar 2D/3D no altera el tablero ni la partida.
3. **Sin ventajas cosméticas:** las clases y efectos son visuales. Las piezas conservan formas y colores fáciles de reconocer.
4. **Partida sin fricción:** iniciar, reiniciar, cambiar dificultad y alternar vista deben ser acciones directas.

## Alcance funcional del prototipo

- Inicio de partida con el jugador humano y la IA en lados opuestos.
- Selección de piezas y visualización de destinos legales.
- Promoción de peón con elección de pieza.
- Indicadores de turno, jaque, jaque mate, ahogado y tablas.
- Niveles de IA claramente diferenciados; sus decisiones no deben bloquear la interfaz.
- Selector 2D/3D que conserva la misma posición.
- Un mapa con variaciones leves de altura y ambiente visual de Ivalice.
- Reinicio de partida.

## Fuera del alcance inicial

- Multijugador, perfiles, Elo, relojes competitivos y espectadores.
- Guardado de maestría o desbloqueos.
- Múltiples mapas, editor de tableros o reglas especiales.
- Arte, música o modelos extraídos del juego original.

## Enfoque de implementación

- Usar una biblioteca de reglas de ajedrez para validar movimientos y estados de partida.
- Implementar la IA local con búsqueda minimax y poda alfa-beta, con profundidad ajustable.
- Renderizar el tablero 2D con elementos web y el tablero 3D con geometría original; ambos compartirán el mismo estado de partida.
- Mantener la cámara y el movimiento de piezas separados: arrastrar el tablero gira la cámara; arrastrar una pieza inicia un movimiento.
