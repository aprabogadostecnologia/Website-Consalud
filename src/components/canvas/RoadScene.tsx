import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildHospitalModel } from "./models/HospitalModel";
import { buildConstruccionModel } from "./models/ConstruccionModel";

interface RoadSceneProps {
  progress: number;
  className?: string;
  onReady?: () => void;
}

// ── Consalud palette ──────────────────────────────────────────────────────────
const C = {
  bg:       0x010410, // deep reassuring midnight sapphire
  neonA:    0x2563eb, // trustful royal blue of healthcare security
  neonB:    0xe2b13c, // warm amber-gold of protection and justice
  neonC:    0x00d8f6, // bright digital cyan-blue accent for lanes
  road:       0x05123e, // Consalud navy brand color
  roadEmit: 0x000000, // no emissive glow on the road surface to keep it dark and neutral
  wire:     0x0e1c3a, // subtle protective blue structural wireframe
  mtnSolid: 0x01081f, // deep space-navy mountain bases
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

// ── Terrain: Ridged Multifractal Noise with Domain Warping ───────────────────
function rawNoise2D(x: number, y: number): number {
  const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return h - Math.floor(h);
}

function valueNoise2D(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);

  const a = rawNoise2D(ix, iy);
  const b = rawNoise2D(ix + 1, iy);
  const c = rawNoise2D(ix, iy + 1);
  const d = rawNoise2D(ix + 1, iy + 1);

  return a * (1 - ux) * (1 - uy) +
         b * ux * (1 - uy) +
         c * (1 - ux) * uy +
         d * ux * uy;
}

function ridgedNoiseFBM(x: number, z: number): number {
  let value = 0.0;
  let amplitude = 1.0;
  let frequency = 1.0;
  let gain = 0.52;
  let lacunarity = 2.15;
  let weight = 1.0;

  for (let i = 0; i < 5; i++) {
    let signal = 1.0 - Math.abs(2.0 * (valueNoise2D(x * frequency, z * frequency) - 0.5));
    signal = signal * signal * weight;
    weight = Math.max(0.0, Math.min(1.0, signal * 2.8));
    value += signal * amplitude;
    frequency *= lacunarity;
    amplitude *= gain;
  }
  return value;
}

function warpedNoise(x: number, z: number): number {
  const ox = valueNoise2D(x * 2.4, z * 2.4) * 0.45;
  const oz = valueNoise2D(x * 2.4 + 4.3, z * 2.4 + 5.7) * 0.45;
  const r = ridgedNoiseFBM(x + ox, z + oz);
  const hf = valueNoise2D(x * 11.0, z * 10.0) * 0.11;
  return r + hf;
}

