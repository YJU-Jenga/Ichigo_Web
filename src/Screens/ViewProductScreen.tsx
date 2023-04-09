import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Product } from "../dto/Product";

const ViewProductScreen = () => {
  const navigate = useNavigate();

  let { id } = useParams();
  const productId = id;
  console.log(productId);

  // 글 상세정보를 배열에 저장
  const [productDetail, setProductDetail] = useState<Product>();

  // 렌더링 전에 정보를 먼저 가져오기 위함
  useEffect(() => {
    getProductDetail();
  }, []);

  // 글 상세정보와 댓글을 가져오기 함수
  const getProductDetail = async () => {
    const url_product = `http://localhost:5000/product/getOne/${productId}`;
    try {
      const res = await axios.get(url_product);
      setProductDetail(res.data);
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
  if (!productDetail) {
    return <></>;
  }

  return (
    <>
      <h1>이름</h1>
      <h1>{productDetail.name}</h1>
      <h1>설명</h1>
      <h1>{productDetail.description}</h1>
      <h1>가격</h1>
      <h1>{productDetail.price}</h1>
      <h1>사진</h1>
      <img src={`http://localhost:5000/${productDetail.image}`} alt="" />
    </>
  );
};

export default ViewProductScreen;
