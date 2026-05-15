"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function PortalRing({
  z, radius, rotSpeed, color, opacity,
}: {
  z: number; radius: number; rotSpeed: number; color: string; opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * rotSpeed;
  });
  return (
    <mesh ref={ref} position={[0, 0, z]}>
      <torusGeometry args={[radius, 0.065, 6, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.8}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function VortexParticles() {
  const COUNT = 3200;
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const c0 = new THREE.Color("#ff8d2b");
    const c1 = new THREE.Color("#0546f2");
    const c2 = new THREE.Color("#0a1a5c");

    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const angle = t * Math.PI * 28 + Math.random() * 0.5;
      const r = 0.5 + Math.random() * 3.5;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = -t * 135;

      const c =
        t < 0.35
          ? c0.clone().lerp(c1, t / 0.35)
          : c1.clone().lerp(c2, (t - 0.35) / 0.65);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.055;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function PortalCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 3 + Math.sin(clock.elapsedTime * 1.4) * 0.9;
    ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 0.7) * 0.05);
  });
  return (
    <mesh ref={ref} position={[0, 0, -120]}>
      <sphereGeometry args={[2.2, 32, 32]} />
      <meshStandardMaterial
        color="#ff8d2b"
        emissive="#ff8d2b"
        emissiveIntensity={3}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

const RING_COUNT = 24;

export default function PortalTunnel() {
  const rings = useMemo(
    () =>
      Array.from({ length: RING_COUNT }, (_, i) => {
        const t = i / (RING_COUNT - 1);
        return {
          z: -(i + 1) * 5.5,
          radius: 2.6 + i * 0.07,
          rotSpeed: (0.003 + i * 0.0002) * (i % 2 === 0 ? 1 : -1.3),
          color: t < 0.35 ? "#ff8d2b" : t < 0.65 ? "#0546f2" : "#152d80",
          opacity: Math.max(0.07, 0.9 - t * 0.6),
        };
      }),
    []
  );

  return (
    <>
      {rings.map((r, i) => (
        <PortalRing key={i} {...r} />
      ))}
      <VortexParticles />
      <PortalCore />
    </>
  );
}
