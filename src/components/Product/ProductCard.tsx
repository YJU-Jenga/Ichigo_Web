import React, { SyntheticEvent, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Product } from "../../dto/Product";

const ProductCard = () => {
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState<Product>();
  const cartId = 1;
  const count = 1;

  // 상품정보 가져오기
  // 페이지가 나타나기전에 정보를 먼저 가져오기 위함 ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    getProductInfo();
  }, []);
  const getProductUrl = `http://localhost:5000/product/getAll`;
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
  // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // 장바구니 상품추가 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const addToCart = async (id: number) => {
    const addCartUrl = `http://localhost:5000/cart/addProduct`;
    const body = {
      count,
      cartId,
      productId: id,
    };
    const headers = { "Content-Type": "application/json" };
    try {
      const res = await axios.post(addCartUrl, body, { headers });
      console.log(res);
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
    <div className="py-6">
      {productInfo.map((product: Product) => {
        return (
          <div
            key={product.id}
            className="flex max-w-md bg-white shadow-lg rounded-lg overflow-hidden m-4"
          >
            <NavLink
              to={`/viewproduct/${product.id}`}
              className="w-1/3 bg-cover"
            >
              <img src={`http://localhost:5000/${product.image}`} alt="" />
            </NavLink>
            <div className="w-2/3 p-4">
              <h1 className="text-gray-900 font-bold text-2xl">
                {product.name}
              </h1>
              <p className="mt-2 text-gray-600 text-sm">
                {product.description}
              </p>
              <div className="flex item-center justify-between mt-3">
                <h1 className="text-gray-700 font-bold text-xl">
                  {product.price}₩
                </h1>
                <button
                  className="px-3 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded"
                  onClick={() => {
                    addToCart(product.id);
                  }}
                >
                  장바구니 담기
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ProductCard;
