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

  // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  if (!productInfo) {
    return <></>;
  }
  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      <h1 className="font-bold text-2xl px-8">상품</h1>
      {user?.permission ? (
        <NavLink
          to={"/addproduct"}
          className="text-white bg-red-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-red-600"
        >
          상품추가
        </NavLink>
      ) : null}
      <div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {productInfo.map((product: Product) => {
              return (
                <>
                  <NavLink
                    to={`/viewproduct/${product.id}`}
                    key={product.id}
                    className=" bg-white border border-gray-200 rounded-lg shadow m-2 h-auto max-w-full "
                  >
                    <a href="#">
                      <img
                        className="rounded-t-lg"
                        src={`${API_URL}/${product.image}`}
                        alt=""
                      />
                    </a>
                    <div className="p-5">
                      <a href="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                          {product.name}
                        </h5>
                      </a>
                      <p className="mb-3 font-normal text-gray-700">
                        {product.description}
                      </p>
                      <p className="text-[17px] font-bold text-[#0FB478]">
                        {product.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        원
                      </p>
                    </div>
                  </NavLink>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductScreen;
