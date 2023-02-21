import React from "react";

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function Model(prop: { src: string }) {
  const gltf = useLoader(GLTFLoader, prop.src);
  return <primitive object={gltf.scene} scale={0.4} />;
}