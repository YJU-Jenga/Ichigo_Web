import React, { SyntheticEvent, useState } from "react";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";

export default function RegisterScreen(this: any) {
  const navigate = useNavigate();

  // 유저 정보(메일, 비밀번호, 이름, 전화번호)
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    confirmed: false,
    name: "",
    phone: "",
  });

  const [cookies, setCookie, removeCookie] = useCookies();

  // 비밀번호 보기, 숨기기 상태관리
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  // 비밀번호 보기, 숨기기 함수
  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };
  const toggleHideConfirmPassword = () => {
    setHideConfirmPassword(!hideConfirmPassword);
  };

  // 23.02.19 url 따로 변수로 관리
  const url = `http://localhost:5000/auth/local/signup`;
  // 전송할 부분 따로 변수로 관리
  const body = {
    email: form.email,
    password: form.password,
    name: form.name,
    phone: form.phone,
  };

  // 이메일, 비밀번호, 전화번호 유효성 검사
  const EmailValidation =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const PasswordValidation =
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/;
  const PhoneValidation = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;

  // 23.02.18 가입되는거 확인, 비밀번호 규칙명시하기, 실패시 메세지 띄우기
  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };
    if (EmailValidation.test(form.email)) {
      if (PasswordValidation.test(form.password)) {
        if (PhoneValidation.test(form.phone)) {
          if (doesPasswordMatch()) {
            try {
              // 데이터 전송
              const res = await axios.post(url, body, { headers });
              // 토큰 저장
              const { access_token, refresh_token } = res.data;
              // LocalStorage에 RefreshToken 저장
              localStorage.setItem("refresh-token", refresh_token);
              // 쿠키에 AccessToken 저장
              setCookie("access-token", access_token, { maxAge: 15 * 60 });
              // AccessToken이 있으면 로그인 페이지로 이동
              if (access_token != null) {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "회원가입이 완료되었습니다.",
                  showConfirmButton: false,
                  timer: 1000,
                });
                navigate("/login");
              }
            } catch (error) {
              if (error instanceof AxiosError) {
                alert(error.response?.data.message);
              }
            }
          } else {
            return alert("비밀번호가 일치하지 않습니다.");
          }
        } else {
          alert("휴대폰 번호 형식이 잘못되었습니다.");
        }
      } else {
        alert("비밀번호 형식이 잘못되었습니다.");
      }
    } else {
      alert("이메일 형식이 잘못되었습니다.");
    }
  };

  const doesPasswordMatch = () => {
    return form.password === form.confirmPassword;
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              회원가입
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={submit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  이메일
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  비밀번호 - 영어 대문자, 숫자, 특수기호 포함하기
                </label>
                <input
                  type={hidePassword ? "password" : "text"}
                  name="password"
                  id="password"
                  placeholder="비밀번호"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                />
                <a onClick={toggleHidePassword} className="text-white text-sm">
                  {hidePassword ? <span>보이기</span> : <span>숨기기</span>}
                </a>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  비밀번호 확인
                </label>
                <input
                  type={hideConfirmPassword ? "password" : "text"}
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="비밀번호 확인"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={(event) =>
                    setForm({ ...form, confirmPassword: event.target.value })
                  }
                />
                <a
                  onClick={toggleHideConfirmPassword}
                  className="text-white text-sm"
                >
                  {hideConfirmPassword ? (
                    <span>보이기</span>
                  ) : (
                    <span>숨기기</span>
                  )}
                </a>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  이름
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="홍길동"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  전화번호
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="010-1111-1111"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                회원가입
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                이미 계정이 있나요?{" "}
                <NavLink
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  로그인
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
