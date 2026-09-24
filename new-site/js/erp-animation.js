import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ============================================================
   1. CONTENT
   ============================================================ */
const BRAND = 0xf44a22;
const FEATURES = [
  { name: 'Finance', color: BRAND, tagline: 'Bring financial control, visibility and reporting into one place.', bullets: ['Live financial reporting', 'Invoices, payments and reconciliation', 'Multi-currency and tax ready'] },
  { name: 'Sales', color: BRAND, tagline: 'Turn customer activity into a clear, connected sales process.', bullets: ['CRM and pipeline tracking', 'Quotes to invoices', 'Customer activity in one view'] },
  { name: 'Operations', color: BRAND, tagline: 'Keep the moving parts of the business synchronized.', bullets: ['Workflow and approvals', 'Process visibility', 'Vendor and operational management'] },
  { name: 'Analytics', color: BRAND, tagline: 'Turn business data into decisions with a single source of truth.', bullets: ['Live dashboards', 'Custom reports', 'Performance insights'] },
  { name: 'HR', color: BRAND, tagline: 'Manage people, performance and the employee lifecycle.', bullets: ['Employee records', 'Leave and attendance', 'Performance visibility'] },
  { name: 'Inventory', color: BRAND, tagline: 'Know what you have, where it is and what needs attention.', bullets: ['Stock visibility', 'Multi-location inventory', 'Reorder and movement tracking'] },
  { name: 'Projects', color: BRAND, tagline: 'Plan work, track delivery and keep projects accountable.', bullets: ['Planning and milestones', 'Time and budget tracking', 'Project visibility'] },
  { name: 'CRM', color: BRAND, tagline: 'Keep customer relationships connected across the business.', bullets: ['Customer profiles', 'Interactions and follow-ups', 'Connected sales activity'] },
];

/* ============================================================
   2. TIMELINE
   ============================================================ */
const SPEED = 1.0;
const TL = {
  camMove: 1.40,
  explodeStart: 2.60, explodeDur: 1.15,
  settleStart: 3.40, settleDur: 0.95,
  revealStart: 4.45,
  rise: 0.70, hold: 4.60, park: 0.70,
  finaleDur: 2.60, tail: 2.35,
  loopFade: 0.50,
};
TL.step = TL.rise + TL.hold + TL.park;
TL.finaleStart = TL.revealStart + FEATURES.length * TL.step;
TL.total = TL.finaleStart + TL.finaleDur + TL.tail;

/* ============================================================
   3. GRID / GEOMETRY CONSTANTS
   ============================================================ */
const N = 6, PITCH = 0.50, CUBE = 0.485;
const CAM_DIST = 12, FOV = 42;
const FEATURE_CELLS = [[0, 0, 5], [5, 0, 0], [0, 5, 0], [5, 5, 5], [2, 0, 2], [5, 3, 4], [1, 4, 2], [4, 1, 5]];

/* ============================================================
   4. UTILITIES
   ============================================================ */
const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;
const seg = (t, start, dur) => clamp01((t - start) / dur);
const ease = {
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outBack: t => { const c1 = 1.3, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; } }
const rnd = mulberry32(20240617);
const $ = id => document.getElementById(id);

/* ============================================================
   5. RENDERER / SCENE / CAMERA
   ============================================================ */
const viewport = $('ui');
const heroCopyEl = document.querySelector('.hero-copy');
const heroEl = document.querySelector('.hero');
let qualityScale = 1, bloomKilled = false;
const viewportSize = () => ({ width: viewport.clientWidth, height: viewport.clientHeight });
const initialSize = viewportSize();
const mobilePixRatio = () => Math.min(devicePixelRatio || 1, (viewport.clientWidth < 820 ? 1.5 : 2) * qualityScale);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(mobilePixRatio());
renderer.setSize(initialSize.width, initialSize.height);
const BG_SCENE = 0x000000;
renderer.setClearColor(BG_SCENE);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.domElement.setAttribute('aria-hidden', 'true');
renderer.domElement.setAttribute('role', 'presentation');
viewport.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(BG_SCENE, 16, 34);
const stage = new THREE.Group();
scene.add(stage);

const camera = new THREE.PerspectiveCamera(FOV, initialSize.width / initialSize.height, 0.1, 100);
const CAM_START = new THREE.Vector3(7.0, 5.2, 8.6);
const CAM_END = new THREE.Vector3(0.0, 0.0, CAM_DIST);
camera.position.copy(CAM_START);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
pmrem.dispose();

scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 7, 6); scene.add(key);
const rim = new THREE.DirectionalLight(BRAND, 1.25); rim.position.set(-6, -2, -5); scene.add(rim);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(initialSize.width, initialSize.height), 0.36, 0.52, 0.72);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ============================================================
   6. BUILD THE CUBE
   ============================================================ */
const geo = new THREE.BoxGeometry(CUBE, CUBE, CUBE);
const baseMat = new THREE.MeshStandardMaterial({ color: 0x303236, roughness: 0.30, metalness: 0.68 });
const BASE_COLOR = new THREE.Color(0x303236);

function flatShadedCube() {
  const g = new THREE.BoxGeometry(CUBE, CUBE, CUBE);
  const shades = [0.82, 0.62, 0.92, 0.5, 1.0, 0.55];
  const col = new Float32Array(24 * 3);
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) {
    const i = (f * 4 + v) * 3;
    col[i] = col[i + 1] = col[i + 2] = shades[f];
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}
const flatGeo = flatShadedCube();

const BRAND_LINEAR = new THREE.Color().setRGB(0.88402, 0.04768, 0.01108);

const half = (N - 1) * PITCH / 2;
const featureIndexAt = new Map(FEATURE_CELLS.map(([x, y, z], i) => [`${x},${y},${z}`, i]));

const debris = [];
const cells = [];
const dummy = new THREE.Object3D();

for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
  const home = new THREE.Vector3(x * PITCH - half, y * PITCH - half, z * PITCH - half);
  const dir = home.clone().normalize().add(new THREE.Vector3(rnd() - .5, rnd() - .5, rnd() - .5).multiplyScalar(0.85)).normalize();
  const explode = dir.multiplyScalar(4.5 + rnd() * 6).add(new THREE.Vector3(0, rnd() * 1.6, 0));
  explode.x = explode.x * 0.55 + 2.4;
  const spinAxis = new THREE.Vector3(rnd() - .5, rnd() - .5, rnd() - .5).normalize();
  const spinAmt = (rnd() * 2.2 + 0.8) * (rnd() < .5 ? -1 : 1);

  const fi = featureIndexAt.has(`${x},${y},${z}`) ? featureIndexAt.get(`${x},${y},${z}`) : -1;
  const rec = { home, explode, spinAxis, spinAmt, isFeature: fi !== -1 };

  if (rec.isFeature) {
    const mesh = new THREE.Mesh(flatGeo, new THREE.MeshBasicMaterial({
      vertexColors: true, color: BASE_COLOR.clone()
    }));
    stage.add(mesh);
    rec.mesh = mesh;
    rec.feature = FEATURES[fi];
    rec.accent = BRAND_LINEAR.clone();
    cells[fi] = rec;
  } else {
    debris.push(rec);
  }
}

const debrisMesh = new THREE.InstancedMesh(geo, baseMat, debris.length);
debrisMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
debrisMesh.frustumCulled = false;
stage.add(debrisMesh);

/* ============================================================
   7. RESPONSIVE LAYOUT
   ============================================================ */
const L = { focal: new THREE.Vector3(), queue: new THREE.Vector3(), stack: [], focalScale: 3.2, stackScale: 1.25 };
let mobile = false;

function layout() {
  mobile = viewport.clientWidth < 820;
  camera.fov = mobile ? (viewport.clientHeight < 700 ? 72 : 60) : FOV;
  camera.updateProjectionMatrix();
  const vH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * CAM_DIST;
  const vW = vH * camera.aspect;

  if (mobile) {
    stage.position.x = 0;
    heroEl.style.setProperty('--stage-x', '50%');
    // compose inside the measured stage band: row above, cube + caption below.
    // band = what's left above the bottom slot (the copy is the taller of the two)
    const Hpx = viewport.clientHeight;
    const copyH = heroCopyEl ? heroCopyEl.offsetHeight : 260;
    const band = Math.max(Hpx - copyH - 72, 180);
    const fCube = (band * 0.56) / Hpx, fRow = (band * 0.07) / Hpx;
    stage.position.y = (0.5 - fCube) * vH;
    L.focal.set(0, 0, 0.6);
    L.focalScale = 2.6;   // real zoom on mobile: the module cube dwarfs the parked row
    // spacing derives from the cube's own size -> clear gaps at every aspect
    let step = (0.86 * vW) / 7;
    L.stackScale = step / (CUBE * 1.6);
    L.stack = FEATURES.map((_, i) => new THREE.Vector3((i - 3.5) * step, (fCube - fRow) * vH, -0.5));
  } else {
    // Full-bleed stage: centre the cluster in the space between the hero copy
    // and the right viewport edge (measured, like the mobile band). Falls back
    // to fixed fractions when the copy spans the full width. Capped so the
    // cube never collides with the feature panel at right: 3%.
    const narrow = camera.aspect < 1.6;
    const vwPx = viewport.clientWidth;
    const cr = heroCopyEl ? heroCopyEl.getBoundingClientRect().right : 0;
    const copyFrac = vwPx ? cr / vwPx : 0.45;
    const capMax = 0.66;
    const frac = (copyFrac > 0.05 && copyFrac < 0.70)
      ? Math.min(capMax, Math.max(0.55, (copyFrac + 1) / 2))
      : (narrow ? 0.60 : 0.63);
    stage.position.x = (frac - 0.5) * vW;
    stage.position.y = 0;
    // intro/outro captions centre on this axis -- same line as the cube
    heroEl.style.setProperty('--stage-x', (frac * 100).toFixed(1) + '%');
    L.focal.set(0, 0.10, 1.0);
    L.focalScale = narrow ? 2.4 : 3.0;
    const step = (0.30 * vW) / 7;
    L.stackScale = step / (CUBE * 1.6);   // gap = 60% of a cube's width
    L.stack = FEATURES.map((_, i) => new THREE.Vector3((i - 3.5) * step, vH * 0.27, -0.6));
  }
  L.queue.copy(L.focal).add(new THREE.Vector3(0, -vH * 0.62, -1.2));
}

