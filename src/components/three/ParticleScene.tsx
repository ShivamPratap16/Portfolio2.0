'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppProvider';

/* ─── Shapes ─────────────────────────────────────────────────────────────
   Every shape is N points. Particles keep their index across shapes, so a
   morph is just a per-particle lerp (with stagger + swirl) on the GPU.     */

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

const rnd = (a = 1) => (Math.random() - 0.5) * 2 * a;

function fromCanvas(draw: Draw, n: number, worldW: number, depth: number, cw = 1024, ch = 1024) {
  const c = document.createElement('canvas');
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  draw(ctx, cw, ch);
  const img = ctx.getImageData(0, 0, cw, ch).data;
  const px: number[] = [];
  let minX = cw, maxX = 0, minY = ch, maxY = 0;
  for (let y = 0; y < ch; y += 2)
    for (let x = 0; x < cw; x += 2)
      if (img[(y * cw + x) * 4 + 3] > 140) {
        px.push(x, y);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  const out = new Float32Array(n * 3);
  if (!px.length) return out;
  const s = worldW / Math.max(1, maxX - minX);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * (px.length / 2)) * 2;
    out[i * 3] = (px[k] - cx) * s + rnd(s * 1.2);
    out[i * 3 + 1] = -(px[k + 1] - cy) * s + rnd(s * 1.2);
    out[i * 3 + 2] = rnd(depth);
  }
  return out;
}