function getRoadXAtZ(z: number): number {
  const zWorldMin = -2000;
  const TD = 4000;
  const zn = 1 - (z - zWorldMin) / TD;
  const clampedZn = Math.max(0, Math.min(1, zn));
  const amp = (clampedZn > .24 && clampedZn < .48) || (clampedZn > .57 && clampedZn < .82) ? 85 : 38;
  const cf = Math.min(1, Math.max(0, (clampedZn - 0.02) / 0.13));
  return cf * (
    Math.sin(clampedZn * Math.PI * 2 * 6 + .30) * amp * .58 +
    Math.sin(clampedZn * Math.PI * 2 * 10 + 1.7) * amp * .28 +
    Math.sin(clampedZn * Math.PI * 2 * 3  - .80) * amp * .38
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
  const rx = getRoadXAtZ(z);
  const dx = Math.abs(x - rx);
  const baseProfile = profile(zn);
  
  // High fidelity ridged multi-fractal mountain chain (raising peaks on the sides)
  const mountainHeight = warpedNoise(x * 0.008, z * 0.0035) * 115.0;
  
  // Protect the road corridor: completely smooth for road bed, steep canyons beyond
  const transition = Math.max(0, Math.min(1, (dx - 14) / 105));
  const elevationWeight = transition * transition * (3 - 2 * transition);
  
  const globalSwell = Math.sin(x * 0.0015) * Math.cos(z * 0.001) * 18.0;
  
  return baseProfile + (mountainHeight + globalSwell) * elevationWeight;
}

export default function RoadScene({ progress, className, onReady }: RoadSceneProps) {
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
    renderer.setClearColor(C.bg, 1); // Deep midnight sapphire clear color

    const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.5, 3000);

    const TW = 1800, TD = 4000;
    const zWorldMin = -TD / 2;

    // ── Terrain: Scenic Sculpting & High-Realism Shading ─────────────────────
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
    
    // Compute normals first so we can use vertex slopes for shading (just like a professional shader)
    terrainGeo.computeVertexNormals();
    const normals = terrainGeo.attributes.normal;

    const range = maxH - minH;
    const vc = new Float32Array(tPos.count * 3);
    for (let i = 0; i < tPos.count; i++) {
      const wx = tPos.getX(i);
      const wz = tPos.getZ(i);
      const y = hs[i];
      const t = (y - minH) / range; // height ratio (0 to 1)

      const ny = normals.getY(i); // vertical component (1 = flat, 0 = vertical cliff)
      const slope = Math.max(0.0, Math.min(1.0, 1.0 - ny)); // slope factor (0 = flat plains, 1 = vertical cliffs)

      // Consalud corporate blue palette for flat valleys and plains (reassuring deep sapphire to midnight slate-blue)
      const blueValley = new THREE.Color(0x050c1e); // Very deep nocturne midnight blue
      const blueFlat   = new THREE.Color(0x13274f); // Rich sapphire steel blue for plains
      const sandColor  = new THREE.Color().lerpColors(blueValley, blueFlat, Math.min(1, t * 1.8));

      // Corporate mountain cliff and peak colors (deep navy crevices, signature Consalud blue mid-slopes, bright alpine digital cyan/ice blue on peaks)
      const rockCrevice = new THREE.Color(0x021133); // Dark occluded shadow crevices
      const rockSlate   = new THREE.Color(0x2563eb); // Consalud signature royal blue principal slopes
      const rockCrest   = new THREE.Color(0x73b4fc); // Alpine ice blue / cyan peak highlights

      let rockColor = new THREE.Color();
      if (t < 0.4) {
        rockColor.lerpColors(rockCrevice, rockSlate, t / 0.4);
      } else {
        rockColor.lerpColors(rockSlate, rockCrest, (t - 0.4) / 0.6);
      }

      // Mix sand and rock colors based on steepness (slope)
      // Steep cliffs get solid rock colors, while flat valleys accumulate sand/dirt
      let rockWeight = Math.pow(slope, 1.25); // Non-linear response for organic boundary transitions
      if (t < 0.12) {
        rockWeight *= (t / 0.12); // Valley bottoms are purely sandy flats with zero rocks
      }

      const col = new THREE.Color();
      col.lerpColors(sandColor, rockColor, rockWeight);

      // Add high-frequency micro-granular noise for organic soil-grain texture
      const grainNum = (rawNoise2D(Math.floor(wx * 3.5), Math.floor(wz * 3.5)) - 0.5) * 0.055;
      col.r = Math.max(0, Math.min(1.0, col.r + grainNum * 0.5));
      col.g = Math.max(0, Math.min(1.0, col.g + grainNum * 0.4));
      col.b = Math.max(0, Math.min(1.0, col.b + grainNum * 0.3));

      vc[i * 3]     = col.r;
      vc[i * 3 + 1] = col.g;
      vc[i * 3 + 2] = col.b;
    }
    terrainGeo.setAttribute("color", new THREE.BufferAttribute(vc, 3));
    const terrainMesh = new THREE.Mesh(terrainGeo,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .88, metalness: .02 }));
    terrainMesh.renderOrder = 0;
    scene.add(terrainMesh);

    // Neon wireframe grid (seamlessly snaps to our new realistic terrain mesh)
    const wGeo = new THREE.PlaneGeometry(TW, TD, 55, 110);
    wGeo.rotateX(-Math.PI / 2);
    const wPos = wGeo.attributes.position;
    for (let i = 0; i < wPos.count; i++) {
      const wz = wPos.getZ(i);
      wPos.setY(i, terrainH(wPos.getX(i), wz, 1 - (wz - zWorldMin) / TD) + 0.3);
    }
    wGeo.computeVertexNormals();
    scene.add(new THREE.Mesh(wGeo,
      new THREE.MeshBasicMaterial({ color: C.wire, wireframe: true, transparent: true, opacity: .09 })));

    // ── Road path ─────────────────────────────────────────────────────────────
    const PATH = (() => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < 300; i++) {
        const zn_PATH = i / 300;
        const wz = zWorldMin + (1 - zn_PATH) * TD * .92 + TD * .04;
        const wx = getRoadXAtZ(wz);
        const zn_local = 1 - (wz - zWorldMin) / TD;
        pts.push(new THREE.Vector3(wx, terrainH(wx, wz, zn_local) + 1.1, wz));
      }
      const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", .5);
      
      // Override to keep road mesh orientation perfectly parallel to the ground (prevents vertical twisting)
      curve.computeFrenetFrames = function(segments: number, closed?: boolean) {
        const tangents: THREE.Vector3[] = [];
        const normals: THREE.Vector3[] = [];
        const binormals: THREE.Vector3[] = [];
        const UP = new THREE.Vector3(0, 1, 0);

        for (let i = 0; i <= segments; i++) {
          const u = i / segments;
          const tangent = this.getTangentAt(u).normalize();
          const right = new THREE.Vector3().crossVectors(tangent, UP).normalize();
          const roadUp = new THREE.Vector3().crossVectors(right, tangent).normalize();

          tangents.push(tangent);
          normals.push(right);
          binormals.push(roadUp);
        }

        return { tangents, normals, binormals };
      };

      return curve;
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
      new THREE.MeshBasicMaterial({
        color: C.road,
        polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6,
      })
    ));

    const laneTexturesToAnimate: THREE.CanvasTexture[] = [];

    function addGradientTube(offset: number, color1: string, color2: string, r: number, repeats = 60) {
      const ep = pathPts.map((p, i) => {
        const right = new THREE.Vector3().crossVectors(PATH.getTangentAt(i / N), UP_V).normalize();
        return p.clone().addScaledVector(right, offset).add(new THREE.Vector3(0, 0.15, 0));
      });

      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 1;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createLinearGradient(0, 0, 512, 0);
      grad.addColorStop(0.0, color1);
      grad.addColorStop(0.4, color2);
      grad.addColorStop(0.6, color2);
      grad.addColorStop(1.0, color1);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 1);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeats, 1);
      laneTexturesToAnimate.push(tex);

      roadGroup.add(new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ep), N, r, 8, false),
        new THREE.MeshBasicMaterial({
          map: tex,
          polygonOffset: true,
          polygonOffsetFactor: -14,
          polygonOffsetUnits: -14
        })
      ));
    }

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

    // Outer boundary edge lines: gorgeous scrolling gradient between #0b125e and #2563eb
    addGradientTube(-5.1,  '#05123e', '#ff8d2b', .16, 75);
    addGradientTube( 5.1,  '#05123e', '#ff8d2b', .16, 75);

    // Central line — neon orange Consalud
    {
      const ep = pathPts.map((p, i) => {
        const right = new THREE.Vector3().crossVectors(PATH.getTangentAt(i / N), UP_V).normalize();
        return p.clone().addScaledVector(right, 0).add(new THREE.Vector3(0, 0.18, 0));
      });
      const curve = new THREE.CatmullRomCurve3(ep);
      const pOff = { polygonOffset: true, polygonOffsetFactor: -16, polygonOffsetUnits: -16 };
      // Core — bright white-orange solid
      roadGroup.add(new THREE.Mesh(
        new THREE.TubeGeometry(curve, N, 0.06, 8, false),
        new THREE.MeshBasicMaterial({ color: 0xfff0e0, ...pOff })
      ));
      // Glow layer 1 — orange halo
      roadGroup.add(new THREE.Mesh(
        new THREE.TubeGeometry(curve, N, 0.22, 8, false),
        new THREE.MeshBasicMaterial({ color: 0xff8d2b, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, ...pOff })
      ));
      // Glow layer 2 — wide soft corona
      roadGroup.add(new THREE.Mesh(
        new THREE.TubeGeometry(curve, N, 0.55, 8, false),
        new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false, ...pOff })
      ));
    }

    // Inner lane lines: gorgeous scrolling gradient between #0b125e and #00d8f6 (brand cyan)
    addGradientTube(-4.2, '#05123e', '#ff8d2b', .055, 110);
    addGradientTube( 4.2, '#05123e', '#ff8d2b', .055, 110);

    const rotatingBulbs: THREE.Mesh[] = [];
    const shiningSprites: THREE.Sprite[] = [];

    // Helper to generate a soft, high-intensity radial light bloom (destello leve)
    const createGlowTexture = (colorStr: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Hot white center
      grad.addColorStop(0.15, colorStr.replace('1)', '0.92)')); // Saturated glow halo
      grad.addColorStop(0.38, colorStr.replace('1)', '0.38)')); // Soft mid-decay aura
      grad.addColorStop(0.70, colorStr.replace('1)', '0.10)')); // Distant atmospheric bleed
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fades out completely
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const glowTextureA = createGlowTexture('rgba(37, 99, 235, 1)'); // Electric blue
    const glowTextureB = createGlowTexture('rgba(256, 177, 60, 1)');  // Saffron gold

    const glowSpriteMatA = new THREE.SpriteMaterial({
      map: glowTextureA,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const glowSpriteMatB = new THREE.SpriteMaterial({
      map: glowTextureB,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    for (let i = 40; i < N - 40; i += 65) {
      const base = pathPts[i].clone();
      const right = new THREE.Vector3().crossVectors(PATH.getTangentAt(i / N), UP_V).normalize();
      for (const si of [-1, 1]) {
        const pos = base.clone().addScaledVector(right, si * 6.8);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(.11, .13, 7, 7),
          new THREE.MeshStandardMaterial({ color: 0x111625 }));
        pole.position.copy(pos); pole.position.y += 3.5;
        roadGroup.add(pole);

        // Restore original spherical streetlamp bulb
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.38, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffffff }) // Pure bright white core emitter
        );
        bulb.position.copy(pos); bulb.position.y += 7.5;
        roadGroup.add(bulb);
        rotatingBulbs.push(bulb);

        // Standard camera-aligned billboard sprite for guaranteed visual bloom/glow
        const selectedGlowMat = si === -1 ? glowSpriteMatA : glowSpriteMatB;
        const glowSprite = new THREE.Sprite(selectedGlowMat);
        glowSprite.position.copy(pos);
        glowSprite.position.y += 7.5;
        glowSprite.scale.set(4.8, 4.8, 1.0); // Perfect, visible sizing matching photo perspective
        roadGroup.add(glowSprite);
        shiningSprites.push(glowSprite);
      }
    }
    scene.add(roadGroup);

    // ── DISTRIBUTE LOW-POLY PINE TREES ALONG ROAD CORRIDOR ─────────────────
    const treeMtl = getMtlFileAsString();
    const treeObj = getObjFileAsString();
    // Four foliage variants with brand palette — weighted random selection per tree
    const baseTreeGroupA = parseCustomObj(treeObj, treeMtl, 0x0546f2); // 40% electric blue
    const baseTreeGroupB = parseCustomObj(treeObj, treeMtl, 0xff8d2b); // 25% vibrant orange
    const baseTreeGroupC = parseCustomObj(treeObj, treeMtl, 0xf5f3e6); // 20% soft cream
    const baseTreeGroupD = parseCustomObj(treeObj, treeMtl, 0x05123e); // 15% navy

    // Pre-compute model clear zones (no trees within radius of each model)
    const _hospT = STOP_TS[4];
    const _hospP = PATH.getPoint(_hospT);
    const _hospTan = PATH.getTangentAt(_hospT).normalize();
    const _hospPerp = new THREE.Vector3(-_hospTan.z, 0, _hospTan.x).normalize();
    const hospClearCenter = _hospP.clone().addScaledVector(_hospPerp, 18);
    const HOSP_CLEAR_R = 28;

    const _conT = STOP_TS[3];
    const _conP = PATH.getPoint(_conT);
    const _conTan = PATH.getTangentAt(_conT).normalize();
    const _conPerp = new THREE.Vector3(-_conTan.z, 0, _conTan.x).normalize();
    const conClearCenter = _conP.clone().addScaledVector(_conPerp, -14);
    const CON_CLEAR_R = 28;

    const treeGroup = new THREE.Group();
    // Step through the path points to spawn trees with rich organic clusters
    for (let i = 10; i < N - 10; i += 7) {
      const base = pathPts[i].clone();
      const right = new THREE.Vector3().crossVectors(PATH.getTangentAt(i / N), UP_V).normalize();
      
      const zn = i / N;

      for (const side of [-1, 1]) {
        // Multi-depth layer parameters: closer road line trees, intermediate forest, deep woods background
        const depthLayers = [
          { minOff: 8.5, maxOff: 13.5, prob: 0.72, scale: [0.55, 0.90] },    // Gentle border lane
          { minOff: 13.5, maxOff: 24.0, prob: 0.90, scale: [0.75, 1.35] },   // Medium dense woodland
          { minOff: 24.0, maxOff: 42.0, prob: 0.95, scale: [1.12, 1.85] }    // Looming tall dense forest ridge
        ];

        for (const layer of depthLayers) {
          if (Math.random() < layer.prob) {
            // Spawn clustered groupings (1 to 3 trees) per depth layer for natural woodland density
            const clusterCount = Math.floor(Math.random() * 3) + 1;
            for (let c = 0; c < clusterCount; c++) {
              const offsetDist = layer.minOff + Math.random() * (layer.maxOff - layer.minOff);
              // Slight organic variance along the road heading for a wild natural pattern
              const longitudinalVariance = (Math.random() - 0.5) * 6.5;
              const pos = base.clone()
                .addScaledVector(right, side * offsetDist)
                .addScaledVector(PATH.getTangentAt(zn), longitudinalVariance);
              
              // Apply organic height variation according to depth layers
              const sFactor = layer.scale[0] + Math.random() * (layer.scale[1] - layer.scale[0]);

              // Skip trees inside model clear zones
              if (pos.distanceTo(hospClearCenter) < HOSP_CLEAR_R) continue;
              if (pos.distanceTo(conClearCenter) < CON_CLEAR_R) continue;

              // Query the custom noise elevation formula to map the trees precisely onto the ground
              const tbZn = Math.max(0, Math.min(1, 1 - (pos.z - zWorldMin) / TD));
              // Sink the tree slightly so that the trunk trunk is buried nicely in sloping ground
              pos.y = terrainH(pos.x, pos.z, tbZn) - 0.15 * sFactor;

              // Instantiate a lightweight shared clone of the pine tree model
              const rCol = Math.random();
              const srcGroup = rCol < 0.40 ? baseTreeGroupA : rCol < 0.65 ? baseTreeGroupB : rCol < 0.85 ? baseTreeGroupC : baseTreeGroupD;
              const tree = srcGroup.clone();
              tree.position.copy(pos);
              tree.rotation.y = Math.random() * Math.PI * 2;
              tree.scale.set(sFactor, sFactor, sFactor);

              treeGroup.add(tree);
            }
          }
        }
      }
    }
    scene.add(treeGroup);


    // ── Road flags — cloth simulation (Verlet + springs) ─────────────────────
    const FLAG_W = 6.5, FLAG_H = 3.0, POLE_H = 16;
    const CW = 9, CH = 6; // particle grid: (segsX+1) × (segsY+1)

    // Canvas texture for flag 0: green background + logo composited on load
    const flagCanvas = document.createElement('canvas');
    flagCanvas.width = 512; flagCanvas.height = 256;
    const flagCtx = flagCanvas.getContext('2d')!;
    flagCtx.fillStyle = '#022424'; // deep therapeutic green
    flagCtx.fillRect(0, 0, 512, 256);
    
    

    const logoFlagTex = new THREE.CanvasTexture(flagCanvas);
    const logoImg = new window.Image();
    logoImg.onload = () => {
      // Clear previous text fallback to replace with rich logo
      flagCtx.fillStyle = 'linear-gradient(90deg, #05123e, #ff8d2b)'; // subtle gradient for visual interest
     
      const pad = 40;
      const aspect = logoImg.width / logoImg.height;
      const maxH = flagCanvas.height - pad * 2;
      const maxW = flagCanvas.width  - pad * 2;
      let w = maxH * aspect, h = maxH;
      if (w > maxW) { w = maxW; h = w / aspect; }
      flagCtx.save();
      flagCtx.scale(-1, 1);
      flagCtx.drawImage(logoImg, -(flagCanvas.width + w) / 2, (flagCanvas.height - h) / 2, w, h);
      flagCtx.restore();
      logoFlagTex.needsUpdate = true;
    };
    logoImg.src = '/conSaludWhite.png';

    // Canvas texture for flag 3 (fi=3): Vigía logo on navy background
    const vigiaFlagCanvas = document.createElement('canvas');
    vigiaFlagCanvas.width = 512; vigiaFlagCanvas.height = 256;
    const vigiaFlagCtx = vigiaFlagCanvas.getContext('2d')!;
    const _drawVigiaBg = () => {
      vigiaFlagCtx.fillStyle = '#05123e'; vigiaFlagCtx.fillRect(0, 0, 512, 256);
      vigiaFlagCtx.fillStyle = '#ff8d2b'; vigiaFlagCtx.fillRect(0, 0, 10, 256);
      vigiaFlagCtx.strokeStyle = 'rgba(255,141,43,0.25)'; vigiaFlagCtx.lineWidth = 4;
      vigiaFlagCtx.strokeRect(14, 10, 488, 236);
    };
    _drawVigiaBg();
    const vigiaFlagTex = new THREE.CanvasTexture(vigiaFlagCanvas);
    const vigiaLogoImg = new window.Image();
    vigiaLogoImg.onload = () => {
      _drawVigiaBg();
      const pad = 32;
      const aspect = vigiaLogoImg.width / vigiaLogoImg.height;
      const maxH = vigiaFlagCanvas.height - pad * 2;
      const maxW = vigiaFlagCanvas.width - pad * 2 - 10;
      let w = maxH * aspect, h = maxH;
      if (w > maxW) { w = maxW; h = w / aspect; }
      const x = 10 + (vigiaFlagCanvas.width - 10 - w) / 2;
      const y = (vigiaFlagCanvas.height - h) / 2;
      vigiaFlagCtx.drawImage(vigiaLogoImg, x, y, w, h);
      vigiaFlagTex.needsUpdate = true;
    };
    vigiaLogoImg.src = '/vigiaWhite.png';

    // Canvas textures for flags 1–4: section name + icon
    type IconFn = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => void;
    const SECTION_FLAGS: { num: string; label: string; icon: IconFn }[] = [
      { num: "", label: "NOSOTROS",
        icon: (ctx, cx, cy, r) => {
          // Beautiful protective heart
          ctx.beginPath();
          ctx.moveTo(cx, cy - r * 0.45);
          ctx.bezierCurveTo(cx + r * 0.5, cy - r * 0.9, cx + r, cy - r * 0.35, cx, cy + r * 0.75);
          ctx.bezierCurveTo(cx - r, cy - r * 0.35, cx - r * 0.5, cy - r * 0.9, cx, cy - r * 0.45);
          ctx.closePath(); ctx.fill();
        } },
     // Trigger logo load on the first flag's icon setup

      { num: "", label: "SERVICIOS",
        icon: (ctx, cx, cy, r) => { 
          // Medical protection cross / shield of rights
          ctx.beginPath();
          ctx.moveTo(cx, cy - r * 0.7);
          ctx.lineTo(cx + r * 0.6, cy - r * 0.4);
          ctx.lineTo(cx + r * 0.5, cy + r * 0.3);
          ctx.quadraticCurveTo(cx, cy + r * 0.8, cx, cy + r * 0.8);
          ctx.quadraticCurveTo(cx - r * 0.5, cy + r * 0.3, cx - r * 0.5, cy + r * 0.3);
          ctx.lineTo(cx - r * 0.6, cy - r * 0.4);
          ctx.closePath(); ctx.fill();
          
          ctx.fillStyle = '#022424';
          ctx.fillRect(cx - r * 0.1, cy - r * 0.35, r * 0.2, r * 0.7);
          ctx.fillRect(cx - r * 0.35, cy - r * 0.1, r * 0.7, r * 0.2);
          ctx.fillStyle = '#e2b13c'; // restore
        } },
      { num: "", label: "SERVICIOS DIGITALES",
        icon: (ctx, cx, cy, r) => {
          // Scales of Justice symbol for legal health protection
          ctx.fillRect(cx - r * 0.7, cy - r * 0.25, r * 1.4, r * 0.08);
          ctx.fillRect(cx - r * 0.06, cy - r * 0.35, r * 0.12, r * 0.9);
          ctx.fillRect(cx - r * 0.3, cy + r * 0.5, r * 0.6, r * 0.1);
          ctx.beginPath(); ctx.arc(cx - r * 0.5, cy + r * 0.15, r * 0.24, 0, Math.PI); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + r * 0.5, cy + r * 0.15, r * 0.24, 0, Math.PI); ctx.fill();
        } },
      { num: "05", label: "CONTACTO",
        icon: (ctx, cx, cy, r) => {
          // Reassuring medical/legal care speech bubble with internal + symbol
          const hw = r * 0.7, hh = r * 0.45;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(cx - hw, cy - hh, hw * 2, hh * 1.6, 8);
          } else {
            ctx.rect(cx - hw, cy - hh, hw * 2, hh * 1.6);
          }
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx - 10, cy + hh * 0.6);
          ctx.lineTo(cx + 10, cy + hh * 0.6);
          ctx.lineTo(cx - 15, cy + hh * 1.1);
          ctx.closePath(); ctx.fill();

          ctx.fillStyle = '#022424';
          ctx.fillRect(cx - 3, cy - hh * 0.3, 6, hh * 1.2);
          ctx.fillRect(cx - hh * 0.6, cy - 3, hh * 1.2, 6);
          ctx.fillStyle = '#e2b13c'; // restore
        } },
    ];

    function makeSecTex(d: { num: string; label: string; icon: IconFn }): THREE.CanvasTexture {
      const W = 512, H = 256;
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d')!;
      ctx.fillStyle = '#022424'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#e2b13c'; ctx.fillRect(0, 0, 10, H);
      ctx.font = 'bold 124px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(226,177,60,0.12)';
      ctx.textBaseline = 'middle'; ctx.fillText(d.num, 20, H / 2);
      ctx.fillStyle = '#e2b13c';
      d.icon(ctx, W * .78, H * .42, 54);
      ctx.font = 'bold 56px system-ui, sans-serif';
      ctx.fillStyle = '#ffffff'; ctx.textBaseline = 'middle';
      ctx.fillText(d.label, 140, H * .38);
      ctx.fillStyle = '#e2b13c'; ctx.fillRect(140, H * .64, 220, 4);
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
        new THREE.CylinderGeometry(0.18, 0.24, POLE_H, 7),
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
        ? new THREE.MeshBasicMaterial({ map: logoFlagTex,    side: THREE.DoubleSide })
        : fi === 3
        ? new THREE.MeshBasicMaterial({ map: vigiaFlagTex,   side: THREE.DoubleSide })
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
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          float y = vUv.y;
          vec3 horiz  = vec3(0.02, 0.03, 0.10);
          vec3 zenith = vec3(0.004, 0.004, 0.018);
          vec3 col = mix(horiz, zenith, smoothstep(0.0, 1.0, y));
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
      starPos[i]   = (Math.random() - 0.5) * 2500;
      starPos[i+1] = 80 + Math.random() * 650;
      starPos[i+2] = (Math.random() - 0.5) * 5500;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, sizeAttenuation: true })));

    // ── Low-Poly Majestic Birds of Welfare ─────────────────────────────────────
    const birdsGroup = new THREE.Group();
    scene.add(birdsGroup);

    function createLowPolyBird(colorBody: number, colorWings: number, colorBeak: number, scale = 1.0) {
      const bird = new THREE.Group();

      // Sharp low-poly body geometry
      const bodyGeo = new THREE.ConeGeometry(0.38 * scale, 1.4 * scale, 4);
      bodyGeo.rotateX(Math.PI / 2);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: colorBody,
        flatShading: true,
        roughness: 0.6,
        metalness: 0.1
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bird.add(bodyMesh);

      // Curved low-poly beak
      const beakGeo = new THREE.ConeGeometry(0.12 * scale, 0.45 * scale, 4);
      beakGeo.rotateX(Math.PI * 0.4);
      const beakMat = new THREE.MeshStandardMaterial({
        color: colorBeak,
        flatShading: true,
        roughness: 0.5
      });
      const beakMesh = new THREE.Mesh(beakGeo, beakMat);
      beakMesh.position.set(0, -0.05 * scale, 0.75 * scale);
      bird.add(beakMesh);

      // Majestic long tail feathers (low-poly diamond tapered)
      const tailGeo = new THREE.ConeGeometry(0.16 * scale, 1.1 * scale, 4);
      tailGeo.rotateX(-Math.PI * 0.52);
      const tailMat = new THREE.MeshStandardMaterial({
        color: colorWings,
        flatShading: true,
        roughness: 0.7
      });
      const tailMesh = new THREE.Mesh(tailGeo, tailMat);
      tailMesh.position.set(0, -0.15 * scale, -0.85 * scale);
      bird.add(tailMesh);

      // Low-poly eyes
      const eyeGeo = new THREE.SphereGeometry(0.04 * scale, 4, 4);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x010410 });
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.16 * scale, 0.1 * scale, 0.55 * scale);
      const rightEye = leftEye.clone();
      rightEye.position.x = 0.16 * scale;
      bird.add(leftEye, rightEye);

      // LEFT WING GROUP (pivot on the shoulder)
      const leftWingGroup = new THREE.Group();
      leftWingGroup.position.set(-0.25 * scale, 0.1 * scale, 0.1 * scale);
      
      const leftWingGeo = new THREE.BufferGeometry();
      const verticesL = new Float32Array([
        // Triangle 1: inner wing
        0, 0, 0.3 * scale,
        0, 0, -0.3 * scale,
        -0.8 * scale, -0.15 * scale, -0.1 * scale,
        
        // Triangle 2: outer wing
        0, 0, -0.3 * scale,
        -0.8 * scale, -0.15 * scale, -0.1 * scale,
        -1.8 * scale, -0.4 * scale, -0.25 * scale
      ]);
      leftWingGeo.setAttribute('position', new THREE.BufferAttribute(verticesL, 3));
      leftWingGeo.computeVertexNormals();

      const leftWingMesh = new THREE.Mesh(leftWingGeo, new THREE.MeshStandardMaterial({
        color: colorWings,
        side: THREE.DoubleSide,
        flatShading: true,
        roughness: 0.6
      }));
      leftWingGroup.add(leftWingMesh);

      // RIGHT WING GROUP (pivot on the shoulder)
      const rightWingGroup = new THREE.Group();
      rightWingGroup.position.set(0.25 * scale, 0.1 * scale, 0.1 * scale);

      const rightWingGeo = new THREE.BufferGeometry();
      const verticesR = new Float32Array([
        // Triangle 1: inner wing
        0, 0, 0.3 * scale,
        0, 0, -0.3 * scale,
        0.8 * scale, -0.15 * scale, -0.1 * scale,
        
        // Triangle 2: outer wing
        0, 0, -0.3 * scale,
        0.8 * scale, -0.15 * scale, -0.1 * scale,
        1.8 * scale, -0.4 * scale, -0.25 * scale
      ]);
      rightWingGeo.setAttribute('position', new THREE.BufferAttribute(verticesR, 3));
      rightWingGeo.computeVertexNormals();

      const rightWingMesh = new THREE.Mesh(rightWingGeo, new THREE.MeshStandardMaterial({
        color: colorWings,
        side: THREE.DoubleSide,
        flatShading: true,
        roughness: 0.6
      }));
      rightWingGroup.add(rightWingMesh);

      bird.add(leftWingGroup, rightWingGroup);

      return {
        group: bird,
        leftWing: leftWingGroup,
        rightWing: rightWingGroup
      };
    }

    // Launch a premium macaw parrot, an amber phoenix, and a digital turquoise bird
    const b1 = createLowPolyBird(0xff3b30, 0x00d8f6, 0xe2b13c, 1.25);
    const b2 = createLowPolyBird(0xe2b13c, 0x2563eb, 0xff5533, 1.0);
    const b3 = createLowPolyBird(0x00d8f6, 0xffffff, 0xe2b13c, 0.9);

    birdsGroup.add(b1.group);
    birdsGroup.add(b2.group);
    birdsGroup.add(b3.group);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x081024, 6)); // Warm therapeutic ambient light
    const dir = new THREE.DirectionalLight(0xff8d2b, 3); // Warm brand-orange solar vitality light
    dir.position.set(300, 800, -600);
    scene.add(dir);
    const cL1 = new THREE.PointLight(C.neonA, 16, 150);
    const cL2 = new THREE.PointLight(C.neonB, 16, 150);
    const bL  = new THREE.PointLight(0x030821, 6, 300); // Soothing deep forest backlight
    scene.add(cL1, cL2, bL);

    // ── Section 3D models ─────────────────────────────────────────────────────
    const hospitalGroup = buildHospitalModel();
    const hospWorldPos = (() => {
      const t = STOP_TS[4];
      const p = PATH.getPoint(t);
      const tan = PATH.getTangentAt(t).normalize();
      const perp = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
      return p.clone().addScaledVector(perp, 18);
    })();
    hospitalGroup.position.copy(hospWorldPos);
    hospitalGroup.position.y += 1;
    // Face the hospital toward the road
    const _toRoad = new THREE.Vector3().subVectors(PATH.getPoint(STOP_TS[4]), hospWorldPos).normalize();
    hospitalGroup.rotation.y = Math.atan2(_toRoad.x, _toRoad.z);
    hospitalGroup.scale.setScalar(0.7);
    hospitalGroup.traverse(child => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach(m => {
        (m as THREE.MeshStandardMaterial).transparent = true;
        (m as THREE.MeshStandardMaterial).opacity = 0;
        (m as THREE.MeshStandardMaterial).depthWrite = false;
      });
    });
    scene.add(hospitalGroup);

    // ── Construcción model (Productos Digitales — STOP_TS[3]) ─────────────────
    const construGroup = buildConstruccionModel();
    {
      const t = STOP_TS[3];
      const p = PATH.getPoint(t);
      const tan = PATH.getTangentAt(t).normalize();
      const perp = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
      // Place 14 units to the LEFT of the road (negative perp)
      construGroup.position.copy(p).addScaledVector(perp, -14);
      // Ground using terrain height at the actual offset position
      const cX = construGroup.position.x, cZ = construGroup.position.z;
      const cZn = Math.max(0, Math.min(1, 1 - (cZ - zWorldMin) / TD));
      construGroup.position.y = terrainH(cX, cZ, cZn) + 0.5;
      const toRoad = new THREE.Vector3().subVectors(p, construGroup.position).normalize();
      construGroup.rotation.y = Math.atan2(toRoad.x, toRoad.z);
      construGroup.scale.setScalar(0.9);
      construGroup.traverse(child => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach(m => {
          (m as THREE.MeshStandardMaterial).transparent = true;
          (m as THREE.MeshStandardMaterial).opacity = 0;
          (m as THREE.MeshStandardMaterial).depthWrite = false;
        });
      });
    }
    scene.add(construGroup);

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
    
    let birdsTimer = 0;
    let frame = 0, animId = 0;
    function animate() {
      animId = requestAnimationFrame(animate);
      frame++;
      birdsTimer += 0.016;

      // Rotate street lamps so they spin like active beacons
      rotatingBulbs.forEach(b => {
        b.rotation.y += 0.012;
      });

      // Slow organic shimmering/pulsing effect on the flare lens to mimic real atmospheric bloom!
      shiningSprites.forEach((sprite, idx) => {
        const shimmer = 1.0 + Math.sin(frame * 0.04 + idx) * 0.12;
        sprite.scale.set(4.8 * shimmer, 4.8 * shimmer, 1.0);
        sprite.rotation.z += 0.002;
      });


      // ── Bird Flight Timer Controls ─────────────────────────────────────────
      const scroll  = Number.isFinite(progressRef.current) ? progressRef.current : 0;
      const roadT   = getRoadT(scroll);
      const oAlpha  = getOrbitAlpha(scroll);
      const sec     = getCurrentSection(scroll);

      // Timer runs through the entire journey
      if (birdsTimer > 24.0) {
        birdsTimer = 0.0;
      }

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

      // Scroll the gradient texture of road lanes for active, organic travel feedback
      for (const tex of laneTexturesToAnimate) {
        tex.offset.x -= 0.0035;
      }

      // ── Cloth physics (Verlet integration) ───────────────────────────────
      const ft   = birdsTimer;
      const GRAV = -0.006;
      const DAMP = 0.981;
      const SUBS = 6;
      for (let cfIdx = 0; cfIdx < clothFlags.length; cfIdx++) {
        const cf = clothFlags[cfIdx];
        // Flag 0 (logo/home) always has full wind; active flag full when orbiting; others ambient
        const windMult = cfIdx === 0 ? 1.0 : cfIdx === sec ? (oAlpha * 0.82 + 0.18) : 0.14;
        const wStr = (0.9 + Math.sin(ft * 0.5 + cf.phase) * 0.55
                         + Math.sin(ft * 1.4 + cf.phase * 0.7) * 0.35) * 0.078 * windMult;
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

      // ── Bird Flight Path & Wing Flapping Animation ────────────────────────────
      if (birdsTimer >= 0) {
        birdsGroup.visible = true;

        // Animate wing flapping with slightly offset frequencies for organic feel
        b1.leftWing.rotation.z  = Math.sin(birdsTimer * 12) * 0.60;
        b1.rightWing.rotation.z = -Math.sin(birdsTimer * 12) * 0.60;

        b2.leftWing.rotation.z  = Math.sin(birdsTimer * 14 + 0.3) * 0.60;
        b2.rightWing.rotation.z = -Math.sin(birdsTimer * 14 + 0.3) * 0.60;

        b3.leftWing.rotation.z  = Math.sin(birdsTimer * 13 + 0.6) * 0.60;
        b3.rightWing.rotation.z = -Math.sin(birdsTimer * 13 + 0.6) * 0.60;

        // Orbit center follows the current section's anchor point
        const heroStopPos = stopPos;

        // 1. Red Macaw: sweeping circle over the road and peaks
        const b1Angle = birdsTimer * 0.32 + 0.5;
        const b1Radius = 26 + Math.sin(birdsTimer * 0.2) * 6;
        const b1Y = heroStopPos.y + 11 + Math.cos(birdsTimer * 0.4) * 3.5;
        const b1X = heroStopPos.x + Math.cos(b1Angle) * b1Radius;
        const b1Z = heroStopPos.z + Math.sin(b1Angle) * b1Radius;

        const nextB1Angle = (birdsTimer + 0.04) * 0.32 + 0.5;
        const nextB1Radius = 26 + Math.sin((birdsTimer + 0.04) * 0.2) * 6;
        const nextB1Y = heroStopPos.y + 11 + Math.cos((birdsTimer + 0.04) * 0.4) * 3.5;
        const nextB1X = heroStopPos.x + Math.cos(nextB1Angle) * nextB1Radius;
        const nextB1Z = heroStopPos.z + Math.sin(nextB1Angle) * nextB1Radius;

        b1.group.position.set(b1X, b1Y, b1Z);
        const b1Dir = new THREE.Vector3(nextB1X - b1X, nextB1Y - b1Y, nextB1Z - b1Z).normalize();
        b1.group.lookAt(b1.group.position.clone().add(b1Dir));

        // 2. Amber Phoenix: slightly larger orbit, trailing majestically
        const b2Angle = birdsTimer * 0.28 + 2.8;
        const b2Radius = 31 + Math.sin(birdsTimer * 0.3) * 5;
        const b2Y = heroStopPos.y + 14 + Math.sin(birdsTimer * 0.5) * 3.0;
        const b2X = heroStopPos.x + Math.cos(b2Angle) * b2Radius;
        const b2Z = heroStopPos.z + Math.sin(b2Angle) * b2Radius;

        const nextB2Angle = (birdsTimer + 0.04) * 0.28 + 2.8;
        const nextB2Radius = 31 + Math.sin((birdsTimer + 0.04) * 0.3) * 5;
        const nextB2Y = heroStopPos.y + 14 + Math.sin((birdsTimer + 0.04) * 0.5) * 3.0;
        const nextB2X = heroStopPos.x + Math.cos(nextB2Angle) * nextB2Radius;
        const nextB2Z = heroStopPos.z + Math.sin(nextB2Angle) * nextB2Radius;

        b2.group.position.set(b2X, b2Y, b2Z);
        const b2Dir = new THREE.Vector3(nextB2X - b2X, nextB2Y - b2Y, nextB2Z - b2Z).normalize();
        b2.group.lookAt(b2.group.position.clone().add(b2Dir));

        // 3. Digital Turquoise: high-altitude, tight/fast circle, diving elegantly
        const b3Angle = birdsTimer * 0.40 + 4.5;
        const b3Radius = 22 + Math.cos(birdsTimer * 0.3) * 4;
        const b3Y = heroStopPos.y + 16 + Math.sin(birdsTimer * 0.6) * 4.0;
        const b3X = heroStopPos.x + Math.cos(b3Angle) * b3Radius;
        const b3Z = heroStopPos.z + Math.sin(b3Angle) * b3Radius;

        const nextB3Angle = (birdsTimer + 0.04) * 0.40 + 4.5;
        const nextB3Radius = 22 + Math.cos((birdsTimer + 0.04) * 0.3) * 4;
        const nextB3Y = heroStopPos.y + 16 + Math.sin((birdsTimer + 0.04) * 0.6) * 4.0;
        const nextB3X = heroStopPos.x + Math.cos(nextB3Angle) * nextB3Radius;
        const nextB3Z = heroStopPos.z + Math.sin(nextB3Angle) * nextB3Radius;

        b3.group.position.set(b3X, b3Y, b3Z);
        const b3Dir = new THREE.Vector3(nextB3X - b3X, nextB3Y - b3Y, nextB3Z - b3Z).normalize();
        b3.group.lookAt(b3.group.position.clone().add(b3Dir));

      }

      // ── Construcción model fade (Productos Digitales: 0.75 – 0.91) ──────────
      const construOpacity = scroll < 0.75 ? 0 : scroll < 0.79 ? (scroll - 0.75) / 0.04 : scroll < 0.88 ? 1 : scroll < 0.91 ? 1 - (scroll - 0.88) / 0.03 : 0;
      construGroup.visible = construOpacity > 0.01;
      if (construGroup.visible) {
        construGroup.traverse(child => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach(m => { (m as THREE.MeshStandardMaterial).opacity = construOpacity; });
        });
      }

      // ── Hospital model fade (Contacto: 0.88 – 1.0) ───────────────────────
      const hospOpacity = scroll < 0.88 ? 0 : scroll < 0.92 ? (scroll - 0.88) / 0.04 : 1;
      hospitalGroup.visible = hospOpacity > 0.01;
      if (hospitalGroup.visible) {
        hospitalGroup.traverse(child => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach(m => { (m as THREE.MeshStandardMaterial).opacity = hospOpacity; });
        });
      }

      renderer.render(scene, camera);
    }
    animate();
    onReady?.();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.traverse(obj => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.geometry.dispose();
        const m = obj.material;
        if (Array.isArray(m)) {
          m.forEach(x => x.dispose());
        } else {
          m.dispose();
        }
      });
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ pointerEvents: "none", animation: "sceneFadeIn 0.6s ease-out 0s both" }} />;
}

