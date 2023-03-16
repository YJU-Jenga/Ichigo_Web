import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button } from "@mui/material";
// import Itemuse from "./ItemuseScreen";
import { NavLink, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Product } from "../dto/Product";

const ProductScreen = () => {
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState<Product>();
  const [count, setCount] = useState(1);
  const cartId = 1;
  const id = 1;
  const [productId, setProductId] = useState(1);

  // 상품정보 가져오기
  // 페이지가 나타나기전에 정보를 먼저 가져오기 위함
  useEffect(() => {
    getProductInfo();
  }, []);
  const getProductUrl = `http://localhost:5000/product/getOne/${id}`;
  const getProductInfo = async () => {
    try {
      const res = await axios.get(getProductUrl);
      setProductInfo(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "관리자에게 문의해주세요",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/product");
      }
    }
  };

  // 장바구니 상품추가 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const addCartUrl = `http://localhost:5000/cart/addProduct`;
  const body = {
    count,
    cartId,
    productId,
  };
  const addToCart = async (e: SyntheticEvent) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };
    try {
      const res = await axios.post(addCartUrl, body, { headers });
      if (res.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "장바구니로 이동합니다.",
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
          text: "관리자에게 문의해주세요",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/product");
      }
    }
  };
  // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  if (!productInfo) {
    return <></>;
  }
  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img
            className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200"
            src={`http://localhost:5000/${productInfo?.image}`}
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              Korea's best AI
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {productInfo.name}
            </h1>
            <p className="leading-relaxed">{productInfo.description}</p>
            <div className="flex items-center pb-5 border-b-2 border-gray-200 mb-5"></div>
            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">
                {productInfo.price} ₩
              </span>
              <button
                onClick={addToCart}
                className="flex ml-3 text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
              >
                구매
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center pb-5 border-b-2 border-gray-200 mb-5"></div>
      {/* <div className="grid place-items-center"><Itemuse /></div> */}
    </section>
  );
};

export default ProductScreen;
