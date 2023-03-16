import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Board } from "../dto/Board";
import AddComment from "../components/board/AddComment";
import Comments from "../components/board/Comments";

const ViewPostScreen = () => {
  const navigate = useNavigate();
  // 파라미터로 받아온 id값
  let { id } = useParams();
  console.log(id);
  // 상세정보를 가져올 url
  const url_get = `http://localhost:5000/post/view/${id}`;
  // 글 삭제 url
  const url_delete = `http://localhost:5000/post/delete_post?id=${id}`;
  // 글 상세정보를 배열에 저장
  const [boardDetail, setBoardDetail] = useState<Board>();

  // 렌더링 전에 정보를 먼저 가져오기 위함
  useEffect(() => {
    getPostDetail();
  }, []);

  // 글 상세정보 가져오기 함수
  const getPostDetail = async () => {
    try {
      const res = await axios.get(url_get);
      console.log(res.data);
      setBoardDetail(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "관리자에게 문의해주세요",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/productinquiry");
      }
    }
  };

  // 글 삭제 함수
  const deletePost = async () => {
    try {
      const res = await axios.delete(url_delete);
      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "상품문의 삭제가 완료되었습니다.",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/productinquiry");
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
        navigate("/productinquiry");
      }
    }
  };

  if (!boardDetail) {
    return <></>;
  }

  // const [userInfo, setUserInfo] = useState();
  // 작성자 이름 가져오기
  const getWritersName = async () => {
    const getWritersUrl = `http://localhost:5000/user/user/${id}`;
    const res = await axios.get(getWritersUrl);
  };

  return (
    <div className="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
      <div className="flex justify-center md:justify-end -mt-16">
        <img
          className="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
          src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
        />
      </div>
      <div>
        <h2 className="text-gray-800 text-3xl font-semibold">
          {boardDetail.title}
        </h2>
        <p className="mt-2 text-gray-600">{boardDetail.content}</p>
      </div>

      <div className="flex justify-end mt-4">
        <NavLink
          to={`/updateproductinquiry/${id}`}
          className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
        >
          수정
        </NavLink>
        <a
          onClick={deletePost}
          className="flex ml-2 text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
        >
          삭제
        </a>
      </div>
      <div className="flex items-center justify-center min-h-screen">
        {" "}
        <div className="rounded-xl border p-5 shadow-md w-9/12 bg-white">
          <div className="flex w-full items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-3">
              <div className="text-lg font-bold text-slate-700">Joe Smith</div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-xs text-neutral-500">
                {boardDetail.createdAt.substring(0, 10)}
              </div>
            </div>
          </div>

          <div className="mt-4 mb-6">
            <div className="mb-3 text-xl font-bold">{boardDetail.title}</div>
            <div className="text-sm text-neutral-600">
              {boardDetail.content}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-slate-500">
              <div className="flex space-x-4 md:space-x-8">
                <div className="flex cursor-pointer items-center transition hover:text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1.5 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <span>125</span>
                </div>
                <div className="flex cursor-pointer items-center transition hover:text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1.5 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  <span>4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddComment />
      <Comments />
    </div>
  );
};

export default ViewPostScreen;
