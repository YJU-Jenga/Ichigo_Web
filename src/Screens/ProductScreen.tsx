import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button } from "@mui/material";
// import Itemuse from "./ItemuseScreen";
import { NavLink, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Product } from "../dto/Product";
import ProductCard from "../components/Product/ProductCard";

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
        <ProductCard />
      </div>
      <div className="flex items-center pb-5 border-b-2 border-gray-200 mb-5"></div>
      {/* <div className="grid place-items-center"><Itemuse /></div> */}
    </section>
  );
};

export default ProductScreen;
