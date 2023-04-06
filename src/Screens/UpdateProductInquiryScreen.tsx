import React, { useState, SyntheticEvent } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { NavLink, redirect, useNavigate, useParams } from "react-router-dom";

export default function UpdatePostScreen() {
  // 전송할 form데이터
  const [form, setForm] = useState({
    writer: 1,
    title: "",
    password: "",
    secret: false,
    content: "",
  });

  let { id } = useParams();
  console.log(id);

  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // url 따로 변수로 관리
  const url = `http://localhost:5000/post/update/${id}`;
  // 전송할 부분 따로 변수로 관리
  const body = new FormData();

  if (file !== null) {
    body.append("file", file);
  }

  body.append("writer", JSON.stringify({ writer: form.writer }));
  body.append("title", JSON.stringify({ title: form.title }));
  body.append("secret", JSON.stringify({ secret: form.secret }));
  body.append("password", JSON.stringify({ password: form.password }));
  body.append("content", JSON.stringify({ content: form.content }));

  // const body = {
  //   writer: form.writer,
  //   title: form.title,
  //   password: form.password,
  //   secret: form.secret,
  //   content: form.content,
  // };

  // 폼 전송 함수
  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (form.secret) {
      if (form.password.length != 4) {
        Swal.fire({
          icon: "error",
          title: "비밀번호를 양식에 맞게 입력해주세요.",
          text: "숫자 4글자",
          showConfirmButton: false,
          timer: 1000,
        });

        return;
      }
    }

    const headers = { "Content-Type": "application/json" };
    try {
      const res = await axios.patch(url, body, { headers });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "상품문의 수정이 완료되었습니다.",
        showConfirmButton: false,
        timer: 1000,
      });
      navigate("/productinquiry");
      if (res.status === 201) {
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

  return (
    <form onSubmit={submit}>
      <div className="min-h-screen md:px-20 pt-6 border">
        <div className=" bg-white rounded-md px-6 py-10 max-w-2xl mx-auto">
          <h1 className="text-center text-2xl font-bold text-gray-500 mb-10">
            상품문의 수정
          </h1>
          <div className="space-y-4">
            <div>
              <label className="text-lx">제목</label>
              <input
                type="text"
                placeholder="제목"
                id="title"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">글</label>
              <textarea
                id="content"
                placeholder="이곳에 작성해주세요"
                className="w-full border-2 p-4 text-gray-600 outline-none rounded-md"
                onChange={(event) =>
                  setForm({ ...form, content: event.target.value })
                }
              ></textarea>
            </div>
            <div>
              <label className="text-lx">파일:</label>
              <input
                type="file"
                id="file"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const target = event.currentTarget;
                  const files = (target.files as FileList)[0];

                  if (files === undefined) {
                    return;
                  }

                  setFile(files);
                }}
              />
            </div>
            <div>
              비밀글
              <input
                type="checkbox"
                onChange={(event) => {
                  setForm({ ...form, secret: event.target.checked });
                }}
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호"
                id="password"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
              />
            </div>
            <button className=" px-6 py-2 mx-auto block rounded-md text-lg font-semibold text-indigo-100 bg-indigo-600  ">
              글 쓰기
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
