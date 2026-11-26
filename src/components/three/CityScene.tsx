'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppProvider';

/* ─── The city: districts are the places I've shipped from ──────────────── */

interface District {
  id: string;
  label: string;
  sub: string;
  x: number;
  z: number;
  r: number;
  n: number;
  hMin: number;
  hMax: number;
  tint: string;
  density: number;
  grid?: boolean;
  accent?: boolean;
}

const DISTRICTS: District[] = [
  { id: 'carelon', label: 'Carelon', sub: 'now · associate software engineer', x: 0, z: -28, r: 11, n: 16, hMin: 16, hMax: 40, tint: '#ff5b1f', density: 0.55, accent: true },
  { id: 'leap', label: 'LEAP Finance', sub: 'search · 2M+ records · under 1s', x: -40, z: 2, r: 9, n: 13, hMin: 9, hMax: 26, tint: '#8fd3ff', density: 0.5 },
  { id: 'reckon', label: 'Reckon', sub: 'double-entry ledger · zero drift', x: 36, z: 4, r: 8, n: 12, hMin: 8, hMax: 22, tint: '#ffcf70', density: 0.5, grid: true },
  { id: 'revive', label: 'Revive', sub: 'won back 32% of KYC drop-offs', x: -22, z: 38, r: 9, n: 12, hMin: 7, hMax: 24, tint: '#c3a1ff', density: 0.48 },
  { id: 'hireraft', label: 'hireraft', sub: '1000+ students placed through it', x: 28, z: 44, r: 9, n: 12, hMin: 6, hMax: 17, tint: '#79ffbf', density: 0.42 },
  { id: 'nit', label: 'NIT Kurukshetra', sub: 'where it started · 2022', x: 0, z: 74, r: 13, n: 12, hMin: 3, hMax: 7, tint: '#f2f0ea', density: 0.38 },
];

const ROADS: [string, string, number][] = [
  ['carelon', 'leap', 6],
  ['carelon', 'reckon', -6],
  ['carelon', 'revive', 8],
  ['carelon', 'hireraft', -8],
  ['leap', 'revive', -5],
  ['reckon', 'hireraft', 5],
  ['revive', 'nit', 4],
  ['hireraft', 'nit', -4],
  ['leap', 'nit', 14],
  ['reckon', 'nit', -14],
];

/** Camera shots, keyed to page sections (selector + fraction of its height). */
const SHOTS: { sel: string; f: number; pos: [number, number, number]; tgt: [number, number, number] }[] = [
  { sel: '#top', f: 0, pos: [0, 30, 104], tgt: [0, 12, 0] },
  { sel: '#about', f: 0, pos: [-26, 15, 64], tgt: [0, 15, -14] },
  { sel: '#experience', f: 0.05, pos: [18, 8, -4], tgt: [0, 38, -28] },
  { sel: '#experience', f: 0.55, pos: [-66, 15, 24], tgt: [-40, 10, 2] },
  { sel: '#projects', f: 0.05, pos: [-46, 13, 62], tgt: [-22, 8, 38] },
  { sel: '#projects', f: 0.4, pos: [52, 12, 70], tgt: [28, 6, 44] },
  { sel: '#projects', f: 0.72, pos: [62, 15, 22], tgt: [36, 8, 4] },
  { sel: '#skills', f: 0.1, pos: [0, 130, 34], tgt: [0, 0, 8] },
  { sel: '#contact', f: 0.2, pos: [0, 24, 160], tgt: [0, 26, 0] },
];

/* ─── Shaders ───────────────────────────────────────────────────────────── */

const FOG = /* glsl */ `
  uniform vec3 uFog; uniform vec3 uCam; uniform float uFogNear; uniform float uFogFar;
  vec3 applyFog(vec3 c, vec3 w) { return mix(c, uFog, smoothstep(uFogNear, uFogFar, length(w - uCam))); }
`;

