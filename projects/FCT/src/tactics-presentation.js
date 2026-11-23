import {UNIT_NAMES} from './tactics-engine.js';
export const directionArrow={N:'↑',NE:'↗',E:'→',SE:'↘',S:'↓',SW:'↙',W:'←',NW:'↖'};
export function describeBattleEvent(event,state){
 if(!event)return 'Posición inicial';const unit=state.units.find(u=>u.id===event.unitId),name=UNIT_NAMES[event.promotion?.from??unit?.type]??'Pieza';
 if(event.kind==='pass')return 'Espera: no había un movimiento confirmado';
 if(event.kind==='fizzle')return `${name} ${event.from??''} → ${event.intendedTo??''}: ${event.message}`;
 const motion=event.castle?`Enroque: rey ${event.from} → ${event.to}`:`${name} ${event.from} → ${event.intendedTo??event.to}`;
 return motion+(event.stoppedShort?` · se detuvo en ${event.to} antes de un bloqueo`:event.capture?` · ${event.reversed?'restaura':'captura'} en ${event.capture.square}${event.capture.enPassant?' al paso':''}`:'')+(event.checkmate?' · JAQUE MATE':'')+(event.promotion?` · promoción a ${UNIT_NAMES[event.promotion.to]}`:'');
}
export function describePlannedOrder(order,state){if(order.kind==='pass')return 'Espera';const u=state.units.find(u=>u.id===order.unitId);return `${UNIT_NAMES[u?.type]} ${u?.square} → ${order.target}${order.castle?' · enroque':''}`;}
