import { useEffect, useRef } from "react";

export default function WavesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollYRef = useRef<number>(0);

  useEffect(() => {
    // Scroll listener to update scroll position and canvas opacity dynamically
    const handleScroll = () => {
      const scrollY = window.scrollY;
      scrollYRef.current = scrollY;

      // Starts fading in at scrollY = 150px, fully visible at 80% viewport height
      const startFade = 150;
      const endFade = window.innerHeight * 0.8;
      let targetOpacity = 0;
      
      if (scrollY > startFade) {
        targetOpacity = Math.min(0.25, ((scrollY - startFade) / (endFade - startFade)) * 0.25);
      } else {
        targetOpacity = 0;
      }

      if (canvasRef.current) {
        canvasRef.current.style.opacity = String(targetOpacity);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once at start to position correctly on page load
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      if (!canvas) return;
      // Fluid representation of viewport size
      width = window.innerWidth;
      height = window.innerHeight;

      // High-DPI support to ensure crystal clear lines on modern high-resolution screens
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mathematical grid values based exactly on the request description
    const COLS = 40;
    const ROWS = 22;
    const speed = 0.7;
    let startTime: number | null = null;

    // Color interpolation: #05123e (azul) → #7b2fff (violeta) → #ff8d2b (naranja)
    // Supports custom opacity adjustments
    const waveColor = (t: number, alphaMultiplier: number = 1.0) => {
      const clampedT = Math.max(0, Math.min(1, t));
      let r = 0, g = 0, b = 0;
      if (clampedT < 0.5) {
        const s = clampedT * 2;
        r = Math.round(5 + s * (123 - 5));
        g = Math.round(18 + s * (47 - 18));
        b = Math.round(62 + s * (255 - 62));
      } else {
        const s = (clampedT - 0.5) * 2;
        r = Math.round(123 + s * (255 - 123));
        g = Math.round(47 + s * (141 - 47));
        b = Math.round(255 + s * (32 - 255));
      }
      return `rgba(${r}, ${g}, ${b}, ${alphaMultiplier})`;
    };

    // Calculate grid points dynamically each frame
    const buildGrid = (elapsed: number, scrollOffset: number) => {
      const grid = [];
      const amp1 = height * 0.16; // Elegant wave depth relative to screen height
      const amp2 = height * 0.08;

      for (let row = 0; row < ROWS; row++) {
        const rowData = [];
        const ny = row / (ROWS - 1);
        const baseY = ny * height;

        for (let col = 0; col < COLS; col++) {
          const nx = col / (COLS - 1);
          const x = nx * width;

          // Compute dy with dual custom sine waves
          // Incorporate scrollOffset and vertical phase shifts so scrolling dynamically shifts the waves in multiple dimensions
          const verticalShift1 = ny + scrollOffset * 0.7;
          const verticalShift2 = ny + scrollOffset * 0.45;
          const dy =
            Math.sin(nx * Math.PI * 2.5 - elapsed * speed - scrollOffset + verticalShift1 * 1.2) * amp1 +
            Math.sin(nx * Math.PI * 4.0 - elapsed * speed * 1.5 - scrollOffset * 0.8 + verticalShift2 * 0.8) * amp2;

          rowData.push({ x, y: baseY + dy, nx, ny });
        }
        grid.push(rowData);
      }
      return grid;
    };

    // Draws curved paths beautifully across point sequences using quadratic curves
    const drawCurve = (pts: { x: number; y: number }[], color: string, lineWidth: number = 1.2) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length - 2; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    };

    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;
      if (!startTime) startTime = timestamp;

      const elapsed = (timestamp - startTime) / 1000;

      // Clean viewport clear
      ctx.clearRect(0, 0, width, height);

      // Scroll speed modifier determines how fast the ripples change phase based on physical scrolling
      const scrollOffset = scrollYRef.current * 0.0016;

      const grid = buildGrid(elapsed, scrollOffset);

      // Render HORIZONTAL row curves with custom step gradients
      for (let row = 0; row < ROWS; row++) {
        const color = waveColor(row / (ROWS - 1), 0.7); // Subtle opacity for natural blending
        drawCurve(grid[row], color, 1.2);
      }

      // Render VERTICAL column curves with a touch more transparent opacity to represent wire mesh density
      for (let col = 0; col < COLS; col++) {
        const colPts = [];
        for (let row = 0; row < ROWS; row++) {
          colPts.push(grid[row][col]);
        }
        const color = waveColor(col / (COLS - 1), 0.45);
        drawCurve(colPts, color, 0.95);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Performance protection: only render the wave background when it enters viewport
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startTime = null; // Reset to prevent large jumps on load
          animationFrameId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 select-none pointer-events-none transition-opacity duration-500"
      style={{ opacity: 0 }}
    />
  );
}
