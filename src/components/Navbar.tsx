import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import axios, { AxiosError } from "axios";

export function Navbar() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [userName, setUserName] = useState();

  const getUser = async () => {
    try {
      const user = JSON.parse(
        JSON.stringify(jwt_decode(cookies["access-token"]))
      );
      const url = `http://localhost:5000/user/${user.email}`;
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookies["access-token"]}`,
      };
      const res = await axios.get(url, { headers });
      const name = res.data.name;
      setUserName(name);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    }
  };

  window.onload = getUser;

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
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

  if (!cookies["access-token"]) {
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
        {userName}님
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
    <nav className="px-2 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <NavLink
          to="/"
          className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
          aria-current="page"
        >
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            DDALGI
          </span>
        </NavLink>
        <button
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              {/* <NavLink
                to="/"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Home
              </NavLink> */}
            </li>
            <li>
              <NavLink
                to="/product"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                상품
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/productinquiry"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                상품 문의
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/qna"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Q&A
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/custom"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                커스터마이징
              </NavLink>
            </li>
            {signIn}
            {join}
            {nickname}
            {signOut}
          </ul>
        </div>
      </div>
    </nav>
  );
}
