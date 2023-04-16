import axios, { AxiosError } from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Product } from "../dto/Product";
import { UserProps } from "../App";
import { API_URL } from "../config";

// 테스트 user_id, 우편번호, 주소, 상품아이디, 갯수

const PurchaseScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const id = 1;

  const userId = user?.id;

  // 파라미터로 넘어온 상품Id로 상품 정보 가져오기

  // 페이지가 나타나기전에 정보를 먼저 가져오기 위함
  useEffect(() => {
    getProductInfo();
  }, []);

  const getProductInfo = async () => {
    const url = `${API_URL}/cart/findAllProducts/${id}`;
    try {
      let totalP = 0;
      const res = await axios.get(url);
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

  const [form, setForm] = useState({
    userId: userId,
    address: "",
    postalCode: "",
  });

  const onCompletePost = (data: any) => {
    setForm({ ...form, address: data.address, postalCode: data.zonecode });
    console.log(data);
  };

  // 주소 + 상세주소까지 합치기
  const full_address = (detailAddress: String) => {
    let fullAddress = form.address + " " + detailAddress;
    return setForm({ ...form, address: fullAddress });
  };

  const url = `${API_URL}/order/create`;
  const body = {
    userId: form.userId,
    address: form.address,
    postalCode: form.postalCode,
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
  return (
    <div className="flex justify-center items-center">
      <div className="py-16 px-4 md:px-6 2xl:px-0 flex justify-center items-center 2xl:mx-auto 2xl:container">
        <div className="flex flex-col justify-start items-start w-full space-y-9">
          <div className="flex justify-start flex-col items-start space-y-2">
            <p className="text-3xl lg:text-4xl font-bold leading-7 lg:leading-9 text-gray-800">
              주문
            </p>
          </div>
          <div>총 {totalPrice}₩</div>
          <form
            className="p-8flex flex-col lg:w-full xl:w-3/5"
            onSubmit={submit}
          >
            <section className="flex flex-col gap-10">
              <label className="w-fit">
                <h3 className="text-xl font-semibold">* 주문자</h3>
                <input
                  type="text"
                  placeholder="주문자 성명"
                  required
                  style={{
                    borderBottom: "1px solid #1f2937",
                  }}
                  className="mt-2 h-8 px-2 pt-1 pb-1"
                />
              </label>
              <label className="w-fit">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold">수령인</h3>
                  <label>
                    <input type="checkbox" value="sameAsOrderer" /> 주문자와
                    동일
                  </label>
                </div>
                <input
                  type="text"
                  placeholder={"수령인 성명"}
                  required
                  style={{
                    borderBottom: "1px solid #1f2937",
                  }}
                  className="mt-2 h-8 px-2 pt-1 pb-1"
                />
              </label>
              <label className="w-fit">
                <h3 className="text-xl font-semibold">배송 요청 사항</h3>
                <input
                  type="text"
                  placeholder={""}
                  style={{
                    borderBottom: "1px solid #1f2937",
                  }}
                  className="mt-2 h-8 px-2 pt-1 pb-1"
                />
              </label>
            </section>
            <div>
              <label className="mt-8 text-base leading-4 text-gray-800">
                배송지 입력
              </label>
              <div className="mt-2 flex-col">
                <label className="w-fit">
                  <h3 className="text-xl font-semibold">우편번호</h3>
                  <input
                    type="text"
                    required
                    value={form.postalCode}
                    style={{
                      borderBottom: "1px solid #1f2937",
                    }}
                    className="mt-2 h-8 px-2 pt-1 pb-1"
                    readOnly
                  />
                </label>
                <label className="w-fit">
                  <h3 className="text-xl font-semibold">주소</h3>
                  <input
                    type="text"
                    required
                    value={form.address}
                    style={{
                      borderBottom: "1px solid #1f2937",
                    }}
                    className="mt-2 h-8 px-2 pt-1 pb-1"
                    readOnly
                  />
                </label>
                <label className="w-fit">
                  <h3 className="text-xl font-semibold">상세 주소</h3>
                  <input
                    type="text"
                    required
                    style={{
                      borderBottom: "1px solid #1f2937",
                    }}
                    className="mt-2 h-8 px-2 pt-1 pb-1"
                    // focus상태였던 커서가 다른 곳으로 옮겨갈때 이벤트 함수 실행 - 상세주소 입력 후 full_address실행
                    onBlur={(event) => {
                      full_address(event.target.value);
                    }}
                  />
                </label>
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
  );
};

export default PurchaseScreen;
