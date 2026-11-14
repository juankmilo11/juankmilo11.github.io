import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildLandscape, earthMaterial } from './environment.js';
import { tileElevation, terrainPalette } from './terrain.js';
import { createMountainGeometry, createTileGeometry } from './mountain.js';
import { createCharacter, animateCharacter, releaseCharacter } from './character-model.js';
import { appearanceFor, appearanceKey, thumbnailUrl } from './appearance.js';
import { addFieldLife } from './field-life.js';

const spriteTextures = new Map();

const BOARD_SIZE = 8;
const FILES = 'abcdefgh';
const palette = {
  light: terrainPalette.light,
  dark: terrainPalette.dark,
  selected: 0xffc83f,
  target: 0x32d18a,
  capture: 0xe94f43,
  lastMove: 0xe4bb39,
  check: 0xb64c3f,
};

export function create3DBoard(host, onSquare, onDragMove, canDragPiece = () => true) {
  const scene = new THREE.Scene();
  scene.background = createSunsetSky();
  scene.fog = new THREE.Fog(0x705442, 14, 34);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 7.8, 11.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.setAttribute('aria-label', 'Tablero tridimensional; clic o arrastra una pieza para moverla y arrastra el fondo para girar la cámara.');
  host.append(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xe0e9d2, 0x394339, 2.1));
  const sun = new THREE.DirectionalLight(0xffefd9, 3.0);
  sun.position.set(-5, 11, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  sun.shadow.normalBias = 0.035;
  sun.shadow.bias = -0.0002;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x88a7ba, 1.35);
  fill.position.set(8, 5, -7);
  scene.add(fill);

  const world = new THREE.Group();
  scene.add(world);
  const tileMeshes = [];
  const pieceMeshes = [];
  const capturedPieces = [];
  const capturedMeshes = [];
  const capturedSlots = { w: new Map(), b: new Map() };
  const tileHeights = new Map();
  const tileMaterials = new Map();
  const tileHighlights = new Map();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const controls = new OrbitControls(camera, renderer.domElement);
  let cameraProfile = { radius: 11.5, height: 7.8, fov: 36, targetY: 0.35 };
  let lastPortrait = null;
  controls.target.set(0, cameraProfile.targetY, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.minDistance = 8;
  controls.maxDistance = 20;
  controls.minPolarAngle = 0.3;
  controls.maxPolarAngle = Math.PI / 2.08;
  controls.maxTargetRadius = 1.8;
  controls.update();
  controls.saveState();

  buildLandscape(world);
  const terrainMesh = buildBoard(world, tileMeshes, tileHeights, tileMaterials);
  const fieldLife = addFieldLife(world,reducedMotion);
  for (const tile of tileMeshes) {
    const square = tile.userData.square;
    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: palette.target,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const highlight = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.86), highlightMaterial);
    highlight.rotation.x = -Math.PI / 2;
    highlight.position.set(tile.position.x, tileHeights.get(square) + 0.003, tile.position.z);
    highlight.visible = false;
    highlight.renderOrder = 2;
    world.add(highlight);
    tileHighlights.set(square, highlight);
  }
  const windParticles = buildWindParticles(world, reducedMotion);

  const dropIndicatorMaterial = new THREE.MeshBasicMaterial({
    color: palette.target,
    transparent: true,
    opacity: 0.54,
    depthWrite: false,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  const dropIndicator = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.86), dropIndicatorMaterial);
  dropIndicator.rotation.x = -Math.PI / 2;
  dropIndicator.visible = false;
  dropIndicator.renderOrder = 3;
  world.add(dropIndicator);
  const dropShadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x151b12,
    transparent: true,
    opacity: 0.66,
    alphaTest: 0.06,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const dropShadow = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.88), dropShadowMaterial);
  dropShadow.rotation.x = -Math.PI / 2;
  dropShadow.visible = false;
  dropShadow.renderOrder = 4;
  world.add(dropShadow);

  let pointerDown = null;
  let draggedPiece = null;
  let draggedFrom = null;
  let dragging = false;
  let legalTargets = new Set();
  let dragPlane = null;
  let originalPosition = null;

  function setPointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
  }

  function hit(event) {
    setPointer(event);
    const intersections = raycaster.intersectObjects([...pieceMeshes, ...tileMeshes, terrainMesh], true);
    for (const intersection of intersections) {
      let object = intersection.object;
      while (object && !object.userData.kind) object = object.parent;
      if (object?.userData.kind === 'terrain') {
        const square = worldToSquare(intersection.point.x, intersection.point.z);
        if (square) return { object: { userData: { kind: 'tile', square } }, intersection };
      }
      if (object?.userData.kind === 'piece' || object?.userData.kind === 'tile') return { object, intersection };
    }
    return null;
  }

  function squareAtPointer(event) {
    setPointer(event);
    const intersections = raycaster.intersectObjects([...tileMeshes, terrainMesh], false);
    if (intersections[0]) return intersections[0].object.userData.square ?? worldToSquare(intersections[0].point.x, intersections[0].point.z);
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.25);
    const point = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(ground, point)) return null;
    return worldToSquare(point.x, point.z);
  }

  function showDropIndicator(square) {
    if (!square) {
      dropIndicator.visible = false;
      dropShadow.visible = false;
      return;
    }
    const file = FILES.indexOf(square[0]);
    const row = 8 - Number(square[1]);
    const legal = legalTargets.has(square);
    dropIndicator.position.set(file - 3.5, tileHeights.get(square) + 0.012, row - 3.5);
    dropIndicatorMaterial.color.setHex(legal ? palette.target : palette.capture);
    dropIndicatorMaterial.opacity = legal ? 0.58 : 0.48;
    dropIndicator.visible = true;
    if (draggedPiece) {
      dropShadowMaterial.map = getSpriteTexture(draggedPiece.userData.type, draggedPiece.userData.color);
      dropShadowMaterial.needsUpdate = true;
      dropShadow.position.set(file - 3.5, tileHeights.get(square) + 0.014, row - 3.5);
      dropShadow.visible = true;
    }
  }

  renderer.domElement.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    pointerDown = { x: event.clientX, y: event.clientY };
    const result = hit(event);
    if (result?.object.userData.kind === 'piece' &&
      (result.object.userData.color !== 'w' || !canDragPiece(result.object.userData))) {
      return;
    }
    if (result?.object.userData.kind === 'piece' && !result.object.userData.moveAnimation) {
      draggedPiece = result.object;
      draggedFrom = draggedPiece.userData.square;
      dragging = false;
      originalPosition = draggedPiece.position.clone();
      dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(tileElevation(3, 3) + 0.32));
      controls.enabled = false;
      renderer.domElement.setPointerCapture(event.pointerId);
      onSquare(draggedFrom);
    }
  }, true);

  renderer.domElement.addEventListener('pointermove', (event) => {
    if (!draggedPiece || !pointerDown) return;
    const distance = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
    if (distance > 6) dragging = true;
    if (!dragging) return;
    showDropIndicator(squareAtPointer(event));
    setPointer(event);
    const point = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(dragPlane, point)) {
      draggedPiece.position.x = THREE.MathUtils.clamp(point.x, -4.1, 4.1);
      draggedPiece.position.z = THREE.MathUtils.clamp(point.z, -4.1, 4.1);
      draggedPiece.position.y = tileElevation(3, 3) + 0.32;
    }
  });

  renderer.domElement.addEventListener('pointerup', (event) => {
    if (!pointerDown) return;
    const distance = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
    if (draggedPiece) {
      const from = draggedFrom;
      const to = dragging ? squareAtPointer(event) : from;
      showDropIndicator(null);
      draggedPiece.position.copy(originalPosition);
      draggedPiece = null;
      draggedFrom = null;
      dragging = false;
      originalPosition = null;
      dragPlane = null;
      controls.enabled = true;
      if (distance < 6) onSquare(from);
      else if (to) onDragMove(from, to);
    } else if (distance < 6) {
      const result = hit(event);
      const square = result?.object.userData.square;
      if (square) onSquare(square);
    }
    pointerDown = null;
  }, true);

  renderer.domElement.addEventListener('pointercancel', () => {
    if (draggedPiece && originalPosition) draggedPiece.position.copy(originalPosition);
    showDropIndicator(null);
    draggedPiece = null;
    draggedFrom = null;
    dragging = false;
    pointerDown = null;
    originalPosition = null;
    dragPlane = null;
    controls.enabled = true;
  });

  function update(board, state) {
    if (board.flat().filter(Boolean).length === 32 && !(state.animationMove?.reversed && state.animationMove.captured) && (capturedMeshes.length || capturedPieces.length)) {
      capturedMeshes.forEach((mesh) => { world.remove(mesh); releaseCharacter(mesh.userData.visual); });
      capturedMeshes.length = 0;
      capturedPieces.forEach(({ mesh }) => { world.remove(mesh); releaseCharacter(mesh.userData.visual); });
      capturedPieces.length = 0;
      capturedSlots.w.clear();
      capturedSlots.b.clear();
    }
    legalTargets = new Set(state.targets);
    const previousBySquare = new Map(pieceMeshes.map((mesh) => [mesh.userData.square, mesh]));
    const retained = new Set();
    const nextPieces = [];
    const movement = state.animationMove ?? state.lastMove;
    const movingMesh = movement ? previousBySquare.get(movement.from) : null;
    let recoveredCapture = null;
    let recoveredFrom = null;
    if (state.animationMove?.reversed && state.animationMove.captured) {
      const undonePly = state.animationMove.plyIndex;
      for (let index = capturedPieces.length - 1; index >= 0; index -= 1) {
        if (capturedPieces[index].captureIndex !== undonePly) continue;
        recoveredCapture = capturedPieces[index].mesh;
        recoveredFrom = recoveredCapture.position.clone();
        capturedSlots[recoveredCapture.userData.color].delete(undonePly);
        capturedPieces.splice(index, 1);
      }
      for (let index = capturedMeshes.length - 1; index >= 0; index -= 1) {
        if (capturedMeshes[index].userData.captureIndex !== undonePly) continue;
        recoveredCapture = capturedMeshes[index];
        recoveredFrom = recoveredCapture.position.clone();
        capturedSlots[recoveredCapture.userData.color].delete(undonePly);
        capturedMeshes.splice(index, 1);
      }
    }
    const rookMesh = movement?.rookFrom ? previousBySquare.get(movement.rookFrom) : null;
    const reversingCapture = state.animationMove?.reversed && state.animationMove.captured;
    const captureSquare = state.animationMove?.returnCapturedTo ?? state.lastMove?.to;
    const capturedMesh = !reversingCapture && state.lastMove?.captured ? previousBySquare.get(captureSquare) : null;
    const lastSquares = new Set(state.lastMove ? [state.lastMove.from, state.lastMove.to] : []);
    for (const tile of tileMeshes) {
      const square = tile.userData.square;
      const material = tileMaterials.get(square);
      material.color.setHex((FILES.indexOf(square[0]) + Number(square[1])) % 2 ? palette.light : palette.dark);
      material.emissive.setHex(0x000000);
      material.emissiveIntensity = 0;
      const highlight = tileHighlights.get(square);
      const isLastMove = lastSquares.has(square);
      const isLegalTarget = state.targets.has(square);
      highlight.visible = isLastMove || isLegalTarget;
      if (isLastMove) {
        highlight.material.color.setHex(0xf4ca37);
        highlight.material.opacity = 0.82;
      } else if (isLegalTarget) {
        const occupied = board[8 - Number(square[1])][FILES.indexOf(square[0])];
        highlight.material.color.setHex(occupied ? palette.capture : palette.target);
        highlight.material.opacity = 0.7;
      }
      if (lastSquares.has(square)) {
        material.emissive.setHex(palette.lastMove);
        material.emissiveIntensity = 0.42;
      }
      if (square === state.selectedSquare) {
        material.emissive.setHex(palette.selected);
        material.emissiveIntensity = 0.98;
      }
      if (square === state.checkedKing) {
        material.emissive.setHex(palette.check);
        material.emissiveIntensity = 0.7;
      }
    }

    board.forEach((rank, row) => rank.forEach((piece, file) => {
      if (!piece) return;
      const square = `${FILES[file]}${8 - row}`;
      let mesh = previousBySquare.get(square);
      if (mesh && (mesh.userData.type !== piece.type || mesh.userData.color !== piece.color || mesh.userData.appearance !== appearanceKey(appearanceFor(piece.type,piece.color)))) mesh = null;
      const isRestoredCapture = recoveredCapture && square === movement?.returnCapturedTo;
      if (!mesh && isRestoredCapture) mesh = recoveredCapture;
      if (!mesh && (square === movement?.to || square === movement?.rookTo) &&
        (square === movement?.to ? movingMesh : rookMesh) &&
        (square === movement?.to ? movingMesh : rookMesh).userData.type === piece.type &&
        (square === movement?.to ? movingMesh : rookMesh).userData.color === piece.color) {
        mesh = square === movement?.to ? movingMesh : rookMesh;
      }
      if (mesh && retained.has(mesh)) mesh = null;
      if (!mesh) mesh = createPiece(piece.type, piece.color);
      const previousSquare = mesh.userData.square;
      const previousPosition = mesh.userData.basePosition?.clone() ?? mesh.position.clone();
      const isMovingPiece = mesh === movingMesh && previousSquare === movement?.from && square === movement?.to;
      const isMovingRook = mesh === rookMesh && square === movement?.rookTo;
      const targetPosition = new THREE.Vector3(file - 3.5, tileHeights.get(square) + 0.008, row - 3.5);
      retained.add(mesh);
      Object.assign(mesh.userData, { kind: 'piece', square, color: piece.color, type: piece.type });
      mesh.userData.selected = square === state.selectedSquare;
      if (mesh.userData.basePosition) mesh.userData.basePosition.copy(targetPosition);
      else mesh.userData.basePosition = targetPosition.clone();
      if (isMovingPiece || isMovingRook || isRestoredCapture) {
        const moveFrom = isRestoredCapture ? recoveredFrom : previousPosition;
        mesh.position.copy(moveFrom);
        mesh.userData.moveAnimation = {
          from: moveFrom.clone(),
          to: targetPosition.clone(),
          startTime: performance.now(),
          duration: reducedMotion ? 160 : 380 + Math.random() * 180,
          capture: Boolean(movement.captured),
        };
      } else if (!mesh.userData.moveAnimation) {
        mesh.position.copy(targetPosition);
      }
      if (mesh.parent !== world) world.add(mesh);
      nextPieces.push(mesh);
    }));
    for (const mesh of pieceMeshes) {
      if (retained.has(mesh)) continue;
      if (mesh === capturedMesh) {
        const origin = mesh.userData.basePosition?.clone() ?? mesh.position.clone();
        const color = mesh.userData.color;
        const occupiedSlots = new Set(capturedSlots[color].values());
        const availableSlots = Array.from({ length: 16 }, (_, slot) => slot).filter((slot) => !occupiedSlots.has(slot));
        const slot = availableSlots[Math.floor(Math.random() * availableSlots.length)] ?? 0;
        capturedSlots[color].set(state.lastMoveIndex, slot);
        const side = mesh.userData.color === 'w' ? 1 : -1;
        const tier = Math.floor(slot / 8);
        const row = slot % 8;
        const jitter = (range) => (Math.random() - 0.5) * range;
        const position = new THREE.Vector3(
          side * (4.66 + tier * 0.98 + jitter(0.08)),
          0.12,
          (row - 3.5) * 1.08 + jitter(0.08),
        );
        const facing = (Math.random() - 0.5) * Math.PI * 2;
        mesh.position.copy(origin);
        mesh.rotation.y = facing;
        mesh.userData.captureIndex = state.lastMoveIndex;
        mesh.userData.rackSlot = slot;
        capturedPieces.push({
          mesh,
          captureIndex: state.lastMoveIndex,
          position,
          from: origin,
          rotation: facing,
          startTime: performance.now(),
          duration: reducedMotion ? 180 : 360 + Math.random() * 120,
          phase: Math.random() * Math.PI * 2,
        });
      } else {
        world.remove(mesh);
        releaseCharacter(mesh.userData.visual);
      }
    }
    pieceMeshes.splice(0, pieceMeshes.length, ...nextPieces);
  }

  function resize() {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    if (width > height * 1.1 || height > width * 1.1) {
      const portrait = height > width;
      if (portrait !== lastPortrait) {
        const azimuth = Math.atan2(
          camera.position.x - controls.target.x,
          camera.position.z - controls.target.z
        );
        cameraProfile = portrait
          ? { radius: 17.2, height: 11.8, fov: 48, targetY: 0.25 }
          : window.matchMedia('(max-width: 640px)').matches
            ? { radius: 10, height: 6.6, fov: 36, targetY: 0.35 }
            : { radius: 11.5, height: 7.8, fov: 36, targetY: 0.35 };
        controls.target.set(0, cameraProfile.targetY, 0);
        camera.position.set(
          Math.sin(azimuth) * cameraProfile.radius,
          cameraProfile.height,
          Math.cos(azimuth) * cameraProfile.radius
        );
        camera.fov = cameraProfile.fov;
        lastPortrait = portrait;
        controls.update();
        controls.saveState();
      }
    }
    camera.updateProjectionMatrix();
  }

  function resetCamera() {
    cancelIntro();
    controls.reset();
  }

  let introFrame = 0;
  let introToken = 0;
  function cancelIntro() {
    introToken += 1;
    if (introFrame) cancelAnimationFrame(introFrame);
    introFrame = 0;
    controls.enabled = true;
  }

  function playIntro() {
    cancelIntro();
    const token = ++introToken;
    controls.enabled = false;
    const target = controls.target.clone();
    const endRadius = cameraProfile.radius;
    const endAngle = 0;
    const startRadius = endRadius + 1.1;
    const endY = cameraProfile.height;
    const startY = endY + 2.4;
    const start = performance.now();
    const duration = 4600;
    const step = (now) => {
      if (token !== introToken) return;
      const t = Math.min(1, (now - start) / duration);
      const eased = t * t * (3 - 2 * t);
      const angle = endAngle + (1 - eased) * Math.PI * 2;
      const radius = startRadius + (endRadius - startRadius) * eased;
      const y = startY + (endY - startY) * eased;
      camera.position.set(target.x + Math.sin(angle) * radius, y, target.z + Math.cos(angle) * radius);
      camera.lookAt(target);
      if (t < 1) introFrame = requestAnimationFrame(step);
      else {
        introFrame = 0;
        controls.enabled = true;
        controls.update();
        controls.saveState();
      }
    };
    introFrame = requestAnimationFrame(step);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  let previousFrameTime = 0;
  function animate() {
    requestAnimationFrame(animate);
    if (document.hidden || !host.clientWidth || !host.clientHeight) { previousFrameTime = 0; return; }
    const now = performance.now();
    const time = now * 0.001;
    fieldLife.update(time);
    const delta = previousFrameTime ? Math.min((now - previousFrameTime) / 1000, 0.05) : 0;
    previousFrameTime = now;
    for (const piece of pieceMeshes) {
      if (piece === draggedPiece) continue;
      const base = piece.userData.basePosition;
      const idle = piece.userData.idleAnimation;
      const motion = piece.userData.moveAnimation;
      if (!base || !idle) continue;
      animateCharacter(piece.userData.visual, time, { moving: Boolean(motion), selected: piece.userData.selected, reducedMotion, phase: idle.phase });

      if (motion) {
        const progress = Math.min(1, (now - motion.startTime) / motion.duration);
        const eased = 1 - (1 - progress) ** 3;
        piece.position.lerpVectors(motion.from, motion.to, eased);
        // Use the same progress as X/Z so long moves clear the central terraces.
        piece.position.y += Math.sin(Math.PI * eased) * 0.65;
        piece.rotation.y = Math.sin(Math.PI * progress) * 0.18;
        piece.scale.setScalar(1 + Math.sin(Math.PI * progress) * 0.035);
        if (progress >= 1) {
          piece.userData.moveAnimation = null;
          piece.position.copy(base);
          piece.rotation.set(0, 0, 0);
          piece.scale.setScalar(1);
        }
        continue;
      }

      piece.position.copy(base);
      piece.rotation.set(0,0,0);
      piece.scale.setScalar(1);
    }
    if (windParticles) {
      const positions = windParticles.positions;
      for (let index = 0; index < windParticles.count; index += 1) {
        const offset = index * 3;
        positions[offset] += windParticles.drift[index * 2] * delta;
        positions[offset + 1] += Math.sin(time * 0.65 + windParticles.phase[index]) * delta * 0.018;
        positions[offset + 2] += windParticles.drift[index * 2 + 1] * delta;
        if (positions[offset] > 7.2) positions[offset] = -7.2;
        if (positions[offset] < -7.2) positions[offset] = 7.2;
        if (positions[offset + 2] > 7.2) positions[offset + 2] = -7.2;
        if (positions[offset + 2] < -7.2) positions[offset + 2] = 7.2;
      }
      windParticles.geometry.attributes.position.needsUpdate = true;
    }
    for (const mesh of capturedMeshes) {
      animateCharacter(mesh.userData.visual,time,{ reducedMotion, phase: mesh.userData.idleAnimation.phase });
      const cheer = mesh.userData.cheer;
      const base = mesh.userData.capturedPosition;
      if (!cheer || !base) continue;
      if (!cheer.startedAt && now >= cheer.nextAt) cheer.startedAt = now;
      if (!cheer.startedAt) continue;
      const progress = Math.min(1, (now - cheer.startedAt) / cheer.duration);
      const hop = Math.sin(Math.PI * progress);
      mesh.position.set(base.x, base.y + hop * cheer.height, base.z);
      mesh.rotation.z = hop * cheer.tilt;
      if (progress >= 1) {
        mesh.position.copy(base);
        mesh.rotation.z = 0;
        cheer.startedAt = 0;
        cheer.nextAt = now + 2400 + Math.random() * 6400;
        cheer.duration = 520 + Math.random() * 280;
        cheer.height = 0.09 + Math.random() * 0.1;
        cheer.tilt = (Math.random() - 0.5) * 0.12;
      }
    }
    for (let index = capturedPieces.length - 1; index >= 0; index -= 1) {
      const effect = capturedPieces[index];
      const progress = Math.min(1, (now - effect.startTime) / effect.duration);
      const eased = progress * progress * (3 - 2 * progress);
      effect.mesh.position.lerpVectors(effect.from, effect.position, eased);
      effect.mesh.position.y += Math.sin(Math.PI * progress) * 0.38;
      effect.mesh.rotation.y = effect.rotation + eased * (0.6 + Math.sin(effect.phase) * 0.2);
      effect.mesh.rotation.z = Math.sin(Math.PI * progress) * 0.16;
      effect.mesh.scale.setScalar(1 + Math.sin(Math.PI * progress) * 0.08);
      if (progress >= 1) {
        effect.mesh.position.copy(effect.position);
        effect.mesh.rotation.z = 0;
        effect.mesh.scale.setScalar(1);
        effect.mesh.userData.capturedPosition = effect.position.clone();
        effect.mesh.userData.cheer = reducedMotion ? null : {
          nextAt: now + 1800 + Math.random() * 5200,
          duration: 520 + Math.random() * 280,
          height: 0.09 + Math.random() * 0.1,
          tilt: (Math.random() - 0.5) * 0.12,
          startedAt: 0,
        };
        capturedMeshes.push(effect.mesh);
        capturedPieces.splice(index, 1);
      }
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  return { update, resize, resetCamera, playIntro, cancelIntro };
}

function buildBoard(world, tileMeshes, tileHeights, tileMaterials) {
  const mountain = new THREE.Mesh(createMountainGeometry(), earthMaterial({ vertexColors: true }));
  mountain.userData.kind = 'terrain';
  mountain.castShadow = mountain.receiveShadow = true;
  world.add(mountain);

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let file = 0; file < BOARD_SIZE; file += 1) {
      const square = `${FILES[file]}${8 - row}`;
      const light = (row + file) % 2 === 0;
      const material = earthMaterial({
        color: light ? palette.light : palette.dark,
        roughness: 0.98,
        metalness: 0,
        emissive: 0x000000,
        emissiveIntensity: 0,
      });
      const top = tileElevation(row, file);
      const tile = new THREE.Mesh(createTileGeometry(row, file), material);
      tile.position.set(file - 3.5, top, row - 3.5);
      tile.castShadow = true;
      tile.receiveShadow = true;
      tile.userData = { kind: 'tile', square };
      world.add(tile);
      tileMeshes.push(tile);
      tileHeights.set(square, top);
      tileMaterials.set(square, material);
    }
  }

  return mountain;
}

