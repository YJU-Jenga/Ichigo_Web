import React from "react";
import { Button } from "@mui/material";
import Itemuse from "./ItemuseScreen";
import { NavLink } from "react-router-dom";

export default function ProductScreen() {
  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img
            className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200"
            src="img/sad_gosung.jpg"
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              Korea's best AI
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              딸기
            </h1>
            <p className="leading-relaxed">
              이 편지는 영국에서 최초로 시작되어 일년에 한바퀴를 돌면서 받는
              사람에게 행운을 주었고 지금은 당신에게로 옮겨진 이 편지는 4일 안에
              당신 곁을 떠나야 합니다. 이 편지를 포함해서 7통을 행운이 필요한
              사람에게 보내 주셔야 합니다. 복사를 해도 좋습니다. 혹 미신이라
              하실지 모르지만 사실입니다. 영국에서 HGXWCH이라는 사람은 1930년에
              이 편지를 받았습니다. 그는 비서에게 복사해서 보내라고 했습니다.
              며칠 뒤에 복권이 당첨되어 20억을 받았습니다. .......중략.......
              7년의 행운을 빌면서...
            </p>
            <div className="flex items-center pb-5 border-b-2 border-gray-200 mb-5"></div>
            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">
                300,000 ₩
              </span>
              <NavLink
                to="/purchase"
                className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
              >
                구매
              </NavLink>
              <NavLink
                to="/cart"
                className="flex ml-3 text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
              >
                장바구니 담기
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center pb-5 border-b-2 border-gray-200 mb-5"></div>
      <div className="grid place-items-center">
        <Itemuse />
      </div>
    </section>
  );
}
