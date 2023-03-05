import React, { useRef, useState } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";

export function Box(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [clicked, setClick] = useState(false);
  useFrame((state, delta) => (mesh.current.rotation.x += delta));

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={clicked ? 1.5 : 1}
      onClick={(e) => {
        setClick(!clicked);
      }}
      onPointerOver={(e) => {
        setHover(true);
      }}
      onPointerOut={(e) => {
        setHover(false);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
