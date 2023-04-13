import React, { SyntheticEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Board } from "../dto/Board";
import { UserProps } from "../App";

const QnaScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
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
    getQna();
  }, []);

  // 상품문의 가져오기
  const getQna = async () => {
    const getQnaUrl = `http://localhost:5000/post/q&a_all`;
    try {
      const res = await axios.get(getQnaUrl);
      console.log(res);
      setBoardList(res.data);
      console.log(user);
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "관리자에게 문의해주세요",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/qna");
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
            className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
        <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
          <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
            Q & A
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label className="sr-only">Search</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    required
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              {user !== undefined ? (
                <NavLink
                  to="/write_q&a"
                  className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                >
                  글 쓰기
                </NavLink>
              ) : (
                <NavLink
                  onClick={() => {
                    alert("로그인 해주세요.");
                  }}
                  to="/login"
                  className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                >
                  글 쓰기
                </NavLink>
              )}
            </div>{" "}
            <div className="flex items-center space-x-3 w-full md:w-auto"></div>
          </div>
          <div className="overflow-x-auto"></div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  제목
                </th>
                <th scope="col" className="px-4 py-3">
                  작성일자
                </th>
                <th scope="col" className="px-4 py-3">
                  조회수
                </th>
              </tr>
            </thead>
            {/* 만약 board.secret이 true라면 비밀글입니다 표시하기 */}
            <tbody>
              {boardList.slice(offset, offset + size).map((board: Board) => {
                return (
                  <tr key={board.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-3">
                      <Link to={`/viewpost/${board.id}`}>{board.title}</Link>
                    </td>
                    <td className="px-4 py-3">
                      {board.createdAt.substring(0, 10)}
                    </td>
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
            {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Showing
              <span className="font-semibold text-gray-900"> 1-10 </span>
              of
              <span className="font-semibold text-gray-900"> 1000 </span>
            </span> */}
            <ul className="inline-flex items-stretch -space-x-px">
              <li>
                <button
                  className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
                  className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
          </nav>
        </div>
      </div>
    </section>
  );
};

export default QnaScreen;
