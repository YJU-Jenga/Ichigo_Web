import axios, { AxiosError } from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { UserProps } from "../App";
import { API_URL } from "../config";
import { Button } from "@material-tailwind/react";

const PurchaseScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const id = 1;

  useEffect(() => {
    getTotalPrice();
  }, []);

  const getTotalPrice = async () => {
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
    userId: user?.id,
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

  const body = {
    userId: form.userId,
    address: form.address,
    postalCode: form.postalCode,
  };

  const submit = async (e: SyntheticEvent) => {
    const url = `${API_URL}/order/create`;
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
    <form
      className="flex flex-col gap-5 text-base text-zinc-800"
      onSubmit={submit}
    >
      <section className="flex flex-col gap-10">
        <label className="w-fit">
          <h3 className="text-xl font-semibold">* 주문자</h3>
          <input
            type="text"
            placeholder={"주문자 성명"}
            value={user?.name}
            // onChange={onOrdererNameChange}
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
              <input
                type="checkbox"
                // checked={sameAsOrderer}
                // onChange={onSameAsOrdererChange}
                value="sameAsOrderer"
              />{" "}
              주문자와 동일
            </label>
          </div>
          <input
            type="text"
            placeholder={"수령인 성명"}
            // value={sameAsOrderer ? ordererName : recipientName}
            onChange={(e) => {
              // setSameAsOrderer(false);
              // onRecipientNameChange(e);
            }}
            required
            style={{
              borderBottom: "1px solid #1f2937",
            }}
            className="mt-2 h-8 px-2 pt-1 pb-1"
          />
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
          <DaumPostcode onComplete={onCompletePost}></DaumPostcode>
        </div>
      </section>
      <button
        type="submit"
        className="mt-8 border border-transparent hover:border-gray-300 bg-gray-900 hover:bg-white text-white hover:text-gray-900 flex justify-center items-center py-4 rounded w-full"
      >
        <div>
          <p className="text-base leading-4 font-semibold">
            총 {totalPrice}원 결제하기
          </p>
        </div>
      </button>
    </form>
  );
};

export default PurchaseScreen;
