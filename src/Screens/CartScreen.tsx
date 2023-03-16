import axios, { AxiosError } from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, NavLink, Link, redirect } from "react-router-dom";
import { Cart } from "../dto/Cart";
import { Product } from "../dto/Product";

const CartScreen = () => {
  const navigate = useNavigate();
  const id = 1;
  const [cartList, setCartList] = useState<Array<Cart>>([]);
  const [productInfo, setProductInfo] = useState<Product>();
  const [count, setCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const url = `http://localhost:5000/cart/findAllProducts/${id}`;
  const purchaseUrl = `http://localhost:5000/order/create`;
  const [price, setPrice] = useState(0);

  useEffect(() => {
    getCartList();
  }, []);

  // 장바구니id로 장바구니 목록 가져오기 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const getCartList = async () => {
    try {
      const res = await axios.get(url);
      setCartList(res.data);
      setProductInfo(res.data[0].cartToProducts[0].product);
      setPrice(res.data[0].cartToProducts[0].product.price);
      setCount(res.data[0].cartToProducts.length);
      setTotalPrice(
        res.data[0].cartToProducts[0].product.price *
          res.data[0].cartToProducts.length
      );
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

  // 상품개수 조절 ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // 갯수+1
  const plusCount = () => {
    const plus = count + 1;
    setCount(plus);
  };
  // 갯수-1
  const minusCount = () => {
    if (count <= 1) {
      setCount(1);
    } else {
      const minus = count - 1;
      setCount(minus);
    }
  };
  // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // 총 금액 구하기
  const getTotalPrice = () => {
    setTotalPrice(price * count);
  };

  useEffect(() => {
    const calculatedPrice = price * count;
    setTotalPrice(calculatedPrice);
  }, [count]);

  if (!productInfo) {
    return <></>;
  }

  console.log(productInfo);
  return (
    <body className="bg-gray-100">
      <div className="container mx-auto mt-10">
        <div className="flex shadow-md my-10">
          <div className="w-3/4 bg-white px-10 py-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl">장바구니</h1>
              <h2 className="font-semibold text-2xl">총 {count}개 상품</h2>
            </div>
            <div className="flex mt-10 mb-5">
              <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">
                상품
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                수량
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                가격
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                총 가격
              </h3>
            </div>
            <div className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
              <div className="flex w-2/5">
                <div className="w-20">
                  <img
                    className="h-24"
                    src={`http://localhost:5000/${productInfo?.image}`}
                  />
                </div>
                <div className="flex flex-col justify-between ml-4 flex-grow">
                  <span className="font-bold text-sm">{productInfo?.name}</span>
                  <a
                    href="#"
                    className="font-semibold hover:text-red-500 text-gray-500 text-xs"
                  >
                    삭제
                  </a>
                </div>
              </div>
              <div className="flex justify-center w-1/5">
                <svg
                  onClick={() => {
                    minusCount();
                  }}
                  className="fill-current text-gray-600 w-3"
                  viewBox="0 0 448 512"
                >
                  <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
                <input
                  className="mx-2 border text-center w-8"
                  type="text"
                  onChange={getTotalPrice}
                  value={count}
                />
                <svg
                  onClick={() => {
                    plusCount();
                  }}
                  className="fill-current text-gray-600 w-3"
                  viewBox="0 0 448 512"
                >
                  <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                </svg>
              </div>
              <span className="text-center w-1/5 font-semibold text-sm">
                {productInfo?.price}
              </span>
              <span className="text-center w-1/5 font-semibold text-sm">
                {totalPrice}
              </span>
            </div>
            <NavLink
              to="/product"
              className="flex font-semibold text-indigo-600 text-sm mt-10"
            >
              <svg
                className="fill-current mr-2 text-indigo-600 w-4"
                viewBox="0 0 448 512"
              >
                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
              </svg>
              쇼핑 계속하기
            </NavLink>
          </div>

          <div id="summary" className="w-1/4 px-8 py-10">
            <h1 className="font-semibold text-2xl border-b pb-8">상품 합계</h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                총 {count}개
              </span>
              <span className="font-semibold text-sm">{totalPrice} ₩</span>
            </div>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>총 가격</span>
                <span>{totalPrice} ₩</span>
              </div>
              <Link
                to={`/purchase/${count}/${productInfo?.id}`}
                className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
              >
                주문하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};
export default CartScreen;
