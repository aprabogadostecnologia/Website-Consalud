import { useEffect, useRef } from "react";

// Bottom "living ocean" decoration for the Vigía hero, rebuilt to move like
// WavesBackground: the ridge shape is recomputed from time-varying sine harmonics
// every frame (real undulation), instead of a static shape sliding sideways via CSS.
interface Layer {
  seed: number;
  centerFrac: number; // ridge vertical center, as a fraction of canvas height
  amp1Frac: number;
  amp2Frac: number;
  freq1: number;
  freq2: number;
  speed: number;
  phase: number;
  spacing: number; // dot pitch in px
  edgeZone: number; // px band where density fades in around the ridge
  alphaMul: number;
}

const LAYERS: Layer[] = [
  { seed: 1, centerFrac: 0.58, amp1Frac: 0.22, amp2Frac: 0.05, freq1: 2.5, freq2: 4.0, speed: 0.25, phase: 0.6, spacing: 9, edgeZone: 36, alphaMul: 0.5 },
  { seed: 2, centerFrac: 0.74, amp1Frac: 0.14, amp2Frac: 0.035, freq1: 2.5, freq2: 4.0, speed: 0.38, phase: 2.4, spacing: 9, edgeZone: 30, alphaMul: 0.72 },
  { seed: 3, centerFrac: 0.9, amp1Frac: 0.08, amp2Frac: 0.02, freq1: 2.5, freq2: 4.0, speed: 0.5, phase: 4.1, spacing: 9, edgeZone: 22, alphaMul: 0.95 },
];

type Cell = { x: number; y: number; hashKeep: number; jitterX: number; jitterY: number; jitterR: number };
type Grid = { byCol: Cell[][] };

function buildGrid(layer: Layer, width: number, height: number): Grid {
  const hash = (i: number, j: number) => {
    const s = Math.sin(i * 127.1 + j * 311.7 + layer.seed * 17.13) * 43758.5453123;
    return s - Math.floor(s);
  };

  const cols = Math.ceil(width / layer.spacing);
  const rows = Math.ceil(height / layer.spacing);
  const byCol: Cell[][] = [];

  for (let ci = 0; ci <= cols; ci++) {
    const x = ci * layer.spacing;
    const col: Cell[] = [];
    for (let ri = 0; ri <= rows; ri++) {
      const y = ri * layer.spacing;
      col.push({
        x,
        y,
        hashKeep: hash(ci, ri),
        jitterX: (hash(ci * 5 + 3, ri * 11 + 1) - 0.5) * layer.spacing * 1.1,
        jitterY: (hash(ci * 7 + 2, ri * 13 + 5) - 0.5) * layer.spacing * 1.1,
        jitterR: hash(ci * 3 + 1, ri * 7 + 2),
      });
    }
    byCol.push(col);
  }

  return { byCol };
}

// Slow, low-frequency noise so density thickens and thins in patches along the
// ridge instead of reading as one perfectly even band
function clusterNoise(seed: number, ci: number) {
  const n =
    Math.sin(ci * 0.14 + seed * 3.1) * 0.5 +
    Math.sin(ci * 0.045 - seed * 1.7) * 0.35 +
    Math.sin(ci * 0.31 + seed * 5.9) * 0.15;
  return 0.5 + 0.5 * n;
}

export default function VigiaWaveParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let grids: Grid[] = [];
    let animationFrameId: number;
    let startTime: number | null = null;

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      grids = LAYERS.map((layer) => buildGrid(layer, width, height));
    };

    rebuild();
    const resizeObserver = new ResizeObserver(rebuild);
    resizeObserver.observe(canvas);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      LAYERS.forEach((layer, li) => {
        const grid = grids[li];
        if (!grid) return;

        const phase = elapsed * layer.speed + layer.phase;

        for (let ci = 0; ci < grid.byCol.length; ci++) {
          const col = grid.byCol[ci];
          if (col.length === 0) continue;

          const nx = col[0].x / width;
          const ridgeY =
            height * layer.centerFrac +
            height * layer.amp1Frac * Math.sin(nx * Math.PI * layer.freq1 - phase) +
            height * layer.amp2Frac * Math.sin(nx * Math.PI * layer.freq2 + phase * 1.6);

          const cluster = clusterNoise(layer.seed, ci);

          for (let ri = 0; ri < col.length; ri++) {
            const cell = col[ri];
            const depth = cell.y - ridgeY;
            if (depth < -layer.edgeZone) continue;

            const density = Math.max(0, Math.min(1, (depth + layer.edgeZone) / (layer.edgeZone * 2)));
            const baseProbability = depth > layer.edgeZone ? 0.88 : density * 0.92;
            const keepProbability = baseProbability * (0.35 + 0.65 * cluster);
            if (cell.hashKeep > keepProbability) continue;

            const radius = 0.5 + density * 1.9 + cell.jitterR * 1.1;
            const alpha = Math.min(0.9, 0.12 + density * 0.55 + cell.jitterR * 0.15) * layer.alphaMul;

            ctx.beginPath();
            ctx.fillStyle = `rgba(0, 239, 137, ${alpha})`;
            ctx.arc(cell.x + cell.jitterX, cell.y + cell.jitterY, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startTime = null;
          animationFrameId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01 }
    );
    visibilityObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute bottom-0 left-0 w-full h-full pointer-events-none select-none" />;
}
