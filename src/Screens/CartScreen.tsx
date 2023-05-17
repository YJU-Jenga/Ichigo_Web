import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, NavLink, Link, useLocation } from "react-router-dom";
import { Cart } from "../dto/Cart";
import { UserProps } from "../App";
import { CartToProduct } from "../dto/CartToProduct";
import { Product } from "../dto/Product";
import { getCookie } from "../cookie";
import { API_URL } from "../config";

const CartScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
  const [cartList, setCartList] = useState<Array<Cart>>([]);
  const [product, setProduct] = useState<Array<any>>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getCartList();
  }, [user]);

  let currentPath = "";
  let location = useLocation();

  useEffect(() => {
    if (currentPath === location.pathname) window.location.reload();

    currentPath = location.pathname;
  }, [location]);

  // 장바구니id로 장바구니 목록 가져오기 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const getCartList = async () => {
    if (user == undefined) return;
    const id = user?.id;

    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const url = `${API_URL}/cart/findAllProducts/${id}`;
    try {
      let totalP = 0;
      let totalC = 0;
      const res = await axios.get(url, { headers });
      setCartList(res.data);
      setProduct(res.data[0].cartToProducts);
      for (let i in res.data[0].cartToProducts) {
        totalC += res.data[0].cartToProducts[i].count;
      }
      setTotalCount(totalC);
      for (let i in res.data[0].cartToProducts) {
        totalP +=
          res.data[0].cartToProducts[i].count *
          res.data[0].cartToProducts[i].product.price;
      }
      setTotalPrice(totalP);
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
  // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // 상품 삭제
  const deleteProduct = async (id: number) => {
    const userId = user?.id;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const CartIdUrl = `${API_URL}/cart/findCartId/${userId}`;
    const res = await axios.get(CartIdUrl, { headers });
    const cartId = res.data;
    const deleteProductUrl = `${API_URL}/cart/deleteAddedProduct`;
    try {
      const res = await axios.delete(deleteProductUrl, {
        data: {
          cartId: cartId,
          productId: id,
        },
        headers,
      });
      if (res.status === 200) {
        console.log(res);
        Swal.fire({
          icon: "success",
          text: "상품이 장바구니에서 삭제되었습니다.",
          showConfirmButton: false,
          timer: 1000,
        });
        setCartList([]);
        const newProduct = [...product];
        for (let i in newProduct) {
          if (newProduct[i].productId === id) {
            setTotalCount(totalCount - newProduct[i].count);
            setTotalPrice(
              totalPrice - newProduct[i].product.price * newProduct[i].count
            );
          }
        }
        setProduct([]);
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

  // 상품개수 조절 ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const handleAdd = (id: number) => {
    const newProduct = [...product];
    for (let i in newProduct) {
      if (newProduct[i].productId === id) {
        newProduct[i].count++;
        setTotalCount(totalCount + 1);
        setTotalPrice(totalPrice + newProduct[i].product.price);
      }
    }
    setProduct(newProduct);
  };

  const handleSub = (id: number) => {
    const newProduct = [...product];
    for (let i in newProduct) {
      if (newProduct[i].productId === id) {
        newProduct[i].count--;
        setTotalCount(totalCount - 1);
        setTotalPrice(totalPrice - newProduct[i].product.price);
      }
    }
    setProduct(newProduct);
  };

  // 주문페이지로 넘기기, 반복문으로 상품 아이디랑 갯수 넘겨주기
  const goToPurchase = async () => {
    const id = user?.id;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const CartIdUrl = `${API_URL}/cart/findCartId/${id}`;
    const res = await axios.get(CartIdUrl, { headers });
    const cartId = res.data;
    const CartUpdateUrl = `${API_URL}/cart/updateAddedProduct/${cartId}`;
    const newProduct = [...product];
    console.log(newProduct);
    if (newProduct.length === 1) {
      const body = {
        productId: newProduct[0]?.productId,
        count: newProduct[0].count,
      };
      console.log(body);
      const res = await axios.patch(CartUpdateUrl, body, { headers });
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "주문페이지로 이동합니다.",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/purchase");
      }
    } else {
      for (let i in newProduct) {
        const body = {
          productId: newProduct[i]?.productId,
          count: newProduct[i].count,
        };
        console.log(body);
        const res = await axios.patch(CartUpdateUrl, body, { headers });
        console.log(res);
      }
      Swal.fire({
        icon: "success",
        text: "주문페이지로 이동합니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      navigate("/purchase");
    }
  };

  if (!cartList) {
    return (
      <>
        <h1>장바구니가 비어있습니다.</h1>
      </>
    );
  }
  return (
    <body className="bg-gray-100 h-screen">
      <div className="container mx-auto mt-10">
        <div className="flex shadow-md my-10">
          <div className="w-3/4 bg-white px-10 py-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl underline decoration-red-300">
                장바구니
              </h1>
              <h2 className="font-semibold text-2xl underline decoration-red-300">
                총 {totalCount}개 상품
              </h2>
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
            {/* tlqkf */}
            {cartList[0]?.cartToProducts.map((product: Product) => {
              return (
                <div
                  key={product.product.id}
                  className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5"
                >
                  <div className="flex w-2/5">
                    <div className="w-20">
                      <img
                        className="h-24"
                        src={`${API_URL}/${product?.product.image}`}
                      />
                    </div>
                    <div className="flex flex-col justify-between ml-4 flex-grow">
                      <span className="font-bold text-sm">
                        {product?.product.name}
                      </span>
                      <a
                        className="font-semibold hover:text-red-500 text-gray-500 text-xs"
                        onClick={() => deleteProduct(product?.product.id)}
                      >
                        삭제
                      </a>
                    </div>
                  </div>
                  <div className="flex justify-center w-1/5">
                    <svg
                      onClick={() => {
                        handleSub(product?.product.id);
                      }}
                      className="fill-current text-gray-600 w-3"
                      viewBox="0 0 448 512"
                    >
                      <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                    </svg>
                    <input
                      className="mx-2 border text-center w-8"
                      type="text"
                      value={product?.count}
                      readOnly
                    />
                    <svg
                      onClick={() => {
                        handleAdd(product?.product.id);
                      }}
                      className="fill-current text-gray-600 w-3"
                      viewBox="0 0 448 512"
                    >
                      <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                    </svg>
                  </div>
                  <span className="text-center w-1/5 font-semibold text-sm">
                    ₩{" "}
                    {product?.product.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                  <span className="text-center w-1/5 font-semibold text-sm">
                    ₩{" "}
                    {(product?.product.price * product?.count)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </div>
              );
            })}
            <NavLink
              to="/product"
              className="flex font-semibold text-red-300 text-sm mt-10"
            >
              <svg
                className="fill-current mr-2 text-red-300 w-4"
                viewBox="0 0 448 512"
              >
                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
              </svg>
              쇼핑 계속하기
            </NavLink>
          </div>

          <div id="summary" className="w-1/4 px-8 py-10">
            <h1 className="font-semibold text-2xl border-b pb-8 underline decoration-red-300">
              상품 합계
            </h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                총 {totalCount}개
              </span>
              {/* <span className="font-semibold text-sm"> ₩</span> */}
            </div>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>총 가격</span>
                <span>
                  ₩{" "}
                  {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                </span>
              </div>
              <button
                onClick={() => {
                  goToPurchase();
                }}
                className="bg-red-300 font-semibold hover:bg-red-200 py-3 text-sm text-white uppercase w-full"
              >
                주문하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};
export default CartScreen;
