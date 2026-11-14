import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCharacter, animateCharacter, releaseCharacter } from './character-model.js';

export function createPiecePreview(host) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20);
  camera.position.set(0, 1.25, 2.65);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.45, 0);
  controls.enablePan = false; controls.enableDamping = true;
  controls.minDistance = 1.8; controls.maxDistance = 4;
  controls.maxPolarAngle = Math.PI / 2;
  scene.add(new THREE.HemisphereLight(0xf5f2e2, 0x445243, 2.2));
  const light = new THREE.DirectionalLight(0xfff0d4, 2.5);
  light.position.set(-2, 4, 4); scene.add(light);
  const fill = new THREE.DirectionalLight(0xc5e2ff, 1.3);
  fill.position.set(2, 1, -3); scene.add(fill);
  for (const [x, color] of [[0, 0xd5bd81]]) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.39,0.04,48), new THREE.MeshStandardMaterial({ color: 0x333f35, roughness: 1 }));
    base.position.set(x,-0.025,0); scene.add(base);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.35,0.37,48), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(x,0,0); scene.add(ring);
  }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let models = [], frame = 0, active = false, rotating = !reducedMotion, token = 0, previousTime = 0;
  function resize() {
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
    renderer.setSize(width,height,false); camera.aspect = width/height; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  function render(now) {
    if (!active) return;
    const time = now * 0.001;
    const delta = previousTime ? Math.min((now-previousTime)/1000,0.05) : 0;
    previousTime = now;
    for (const model of models) {
      animateCharacter(model,time,{ reducedMotion });
      if (rotating) model.rotation.y += delta * 0.4;
    }
    controls.update(); renderer.render(scene,camera); frame = requestAnimationFrame(render);
  }
  return {
    async setLooks(human) {
      const request = ++token;
      const next = [createCharacter(human)];
      await Promise.all(next.map(model => model.userData.ready));
      if (request !== token) { next.forEach(releaseCharacter); return; }
      models.forEach(model => { scene.remove(model); releaseCharacter(model); });
      models = next;
      models.forEach(model => { model.rotation.y = -0.2; scene.add(model); });
    },
    setActive(value) { active = value; previousTime = 0; cancelAnimationFrame(frame); if (value) { resize(); frame = requestAnimationFrame(render); } },
    toggleRotation() { rotating = !rotating; return rotating; },
  };
}
