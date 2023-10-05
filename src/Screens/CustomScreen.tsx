import React, {
  Suspense,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Group } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { folder, button, Leva, useControls } from "leva";
import { positions, width } from "@mui/system";
import { UserProps } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { API_URL, BUCKET_URL } from "../config";
import axios, { AxiosError } from "axios";
import { getCookie } from "../cookie";
import Swal from "sweetalert2";
import { Clothes } from "../dto/Clothes";

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
  const navigate = useNavigate();
  const { productId } = useParams();
  const [hasModel, setHasModel] = useState(false);
  const [hasClothes, setHasClothes] = useState(false);
  const [model, setModel] = useState("");
  const [clothes, setClothes] = useState<Clothes[]>([]);
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
    if (productId != undefined) {
      findModel(parseInt(productId));
      findClothes(parseInt(productId));
    } else {
      setHasModel(false);
      setHasClothes(false);
    }
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

  const submit = async (e: SyntheticEvent) => {
    try {
      if (productId == null) return;
      e.preventDefault();
      if (user == undefined) return;
      const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const userId = user?.id;
      const CartIdUrl = `${API_URL}/cart/findCartId/${userId}`;
      const cartIdRes = await axios.get(CartIdUrl, { headers });
      const cartId = cartIdRes.data;
      const clothesIds: number[] = [];
      const colors: string[] = [];

      if (visible1) {
        clothesIds.push(clothes[0].id);
        colors.push(clothColor1);
      }

      if (visible2) {
        clothesIds.push(clothes[1].id);
        colors.push(clothColor2);
      }

      if (visible3) {
        clothesIds.push(clothes[2].id);
        colors.push(clothColor3);
      }

      if (visible4) {
        clothesIds.push(clothes[3].id);
        colors.push(clothColor4);
      }

      const body = {
        cartId: cartId,
        productId: parseInt(productId),
        count: 1,
        clothesIds: clothesIds,
        colors: colors,
      };
      const purchase_url = `${API_URL}/cart/addProductWithOption`;
      console.log(body);
      const res = await axios.post(purchase_url, body, { headers });
      if (res.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "カートへ移動します",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/cart");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "管理者にお問い合わせください",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/");
      }
    }
  };

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
          <img src={BUCKET_URL + clothes[0].file.toString()} width="100" />
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
          <img src={BUCKET_URL + clothes[1].file.toString()} width="100" />
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
          <img src={BUCKET_URL + clothes[2].file.toString()} width="100" />
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
          <img src={BUCKET_URL + clothes[3].file.toString()} width="100" />
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
                width: "4vh",
                height: "4vh",
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
        <FaShoppingCart
          size={30}
          onClick={submit}
          color="#fff"
        ></FaShoppingCart>
      </div>
    );
  }

  const findClothes = async (productId: number) => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const url = `${API_URL}/clothes/getAll/${productId}`;
    const res = await axios.get(url, { headers });
    if (res.data != undefined) {
      const cloth: Clothes[] = res.data;
      cloth.forEach((item: Clothes) => {
        console.log(item);
        setClothes((prevArray) => [...prevArray, item]);
      });
      console.log(clothes);
      setHasClothes(true);
    } else {
      Swal.fire({
        icon: "error",
        text: "この商品はカスタマイズできません",
        showConfirmButton: false,
        timer: 1000,
      });
      navigate(`/viewproduct/${productId}`);
    }
  };

  const findModel = async (productId: number) => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const url = `${API_URL}/models/getModel/${productId}`;
    const res = await axios.get(url, { headers });
    if (res.data != undefined) {
      setHasModel(true);
      let path: string = res.data.file;
      path = BUCKET_URL + path;
      // console.log(path);
      setModel(path);
    } else {
      Swal.fire({
        icon: "error",
        text: "この商品はカスタマイズできません",
        showConfirmButton: false,
        timer: 1000,
      });
      navigate(`/viewproduct/${productId}`);
    }
  };

  function Model() {
    const { scene } = useLoader(GLTFLoader, `${model}`);
    // console.log(scene);

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
        position: "absolute",
        height: sizes.height - 58,
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
        {hasModel ? (
          <Suspense fallback={null}>
            <Model />
          </Suspense>
        ) : null}
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
      {hasClothes ? viewColoth() : null}
      {buildColors(select)}
      <Leva />
    </div>
  );
}