/* ============================================================
   8. ANIMATION
   ============================================================ */
const _v = new THREE.Vector3(), _corner = new THREE.Vector3();
let activeIndex = -1, panelPlacedFor = -1;

function evaluate(t) {
  const ce = ease.inOutCubic(seg(t, 0, TL.camMove));
  camera.position.lerpVectors(CAM_START, CAM_END, ce);
  camera.position.x += Math.sin(t * 0.22) * 0.22 + parallax.x;
  camera.position.y += Math.cos(t * 0.19) * 0.16 + parallax.y;
  camera.lookAt(0, 0, 0);

  for (let i = 0; i < debris.length; i++) {
    const d = debris[i];
    if (t < TL.explodeStart) {
      dummy.position.copy(d.home);
      dummy.quaternion.identity();
      dummy.scale.setScalar(1);
    } else if (t < TL.finaleStart) {
      const e = ease.outCubic(seg(t, TL.explodeStart, TL.explodeDur));
      dummy.position.lerpVectors(d.home, d.explode, e);
      dummy.quaternion.setFromAxisAngle(d.spinAxis, d.spinAmt * e * Math.PI);
      dummy.scale.setScalar(1 - ease.inOutCubic(seg(t, TL.settleStart, TL.settleDur)));
    } else {
      const p = seg(t, TL.finaleStart, TL.finaleDur), f = ease.inOutCubic(p);
      dummy.position.lerpVectors(d.explode, d.home, f);
      dummy.quaternion.setFromAxisAngle(d.spinAxis, d.spinAmt * (1 - f) * Math.PI);
      dummy.scale.setScalar(ease.outCubic(clamp01(p * 2.2)));
    }
    dummy.updateMatrix();
    debrisMesh.setMatrixAt(i, dummy.matrix);
  }
  debrisMesh.instanceMatrix.needsUpdate = true;

  let active = -1;
  cells.forEach((c, i) => {
    const m = c.mesh;
    const s = TL.revealStart + i * TL.step;
    const riseEnd = s + TL.rise;
    const holdEnd = riseEnd + TL.hold;
    const parkEnd = holdEnd + TL.park;

    let scale, lit = 0;

    if (t < TL.explodeStart) {
      m.position.copy(c.home); m.quaternion.identity(); scale = 1;
    } else if (t < s) {
      const e = ease.outCubic(seg(t, TL.explodeStart, TL.explodeDur));
      m.position.lerpVectors(c.home, c.explode, e);
      m.quaternion.setFromAxisAngle(c.spinAxis, c.spinAmt * e * Math.PI);
      scale = 1 - ease.inOutCubic(seg(t, TL.settleStart, TL.settleDur));
      if (t > TL.settleStart + TL.settleDur) m.position.copy(L.queue);
    } else if (t < riseEnd) {
      const p = seg(t, s, TL.rise), e = ease.outCubic(p);
      m.position.lerpVectors(L.queue, L.focal, e);
      m.rotation.set(0.35 * (1 - e) + t * 0.25, -0.8 * (1 - e) + t * 0.34, 0);
      scale = L.focalScale * ease.outBack(p);
      lit = p;
    } else if (t < holdEnd) {
      m.position.copy(L.focal); m.position.y += Math.sin((t - riseEnd) * 1.5) * 0.075;
      m.rotation.set(t * 0.25, t * 0.34, 0);
      scale = L.focalScale; lit = 1;
    } else if (t < parkEnd) {
      const e = ease.inOutCubic(seg(t, holdEnd, TL.park));
      m.position.lerpVectors(L.focal, L.stack[i], e);
      m.rotation.set(t * 0.25 * (1 - e), t * 0.34 * (1 - e), 0);
      scale = THREE.MathUtils.lerp(L.focalScale, L.stackScale, e);
      lit = 1;
    } else if (t < TL.finaleStart) {
      m.position.copy(L.stack[i]); m.position.y += Math.sin(t * 1.1 + i) * 0.045;
      m.quaternion.identity();
      scale = L.stackScale; lit = 1;
    } else {
      const f = ease.inOutCubic(seg(t, TL.finaleStart, TL.finaleDur));
      m.position.lerpVectors(L.stack[i], c.home, f);
      m.quaternion.identity();
      scale = THREE.MathUtils.lerp(L.stackScale, 1, f);
      lit = 1;
    }

    m.scale.setScalar(Math.max(scale, 0));
    m.material.color.copy(BASE_COLOR).lerp(c.accent, clamp01(lit * 1.4));

    if (t >= s + TL.rise * 0.45 && t < holdEnd + TL.park * 0.5) active = i;
  });

  if (active !== activeIndex) { activeIndex = active; syncPanel(active); }
  intro.classList.toggle('show', t > 0.9 && t < TL.explodeStart - 0.05);
  outro.classList.toggle('show', t > TL.finaleStart + TL.finaleDur * 0.85);
  // phones: the module tour takes over the bottom slot from the marketing copy
  if (heroEl) heroEl.classList.toggle('tour', active >= 0);

  if (intro.classList.contains('show') || outro.classList.contains('show')) {
    const s = half + CUBE / 2;
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (let i = 0; i < 8; i++) {
      _corner.set((i & 1 ? s : -s) + stage.position.x,
        (i & 2 ? s : -s) + stage.position.y,
        (i & 4 ? s : -s) + stage.position.z).project(camera);
      const px = (_corner.x * .5 + .5) * viewport.clientWidth;
      const py = (-_corner.y * .5 + .5) * viewport.clientHeight;
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }
    const ax = (minX + maxX) / 2 + 'px', ay = (minY + maxY) / 2 + 'px';
    intro.style.left = ax; intro.style.top = ay;
    outro.style.left = ax; outro.style.top = ay;
  }
  if (active >= 0 && !mobile) {
    // panel is placed ONCE per feature, at the cube's focal slot with a
    // rotation-invariant (corner-on) bound: the text stays completely still
    // while the cube spins, bobs and drifts
    if (panelPlacedFor !== active) {
      panelPlacedFor = active;
      _corner.set(stage.position.x + L.focal.x, stage.position.y + L.focal.y, stage.position.z + L.focal.z).project(camera);
      const cx = (_corner.x * .5 + .5) * viewport.clientWidth;
      const cy = (-_corner.y * .5 + .5) * viewport.clientHeight;
      const r = Math.sqrt(3) * (CUBE / 2) * L.focalScale * viewport.clientHeight
        / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (CAM_DIST - L.focal.z));
      const pw = Math.min(280, viewport.clientWidth * 0.175);
      panel.style.left = Math.min(cx + r + 48, viewport.clientWidth - pw - 32) + 'px';
      panel.style.top = cy + 'px';
      updateAnchor();
    }
    drawLink(cells[active].mesh);
  }
}

