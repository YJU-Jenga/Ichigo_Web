import React, { SyntheticEvent, useEffect, useState } from "react";
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
      const token = getCookie("access-token");
      const res = await axios.delete(url_delete, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  const writeComment = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      const writeCommentUrl = `${API_URL}/comment/write`;
      const token = getCookie("access-token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const body = {
        writer: user!.id,
        postId: postId,
        content: comment,
      };
      console.log(body);
      const res = await axios.post(writeCommentUrl, body, { headers });
      console.log(res.status);
      if (res.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "コメントが作成されました",
          showConfirmButton: false,
          timer: 1000,
        });
        window.location.reload();
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
        window.location.reload();
      }
    }
  };

  // 댓글 삭제 함수
  const deleteComment = async (id: number) => {
    const deleteUrl = `${API_URL}/comment/delete/${id}`;
    try {
      const token = getCookie("access-token");
      const res = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const token = getCookie("access-token");
      const res = await axios.patch(
        updateCommentUrl,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } // config (3rd argument)
      );
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
      <section className="bg-gray-50  p-3 sm:p-5 h-max">
        {/* <div className="grid place-items-center"> */}
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
          <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden p-3">
            <h1 className="text-gray-900 text-3xl title-font font-bold mb-1 ml-3 underline decoration-red-300">
              Q & A
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 w-full">
              {/* <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0 "></div> */}
              <div className="py-4 bg-white rounded-lg my-10 w-full">
                <div className="flex items-center justify-center w-full">
                  <div className="rounded-xl border p-5 shadow-md w-9/12 bg-white">
                    <div className="flex w-full items-center justify-between border-b pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl font-bold text-slate-700 font-Line-bd">
                          {boardDetail.title}
                        </div>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className=" text-neutral-500">
                          {boardDetail.user.name}
                        </div>
                        <div className=" text-neutral-500">
                          {boardDetail.createdAt.substring(0, 10)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 mb-6">
                      {/* <div className="mb-3 text-xl font-bold">{boardDetail.title}</div> */}
                      <div className="text-lg text-neutral-600">
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
                            <div className="my-12 h-0.5 border-t-0 bg-gray-100 opacity-100 dark:opacity-50"></div>
                            <h1 className="font-Line-rg text-sm">
                              コメント&nbsp;
                            </h1>
                            <span className="text-sm">{allComment.length}</span>
                          </div>
                          <div className="flex cursor-pointer items-center transition hover:text-slate-600">
                            <h1 className="font-Line-rg text-sm">HITS&nbsp;</h1>
                            <span className="text-sm"> {boardDetail.hit}</span>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          {user?.id === boardDetail.writer ? (
                            <>
                              <NavLink
                                to={`/updateproductinquiry/${id}`}
                                className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
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
            </div>
            <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-300 to-transparent opacity-25 dark:opacity-100" />
            <h1 className="text-xl font-Line-bd mb-4 grid place-items-center">
              コメント
            </h1>
            <div className="grid place-items-center">
              <div className="w-3/4 bg-gray-100 rounded-lg border p-4">
                {/* 댓글 쓰기 */}
                {user ? (
                  <div className="flex mx-auto items-center justify-center shadow-lg mb-4 max-w-lg">
                    <div className="w-full max-w-xl border bg-white rounded-lg px-4 pt-2">
                      <div className=" flex flex-wrap -mx-3 mb-6">
                        <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg font-Line-bd">
                          コメント作成
                        </h2>
                        <div className="w-full md:w-full px-3 mb-2 mt-2">
                          <textarea
                            className="font-Line-rg bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                            name="body"
                            placeholder="コメントを記入してください"
                            required
                            onChange={(event) => setComment(event.target.value)}
                          ></textarea>
                        </div>
                        <div className="w-full md:w-full flex items-end px-3">
                          <div className="-mr-1">
                            <input
                              type="submit"
                              className="bg-red-300 font-Line-bd text-white font-medium py-1 px-4 rounded-lg tracking-wide mr-1 hover:bg-red-200"
                              value="作成"
                              onClick={writeComment}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {/* 댓글 */}
                {allComment.map((comments: Comment) => {
                  return (
                    <>
                      <div className="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto mt-6 max-w-md md:max-w-2xl border">
                        <div className="flex items-start px-4 py-6 w-full">
                          <div className="w-full">
                            <div className="flex items-center justify-between">
                              <h2 className="text-lg font-Line-bd text-gray-900 -mt-1">
                                {comments.content}
                              </h2>
                              <small className="text-sm text-gray-700">
                                {comments.createdAt.substring(0, 10)}
                              </small>
                            </div>
                            <p className="mt-3 text-gray-700 text-sm font-Line-rg">
                              {comments.user.name}{" "}
                            </p>
                            <div className="mt-4 flex items-center">
                              <div className="flex text-gray-700 text-sm mr-3">
                                {user?.id === comments.writer ? (
                                  <>
                                    <button
                                      className="text-white bg-red-300 font-medium py-1 px-4 rounded-lg tracking-wide mr-1 hover:bg-red-200"
                                      onClick={() => {
                                        updateComment(comments.id);
                                      }}
                                    >
                                      修正
                                    </button>
                                    <button
                                      className="text-white bg-red-500 font-medium py-1 px-4 rounded-lg tracking-wide mr-1 hover:bg-red-400"
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
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewPostScreen;
