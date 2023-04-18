import Swal from "sweetalert2";
import { UserProps } from "../App";
import axios, { AxiosError } from "axios";
import { API_URL } from "../config";
import { useEffect } from "react";
import { getCookie } from "../cookie";

const ManigingScreen = ({ user }: UserProps) => {
  // 유저 정보를 가져와 봅시다 음호호
  useEffect(() => {
    getCartList();
  }, []);

  const getCartList = async () => {
    // axios.get("https://kauth.kakao.com/v2/user/me", {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`
    //         }
    //     })
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const url = `${API_URL}/order/findAll`;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        console.log(res);
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
      }
    }
  };
  return (
    <>
      <h1>주문관리 페이지입니다.(관리자용)</h1>
    </>
  );
};
export default ManigingScreen;
