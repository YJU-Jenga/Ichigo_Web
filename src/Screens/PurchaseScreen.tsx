import axios, { AxiosError } from "axios";
import React, { SyntheticEvent, useEffect, useState, useRef } from "react";
import DaumPostcode from "react-daum-postcode";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { UserProps } from "../App";
import { API_URL } from "../config";
import { getCookie } from "../cookie";
import { useLocation } from "react-router";

const PurchaseScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [totalPrice, setTotalPrice] = useState(0);
  const productId: any[] = [];
  const productCount: any[] = [];
  const productOption: any[] = [];
  const clothesId: any[] = [];
  const color: any[] = [];
  const counts: any[] = [];
  const id = user?.id;

  // Purchase Information
  const [purchaseName, setPurchaseName] = useState();
  const detailAddrRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTotalPrice();
  }, []);

  const getTotalPrice = async () => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const url = `${API_URL}/cart/findAllProducts/${id}`;
    try {
      let totalP = 0;
      const res = await axios.get(url, { headers });
      console.log(res.data);

      const cartItemCount = res.data[0].cartToProducts.length;
      for (let i in res.data[0].cartToProducts) {
        totalP +=
          res.data[0].cartToProducts[i].count *
          res.data[0].cartToProducts[i].product.price;
      }
      setTotalPrice(totalP);

      setPurchaseName(
        cartItemCount == 1
          ? res.data[0].cartToProducts[0].product.name
          : `${res.data[0].cartToProducts[0].product.name} 외 ${
              cartItemCount - 1
            }개 `
      );
      for (let i in res.data[0].cartToProducts) {
        productCount.push(res.data[0].cartToProducts[i].count);
        productId.push(res.data[0].cartToProducts[i].productId);
        clothesId.push(
          res.data[0].cartToProducts[i].cartToProductOption.clothesId
        );
        color.push(res.data[0].cartToProducts[i].cartToProductOption.color);
        counts.push(res.data[0].cartToProducts[i].cartToProductOption.counts);
        productOption.push(productId, clothesId, color, counts);
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

  const [form, setForm] = useState({
    userId: user?.id,
    address: "",
    postalCode: "",
  });

  const onCompletePost = (data: any) => {
    setForm({ ...form, address: data.address, postalCode: data.zonecode });
  };

  // 주소 + 상세주소까지 합치기
  const full_address = (detailAddress: String) => {
    let fullAddress = form.address + " " + detailAddress;
    return setForm({ ...form, address: fullAddress });
  };

  const submit = async () => {
    const address = form.address + " " + (detailAddrRef.current?.value ?? "");
    const body = {
      userId: form.userId,
      address: address,
      postalCode: form?.postalCode,
      productIds: productId,
      counts: productCount,
      productOptions: productOption,
    };

    const purchase_url = `${API_URL}/order/create`;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const res = await axios.post(purchase_url, body, { headers });
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

  const onClickPayment = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!window.IMP) return;
    const { IMP } = window;
    IMP.init("imp63783256");

    IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: purchaseName,
        amount: totalPrice,
        buyer_email: user?.email,
        buyer_name: user?.name,
        buyer_tel: user?.phone as string,
        buyer_addr: form.address,
        buyer_postcode: form.postalCode,
      },
      (res) => {
        if (res.success) {
          alert("주문이 완료되었습니다");
          submit();
        } else {
          alert("결제 오류 발생");
          navigate("/cart");
        }
      }
    );
  };

  return (
    <form
      className="flex m-5 flex-col gap-5 text-base text-zinc-800"
      onSubmit={onClickPayment}
    >
      <h1 className="mx-3 text-4xl mb-6 ">구매</h1>
      <section className="flex flex-col border p-5 border-red-200 rounded-xl">
        {/* <label className="w-fit">
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
        </label> */}
        <div className="flex-col p-2 ">
          <label className="w-fit">
            <h3 className="text-xl font-semibold">우편번호</h3>
            <input
              type="text"
              required
              value={form.postalCode}
              style={{}}
              className="mb-5 mt-2"
              readOnly
            />
          </label>
          <label className="w-fit">
            <h3 className="text-xl font-semibold">주소</h3>
            <input
              type="text"
              required
              value={form.address}
              style={{}}
              className="mb-5 mt-2"
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
              className="mb-12 mt-2"
              ref={detailAddrRef}
              // focus상태였던 커서가 다른 곳으로 옮겨갈때 이벤트 함수 실행 - 상세주소 입력 후 full_address실행
              // onBlur={(event) => {
              //     //full_address(event.target.value);
              // }}
            />
          </label>
          <DaumPostcode onComplete={onCompletePost}></DaumPostcode>
        </div>
      </section>
      <button
        type="submit"
        className="mt-8 border border-transparent hover:border-red-400 bg-red-300 hover:bg-red-400 text-white hover:text-white flex justify-center items-center py-4 rounded w-full"
      >
        <p className="text-base leading-4 font-semibold">
          총 {totalPrice}원 결제하기
        </p>
      </button>
    </form>
  );
};

export default PurchaseScreen;
