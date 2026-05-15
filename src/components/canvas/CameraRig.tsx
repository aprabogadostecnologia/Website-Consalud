"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { lerp } from "@/utils";

interface CameraRigProps {
  scrollProgress: number;
  maxDepth?: number;
}

export default function CameraRig({ scrollProgress, maxDepth = 95 }: CameraRigProps) {
  const { camera } = useThree();
  const targetZRef = useRef(0);

  useFrame(() => {
    targetZRef.current = -scrollProgress * maxDepth;
    camera.position.z = lerp(camera.position.z, targetZRef.current, 0.1);
    camera.position.x = lerp(camera.position.x, 0, 0.05);
    camera.position.y = lerp(camera.position.y, 0, 0.05);
  });

  return null;
}
