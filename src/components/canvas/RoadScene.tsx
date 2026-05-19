"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface RoadSceneProps {
  progress: number;
  className?: string;
}

// ── Consalud palette ──────────────────────────────────────────────────────────
const C = {
  bg:       0x05123e,
  neonA:    0xff8d2b,
  neonB:    0x0546f2,
  neonC:    0xffa040,
  road:     0x020e2e,
  roadEmit: 0x0a1828,
  wire:     0x0a1a5c,
  mtnSolid: 0x020c30,
};

// Road path t-values for each of the 5 section stops
const STOP_TS = [0.04, 0.24, 0.50, 0.73, 0.92];

// Scroll band boundaries — Servicios (index 2) gets extra space for the service carousel
const BANDS = [0, 0.10, 0.22, 0.78, 0.88, 1.00];
// Fraction of each band spent orbiting before traveling to next stop
const ORBIT_FRAC = [0.72, 0.72, 0.08, 0.72, 1.00];

function getSec(s: number): [number, number] {
  const sc = Math.max(0, Math.min(0.9999, s));
  let sec = 0;
  for (let i = 1; i <= 4; i++) { if (sc >= BANDS[i]) sec = i; else break; }
  return [sec, (sc - BANDS[sec]) / (BANDS[sec + 1] - BANDS[sec])];
}

function getRoadT(scroll: number): number {
  const [sec, w] = getSec(scroll);
  const from = STOP_TS[sec];
  const to   = STOP_TS[Math.min(sec + 1, 4)];
  const of   = ORBIT_FRAC[sec];
  if (w < of) return from;
  const t = (w - of) / (1 - of);
  return from + (to - from) * t * t * (3 - 2 * t);
}

function getOrbitAlpha(scroll: number): number {
  const [sec, w] = getSec(scroll);
  const of = ORBIT_FRAC[sec];
  if (w >= of) return 0;
  if (w < 0.06) return w / 0.06;
  if (w < of - 0.06) return 1;
  return 1 - (w - (of - 0.06)) / 0.06;
}

function getCurrentSection(scroll: number): number {
  return getSec(scroll)[0];
}

// ── Terrain ───────────────────────────────────────────────────────────────────
function noise(x: number, z: number): number {
  return (
    Math.sin(x * 0.003  + 0.71) * Math.cos(z * 0.0025 + 1.30) * 38 +
    Math.sin(x * 0.0055 - 1.10) * Math.cos(z * 0.0048 + 2.40) * 20 +
    Math.sin(x * 0.011  + 2.30) * Math.cos(z * 0.0095 - 0.80) * 10 +
    Math.sin(x * 0.022  - 0.60) * Math.cos(z * 0.019  + 1.70) *  5 +
    Math.sin(x * 0.004  + z * 0.0035 + 1.1) * 18 +
    Math.cos(x * 0.003  - z * 0.005  - 0.6) * 13 +
    Math.sin(x * 0.018  + z * 0.012  + 2.2) * Math.cos(x * 0.009 - z * 0.014) * 7
  );
}

function profile(zn: number): number {
  if (zn < 0.25) return 65 + Math.sin(zn * 10) * 4;
  if (zn < 0.46) { const t = (zn - .25) / .21; const s = t * t * (3 - 2 * t); return 65 - s * 62; }
  if (zn < 0.56) return 3 + Math.sin(zn * 18) * 1.5;
  if (zn < 0.80) { const t = (zn - .56) / .24; const s = t * t * (3 - 2 * t); return 3 + s * 56; }
  return 59 + Math.sin(zn * 14) * 5;
}

function terrainH(x: number, z: number, zn = 0.5): number {
  return noise(x, z) * 0.55 + profile(zn);
}

