import React, { SyntheticEvent, useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Product } from "../dto/Product";
import { API_URL, BUCKET_URL } from "../config";
import { UserProps } from "../App";
import { getCookie } from "../cookie";
import ItemUseScreen from "./ItemUseScreen";

const ViewProductScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();

  let { id } = useParams();
  const productId = Number(id);
  console.log(typeof productId);

  // 글 상세정보를 배열에 저장
  const [productDetail, setProductDetail] = useState<Product>();

  // 렌더링 전에 정보를 먼저 가져오기 위함
  useEffect(() => {
    getProductDetail();
  }, []);

  // 글 상세정보와 댓글을 가져오기 함수
  const getProductDetail = async () => {
    const url_product = `${API_URL}/product/getOne/${productId}`;
    try {
      const res = await axios.get(url_product);
      setProductDetail(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "管理者にお問い合わせください",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/product");
      }
    }
  };

  const addToCart = async (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    const addCartUrl = `${API_URL}/cart/addProduct`;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    if (user == undefined) return;
    const userId = user?.id;
    const CartIdUrl = `${API_URL}/cart/findCartId/${userId}`;
    const cartIdRes = await axios.get(CartIdUrl, { headers });
    const cartId = cartIdRes.data;
    const body = {
      cartId: cartId,
      productId: id,
      count: 1,
    };
    console.log(body);
    try {
      const res = await axios.post(addCartUrl, body, { headers });
      console.log(res, "시발");
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
      console.log(error, "시발 왜 안돼");
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "管理者にお問い合わせください",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/product");
      }
    }
  };

  const goToPurchase = async () => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const userId = user?.id;
    const CartUpdateUrl = `${API_URL}/cart/updateAddedProduct/${userId}`;
    const body = {
      productId: productId,
      count: 1,
    };
    const res = await axios.patch(CartUpdateUrl, body, { headers });
    if (res.status === 200) {
      Swal.fire({
        icon: "success",
        text: "注文ページに移動します",
        showConfirmButton: false,
        timer: 1000,
      });
      navigate("/purchase");
    }
  };

  if (!productDetail) {
    return <></>;
  }

  return (
    <>
      <section className="bg-white">
        <div className="container px-6 py-10 mx-auto">
          <div className="mt-8 lg:-mx-6 lg:flex lg:items-center">
            <img
              className="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-1/2 lg:h-1/2"
              src={`${BUCKET_URL}${productDetail.image}`}
              alt=""
            />
            <div className="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6 ">
              <p className="block mt-4 text-4xl font-bold text-gray-800 font-Line-bd">
                {productDetail.name}
              </p>

              <p className="mt-3 text-gray-500 text-xl font-Line-rg">
                {productDetail.description}
              </p>
              <h1 className="py-2 text-2xl text-red-400 font-bold">
                {productDetail.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                円
              </h1>
              <div className="flex">
                <button
                  className="position: static block mt-10 w-full px-4 py-3 mx-1 font-Line-bd tracking-wide text-center capitalize transition-colors duration-300 transform text-white bg-red-300 hover:bg-red-200 rounded-[14px]"
                  onClick={(event) => {
                    addToCart(event, productDetail.id);
                  }}
                >
                  カートに追加
                </button>
                <NavLink
                  to={`/custom/${productDetail.id}`}
                  className="position: static block mt-10 w-full px-4 py-3 mx-1 font-Line-bd tracking-wide text-center capitalize transition-colors duration-300 transform text-white bg-red-300 hover:bg-red-200 rounded-[14px]"
                >
                  カスタマイズ
                </NavLink>
                <button
                  className="block mt-10 w-full px-4 py-3 mx-1 font-Line-bd tracking-wide text-center capitalize transition-colors duration-300 transform text-white bg-red-300 hover:bg-red-200 rounded-[14px]"
                  onClick={() => {
                    goToPurchase();
                  }}
                >
                  購入
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className="mb-10" />
      <section className="grid place-items-center">
        <h1 className="text-gray-900 text-3xl title-font font-Line-bd mb-1 mx-10 underline decoration-red-300">
          この商品を購入された方のレビュー
        </h1>
        <ItemUseScreen user={undefined} />
      </section>
    </>
  );
};

export default ViewProductScreen;
