import { NavLink, useNavigate } from "react-router-dom";
import { UserProps } from "../App";
import { SyntheticEvent, useEffect, useState } from "react";
import { Product } from "../dto/Product";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../config";
import { getCookie } from "../cookie";

const ProductScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState<Array<Product>>([]);
  const cartId: number = 1;
  const count: number = 1;

  // 상품정보 가져오기
  // 페이지가 나타나기전에 정보를 먼저 가져오기 위함 ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    getProductInfo();
  }, []);

  const getProductInfo = async () => {
    const getProductUrl = `${API_URL}/product/getAll`;
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
  const addToCart = async (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    const addCartUrl = `${API_URL}/cart/addProduct`;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const body = {
      cartId,
      productId: id,
      count,
    };
    console.log(body);
    try {
      const res = await axios.post(addCartUrl, body, { headers });
      console.log(res, "시발");
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
      console.log(error, "시발 왜 안돼");
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
      <h1 className="text-gray-900 font-bold text-2xl">상품</h1>
      {user?.permission ? (
        <NavLink
          to={"/addproduct"}
          className="text-white bg-red-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-red-600"
        >
          상품추가
        </NavLink>
      ) : null}
      <div className="container px-5 py-24 mx-auto">
        <div className="py-6">
          {productInfo.map((product: Product) => {
            return (
              // w - 300px, h - 500px
              <>
                <NavLink
                  key={product.id}
                  to={`/viewproduct/${product.id}`}
                  className="w-full max-w-md  mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                  <div className="max-w-md mx-auto">
                    <div className="h-90">
                      <img src={`${API_URL}/${product.image}`} alt="" />
                    </div>
                    <div className="p-4 sm:p-6">
                      <p className="font-bold text-gray-700 text-[22px] leading-7 mb-1">
                        {product.name}
                      </p>
                      <div className="flex flex-row">
                        <p className="text-[17px] font-bold text-[#0FB478]">
                          ₩{" "}
                          {product.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </p>
                      </div>
                      <p className="text-[#7C7C80] font-[15px] mt-6">
                        {product.description}
                      </p>
                      <button
                        className="block mt-10 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform bg-[#FFC933] rounded-[14px] hover:bg-[#FFC933DD] focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-80"
                        onClick={(event) => {
                          addToCart(event, product.id);
                        }}
                      >
                        장바구니 담기
                      </button>
                    </div>
                  </div>
                </NavLink>
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductScreen;