/* ============================================================
   9. PANEL + CONNECTOR
   ============================================================ */
const panel = $('panel');
const intro = $('intro');
const outro = $('outro');
const linkEl = $('link');
const linkPath = $('linkPath');
const linkDot = $('linkDot');
const fadeEl = $('fade');
const titleEl = $('title');
const taglineEl = $('tagline');
const bulletsEl = $('bullets');
let swapTimer = null;
let anchor = { x: 0, y: 0 };

function updateAnchor() {
  const r = panel.getBoundingClientRect(), vr = viewport.getBoundingClientRect();
  anchor.x = r.left - vr.left - 22;
  anchor.y = r.top - vr.top + 34;
}

function syncPanel(i) {
  clearTimeout(swapTimer);
  if (i < 0) { panelPlacedFor = -1; panel.classList.remove('show'); linkEl.classList.remove('show'); return; }
  const f = FEATURES[i], hex = '#' + (f.color & 0xFFFFFF).toString(16).padStart(6, '0');
  panel.classList.remove('show');
  swapTimer = setTimeout(() => {
    if (activeIndex !== i) return;
    panel.style.color = hex;
    linkEl.style.color = hex;
    titleEl.textContent = f.name;
    taglineEl.textContent = f.tagline;
    bulletsEl.textContent = '';
    for (const b of f.bullets) {
      const li = document.createElement('li');
      li.textContent = b;
      bulletsEl.appendChild(li);
    }
    panel.classList.add('show');
    linkEl.classList.add('show');
    requestAnimationFrame(updateAnchor);
  }, 140);
}