// ── CUSTOM LOW-POLY OBJ & MTL PARSER FOR PINE TREES ─────────────────────────
function parseCustomObj(objText: string, mtlText: string, foliageColor?: number): THREE.Group {
  const group = new THREE.Group();

  // 1. Parse materials
  const materials: { [name: string]: THREE.Material } = {};
  const mtlLines = mtlText.split("\n");
  let currentMtlName = "";

  for (const line of mtlLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("newmtl ")) {
      currentMtlName = trimmed.substring(7).trim();
    } else if (trimmed.startsWith("Kd ")) {
      const parts = trimmed.substring(3).trim().split(/\s+/).map(Number);
      if (parts.length >= 3) {
        const color = new THREE.Color(parts[0], parts[1], parts[2]);
        materials[currentMtlName] = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.9,
          metalness: 0.08,
          flatShading: true
        });
      }
    }
  }

  // Fallbacks
  if (!materials["Material.002"]) {
    materials["Material.002"] = new THREE.MeshStandardMaterial({ color: 0x463f06, flatShading: true, roughness: 0.9, metalness: 0.08 });
  }
  if (!materials["Material.003"]) {
    materials["Material.003"] = new THREE.MeshStandardMaterial({ color: 0x1b0a0d, flatShading: true, roughness: 0.9, metalness: 0.08 });
  }
  if (!materials["Material.004"]) {
    materials["Material.004"] = new THREE.MeshStandardMaterial({ color: 0x05433d, roughness: 0.9, flatShading: true });
  }
  if (foliageColor !== undefined) {
    materials["Material.004"] = new THREE.MeshStandardMaterial({ color: foliageColor, flatShading: true, roughness: 0.9, metalness: 0.08 });
  }

  // 2. Parse vertices, normals, and faces
  const vertices: THREE.Vector3[] = [];
  const normals: THREE.Vector3[] = [];
  const materialSubmeshes: { [mtlName: string]: { positions: number[]; normals: number[] } } = {};

  const objLines = objText.split("\n");
  let activeMtl = "";

  for (const line of objLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || trimmed === "") continue;

    const parts = trimmed.split(/\s+/);
    const type = parts[0];

    if (type === "v") {
      vertices.push(new THREE.Vector3(Number(parts[1]), Number(parts[2]), Number(parts[3])));
    } else if (type === "vn") {
      normals.push(new THREE.Vector3(Number(parts[1]), Number(parts[2]), Number(parts[3])));
    } else if (type === "usemtl") {
      activeMtl = parts[1];
      if (!materialSubmeshes[activeMtl]) {
        materialSubmeshes[activeMtl] = { positions: [], normals: [] };
      }
    } else if (type === "f") {
      if (!activeMtl) continue;
      const submesh = materialSubmeshes[activeMtl];
      const faceVertices: { vIdx: number; nIdx: number }[] = [];
      
      for (let idx = 1; idx < parts.length; idx++) {
        const subparts = parts[idx].split("/");
        const vIdx = parseInt(subparts[0], 10) - 1;
        const nIdx = subparts.length >= 3 && subparts[2] !== "" ? parseInt(subparts[2], 10) - 1 : -1;
        faceVertices.push({ vIdx, nIdx });
      }

      // Triangulate any arbitrary n-polygon list of vertices as a fan
      for (let j = 1; j < faceVertices.length - 1; j++) {
        const f0 = faceVertices[0];
        const f1 = faceVertices[j];
        const f2 = faceVertices[j + 1];

        const tris = [f0, f1, f2];
        for (const f of tris) {
          const v = vertices[f.vIdx];
          if (v) {
            submesh.positions.push(v.x, v.y, v.z);
          } else {
            submesh.positions.push(0, 0, 0);
          }

          if (f.nIdx !== -1 && normals[f.nIdx]) {
            const n = normals[f.nIdx];
            submesh.normals.push(n.x, n.y, n.z);
          } else {
            submesh.normals.push(0, 1, 0);
          }
        }
      }
    }
  }

  // 3. Build submeshes into group Mesh objects
  for (const mtlName in materialSubmeshes) {
    if (mtlName === "Material.002") continue; // Skip the base platform under the trees
    const data = materialSubmeshes[mtlName];
    if (data.positions.length === 0) continue;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(data.positions, 3));
    
    if (data.normals.length === data.positions.length) {
      geo.setAttribute("normal", new THREE.Float32BufferAttribute(data.normals, 3));
    } else {
      geo.computeVertexNormals();
    }

    const mat = materials[mtlName] || new THREE.MeshStandardMaterial({ color: 0x888888, flatShading: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  return group;
}

function getObjFileAsString(): string {
  return `
# Blender v2.79 (sub 0) OBJ File: 'pine.blend'
# www.blender.org
mtllib pine.mtl
o Cylinder.001
v -0.001001 0.043765 -0.419297
v -0.001001 1.608194 -0.419297
v 0.385635 0.043765 -0.183158
v 0.385635 1.608194 -0.183158
v 0.385635 0.043765 0.289120
v 0.385635 1.608194 0.289120
v -0.001001 0.043765 0.525260
v -0.001001 1.608194 0.525260
v -0.387637 0.043765 0.289120
v -0.387637 1.608194 0.289120
v -0.387637 0.043765 -0.183158
v -0.387637 1.608194 -0.183158
vn 0.5212 0.0000 -0.8534
vn 1.0000 0.0000 0.0000
vn 0.5212 0.0000 0.8534
vn -0.5212 0.0000 0.8534
vn 0.0000 1.0000 0.0000
vn -1.0000 0.0000 0.0000
vn -0.5212 0.0000 -0.8534
vn 0.0000 -1.0000 0.0000
usemtl Material.003
s off
f 1//1 2//1 4//1 3//1
f 3//2 4//2 6//2 5//2
f 5//3 6//3 8//3 7//3
f 7//4 8//4 10//4 9//4
f 4//5 2//5 12//5 10//5 8//5 6//5
f 9//6 10//6 12//6 11//6
f 11//7 12//7 2//7 1//7
f 1//8 3//8 5//8 7//8 9//8 11//8
o Cylinder
v 0.000000 1.096155 -1.000000
v -0.000000 6.568046 -0.017269
v 0.866025 1.096155 -0.500000
v 0.014955 6.568046 -0.008634
v 0.866025 1.096155 0.500000
v 0.014955 6.568046 0.008634
v -0.000000 1.096155 1.000000
v -0.000000 6.568046 0.017269
v -0.866025 1.096155 0.500000
v -0.014955 6.568046 0.008634
v -0.866025 1.096155 -0.500000
v -0.014955 6.568046 -0.008634
v -0.000000 2.008137 -0.867573
v -0.000000 2.920118 -0.735146
v -0.000000 3.832100 -0.602719
v -0.000000 4.744082 -0.470292
v -0.000000 5.656064 -0.337865
v 0.292599 5.656064 -0.168932
v 0.407285 4.744082 -0.235146
v 0.521970 3.832100 -0.301359
v 0.636655 2.920118 -0.367573
v 0.751340 2.008137 -0.433786
v 0.292599 5.656064 0.168932
v 0.407285 4.744082 0.235146
v 0.521970 3.832100 0.301359
v 0.636655 2.920118 0.367573
v 0.751340 2.008137 0.433787
v -0.000000 5.656064 0.337865
v -0.000000 4.744082 0.470292
v -0.000000 3.832100 0.602719
v -0.000000 2.920118 0.735146
v -0.000000 2.008137 0.867573
v -0.292599 5.656064 0.168932
v -0.407285 4.744082 0.235146
v -0.521970 3.832100 0.301359
v -0.636655 2.920118 -0.367573
v -0.751340 2.008137 0.433786
v -0.292599 5.656064 -0.168932
v -0.407285 4.744082 -0.235146
v -0.521970 3.832100 -0.301359
v -0.636655 2.920118 -0.367573
v -0.751340 2.008137 -0.433786
v -0.000000 5.656577 -0.580263
v 0.502523 5.535640 -0.290132
v 0.502523 5.535640 0.290132
v -0.000000 5.656577 0.580263
v -0.502523 5.535640 0.290132
v -0.502523 5.535640 -0.290132
v -0.000000 4.750504 -0.846837
v 0.733382 4.629567 -0.423418
v 0.733382 4.629567 0.423418
v -0.000000 4.750504 0.846837
v -0.733382 4.629567 0.423418
v -0.733382 4.629567 -0.423418
v 0.000000 3.834244 -1.116371
v 0.966806 3.713307 -0.558185
v 0.966806 3.713307 0.558185
v -0.000000 3.834244 1.116371
v -0.966806 3.713307 0.558185
v -0.966806 3.713307 -0.558185
v 0.000000 2.927890 -1.381833
v 1.196703 2.806952 -0.690917
v 1.196703 2.806952 0.690917
v -0.000000 2.927889 1.381834
v -1.196703 2.806952 0.690917
v -1.196703 2.806952 -0.690917
v 0.000000 2.008137 -1.566728
v 1.356826 1.887199 -0.783364
v 1.356826 1.887199 0.783364
v -0.000000 2.008137 1.566728
v -1.356826 1.887199 0.783364
v -1.356826 1.887199 -0.783364
v 1.628944 0.975218 -0.940471
v 1.628944 0.975218 0.940471
v -0.000000 1.096155 1.880942
v -1.628944 0.975218 0.940471
v -1.628944 0.975218 -0.940471
v 0.000000 1.096155 -1.880942
vn 0.5234 0.4466 -0.7257
vn 0.9042 0.4270 0.0000
vn 0.5234 0.4466 0.7257
vn -0.5234 0.4466 0.7257
vn 0.0000 1.0000 -0.0000
vn -0.9042 0.4270 0.0000
vn -0.5234 0.4466 -0.7257
vn 0.0000 -1.0000 0.0000
vn -0.3965 0.6697 -0.6279
vn -0.4287 0.5949 -0.6800
vn -0.4397 0.5728 -0.6918
vn -0.4658 0.4992 -0.7307
vn -0.4911 0.4147 -0.7660
vn -0.7621 0.6475 0.0000
vn -0.8203 0.5719 0.0000
vn -0.8353 0.5498 0.0000
vn -0.8789 0.4771 0.0000
vn -0.9189 0.3946 0.0000
vn -0.3965 0.6697 0.6279
vn -0.4287 0.5948 0.6800
vn -0.4397 0.5728 0.6918
vn -0.4658 0.4992 0.7307
vn -0.4911 0.4147 0.7660
vn 0.3965 0.6697 0.6279
vn 0.4287 0.5949 0.6800
vn 0.4397 0.5728 0.6918
vn 0.4658 0.4992 0.7307
vn 0.4911 0.4147 0.7660
vn 0.7621 0.6475 0.0000
vn 0.8203 0.5719 0.0000
vn 0.8353 0.5498 0.0000
vn 0.8789 0.4771 0.0000
vn 0.9189 0.3946 0.0000
vn 0.3965 0.6697 -0.6279
vn 0.4287 0.5949 -0.6800
vn 0.4397 0.5728 -0.6918
vn 0.4658 0.4992 -0.7307
vn 0.4911 0.4147 -0.7660
vn 0.2450 -0.9539 0.1731
vn 0.4976 -0.8674 0.0000
vn 0.2450 -0.9539 -0.1731
vn -0.2450 -0.9539 -0.1731
vn -0.4976 -0.8674 0.0000
vn -0.2450 -0.9539 0.1731
vn -0.1595 -0.9825 0.0959
vn -0.3313 -0.9435 0.0000
vn -0.1595 -0.9825 -0.0959
vn 0.1595 -0.9825 -0.0959
vn 0.3313 -0.9435 0.0000
vn 0.1595 -0.9825 0.0959
vn -0.1251 -0.9891 0.0775
vn -0.2580 -0.9661 0.0000
vn -0.1251 -0.9891 -0.0775
vn 0.1251 -0.9891 -0.0775
vn 0.2580 -0.9661 0.0000
vn 0.1251 -0.9891 0.0775
vn -0.0959 -0.9940 0.0526
vn -0.1981 -0.9802 0.0000
vn -0.0959 -0.9940 -0.0526
vn 0.0959 -0.9940 -0.0526
vn 0.1981 -0.9802 0.0000
vn 0.0959 -0.9940 0.0526
vn -0.0924 -0.9938 0.0613
vn -0.1959 -0.9806 0.0000
vn -0.0924 -0.9938 -0.0613
vn 0.0924 -0.9938 -0.0613
vn 0.1959 -0.9806 0.0000
vn 0.0924 -0.9938 0.0613
vn -0.0757 -0.9960 0.0475
vn -0.1566 -0.9877 0.0000
vn -0.0757 -0.9960 -0.0475
vn 0.0757 -0.9960 -0.0475
vn 0.1566 -0.9877 0.0000
vn 0.0757 -0.9960 0.0475
usemtl Material.004
s off
f 55//9 14//9 16//9 56//9
f 56//10 16//10 18//10 57//10
f 57//11 18//11 20//11 58//11
f 58//12 20//12 22//12 59//12
f 16//13 14//13 24//13 22//13 20//13 18//13
f 59//14 22//14 24//14 60//14
f 60//15 24//15 14//15 55//15
f 13//16 15//16 17//16 19//16 21//16 23//16
f 89//17 54//17 25//17 90//17
f 84//18 53//18 26//18 79//18
f 78//19 52//19 27//19 73//19
f 72//20 51//20 28//20 67//20
f 66//21 50//21 29//21 61//21
f 88//22 49//22 54//22 89//22
f 83//23 48//23 53//23 84//23
f 77//24 47//24 52//24 78//24
f 71//25 46//25 51//25 72//25
f 65//26 45//26 50//26 66//26
f 87//27 44//27 49//27 88//27
f 82//28 43//28 48//28 83//28
f 76//29 42//29 47//29 77//29
f 70//30 41//30 46//30 71//30
f 64//31 40//31 45//31 65//31
f 86//32 39//32 44//32 87//32
f 81//33 38//33 43//33 82//33
f 75//34 37//34 42//34 76//34
f 69//35 36//35 41//35 70//35
f 63//36 35//36 40//36 64//36
f 85//37 34//37 39//37 86//37
f 80//38 33//38 38//38 81//38
f 74//39 32//39 37//39 75//39
f 68//40 31//40 36//40 69//40
f 62//41 30//41 35//41 63//41
f 90//42 25//42 34//42 85//42
f 79//43 26//43 33//43 80//43
f 73//44 27//44 32//44 74//44
f 67//45 28//45 31//45 68//45
f 61//46 29//46 30//46 62//46
f 50//47 60//47 55//47 29//47
f 45//48 59//48 60//48 50//48
f 40//49 58//49 59//49 45//49
f 35//50 57//50 58//50 40//50
f 30//51 56//51 57//51 35//51
f 29//52 55//52 56//52 30//52
f 28//53 61//53 62//53 31//53
f 31//54 62//54 63//54 36//54
f 36//55 63//55 64//55 41//55
f 41//56 64//56 65//56 46//56
f 46//57 65//57 66//57 51//57
f 51//58 66//58 61//58 28//58
f 27//59 67//59 68//59 32//59
f 32//60 68//60 69//60 37//60
f 37//61 69//61 70//61 42//61
f 42//62 70//62 71//62 47//62
f 47//63 71//63 72//63 52//63
f 52//64 72//64 67//64 27//64
f 26//65 73//65 74//65 33//65
f 33//66 74//66 75//66 38//66
f 38//67 75//67 76//67 43//67
f 43//68 76//68 77//68 48//68
f 48//69 77//69 78//69 53//69
f 53//70 78//70 73//70 26//70
f 25//71 79//71 80//71 34//71
f 34//72 80//72 81//72 39//72
f 39//73 81//73 82//73 44//73
f 44//74 82//74 83//74 49//74
f 49//75 83//75 84//75 54//75
f 54//76 84//76 79//76 25//76
f 13//77 90//77 85//77 15//77
f 15//78 85//78 86//78 17//78
f 17//79 86//79 87//79 19//79
f 19//80 87//80 88//80 21//80
f 21//81 88//81 89//81 23//81
f 23//82 89//82 90//82 13//82
o Icosphere_Icosphere.001
v 0.029476 -0.814124 0.035349
v 2.200298 -0.537734 1.612525
v -0.799688 -0.537734 2.587297
v -2.653803 -0.537732 0.035349
v -0.799688 -0.537734 -2.516598
v 2.200298 -0.537734 -1.541827
v 0.858640 -0.090514 2.587297
v -2.141346 -0.090514 1.612525
v -2.141346 -0.090514 -1.541827
v 0.858640 -0.090514 -2.516598
v 2.712754 -0.090516 0.035349
v 0.029476 0.185876 0.035349
v -0.457891 -0.739451 1.535335
v 1.305444 -0.739451 0.962383
v 0.818082 -0.576993 2.462384
v 2.581419 -0.576992 0.035349
v 1.305444 -0.739451 -0.891685
v -1.547714 -0.739450 0.035349
v -2.035092 -0.576992 1.535340
v -0.457891 -0.739451 -1.464637
v -2.035092 -0.576992 -1.464642
v 0.818082 -0.576993 -2.391686
v 2.882649 -0.314124 0.962387
v 2.882649 -0.314124 -0.891689
v 0.029476 -0.314124 3.035349
v 1.792833 -0.314124 2.462399
v -2.823698 -0.314124 0.962387
v -1.733881 -0.314124 2.462399
v -1.733881 -0.314124 -2.391701
v -2.823698 -0.314124 -0.891689
v 1.792833 -0.314124 -2.391701
v 0.029476 -0.314124 -2.964651
v 2.094044 -0.051256 1.535340
v -0.759131 -0.051255 2.462384
v -2.522468 -0.051256 0.035349
v -0.759131 -0.051255 -2.391686
v 2.094044 -0.051256 -1.464642
v 0.516843 0.111203 1.535335
v 1.606665 0.111202 0.035349
v -1.246492 0.111203 0.962383
v -1.246492 0.111203 -0.891685
v 0.516843 0.111203 -1.464637
vn 0.0181 -0.9983 0.0556
vn 0.1733 -0.9826 0.0663
vn -0.0473 -0.9983 0.0343
vn -0.0473 -0.9983 -0.0343
vn 0.0181 -0.9983 -0.0556
vn 0.4122 -0.9029 0.1221
vn 0.0113 -0.9029 0.4297
vn -0.4052 -0.9029 0.1435
vn -0.2617 -0.9029 -0.3410
vn 0.2435 -0.9029 -0.3543
vn 0.6442 -0.6050 0.4680
vn -0.2461 -0.6050 0.7573
vn -0.7962 -0.6050 0.0000
vn -0.2461 -0.6050 -0.7573
vn 0.6442 -0.6050 -0.4680
vn 0.1012 0.9826 0.1555
vn -0.1166 0.9826 0.1443
vn -0.1733 0.9826 -0.0663
vn 0.0095 0.9826 -0.1853
vn 0.1792 0.9826 -0.0482
vn 0.0473 0.9983 -0.0343
vn 0.1022 0.9920 -0.0742
vn 0.1012 0.9826 -0.1555
vn -0.0181 0.9983 -0.0556
vn -0.0390 0.9920 -0.1201
vn -0.1166 0.9826 -1.1443
vn -0.0584 0.9983 0.0000
vn -0.1263 0.9920 0.0000
vn -0.1733 0.9826 0.0663
vn -0.0181 0.9983 0.0556
vn -0.0390 0.9920 0.1201
vn 0.0095 0.9826 0.1853
vn 0.0473 0.9983 0.0343
vn 0.1022 0.9920 0.0742
vn 0.1792 0.9826 0.0482
vn 0.4052 0.9029 -0.1435
vn 0.5319 0.7534 -0.3865
vn 0.2617 0.9029 -0.3410
vn -0.0113 0.9029 -0.4297
vn -0.2032 0.7535 -0.6253
vn -0.2435 0.9029 -0.3543
vn -0.4122 0.9029 -0.1221
vn -0.6575 0.7535 0.0000
vn -0.4122 0.9029 0.1221
vn -0.2435 0.9029 0.3543
vn -0.2032 0.7535 0.6253
vn -0.0113 0.9029 0.4297
vn 0.2617 0.9029 0.3410
vn 0.5319 0.7534 0.3865
vn 0.4052 0.9029 0.1435
vn 0.2461 0.6050 -0.7573
vn 0.2032 -0.7535 -0.6253
vn 0.0113 -0.9029 -0.4297
vn -0.6442 0.6050 -0.4680
vn -0.5319 -0.7534 -0.3865
vn -0.4052 -0.9029 -0.1435
vn -0.6442 0.6050 0.4680
vn -0.5319 -0.7534 0.3865
vn -0.2617 -0.9029 0.3410
vn 0.2461 0.6050 0.7573
vn 0.2032 -0.7535 0.6253
vn 0.2435 -0.9029 0.3543
vn 0.7962 0.6050 0.0000
vn 0.6575 -0.7535 0.0000
vn 0.4122 -0.9029 -0.1221
vn 0.1166 -0.9826 -0.1443
vn 0.0390 -0.9920 -0.1201
vn -0.0095 -0.9826 -0.1853
vn -0.1012 -0.9826 -0.1555
vn -0.1022 -0.9920 -0.0742
vn -0.1792 -0.9826 -0.0482
vn -0.1792 -0.9826 0.0482
vn -0.1022 -0.9920 0.0742
vn -0.1012 -0.9826 0.1555
vn 0.1733 -0.9826 -0.0663
vn 0.1263 -0.9920 0.0000
vn 0.0584 -0.9983 0.0000
vn -0.0095 -0.9826 0.1853
vn 0.0390 -0.9920 0.1201
vn 0.1166 -0.9826 0.1443
usemtl Material.002
s off
f 91//83 104//83 103//83
f 92//84 104//84 106//84
f 91//85 103//85 108//85
f 91//86 108//86 110//86
f 91//87 110//87 107//87
f 92//88 106//88 113//88
f 93//89 105//89 115//89
f 94//90 109//90 117//90
f 95//91 111//91 119//91
f 96//92 112//92 121//92
f 92//93 113//93 116//93
f 93//94 115//94 118//94
f 94//95 117//95 120//95
f 95//96 119//96 122//96
f 96//97 121//97 114//97
f 97//98 123//98 128//98
f 98//99 124//99 130//99
f 99//100 125//100 131//100
f 100//101 126//101 132//101
f 101//102 127//102 129//102
f 129//103 132//103 102//103
f 129//104 127//104 132//104
f 127//105 100//105 132//105
f 132//106 131//106 102//106
f 132//107 126//107 131//107
f 126//108 99//108 131//108
f 131//109 130//109 102//109
f 131//110 125//110 130//110
f 125//111 98//111 130//111
f 130//112 128//112 102//112
f 130//113 124//113 128//113
f 124//114 97//114 128//114
f 128//115 129//115 102//115
f 128//116 123//116 129//116
f 123//117 101//117 129//117
f 114//118 127//118 101//118
f 114//119 121//119 127//119
f 121//120 100//120 127//120
f 122//121 126//121 100//121
f 122//122 119//122 126//122
f 119//123 99//123 126//123
f 120//124 125//124 99//124
f 120//125 117//125 125//125
f 117//126 98//126 125//126
f 118//128 124//128 98//128
f 118//129 115//129 124//129
f 115//130 97//130 124//130
f 116//131 123//131 97//131
f 116//132 113//132 123//132
f 113//133 101//133 123//133
f 121//134 122//134 100//134
f 121//135 112//135 122//135
f 112//136 95//136 122//136
f 119//137 120//137 99//137
f 119//138 111//138 120//138
f 111//139 94//139 120//139
f 117//140 118//140 98//140
f 117//141 109//141 118//141
f 109//142 93//142 118//142
f 115//143 116//143 97//143
f 115//144 105//144 116//144
f 105//145 92//145 116//145
f 113//146 114//146 101//146
f 113//147 106//147 114//147
f 106//148 96//148 114//148
f 107//149 112//149 96//149
f 107//150 110//150 112//150
f 110//151 95//151 112//151
f 110//152 111//152 95//152
f 110//153 108//153 111//153
f 108//154 94//154 111//154
f 108//155 109//155 94//155
f 108//156 103//156 109//156
f 103//157 93//157 109//157
f 106//158 107//158 96//158
f 106//159 104//159 107//159
f 104//160 91//160 107//160
f 103//161 105//161 93//161
f 103//162 104//162 105//162
f 104//163 92//163 105//163
`;
}

function getMtlFileAsString(): string {
  return `
# Blender MTL File: 'pine.blend'
# Material Count: 3

newmtl Material.002
Ns 96.078431
Ka 1.000000 1.000000 1.000000
Kd 0.273907 0.246913 0.024335
Ks 0.500000 0.500000 0.500000
Ke 0.000000 0.000000 0.000000
Ni 1.000000
d 1.000000
illum 2

newmtl Material.003
Ns 96.078431
Ka 1.000000 1.000000 1.000000
Kd 0.106295 0.042289 0.050408
Ks 0.500000 0.500000 0.500000
Ke 0.000000 0.000000 0.000000
Ni 1.000000
d 1.000000
illum 2

newmtl Material.004
Ns 96.078431
Ka 1.000000 1.000000 1.000000
Kd 0.022741 0.265961 0.240435
Ks 0.500000 0.500000 0.500000
Ke 0.000000 0.000000 0.000000
Ni 1.000000
d 1.000000
illum 2
`;
}

