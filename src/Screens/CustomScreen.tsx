import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Group } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  GLTFExporter,
  GLTFExporterOptions,
} from "three/examples/jsm/exporters/GLTFExporter";
import { folder, button, Leva, useControls } from "leva";

function Model() {
  // const { scene } = useLoader(GLTFLoader,'models/ted.gltf');
  const { scene } = useLoader(GLTFLoader, "models/cloth.glb");

  function exportGLTF(scene: Group) {
    const gltfExporter = new GLTFExporter();
    const gltfoptions: GLTFExporterOptions = {
      binary: false,
      trs: false,
      onlyVisible: true,
      maxTextureSize: 4096,
      includeCustomExtensions: false,
    };

    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);

    function save(blob: Blob | MediaSource, filename: string) {
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }

    function saveString(text: BlobPart, filename: string) {
      save(new Blob([text], { type: "text/plain" }), filename);
    }

    function saveArrayBuffer(buffer: BlobPart, filename: string) {
      save(new Blob([buffer], { type: "application/octet-stream" }), filename);
    }

    gltfExporter.parse(
      scene,
      function (result) {
        if (result instanceof ArrayBuffer) {
          saveArrayBuffer(result, "scene.glb");
        } else {
          const output = JSON.stringify(result, null, 2);
          // console.log( output );
          saveString(output, "scene.gltf");
        }
      },
      function (error) {
        console.log("An error happened during parsing", error);
      },
      gltfoptions
    );
  }

  const { visible, color } = useControls("Teddy", {
    cloth1: folder({
      visible: true,
      color: { value: "white" },
    }),
    download: button(() => {
      exportGLTF(scene);
    }),
  });

  return (
    <primitive
      object={scene}
      scale={0.5}
      children-0-visible={visible}
      children-0-children-0-material-color={color}
    />
  );
}

export default function CustomScreen() {
  const [sizes, setSizes] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const resizeHandler = () => {
      setSizes({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div style={{ height: sizes.height - 60, width: sizes.width }}>
      <Canvas>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <Leva />
    </div>
  );
}
