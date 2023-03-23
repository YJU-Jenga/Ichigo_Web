import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Board } from "../dto/Board";
import { Comment } from "../dto/Comment";

const ViewPostScreen = () => {
  const navigate = useNavigate();
  // 파라미터로 받아온 id값
  let { id } = useParams();
  console.log(id);
  // 상세정보를 가져올 url

  // 글 삭제 url
  const url_delete = `http://localhost:5000/post/delete_post?id=${id}`;
  // 글 상세정보를 배열에 저장
  const [boardDetail, setBoardDetail] = useState<Board>();
  const [comment, setComment] = useState("");
  const [allComment, setAllComment] = useState<Array<Comment>>([]);

  // 렌더링 전에 정보를 먼저 가져오기 위함
  useEffect(() => {
    getPostDetail();
  }, []);

  // 글 상세정보와 댓글을 가져오기 함수
  const getPostDetail = async () => {
    const postId = id;
    const url_get = `http://localhost:5000/post/view/${id}`;
    const getCommentUrl = `http://localhost:5000/comment/getAll/${postId}`;
    try {
      const res_post = await axios.get(url_get);
      const res_comment = await axios.get(getCommentUrl);
      setBoardDetail(res_post.data);
      setAllComment(res_comment.data);
      console.log(res_comment);
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

  // 댓글쓰기 함수
  const writeComment = async () => {
    const writeCommentUrl = `http://localhost:5000/comment/write`;
    const headers = { "Content-Type": "application/json" };
    const body = {
      writer: 1,
      postId: id,
      content: comment,
    };
    try {
      const res = await axios.post(writeCommentUrl, body, { headers });
      if (res.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "댓글이 작성되었습니다.",
          showConfirmButton: false,
          timer: 1000,
        });
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
      }
    }
  };

  // 댓글 삭제 함수
  const deleteComment = (id: number) => {};

  return (
    <>
      <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-20">
        <div className="flex items-center justify-center">
          <div className="rounded-xl border p-5 shadow-md w-9/12 bg-white">
            <div className="flex w-full items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-3">
                <div className="text-lg font-bold text-slate-700">
                  {boardDetail.title}
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-xs text-neutral-500">
                  {boardDetail.user.name}
                </div>
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
                    <span>{allComment.length}</span>
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
            </div>
          </div>
        </div>
      </div>
      {/* 댓글 쓰기 */}
      <div className="flex mx-auto items-center justify-center shadow-lg mb-4 max-w-lg">
        <form className="w-full max-w-xl bg-white rounded-lg px-4 pt-2">
          <div className="flex flex-wrap -mx-3 mb-6">
            <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">
              댓글 작성하기
            </h2>
            <div className="w-full md:w-full px-3 mb-2 mt-2">
              <textarea
                className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                name="body"
                placeholder="댓글을 입력해 주세요"
                required
                onChange={(event) => setComment(event.target.value)}
              ></textarea>
            </div>
            <div className="w-full md:w-full flex items-start px-3">
              <div className="-mr-1">
                <input
                  type="submit"
                  className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                  value="작성"
                  onClick={writeComment}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* 댓글 */}
      {allComment.map((comments: Comment) => {
        return (
          <div className="flex justify-center relative top-1/3">
            <div className="relative grid grid-cols-1 gap-4 p-4 mb-8 border rounded-lg bg-white shadow-lg w-full max-w-xl">
              <div className="relative flex gap-4">
                <div className="flex flex-col w-full">
                  <div className="flex flex-row justify-between">
                    <p className="relative text-xl whitespace-nowrap truncate overflow-hidden">
                      작성자
                    </p>
                    <a className="text-gray-500 text-xl" href="#">
                      <i className="fa-solid fa-trash"></i>
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {comments.createdAt.substring(0, 10)}
                  </p>
                </div>
              </div>
              <p className="-mt-4 text-gray-500">{comments.content}</p>
              <div>
                <button className="text-white bg-blue-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-blue-600">
                  수정
                </button>
                <button className="text-white bg-red-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-red-600">
                  삭제
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ViewPostScreen;
