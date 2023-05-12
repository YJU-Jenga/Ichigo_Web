import { NavLink, useNavigate } from "react-router-dom";
import { UserProps } from "../App";
import { useEffect, useState } from "react";
import { Product } from "../dto/Product";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../config";

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

  if (!productInfo) {
    return <></>;
  }
  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      <h1 className="font-bold text-2xl px-8">상품</h1>
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
      {user?.permission ? (
        <div className="group fixed bottom-0 right-0 p-2  flex items-end justify-end">
          <div className="flex items-center justify-center p-3 rounded-full z-50 absolute">
            <NavLink
              to={"/addproduct"}
              className="grid place-items-center p-0 w-16 h-16 bg-red-300 rounded-full hover:bg-red-100 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
            >
              <svg
                viewBox="0 0 20 20"
                enable-background="new 0 0 20 20"
                className="w-6 h-6 inline-block"
              >
                <path
                  fill="#FFFFFF"
                  d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                  C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                  C15.952,9,16,9.447,16,10z"
                />
              </svg>
            </NavLink>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ProductScreen;
