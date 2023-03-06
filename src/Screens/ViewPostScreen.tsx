import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Board } from "../dto/Board";

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
    </div>
  );
};

export default ViewPostScreen;
