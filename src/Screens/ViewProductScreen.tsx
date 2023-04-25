import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Product } from "../dto/Product";
import { API_URL } from "../config";
import { UserProps } from "../App";

const ViewProductScreen = ({ user }: UserProps) => {
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
    const url_product = `${API_URL}/product/getOne/${productId}`;
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
      <img src={`${API_URL}/${productDetail.image}`} alt="" />
      <div className="container ">
        <div className="container mx-auto">
          <h1 className="py-5 text-3xl font-bold">{productDetail.name}</h1>
          <div className="flex my-6">
            <div className="flex flex-col w-full p-8 text-gray-800 bg-white shadow-lg pin-r pin-y md:w-4/5 lg:w-4/5">
              <h1 className="py-2 text-2xl text-red-400">
                ₩{" "}
                {productDetail.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h1>
              <h1 className="py-2 text-2xl">{productDetail.description}</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProductScreen;
