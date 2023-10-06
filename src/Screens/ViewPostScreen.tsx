import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Board } from "../dto/Board";
import { Comment } from "../dto/Comment";
import { UserProps } from "../App";
import { API_URL, BUCKET_URL } from "../config";
import { getCookie } from "../cookie";

const ViewPostScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
  // 파라미터로 받아온 글 id값
  let { id } = useParams();
  const postId = id;

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
    const url_get = `${API_URL}/post/view/${id}`;
    const getCommentUrl = `${API_URL}/comment/getAll/${postId}`;
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
          text: "管理者にお問い合わせください",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/productinquiry");
      }
    }
  };

  // 글 삭제 함수
  const deletePost = async () => {
    // 글 삭제 url
    const url_delete = `${API_URL}/post/delete_post?id=${id}`;
    try {
      const res = await axios.delete(url_delete);
      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "お問い合わせの削除が完了しました。",
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
          text: "管理者にお問い合わせください",
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
  // 댓글쓰기 함수
  const writeComment = async () => {
    const writeCommentUrl = `${API_URL}/comment/write`;
    const token = getCookie("access-token");
    const headers = {
      "Content-Type": "Multipart/form-data",
      Authorization: `Bearer ${token}`,
    };
    const body = {
      writer: user?.id,
      postId: id,
      content: comment,
    };
    try {
      const res = await axios.post(writeCommentUrl, body, { headers });
      if (res.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "コメントが作成されました",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "管理者にお問い合わせください",
          showConfirmButton: false,
          timer: 10000,
        });
      }
    }
  };

  // 댓글 삭제 함수
  const deleteComment = async (id: number) => {
    const deleteUrl = `${API_URL}/comment/delete/${id}`;
    try {
      const res = await axios.delete(deleteUrl);
      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "コメントが削除されました",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      window.location.replace(`/viewpost/${postId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "管理者にお問い合わせください",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
  };

  // 댓글 수정 함수
  const updateComment = async (id: number) => {
    const updateCommentUrl = `${API_URL}/comment/update/${id}`;
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
    });
    const body = {
      writer: user?.id,
      postId: postId,
      content: text,
    };
    if (text) {
      const res = await axios.patch(updateCommentUrl, body);
      if (res.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "コメントを修正しました",
          showConfirmButton: false,
          timer: 1000,
        });
      }
      window.location.replace(`/viewpost/${postId}`);
    }
  };

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
              <div>
                <img src={BUCKET_URL + boardDetail.image} alt="" />
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
                  {user?.id === boardDetail.writer ? (
                    <>
                      <NavLink
                        to={`/updateproductinquiry/${id}`}
                        className="flex ml-auto text-white bg-red-300 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                      >
                        修正
                      </NavLink>
                      <a
                        onClick={deletePost}
                        className="flex ml-2 text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                      >
                        削除
                      </a>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 댓글 쓰기 */}
      {user ? (
        <div className="flex mx-auto items-center justify-center shadow-lg mb-4 max-w-lg">
          <form className="w-full max-w-xl bg-white rounded-lg px-4 pt-2">
            <div className="flex flex-wrap -mx-3 mb-6">
              <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">
                コメント作成
              </h2>
              <div className="w-full md:w-full px-3 mb-2 mt-2">
                <textarea
                  className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                  name="body"
                  placeholder="コメントを記入してください"
                  required
                  onChange={(event) => setComment(event.target.value)}
                ></textarea>
              </div>
              <div className="w-full md:w-full flex items-start px-3">
                <div className="-mr-1">
                  <input
                    type="submit"
                    className="bg-red-300 text-white font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-red-200"
                    value="作成"
                    onClick={writeComment}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : null}
      {/* 댓글 */}
      {allComment.map((comments: Comment) => {
        return (
          <div
            key={comments.id}
            className="flex justify-center relative top-1/3"
          >
            <div className="relative grid grid-cols-1 gap-4 p-4 mb-8 border rounded-lg bg-white shadow-lg w-full max-w-xl">
              <div className="relative flex gap-4">
                <div className="flex flex-col w-full">
                  <div className="flex flex-row justify-between">
                    <p className="relative text-xl whitespace-nowrap truncate overflow-hidden">
                      {comments.content}
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
              <p className="-mt-4 text-gray-500">作成者表示</p>
              <div>
                {user?.id === comments.writer ? (
                  <>
                    <button
                      className="text-white bg-blue-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-blue-600"
                      onClick={() => {
                        updateComment(comments.id);
                      }}
                    >
                      修正
                    </button>
                    <button
                      className="text-white bg-red-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-red-600"
                      onClick={() => {
                        deleteComment(comments.id);
                      }}
                    >
                      削除
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ViewPostScreen;
