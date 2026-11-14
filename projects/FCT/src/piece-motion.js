const TAU = Math.PI * 2;

export function createFloatMotion(random = Math.random) {
  return { phase: random()*TAU, speed: TAU/(5.2+random()*3.4), height: .022+random()*.018 };
}

// Absolute offsets from the landing square: animation never changes the anchor.
export function floatOffset(time, motion) {
  return .008 + motion.height*(.5+.5*Math.sin(time*motion.speed+motion.phase));
}

export function createCheerMotion(time, random = Math.random) {
  return {
    nextAt: time+.9+random()*3.8, startedAt: null,
    duration: .48+random()*.2, gap: .13+random()*.12,
    hops: random()<.55?1:2, height: .10+random()*.08, tilt: (random()-.5)*.12,
  };
}

export function cheerPose(time, motion, random = Math.random) {
  const resting = { lift: 0, tilt: 0, strength: 0 };
  if(time<motion.nextAt)return resting;
  if(motion.startedAt===null)motion.startedAt=time;
  const elapsed=time-motion.startedAt, cycle=motion.duration+motion.gap;
  if(elapsed>=motion.hops*cycle-motion.gap){
    Object.assign(motion,createCheerMotion(time,random));return resting;
  }
  const progress=(elapsed%cycle)/motion.duration;
  if(progress>=1)return resting;
  const strength=Math.sin(Math.PI*progress)**2;
  return { lift: strength*motion.height, tilt: strength*motion.tilt, strength };
}