const BUILDING_VS = /* glsl */ `
  attribute vec3 aData;
  varying vec3 vWorld; varying vec3 vN; varying vec3 vTint; varying vec3 vData; varying vec3 vLocal;
  void main() {
    vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vWorld = wp.xyz; vN = normal; vTint = instanceColor; vData = aData; vLocal = position;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const BUILDING_FS = /* glsl */ `
  uniform float uTime;
  ${FOG}
  varying vec3 vWorld; varying vec3 vN; varying vec3 vTint; varying vec3 vData; varying vec3 vLocal;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec3 n = normalize(vN);
    vec3 base = vec3(0.0045, 0.0045, 0.0055) + vTint * 0.004;
    base *= 0.65 + 0.7 * max(dot(n, normalize(vec3(0.35, 0.8, 0.45))), 0.0);
    base *= mix(0.45, 1.25, vLocal.y);
    vec3 col = base;
    if (abs(n.y) < 0.5) {
      float u = abs(n.x) > 0.5 ? vWorld.z : vWorld.x;
      vec2 cell = vec2(floor(u / 0.9), floor(vWorld.y / 1.15));
      vec2 f = vec2(fract(u / 0.9), fract(vWorld.y / 1.15));
      float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.28, f.y) * step(f.y, 0.76);
      float h = hash(cell + vData.y * 17.0 + n.xz * 3.1);
      float lit = step(1.0 - vData.x, h);
      float flick = 0.8 + 0.2 * sin(uTime * 0.7 + h * 50.0);
      vec3 wc = mix(vTint, vec3(1.0, 0.86, 0.62), step(0.72, fract(h * 7.31)) * 0.65);
      float near = 1.0 - smoothstep(60.0, 220.0, length(vWorld - uCam));
      col += win * lit * wc * (0.16 + pow(h, 6.0) * 1.4) * flick * step(0.9, vWorld.y) * near;
      // vertical light strip on accent towers
      float edge = max(abs(vLocal.x), abs(vLocal.z));
      col += vData.z * vTint * smoothstep(0.475, 0.5, edge) * 0.9 * (0.3 + 0.7 * vLocal.y);
      col += smoothstep(0.985, 1.0, vLocal.y) * vData.z * vTint * 1.4;
    } else {
      col = base * 1.3;
    }
    gl_FragColor = vec4(applyFog(col, vWorld), 1.0);
  }
`;

const GROUND_VS = /* glsl */ `
  varying vec3 vWorld;
  void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }
`;

const GROUND_FS = /* glsl */ `
  uniform vec4 uPools[6]; uniform vec3 uPoolCol[6];
  ${FOG}
  varying vec3 vWorld;
  void main() {
    vec2 p = vWorld.xz;
    vec2 g = abs(fract(p / 7.0 - 0.5) - 0.5) * 7.0;
    float line = 1.0 - smoothstep(0.0, 0.09, min(g.x, g.y));
    vec3 col = vec3(0.003, 0.003, 0.0035) + line * vec3(0.016, 0.016, 0.019);
    for (int i = 0; i < 6; i++) {
      float d = length(p - uPools[i].xz);
      col += uPoolCol[i] * 0.07 * exp(-d * d / (uPools[i].w * uPools[i].w));
    }
    gl_FragColor = vec4(applyFog(col, vWorld), 1.0);
  }
`;

const ROAD_VS = /* glsl */ `
  varying vec2 vUv; varying vec3 vWorld;
  void main() { vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }
`;

const ROAD_FS = /* glsl */ `
  uniform float uTime; uniform vec3 uColor;
  ${FOG}
  varying vec2 vUv; varying vec3 vWorld;
  void main() {
    float across = abs(vUv.y - 0.5) * 2.0;
    float core = exp(-across * across * 18.0);
    float dash = step(0.55, fract(vUv.x / 3.0 - uTime * 0.6));
    vec3 col = uColor * (core * 0.55 + dash * core * 0.5) + uColor * 0.05 * (1.0 - across);
    float fade = 1.0 - smoothstep(uFogNear, uFogFar, length(vWorld - uCam));
    gl_FragColor = vec4(col * fade, 1.0);
  }
