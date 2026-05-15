"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import DataStream from "./DataStream";
import CameraRig from "./CameraRig";

interface JourneySceneProps {
  scrollProgress: number;
  className?: string;
}

export default function JourneyScene({ scrollProgress, className }: JourneySceneProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: false, alpha: false }}
      style={{ background: "#05123e" }}
    >
      <fog attach="fog" args={["#05123e", 30, 120]} />
      <ambientLight intensity={0.3} />

      {/* Background stars */}
      <Stars
        radius={80}
        depth={50}
        count={800}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Main particle tunnel */}
      <DataStream count={2500} />

      {/* Scroll-driven camera */}
      <CameraRig scrollProgress={scrollProgress} maxDepth={80} />
    </Canvas>
  );
}
