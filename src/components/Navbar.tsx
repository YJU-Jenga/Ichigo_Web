import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import { UserProps } from "../App";
import { API_URL } from "../config";
import { useState } from "react";

export function Navbar({ user }: UserProps) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [checked, setChecked] = useState(true);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }).then(() => {
        removeCookie("access-token");
        localStorage.removeItem("refresh-token");
      });
      window.location.replace("/");
    } catch (error) {}
  };
  let signIn, join, signOut, nickname;

  if (user == undefined) {
    signIn = (
      <li>
        <NavLink
          to="/login"
          className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400 font-bold"
          aria-current="page"
          onClick={() => setChecked(!checked)}
        >
          로그인
        </NavLink>
      </li>
    );
    join = (
      <li>
        <NavLink
          to="/register"
          className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400 font-bold"
          aria-current="page"
          onClick={() => setChecked(!checked)}
        >
          회원가입
        </NavLink>
      </li>
    );
  } else {
    nickname = (
      <li className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400 font-bold">
        {user.name}님
      </li>
    );
    signOut = (
      <li>
        <NavLink
          to="/"
          className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400 font-bold"
          aria-current="page"
          onClick={logout}
        >
          로그아웃
        </NavLink>
      </li>
    );
  }

  return (
    <>
      {/* <style>
 #menu-toggle:checked + #menu {
        display: block;
      }
</style> */}
      <div className="antialiased bg-gray-400">
        <header className="lg:px-16 px-6 bg-white flex flex-wrap items-center lg:py-0 py-2">
          <label className="pointer-cursor lg:hidden block">
            <svg
              className="fill-current text-gray-900"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <title>menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
            <input
              checked={checked}
              onChange={() => setChecked(!checked)}
              className="hidden"
              type="checkbox"
              id="menu-toggle"
            />
          </label>

          <div
            style={{ display: checked ? "none" : "block" }}
            className="hidden lg:flex lg:items-center lg:w-auto w-full"
            id="menu"
          >
            <nav>
              <ul className="lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
                <li>
                  <NavLink
                    to="/"
                    className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                    aria-current="page"
                    onClick={() => setChecked(!checked)}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/product"
                    className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                    aria-current="page"
                    onClick={() => setChecked(!checked)}
                  >
                    상품
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/productinquiry"
                    className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                    aria-current="page"
                    onClick={() => setChecked(!checked)}
                  >
                    상품 문의
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/qna"
                    className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                    aria-current="page"
                    onClick={() => setChecked(!checked)}
                  >
                    Q&A
                  </NavLink>
                </li>
                <li>
                  {user ? (
                    <NavLink
                      to="/calendar"
                      className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                      aria-current="page"
                      onClick={() => setChecked(!checked)}
                    >
                      캘린더
                    </NavLink>
                  ) : null}
                </li>
                <li>
                  {user !== undefined ? (
                    <NavLink
                      to="/custom"
                      className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                      aria-current="page"
                      onClick={() => setChecked(!checked)}
                    >
                      커스터마이징
                    </NavLink>
                  ) : (
                    <NavLink
                      onClick={() => {
                        setChecked(!checked);
                        alert("로그인 해주세요.");
                      }}
                      to="/login"
                      className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                      aria-current="page"
                    >
                      커스터마이징
                    </NavLink>
                  )}
                </li>
                <li>
                  {user?.permission ? (
                    <NavLink
                      to="/maniging"
                      className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                      aria-current="page"
                      onClick={() => setChecked(!checked)}
                    >
                      주문관리
                    </NavLink>
                  ) : null}
                </li>
                <li>
                  {user ? (
                    <NavLink
                      to="/mypage"
                      className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                      aria-current="page"
                      onClick={() => setChecked(!checked)}
                    >
                      마이페이지
                    </NavLink>
                  ) : null}
                </li>
                <li>
                  {user ? (
                    <NavLink
                      to="/cart"
                      className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                      aria-current="page"
                      onClick={() => setChecked(!checked)}
                    >
                      장바구니
                    </NavLink>
                  ) : null}
                </li>
                {signIn}
                {join}
                {nickname}
                {signOut}
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
}
