import { NavLink } from "react-router-dom";
import React from "react";
import { useCookies } from "react-cookie";
import { UserProps } from "../App";
import { API_URL } from "../config";

export function Navbar({ user }: UserProps) {
  const [cookies, setCookie, removeCookie] = useCookies();

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
          className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
          aria-current="page"
        >
          로그인
        </NavLink>
      </li>
    );
    join = (
      <li>
        <NavLink
          to="/register"
          className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
          aria-current="page"
        >
          회원가입
        </NavLink>
      </li>
    );
  } else {
    nickname = (
      <li className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent">
        {user.name}님
      </li>
    );
    signOut = (
      <li>
        <NavLink
          to="/"
          className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
          aria-current="page"
          onClick={logout}
        >
          로그아웃
        </NavLink>
      </li>
    );
  }

  return (
    // <nav className="px-2 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
    //   <div className="container flex flex-wrap items-center justify-between mx-auto">
    //     <NavLink
    //       to="/"
    //       className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
    //       aria-current="page"
    //     >
    //       <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
    //         DDALGI
    //       </span>
    //     </NavLink>
    //     <button
    //       data-collapse-toggle="navbar-dropdown"
    //       type="button"
    //       className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    //       aria-controls="navbar-dropdown"
    //       aria-expanded="false"
    //     >
    //       <span className="sr-only">Open main menu</span>
    //       <svg
    //         className="w-6 h-6"
    //         aria-hidden="true"
    //         fill="currentColor"
    //         viewBox="0 0 20 20"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           fill-rule="evenodd"
    //           d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
    //           clip-rule="evenodd"
    //         ></path>
    //       </svg>
    //     </button>
    //     <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
    //       <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
    //         <li>
    //           {/* <NavLink
    //             to="/"
    //             className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
    //             aria-current="page"
    //           >
    //             Home
    //           </NavLink> */}
    //         </li>
    //         <li>
    //           <NavLink
    //             to="/product"
    //             className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
    //             aria-current="page"
    //           >
    //             상품
    //           </NavLink>
    //         </li>
    //         <li>
    //           <NavLink
    //             to="/productinquiry"
    //             className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
    //             aria-current="page"
    //           >
    //             상품 문의
    //           </NavLink>
    //         </li>
    //         <li>
    //           <NavLink
    //             to="/qna"
    //             className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
    //             aria-current="page"
    //           >
    //             Q&A
    //           </NavLink>
    //         </li>
    //         <li>
    //           <NavLink
    //             to="/calendar"
    //             className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
    //             aria-current="page"
    //           >
    //             캘린더
    //           </NavLink>
    //         </li>
    //         <li>
    //           {user !== undefined ? (
    //             <NavLink
    //               to="/custom"
    //               className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
    //               aria-current="page"
    //             >
    //               커스터마이징
    //             </NavLink>
    //           ) : (
    //             <NavLink
    //               onClick={() => {
    //                 alert("로그인 해주세요.");
    //               }}
    //               to="/login"
    //               className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
    //               aria-current="page"
    //             >
    //               커스터마이징
    //             </NavLink>
    //           )}
    //         </li>
    //         <li>
    //           {user?.permission ? (
    //             <NavLink
    //               to="/maniging"
    //               className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
    //               aria-current="page"
    //             >
    //               주문관리
    //             </NavLink>
    //           ) : null}
    //         </li>
    //         {signIn}
    //         {join}
    //         {nickname}
    //         {signOut}
    //       </ul>
    //     </div>
    //   </div>
    // </nav>
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
          </label>
          <input className="hidden" type="checkbox" id="menu-toggle" />

          <div
            className="hidden lg:flex lg:items-center lg:w-auto w-full"
            id="menu"
          >
            <nav>
              <ul className="lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
                <li>
                  <a
                    className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                    href="#"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                    href="#"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400"
                    href="#"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400 lg:mb-0 mb-2"
                    href="#"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
}
