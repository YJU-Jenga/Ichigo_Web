import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { folder, useControls } from 'leva'
import { Model } from "./Model";

function Box(props: ThreeElements['mesh']) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false);
  const [clicked, setClick] = useState(false);
  useFrame((state, delta) => (mesh.current.rotation.x += delta));

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={clicked? 1.5 : 1}
      onClick={(e)=>{setClick(!clicked)}}
      onPointerOver={(e)=>{setHover(true)}}
      onPointerOut={(e)=>{setHover(false)}}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function CustomScreen() {
  const [sizes, setSizes] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const options = useMemo(() => {
    return {
      position: folder({
        px: {value: 10, min: 0, max: 50, step: 1},
        py: {value: 10, min: 0, max: 50, step: 1},
        pz: {value: 10, min: 0, max: 50, step: 1},
      }),
      rotation: folder({
        rx: {value: 0, min: 0, max: Math.PI * 2, step: 0.01},
        ry: {value: 0, min: 0, max: Math.PI * 2, step: 0.01},
        rz: {value: 0, min: 0, max: Math.PI * 2, step: 0.01},
      }),
      meterial: folder({
        scale: folder({
          sx: {value: 1, min: 0.5, max: 2, step: 0.1},
          sy: {value: 1, min: 0.5, max: 2, step: 0.1},
          sz: {value: 1, min: 0.5, max: 2, step: 0.1},
        }),
        visible: true,
        color: {value: 'lime'}
      })
    }
  }, [])

  // const BoxControl = useControls('Box', options)

  useEffect(()=>{
    const resizeHandler = () => {
      setSizes({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", resizeHandler);
    return () => {window.removeEventListener("resize", resizeHandler)}
  }, [])

  return (
    <div style={{height: sizes.height - 60 ,width: sizes.width}}>
      <Canvas>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5}/>
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Model src="models/ted.gltf" />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
