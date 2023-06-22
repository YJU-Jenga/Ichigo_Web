import axios, { AxiosError } from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { UserProps } from "../App";
import { Navigate, useNavigate } from "react-router-dom";
import { getCookie } from "../cookie";
import { API_URL } from "../config";
import { Product } from "../dto/Product";

const AddClothesScreen = ({ user }: UserProps) => {
  if (user == undefined || !user.permission) {
    alert("권한이 없습니다.");
    window.location.replace("/");
  }
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    productId: 0,
  });

  const [file, setFile] = useState<File | null>(null);
  const [productInfo, setProductInfo] = useState<Array<Product>>([]);

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

  const AddClothes = async (e: SyntheticEvent) => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    try {
      e.preventDefault();
      const headers = {
        "Content-Type": "Multipart/form-data",
        Authorization: `Bearer ${token}`,
      };
      const AddClothesUrl = `${API_URL}/clothes/create`;
      const body = new FormData();

      if (file === null) {
        Swal.fire({
          icon: "error",
          title: "옷 미등록",
          text: "옷을 등록해주세요",
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      if (form.name.length <= 0) {
        throw new Error("옷명을 입력해주세요");
      }

      body.append("file", file);
      body.append("name", JSON.stringify({ name: form.name }));
      body.append("productId", JSON.stringify({ productId: form.productId }));

      const res = await axios.post(AddClothesUrl, body, { headers });
      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          text: "옷이 추가되었습니다.",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/product");
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
      } else if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "입력 오류",
          text: error.message,
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
  };

  return (
    <form>
      <div className="bg-gray-200 min-h-screen md:px-20 pt-6">
        <div className=" bg-white rounded-md px-6 py-10 max-w-2xl mx-auto">
          {form ? (
            <h1 className="text-center text-2xl font-bold mb-10">옷 등록</h1>
          ) : null}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                상품
              </label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(event) => {
                  setForm({ ...form, productId: Number(event.target.value) });
                  console.log(form);
                }}
              >
                <option>선택</option>
                {productInfo.map((product: Product) => {
                  return (
                    <>
                      <option value={product?.id}>{product?.name}</option>
                    </>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                이름
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="이름"
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                파일
              </label>
              <input
                type="file"
                id="file"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const target = event.currentTarget;
                  const files = (target.files as FileList)[0];

                  if (files === undefined) {
                    return;
                  }

                  setFile(files);
                }}
              />
            </div>
            <button
              className=" px-6 py-2 mx-auto block rounded-md text-lg font-semibold text-white bg-red-300  "
              onClick={AddClothes}
            >
              옷 등록하기
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default AddClothesScreen;