function buildWindParticles(world, reducedMotion) {
  if (reducedMotion) return null;
  const count = 32;
  const positions = new Float32Array(count * 3);
  const drift = new Float32Array(count * 2);
  const phase = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    positions[offset] = Math.random() * 14.4 - 7.2;
    positions[offset + 1] = 0.55 + Math.random() * 2.2;
    positions[offset + 2] = Math.random() * 14.4 - 7.2;
    drift[index * 2] = 0.12 + Math.random() * 0.22;
    drift[index * 2 + 1] = (Math.random() - 0.5) * 0.08;
    phase[index] = Math.random() * Math.PI * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xd9dcc7,
    size: 0.045,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(geometry, material);
  particles.frustumCulled = false;
  world.add(particles);
  return { geometry, positions, drift, phase, count };
}

function createSunsetSky() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.Color(0x273632);
  const horizon = context.createLinearGradient(0, 0, 0, canvas.height);
  horizon.addColorStop(0, '#182724');
  horizon.addColorStop(0.38, '#35443d');
  horizon.addColorStop(0.53, '#765544');
  horizon.addColorStop(0.62, '#d38a52');
  horizon.addColorStop(0.68, '#e7ad68');
  horizon.addColorStop(0.76, '#987050');
  horizon.addColorStop(1, '#303d35');
  context.fillStyle = horizon;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const glow = context.createRadialGradient(690, 304, 4, 690, 304, 150);
  glow.addColorStop(0, '#ffdc9b');
  glow.addColorStop(0.16, '#ffd08b99');
  glow.addColorStop(1, '#f1a35a00');
  context.fillStyle = glow;
  context.fillRect(520, 134, 340, 340);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPiece(type, color) {
  const look = appearanceFor(type,color);
  const piece = new THREE.Group();
  const figure = createCharacter(look,color === 'w' ? Math.PI : 0);
  piece.add(figure);
  piece.userData.visual = figure;
  piece.userData.appearance = appearanceKey(look);
  piece.userData.idleAnimation = { phase: Math.random()*Math.PI*2 };
  figure.userData.ready.catch(error => console.error('No se pudo preparar una pieza:',error));
  return piece;
}

function getSpriteTexture(type,color) {
  const look = appearanceFor(type,color), key = appearanceKey(look);
  if (!spriteTextures.has(key)) {
    const texture = new THREE.TextureLoader().load(thumbnailUrl(look));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = texture.minFilter = THREE.NearestFilter;
    spriteTextures.set(key,texture);
  }
  return spriteTextures.get(key);
}
function worldToSquare(x, z) {
  const file = Math.round(x + 3.5);
  const row = Math.round(z + 3.5);
  if (file < 0 || file > 7 || row < 0 || row > 7) return null;
  return `${FILES[file]}${8 - row}`;
}
