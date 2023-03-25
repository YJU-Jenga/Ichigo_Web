import axios, { AxiosError } from "axios";
import { SyntheticEvent, useState } from "react";
import Swal from "sweetalert2";

const AddProductScreen = () => {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    stock: 0,
    type: true,
    file: null,
  });
  // 상품추가 함수
  const AddProduct = async (e: SyntheticEvent) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };
    const AddProductUrl = `http://localhost:5000/product/create`;
    const body = {
      name: form.name,
      price: form.price,
      description: form.description,
      stock: form.stock,
      type: form.type,
      file: form.file,
    };
    try {
      const res = await axios.post(AddProductUrl, body, { headers });
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "관리자에게 문의해주세요",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
  };
  return (
    <form>
      <div className="bg-indigo-50 min-h-screen md:px-20 pt-6">
        <div className=" bg-white rounded-md px-6 py-10 max-w-2xl mx-auto">
          <h1 className="text-center text-2xl font-bold text-gray-500 mb-10">
            상품 추가
          </h1>
          <div className="space-y-4">
            <div>
              <label className="text-lx">이름:</label>
              <input
                type="text"
                placeholder="name"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </div>
            <div>
              <label className="text-lx">가격:</label>
              <input
                type="number"
                placeholder="price"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
                onChange={(event) =>
                  setForm({ ...form, price: Number(event.target.value) })
                }
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">상품설명:</label>
              <textarea
                id="description"
                placeholder="상품설명을 작성해주세요"
                className="w-full p-4 text-gray-600 bg-indigo-50 outline-none rounded-md"
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              ></textarea>
            </div>
            <div>
              <label className="text-lx">수량:</label>
              <input
                type="number"
                placeholder="stock"
                id="email"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
                onChange={(event) =>
                  setForm({ ...form, stock: Number(event.target.value) })
                }
              />
            </div>
            <div>
              <label className="text-lx">타입: </label>
              <select
                onChange={(event) => {
                  if (event.target.value === "true") {
                    setForm({ ...form, type: true });
                  } else {
                    setForm({ ...form, type: false });
                  }
                }}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div>
              <label className="text-lx">파일:</label>
              <input
                type="file"
                id="email"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
                onBlur={(event) =>
                  setForm({ ...form, file: event.target.files })
                }
              />
            </div>
            <button
              className=" px-6 py-2 mx-auto block rounded-md text-lg font-semibold text-indigo-100 bg-indigo-600  "
              onClick={AddProduct}
            >
              상품 추가하기
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default AddProductScreen;
