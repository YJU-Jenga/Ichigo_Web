import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Group } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { folder, button, Leva, useControls } from "leva";
import { positions, width } from "@mui/system";
import { UserProps } from "../App";
import { useParams } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

interface color {
  color: string;
}

const colors: color[] = [
  {
    color: "ff4040",
  },
  {
    color: "FF0000",
  },
  {
    color: "FF3366",
  },
  {
    color: "CC33FF",
  },
  {
    color: "0099FF",
  },
  {
    color: "FFCC00",
  },
  {
    color: "66FF33",
  },
  {
    color: "66FFCC",
  },
  {
    color: "FB8114",
  },
  {
    color: "99b899",
  },
  {
    color: "feceab",
  },
  {
    color: "ff847c",
  },
  {
    color: "e84a5f",
  },
  {
    color: "2a363b",
  },
];

export default function CustomScreen({ user }: UserProps) {
  const [sizes, setSizes] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [clothColor1, setColor1] = useState("#ffffff");
  const [clothColor2, setColor2] = useState("#ffffff");
  const [clothColor3, setColor3] = useState("#ffffff");
  const [clothColor4, setColor4] = useState("#ffffff");
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [select, SetSelect] = useState("cloth1");

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

  function viewColoth() {
    return (
      <div style={{ position: "absolute", padding: 0, margin: 0 }}>
        <div
          className="flex"
          style={{ border: "solid white 1px" }}
          onClick={() => {
            setVisible1(!visible1);
            setVisible2(false);
            setVisible3(false);
            setVisible4(false);
            SetSelect("cloth1");
          }}
        >
          <img src="img/cloth/QJ.png" width="100" />
          <input checked={visible1} type="checkbox"></input>
        </div>
        <div
          className="flex"
          style={{ border: "solid white 1px" }}
          onClick={() => {
            setVisible2(!visible2);
            setVisible1(false);
            setVisible4(false);
            SetSelect("cloth2");
          }}
        >
          <img src="img/cloth/T-Shirt.png" width="100" />
          <input checked={visible2} type="checkbox"></input>
        </div>
        <div
          className="flex"
          style={{ border: "solid white 1px" }}
          onClick={() => {
            setVisible3(!visible3);
            setVisible1(false);
            SetSelect("cloth3");
          }}
        >
          <img src="img/cloth/Jean.png" width="100" />
          <input checked={visible3} type="checkbox"></input>
        </div>
        <div
          className="flex"
          style={{ border: "solid white 1px" }}
          onClick={() => {
            setVisible4(!visible4);
            setVisible1(false);
            setVisible2(false);
            SetSelect("cloth4");
          }}
        >
          <img src="img/cloth/Hoodie.png" width="100" />
          <input checked={visible4} type="checkbox"></input>
        </div>
      </div>
    );
  }

  function buildColors(cloth: string) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          paddingLeft: "2vw",
          paddingRight: "2vw",
          margin: 0,
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          {colors.map((color) => (
            <div
              style={{
                background: `#${color.color}`,
                border: "solid 1px white",
                borderRadius: 25,
                width: "3vh",
                height: "3vh",
                display: "inline-block",
                marginRight: "1px",
              }}
              onClick={() => {
                switch (cloth) {
                  case "cloth1":
                    setColor1(`#${color.color}`);
                    break;
                  case "cloth2":
                    setColor2(`#${color.color}`);
                    break;
                  case "cloth3":
                    setColor3(`#${color.color}`);
                    break;
                  case "cloth4":
                    setColor4(`#${color.color}`);
                    break;
                }
              }}
            ></div>
          ))}
        </div>
        {/* 장바구니로 넘기기 */}
        <div>
          <button>
            <FaShoppingCart size={30} color="#fff"></FaShoppingCart>
          </button>
        </div>
      </div>
    );
  }

  function Model() {
    const { scene } = useLoader(GLTFLoader, "models/ted.gltf");
    // console.log(scene)

    return scene ? (
      <primitive
        object={scene}
        scale={0.5}
        children-5-visible={visible1}
        children-5-material-color={clothColor1}
        children-6-visible={visible1}
        children-6-material-color={clothColor1}
        children-7-visible={visible2}
        children-7-children-0-material-color={clothColor2}
        children-8-visible={visible3}
        children-8-children-0-material-color={clothColor3}
        children-9-visible={visible4}
        children-9-children-0-material-color={clothColor4}
      />
    ) : null;
  }

  return (
    <div
      style={{
        top: 52,
        height: sizes.height - 52,
        width: sizes.width,
      }}
    >
      <Canvas
        style={{ zIndex: 0, position: "absolute", padding: 0, margin: 0 }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
      {viewColoth()}
      {buildColors(select)}
      <Leva />
    </div>
  );
}