export default function RoadScene({ progress, className }: RoadSceneProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);

  useEffect(() => { progressRef.current = progress; }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.background = null;
    renderer.setClearColor(0x010208, 1);

    const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.5, 3000);

    const TW = 1800, TD = 4000;
    const zWorldMin = -TD / 2;

    // ── Terrain ───────────────────────────────────────────────────────────────
    const terrainGeo = new THREE.PlaneGeometry(TW, TD, 120, 240);
    terrainGeo.rotateX(-Math.PI / 2);
    const tPos = terrainGeo.attributes.position;

    let minH = 1e9, maxH = -1e9;
    const hs = new Float32Array(tPos.count);
    for (let i = 0; i < tPos.count; i++) {
      const wx = tPos.getX(i), wz = tPos.getZ(i);
      const zn = 1 - (wz - zWorldMin) / TD;
      const y = terrainH(wx, wz, zn);
      tPos.setY(i, y); hs[i] = y;
      if (y < minH) minH = y;
      if (y > maxH) maxH = y;
    }
    terrainGeo.computeVertexNormals();

    const range = maxH - minH;
    const vc = new Float32Array(tPos.count * 3);
    for (let i = 0; i < tPos.count; i++) {
      const t = (hs[i] - minH) / range;
      let r, g, b;
      if      (t < .15) { r = .02; g = .05; b = .20; }
      else if (t < .35) { const s = (t-.15)/.20; r = .02+s*.02; g = .05+s*.04; b = .20+s*.10; }
      else if (t < .55) { const s = (t-.35)/.20; r = .03+s*.04; g = .07+s*.04; b = .28+s*.12; }
      else if (t < .75) { const s = (t-.55)/.20; r = .06+s*.08; g = .09+s*.04; b = .36+s*.12; }
      else if (t < .90) { const s = (t-.75)/.15; r = .12+s*.10; g = .11+s*.06; b = .44+s*.08; }
      else              { const s = (t-.90)/.10; r = .20+s*.30; g = .15+s*.25; b = .50+s*.18; }
      vc[i*3] = r; vc[i*3+1] = g; vc[i*3+2] = b;
    }
    terrainGeo.setAttribute("color", new THREE.BufferAttribute(vc, 3));
    const terrainMesh = new THREE.Mesh(terrainGeo,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .9, metalness: .04 }));
    terrainMesh.renderOrder = 0;
    scene.add(terrainMesh);

    // Neon wireframe grid
    const wGeo = new THREE.PlaneGeometry(TW, TD, 55, 110);
    wGeo.rotateX(-Math.PI / 2);
    const wPos = wGeo.attributes.position;
    for (let i = 0; i < wPos.count; i++) {
      const wz = wPos.getZ(i);
      wPos.setY(i, terrainH(wPos.getX(i), wz, 1 - (wz - zWorldMin) / TD) + 0.3);
    }
    wGeo.computeVertexNormals();
    scene.add(new THREE.Mesh(wGeo,
      new THREE.MeshBasicMaterial({ color: C.wire, wireframe: true, transparent: true, opacity: .14 })));

    // ── Mountains ─────────────────────────────────────────────────────────────
    for (let zi = 0; zi < 80; zi++) {
      const wz = zWorldMin + (zi / 80) * TD;
      const zn = 1 - (wz - zWorldMin) / TD;
      const baseH = profile(zn);
      for (const side of [-1, 1]) {
        for (let m = 0; m < Math.floor(2 + Math.random() * 3); m++) {
          const dist = 165 + Math.random() * 240;
          const wx   = side * dist + (Math.random() - .5) * 40;
          const ty   = terrainH(wx, wz, zn);
          const hMul = baseH > 10 ? 1.0 : 0.4;
          const h    = (20 + Math.random() * 60) * hMul;
          const w    = 14 + Math.random() * 32;
          const seg  = 5 + Math.floor(Math.random() * 5);
          const geo  = new THREE.ConeGeometry(w, h, seg);
          geo.rotateY(Math.random() * Math.PI * 2);

          const solid = new THREE.Mesh(geo,
            new THREE.MeshStandardMaterial({ color: C.mtnSolid, roughness: .95 }));
          solid.position.set(wx, ty + h / 2, wz);
          scene.add(solid);

          const wireColor = side === 1 ? C.neonA : C.neonB;
          const wire = new THREE.Mesh(geo,
            new THREE.MeshBasicMaterial({ color: wireColor, wireframe: true, transparent: true, opacity: .06 + Math.random() * .14 }));
          wire.position.set(wx, ty + h / 2, wz);
          scene.add(wire);

          if (h * hMul > 55) {
            const sg = new THREE.ConeGeometry(w * .25, h * .2, seg);
            sg.rotateY(Math.random() * Math.PI * 2);
            const snow = new THREE.Mesh(sg,
              new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent: true, opacity: .6 }));
            snow.position.set(wx, ty + h - .02, wz);
            scene.add(snow);
          }
        }
      }
    }

    // ── Road path ─────────────────────────────────────────────────────────────
    const PATH = (() => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < 300; i++) {
        const zn = i / 300;
        const wz = zWorldMin + (1 - zn) * TD * .92 + TD * .04;
        const amp = (zn > .24 && zn < .48) || (zn > .57 && zn < .82) ? 85 : 38;
        const cf = Math.min(1, Math.max(0, (zn - 0.02) / 0.13));
        const wx = cf * (
          Math.sin(zn * Math.PI * 2 * 6 + .30) * amp * .58 +
          Math.sin(zn * Math.PI * 2 * 10 + 1.7) * amp * .28 +
          Math.sin(zn * Math.PI * 2 * 3  - .80) * amp * .38
        );
        pts.push(new THREE.Vector3(wx, terrainH(wx, wz, zn) + 1.1, wz));
      }
      return new THREE.CatmullRomCurve3(pts, false, "catmullrom", .5);
    })();

    const N = 2200;
    const pathPts = PATH.getPoints(N);
    const UP_V = new THREE.Vector3(0, 1, 0);

    // ── Road mesh ─────────────────────────────────────────────────────────────
    const roadGroup = new THREE.Group();
    roadGroup.renderOrder = 2;

    const shape = new THREE.Shape();
    shape.moveTo(-5, 0); shape.lineTo(5, 0); shape.lineTo(5, -.4); shape.lineTo(-5, -.4); shape.closePath();
    roadGroup.add(new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, { steps: N, bevelEnabled: false, extrudePath: PATH }),
      new THREE.MeshStandardMaterial({
        color: C.road, roughness: .85, emissive: C.roadEmit, emissiveIntensity: .5,
        polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6,
      })
    ));

    function addTube(offset: number, col: number, r: number) {
      const ep = pathPts.map((p, i) => {
        const right = new THREE.Vector3().crossVectors(PATH.getTangentAt(i / N), UP_V).normalize();
        return p.clone().addScaledVector(right, offset).add(new THREE.Vector3(0, 0.15, 0));
      });
      roadGroup.add(new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ep), N, r, 8, false),
        new THREE.MeshBasicMaterial({ color: col, polygonOffset: true, polygonOffsetFactor: -14, polygonOffsetUnits: -14 })
      ));
    }

    addTube(-5.1, C.neonA, .22);
    addTube( 5.1, C.neonA, .22);
    addTube(   0, C.neonB, .09);
    addTube(-4.2, C.neonC, .055);
    addTube( 4.2, C.neonC, .055);

    for (let i = 40; i < N - 40; i += 65) {
      const base = pathPts[i].clone();
      const right = new THREE.Vector3().crossVectors(PATH.getTangentAt(i / N), UP_V).normalize();
      for (const si of [-1, 1]) {
        const pos = base.clone().addScaledVector(right, si * 6.8);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(.11, .13, 7, 7),
          new THREE.MeshStandardMaterial({ color: 0x080824 }));
        pole.position.copy(pos); pole.position.y += 3.5;
        roadGroup.add(pole);

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(.38, 8, 8),
          new THREE.MeshBasicMaterial({ color: si === -1 ? C.neonA : C.neonB }));
        bulb.position.copy(pos); bulb.position.y += 7.5;
        roadGroup.add(bulb);
      }
    }
    scene.add(roadGroup);

    // ── Road flags — cloth simulation (Verlet + springs) ─────────────────────
    const FLAG_W = 6.5, FLAG_H = 3.0, POLE_H = 16;
    const CW = 9, CH = 6; // particle grid: (segsX+1) × (segsY+1)

    // Canvas texture for flag 0: navy background + logo composited on load
    const flagCanvas = document.createElement('canvas');
    flagCanvas.width = 512; flagCanvas.height = 256;
    const flagCtx = flagCanvas.getContext('2d')!;
    flagCtx.fillStyle = '#05123e';
    flagCtx.fillRect(0, 0, 512, 256);
    const logoFlagTex = new THREE.CanvasTexture(flagCanvas);
    const logoImg = new window.Image();
    logoImg.onload = () => {
      const pad = 40;
      const aspect = logoImg.width / logoImg.height;
      const maxH = flagCanvas.height - pad * 2;
      const maxW = flagCanvas.width  - pad * 2;
      let w = maxH * aspect, h = maxH;
      if (w > maxW) { w = maxW; h = w / aspect; }
      flagCtx.drawImage(logoImg, (flagCanvas.width - w) / 2, (flagCanvas.height - h) / 2, w, h);
      logoFlagTex.needsUpdate = true;
    };
    logoImg.src = '/logoConsalud.png';

    // Canvas textures for flags 1–4: section name + icon
    type IconFn = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => void;
    const SECTION_FLAGS: { num: string; label: string; icon: IconFn }[] = [
      { num: "02", label: "Nosotros",
        icon: (ctx, cx, cy, r) => {
          ctx.beginPath(); ctx.arc(cx - r*.35, cy - r*.15, r*.32, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + r*.25, cy - r*.20, r*.24, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx - r*.15, cy + r*.55, r*.50, Math.PI, 0);   ctx.fill();
          ctx.beginPath(); ctx.arc(cx + r*.42, cy + r*.55, r*.38, Math.PI, 0);   ctx.fill();
        } },
      { num: "03", label: "Servicios",
        icon: (ctx, cx, cy, r) => {
          ctx.beginPath();
          ctx.moveTo(cx, cy - r*.70);
          ctx.lineTo(cx + r*.60, cy - r*.35);
          ctx.lineTo(cx + r*.60, cy + r*.15);
          ctx.quadraticCurveTo(cx + r*.60, cy + r*.70, cx, cy + r*.85);
          ctx.quadraticCurveTo(cx - r*.60, cy + r*.70, cx - r*.60, cy + r*.15);
          ctx.lineTo(cx - r*.60, cy - r*.35);
          ctx.closePath(); ctx.fill();
        } },
      { num: "04", label: "Marcas",
        icon: (ctx, cx, cy, r) => {
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const rad = i % 2 === 0 ? r*.70 : r*.30;
            const a = (i * Math.PI) / 5 - Math.PI / 2;
            i === 0 ? ctx.moveTo(cx + rad*Math.cos(a), cy + rad*Math.sin(a))
                    : ctx.lineTo(cx + rad*Math.cos(a), cy + rad*Math.sin(a));
          }
          ctx.closePath(); ctx.fill();
        } },
      { num: "05", label: "Contacto",
        icon: (ctx, cx, cy, r) => {
          const hw = r*.75, hh = r*.52;
          ctx.fillRect(cx - hw, cy - hh, hw*2, hh*2);
          ctx.strokeStyle = '#05123e'; ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(cx - hw, cy - hh); ctx.lineTo(cx, cy + hh*.3); ctx.lineTo(cx + hw, cy - hh);
          ctx.stroke();
        } },
    ];

    function makeSecTex(d: { num: string; label: string; icon: IconFn }): THREE.CanvasTexture {
      const W = 512, H = 256;
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d')!;
      ctx.fillStyle = '#05123e'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ff8d2b'; ctx.fillRect(0, 0, 8, H);
      ctx.font = 'bold 108px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,141,43,0.12)';
      ctx.textBaseline = 'middle'; ctx.fillText(d.num, 18, H / 2);
      ctx.fillStyle = 'rgba(255,141,43,0.88)';
      d.icon(ctx, W * .76, H * .44, 42);
      ctx.font = 'bold 36px system-ui, sans-serif';
      ctx.fillStyle = '#ffffff'; ctx.textBaseline = 'middle';
      ctx.fillText(d.label, 130, H * .40);
      ctx.fillStyle = '#ff8d2b'; ctx.fillRect(130, H * .62, 200, 3);
      return new THREE.CanvasTexture(cv);
    }

    type FlagParticle = { pos: THREE.Vector3; prev: THREE.Vector3; fixed: boolean };
    type FlagSpring   = { a: number; b: number; restLen: number; stiff: number };
    type ClothFlag    = { particles: FlagParticle[]; springs: FlagSpring[]; posAttr: THREE.BufferAttribute; phase: number };

    const clothFlags: ClothFlag[] = [];

    for (let fi = 0; fi < 5; fi++) {
      const ti     = STOP_TS[fi];
      const fPt    = PATH.getPoint(ti);
      const fTan   = PATH.getTangentAt(ti).normalize();
      const fRight = new THREE.Vector3().crossVectors(fTan, UP_V).normalize();

      const side = fi % 2 === 0 ? 1 : -1;

      const fBase = fPt.clone().addScaledVector(fRight, side * 9.5);
      const fbZn  = Math.max(0, Math.min(1, 1 - (fBase.z - zWorldMin) / TD));
      fBase.y     = Math.max(fPt.y - 1, terrainH(fBase.x, fBase.z, fbZn));

      const fGroup = new THREE.Group();
      fGroup.position.copy(fBase);
      fGroup.rotation.y = Math.atan2(fTan.x, fTan.z);
      scene.add(fGroup);

      // Pole
      const poleM = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.11, POLE_H, 7),
        new THREE.MeshStandardMaterial({ color: 0x0a0a28, metalness: 0.6, roughness: 0.4 })
      );
      poleM.position.y = POLE_H / 2;
      fGroup.add(poleM);

      // Cloth particles in group local space
      const yBase = POLE_H - FLAG_H / 2 - 0.3;
      const particles: FlagParticle[] = [];
      for (let row = 0; row < CH; row++) {
        for (let col = 0; col < CW; col++) {
          const x = col * (FLAG_W / (CW - 1));
          const y = yBase + FLAG_H / 2 - row * (FLAG_H / (CH - 1));
          particles.push({
            pos:   new THREE.Vector3(x, y, 0),
            prev:  new THREE.Vector3(x, y, 0),
            fixed: col === 0,
          });
        }
      }

      // Springs: structural + shear + bend
      const springs: FlagSpring[] = [];
      const addSpr = (a: number, b: number, stiff: number) =>
        springs.push({ a, b, restLen: particles[a].pos.distanceTo(particles[b].pos), stiff });
      for (let row = 0; row < CH; row++) {
        for (let col = 0; col < CW; col++) {
          const idx = row * CW + col;
          if (col < CW - 1)               addSpr(idx, idx + 1,       1.00); // structural H
          if (row < CH - 1)               addSpr(idx, idx + CW,      1.00); // structural V
          if (col < CW-1 && row < CH-1) { addSpr(idx, idx+CW+1, 0.70); addSpr(idx+1, idx+CW, 0.70); } // shear
          if (col < CW - 2)               addSpr(idx, idx + 2,       0.50); // bend H
          if (row < CH - 2)               addSpr(idx, idx + CW * 2,  0.50); // bend V
        }
      }

      // Build indexed BufferGeometry from particle grid
      const positions = new Float32Array(CW * CH * 3);
      const uvs       = new Float32Array(CW * CH * 2);
      const indices: number[] = [];
      for (let row = 0; row < CH; row++) {
        for (let col = 0; col < CW; col++) {
          const i = row * CW + col;
          positions[i*3]   = particles[i].pos.x;
          positions[i*3+1] = particles[i].pos.y;
          positions[i*3+2] = 0;
          uvs[i*2]     = col / (CW - 1);
          uvs[i*2 + 1] = 1 - row / (CH - 1);
          if (col < CW-1 && row < CH-1) {
            const a = row*CW+col, b = a+1, c = (row+1)*CW+col, d = c+1;
            indices.push(a, c, b, b, c, d);
          }
        }
      }

      const clothGeo = new THREE.BufferGeometry();
      clothGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      clothGeo.setAttribute("uv",       new THREE.BufferAttribute(uvs, 2));
      clothGeo.setIndex(indices);
      const posAttr = clothGeo.attributes.position as THREE.BufferAttribute;

      const flagMat = fi === 0
        ? new THREE.MeshBasicMaterial({ map: logoFlagTex, side: THREE.DoubleSide })
        : new THREE.MeshBasicMaterial({ map: makeSecTex(SECTION_FLAGS[fi - 1]), side: THREE.DoubleSide });
      const flagMesh = new THREE.Mesh(clothGeo, flagMat);
      fGroup.add(flagMesh);

      clothFlags.push({ particles, springs, posAttr, phase: fi * 1.4 });
    }

    // ── Sky dome (animated clouds) ────────────────────────────────────────────
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthTest: false,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float v = 0.0, a = 0.5;
          for (int i = 0; i < 6; i++) { v += a * noise(p); p = p * 2.0 + vec2(1.7, 9.2); a *= 0.5; }
          return v;
        }

        void main() {
          float yNorm = vUv.y;

          // horizon: warm amber (Consalud #ff8d2b muted) -> purple -> near-black zenith
          vec3 horiz  = vec3(0.30, 0.10, 0.03);
          vec3 mid    = vec3(0.06, 0.04, 0.22);
          vec3 zenith = vec3(0.01, 0.01, 0.07);
          vec3 sky = yNorm < 0.5
            ? mix(horiz, mid,    yNorm * 2.0)
            : mix(mid,   zenith, (yNorm - 0.5) * 2.0);

          // two cloud layers at different speeds for depth
          vec2 uv1 = vUv * vec2(4.0, 2.0) + vec2(uTime * 0.007, 0.0);
          vec2 uv2 = vUv * vec2(2.5, 1.3) + vec2(uTime * 0.004, uTime * 0.002);
          float c = smoothstep(0.38, 0.64, fbm(uv1)) * 0.65
                  + smoothstep(0.40, 0.66, fbm(uv2)) * 0.35;
          float cloudFade = smoothstep(0.08, 0.35, yNorm);

          vec3 cloudCol = vec3(0.24, 0.18, 0.42);
          vec3 col = mix(sky, cloudCol, c * 0.88 * cloudFade);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const skyMesh = new THREE.Mesh(new THREE.SphereGeometry(2400, 32, 16), skyMat);
    skyMesh.renderOrder = -1;
    scene.add(skyMesh);

    // ── Stars ─────────────────────────────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000 * 3; i += 3) {
      starPos[i]   = (Math.random() - .5) * 2500;
      starPos[i+1] = 80 + Math.random() * 650;
      starPos[i+2] = (Math.random() - .5) * 5500;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: .7, sizeAttenuation: true })));

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a0a30, 6));
    const dir = new THREE.DirectionalLight(0x2211cc, 3);
    dir.position.set(300, 800, -600);
    scene.add(dir);
    const cL1 = new THREE.PointLight(C.neonA, 16, 150);
    const cL2 = new THREE.PointLight(C.neonB, 16, 150);
    const bL  = new THREE.PointLight(0x1a0066, 6, 300);
    scene.add(cL1, cL2, bL);

    const CAM_HEIGHT = 7, CAM_BACK = 18;
    const camPos    = PATH.getPoint(.002).clone().add(PATH.getTangentAt(.002).normalize().multiplyScalar(-CAM_BACK));
    camPos.y += CAM_HEIGHT;
    const camTarget = PATH.getPoint(.018).clone();
    camTarget.y += 1;
    const camUp     = new THREE.Vector3(0, 1, 0);
    camera.position.copy(camPos);
    camera.lookAt(camTarget);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let frame = 0, animId = 0;
    function animate() {
      animId = requestAnimationFrame(animate);
      frame++;
      skyMat.uniforms.uTime.value += 0.016;

      const scroll  = progressRef.current;
      const roadT   = getRoadT(scroll);
      const oAlpha  = getOrbitAlpha(scroll);
      const sec     = getCurrentSection(scroll);

      const vPos = PATH.getPoint(roadT);
      const vTan = PATH.getTangentAt(roadT).normalize();

      // Travel camera calculations
      const travelPos  = vPos.clone().addScaledVector(vTan, -CAM_BACK);
      travelPos.y += CAM_HEIGHT;
      // Floor: never let travelPos clip below terrain (happens on steep uphill sections)
      const tvZn = Math.max(0, Math.min(1, 1 - (travelPos.z - zWorldMin) / TD));
      travelPos.y = Math.max(travelPos.y, terrainH(travelPos.x, travelPos.z, tvZn) + CAM_HEIGHT);

      const travelLook = PATH.getPoint(Math.min(roadT + .022, .968)).clone();
      travelLook.y += 1;

      const stopPos  = PATH.getPoint(STOP_TS[sec]);
      const angle    = frame * 0.0035;
      const orbitPos = new THREE.Vector3(
        stopPos.x + Math.cos(angle) * 38,
        stopPos.y + 10,
        stopPos.z + Math.sin(angle) * 38
      );
      const orbitLook = stopPos.clone(); orbitLook.y += 3;

      const targetPos  = new THREE.Vector3().lerpVectors(travelPos, orbitPos, oAlpha);
      const targetLook = new THREE.Vector3().lerpVectors(travelLook, orbitLook, oAlpha);

      camPos.lerp(targetPos, .028);
      camTarget.lerp(targetLook, .04);

      // Hard floor after lerp: camera never goes underground even with scroll lag
      const camZn = Math.max(0, Math.min(1, 1 - (camPos.z - zWorldMin) / TD));
      camPos.y = Math.max(camPos.y, terrainH(camPos.x, camPos.z, camZn) + 4);

      camera.position.copy(camPos);
      camera.up.copy(camUp);
      camera.lookAt(camTarget);

      // Lights follow vehicle
      cL1.position.set(vPos.x - 6, vPos.y + 5, vPos.z);
      cL2.position.set(vPos.x + 6, vPos.y + 5, vPos.z);
      bL.position.set(vPos.x, vPos.y + 18, vPos.z + 18);

      // ── Cloth physics (Verlet integration) ───────────────────────────────
      const ft   = skyMat.uniforms.uTime.value;
      const GRAV = -0.006;
      const DAMP = 0.985;
      const SUBS = 6;
      for (const cf of clothFlags) {
        // Wind fades to 0 when camera is orbiting (user is reading)
        const windMult = 1 - oAlpha;
        const wStr = (0.9 + Math.sin(ft * 0.5 + cf.phase) * 0.40
                         + Math.sin(ft * 1.4 + cf.phase * 0.7) * 0.25) * 0.038 * windMult;
        // Verlet integrate
        for (const p of cf.particles) {
          if (p.fixed) continue;
          const vx = (p.pos.x - p.prev.x) * DAMP;
          const vy = (p.pos.y - p.prev.y) * DAMP + GRAV;
          const vz = (p.pos.z - p.prev.z) * DAMP + wStr;
          p.prev.copy(p.pos);
          p.pos.x += vx; p.pos.y += vy; p.pos.z += vz;
        }
        // Constraint relaxation
        for (let sub = 0; sub < SUBS; sub++) {
          for (const s of cf.springs) {
            const pa = cf.particles[s.a], pb = cf.particles[s.b];
            const dx = pb.pos.x - pa.pos.x, dy = pb.pos.y - pa.pos.y, dz = pb.pos.z - pa.pos.z;
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1e-8;
            const corr = ((dist - s.restLen) / dist) * s.stiff * 0.5;
            if (!pa.fixed) { pa.pos.x += dx*corr; pa.pos.y += dy*corr; pa.pos.z += dz*corr; }
            if (!pb.fixed) { pb.pos.x -= dx*corr; pb.pos.y -= dy*corr; pb.pos.z -= dz*corr; }
          }
        }
        // Upload positions to GPU
        const attr = cf.posAttr;
        for (let i = 0; i < cf.particles.length; i++) {
          attr.setXYZ(i, cf.particles[i].pos.x, cf.particles[i].pos.y, cf.particles[i].pos.z);
        }
        attr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.traverse(obj => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.geometry.dispose();
        const m = obj.material;
        Array.isArray(m) ? m.forEach(x => x.dispose()) : m.dispose();
      });
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ pointerEvents: "none", animation: "sceneFadeIn 0.6s ease-out 0s both" }} />;
}