function drawLink(mesh) {
  mesh.getWorldPosition(_v).project(camera);
  const x1 = (_v.x * 0.5 + 0.5) * viewport.clientWidth, y1 = (-_v.y * 0.5 + 0.5) * viewport.clientHeight;
  const x2 = anchor.x, y2 = anchor.y;
  const mx = (x1 + x2) / 2;
  linkPath.setAttribute('d', `M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}`);
  linkDot.setAttribute('cx', x2); linkDot.setAttribute('cy', y2);
}

/* ============================================================
   10. INPUT, TRANSPORT, LOOP
   ============================================================ */
const parallax = new THREE.Vector2();
const target = new THREE.Vector2();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

addEventListener('pointermove', e => {
  const r = viewport.getBoundingClientRect();
  if (!r.width) return;
  target.set(((e.clientX - r.left) / r.width - .5) * 0.8, -((e.clientY - r.top) / r.height - .5) * 0.7);
});

let time = 0, playing = true, last = performance.now(), heroVisible = true;
let uiHidden = false;
let perfStep = 0, perfFrames = 0, perfTime = 0;

function setPlaying(v) { playing = v; }

// click anywhere on the hero toggles play/pause (links and buttons excluded)
if (heroEl) heroEl.addEventListener('click', e => {
  if (e.target.closest('a, button')) return;
  setPlaying(!playing);
});

addEventListener('keydown', e => {
  const t = e.target, tag = t && t.tagName;
  if (t && (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(tag))) return;
  if (e.code === 'Space') {
    if (tag === 'BUTTON') return;
    e.preventDefault(); setPlaying(!playing);
  }
  if (e.key.toLowerCase() === 'r') { time = 0; setPlaying(true); }
});

function resize() {
  const size = viewportSize();
  if (!size.width) return;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(mobilePixRatio());
  renderer.setSize(size.width, size.height);
  composer.setSize(size.width, size.height);
  bloom.enabled = size.width >= 820 && !bloomKilled;
  panelPlacedFor = -1;
  layout();
  updateAnchor();
}
addEventListener('resize', resize);
addEventListener('scroll', updateAnchor, { passive: true });
layout();

if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; }, { threshold: 0 })
    .observe(document.querySelector('.hero'));
}

renderer.setAnimationLoop(now => {
  const rawDt = (now - last) / 1000; last = now;
  const dt = Math.min(rawDt, 0.25);
  if (!heroVisible) return;

  // narrow viewports: animation disabled for now (mobile layout TBD)
  const narrowNow = window.innerWidth < 820;
  if (narrowNow !== uiHidden) {
    uiHidden = narrowNow;
    if (narrowNow) { panel.classList.remove('show'); linkEl.classList.remove('show'); }
    else resize();
  }
  if (uiHidden) return;

  if (perfStep < 2 && rawDt < 0.5) {
    perfFrames++; perfTime += rawDt;
    if (perfFrames >= 90) {
      const fps = perfFrames / Math.max(perfTime, .001);
      if (fps < 32) { qualityScale *= 0.6; bloomKilled = true; bloom.enabled = false; perfStep++; resize(); }
      else if (fps < 50) { qualityScale *= 0.8; perfStep++; resize(); }
      else perfStep = 2;
      perfFrames = 0; perfTime = 0;
    }
  }

  if (playing) time += dt * SPEED;
  if (time > TL.total) time = 0;

  parallax.lerp(target, reduceMotion ? 1 : 1 - Math.pow(0.063, dt));
  evaluate(time);

  const fadeOut = ease.inOutCubic(seg(time, TL.total - TL.loopFade, TL.loopFade));
  const fadeIn = 1 - ease.inOutCubic(seg(time, 0, TL.loopFade * 0.8));
  fadeEl.style.opacity = Math.max(fadeOut, fadeIn).toFixed(3);

  composer.render();
});

renderer.domElement.addEventListener('webglcontextlost', e => {
  e.preventDefault();
  document.body.classList.add('no3d');
});

// Fallback timeout if module never boots
setTimeout(function () { if (!window.__acc3d) document.body.classList.add('no3d'); }, 6000);

window.__acc3d = true;
document.body.classList.add('a3d-ready');