`;

const BEAM_VS = /* glsl */ `
  varying vec2 vUv; varying float vFacing;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = abs(dot(normalize(normalMatrix * normal), normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
  }
`;

const BEAM_FS = /* glsl */ `
  uniform vec3 uColor; uniform float uTime; uniform float uPhase; uniform float uStrength;
  varying vec2 vUv; varying float vFacing;
  void main() {
    float a = pow(vFacing, 3.0) * pow(1.0 - vUv.y, 2.2) * (0.55 + 0.45 * sin(uTime * 1.3 + uPhase)) * uStrength;
    gl_FragColor = vec4(uColor * a, 1.0);
  }
`;

const SKY_VS = /* glsl */ `
  varying vec3 vDir;
  void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const SKY_FS = /* glsl */ `
  uniform vec3 uHorizon; uniform vec3 uGlow;
  varying vec3 vDir;
  void main() {
    float h = max(vDir.y, 0.0);
    vec3 col = mix(uHorizon, vec3(0.002, 0.002, 0.003), smoothstep(0.0, 0.45, h));
    col += uGlow * smoothstep(0.0, 0.12, h) * exp(-h * 5.0) * max(0.0, -vDir.z * 0.5 + 0.5);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function CityScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useApp();
  const loadedRef = useRef(isLoaded);

  useEffect(() => {
    loadedRef.current = isLoaded;
  }, [isLoaded]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js');
      const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js');
      const { UnrealBloomPass } = await import('three/addons/postprocessing/UnrealBloomPass.js');
      const { OutputPass } = await import('three/addons/postprocessing/OutputPass.js');
      const mount = mountRef.current;
      const labelsEl = labelsRef.current;
      if (disposed || !mount || !labelsEl) return;

      const mobile = window.matchMedia('(max-width: 768px)').matches;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: 'high-performance' });
      } catch {
        return; // no WebGL: the page still works over the plain background
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5));
      renderer.setClearColor(0x050505, 1);
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.display = 'block';

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 1400);
      const fogColor = new THREE.Color('#070605');
      const accentHex = () => document.documentElement.style.getPropertyValue('--theme-accent').trim() || '#ff5b1f';
      const accent = new THREE.Color(accentHex());

      const shared = {
        uTime: { value: 0 },
        uFog: { value: fogColor },
        uCam: { value: new THREE.Vector3() },
        uFogNear: { value: 70 },
        uFogFar: { value: 340 },
      };

      /* sky + stars */
      const sky = new THREE.Mesh(
        new THREE.SphereGeometry(900, 32, 16),
        new THREE.ShaderMaterial({
          vertexShader: SKY_VS,
          fragmentShader: SKY_FS,
          side: THREE.BackSide,
          depthWrite: false,
          uniforms: { uHorizon: { value: fogColor }, uGlow: { value: accent.clone().multiplyScalar(0.012) } },
        }),
      );
      scene.add(sky);

      const starCount = mobile ? 700 : 1600;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(1 - Math.random() * 0.9);
        const r = 700;
        starPos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 1.3, sizeAttenuation: false, transparent: true, opacity: 0.7, depthWrite: false }),
      );
      scene.add(stars);

      /* ground */
      const pools = DISTRICTS.map((d) => new THREE.Vector4(d.x, 0, d.z, d.r * 1.9));
      const poolCols = DISTRICTS.map((d) => new THREE.Color(d.tint));
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(4000, 4000),
        new THREE.ShaderMaterial({
          vertexShader: GROUND_VS,
          fragmentShader: GROUND_FS,
          uniforms: { ...shared, uPools: { value: pools }, uPoolCol: { value: poolCols } },
        }),
      );
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);

      /* buildings */
      interface B {
        x: number;
        z: number;
        w: number;
        d: number;
        h: number;
        tint: string;
        density: number;
        accent: number;
      }
      const blds: B[] = [];
      const peak: Record<string, number> = {};
      for (const d of DISTRICTS) {
        const spots: [number, number][] = [];
        const step = 3.3;
        for (let gx = -d.r; gx <= d.r; gx += step)
          for (let gz = -d.r; gz <= d.r; gz += step) if (Math.hypot(gx, gz) <= d.r) spots.push([gx, gz]);
        spots.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));
        let top = 0;
        spots.slice(0, d.n + 6).forEach(([gx, gz], i) => {
          const centrality = 1 - Math.hypot(gx, gz) / (d.r + 1);
          let h = d.hMin + (d.hMax - d.hMin) * centrality * (0.65 + Math.random() * 0.45);
          if (i === 0 && d.accent) h = 58;
          const jitter = d.grid ? 0 : 0.5;
          blds.push({
            x: d.x + gx + (Math.random() - 0.5) * jitter,
            z: d.z + gz + (Math.random() - 0.5) * jitter,
            w: d.grid ? 2.6 : 2 + Math.random() * 1.2,
            d: d.grid ? 2.6 : 2 + Math.random() * 1.2,
            h,
            tint: d.tint,
            density: d.density,
            accent: i < (d.accent ? 3 : 1) ? 1 : 0,
          });
          top = Math.max(top, h);
        });
        peak[d.id] = top;
      }
      const span = mobile ? 90 : 140;
      for (let gx = -span; gx <= span; gx += 7)
        for (let gz = -span; gz <= span; gz += 7) {
          if (DISTRICTS.some((d) => Math.hypot(gx - d.x, gz - d.z) < d.r + 6)) continue;
          if (Math.random() < 0.38) continue;
          const dist = Math.hypot(gx, gz + 10);
          const h = 2 + Math.random() * Math.max(2, 16 * (1 - dist / 180));
          const fp = 3 + Math.random() * 2.2;
          blds.push({ x: gx, z: gz, w: fp, d: 3 + Math.random() * 2.2, h, tint: '#f2e6d0', density: 0.1 + Math.random() * 0.1, accent: 0 });
        }

      const boxGeo = new THREE.BoxGeometry(1, 1, 1);
      boxGeo.translate(0, 0.5, 0);
      const data = new Float32Array(blds.length * 3);
      blds.forEach((b, i) => data.set([b.density, Math.random(), b.accent], i * 3));
      boxGeo.setAttribute('aData', new THREE.InstancedBufferAttribute(data, 3));
      const bMat = new THREE.ShaderMaterial({ vertexShader: BUILDING_VS, fragmentShader: BUILDING_FS, uniforms: { ...shared } });
      const buildings = new THREE.InstancedMesh(boxGeo, bMat, blds.length);
      const m4 = new THREE.Matrix4();
      const col = new THREE.Color();
      blds.forEach((b, i) => {
        m4.makeScale(b.w, b.h, b.d);
        m4.setPosition(b.x, 0, b.z);
        buildings.setMatrixAt(i, m4);
        buildings.setColorAt(i, col.set(b.tint));
      });
      buildings.instanceMatrix.needsUpdate = true;
      if (buildings.instanceColor) buildings.instanceColor.needsUpdate = true;
      scene.add(buildings);

      /* beacon on the Carelon tower */
      const carelon = DISTRICTS[0];
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 16, 12),
        new THREE.MeshBasicMaterial({ color: accent.clone().multiplyScalar(4) }),
      );
      beacon.position.set(blds[0].x, 59.2, blds[0].z);
      scene.add(beacon);

      /* light beams */
      DISTRICTS.filter((d) => d.id !== 'nit').map((d, i) => {
        const big = d.accent;
        const mat = new THREE.ShaderMaterial({
          vertexShader: BEAM_VS,
          fragmentShader: BEAM_FS,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          uniforms: {
            uColor: { value: new THREE.Color(d.tint) },
            uTime: shared.uTime,
            uPhase: { value: i * 1.7 },
            uStrength: { value: big ? 0.34 : 0.14 },
          },
        });
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(big ? 1.6 : 0.9, big ? 1.6 : 0.9, 260, 24, 1, true), mat);
        beam.position.set(d.x, peak[d.id] + 130, d.z);
        scene.add(beam);
      });

      /* roads */
      const byId = Object.fromEntries(DISTRICTS.map((d) => [d.id, d]));
      const roadCurves = ROADS.map(([a, b, bend]) => {
        const A = byId[a];
        const Bd = byId[b];
        const mid = new THREE.Vector3((A.x + Bd.x) / 2, 0, (A.z + Bd.z) / 2);
        const dir = new THREE.Vector3(Bd.x - A.x, 0, Bd.z - A.z).normalize();
        mid.add(new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(bend));
        return new THREE.QuadraticBezierCurve3(new THREE.Vector3(A.x, 0.06, A.z), mid.setY(0.06), new THREE.Vector3(Bd.x, 0.06, Bd.z));
      });
      const roadMat = new THREE.ShaderMaterial({
        vertexShader: ROAD_VS,
        fragmentShader: ROAD_FS,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { ...shared, uColor: { value: new THREE.Color('#ffb48a') } },
      });
      for (const c of roadCurves) {
        const N = 90;
        const len = c.getLength();
        const pos: number[] = [];
        const uv: number[] = [];
        const idx: number[] = [];
        for (let i = 0; i <= N; i++) {
          const t = i / N;
          const p = c.getPoint(t);
          const tan = c.getTangent(t);
          const side = new THREE.Vector3(-tan.z, 0, tan.x).multiplyScalar(0.7);
          pos.push(p.x + side.x, 0.06, p.z + side.z, p.x - side.x, 0.06, p.z - side.z);
          uv.push(t * len, 0, t * len, 1);
          if (i < N) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
        g.setIndex(idx);
        scene.add(new THREE.Mesh(g, roadMat));
      }

      /* traffic */
      const TRAIL = 6;
      const MAXP = mobile ? 70 : 150;
      const pGeo = new THREE.SphereGeometry(0.3, 8, 6);
      const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pMesh = new THREE.InstancedMesh(pGeo, pMat, MAXP * TRAIL);
      pMesh.frustumCulled = false;
      scene.add(pMesh);
      interface Pk {
        road: number;
        t: number;
        speed: number;
        dir: 1 | -1;
        color: InstanceType<typeof THREE.Color>;
        mine: boolean;
      }
      const packets: Pk[] = [];
      const lens = roadCurves.map((c) => c.getLength());
      const palette = DISTRICTS.map((d) => new THREE.Color(d.tint));
      const newPacket = (mine = false, road?: number): Pk => {
        const r = road ?? Math.floor(Math.random() * roadCurves.length);
        return {
          road: r,
          t: 0,
          speed: (mine ? 34 : 14 + Math.random() * 14) / lens[r],
          dir: Math.random() < 0.5 ? 1 : -1,
          color: mine
            ? accent.clone().multiplyScalar(3.2)
            : (Math.random() < 0.6 ? new THREE.Color('#fff1e0') : palette[Math.floor(Math.random() * palette.length)].clone()).multiplyScalar(1.6),
          mine,
        };
      };
      for (let i = 0; i < MAXP * 0.75; i++) {
        const p = newPacket();
        p.t = Math.random();
        packets.push(p);
      }
      const carelonRoads = ROADS.map((r, i) => (r[0] === 'carelon' ? i : -1)).filter((i) => i >= 0);
      const burst = () => {
        for (let i = 0; i < 28; i++) {
          const p = newPacket(true, carelonRoads[i % carelonRoads.length]);
          p.dir = 1;
          p.t = -i * 0.012;
          if (packets.length >= MAXP) packets.shift();
          packets.push(p);
        }
      };

      /* labels */
      labelsEl.innerHTML = '';
      const labels = DISTRICTS.map((d) => {
        const el = document.createElement('div');
        el.className = 'city-label';
        el.innerHTML = `<div class="city-label__name"><span style="background:${d.tint}"></span>${d.label}</div><div class="city-label__sub">${d.sub}</div><div class="city-label__stem" style="background:linear-gradient(${d.tint},transparent)"></div>`;
        labelsEl.appendChild(el);
        return { el, anchor: new THREE.Vector3(d.x, peak[d.id] + 6, d.z) };
      });

      /* post */
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), mobile ? 0.6 : 0.75, 0.45, 0.55);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());

      /* sizing + view offset (pushes the subject right when text sits on the left) */
      let W = 0;
      let H = 0;
      const resize = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        renderer.setSize(W, H);
        composer.setSize(W, H);
        bloom.resolution.set(W / 2, H / 2);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener('resize', resize);

      /* scroll → camera path */
      let anchors: number[] = [];
      const measure = () => {
        anchors = SHOTS.map((s) => {
          const el = document.querySelector<HTMLElement>(s.sel);
          if (!el) return 0;
          const top = el.getBoundingClientRect().top + window.scrollY;
          return Math.max(0, top + s.f * el.offsetHeight - window.innerHeight * 0.25);
        });
        anchors[0] = 0;
        for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(document.body);

      const v3 = (a: [number, number, number]) => new THREE.Vector3(...a);
      const shotPos = SHOTS.map((s) => v3(s.pos));
      const shotTgt = SHOTS.map((s) => v3(s.tgt));
      const desiredPos = new THREE.Vector3();
      const desiredTgt = new THREE.Vector3();
      const curTgt = shotTgt[0].clone();
      camera.position.copy(shotPos[0]).add(new THREE.Vector3(0, 40, 60));
      const ease = (t: number) => t * t * (3 - 2 * t);
      const shotAt = (y: number) => {
        let i = 0;
        while (i < anchors.length - 1 && y >= anchors[i + 1]) i++;
        if (i >= anchors.length - 1) {
          desiredPos.copy(shotPos[anchors.length - 1]);
          desiredTgt.copy(shotTgt[anchors.length - 1]);
          return;
        }
        const t = ease(Math.min(1, Math.max(0, (y - anchors[i]) / (anchors[i + 1] - anchors[i]))));
        desiredPos.lerpVectors(shotPos[i], shotPos[i + 1], t);
        desiredTgt.lerpVectors(shotTgt[i], shotTgt[i + 1], t);
      };

      /* input */
      const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
      const onMove = (e: PointerEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      const onDown = (e: PointerEvent) => {
        if (window.scrollY > window.innerHeight * 0.7) return;
        if ((e.target as HTMLElement).closest('a,button,input,textarea,[role="dialog"]')) return;
        burst();
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerdown', onDown);

      /* loop */
      let lastT = performance.now();
      const t0 = lastT;
      const proj = new THREE.Vector3();
      let raf = 0;
      let intro = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (document.hidden) return;
        const nowT = performance.now();
        const dt = Math.min(0.05, (nowT - lastT) / 1000);
        lastT = nowT;
        const time = (nowT - t0) / 1000;
        shared.uTime.value = reduced ? 0 : time;

        const a = accentHex();
        if (a !== `#${accent.getHexString()}`) {
          accent.set(a);
          beacon.material.color.copy(accent).multiplyScalar(4);
        }

        // camera
        const y = window.scrollY;
        shotAt(y);
        const inHero = y < window.innerHeight * 0.8;
        mouse.sx += (mouse.x - mouse.sx) * Math.min(1, dt * 3);
        mouse.sy += (mouse.y - mouse.sy) * Math.min(1, dt * 3);
        const par = inHero ? 1 : 0.35;
        desiredPos.x += mouse.sx * 10 * par;
        desiredPos.y += -mouse.sy * 5 * par;
        if (loadedRef.current) intro = Math.min(1, intro + dt * 0.5);
        const k = 1 - Math.exp(-dt * (reduced ? 50 : 2.4 * (0.4 + intro)));
        camera.position.lerp(desiredPos, k);
        curTgt.lerp(desiredTgt, k);
        camera.lookAt(curTgt);
        shared.uCam.value.copy(camera.position);
        sky.position.copy(camera.position);
        stars.position.copy(camera.position);

        // shift the frame right once the reading columns start (desktop only)
        const scrim = Math.min(1, Math.max(0, (y - window.innerHeight * 0.5) / (window.innerHeight * 0.5)));
        if (!mobile) camera.setViewOffset(W, H, -W * 0.16 * scrim, 0, W, H);
        else camera.clearViewOffset();
        if (scrimRef.current) scrimRef.current.style.opacity = String(scrim);

        // beacon
        (beacon.material as InstanceType<typeof THREE.MeshBasicMaterial>).color
          .copy(accent)
          .multiplyScalar(reduced ? 3 : 1.5 + 3.5 * (0.5 + 0.5 * Math.sin(time * 3)));
        
        // traffic
        if (!reduced) {
          for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            p.t += p.speed * dt;
            if (p.t > 1) {
              if (p.mine) packets.splice(i, 1);
              else packets[i] = newPacket();
            }
          }
          while (packets.length < MAXP * 0.75) packets.push(newPacket());
        }
        let n = 0;
        const tmp = new THREE.Vector3();
        for (const p of packets) {
          for (let k2 = 0; k2 < TRAIL; k2++) {
            const tt = p.t - k2 * 0.011 * (p.mine ? 0.6 : 1);
            if (tt < 0 || tt > 1) continue;
            roadCurves[p.road].getPoint(p.dir === 1 ? tt : 1 - tt, tmp);
            const s = (1 - k2 / TRAIL) * (p.mine ? 1.25 : 1);
            m4.makeScale(s, s, s);
            m4.setPosition(tmp.x, 0.55, tmp.z);
            pMesh.setMatrixAt(n, m4);
            pMesh.setColorAt(n, col.copy(p.color).multiplyScalar(1 - k2 / TRAIL));
            n++;
          }
        }
        pMesh.count = n;
        pMesh.instanceMatrix.needsUpdate = true;
        if (pMesh.instanceColor) pMesh.instanceColor.needsUpdate = true;

        composer.render();

        // labels
        const labelAlpha = 1 - scrim * 0.55;
        for (const l of labels) {
          proj.copy(l.anchor).project(camera);
          const dist = camera.position.distanceTo(l.anchor);
          const vis = proj.z < 1 && Math.abs(proj.x) < 1.05 && Math.abs(proj.y) < 1.05;
          const fade = Math.max(0, Math.min(1, (185 - dist) / 55)) * labelAlpha * intro;
          if (!vis || fade <= 0.01) {
            l.el.style.opacity = '0';
            continue;
          }
          const sx = (proj.x * 0.5 + 0.5) * W;
          const sy = (-proj.y * 0.5 + 0.5) * H;
          const clearX = mobile ? 1 : Math.min(1, Math.max(0, (sx - W * 0.42) / (W * 0.12)));
          const clearY = scrim > 0.2 ? 1 : Math.min(1, Math.max(0, (H * 0.52 - sy) / (H * 0.08)));
          const clear = clearX * clearY;
          l.el.style.opacity = String(fade * clear);
          l.el.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -100%)`;
        }
      };
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerdown', onDown);
        ro.disconnect();
        scene.traverse((o) => {
          const m = o as unknown as { geometry?: { dispose(): void }; material?: { dispose(): void } };
          m.geometry?.dispose();
          m.material?.dispose();
        });
        composer.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
      if (disposed) cleanup();
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div ref={mountRef} className="absolute inset-0" />
      {/* readability scrim for the reading columns */}
      <div
        ref={scrimRef}
        className="city-scrim absolute inset-0 opacity-0"
      />
      <div ref={labelsRef} className="absolute inset-0 overflow-hidden" />
    </div>
  );
}
