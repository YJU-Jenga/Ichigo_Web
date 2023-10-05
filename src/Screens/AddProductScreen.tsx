import axios, { AxiosError } from "axios";
import React, { SyntheticEvent, useState } from "react";
import Swal from "sweetalert2";
import { UserProps } from "../App";
import { Navigate, useNavigate } from "react-router-dom";
import { getCookie } from "../cookie";
import { API_URL } from "../config";

const AddProductScreen = ({ user }: UserProps) => {
  if (user == undefined || !user.permission) {
    alert("권한이 없습니다.");
    window.location.replace("/");
  }
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    stock: 0,
    type: true,
  });

  const [file, setFile] = useState<File | null>(null);
  // 상품추가 함수
  const AddProduct = async (e: SyntheticEvent) => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    try {
      e.preventDefault();
      const headers = {
        "Content-Type": "Multipart/form-data",
        Authorization: `Bearer ${token}`,
      };
      const AddProductUrl = `${API_URL}/product/create`;
      const body = new FormData();

      if (file === null) {
        Swal.fire({
          icon: "error",
          text: "商品のイメージを登録してください",
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      if (form.name.length <= 0) {
        throw new Error("商品名を記入してください");
      }
      if (form.price.toString().length <= 0) {
        throw new Error("商品の価格を記入してください");
      }
      if (form.description.length <= 0) {
        throw new Error("商品の説明を記入してください");
      }
      if (form.stock.toString().length <= 0) {
        throw new Error("商品の在庫を記入してください");
      }

      body.append("file", file);
      body.append("name", JSON.stringify({ name: form.name }));
      body.append("price", JSON.stringify({ price: form.price }));
      body.append(
        "description",
        JSON.stringify({ description: form.description })
      );
      body.append("stock", JSON.stringify({ stock: form.stock }));
      body.append("type", JSON.stringify({ type: form.type }));

      const res = await axios.post(AddProductUrl, body, { headers });
      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          text: "商品が追加されました",
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
          text: "管理者にお問い合わせください",
          showConfirmButton: false,
          timer: 1000,
        });
      } else if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "error",
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
            <h1 className="text-center text-2xl font-bold mb-10">商品登録</h1>
          ) : null}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                名前
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="名前"
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              ></input>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                価格
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="価格"
                onChange={(event) =>
                  setForm({ ...form, price: Number(event.target.value) })
                }
              ></input>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                商品の説明
              </label>
              <textarea
                placeholder="商品の説明を作成してください"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              ></textarea>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                在庫
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="number"
                placeholder="在庫"
                onChange={(event) =>
                  setForm({ ...form, stock: Number(event.target.value) })
                }
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                タイプ
              </label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(event) => {
                  if (event.target.value === "true") {
                    setForm({ ...form, type: true });
                  } else {
                    setForm({ ...form, type: false });
                  }
                }}
              >
                <option value="true">男の子用</option>
                <option value="false">女の子用</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                ファイル
              </label>
              <input
                type="file"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="ファイル"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const target = event.currentTarget;
                  const files = (target.files as FileList)[0];

                  if (files === undefined) {
                    return;
                  }

                  setFile(files);
                }}
              ></input>
            </div>
            <button
              className=" px-6 py-2 mx-auto block rounded-md text-lg font-semibold text-white bg-red-300  "
              onClick={AddProduct}
            >
              商品追加
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default AddProductScreen;
