import React, { SyntheticEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Board } from "../dto/Board";
import { UserProps } from "../App";
import { API_URL } from "../config";
import { getCookie } from "../cookie";

const ProductInquiryScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
  // 가져온 게시판 내용을 저장(전체 다 가져옴)
  const [boardList, setBoardList] = useState<Array<Board>>([]);
  // 한 페이지 당 나타낼 데이터의 갯수
  const size = 10;
  // 전체 페이지 수
  const totalPage = Math.ceil(boardList.length / size);
  // 화면에 나타날 페이지 갯수
  const pageCount = 5;
  // 현재 페이지 번호
  const [curPage, setCurPage] = useState(1);
  // 지금 속해 있는 페이지가 몇번째 페이지 그룹에 속해있는지 계산한다.
  const [pageGroup, setPageGroup] = useState(Math.ceil(curPage / pageCount));
  const offset = (curPage - 1) * size;
  // 그룹 내 마지막 번호
  let lastNum = pageGroup * pageCount;
  if (lastNum > totalPage) {
    lastNum = totalPage;
  }
  // 그룹 내 첫 번호
  let firstNum = lastNum - (pageCount - 1);
  if (pageCount > lastNum) {
    firstNum = 1;
  }

  // 렌더링 전에 정보를 먼저 가져오기 위함
  useEffect(() => {
    getProductInquiry();
  }, []);

  // 상품문의 가져오기
  const getProductInquiry = async () => {
    const getProductInquiryUrl = `${API_URL}/post/product_inquiry_all`;
    try {
      const res = await axios.get(getProductInquiryUrl);
      console.log(res.data);
      setBoardList(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "管理者にお問い合わせください",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/productinquiry");
      }
    }
  };

  const pagination = () => {
    let arr = [];
    for (let i = firstNum; i <= lastNum; i++) {
      arr.push(
        <li>
          <a
            key={i}
            onClick={() => setCurPage(i)}
            className="font-bold flex items-center justify-center text-sm py-2 px-3 leading-tight text-white bg-red-300 border border-gray-500 hover:bg-gray-100 hover:text-red-500"
          >
            {i}
          </a>
        </li>
      );
    }
    return arr;
  };

  return (
    <section className="bg-gray-50  p-3 sm:p-5 h-screen">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden p-3">
          <h1 className="text-gray-900 text-3xl title-font font-Line-bd mb-1 ml-3 underline decoration-red-300">
            問い合わせ
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-end space-y-3 md:space-y-0 md:space-x-4 p-2">
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0 ">
              {user !== undefined ? (
                <NavLink
                  to="/write_product_inquiury"
                  className="flex ml-auto text-white font-Line-rg bg-red-400 border-0 py-2 px-6 focus:outline-none hover:bg-red-300 rounded"
                >
                  投稿
                </NavLink>
              ) : (
                <NavLink
                  onClick={() => {
                    alert("ログインしてください");
                  }}
                  to="/login"
                  className="flex ml-auto text-white font-Line-bd bg-red-400 border-0 py-2 px-6 focus:outline-none hover:bg-red-300 rounded"
                >
                  投稿
                </NavLink>
              )}
            </div>
          </div>
          <div className="overflow-x-auto"></div>
          <table
            style={{ minHeight: "20vh" }}
            className="w-full text-sm text-left"
          >
            <thead className=" uppercase bg-gray-300 dark:bg-gray-300">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 font-Line-bd underline decoration-red-300"
                >
                  タイトル
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-Line-bd underline decoration-red-300"
                >
                  作成日
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-Line-bd underline decoration-red-300"
                >
                  作成者
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-Line-bd underline decoration-red-300"
                >
                  訪問数
                </th>
              </tr>
            </thead>
            {/* 만약 board.secret이 true라면 비밀글입니다 표시하기 */}
            <tbody>
              {boardList.slice(offset, offset + size).map((board: Board) => {
                console.log(board.writer);
                return (
                  <tr
                    key={board.id}
                    className="border-b dark:border-gray-700 bg-white"
                  >
                    <td className="px-4 py-3">
                      <Link to={`/viewpost/${board.id}`}>{board.title}</Link>
                    </td>
                    <td className="px-4 py-3">
                      {board.createdAt.substring(0, 10)}
                    </td>
                    <td className="px-4 py-3">{board.user.name}</td>
                    <td className="px-4 py-3">{board.hit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <nav
            className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
            aria-label="Table navigation"
          >
            <div className="w-full flex justify-center mt-4">
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <button
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-white bg-red-300 rounded-l-lg border border-gray-500 hover:bg-gray-100 hover:text-red-400"
                    onClick={() => setPageGroup(pageGroup - 1)}
                    disabled={firstNum === 1}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
                {pagination()}
                <li>
                  <button
                    className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-white bg-red-300 rounded-r-lg border border-gray-500 hover:bg-gray-100 hover:text-red-400"
                    onClick={() => setPageGroup(pageGroup + 1)}
                    disabled={lastNum === totalPage}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default ProductInquiryScreen;
