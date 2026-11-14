export function animateCharacter(character, time, { moving = false, selected = false, reducedMotion = false, phase = 0, cheer = 0 } = {}) {
  const rig = character?.userData.rig;
  if (!rig) return;
  const breath = Math.sin(time * 1.8 + phase), sway = Math.sin(time * 1.1 + phase);
  const gait = Math.sin(time * (moving?11:3.7+Math.sin(phase)*.3) + phase);
  for (const [name, { mesh, pivot }] of Object.entries(rig)) {
    mesh.position.fromArray(pivot); mesh.rotation.set(0,0,0); mesh.scale.set(1,1,1);
    if (reducedMotion) continue;
    if (name === 'body') { mesh.scale.y = 1 + breath * 0.006; mesh.rotation.z = sway * 0.009; mesh.position.y+=Math.sin(time*7.4+phase)*.002; }
    if (name === 'head') { mesh.position.y += breath * 0.003; mesh.rotation.y = sway * (selected ? 0.065 : 0.025); }
    if (name.includes('Arm')) {
      mesh.rotation.x = gait * (moving?.28:.055) * (name === 'leftArm' ? 1 : -1);
      mesh.rotation.z = cheer*.65*(name==='leftArm'?1:-1);
    }
    if (name.includes('Leg')) {
      const step=gait*(name==='leftLeg'?-1:1);
      mesh.rotation.x=step*(moving?.30:.10);
      mesh.position.y+=Math.max(0,step)*(moving?.022:.008);
    }
  }
}
