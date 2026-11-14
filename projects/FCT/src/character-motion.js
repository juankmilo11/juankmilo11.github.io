export function animateCharacter(character, time, { moving = false, selected = false, reducedMotion = false, phase = 0 } = {}) {
  const rig = character?.userData.rig;
  if (!rig) return;
  const breath = Math.sin(time * 1.8 + phase), sway = Math.sin(time * 1.1 + phase);
  const gait = Math.sin(time * 13 + phase);
  for (const [name, { mesh, pivot }] of Object.entries(rig)) {
    mesh.position.fromArray(pivot); mesh.rotation.set(0,0,0); mesh.scale.set(1,1,1);
    if (reducedMotion) continue;
    if (name === 'body') { mesh.scale.y = 1 + breath * 0.008; mesh.rotation.z = sway * 0.009; }
    if (name === 'head') { mesh.position.y += breath * 0.003; mesh.rotation.y = sway * (selected ? 0.065 : 0.025); }
    if (name.includes('Arm')) { mesh.rotation.x = (moving ? gait * 0.28 : breath * 0.026) * (name === 'leftArm' ? 1 : -1); }
    if (name.includes('Leg') && moving) { mesh.rotation.x = gait * 0.32 * (name === 'leftLeg' ? -1 : 1); }
  }
}
