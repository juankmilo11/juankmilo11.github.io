export const actionDurations=Object.freeze({move:950,attack:1150,ultimate:1350,focus:950,block:950,pass:650,fizzle:850});
export const actionDuration=(event,reduced=false)=>reduced?400:actionDurations[event?.kind]??950;

// Replays are visual only: neither forward nor reverse playback executes rules.
export function reverseBattleEvent(event,before){
  const reversed=structuredClone(event);reversed.reversed=true;
  [reversed.from,reversed.to]=[event.to,event.from];
  if(event.castle)reversed.castle={...event.castle,rookFrom:event.castle.rookTo,rookTo:event.castle.rookFrom};
  reversed.targets=(event.targets??[]).map(target=>{const prior=before.units.find(u=>u.id===target.id);return {blocked:target.blocked,id:target.id,square:prior?.square??target.square,heal:Math.max(0,(prior?.hp??target.hp)-target.hp),hp:prior?.hp??target.hp,dead:(prior?.hp??target.hp)<=0,restored:true};});
  return reversed;
}
