"use client";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import PortalTunnel from "./PortalTunnel";
import CameraRig from "./CameraRig";

interface PortalSceneProps {
  progress: number;
  className?: string;
}

export default function PortalScene({ progress, className }: PortalSceneProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 5], fov: 80 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "#020c28", pointerEvents: "none" }}
    >
      <fog attach="fog" args={["#020c28", 15, 135]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, -90]} color="#ff8d2b" intensity={70} distance={140} />
      <pointLight position={[0, 0, 2]} color="#0546f2" intensity={10} distance={18} />

      <Stars radius={100} depth={60} count={700} factor={2.5} saturation={0} fade speed={0.2} />

      <PortalTunnel />
      <CameraRig scrollProgress={progress} maxDepth={95} />
    </Canvas>
  );
}
