import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";

// Custom vertex shader for the background core
const noiseVertex = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;
  uniform float uTime;
  uniform float uSpike;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    float n = snoise(position * 2.0 + uTime * 0.4);
    float pulse = sin(uTime * 3.0) * 0.03;
    vec3 newPos = position + normal * (n * uSpike + pulse);
    vPos = newPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

// Beautiful fragment shader for the ethereal background plasma glow
const plasmaFragment = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPos;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPos);
    float fresnel = dot(viewDir, vNormal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 2.5);
    float scan = sin(vPos.y * 30.0 + uTime * 3.0) * 0.03;
    vec3 color = mix(uColorA, uColorB, fresnel + scan);
    color += uColorB * fresnel * 2.0; 
    gl_FragColor = vec4(color, 0.85);
  }
`;

// Advanced lens simulation shader for high-fidelity rendering
const AdvancedLensShader = {
  uniforms: {
    tDiffuse: { value: null },
    uAberration: { value: 0.003 },
    uDistortion: { value: 0.12 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uAberration;
    uniform float uDistortion;
    varying vec2 vUv;

    vec2 distort(vec2 uv, float k) {
      vec2 centered = uv - 0.5;
      float r2 = dot(centered, centered);
      float f = 1.0 + r2 * (k + k * sqrt(r2));
      return f * centered + 0.5;
    }

    void main() {
      vec2 uv = vUv;
      vec2 rUv = distort(uv, uDistortion - uAberration);
      vec2 gUv = distort(uv, uDistortion);
      vec2 bUv = distort(uv, uDistortion + uAberration);

      float r = texture2D(tDiffuse, rUv).r;
      float g = texture2D(tDiffuse, gUv).g;
      float b = texture2D(tDiffuse, bUv).b;

      float mask = 1.0;
      if(rUv.x < 0.0 || rUv.x > 1.0 || rUv.y < 0.0 || rUv.y > 1.0) mask = 0.0;
      if(bUv.x < 0.0 || bUv.x > 1.0 || bUv.y < 0.0 || bUv.y > 1.0) mask = 0.0;

      gl_FragColor = vec4(r, g, b, 1.0) * mask;
    }
  `
};

interface QuantumCoreBackgroundProps {
  hoverMode?: "vigia" | "bateria" | "nominal";
}

export default function QuantumCoreBackground({ hoverMode = "nominal" }: QuantumCoreBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep configuration targets inside refs so threejs ticks can read them cleanly without re-booting scene
  const targetColorRef = useRef<THREE.Color>(new THREE.Color(0x7c3aed)); // nominal violet
  const targetSpikeRef = useRef<number>(0.25);
  const targetSpeedRef = useRef<number>(1.0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update target values based on hover mode prop changes
  useEffect(() => {
    if (hoverMode === "vigia") {
      targetColorRef.current.set("#ff8d2b"); // Solid Vigía SST orange accent color
      targetSpikeRef.value = 0.65;
      targetSpeedRef.current = 4.0;
    } else if (hoverMode === "bateria") {
      targetColorRef.current.set("#3b82f6"); // Cool battery blue
      targetSpikeRef.value = 0.15;
      targetSpeedRef.current = 0.4;
    } else {
      targetColorRef.current.set("#7c3aed"); // Ethereal purple
      targetSpikeRef.value = 0.28;
      targetSpeedRef.current = 1.0;
    }
  }, [hoverMode]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // SCENE & COMPONENT GRAPH SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.015);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    // Adjusted camera slightly further back to behave nicely as full fullscreen background
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      powerPreference: "high-performance",
      alpha: true
    });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // MAIN AMBIENT PLASMA GEOMETRY
    const sphereGeo = new THREE.IcosahedronGeometry(2.4, 24);
    const sphereMat = new THREE.ShaderMaterial({
      vertexShader: noiseVertex,
      fragmentShader: plasmaFragment,
      uniforms: {
        uTime: { value: 0 },
        uSpike: { value: 0.28 },
        uColorA: { value: new THREE.Color("#020617") },
        uColorB: { value: new THREE.Color("#7c3aed") }
      },
      transparent: true,
      depthWrite: false
    });
    const core = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(core);

    // FLOATING ASTEROID PARTICLE SWARM
    const particleCount = 1500;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const r = 3.2 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * 0.7;
        positions[i*3] = r * Math.cos(theta);
        positions[i*3+1] = r * Math.sin(phi);
        positions[i*3+2] = r * Math.sin(theta);
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // INTEGRATED RENDERING PIPELINE
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // Glow bloom (moderated for bg purpose so it doesn't wash out real text)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(400, 300), 0.75, 0.4, 0.9);
    composer.addPass(bloomPass);

    // Subtle cinematic film scanline overlay
    const filmPass = new FilmPass();
    composer.addPass(filmPass);

    // Edge lens aberration configuration
    const lensPass = new ShaderPass(AdvancedLensShader);
    lensPass.uniforms.uAberration.value = 0.003;
    lensPass.uniforms.uDistortion.value = 0.1;
    composer.addPass(lensPass);

    // Mouse movement listener relative to Section wrapper to control camera flow
    const onMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.x = ((e.clientX - rect.left) - rect.width / 2) * 0.0003;
      mouseRef.current.y = ((e.clientY - rect.top) - rect.height / 2) * 0.0003;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ResizeObserver configuration to bind accurately with dynamic section layouts safely
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width);
        const height = Math.floor(entry.contentRect.height || 600);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height, false);
        composer.setSize(width, height);
      }
    });
    resizeObserver.observe(containerRef.current);

    // TICK RENDER LOOP
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Lerp dynamic uniforms
      sphereMat.uniforms.uTime.value = t;
      sphereMat.uniforms.uSpike.value += (targetSpikeRef.value - sphereMat.uniforms.uSpike.value) * 0.05;
      sphereMat.uniforms.uColorB.value.lerp(targetColorRef.current, 0.05);

      // Spin particles
      particles.rotation.y = -t * 0.04 * targetSpeedRef.current;
      particles.rotation.x = t * 0.01;
      particlesMat.color.lerp(targetColorRef.current, 0.05);

      // Camera layout animation
      camera.position.x += (mouseRef.current.x * 3.0 - camera.position.x) * 0.04;
      camera.position.y += (-mouseRef.current.y * 3.0 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      // Dynamic lens adjustments based on active card hover state (extreme warp effects mapped smoothly)
      if (hoverMode === "vigia") {
        lensPass.uniforms.uDistortion.value += (0.16 - lensPass.uniforms.uDistortion.value) * 0.05;
        lensPass.uniforms.uAberration.value += (0.008 - lensPass.uniforms.uAberration.value) * 0.05;
      } else if (hoverMode === "bateria") {
        lensPass.uniforms.uDistortion.value += (0.04 - lensPass.uniforms.uDistortion.value) * 0.05;
        lensPass.uniforms.uAberration.value += (0.001 - lensPass.uniforms.uAberration.value) * 0.05;
      } else {
        lensPass.uniforms.uDistortion.value += (0.09 - lensPass.uniforms.uDistortion.value) * 0.05;
        lensPass.uniforms.uAberration.value += (0.003 - lensPass.uniforms.uAberration.value) * 0.05;
      }

      composer.render();
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      sphereGeo.dispose();
      sphereMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, [hoverMode]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none rounded-3xl"
    >
      {/* Dynamic scanlines & matrix grid background layer strictly blended */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
      
      {/* WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block opacity-70 scale-105" 
      />
      
      {/* Subtle radial glow vignette over dark layout to merge edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#020617_95%)] opacity-90 pointer-events-none" />
    </div>
  );
}
