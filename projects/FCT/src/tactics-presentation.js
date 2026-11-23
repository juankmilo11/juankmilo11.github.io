import { UNIT_NAMES, unitAt } from './tactics-engine.js';
export const directionArrow={N:'↑',NE:'↗',E:'→',SE:'↘',S:'↓',SW:'↙',W:'←',NW:'↖'};
export function describeBattleEvent(event,state){
 if(!event)return 'Posición inicial';const unit=state.units.find(u=>u.id===event.unitId),name=UNIT_NAMES[event.promotion?.from??unit?.type]??'Pieza';
 if(event.kind==='pass')return 'Espera';if(event.kind==='fizzle')return `${name}: orden cancelada · ${event.message}`;
 if(event.kind==='block')return `${name}: escudo activado hasta fin de ronda`;
 if(event.bounced)return `${name}: ${event.from} → ${event.attemptedTo} · rebota ante el escudo`;
 const motion=event.castle?`Rey: enroque ${event.from} → ${event.to} · Torre ${event.castle.rookFrom} → ${event.castle.rookTo}`:`${name}: ${event.from} → ${event.to}`;
 return motion+(event.capture?` · ${event.reversed?'restaura':'captura'} ${event.capture.square}${event.capture.enPassant?' al paso':''}`:'')+(event.promotion?` · promoción a ${UNIT_NAMES[event.promotion.to]}`:'');
}
export function describePlannedOrder(order,state){
 if(order.kind==='pass')return 'Espera';const unit=state.units.find(u=>u.id===order.unitId),name=UNIT_NAMES[unit?.type]??'Pieza';
 if(order.kind==='block')return `${name} ${unit?.square}: escudo del bando`;
 const target=unitAt(state,order.target);return `${name} ${unit?.square} → ${order.target}${order.castle?' · enroque':target?.color===unit?.color?' · intento si se libera':target?' · captura prevista':unit?.type==='p'&&unit.square[0]!==order.target[0]?(state.enPassant?.square===order.target?' · al paso previsto':' · necesita captura en diagonal'):''}${order.promotion?` · ${UNIT_NAMES[order.promotion]}`:''}`;
}
