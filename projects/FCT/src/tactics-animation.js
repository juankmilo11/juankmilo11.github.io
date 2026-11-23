export const actionDurations=Object.freeze({move:420,capture:540,block:460,pass:160,fizzle:260,bounce:570,promotion:600});
export const actionDuration=(event,reduced=false)=>reduced?160:event?.bounced?actionDurations.bounce:event?.promotion?actionDurations.promotion:event?.capture?actionDurations.capture:actionDurations[event?.kind]??420;

// Replays only animate stored snapshots; they never execute game rules.
export function reverseBattleEvent(event,before){
  if(!event)return null;
  const reversed=structuredClone(event);reversed.reversed=true;
  [reversed.from,reversed.to]=[event.to,event.from];
  if(event.castle)reversed.castle={...event.castle,rookFrom:event.castle.rookTo,rookTo:event.castle.rookFrom};
  if(event.promotion)reversed.promotion={from:event.promotion.to,to:event.promotion.from};
  reversed.targets=(event.targets??[]).map(target=>{
    const prior=before.units.find(u=>u.id===target.id);
    return {...target,square:prior?.square??target.square,captured:Boolean(prior?.captured),restored:!prior?.captured&&Boolean(target.captured),blocked:Boolean(target.blocked)};
  });
  return reversed;
}