function text(str: string, family: string, n: number, worldW: number) {
  return fromCanvas(
    (ctx, w, h) => {
      ctx.font = `700 ${Math.round(h * 0.72)}px ${family}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(str, w / 2, h / 2);
    },
    n,
    worldW,
    0.8,
    1400,
    330,
  );
}

function planet(n: number) {
  const out = new Float32Array(n * 3);
  const tilt = 0.42;
  for (let i = 0; i < n; i++) {
    let x: number, y: number, z: number;
    if (i < n * 0.66) {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / (n * 0.66));
      const th = Math.PI * (1 + Math.sqrt(5)) * k;
      const r = 8.2 + rnd(0.15);
      x = r * Math.sin(phi) * Math.cos(th);
      y = r * Math.cos(phi);
      z = r * Math.sin(phi) * Math.sin(th);
    } else {
      const a = Math.random() * Math.PI * 2;
      const r = 10.5 + Math.pow(Math.random(), 0.7) * 4.5;
      x = Math.cos(a) * r;
      y = rnd(0.12);
      z = Math.sin(a) * r;
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
      z = y * Math.sin(tilt) + z * Math.cos(tilt);
      y = y2;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function rack(n: number) {
  const out = new Float32Array(n * 3);
  const W = 15, Hs = 2.8, D = 8, gap = 1.2, units = 5;
  const total = units * Hs + (units - 1) * gap;
  for (let i = 0; i < n; i++) {
    const u = Math.floor(Math.random() * units);
    const y0 = -total / 2 + u * (Hs + gap);
    let x: number, y: number, z: number;
    const r = Math.random();
    if (r < 0.5) {
      // edges
      const e = Math.floor(Math.random() * 12);
      const t = Math.random();
      const sx = e & 1 ? 1 : -1;
      const sy = e & 2 ? 1 : -1;
      if (e < 4) [x, y, z] = [(t - 0.5) * W, y0 + (sy > 0 ? Hs : 0), (sx * D) / 2];
      else if (e < 8) [x, y, z] = [(sx * W) / 2, y0 + t * Hs, ((e & 4 ? 1 : -1) * D) / 2];
      else [x, y, z] = [(sx * W) / 2, y0 + (sy > 0 ? Hs : 0), (t - 0.5) * D];
    } else if (r < 0.8) {
      // front panel with a row of LEDs + vents
      const led = Math.random() < 0.35;
      x = led ? -W / 2 + 1.2 + Math.floor(Math.random() * 6) * 0.7 : (Math.random() - 0.5) * W;
      y = led ? y0 + Hs * 0.5 : y0 + Math.random() * Hs;
      z = D / 2;
    } else {
      x = (Math.random() - 0.5) * W;
      y = y0 + (Math.random() < 0.5 ? 0 : Hs);
      z = (Math.random() - 0.5) * D;
    }
    out.set([x + rnd(0.04), y + rnd(0.04), z + rnd(0.04)], i * 3);
  }
  return out;
}

function helix(n: number) {
  const out = new Float32Array(n * 3);
  const Hh = 26, R = 5.5, turns = 2.6;
  for (let i = 0; i < n; i++) {
    let x: number, y: number, z: number;
    if (Math.random() < 0.72) {
      const t = Math.random();
      const a = t * turns * Math.PI * 2 + (Math.random() < 0.5 ? 0 : Math.PI);
      x = Math.cos(a) * R + rnd(0.25);
      y = (t - 0.5) * Hh;
      z = Math.sin(a) * R + rnd(0.25);
    } else {
      const k = Math.floor(Math.random() * 30) / 30;
      const a = k * turns * Math.PI * 2;
      const s = Math.random() * 2 - 1;
      x = Math.cos(a) * R * s;
      y = (k - 0.5) * Hh;
      z = Math.sin(a) * R * s;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function galaxy(n: number) {
  const out = new Float32Array(n * 3);
  const tilt = 1.05;
  for (let i = 0; i < n; i++) {
    const r = Math.pow(Math.random(), 0.6) * 19;
    const arm = Math.floor(Math.random() * 3);
    const a = arm * ((Math.PI * 2) / 3) + r * 0.42 + rnd(0.35 + 0.25 / (r + 1));
    let x = Math.cos(a) * r + rnd(0.5);
    let y = rnd(0.9 * Math.exp(-r / 6));
    let z = Math.sin(a) * r + rnd(0.5);
    const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
    z = y * Math.sin(tilt) + z * Math.cos(tilt);
    y = y2;
    out.set([x, y, z], i * 3);
  }
  return out;
}

const phone: Draw = (ctx, w, h) => {
  const cx = w / 2 - 80, cy = h / 2;
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.roundRect(cx - 150, cy - 300, 300, 600, 52);
  ctx.stroke();
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(cx - 40, cy - 258);
  ctx.lineTo(cx + 40, cy - 258);
  ctx.stroke();
  // chat bubbles on screen
  ctx.beginPath();
  ctx.roundRect(cx - 105, cy - 180, 150, 46, 18);
  ctx.roundRect(cx - 40, cy - 110, 145, 46, 18);
  ctx.roundRect(cx - 105, cy - 40, 120, 46, 18);
  ctx.fill();
  // call waves
  ctx.lineWidth = 16;
  for (const r of [70, 125, 180]) {
    ctx.beginPath();
    ctx.arc(cx + 170, cy + 130, r, -0.75, 0.75);
    ctx.stroke();
  }
};

const cap: Draw = (ctx, w, h) => {
  const cx = w / 2, cy = h / 2 - 40;
  ctx.beginPath();
  ctx.moveTo(cx - 400, cy);
  ctx.lineTo(cx, cy - 170);
  ctx.lineTo(cx + 400, cy);
  ctx.lineTo(cx, cy + 170);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 230, cy + 90);
  ctx.lineTo(cx - 230, cy + 260);
  ctx.quadraticCurveTo(cx, cy + 340, cx + 230, cy + 260);
  ctx.lineTo(cx + 230, cy + 90);
  ctx.lineTo(cx, cy + 180);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 330, cy + 40);
  ctx.lineTo(cx + 330, cy + 250);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 330, cy + 270, 26, 0, Math.PI * 2);
  ctx.fill();
};

/** Draw a 1024×1024-designed shape onto a smaller canvas. */
const scaled =
  (d: Draw): Draw =>
  (ctx, w, h) => {
    ctx.scale(w / 1024, h / 1024);
    d(ctx, 1024, 1024);
  };

/** Section anchors → shape index. */
const STOPS: { sel: string; f: number }[] = [
  { sel: '#top', f: 0 },
  { sel: '#about', f: 0.05 },
  { sel: '#experience', f: 0.1 },
  { sel: '#projects', f: 0.06 },
  { sel: '#projects', f: 0.4 },
  { sel: '#projects', f: 0.72 },
  { sel: '#skills', f: 0.1 },
  { sel: '#contact', f: 0.15 },
];
const SPIN = [0, 1, 0.6, 0, 0, 0, 1, 0.5];
/** How bright each stop is (dimmer where long text sits over the particles). */
const DIM = [1, 0.7, 0.38, 1, 1, 1, 0.75, 0.8];
const GALAXY = 7;

/* ─── Shaders ───────────────────────────────────────────────────────────── */

const VS = /* glsl */ `
  uniform sampler2D uShapes;
  uniform float uRows, uFrom, uTo, uMix, uTime, uSpinFrom, uSpinTo, uScaleFrom, uScaleTo, uSize, uPixel, uSwirl;
  uniform vec3 uOffFrom, uOffTo, uMouse, uAccent;
  uniform float uMouseStr;
  uniform float uDim;
  attribute float aIndex;
  attribute vec4 aRand;
  varying vec3 vColor;
  varying float vAlpha;

  vec3 fetchShape(float s) {
    float i = aIndex;
    ivec2 uv = ivec2(int(mod(i, 256.0)), int(floor(i / 256.0) + s * uRows));
    return texelFetch(uShapes, uv, 0).xyz;
  }
  vec2 rot(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }

  void main() {
    vec3 a = fetchShape(uFrom) * uScaleFrom;
    vec3 b = fetchShape(uTo) * uScaleTo;
    a.xz = rot(a.xz, uTime * 0.16 * uSpinFrom);
    b.xz = rot(b.xz, uTime * 0.16 * uSpinTo);
    a += uOffFrom;
    b += uOffTo;

    float m = clamp((uMix - aRand.x * 0.4) / 0.6, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(a, b, m);

    float bump = sin(m * 3.14159);
    float ph = aRand.w * 6.2831;
    vec3 swirl = vec3(sin(ph + p.y * 0.25 + uTime * 0.6), cos(ph * 1.3 + p.x * 0.25 + uTime * 0.5), sin(ph * 0.7 + uTime * 0.4));
    p += swirl * bump * uSwirl;
    p += 0.09 * vec3(sin(uTime * 1.2 + ph * 3.0), cos(uTime * 1.0 + ph * 5.0), sin(uTime * 0.8 + ph * 7.0));

    vec2 d = p.xy - uMouse.xy;
    float f = (1.0 - smoothstep(0.0, 5.5, length(d))) * uMouseStr;
    p.xy += normalize(d + 1e-4) * f * 2.6;
    p.z += f * 3.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float sparkle = step(0.985, aRand.y) * 2.2;
    gl_PointSize = uSize * (0.5 + aRand.y * 0.75 + sparkle * 1.8) * uPixel * (60.0 / -mv.z);
    vColor = mix(vec3(1.0, 0.92, 0.84), uAccent, aRand.z);
    vAlpha = (0.35 + 0.65 * aRand.y) * (1.0 + f * 1.6) * uDim;
  }
`;

const FS = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float core = exp(-d * d * 14.0);
    float halo = exp(-d * d * 2.5) * 0.12;
    float a = (core + halo) * (1.0 - smoothstep(0.85, 1.0, d));
    gl_FragColor = vec4(vColor * a * vAlpha, 1.0);
    #include <colorspace_fragment>
  }
`;

const yieldToMain = () =>
  new Promise<void>((r) =>
    'requestIdleCallback' in window ? requestIdleCallback(() => r(), { timeout: 300 }) : setTimeout(r, 16),
  );

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function ParticleScene() {
  const mountRef = useRef<HTMLDivElement>(null);
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
      const THREE = await import('./three-lite');
      await document.fonts?.ready;
      const mount = mountRef.current;
      if (disposed || !mount) return;

      const mobile = window.matchMedia('(max-width: 768px)').matches;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const N = mobile ? 12000 : 26000;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x050505, 1);
      renderer.domElement.style.display = 'block';
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 400);
      camera.position.set(0, 0, 60);

      /* build shapes */
      const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
      const builders: (() => Float32Array)[] = [
        () => text('SHIVAM', family, N, 40),
        () => planet(N),
        () => rack(N),
        () => fromCanvas(scaled(phone), N, 17, 1.2, 640, 640),
        () => fromCanvas(scaled(cap), N, 22, 1.2, 640, 640),
        () => text('Σ=0', family, N, 24),
        () => helix(N),
        () => galaxy(N),
      ];
      const shapes = builders;
      const rows = Math.ceil(N / 256);
      const tex = new Float32Array(256 * rows * builders.length * 4);
      const dataTex = new THREE.DataTexture(tex, 256, rows * builders.length, THREE.RGBAFormat, THREE.FloatType);
      const fill = (si: number) => {
        const s = builders[si]();
        for (let i = 0; i < N; i++) {
          const o = (si * rows * 256 + i) * 4;
          tex[o] = s[i * 3];
          tex[o + 1] = s[i * 3 + 1];
          tex[o + 2] = s[i * 3 + 2];
          tex[o + 3] = 1;
        }
        dataTex.needsUpdate = true;
      };
      // the intro needs the galaxy and the name; everything else can wait
      fill(GALAXY);
      await yieldToMain();
      fill(0);
      if (disposed) return;

      const geo = new THREE.BufferGeometry();
      const idx = new Float32Array(N);
      const rand = new Float32Array(N * 4);
      for (let i = 0; i < N; i++) {
        idx[i] = i;
        rand.set([Math.random(), Math.random(), Math.random() < 0.14 ? 0.85 + Math.random() * 0.15 : Math.random() * 0.12, Math.random()], i * 4);
      }
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
      geo.setAttribute('aIndex', new THREE.BufferAttribute(idx, 1));
      geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 4));

      const accentHex = () => document.documentElement.style.getPropertyValue('--theme-accent').trim() || '#ff5b1f';
      const accent = new THREE.Color(accentHex());
      const u = {
        uShapes: { value: dataTex },
        uRows: { value: rows },
        uFrom: { value: GALAXY },
        uTo: { value: 0 },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uSpinFrom: { value: SPIN[GALAXY] },
        uSpinTo: { value: 0 },
        uScaleFrom: { value: 1 },
        uScaleTo: { value: 1 },
        uOffFrom: { value: new THREE.Vector3() },
        uOffTo: { value: new THREE.Vector3() },
        uMouse: { value: new THREE.Vector3(999, 999, 0) },
        uMouseStr: { value: 0 },
        uAccent: { value: accent },
        uSize: { value: mobile ? 1.6 : 1.5 },
        uPixel: { value: renderer.getPixelRatio() },
        uSwirl: { value: reduced ? 0 : 5.5 },
        uDim: { value: 1 },
      };
      const points = new THREE.Points(
        geo,
        new THREE.ShaderMaterial({
          vertexShader: VS,
          fragmentShader: FS,
          uniforms: u,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      points.frustumCulled = false;
      scene.add(points);


      /* layout: where each shape sits, how big */
      let W = 0, H = 0, visW = 40;
      const offs: InstanceType<typeof THREE.Vector3>[] = [];
      const scales: number[] = [];
      const resize = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        renderer.setSize(W, H);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        visW = visH * camera.aspect;
        const wide = camera.aspect > 1.1;
        for (let s = 0; s < shapes.length; s++) {
          if (s === 0) {
            scales[s] = Math.min(1, (visW * (wide ? 0.78 : 0.9)) / 40);
            offs[s] = new THREE.Vector3(0, wide ? visH * 0.08 : visH * 0.14, 0);
          } else if (wide) {
            scales[s] = Math.min(1, (visH * 0.66) / 26);
            offs[s] = new THREE.Vector3(visW * 0.27, 0, 0);
          } else {
            scales[s] = Math.min(0.85, (visW * 0.85) / 26);
            offs[s] = new THREE.Vector3(0, visH * 0.12, -8);
          }
        }
      };
      resize();
      window.addEventListener('resize', resize);

      let anchors: number[] = [];
      const measure = () => {
        anchors = STOPS.map((s) => {
          const el = document.querySelector<HTMLElement>(s.sel);
          if (!el) return 0;
          const top = el.getBoundingClientRect().top + window.scrollY;
          return Math.max(0, top + s.f * el.offsetHeight - window.innerHeight * 0.45);
        });
        anchors[0] = 0;
        for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(document.body);

      const stageAt = (y: number) => {
        let i = 0;
        while (i < anchors.length - 1 && y >= anchors[i + 1]) i++;
        if (i >= anchors.length - 1) return anchors.length - 1;
        const t = Math.min(1, Math.max(0, (y - anchors[i]) / (anchors[i + 1] - anchors[i])));
        // hold the shape for most of the section, then morph
        const hold = i === 0 ? 0.08 : 0.5;
        const h = Math.min(1, Math.max(0, (t - hold) / (1 - hold)));
        return i + h * h * (3 - 2 * h);
      };

      /* mouse → world (z = 0 plane) */
      const ndc = new THREE.Vector2(9, 9);
      let lastMove = 0;
      const onMove = (e: PointerEvent) => {
        ndc.set((e.clientX / W) * 2 - 1, -(e.clientY / H) * 2 + 1);
        lastMove = performance.now();
      };
      window.addEventListener('pointermove', onMove);
      const ray = new THREE.Raycaster();
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const hit = new THREE.Vector3();

      let raf = 0;
      let last = performance.now();
      const t0 = last;
      let stage = 0;
      let intro = reduced ? 1 : 0;
      let mouseStr = 0;
      const look = new THREE.Vector2();

      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (document.hidden) return;
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        u.uTime.value = reduced ? 0 : (now - t0) / 1000;

        const a = accentHex();
        if (a !== `#${accent.getHexString()}`) accent.set(a);

        // scroll stage, smoothed
        const target = stageAt(window.scrollY);
        stage += (target - stage) * Math.min(1, dt * (reduced ? 30 : 3.2));

        if (loadedRef.current && intro < 1) intro = Math.min(1, intro + dt / 2.6);

        if (intro < 1) {
          u.uFrom.value = GALAXY;
          u.uTo.value = 0;
          u.uMix.value = intro;
          u.uOffFrom.value.set(0, 0, -20);
          u.uScaleFrom.value = 1.3;
          u.uSpinFrom.value = SPIN[GALAXY];
        } else {
          const from = Math.min(shapes.length - 1, Math.floor(stage + 1e-4));
          const to = Math.min(shapes.length - 1, from + 1);
          u.uFrom.value = from;
          u.uTo.value = to;
          u.uMix.value = from === to ? 0 : stage - from;
          u.uOffFrom.value.copy(offs[from]);
          u.uScaleFrom.value = scales[from];
          u.uSpinFrom.value = SPIN[from];
        }
        const fi = Math.min(DIM.length - 1, Math.floor(stage));
        const fr = stage - fi;
        u.uDim.value = intro < 1 ? 1 : DIM[fi] + (DIM[Math.min(DIM.length - 1, fi + 1)] - DIM[fi]) * fr;
        const to = u.uTo.value;
        u.uOffTo.value.copy(offs[to]);
        u.uScaleTo.value = scales[to];
        u.uSpinTo.value = SPIN[to];

        // mouse
        const active = now - lastMove < 1500;
        mouseStr += ((active ? 1 : 0) - mouseStr) * Math.min(1, dt * 3);
        u.uMouseStr.value = mouseStr;
        ray.setFromCamera(ndc, camera);
        if (ray.ray.intersectPlane(plane, hit)) u.uMouse.value.copy(hit);

        // gentle camera parallax
        look.x += ((active ? ndc.x : 0) - look.x) * Math.min(1, dt * 2);
        look.y += ((active ? ndc.y : 0) - look.y) * Math.min(1, dt * 2);
        camera.position.x = look.x * 2.2;
        camera.position.y = look.y * 1.4;
        camera.lookAt(0, 0, 0);

        const scrim = Math.min(1, Math.max(0, (window.scrollY - H * 0.5) / (H * 0.5)));
        if (scrimRef.current) scrimRef.current.style.opacity = String(scrim);

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(frame);

      // remaining shapes, one per idle slice so the main thread never stalls
      (async () => {
        for (let si = 1; si < builders.length; si++) {
          if (si === GALAXY) continue;
          await yieldToMain();
          if (disposed) return;
          fill(si);
        }
      })();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onMove);
        ro.disconnect();
        geo.dispose();
        (points.material as InstanceType<typeof THREE.ShaderMaterial>).dispose();
        dataTex.dispose();
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
      <div ref={scrimRef} className="city-scrim absolute inset-0 opacity-0" />
    </div>
  );
}
