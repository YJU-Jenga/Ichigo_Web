import axios, { AxiosError } from "axios";
import React, { SyntheticEvent, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

// 테스트 user_id, 우편번호, 주소, 상품아이디, 갯수

const PurchaseScreen = () => {
  const navigate = useNavigate();
  let { count, id } = useParams();
  const [detailAddress, setDetailAddress] = useState("");
  console.log(count, id);

  const userId = 1;
  const counts = [1, 2, 3];
  const productIds = [1];

  const [form, setForm] = useState({
    userId: userId,
    address: "",
    postalCode: "",
    productIds: productIds,
    counts: counts,
  });
  const onCompletePost = (data: any) => {
    setForm({ ...form, address: data.address, postalCode: data.zonecode });
    console.log(data);
  };

  // 주소 + 상세주소까지 합치기
  const full_address = () => {
    let fullAddress = form.address + detailAddress;
    return setForm({ ...form, address: fullAddress });
  };

  const url = `http://localhost:5000/order/create`;
  const getProductInfoUrl = `https://localhost:5000/product/getOne/${id}`;
  const body = {
    userId: form.userId,
    address: form.address,
    postalCode: form.postalCode,
    productIds: form.productIds,
    counts: form.counts,
  };

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };
    try {
      const res = await axios.post(url, body, { headers });
      if (res.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "주문이 완료되었습니다.",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "관리자에게 문의해주세요",
          showConfirmButton: false,
          timer: 10000,
        });
        navigate("/");
      }
    }
  };
  console.log(body);
  return (
    <div className="flex justify-center items-center">
      <div className="py-16 px-4 md:px-6 2xl:px-0 flex justify-center items-center 2xl:mx-auto 2xl:container">
        <div className="flex flex-col justify-start items-start w-full space-y-9">
          <div className="flex justify-start flex-col items-start space-y-2">
            <p className="text-3xl lg:text-4xl font-bold leading-7 lg:leading-9 text-gray-800">
              주문
            </p>
          </div>

          <div className="flex flex-col xl:flex-row justify-center xl:justify-between space-y-6 xl:space-y-0 xl:space-x-6 w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col justify-center items-center bg-gray-100 py-7 sm:py-0 xl:py-10 px-10 xl:w-full">
              <div className="flex flex-col justify-start items-start w-full space-y-4">
                <p className="text-xl md:text-2xl leading-normal text-gray-800">
                  딸기
                </p>
                <p className="text-base font-semibold leading-none text-gray-600">
                  300,000 ₩
                </p>
              </div>
              <div className="mt-6 sm:mt-0 xl:my-10 xl:px-20 w-52 sm:w-96 xl:w-auto">
                <img src="img/sad_gosung.jpg" alt="headphones" />
              </div>
            </div>
            <form
              className="p-8 bg-gray-100 flex flex-col lg:w-full xl:w-3/5"
              onSubmit={submit}
            >
              <div>
                <div className="mt-8">
                  <label className="mt-8 text-base leading-4 text-gray-800">
                    갯수
                  </label>
                  <input
                    className="border border-gray-300 p-4 rounded w-full text-base leading-4 placeholder-gray-600 text-gray-600"
                    type="number"
                    placeholder="갯수"
                    value={form.counts[0]}
                    min={1}
                    onChange={() => {
                      // setForm({ ...form, counts: form.counts + 1 });
                    }}
                    required
                  />
                </div>
                <label className="mt-8 text-base leading-4 text-gray-800">
                  배송지 정보
                </label>
                <div className="mt-2 flex-col">
                  <div className="flex-row flex">
                    <input
                      className="border border-gray-300 p-4 rounded w-full text-base leading-4 placeholder-gray-600 text-gray-600"
                      value={form.postalCode}
                      type="text"
                      placeholder="우편번호"
                      readOnly
                    />
                  </div>
                  <div className="flex-row flex">
                    <input
                      className="border border-gray-300 p-4 rounded w-full text-base leading-4 placeholder-gray-600 text-gray-600"
                      value={form.address}
                      type="text"
                      placeholder="주소"
                      readOnly
                    />
                  </div>
                  <div>
                    <input
                      className="border border-gray-300 p-4 rounded w-full text-base leading-4 placeholder-gray-600 text-gray-600"
                      type="text"
                      placeholder="상세주소"
                      onChange={(event) => {
                        setDetailAddress(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex-col"></div>
                <DaumPostcode onComplete={onCompletePost}></DaumPostcode>
                <button
                  type="submit"
                  className="mt-8 border border-transparent hover:border-gray-300 bg-gray-900 hover:bg-white text-white hover:text-gray-900 flex justify-center items-center py-4 rounded w-full"
                >
                  <div>
                    <p className="text-base leading-4">구매하기</p>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseScreen;
