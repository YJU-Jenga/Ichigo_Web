import React, { useState, SyntheticEvent } from "react";
import { NavLink, useNavigate, redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../config";

export default function LoginScreen() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [cookies, setCookie, removeCookie] = useCookies();

  // 비밀번호 보기, 숨기기 상태관리
  const [hidePassword, setHidePassword] = useState(true);

  // 비밀번호 보기, 숨기기 함수
  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  // 23.02.19 url 따로 변수로 관리, 로그인 확인, 실패시 메세지 띄우기
  const url = `${API_URL}/auth/local/signin`;
  // 전송할 부분 따로 변수로 관리
  const body = {
    email: form.email,
    password: form.password,
  };

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };
    try {
      // 데이터 전송
      const res = await axios.post(url, body, { headers });
      // 토큰 저장
      const { access_token, refresh_token } = res.data;
      console.log(res.data);
      // LocalStorage에 RefreshToken 저장
      localStorage.setItem("refresh-token", refresh_token);
      // 쿠키에 AccessToken 저장
      setCookie("access-token", access_token, { maxAge: 15 * 60 });
      // AccessToken이 있으면 메인 페이지로 이동
      if (access_token != null) {
        navigate("/", { state: access_token });
        window.location.reload();
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
      }
    }
  };
  return (
    <section className="bg-gray-200">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-Line-bd leading-tight tracking-tight text-gray-900 md:text-2xl underline decoration-red-300">
              ログイン
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={submit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  E-Mail
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 ">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                    />
                  </div>
                  <div className="ml-2 text-sm">
                    <label className="underline decoration-red-300 font-Line-rg">
                      ログイン情報保存
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="underline decoration-red-300 text-sm font-Line-rg text-primary-600 hover:underline"
                >
                  暗証番号を忘れた場合
                </a>
              </div>
              <button
                type="submit"
                className="w-full font-Line-bd text-medium bg-red-300 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-2.5 text-center"
              >
                ログイン
              </button>
              <p className="text-sm font-Line-rg">
                まだアカウントがありませんか？{"     "}
                <NavLink
                  to="/register"
                  className="font-Line-bd text-primary-600 hover:text-gray-400"
                  aria-current="page"
                >
                  会員登録
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
